"use client";

import { Suspense } from "react";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { signup } from "../actions";
import { cn } from "@/lib/utils";

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-surface text-primary font-bold italic tracking-widest text-[10px] uppercase">Initializing secure channel...</div>}>
      <SignupForm fallbackError={error} initialLoading={loading} />
    </Suspense>
  )
}

function SignupForm({ fallbackError, initialLoading }: { fallbackError: string | null, initialLoading: boolean }) {
  const [error, setError] = useState<string | null>(fallbackError);
  const [loading, setLoading] = useState(initialLoading);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await signup(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } as any
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 relative overflow-hidden">
      {/* Editorial Accents */}
      <div className="absolute top-0 left-0 w-1/3 h-full bg-surface-container-low/50 skew-x-12 transform origin-top -translate-x-1/2"></div>
      
      <motion.div 
        {...fadeInUp}
        className="w-full max-w-[540px] z-10"
      >
        <div className="bg-white p-12 md:p-20 editorial-shadow rounded-sm border border-outline/10 space-y-12 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1.5 bg-secondary"></div>
           
           <header className="space-y-6 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="inline-block px-5 py-2 mb-2 rounded-full border border-primary/20 text-primary text-[10px] font-bold tracking-[0.4em] uppercase italic"
            >
              Protocol Initiation
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-serif italic text-primary leading-tight tracking-tight">
              Join the <br/><span className="text-secondary">Archive</span>
            </h1>
            <p className="text-on-surface/40 font-medium tracking-wide italic text-sm">Form your unique visionary identity.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            <input type="hidden" name="redirectTo" value={redirectTo} />
            
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface/40 px-1">Legal Receiver Name</label>
              <input
                name="name"
                type="text"
                required
                placeholder="FULL IDENTITY"
                className="w-full bg-transparent border-b border-outline/20 py-4 text-sm text-primary font-bold tracking-widest focus:border-secondary outline-none transition-all placeholder:text-on-surface/20 uppercase"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface/40 px-1">Email Matrix</label>
              <input
                name="email"
                type="email"
                required
                placeholder="YOUR@IDENTITY.COM"
                className="w-full bg-transparent border-b border-outline/20 py-4 text-sm text-primary font-bold tracking-widest focus:border-secondary outline-none transition-all placeholder:text-on-surface/20"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface/40 px-1">Access Passphrase</label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-transparent border-b border-outline/20 py-4 text-sm text-primary font-bold tracking-widest focus:border-secondary outline-none transition-all placeholder:text-on-surface/20"
              />
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-secondary text-[10px] font-bold text-center mt-4 uppercase tracking-[0.2em] italic bg-secondary/5 py-4 border border-secondary/10"
              >
                Initiation Error: {error}
              </motion.p>
            )}

            <button
              disabled={loading}
              className={cn(
                "w-full bg-secondary text-white py-6 rounded-lg font-bold text-[10px] uppercase tracking-[0.4em] transition-all duration-500 hover:opacity-80 active:scale-[0.98] mt-4 relative overflow-hidden group",
                loading && "opacity-70 cursor-not-allowed"
              )}
            >
              <span className="relative z-10">{loading ? "SYNCHRONIZING..." : "INITIALIZE IDENTITY"}</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            </button>
          </form>

          <footer className="text-center pt-8 border-t border-outline/10">
            <p className="text-on-surface/40 text-[10px] font-bold uppercase tracking-widest">
              Existing Archival Access?{" "}
              <Link href={`/auth/login?redirect=${encodeURIComponent(redirectTo)}`} className="text-primary hover:text-secondary transition-colors ml-2 underline underline-offset-4 decoration-primary/30">
                Sign In
              </Link>
            </p>
          </footer>
        </div>
      </motion.div>
    </div>
  );
}
