"use client";

import { Suspense } from "react";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { login } from "../actions";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-surface text-primary font-bold italic tracking-widest text-[10px] uppercase">Initializing secure channel...</div>}>
      <LoginForm fallbackError={error} initialLoading={loading} />
    </Suspense>
  )
}

function LoginForm({ fallbackError, initialLoading }: { fallbackError: string | null, initialLoading: boolean }) {
  const [error, setError] = useState<string | null>(fallbackError);
  const [loading, setLoading] = useState(initialLoading);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: "easeOut" } as any
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 relative overflow-hidden">
      {/* Editorial Accents */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-surface-container-low/50 -skew-x-12 transform origin-top translate-x-1/2"></div>
      
      <motion.div 
        {...fadeInUp}
        className="w-full max-w-[520px] z-10"
      >
        <div className="bg-white p-12 md:p-20 editorial-shadow rounded-sm border border-outline/10 space-y-12 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>
           
           <header className="space-y-6 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="inline-block px-5 py-2 mb-2 rounded-full border border-secondary/20 text-secondary text-[10px] font-bold tracking-[0.4em] uppercase italic"
            >
              Verified Access Protocol
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-serif italic text-primary leading-tight tracking-tight">
              Welcome <br/><span className="text-primary-container">Back</span>
            </h1>
            <p className="text-on-surface/40 font-medium tracking-wide italic text-sm">Re-initialize your visionary archive access.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-10">
            <input type="hidden" name="redirectTo" value={redirectTo} />
            
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface/40">Email Identifier</label>
              </div>
              <input
                name="email"
                type="email"
                required
                placeholder="YOUR@IDENTITY.COM"
                className="w-full bg-transparent border-b border-outline/20 py-4 text-sm text-primary font-bold tracking-widest focus:border-primary outline-none transition-all placeholder:text-on-surface/20"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface/40">Security Matrix</label>
                <Link href="#" className="text-[9px] font-bold uppercase tracking-widest text-secondary hover:text-primary transition-colors italic">Recovery</Link>
              </div>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-transparent border-b border-outline/20 py-4 text-sm text-primary font-bold tracking-widest focus:border-primary outline-none transition-all placeholder:text-on-surface/20"
              />
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-secondary text-[10px] font-bold text-center mt-4 uppercase tracking-[0.2em] italic bg-secondary/5 py-4 border border-secondary/10"
              >
                Verification Failed: {error}
              </motion.p>
            )}

            <button
              disabled={loading}
              className={cn(
                "w-full bg-primary text-white py-6 rounded-lg font-bold text-[10px] uppercase tracking-[0.4em] transition-all duration-500 hover:opacity-80 active:scale-[0.98] mt-4 relative overflow-hidden group",
                loading && "opacity-70 cursor-not-allowed"
              )}
            >
              <span className="relative z-10">{loading ? "SYNCHRONIZING..." : "AUTHORIZE ACCESS"}</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            </button>
          </form>

          <footer className="text-center pt-8 border-t border-outline/10">
            <p className="text-on-surface/40 text-[10px] font-bold uppercase tracking-widest">
              New to the Archive?{" "}
              <Link href={`/auth/signup?redirect=${encodeURIComponent(redirectTo)}`} className="text-secondary hover:text-primary transition-colors ml-2 underline underline-offset-4 decoration-secondary/30">
                Register Identity
              </Link>
            </p>
          </footer>
        </div>
      </motion.div>
    </div>
  );
}
