'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    redirectTo: (formData.get('redirectTo') as string) || '/',
  }

  if (!data.email || !data.password) {
    return { error: 'Please enter both email and password.' }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')

  // If the admin email is used in the general login, redirect to dashboard
  if (data.email.toLowerCase() === 'lenzify.in@gmail.com') {
    redirect('/admin/dashboard')
  }

  redirect(data.redirectTo)
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const adminClient = await createAdminClient()
  
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    name: formData.get('name') as string,
    redirectTo: (formData.get('redirectTo') as string) || '/',
  }

  if (!data.email || !data.password || !data.name) {
    return { error: 'All fields are required.' }
  }

  // 1. Create user via Admin Client
  const { data: userData, error: createError } = await adminClient.auth.admin.createUser({
    email: data.email,
    password: data.password,
    email_confirm: true,
    user_metadata: { name: data.name }
  })

  if (createError) {
    if (createError.message.includes("already registered")) {
        return { error: "This email is already associated with an account. Please sign in." }
    }
    return { error: createError.message }
  }

  // 2. Immediate Login
  const { error: loginError } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password
  })

  if (loginError) {
    return { error: `Account created, but login synchronization failed: ${loginError.message}` }
  }

  // Use revalidatePath sparingly - only for the root to update the header
  revalidatePath('/', 'layout')
  redirect(data.redirectTo)
}

export async function adminLogin(formData: FormData): Promise<void> {
  const supabase = await createClient()
  
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  if (!data.email || !data.password) {
    redirect(`/admin/login?error=${encodeURIComponent('Identity and matrix are required.')}`)
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect(`/admin/login?error=${encodeURIComponent(error.message)}`)
  }

  // Strict check for admin credentials
  if (data.email.toLowerCase() !== 'lenzify.in@gmail.com') {
    await supabase.auth.signOut()
    redirect(`/admin/login?error=${encodeURIComponent('Non-administrative identity detected. Access denied.')}`)
  }

  revalidatePath('/', 'layout')
  redirect('/admin/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
