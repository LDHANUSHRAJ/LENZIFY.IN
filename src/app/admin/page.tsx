import { redirect } from 'next/navigation'

export default function AdminPage() {
  // Redirect to the tactical overview terminal
  redirect('/admin/dashboard')
}
