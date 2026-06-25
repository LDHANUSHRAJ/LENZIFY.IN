"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mail, ShieldCheck, KeyRound, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { sendPasswordResetOTP, verifyOTP, resetPassword } from './actions';
import { toast } from 'react-hot-toast';

export default function ForgotPasswordPage() {
   const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
   const [email, setEmail] = useState("");
   const [otp, setOtp] = useState("");
   const [newPassword, setNewPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const [loading, setLoading] = useState(false);

   const handleSendOTP = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      try {
         const res = await sendPasswordResetOTP(email);
         if (res.success) {
            toast.success("Verification code sent to your email");
            setStep(2);
         } else {
            toast.error(res.error || "Failed to send OTP");
         }
      } catch (err) {
         toast.error("An unexpected error occurred");
      } finally {
         setLoading(false);
      }
   };

   const handleVerifyOTP = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      try {
         const res = await verifyOTP(email, otp);
         if (res.success) {
            setStep(3);
         } else {
            toast.error(res.error || "Invalid OTP");
         }
      } catch (err) {
         toast.error("Verification failed");
      } finally {
         setLoading(false);
      }
   };

   const handleResetPassword = async (e: React.FormEvent) => {
      e.preventDefault();
      if (newPassword !== confirmPassword) {
         toast.error("Passwords do not match");
         return;
      }
      if (newPassword.length < 6) {
         toast.error("Password must be at least 6 characters");
         return;
      }
      setLoading(true);
      try {
         const res = await resetPassword(email, otp, newPassword);
         if (res.success) {
            setStep(4);
         } else {
            toast.error(res.error || "Reset failed");
         }
      } catch (err) {
         toast.error("An error occurred during reset");
      } finally {
         setLoading(false);
      }
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
            <Link href="/auth/login" className="inline-flex items-center gap-2 text-xs font-medium text-[#666666] hover:text-[#004AAD] transition-colors mb-8 group">
               <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
               Back to login
            </Link>

            <AnimatePresence mode="wait">
               {step === 1 && (
                  <motion.div
                     key="step1"
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     transition={{ duration: 0.3 }}
                  >
                     <div className="mb-8 space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-widest text-[#004AAD]">Password recovery</p>
                        <h1 className="text-3xl font-[var(--font-hero)] italic text-[#111111]">Forgot your password?</h1>
                        <p className="text-sm text-[#666666] leading-relaxed pt-1">
                           Enter your email address and we'll send you a verification code to reset your password.
                        </p>
                     </div>

                     <form onSubmit={handleSendOTP} className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-[#111111] text-sm font-medium block">Email address</label>
                           <div className="relative">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666]" />
                              <input
                                 type="email"
                                 required
                                 value={email}
                                 onChange={(e) => setEmail(e.target.value)}
                                 placeholder="your@email.com"
                                 className="bg-[#F8F9FC] border border-[#E8EAF2] rounded-xl py-3 pl-12 pr-4 text-sm text-[#111111] focus:border-[#004AAD] focus:ring-2 focus:ring-[#004AAD]/10 outline-none transition-all w-full placeholder:text-[#999999]"
                              />
                           </div>
                        </div>

                        <button
                           disabled={loading}
                           type="submit"
                           className="w-full bg-[#03173D] text-white rounded-full py-4 font-semibold hover:bg-gradient-to-r hover:from-[#03173D] hover:to-[#004AAD] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                           {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Send verification code <ArrowRight className="w-4 h-4" /></>}
                        </button>
                     </form>
                  </motion.div>
               )}

               {step === 2 && (
                  <motion.div
                     key="step2"
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     transition={{ duration: 0.3 }}
                  >
                     <div className="mb-8 space-y-2">
                        <div className="w-12 h-12 bg-[#004AAD]/10 rounded-2xl flex items-center justify-center mb-6">
                           <ShieldCheck className="w-6 h-6 text-[#004AAD]" />
                        </div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-[#004AAD]">Verification</p>
                        <h1 className="text-3xl font-[var(--font-hero)] italic text-[#111111]">Enter your code</h1>
                        <p className="text-sm text-[#666666] leading-relaxed pt-1">
                           A 6-digit code was sent to <span className="text-[#111111] font-medium">{email}</span>.
                        </p>
                     </div>

                     <form onSubmit={handleVerifyOTP} className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-[#111111] text-sm font-medium block">Verification code</label>
                           <input
                              type="text"
                              required
                              maxLength={6}
                              value={otp}
                              onChange={(e) => setOtp(e.target.value)}
                              placeholder="000000"
                              className="bg-[#F8F9FC] border border-[#E8EAF2] rounded-xl py-5 text-center text-3xl font-bold tracking-[0.5em] text-[#111111] focus:border-[#004AAD] focus:ring-2 focus:ring-[#004AAD]/10 outline-none transition-all w-full placeholder:text-[#CCCCCC]"
                           />
                        </div>

                        <button
                           disabled={loading}
                           type="submit"
                           className="w-full bg-[#03173D] text-white rounded-full py-4 font-semibold hover:bg-gradient-to-r hover:from-[#03173D] hover:to-[#004AAD] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                           {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify code"}
                        </button>

                        <button
                           type="button"
                           onClick={() => setStep(1)}
                           className="w-full text-sm text-[#666666] hover:text-[#004AAD] transition-colors"
                        >
                           Resend code or change email
                        </button>
                     </form>
                  </motion.div>
               )}

               {step === 3 && (
                  <motion.div
                     key="step3"
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     transition={{ duration: 0.3 }}
                  >
                     <div className="mb-8 space-y-2">
                        <div className="w-12 h-12 bg-[#03173D]/10 rounded-2xl flex items-center justify-center mb-6">
                           <KeyRound className="w-6 h-6 text-[#03173D]" />
                        </div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-[#004AAD]">New password</p>
                        <h1 className="text-3xl font-[var(--font-hero)] italic text-[#111111]">Reset your password</h1>
                     </div>

                     <form onSubmit={handleResetPassword} className="space-y-6">
                        <div className="space-y-4">
                           <div className="space-y-2">
                              <label className="text-[#111111] text-sm font-medium block">New password</label>
                              <input
                                 type="password"
                                 required
                                 value={newPassword}
                                 onChange={(e) => setNewPassword(e.target.value)}
                                 placeholder="••••••••"
                                 className="bg-[#F8F9FC] border border-[#E8EAF2] rounded-xl py-3 px-4 text-sm text-[#111111] focus:border-[#004AAD] focus:ring-2 focus:ring-[#004AAD]/10 outline-none transition-all w-full placeholder:text-[#999999]"
                              />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[#111111] text-sm font-medium block">Confirm new password</label>
                              <input
                                 type="password"
                                 required
                                 value={confirmPassword}
                                 onChange={(e) => setConfirmPassword(e.target.value)}
                                 placeholder="••••••••"
                                 className="bg-[#F8F9FC] border border-[#E8EAF2] rounded-xl py-3 px-4 text-sm text-[#111111] focus:border-[#004AAD] focus:ring-2 focus:ring-[#004AAD]/10 outline-none transition-all w-full placeholder:text-[#999999]"
                              />
                           </div>
                        </div>

                        <button
                           disabled={loading}
                           type="submit"
                           className="w-full bg-[#03173D] text-white rounded-full py-4 font-semibold hover:bg-gradient-to-r hover:from-[#03173D] hover:to-[#004AAD] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                           {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update password"}
                        </button>
                     </form>
                  </motion.div>
               )}

               {step === 4 && (
                  <motion.div
                     key="step4"
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ duration: 0.4 }}
                     className="text-center py-8"
                  >
                     <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                     </div>
                     <p className="text-xs font-semibold uppercase tracking-widest text-[#004AAD] mb-2">All done</p>
                     <h1 className="text-3xl font-[var(--font-hero)] italic text-[#111111] mb-4">Password updated!</h1>
                     <p className="text-sm text-[#666666] mb-10 leading-relaxed">
                        Your password has been updated successfully. You can now sign in with your new password.
                     </p>
                     <Link
                        href="/auth/login"
                        className="inline-block w-full bg-[#03173D] text-white rounded-full py-4 font-semibold hover:bg-gradient-to-r hover:from-[#03173D] hover:to-[#004AAD] transition-all duration-300 text-center"
                     >
                        Sign in
                     </Link>
                  </motion.div>
               )}
            </AnimatePresence>
         </motion.div>

         <div className="mt-8 relative z-10">
            <p className="text-xs text-[#666666] tracking-widest">
               Lenzify.in &nbsp;|&nbsp; Secure Verification
            </p>
         </div>
      </main>
   );
}
