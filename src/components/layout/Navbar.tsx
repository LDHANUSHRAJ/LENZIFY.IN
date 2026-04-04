"use client";

import Link from "next/link";
import { Search, ShoppingCart, User, Menu, X, Heart, Phone, MapPin, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      {/* Official Top Bar - 1:1 Layout */}
      <div className="hidden lg:block bg-[#f8f9fa] border-b border-gray-100 text-[#444] py-2 px-6 z-[60] relative">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] font-medium tracking-tight">
          <div className="flex items-center gap-5">
            <Link href="/corporate" className="hover:text-brand-navy">Corporate</Link>
            <Link href="/store-locator" className="hover:text-brand-navy flex items-center gap-1.5"><MapPin size={11} /> StoreLocator</Link>
            <Link href="/singapore" className="hover:text-brand-navy">Singapore</Link>
            <Link href="/uae" className="hover:text-brand-navy border-l border-gray-200 pl-5">UAE</Link>
            <Link href="/john-jacobs" className="hover:text-brand-navy">John Jacobs</Link>
            <Link href="/aqualens" className="hover:text-brand-navy">Aqualens</Link>
            <Link href="/cobrowsing" className="hover:text-brand-navy">Cobrowsing</Link>
            <Link href="/blog" className="hover:text-brand-navy">Engineering Blog</Link>
            <Link href="/partner" className="hover:text-brand-navy">Partner With Us</Link>
          </div>
          <div className="flex items-center gap-5 font-bold text-brand-navy">
             <a href="tel:+916361446768" className="flex items-center gap-2"><Phone size={12} fill="currentColor" /> 99998 99998</a>
          </div>
        </div>
      </div>

      <nav className={`fixed top-0 lg:top-[35px] left-0 right-0 z-50 px-6 transition-all duration-300 ${scrolled ? "bg-white shadow-md border-b border-gray-100 py-3" : "bg-white py-5"}`}>
        <div className="max-w-7xl mx-auto flex items-center gap-8">
          
          {/* Official Logo - Left Section */}
          <Link href="/" className="flex flex-shrink-0 items-center">
            <span className="font-display text-2xl lg:text-3xl font-black uppercase text-brand-navy tracking-tight">
               Lenzify
            </span>
          </Link>

          {/* Main Navigation - Integrated */}
          <div className="hidden xl:flex items-center gap-10 text-[12px] font-black uppercase tracking-wider text-brand-navy">
            <Link href="/spectacles" className="hover:text-brand-gold transition-colors">EYEGLASSES</Link>
            <Link href="/sunglasses" className="hover:text-brand-gold transition-colors">SUNGLASSES</Link>
            <Link href="/lenses" className="hover:text-brand-gold transition-colors">CONTACTS</Link>
            <Link href="/special" className="hover:text-brand-gold transition-colors">SPECIAL POWER</Link>
            <Link href="/stores" className="hover:text-brand-gold transition-colors">STORES</Link>
            <Link href="/try-at-home" className="hover:text-brand-gold transition-colors">TRY @ HOME</Link>
          </div>

          {/* Search Bar - Iconic Pill Style */}
          <div className="flex-1 max-w-[500px] hidden lg:flex relative group">
             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={16} />
             </div>
             <input 
                type="text" 
                placeholder="What are you looking for?"
                className="w-full bg-[#f3f3f3] border-none rounded-sm px-12 py-2.5 text-[12px] font-medium placeholder:text-gray-500 outline-none focus:ring-1 focus:ring-brand-navy transition-all"
             />
          </div>

          {/* Functional Icons */}
          <div className="flex items-center gap-6 ml-auto text-brand-navy">
             <Link href="/wishlist" className="hover:text-brand-gold transition-colors block md:flex items-center gap-2">
                <Heart size={20} strokeWidth={2.5} />
             </Link>
             <Link href="/cart" className="relative hover:text-brand-gold transition-colors block md:flex items-center gap-2">
                <ShoppingCart size={20} strokeWidth={2.5} />
                {cartCount > 0 && (
                   <span className="absolute -top-2 -right-2 w-4 h-4 bg-brand-gold text-white text-[8px] font-black rounded-full flex items-center justify-center">
                      {cartCount}
                   </span>
                )}
             </Link>
             <Link href="/auth/login" className="hover:text-brand-gold transition-colors block md:flex items-center gap-2">
                <User size={20} strokeWidth={2.5} />
             </Link>
             
             <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
             </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="lg:hidden fixed inset-0 top-[70px] bg-white z-[60] flex flex-col p-8 overflow-y-auto"
            >
              <div className="space-y-6 text-xl font-black uppercase tracking-widest text-brand-navy">
                <Link href="/spectacles" onClick={() => setIsMenuOpen(false)} className="block">EYEGLASSES</Link>
                <Link href="/sunglasses" onClick={() => setIsMenuOpen(false)} className="block">SUNGLASSES</Link>
                <Link href="/lenses" onClick={() => setIsMenuOpen(false)} className="block">CONTACTS</Link>
                <Link href="/stores" onClick={() => setIsMenuOpen(false)} className="block">STORES</Link>
                <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="block text-brand-gold">MY ACCOUNT</Link>
              </div>
              <div className="mt-auto pt-10 border-t border-gray-100 flex flex-col gap-4">
                 <a href="tel:+916361446768" className="text-sm font-bold text-brand-navy">HELP: 99998 99998</a>
                 <a href="mailto:lenzify.in@gmail.com" className="text-sm font-medium text-gray-500">lenzify.in@gmail.com</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
