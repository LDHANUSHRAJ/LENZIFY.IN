'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    redirectTo: (formData.get('redirectTo') as string) || '/',
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')

  if (data.email === 'lenzify.in@gmail.com') {
    redirect('/admin/dashboard')
  }

  redirect(data.redirectTo)
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    name: formData.get('name') as string,
    redirectTo: (formData.get('redirectTo') as string) || '/',
  }

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        name: data.name,
      }
    }
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect(data.redirectTo)
}

export async function adminLogin(formData: FormData): Promise<void> {
  const supabase = await createClient()
  
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect(`/admin?error=${encodeURIComponent(error.message)}`)
  }

  // Strict check for admin credentials
  if (data.email !== 'lenzify.in@gmail.com') {
    await supabase.auth.signOut()
    redirect(`/admin?error=${encodeURIComponent('Non-administrative identity detected. Access denied.')}`)
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
