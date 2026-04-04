"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, ArrowUpRight, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-navy text-white pt-32 pb-12 selection:bg-brand-gold selection:text-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Luxury Trust Marquee / Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32 border-t border-b border-white/5 py-16">
          <div className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:bg-brand-gold group-hover:text-brand-navy transition-all duration-500">
               <ShieldCheck size={28} strokeWidth={1.5} />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-3">Certified Authenticity</h4>
            <p className="text-white/40 text-xs tracking-widest leading-relaxed max-w-[200px]">Every frame is a verified masterpiece of optical engineering.</p>
          </div>
          <div className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:bg-brand-gold group-hover:text-brand-navy transition-all duration-500">
               <Truck size={28} strokeWidth={1.5} />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-3">Global Logistics</h4>
            <p className="text-white/40 text-xs tracking-widest leading-relaxed max-w-[200px]">Seamless insured delivery to Singapore, UAE, and beyond.</p>
          </div>
          <div className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:bg-brand-gold group-hover:text-brand-navy transition-all duration-500">
               <RotateCcw size={28} strokeWidth={1.5} />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-3">The Lensify Promise</h4>
            <p className="text-white/40 text-xs tracking-widest leading-relaxed max-w-[200px]">Free lens replacements and a zero-risk 14-day curation period.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-32">
          
          {/* Brand Essence */}
          <div className="lg:col-span-2">
            <Link href="/" className="font-display text-4xl font-bold tracking-[0.3em] uppercase mb-8 block group">
               Lenzify<span className="text-brand-gold">.</span>
            </Link>
            <p className="text-white/50 text-[11px] leading-[2] uppercase tracking-[0.2em] mb-12 max-w-sm">
               Redefining optical luxury. Our atelier merges avant-garde design with precision engineering to create eyewear that transcends time.
            </p>
            <div className="flex gap-6">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <Link key={i} href="#" className="p-4 border border-white/5 hover:border-brand-gold hover:text-brand-gold transition-all duration-500 rounded-full group">
                   <Icon size={18} strokeWidth={1.5} className="group-hover:scale-110" />
                </Link>
              ))}
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-gold mb-10">Collections</h4>
            <ul className="space-y-6">
              {['Eyeglasses', 'Sunglasses', 'Contact Lenses', 'Limited Editions'].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase().replace(' ', '-')}`} className="text-xs uppercase tracking-widest text-white/40 hover:text-white flex items-center gap-2 group transition-all">
                    {item} <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-x-1 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-gold mb-10">Protocols</h4>
            <ul className="space-y-6">
              {['Contact Us', 'Shipping Policy', 'Warranty', 'Store Locator'].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase().replace(' ', '-')}`} className="text-xs uppercase tracking-widest text-white/40 hover:text-white flex items-center gap-2 group transition-all">
                    {item} <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-x-1 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details - User Requested */}
          <div className="lg:col-span-1">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-gold mb-10">Connect</h4>
            <div className="space-y-8">
               <div className="flex flex-col gap-2">
                  <span className="text-[8px] uppercase tracking-widest text-white/20 font-bold">Inquiries</span>
                  <a href="mailto:lenzify.in@gmail.com" className="text-xs uppercase tracking-widest hover:text-brand-gold transition-colors">
                    lenzify.in@gmail.com
                  </a>
               </div>
               <div className="flex flex-col gap-2">
                  <span className="text-[8px] uppercase tracking-widest text-white/20 font-bold">Concierge</span>
                  <a href="tel:+916361446768" className="text-xs uppercase tracking-widest hover:text-brand-gold transition-colors">
                    +91 636144 6768
                  </a>
               </div>
               <div className="flex flex-col gap-2">
                  <span className="text-[8px] uppercase tracking-widest text-white/20 font-bold">Global Presence</span>
                  <span className="text-xs uppercase tracking-widest text-white/60">
                    Singapore | Dubai | Bangalore
                  </span>
               </div>
            </div>
          </div>
        </div>

        {/* Exclusive Newsletter */}
        <div className="bg-white/5 p-12 lg:p-20 mb-32 flex flex-col lg:flex-row items-center justify-between gap-12 group hover:bg-white/[0.07] transition-all duration-[1.5s]">
           <div className="max-w-md text-center lg:text-left">
              <h3 className="text-3xl font-display uppercase tracking-widest mb-4">Privileged Insights</h3>
              <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/30">Join the inner circle. Exclusive collections and bespoke offers.</p>
           </div>
           <form className="w-full lg:w-auto flex flex-col sm:flex-row gap-4 flex-1 max-w-xl">
              <input 
                type="email" 
                placeholder="EMAIL ARCHIVE" 
                className="flex-1 bg-brand-navy border border-white/10 px-8 py-5 text-[10px] font-black uppercase tracking-widest outline-none focus:border-brand-gold transition-all placeholder:text-white/10"
                required
              />
              <button 
                type="submit" 
                className="bg-brand-gold text-brand-navy px-12 py-5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:scale-105 transition-all duration-500"
              >
                Inscribe
              </button>
           </form>
        </div>
        
        {/* Legal & Bottom Bar */}
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 text-[9px] font-black uppercase tracking-[0.4em] text-white/20">
          <p>&copy; {currentYear} Lenzify Private Limited. All Assets Secured.</p>
          <div className="flex gap-10">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Codex</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Engagement</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">Cookie Ledger</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
