"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { validatePassword } from "@/lib/validation";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const passwordError = validatePassword(password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      toast.error("Failed to reset password. The link may have expired.");
      return;
    }

    setDone(true);
    toast.success("Password updated successfully!");
    setTimeout(() => router.push("/auth/login"), 3000);
  };

  return (
    <div className="bg-surface min-h-screen flex items-center justify-center px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-10"
      >
        {done ? (
          <div className="text-center space-y-8">
            <div className="w-20 h-20 bg-emerald-500 rounded-full mx-auto flex items-center justify-center text-white">
              <CheckCircle2 size={40} />
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-serif italic text-primary tracking-tight">
                Password Reset!
              </h1>
              <p className="text-sm text-on-surface/50 leading-relaxed">
                Your password has been updated. Redirecting you to login...
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <h1 className="text-4xl font-serif italic text-primary tracking-tight">
                Set New <span className="text-secondary">Password</span>
              </h1>
              <p className="text-sm text-on-surface/50 leading-relaxed">
                Enter your new password below. Must be at least 6 characters.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">
                  New Password
                </label>
                <div className="flex items-center gap-3 border-b border-outline/20 py-3">
                  <Lock size={18} className="text-on-surface/20" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="flex-1 bg-transparent text-sm font-bold text-primary tracking-wide focus:outline-none placeholder:text-on-surface/20"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">
                  Confirm Password
                </label>
                <div className="flex items-center gap-3 border-b border-outline/20 py-3">
                  <Lock size={18} className="text-on-surface/20" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="flex-1 bg-transparent text-sm font-bold text-primary tracking-wide focus:outline-none placeholder:text-on-surface/20"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-primary text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-secondary hover:text-primary transition-all disabled:opacity-50"
              >
                {loading ? "Updating..." : "Reset Password"}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
