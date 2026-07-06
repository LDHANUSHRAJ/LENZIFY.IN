'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { rateLimitAction } from '@/lib/rateLimit'

export async function login(formData: FormData) {
  if (await rateLimitAction('login', 10)) {
    return { error: 'Too many login attempts. Please wait a minute and try again.' }
  }

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

  const destination = data.email.toLowerCase() === 'lenzify.in@gmail.com'
    ? '/admin/dashboard'
    : data.redirectTo

  return { redirectTo: destination }
}

export async function signup(formData: FormData) {
  if (await rateLimitAction('signup', 5)) {
    return { error: 'Too many signup attempts. Please wait a minute and try again.' }
  }

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

  // Admin-facing notification: new customer signed up
  try {
    await adminClient.from('notifications').insert({
      user_id: null,
      title: 'New Customer',
      message: `${data.name} (${data.email}) just created an account.`,
      type: 'New Customer',
      metadata: { user_id: userData?.user?.id },
    })
  } catch {}

  // 2. Immediate Login
  const { error: loginError } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password
  })

  if (loginError) {
    return { error: `Account created, but login synchronization failed: ${loginError.message}` }
  }

  revalidatePath('/', 'layout')
  return { redirectTo: data.redirectTo }
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
