"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GlassCard from "@/components/ui/GlassCard";
import GlowButton from "@/components/ui/GlowButton";
import { ArrowLeft, User, Lock, Mail } from "lucide-react";
import { toast } from "react-hot-toast";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (email && password) {
            toast.success("Welcome back to Lenzify Elite!");
            router.push("/dashboard");
        } else {
            toast.error("Please enter valid credentials.");
        }
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center px-6 relative overflow-hidden">
            {/* Background Decorative Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-electric/10 blur-[120px] rounded-full -z-10" />

            <GlassCard className="w-full max-w-md p-10 border-brand-electric/20 shadow-2xl shadow-brand-electric/5">
                <div className="text-center mb-10">
                    <Link href="/" className="inline-block mb-8">
                        <User size={48} className="text-brand-electric mx-auto mb-4" />
                    </Link>
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-glow">Identity Access</h1>
                    <p className="text-brand-text-muted text-xs font-bold tracking-widest uppercase mt-2">Lenzify Elite Protocol</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                        <input
                            type="email"
                            placeholder="EMAIL ADDRESS"
                            className="glass-input pl-12"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                        <input
                            type="password"
                            placeholder="PASSWORD"
                            className="glass-input pl-12"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest px-1">
                        <label className="flex items-center gap-2 cursor-pointer text-brand-text-muted hover:text-white">
                            <input type="checkbox" className="w-3 h-3 rounded bg-white/5 border-white/10 accent-brand-electric" />
                            Remember Me
                        </label>
                        <Link href="#" className="text-brand-cyan hover:text-white smooth-transition">Forgot Access?</Link>
                    </div>

                    <GlowButton className="w-full mt-4">Initialize Session</GlowButton>
                </form>

                <div className="mt-10 pt-8 border-t border-white/5 text-center">
                    <p className="text-xs text-brand-text-muted uppercase tracking-widest">
                        New to the vision? <Link href="/auth/signup" className="text-brand-electric font-bold hover:text-brand-cyan smooth-transition">Join Elite</Link>
                    </p>
                </div>
            </GlassCard>

            <button onClick={() => router.push("/")} className="absolute bottom-10 flex items-center gap-2 text-brand-text-muted hover:text-white smooth-transition uppercase text-[10px] font-bold tracking-[0.3em]">
                <ArrowLeft size={14} /> Orbital Defense Mainframe
            </button>

            <style jsx global>{`
        .glass-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1rem 1.25rem;
          color: white;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          outline: none;
          transition: all 0.3s ease;
        }
        .glass-input:focus {
          border-color: #2F8CFF;
          background: rgba(255, 255, 255, 0.06);
          box-shadow: 0 0 15px rgba(47, 140, 255, 0.2);
        }
      `}</style>
        </div>
    );
}
