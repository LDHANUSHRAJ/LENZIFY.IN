"use client";

import { motion } from "framer-motion";
import { User, ShoppingBag, Heart, Settings, LogOut, Shield, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import GlowButton from "@/components/ui/GlowButton";

const sections = [
    { id: "profile", label: "Profile Info", icon: User, color: "#2F8CFF" },
    { id: "orders", label: "Order History", icon: ShoppingBag, color: "#4FC3FF" },
    { id: "wishlist", label: "Wishlist", icon: Heart, color: "#FF2F8C" },
    { id: "settings", label: "Settings", icon: Settings, color: "#C9D6E8" },
];

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-[#0B1C2D] pt-32 pb-20 px-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="flex flex-col md:flex-row items-center gap-10"
                    >
                        <div className="relative w-32 h-32 rounded-full glass-morphism border-2 border-brand-electric/30 flex items-center justify-center overflow-hidden">
                            <User size={64} className="text-brand-electric/40" />
                            <div className="absolute inset-0 bg-gradient-to-tr from-brand-electric/20 to-transparent" />
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none mb-4">Elite Protocol</h1>
                            <div className="flex items-center gap-4 justify-center md:justify-start">
                                <span className="bg-brand-electric/10 text-brand-electric text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest border border-brand-electric/20 flex items-center gap-2">
                                    <Zap size={10} fill="currentColor" /> Member Since 2026
                                </span>
                                <span className="text-white/20 text-[10px] font-black uppercase tracking-widest">UID: 0X9A4F2</span>
                            </div>
                        </div>
                    </motion.div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Sidebar Tabs */}
                    <nav className="lg:col-span-3 space-y-4">
                        {sections.map((section, i) => (
                            <motion.button
                                key={section.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * i }}
                                className="group w-full flex items-center gap-6 p-6 rounded-2xl glass-card border-none hover:bg-white/5 smooth-transition relative overflow-hidden"
                            >
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-electric transform -translate-x-full group-hover:translate-x-0 smooth-transition" />
                                <section.icon size={20} className="group-hover:text-brand-electric smooth-transition" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">{section.label}</span>
                            </motion.button>
                        ))}

                        <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="w-full flex items-center gap-6 p-6 rounded-2xl border border-white/5 text-white/20 hover:text-red-400 smooth-transition"
                        >
                            <LogOut size={20} />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Exit Protocol</span>
                        </motion.button>
                    </nav>

                    {/* Main Dashboard Panel */}
                    <main className="lg:col-span-9 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="glass-morphism p-10 rounded-3xl border-white/5 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-10 opacity-[0.03] select-none pointer-events-none">
                                <Shield size={200} />
                            </div>

                            <h2 className="text-2xl font-black uppercase italic mb-8 flex items-center gap-4">
                                Active Orders <div className="h-[1px] flex-1 bg-white/5" />
                            </h2>

                            <div className="space-y-4">
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                                    <div className="flex items-center gap-6 w-full md:w-auto">
                                        <div className="w-16 h-16 rounded-xl bg-brand-navy-dark border border-white/10 flex items-center justify-center">
                                            <ShoppingBag size={24} className="text-white/20" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg">Titanium Series 01</h4>
                                            <p className="text-white/40 text-[10px] uppercase font-black tracking-widest">Processing Deployment</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                                        <div className="text-right">
                                            <div className="font-bold">₹14,999</div>
                                            <div className="text-[10px] text-brand-electric font-black uppercase tracking-widest">ETA: 48 HOURS</div>
                                        </div>
                                        <button className="p-3 rounded-full glass-morphism hover:bg-white/10 text-white/40 hover:text-white smooth-transition">
                                            <ArrowRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="glass-card p-10 rounded-3xl"
                            >
                                <h3 className="text-xl font-black uppercase italic mb-6">Security Node</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-4 border-b border-white/5">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Two-Factor Auth</span>
                                        <span className="text-[10px] font-black font-brand-electric text-brand-electric uppercase tracking-widest">Active</span>
                                    </div>
                                    <div className="flex justify-between items-center py-4">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Last Access</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest">London, UK</span>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="glass-card p-10 rounded-3xl flex flex-col justify-between"
                            >
                                <div>
                                    <h3 className="text-xl font-black uppercase italic mb-2">Protocol Rewards</h3>
                                    <p className="text-[10px] text-white/40 font-bold tracking-widest uppercase">Tier: Platinum Visionary</p>
                                </div>
                                <div className="mt-8">
                                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full w-[75%] bg-brand-electric" />
                                    </div>
                                    <div className="flex justify-between mt-4">
                                        <span className="text-[10px] font-black uppercase tracking-widest">750 Points</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Next: 1000</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
