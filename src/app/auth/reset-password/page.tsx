"use client";

import { useState } from "react";
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
    <main className="min-h-screen bg-[#F8F9FC] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background blur shapes */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#004AAD]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#03173D]/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md bg-white rounded-3xl border border-[#ECECEC] shadow-[0_10px_30px_rgba(0,0,0,0.05)] p-10 relative z-10"
      >
        {done ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center py-8"
          >
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#004AAD] mb-2">All done</p>
            <h1 className="text-3xl font-[var(--font-hero)] italic text-[#111111] mb-4">
              Password reset!
            </h1>
            <p className="text-sm text-[#666666] leading-relaxed">
              Your password has been updated. Redirecting you to sign in...
            </p>
          </motion.div>
        ) : (
          <>
            <div className="mb-8 space-y-2">
              <div className="w-12 h-12 bg-[#03173D]/10 rounded-2xl flex items-center justify-center mb-6">
                <Lock className="w-6 h-6 text-[#03173D]" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#004AAD]">New password</p>
              <h1 className="text-3xl font-[var(--font-hero)] italic text-[#111111]">
                Set your new password
              </h1>
              <p className="text-sm text-[#666666] leading-relaxed pt-1">
                Enter your new password below. Must be at least 6 characters.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[#111111] text-sm font-medium block">
                  New password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-[#F8F9FC] border border-[#E8EAF2] rounded-xl px-4 py-3 text-sm text-[#111111] focus:border-[#004AAD] focus:ring-2 focus:ring-[#004AAD]/10 outline-none transition-all w-full placeholder:text-[#999999]"
                  required
                  minLength={6}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[#111111] text-sm font-medium block">
                  Confirm new password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-[#F8F9FC] border border-[#E8EAF2] rounded-xl px-4 py-3 text-sm text-[#111111] focus:border-[#004AAD] focus:ring-2 focus:ring-[#004AAD]/10 outline-none transition-all w-full placeholder:text-[#999999]"
                  required
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#03173D] text-white rounded-full py-4 font-semibold hover:bg-gradient-to-r hover:from-[#03173D] hover:to-[#004AAD] transition-all duration-300 disabled:opacity-50"
              >
                {loading ? "Updating..." : "Reset password"}
              </button>
            </form>
          </>
        )}
      </motion.div>

      <div className="mt-8 relative z-10">
        <p className="text-xs text-[#666666] tracking-widest">
          Lenzify.in &nbsp;|&nbsp; Secure Reset
        </p>
      </div>
    </main>
  );
}
