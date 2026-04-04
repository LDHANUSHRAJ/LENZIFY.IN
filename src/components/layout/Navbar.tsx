"use client";

import Link from "next/link";
import { Search, ShoppingCart, User, Menu, X, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const items = useCartStore((state) => state.items);
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 px-6 transition-all duration-500 ${scrolled ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-brand-navy/5 py-4" : "bg-transparent py-8"}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Mobile Menu Toggle */}
          <button className="lg:hidden text-brand-navy" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Center Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-navy">
            <Link href="/spectacles" className="hover:text-brand-gold transition-colors relative group">
              Spectacles
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-brand-gold transition-all group-hover:w-full" />
            </Link>
            <Link href="/lenses" className="hover:text-brand-gold transition-colors relative group">
              Lenses
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-brand-gold transition-all group-hover:w-full" />
            </Link>
            <Link href="/contact-lenses" className="hover:text-brand-gold transition-colors relative group">
              Contacts
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-brand-gold transition-all group-hover:w-full" />
            </Link>
          </div>

          {/* Logo - Centered absolute on desktop, relative on mobile */}
          <Link href="/" className="lg:absolute lg:left-1/2 lg:-translate-x-1/2 font-display text-2xl md:text-3xl font-bold tracking-[0.3em] uppercase text-brand-navy">
            Lenzify
          </Link>

          {/* Right Icons */}
          <div className="flex items-center gap-5 md:gap-8 text-brand-navy">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="hover:text-brand-gold transition-colors"
            >
              <Search size={18} strokeWidth={2.5} />
            </button>
            
            <Link href="/wishlist" className="hidden sm:block hover:text-brand-gold transition-colors">
              <Heart size={18} strokeWidth={2.5} />
            </Link>

            <div className="relative group">
              <Link href="/auth/login" className="hover:text-brand-gold transition-colors block">
                <User size={18} strokeWidth={2.5} />
              </Link>
              {/* Desktop Dropdown */}
              <div className="absolute right-0 top-full pt-4 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="bg-white border border-brand-navy/5 shadow-2xl p-2">
                  <Link href="/dashboard" className="block px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-brand-navy hover:bg-brand-background hover:text-brand-gold transition-colors">Dashboard</Link>
                  <Link href="/admin/dashboard" className="block px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-brand-navy hover:bg-brand-background hover:text-brand-gold transition-colors border-t border-brand-navy/5">Admin Terminal</Link>
                </div>
              </div>
            </div>

            <Link href="/cart" className="relative group">
              <ShoppingCart size={18} strokeWidth={2.5} className="group-hover:text-brand-gold transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-brand-navy text-white text-[8px] font-black rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden fixed left-0 right-0 top-0 h-screen bg-white z-[60] p-10 flex flex-col pt-32"
            >
              <button className="absolute top-8 right-8" onClick={() => setIsMenuOpen(false)}>
                <X size={24} />
              </button>
              
              <div className="flex flex-col gap-8">
                <Link href="/spectacles" className="text-3xl font-display uppercase tracking-widest text-brand-navy" onClick={() => setIsMenuOpen(false)}>Spectacles</Link>
                <Link href="/lenses" className="text-3xl font-display uppercase tracking-widest text-brand-navy" onClick={() => setIsMenuOpen(false)}>Lenses</Link>
                <Link href="/contact-lenses" className="text-3xl font-display uppercase tracking-widest text-brand-navy" onClick={() => setIsMenuOpen(false)}>Contact Lenses</Link>
                
                <div className="mt-12 space-y-6 pt-12 border-t border-brand-navy/5">
                   <Link href="/dashboard" className="block text-xs font-bold uppercase tracking-widest text-brand-navy" onClick={() => setIsMenuOpen(false)}>My Account</Link>
                   <Link href="/wishlist" className="block text-xs font-bold uppercase tracking-widest text-brand-navy" onClick={() => setIsMenuOpen(false)}>Archives</Link>
                   <Link href="/admin/dashboard" className="block text-xs font-bold uppercase tracking-widest text-brand-gold" onClick={() => setIsMenuOpen(false)}>Admin Terminal</Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Global Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-brand-navy/95 backdrop-blur-xl flex flex-col items-center justify-center p-6"
          >
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-10 right-10 text-white/40 hover:text-white transition-colors"
            >
              <X size={32} />
            </button>
            <div className="w-full max-w-2xl">
               <span className="text-brand-gold text-[10px] font-black uppercase tracking-[0.4em] mb-6 block text-center">Protocol Search</span>
               <input 
                  autoFocus
                  type="text" 
                  placeholder="What are you looking for?"
                  className="w-full bg-transparent border-b border-white/10 py-6 text-2xl md:text-4xl text-white font-display uppercase tracking-widest outline-none focus:border-brand-gold transition-colors text-center"
               />
               <p className="text-white/20 text-[10px] uppercase font-bold tracking-widest mt-8 text-center">Hit Enter to initiate discovery</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
