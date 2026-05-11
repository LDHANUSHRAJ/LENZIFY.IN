"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { validateEmail } from "@/lib/validation";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    if (emailError) {
      toast.error(emailError);
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    setLoading(false);

    if (error) {
      toast.error("Failed to send reset email. Please try again.");
      return;
    }

    setSent(true);
    toast.success("Password reset email sent!");
  };

  return (
    <div className="bg-surface min-h-screen flex items-center justify-center px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-10"
      >
        <Link
          href="/auth/login"
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-on-surface/40 hover:text-primary transition-colors"
        >
          <ArrowLeft size={14} /> Back to Login
        </Link>

        {sent ? (
          <div className="text-center space-y-8">
            <div className="w-20 h-20 bg-emerald-500 rounded-full mx-auto flex items-center justify-center text-white">
              <CheckCircle2 size={40} />
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-serif italic text-primary tracking-tight">
                Check your email
              </h1>
              <p className="text-sm text-on-surface/50 leading-relaxed">
                We&apos;ve sent a password reset link to <strong>{email}</strong>. 
                Please check your inbox and follow the instructions.
              </p>
            </div>
            <Link
              href="/auth/login"
              className="inline-block px-8 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-secondary hover:text-primary transition-all"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <h1 className="text-4xl font-serif italic text-primary tracking-tight">
                Forgot <span className="text-secondary">Password?</span>
              </h1>
              <p className="text-sm text-on-surface/50 leading-relaxed">
                Enter your email address and we&apos;ll send you a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">
                  Email Address
                </label>
                <div className="flex items-center gap-3 border-b border-outline/20 py-3">
                  <Mail size={18} className="text-on-surface/20" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="flex-1 bg-transparent text-sm font-bold text-primary tracking-wide focus:outline-none placeholder:text-on-surface/20"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-primary text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-secondary hover:text-primary transition-all disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
