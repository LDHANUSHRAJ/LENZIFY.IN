import { adminLogin } from '../auth/actions'
import { ArrowRight, ShieldAlert } from 'lucide-react'

interface Props {
  searchParams: Promise<{ error?: string }>
}

export default async function AdminLoginPage({ searchParams }: Props) {
  const params = await searchParams
  const error = params?.error

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-surface font-sans">
      <div className="w-full max-w-[400px] p-10 bg-white border border-brand-navy/10 rounded-sm shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-brand-navy/5 text-brand-navy rounded-full">
            <ShieldAlert size={24} />
          </div>
        </div>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-display font-bold uppercase tracking-widest text-brand-navy mb-2">Admin Portal</h1>
          <p className="text-brand-text-muted text-xs uppercase tracking-widest">Authorized Personnel Only</p>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs font-semibold text-center">
            {decodeURIComponent(error)}
          </div>
        )}

        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-brand-navy tracking-wider" htmlFor="email">Admin Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="admin@lenzify.in"
              className="w-full bg-brand-background border border-brand-navy/10 rounded-none px-4 py-3 text-brand-text-primary placeholder-brand-text-muted/50 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
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
              className="w-full bg-brand-background border border-brand-navy/10 rounded-none px-4 py-3 text-brand-text-primary placeholder-brand-text-muted/50 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
            />
          </div>

          <div className="pt-4">
            <button formAction={adminLogin} className="w-full group relative flex items-center justify-center gap-2 bg-brand-navy text-white px-6 py-4 uppercase text-sm font-semibold tracking-wider hover:bg-brand-gold transition-colors">
              <span>Secure Login</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
