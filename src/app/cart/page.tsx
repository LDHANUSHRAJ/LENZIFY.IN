"use client";

import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
    const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-brand-background">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-20 h-20 bg-brand-surface rounded-full flex items-center justify-center mb-8 border border-brand-navy/5 shadow-sm"
                >
                    <ShoppingBag size={32} className="text-brand-navy/20" />
                </motion.div>
                <h1 className="text-4xl font-display text-brand-navy mb-4 uppercase tracking-widest text-center">Your Cart is Empty</h1>
                <p className="text-brand-text-muted mb-10 max-w-sm text-center text-sm uppercase tracking-widest leading-relaxed">
                    Discovery awaits. Explore our curated collections of luxury eyewear.
                </p>
                <Link href="/spectacles" className="bg-brand-navy text-white px-10 py-4 text-xs font-bold uppercase tracking-widest hover:bg-brand-gold transition-colors">
                    Explore Collections
                </Link>
            </div>
        );
    }

    const subtotal = getTotalPrice();
    const shipping = 0; // Free shipping for luxury
    const total = subtotal + shipping;

    return (
        <div className="min-h-screen bg-brand-background pt-32 pb-24 px-6">
            <div className="max-w-7xl mx-auto">
                <header className="mb-16 text-center lg:text-left">
                    <h1 className="text-4xl md:text-5xl font-display uppercase tracking-[0.2em] text-brand-navy">Shopping Bag</h1>
                    <p className="text-brand-text-muted text-xs uppercase tracking-widest mt-4">{items.length} Items Selected</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Cart Items List */}
                    <div className="lg:col-span-8 space-y-6">
                        <AnimatePresence mode="popLayout">
                            {items.map((item, i) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.4, delay: i * 0.1 }}
                                    className="p-6 bg-white border border-brand-navy/5 flex flex-col sm:flex-row gap-8 items-center group"
                                >
                                    <div className="relative w-32 h-32 aspect-square bg-brand-background border border-brand-navy/5 shrink-0 overflow-hidden">
                                        <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    
                                    <div className="flex-1 flex flex-col justify-between w-full">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <p className="text-[10px] text-brand-gold uppercase tracking-[0.3em] font-bold mb-1">{item.brand}</p>
                                                <h3 className="text-xl font-display text-brand-navy uppercase tracking-widest leading-tight">{item.name}</h3>
                                            </div>
                                            <button 
                                                onClick={() => removeItem(item.id)} 
                                                className="p-2 text-brand-text-muted hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>

                                        <div className="flex justify-between items-center mt-auto pt-4 border-t border-brand-navy/5">
                                            <div className="flex items-center border border-brand-navy/10 px-4 py-2 gap-6">
                                                <button onClick={() => updateQuantity(item.id, -1)} className="text-brand-navy hover:text-brand-gold transition-colors">
                                                    <Minus size={14} />
                                                </button>
                                                <span className="text-sm font-semibold min-w-[20px] text-center">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, 1)} className="text-brand-navy hover:text-brand-gold transition-colors">
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            <span className="text-lg font-bold text-brand-navy">₹{(item.price * item.quantity).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-4">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="sticky top-32 bg-white border border-brand-navy/5 p-10 shadow-sm"
                        >
                            <h2 className="text-xl font-display font-bold mb-8 uppercase tracking-widest text-brand-navy">Order Summary</h2>

                            <div className="space-y-4 mb-10">
                                <div className="flex justify-between text-xs uppercase tracking-widest text-brand-text-muted leading-relaxed">
                                    <span>Subtotal</span>
                                    <span className="text-brand-navy font-bold">₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-xs uppercase tracking-widest text-brand-text-muted leading-relaxed">
                                    <span>Shipping</span>
                                    <span className="text-brand-gold font-bold">Complimentary</span>
                                </div>
                                <div className="h-[1px] bg-brand-navy/10 my-6" />
                                <div className="flex justify-between text-xl font-bold text-brand-navy">
                                    <span className="uppercase tracking-widest font-display">Total</span>
                                    <span>₹{total.toLocaleString()}</span>
                                </div>
                            </div>

                            <Link href="/checkout" className="w-full bg-brand-navy text-white py-5 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-brand-navy-light hover:text-white transition-all group">
                                Process to Checkout 
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <div className="mt-8 pt-8 border-t border-brand-navy/5 flex items-center gap-4 text-brand-text-muted">
                                <ShieldCheck size={20} className="text-brand-gold" />
                                <span className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">Secure Payment & Authentication</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
