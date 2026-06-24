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
      <main className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
         {/* Background Elements */}
         <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-gold/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-navy/5 rounded-full blur-[120px]" />
         </div>

         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-white border border-slate-200 rounded-[32px] p-8 md:p-12 shadow-2xl relative z-10"
         >
            <Link href="/auth/login" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-brand-navy transition-colors mb-8 group">
               <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
               Back to Login
            </Link>

            <AnimatePresence mode="wait">
               {step === 1 && (
                  <motion.div
                     key="step1"
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                  >
                     <div className="mb-8">
                        <h1 className="text-3xl font-black text-brand-navy uppercase tracking-tight mb-2">Forgot</h1>
                        <h2 className="text-xl font-bold text-slate-400 uppercase tracking-widest">Password?</h2>
                        <div className="w-12 h-1 bg-brand-gold mt-4" />
                     </div>

                     <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                        Enter your email address and we'll send you a professional verification code to reset your account credentials.
                     </p>

                     <form onSubmit={handleSendOTP} className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Email Identity</label>
                           <div className="relative">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                              <input 
                                 type="email" 
                                 required
                                 value={email}
                                 onChange={(e) => setEmail(e.target.value)}
                                 placeholder="NAME@DOMAIN.COM"
                                 className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-brand-navy focus:bg-white focus:border-brand-gold outline-none transition-all"
                              />
                           </div>
                        </div>

                        <button 
                           disabled={loading}
                           type="submit"
                           className="w-full bg-brand-navy text-white rounded-2xl py-5 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-secondary hover:text-brand-navy transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                           {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Request Access Code"}
                           {!loading && <ArrowRight className="w-4 h-4" />}
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
                  >
                     <div className="mb-8">
                        <div className="w-12 h-12 bg-brand-gold/10 rounded-2xl flex items-center justify-center mb-6">
                           <ShieldCheck className="w-6 h-6 text-brand-gold" />
                        </div>
                        <h1 className="text-3xl font-black text-brand-navy uppercase tracking-tight mb-2">Verify</h1>
                        <h2 className="text-xl font-bold text-slate-400 uppercase tracking-widest">Identity</h2>
                     </div>

                     <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                        A 6-digit verification code has been dispatched to <span className="text-brand-navy font-bold">{email}</span>. Please enter it below.
                     </p>

                     <form onSubmit={handleVerifyOTP} className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Verification Code</label>
                           <input 
                              type="text" 
                              required
                              maxLength={6}
                              value={otp}
                              onChange={(e) => setOtp(e.target.value)}
                              placeholder="XXXXXX"
                              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-6 text-center text-3xl font-black tracking-[0.5em] text-brand-navy focus:bg-white focus:border-brand-gold outline-none transition-all"
                           />
                        </div>

                        <button 
                           disabled={loading}
                           type="submit"
                           className="w-full bg-brand-navy text-white rounded-2xl py-5 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-secondary hover:text-brand-navy transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                           {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify Identity"}
                        </button>

                        <button 
                           type="button"
                           onClick={() => setStep(1)}
                           className="w-full text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-brand-gold transition-colors"
                        >
                           Resend Code or Change Email
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
                  >
                     <div className="mb-8">
                        <div className="w-12 h-12 bg-brand-navy/10 rounded-2xl flex items-center justify-center mb-6">
                           <KeyRound className="w-6 h-6 text-brand-navy" />
                        </div>
                        <h1 className="text-3xl font-black text-brand-navy uppercase tracking-tight mb-2">Reset</h1>
                        <h2 className="text-xl font-bold text-slate-400 uppercase tracking-widest">Credentials</h2>
                     </div>

                     <form onSubmit={handleResetPassword} className="space-y-6">
                        <div className="space-y-4">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">New Secure Password</label>
                              <input 
                                 type="password" 
                                 required
                                 value={newPassword}
                                 onChange={(e) => setNewPassword(e.target.value)}
                                 placeholder="••••••••"
                                 className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-4 text-sm font-bold text-brand-navy focus:bg-white focus:border-brand-gold outline-none transition-all"
                              />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Confirm Identity Key</label>
                              <input 
                                 type="password" 
                                 required
                                 value={confirmPassword}
                                 onChange={(e) => setConfirmPassword(e.target.value)}
                                 placeholder="••••••••"
                                 className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-4 text-sm font-bold text-brand-navy focus:bg-white focus:border-brand-gold outline-none transition-all"
                              />
                           </div>
                        </div>

                        <button 
                           disabled={loading}
                           type="submit"
                           className="w-full bg-brand-navy text-white rounded-2xl py-5 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-secondary hover:text-brand-navy transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                           {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Credentials"}
                        </button>
                     </form>
                  </motion.div>
               )}

               {step === 4 && (
                  <motion.div
                     key="step4"
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     className="text-center py-8"
                  >
                     <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                     </div>
                     <h1 className="text-3xl font-black text-brand-navy uppercase tracking-tight mb-2">Success</h1>
                     <p className="text-sm text-slate-500 mb-12 leading-relaxed">
                        Your security credentials have been updated successfully. You may now proceed to access your archive.
                     </p>
                     <Link 
                        href="/auth/login"
                        className="inline-block w-full bg-brand-navy text-white rounded-2xl py-5 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-secondary hover:text-brand-navy transition-all shadow-xl"
                     >
                        Enter Archive
                     </Link>
                  </motion.div>
               )}
            </AnimatePresence>
         </motion.div>

         <div className="mt-8 relative z-10">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
               Lenzify.in <span className="mx-2 text-slate-200">|</span> Encrypted Verification System
            </p>
         </div>
      </main>
   );
}
