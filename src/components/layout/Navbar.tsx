"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, Heart, ShoppingCart, User, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const cartCount = useCartStore((state) => state.getTotalItems());
    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 px-8 py-6 smooth-transition ${scrolled ? "glass-morphism py-4 border-b border-white/5" : "bg-transparent"}`}>
            <div className="max-w-[1800px] mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="text-2xl font-black tracking-tighter italic uppercase group-hover:text-brand-electric smooth-transition">
                        LENZIFY<span className="text-brand-electric">.</span>
                    </div>
                </Link>

                {/* Center Links - Bold uppercase Lando Style */}
                <div className="hidden lg:flex items-center gap-12 text-white/40 font-black uppercase tracking-[0.4em] text-[10px]">
                    <Link href="/spectacles" className="hover:text-white smooth-transition relative group">
                        Spectacles
                        <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-brand-electric group-hover:w-full smooth-transition" />
                    </Link>
                    <Link href="/lenses" className="hover:text-white smooth-transition relative group">
                        Lenses
                        <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-brand-electric group-hover:w-full smooth-transition" />
                    </Link>
                    <Link href="/contact-lenses" className="hover:text-white smooth-transition relative group">
                        Contact
                        <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-brand-electric group-hover:w-full smooth-transition" />
                    </Link>
                </div>

                {/* Right Icons */}
                <div className="flex items-center gap-6">
                    <div className="hidden sm:flex items-center gap-6">
                        <button className="text-white/40 hover:text-white smooth-transition"><Search size={18} /></button>
                        <div className="relative group/user">
                            <button className="text-white/40 hover:text-white smooth-transition"><User size={18} /></button>
                            <div className="absolute right-0 top-full mt-4 w-56 glass-card rounded-2xl opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible smooth-transition p-3 border border-white/10 shadow-2xl">
                                <Link href="/profile" className="block px-4 py-2 hover:bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white">Profile Node</Link>
                                <Link href="/cart" className="block px-4 py-2 hover:bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white">Order History</Link>
                                <button className="w-full text-left px-4 py-2 hover:bg-red-500/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500/60 hover:text-red-500">Sign Out</button>
                            </div>
                        </div>
                    </div>

                    <Link href="/cart" className="flex items-center gap-3 glass-morphism px-6 py-2 rounded-full border border-white/10 hover:border-brand-electric smooth-transition group">
                        <ShoppingCart size={16} className="text-white/40 group-hover:text-white" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Cart</span>
                        {mounted && cartCount > 0 && (
                            <span className="bg-brand-electric text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(47,140,255,0.4)]">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Mobile Menu Toggle */}
                    <button className="lg:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden glass-morphism border-t border-white/10 fixed left-0 right-0 top-[72px] h-[calc(100vh-72px)] p-12 flex flex-col gap-8 bg-[#0B1C2D]">
                    <Link href="/spectacles" className="text-5xl font-black uppercase italic tracking-tighter" onClick={() => setIsMenuOpen(false)}>Spectacles</Link>
                    <Link href="/lenses" className="text-5xl font-black uppercase italic tracking-tighter" onClick={() => setIsMenuOpen(false)}>Lenses</Link>
                    <Link href="/contact-lenses" className="text-5xl font-black uppercase italic tracking-tighter" onClick={() => setIsMenuOpen(false)}>Contact</Link>
                    <div className="mt-auto border-t border-white/10 pt-8 flex flex-col gap-6">
                        <Link href="/profile" className="text-xs font-black uppercase tracking-[0.3em] text-brand-electric" onClick={() => setIsMenuOpen(false)}>Access Profile</Link>
                        <Link href="/support" className="text-xs font-black uppercase tracking-[0.3em] text-white/40" onClick={() => setIsMenuOpen(false)}>Global Support</Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
