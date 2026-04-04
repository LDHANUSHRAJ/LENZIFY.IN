"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, MapPin, Phone, Clock, ArrowRight, Star, ShieldCheck, ChevronRight, Zap } from "lucide-react";
import { motion } from "framer-motion";

const stores = [
  { id: 1, name: "Lenzify Premium - MG Road", address: "Plot 42, Zenith Square, MG Road, Bangalore", phone: "+91 99998 99998", timing: "10:00 AM - 09:30 PM", distance: "0.8 km", rating: "4.9" },
  { id: 2, name: "Lenzify Boutique - Indiranagar", address: "100 Ft Rd, Opp. Metro Pillar 12, Bangalore", phone: "+91 99998 99997", timing: "11:00 AM - 10:00 PM", distance: "2.4 km", rating: "4.8" },
  { id: 3, name: "Lenzify Global - Dubai Mall", address: "Level 1, Fashion Avenue, Dubai Mall, UAE", phone: "+971 4 330 8888", timing: "10:00 AM - 11:30 PM", distance: "N/A", rating: "5.0" },
];

export default function StoresPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="bg-[#fcfcfc] pt-[120px] lg:pt-[180px] pb-32">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Stores Locator Header */}
        <div className="mb-20 text-center">
           <span className="text-brand-gold text-[10px] font-black uppercase tracking-[0.6em] mb-4 block">Physical Nexus</span>
           <h1 className="text-5xl lg:text-7xl font-black text-brand-navy mb-8 tracking-tighter uppercase leading-[0.85] italic">Find Your <br /> <span className="text-brand-navy/20 not-italic">Prescription Lab</span></h1>
           
           <div className="max-w-2xl mx-auto relative group mt-12">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-navy/30 group-focus-within:text-brand-gold transition-colors" size={20} />
              <input 
                 type="text" 
                 placeholder="Search via City, Pincode, or Region..."
                 className="w-full bg-white border border-brand-navy/5 px-16 py-6 rounded-full text-xs font-bold uppercase tracking-widest outline-none focus:ring-4 focus:ring-brand-navy/5 focus:border-brand-navy transition-all shadow-xl"
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
              />
           </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
           {/* Store Listing Stack */}
           <div className="w-full lg:w-[450px] space-y-6">
              <div className="bg-brand-navy text-white p-10 rounded-[2.5rem] mb-10 shadow-2xl relative overflow-hidden group">
                 <Zap size={32} className="text-brand-gold absolute -top-4 -right-4 opacity-10 group-hover:scale-150 transition-transform duration-[2s]" />
                 <h3 className="text-xl font-black uppercase tracking-tighter italic mb-4">Book Free Eye Test</h3>
                 <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-10">Certified Optical Doctors • Advanced AI Diagnosis • Instant Result</p>
                 <button className="bg-brand-gold text-brand-navy px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all">Select Store</button>
              </div>

              {stores.map((store) => (
                 <motion.div 
                    key={store.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white border border-brand-navy/5 p-8 rounded-3xl group hover:border-brand-gold hover:shadow-2xl transition-all duration-500 cursor-pointer"
                 >
                    <div className="flex justify-between items-start mb-6">
                       <h4 className="text-sm font-black uppercase tracking-widest text-brand-navy group-hover:text-brand-gold transition-colors">{store.name}</h4>
                       <div className="flex items-center gap-1.5 bg-brand-gold/10 px-3 py-1.5 rounded-full">
                          <Star size={10} className="text-brand-gold fill-current" />
                          <span className="text-[9px] font-black text-brand-navy">{store.rating}</span>
                       </div>
                    </div>
                    <div className="space-y-4 text-[11px] font-bold uppercase tracking-widest text-brand-navy/40">
                       <p className="flex items-center gap-3"><MapPin size={14} className="text-brand-gold" /> {store.address}</p>
                       <p className="flex items-center gap-3"><Phone size={14} className="text-brand-gold" /> {store.phone}</p>
                       <p className="flex items-center gap-3"><Clock size={14} className="text-brand-gold" /> {store.timing}</p>
                    </div>
                    <div className="mt-8 pt-6 border-t border-brand-navy/5 flex items-center justify-between">
                       <span className="text-[9px] font-black uppercase tracking-widest text-brand-gold italic">{store.distance} Protocol</span>
                       <ChevronRight size={16} className="text-brand-navy/20 group-hover:translate-x-2 transition-transform" />
                    </div>
                 </motion.div>
              ))}
           </div>

           {/* Immersive Map Visualization (Proxy) */}
           <div className="flex-1 bg-brand-surface rounded-[3rem] border border-brand-navy/5 relative overflow-hidden shadow-inner min-h-[600px]">
              <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1600')] bg-cover grayscale group hover:grayscale-0 transition-all duration-[2s]" />
              <div className="absolute inset-0 bg-brand-navy/10 mix-blend-multiply" />
              
              {/* Animated Store Nodes */}
              <div className="absolute top-[30%] left-[40%] group/node">
                 <div className="w-12 h-12 bg-brand-gold rounded-full flex items-center justify-center animate-bounce shadow-2xl relative">
                    <MapPin size={24} className="text-brand-navy" />
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-brand-navy text-white px-4 py-2 text-[8px] font-black uppercase opacity-0 group-hover/node:opacity-100 transition-opacity whitespace-nowrap">MAIN LAB</div>
                 </div>
                 <div className="w-24 h-24 bg-brand-gold/20 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
