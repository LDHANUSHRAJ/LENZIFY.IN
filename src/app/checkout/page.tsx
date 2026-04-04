"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Shield, CreditCard, Truck, User, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import GlowButton from "@/components/ui/GlowButton";

const steps = [
    { id: "shipping", label: "Shipping", icon: Truck },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "confirm", label: "Confirm", icon: Check },
];

export default function CheckoutPage() {
    const [step, setStep] = useState(0);

    const nextStep = () => setStep((s) => Math.min(s + 1, steps.length - 1));
    const prevStep = () => setStep((s) => Math.max(s - 1, 0));

    return (
        <div className="min-h-screen bg-[#0B1C2D] pt-32 pb-20 px-8">
            <div className="max-w-4xl mx-auto">
                {/* Progress Tracker */}
                <div className="flex justify-between items-center mb-20 relative">
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5 -z-10" />
                    {steps.map((s, i) => (
                        <div key={s.id} className="flex flex-col items-center gap-4">
                            <motion.div
                                animate={{
                                    backgroundColor: step >= i ? "#2F8CFF" : "rgba(255,255,255,0.05)",
                                    borderColor: step >= i ? "#2F8CFF" : "rgba(255,255,255,0.1)",
                                }}
                                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center smooth-transition`}
                            >
                                <s.icon size={20} className={step >= i ? "text-white" : "text-white/20"} />
                            </motion.div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${step >= i ? "text-brand-electric" : "text-white/20"}`}>
                                {s.label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Form Container */}
                <div className="glass-morphism p-12 rounded-[40px] border-white/5 min-h-[500px] flex flex-col justify-between">
                    <AnimatePresence mode="wait">
                        {step === 0 && (
                            <motion.div
                                key="shipping"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <h2 className="text-3xl font-black italic uppercase italic tracking-tighter">Shipping Protocol</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Full Name</label>
                                        <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-electric smooth-transition font-medium" placeholder="E.G. LANDO NORRIS" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Neural Email</label>
                                        <input type="email" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-electric smooth-transition font-medium" placeholder="LANDO@MCLAREN.COM" />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Precision Address</label>
                                        <textarea className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-electric smooth-transition font-medium h-32" placeholder="ENTER COMPLETE COORDINATES" />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 1 && (
                            <motion.div
                                key="payment"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <h2 className="text-3xl font-black italic uppercase tracking-tighter">Payment Node</h2>
                                <div className="space-y-6">
                                    <div className="p-8 rounded-3xl bg-white/5 border border-brand-electric/30 flex items-center justify-between group cursor-pointer hover:bg-brand-electric/5 smooth-transition">
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 rounded-full bg-brand-electric/20 flex items-center justify-center text-brand-electric">
                                                <CreditCard size={24} />
                                            </div>
                                            <span className="text-lg font-black uppercase italic tracking-widest">Global Terminal</span>
                                        </div>
                                        <div className="w-6 h-6 rounded-full border-2 border-brand-electric flex items-center justify-center">
                                            <div className="w-3 h-3 bg-brand-electric rounded-full" />
                                        </div>
                                    </div>

                                    <div className="p-8 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/10 smooth-transition">
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white/20">
                                                <Shield size={24} />
                                            </div>
                                            <span className="text-lg font-black uppercase italic tracking-widest text-white/40">Secure Node (UPI)</span>
                                        </div>
                                        <div className="w-6 h-6 rounded-full border border-white/10" />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="confirm"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-10"
                            >
                                <div className="w-24 h-24 bg-brand-electric rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(47,140,255,0.4)]">
                                    <Check size={48} className="text-white" />
                                </div>
                                <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-4">Protocol Verified</h2>
                                <p className="text-white/40 max-w-sm mx-auto font-medium">Your order has been ingested. Awaiting deployment to your coordinates.</p>
                                <div className="mt-12 flex justify-center">
                                    <Link href="/profile">
                                        <GlowButton className="px-12 py-6">View Orders</GlowButton>
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="mt-16 flex justify-between items-center">
                        {step < 2 && (
                            <>
                                <button
                                    onClick={prevStep}
                                    disabled={step === 0}
                                    className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest smooth-transition ${step === 0 ? "opacity-0 pointer-events-none" : "hover:text-white text-white/40"}`}
                                >
                                    <ArrowLeft size={16} /> Back
                                </button>
                                <GlowButton onClick={nextStep} className="px-12 py-5 flex items-center gap-4 group">
                                    {step === 1 ? "Initialize Transaction" : "Next Protocol"} <ArrowRight size={20} className="group-hover:translate-x-1 smooth-transition" />
                                </GlowButton>
                            </>
                        )}
                    </div>
                </div>

                <div className="mt-12 flex justify-center items-center gap-6 opacity-20 grayscale scale-75">
                    <Shield size={24} />
                    <span className="text-[10px] font-black tracking-[0.5em] uppercase text-white">Encrypted Terminal V3.2</span>
                </div>
            </div>
        </div>
    );
}
