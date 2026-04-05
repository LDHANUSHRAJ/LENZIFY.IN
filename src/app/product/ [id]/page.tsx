"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { products as allProducts } from "@/data/products";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { cn } from "@/lib/utils";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = allProducts.find(p => p.id === id);
  
  const [activeTab, setActiveTab] = useState<"features" | "specs" | "shipping">("features");
  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-headline font-bold text-white uppercase italic mb-8">Spectrum Not Detected</h1>
        <Link href="/products" className="bg-primary text-slate-900 px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-widest">Return to Catalogue</Link>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background min-h-screen border-t border-white/5">
      <main className="max-w-screen-2xl mx-auto px-8 py-20">
        <div className="flex flex-col lg:flex-row gap-20 items-start">
          {/* Left: Product Image / Show */}
          <div className="w-full lg:w-1/2 sticky top-32">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square rounded-[4rem] bg-slate-900/40 border border-white/5 p-16 flex items-center justify-center group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
              <Image 
                src={product.image} 
                alt={product.name} 
                fill 
                priority
                className="object-contain p-12 transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-6" 
              />
              
              <div className="absolute bottom-10 left-10 right-10 flex justify-center gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 p-2 cursor-pointer hover:bg-white/10 transition-all">
                    <Image src={product.image} alt="Angle" width={60} height={60} className="object-contain w-full h-full" />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: Info */}
          <div className="w-full lg:w-1/2 space-y-12">
            <header className="space-y-6">
              <div className="flex flex-wrap items-center gap-4">
                <span className="bg-primary/20 text-primary text-[10px] font-black px-4 py-1.5 rounded-full border border-primary/30 uppercase tracking-[0.2em]">{product.brand}</span>
                {product.isNew && <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-4 py-1.5 rounded-full border border-emerald-500/30 uppercase tracking-[0.2em]">New Protocol</span>}
                <div className="flex items-center gap-1.5 ml-auto">
                    <span className="material-symbols-outlined text-[14px] text-yellow-500 fill-1">star</span>
                    <span className="text-sm text-white font-black">{product.rating}</span>
                </div>
              </div>

              <h1 className="text-6xl md:text-7xl font-headline font-bold text-white tracking-tighter uppercase italic leading-[0.8]">
                {product.name}
              </h1>
              
              <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-xl">
                {product.description}
              </p>

              <div className="flex items-center gap-6 pt-4">
                <span className="text-5xl font-headline font-bold text-white italic tracking-tighter">₹{product.price}</span>
                {product.originalPrice && (
                    <span className="text-xl text-slate-500 line-through font-bold">₹{product.originalPrice}</span>
                )}
                <span className="bg-secondary/10 text-secondary text-[10px] font-black px-4 py-1.5 rounded-full border border-secondary/30 uppercase tracking-[0.2em]">Tax Included</span>
              </div>
            </header>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6">
              <button 
                onClick={() => addItem(product)}
                className="flex-grow py-6 bg-primary text-slate-900 font-black text-xs uppercase tracking-[0.3em] rounded-[2rem] hover:bg-white hover:shadow-[0_0_40px_rgba(165,200,255,0.4)] transition-all duration-700 active:scale-95 text-center group relative overflow-hidden"
              >
                <span className="relative z-10">Add to Vault</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
              </button>
              
              <button 
                onClick={() => {
                   isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product);
                }}
                className={cn(
                  "w-20 h-20 rounded-[2rem] border flex items-center justify-center transition-all duration-500 active:scale-90",
                  isInWishlist(product.id) ? "bg-red-500/10 border-red-500/30 text-red-500" : "bg-white/5 border-white/10 text-white/40 hover:text-white"
                )}
              >
                <span className={cn("material-symbols-outlined text-2xl", isInWishlist(product.id) && "fill-1")}>favorite</span>
              </button>
            </div>

            {/* Tabs */}
            <div className="space-y-8 pt-8">
              <div className="flex gap-10 border-b border-white/5 pb-4">
                {["features", "specs", "shipping"].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={cn(
                      "text-[10px] font-black uppercase tracking-[0.3em] transition-all relative pb-4",
                      activeTab === tab ? "text-primary" : "text-slate-500 hover:text-white"
                    )}
                  >
                    {tab}
                    {activeTab === tab && <motion.div layoutId="tab-underline" className="absolute bottom-[-1px] left-0 right-0 h-px bg-primary" />}
                  </button>
                ))}
              </div>

              <div className="min-h-[100px]">
                {activeTab === "features" && (
                    <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                        <li className="flex items-center gap-4 text-xs font-bold text-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Multi-layered Anti-Reflective Protocol
                        </li>
                        <li className="flex items-center gap-4 text-xs font-bold text-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Blue Light Attenuation System
                        </li>
                        <li className="flex items-center gap-4 text-xs font-bold text-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Scratch-Resistant Hard Coat Layer
                        </li>
                    </motion.ul>
                )}
                {activeTab === "specs" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 gap-8">
                        <div>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Architecture</p>
                            <p className="text-white text-xs font-bold">Aerospace Grade</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Weight</p>
                            <p className="text-white text-xs font-bold">14.2 Grams</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Lens Width</p>
                            <p className="text-white text-xs font-bold">54mm</p>
                        </div>
                    </motion.div>
                )}
              </div>
            </div>

            {/* Security Note */}
            <div className="flex items-center gap-6 p-8 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10">
              <span className="material-symbols-outlined text-emerald-400">verified</span>
              <div className="flex-grow">
                 <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Authenticity Protocol Guaranteed</p>
                 <p className="text-[9px] text-slate-500 uppercase tracking-widest font-medium">Digital verification certificate provided on purchase.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
