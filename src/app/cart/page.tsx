"use client";

import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, ShieldCheck } from "lucide-react";
import GlowButton from "@/components/ui/GlowButton";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
    const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[#0B1C2D]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-24 h-24 glass-morphism rounded-full flex items-center justify-center mb-10 border-white/5"
                >
                    <ShoppingBag size={40} className="text-white/20" />
                </motion.div>
                <h1 className="text-4xl md:text-6xl font-black mb-6 uppercase italic tracking-tighter">Empty Protocol</h1>
                <p className="text-white/40 mb-12 max-w-sm text-center font-medium">Your neural cart is awaiting high-performance optics.</p>
                <Link href="/spectacles">
                    <GlowButton className="px-12 py-6 text-xl">Browse Collection</GlowButton>
                </Link>
            </div>
        );
    }

    const subtotal = getTotalPrice();
    const tax = subtotal * 0.18;
    const total = subtotal + tax;

    return (
        <div className="min-h-screen bg-[#0B1C2D] pt-32 pb-20 px-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-16">
                    <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white">Neural Cart</h1>
                    <div className="h-1 w-24 bg-brand-electric mt-4" />
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Cart Items List */}
                    <div className="lg:col-span-8 space-y-8">
                        <AnimatePresence mode="popLayout">
                            {items.map((item, i) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    className="p-8 glass-card border-none rounded-[32px] overflow-hidden group"
                                >
                                    <div className="flex flex-col md:flex-row gap-10">
                                        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden bg-brand-navy-dark border border-white/5 shrink-0">
                                            <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 smooth-transition" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-2">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-[10px] text-brand-electric uppercase tracking-[0.4em] font-black mb-2">{item.brand}</p>
                                                    <h3 className="text-3xl font-black italic uppercase leading-none">{item.name}</h3>
                                                </div>
                                                <button onClick={() => removeItem(item.id)} className="p-4 rounded-full hover:bg-red-500/10 text-white/20 hover:text-red-500 smooth-transition">
                                                    <Trash2 size={24} />
                                                </button>
                                            </div>

                                            <div className="flex justify-between items-end mt-8">
                                                <div className="flex items-center gap-6 glass-morphism px-6 py-3 rounded-full border border-white/10">
                                                    <button onClick={() => updateQuantity(item.id, -1)} className="hover:text-brand-electric smooth-transition">
                                                        <Minus size={20} />
                                                    </button>
                                                    <span className="text-xl font-bold min-w-[30px] text-center">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, 1)} className="hover:text-brand-electric smooth-transition">
                                                        <Plus size={20} />
                                                    </button>
                                                </div>
                                                <span className="text-3xl font-black italic">₹{(item.price * item.quantity).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="sticky top-32 glass-morphism p-12 rounded-[40px] border-white/5"
                        >
                            <h2 className="text-2xl font-black mb-10 uppercase italic tracking-widest">Protocol Summary</h2>

                            <div className="space-y-6 mb-12">
                                <div className="flex justify-between text-white/40 text-sm font-bold uppercase tracking-widest">
                                    <span>Subtotal</span>
                                    <span className="text-white">₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-white/40 text-sm font-bold uppercase tracking-widest">
                                    <span>Tax (Integrated 18%)</span>
                                    <span className="text-white">₹{Math.round(tax).toLocaleString()}</span>
                                </div>
                                <div className="h-[1px] bg-white/5 my-8" />
                                <div className="flex justify-between text-3xl font-black italic text-white">
                                    <span>Total</span>
                                    <span className="text-brand-electric">₹{Math.round(total).toLocaleString()}</span>
                                </div>
                            </div>

                            <Link href="/checkout">
                                <GlowButton className="w-full py-6 text-xl flex items-center justify-center gap-4 group">
                                    Initialize Checkout <ArrowRight size={24} className="group-hover:translate-x-1 smooth-transition" />
                                </GlowButton>
                            </Link>

                            <div className="mt-12 pt-10 border-t border-white/5">
                                <div className="flex items-center gap-4 text-white/20">
                                    <ShieldCheck size={20} className="text-brand-electric/50" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Secure Payment Nodes Active</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
