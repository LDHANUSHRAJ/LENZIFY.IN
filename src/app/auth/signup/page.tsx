import Link from 'next/link'
import { signup } from '../actions'
import { ArrowRight } from 'lucide-react'

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-background font-sans">
      <div className="w-full max-w-[400px] p-10 bg-brand-surface rounded-sm shadow-xl border border-brand-navy/5">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-display font-medium text-brand-navy mb-2 tracking-tight">Create Account</h1>
          <p className="text-brand-text-muted text-sm">Join Lenzify for a premium experience</p>
        </div>

        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-brand-navy tracking-wider" htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Enter your name"
              className="w-full bg-white border border-brand-text-muted/30 rounded-none px-4 py-3 text-brand-text-primary placeholder-brand-text-muted/50 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-brand-navy tracking-wider" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Enter your email"
              className="w-full bg-white border border-brand-text-muted/30 rounded-none px-4 py-3 text-brand-text-primary placeholder-brand-text-muted/50 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-brand-navy tracking-wider" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full bg-white border border-brand-text-muted/30 rounded-none px-4 py-3 text-brand-text-primary placeholder-brand-text-muted/50 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
            />
          </div>

          <div className="pt-4 flex flex-col gap-4">
            <button formAction={signup} className="w-full group relative flex items-center justify-center gap-2 bg-brand-navy text-brand-surface px-6 py-4 uppercase text-sm font-semibold tracking-wider hover:bg-brand-navy-light transition-colors">
              <span>Register</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="text-center mt-4">
              <span className="text-brand-text-muted text-sm">Already have an account? </span>
              <Link href="/auth/login" className="text-brand-gold text-sm font-medium hover:underline">Sign In</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
