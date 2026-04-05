'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData): Promise<void> {
  const supabase = createClient()

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
    redirect(`/auth/login?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/', 'layout')

  if (data.email === 'lenzify.in@gmail.com') {
    redirect('/admin/dashboard')
  }

  redirect(data.redirectTo)
}

export async function signup(formData: FormData): Promise<void> {
  const supabase = createClient()
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
    redirect(`/auth/signup?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/', 'layout')
  redirect(data.redirectTo)
}

export async function adminLogin(formData: FormData): Promise<void> {
  const supabase = createClient()
  
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
  const supabase = createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
