"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Filter, ChevronDown, Star, Heart, ShoppingBag, LayoutGrid, List, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const products = [
  { id: "1", name: "John Jacobs Aurelius", price: "₹12,499", oldPrice: "₹15,000", rating: "4.8", reviews: "1240", image: "https://static1.lenskart.com/media/desktop/img/Apr21/Eyeglasses.png", category: "Full Rim", shape: "Rectangle", size: "Medium", colors: ["#000", "#c9a227", "#1e1b6e"] },
  { id: "2", name: "Vincent Chase Nomad", price: "₹8,900", oldPrice: "₹10,500", rating: "4.7", reviews: "850", image: "https://static1.lenskart.com/media/desktop/img/Apr21/Sunglasses.png", category: "Rimless", shape: "Aviator", size: "Large", colors: ["#000", "#555"] },
  { id: "3", name: "Lenzify Zenith X1", price: "₹14,200", oldPrice: "₹18,000", rating: "4.9", reviews: "2100", image: "https://static1.lenskart.com/media/desktop/img/Apr21/ComputerGlasses.png", category: "Supra", shape: "Geometric", size: "Medium", colors: ["#1e1b6e", "#c9a227"] },
  { id: "4", name: "Meller Limited", price: "₹6,500", oldPrice: "₹8,000", rating: "4.6", reviews: "420", image: "https://static1.lenskart.com/media/desktop/img/Apr21/KidsGlasses.png", category: "Full Rim", shape: "Round", size: "Small", colors: ["#000"] },
];

const filterGroups = [
  { id: "frameType", name: "FRAME TYPE", options: ["Full Rim", "Rimless", "Supra"] },
  { id: "shape", name: "FRAME SHAPE", options: ["Rectangle", "Aviator", "Geometric", "Round", "Cateye", "Square"] },
  { id: "size", name: "FRAME SIZE", options: ["Small", "Medium", "Large"] },
];

export default function ProductsPage() {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
     frameType: [],
     shape: [],
     size: [],
  });

  const toggleFilter = (group: string, option: string) => {
    setSelectedFilters(prev => {
      const current = prev[group];
      const next = current.includes(option) 
        ? current.filter(item => item !== option)
        : [...current, option];
      return { ...prev, [group]: next };
    });
  };

  return (
    <div className="bg-[#fcfcfc] min-h-screen pt-[120px] lg:pt-[160px] pb-20 px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        
        {/* Advanced Sidebar Filter */}
        <aside className="w-full lg:w-72 flex-shrink-0">
           <div className="sticky top-[180px]">
              <div className="flex items-center justify-between mb-10 border-b border-brand-navy/5 pb-4">
                 <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-brand-navy flex items-center gap-3">
                   <Filter size={14} className="text-brand-gold" /> Filter Protocol
                 </h3>
                 <button onClick={() => setSelectedFilters({frameType: [], shape: [], size: []})} className="text-[9px] font-bold text-brand-gold uppercase tracking-widest hover:text-brand-navy transition-colors">Reset</button>
              </div>

              <div className="space-y-12">
                 {filterGroups.map((group) => (
                    <div key={group.id} className="group">
                       <div className="flex items-center justify-between mb-6">
                          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-navy/40 group-hover:text-brand-navy transition-colors">{group.name}</span>
                          <ChevronDown size={12} className="text-brand-navy/20" strokeWidth={3} />
                       </div>
                       <div className="flex flex-col gap-4">
                          {group.options.map((option) => (
                             <label key={option} className="flex items-center gap-4 cursor-pointer group/item">
                                <div 
                                   onClick={() => toggleFilter(group.id, option)}
                                   className={`w-6 h-6 border-2 flex items-center justify-center transition-all duration-300 ${selectedFilters[group.id].includes(option) ? "bg-brand-navy border-brand-navy" : "border-brand-navy/10 group-hover/item:border-brand-gold"}`}
                                >
                                   {selectedFilters[group.id].includes(option) && <X size={12} className="text-white" strokeWidth={3} />}
                                </div>
                                <span className={`text-[11px] font-bold uppercase tracking-widest transition-colors ${selectedFilters[group.id].includes(option) ? "text-brand-navy" : "text-brand-navy/40 group-hover/item:text-brand-gold"}`}>
                                   {option}
                                </span>
                             </label>
                          ))}
                       </div>
                    </div>
                 ))}
              </div>

              {/* Service Upsells */}
              <div className="mt-16 bg-brand-navy p-10 rounded-3xl relative overflow-hidden group">
                 <div className="absolute inset-0 bg-brand-gold/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                 <Zap size={24} className="text-brand-gold mb-6 animate-pulse" />
                 <h4 className="text-white font-black text-sm uppercase tracking-tighter mb-3 leading-tight italic">Free 12-Step <br /> Eye Checkup</h4>
                 <p className="text-white/40 text-[9px] uppercase tracking-widest leading-[2] mb-8 font-bold">Comprehensive clinical vision analysis at your doorstep.</p>
                 <button className="text-brand-gold text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-3">
                    Inquire <ArrowRight size={10} />
                 </button>
              </div>
           </div>
        </aside>

        {/* Product Grid - The Repository */}
        <main className="flex-1">
           {/* Top Stats & Sorting */}
           <div className="flex flex-col md:flex-row items-center justify-between mb-12 bg-white p-6 border border-brand-navy/5 shadow-sm rounded-2xl">
              <div className="flex items-center gap-5 mb-4 md:mb-0">
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-navy/30">Eyeglasses Collection</span>
                 <div className="h-4 w-[1px] bg-brand-navy/10" />
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-navy">{products.length} Masterpieces Found</span>
              </div>
              <div className="flex items-center gap-8">
                 <div className="hidden md:flex items-center gap-3 pr-8 border-r border-brand-navy/5">
                    <button className="p-2 text-brand-navy transition-all"><LayoutGrid size={16} /></button>
                    <button className="p-2 text-brand-navy/20 hover:text-brand-navy transition-all"><List size={16} /></button>
                 </div>
                 <div className="flex items-center gap-4 group">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-navy/30 group-hover:text-brand-gold transition-colors italic">Sort Hierarchy:</span>
                    <select className="bg-transparent text-[11px] font-black uppercase tracking-widest text-brand-navy outline-none border-none cursor-pointer">
                       <option>Premium First</option>
                       <option>Collection Entry</option>
                       <option>Authority Rating</option>
                    </select>
                 </div>
              </div>
           </div>

           {/* Results Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {products.map((product, i) => (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative bg-white border border-brand-navy/5 overflow-hidden transition-all duration-[0.8s] hover:border-brand-navy/20 hover:shadow-[0_40px_80px_rgba(30,27,110,0.1)] rounded-3xl"
                >
                   {/* Product Entry Terminal */}
                   <Link href={`/product/${product.id}`} className="block relative aspect-[4/5] p-10 bg-brand-background overflow-hidden group-hover:bg-brand-navy group-hover:bg-opacity-[0.02] transition-colors duration-[1s]">
                      <Image 
                        src={product.image} 
                        alt={product.name} 
                        fill 
                        className="object-contain p-8 group-hover:scale-110 transition-transform duration-[1.5s] mix-blend-multiply" 
                      />
                      
                      {/* Authority Overlays */}
                      <div className="absolute top-8 left-8 flex flex-col gap-2 z-20">
                         <span className="text-[8px] font-black uppercase tracking-[0.4em] bg-brand-navy text-white px-3 py-1.5 shadow-xl italic">Legacy Drop</span>
                         <span className="text-[8px] font-black uppercase tracking-[0.4em] bg-brand-gold text-brand-navy px-3 py-1.5 shadow-xl">Hand-Polished</span>
                      </div>

                      <button className="absolute top-8 right-8 p-4 bg-white/80 backdrop-blur-md rounded-full shadow-2xl translate-x-16 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-700 hover:bg-brand-navy hover:text-white">
                         <Heart size={14} strokeWidth={2.5} />
                      </button>

                      {/* Quick Deployment Protocol */}
                      <button className="absolute bottom-0 left-0 right-0 bg-brand-navy text-white text-[9px] font-black uppercase tracking-[0.5em] py-6 translate-y-full group-hover:translate-y-0 transition-all duration-500 hover:bg-brand-gold flex items-center justify-center gap-4 shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
                         Access Deployment <ShoppingBag size={14} className="opacity-40" />
                      </button>
                   </Link>

                   {/* Intelligence Data Area */}
                   <div className="p-10 flex flex-col items-center text-center">
                      <div className="flex items-center gap-4 mb-4">
                         <div className="flex items-center gap-1.5 bg-brand-gold/10 px-3 py-1.5 rounded-full">
                            <Star size={10} className="text-brand-gold fill-current" />
                            <span className="text-[9px] font-black text-brand-navy tracking-widest">{product.rating}</span>
                         </div>
                         <span className="text-[9px] font-black text-brand-navy/20 uppercase tracking-[0.2em]">{product.reviews} Inquisitions</span>
                      </div>

                      <h4 className="text-sm font-black uppercase tracking-[0.2em] text-brand-navy mb-2 group-hover:text-brand-gold transition-colors duration-500 uppercase">{product.name}</h4>
                      <p className="text-[9px] text-brand-navy/30 uppercase tracking-[0.4em] mb-6 font-black italic">{product.category} • {product.size} Series</p>

                      <div className="flex items-center gap-6">
                         <span className="text-brand-navy/20 text-xs font-bold line-through tracking-widest">{product.oldPrice}</span>
                         <span className="text-2xl font-black text-brand-navy tracking-tighter">{product.price}</span>
                      </div>

                      {/* Color Palette Matrix */}
                      <div className="flex gap-2.5 mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                         {product.colors.map((c, i) => (
                           <div key={i} className="w-5 h-5 rounded-full border-2 border-white shadow-lg ring-1 ring-brand-navy/5" style={{ backgroundColor: c }} />
                         ))}
                      </div>
                   </div>
                </motion.div>
              ))}
           </div>

           {/* Discovery Expansion Call */}
           <div className="mt-32 border-t border-brand-navy/5 pt-20 text-center">
              <span className="text-[10px] font-black uppercase tracking-[0.6em] text-brand-gold mb-10 block animate-bounce">Deploying More Sequences</span>
              <button className="px-16 py-6 border-2 border-brand-navy/5 text-brand-navy text-[11px] font-black uppercase tracking-[0.4em] hover:bg-brand-navy hover:text-white transition-all duration-700 rounded-full group">
                 Expand Collection Matrix <LayoutGrid size={14} className="inline ml-4 group-hover:rotate-90 transition-transform" />
              </button>
           </div>
        </main>
      </div>
    </div>
  );
}
