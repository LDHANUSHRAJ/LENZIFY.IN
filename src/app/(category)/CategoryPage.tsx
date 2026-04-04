"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/products";
import { Filter, ChevronDown, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ui/ProductCard";

export default function CategoryPage() {
    const pathname = usePathname();
    const category = pathname.replace("/", "");
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ");

    const [activeSeries, setActiveSeries] = useState<string | null>(null);

    const baseProducts = products.filter(p => p.category === category || (category === "spectacles" && p.category === "spectacles"));
    const filteredProducts = activeSeries
        ? baseProducts.filter(p => p.name.includes(activeSeries) || (activeSeries === "Elite" && p.price > 15000))
        : baseProducts;

    return (
        <div className="min-h-screen bg-[#0B1C2D] pt-32 pb-20 overflow-hidden">
            {/* Cinematic Hero */}
            <div className="max-w-[1400px] mx-auto px-8 mb-20 relative">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col md:flex-row justify-between items-end gap-10"
                >
                    <div>
                        <span className="text-brand-electric text-[10px] font-black tracking-[0.5em] uppercase mb-4 block">Engineered Vision</span>
                        <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.8] mb-4">{categoryName}</h1>
                        <div className="h-1 w-32 bg-brand-electric" />
                    </div>
                    <div className="text-right">
                        <p className="text-white/20 text-[10px] font-black tracking-widest uppercase mb-2">Collection Node</p>
                        <p className="text-xl font-bold italic uppercase">{filteredProducts.length} Active Protocols</p>
                    </div>
                </motion.div>

                {/* Decorative Elements */}
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-brand-electric/5 blur-[120px] rounded-full pointer-events-none" />
            </div>

            <div className="max-w-[1400px] mx-auto px-8">
                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-16">
                    {/* Filters - Glass Panel Sidebar */}
                    <aside className="lg:col-span-3 space-y-12">
                        <div className="glass-morphism p-10 rounded-[40px] border-white/5">
                            <h3 className="text-white font-black uppercase italic tracking-widest text-sm mb-10 flex items-center gap-3">
                                <SlidersHorizontal size={16} className="text-brand-electric" /> Parameters
                            </h3>

                            <div className="space-y-12">
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-8">Valuation Threshold</h4>
                                    <input type="range" className="w-full h-1 bg-white/5 rounded-full accent-brand-electric cursor-pointer" />
                                    <div className="flex justify-between text-[10px] text-white/20 mt-6 font-black tracking-widest">
                                        <span>₹500</span>
                                        <span>₹25K+</span>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-8">Series Filter</h4>
                                    <div className="space-y-5">
                                        {[null, "Elite", "Pro", "Performance"].map(series => (
                                            <button
                                                key={series || 'all'}
                                                onClick={() => setActiveSeries(series)}
                                                className={`flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] smooth-transition group w-full text-left ${activeSeries === series ? 'text-brand-electric' : 'text-white/40 hover:text-white'}`}
                                            >
                                                <div className={`w-2 h-2 rounded-full border border-current flex items-center justify-center`}>
                                                    {activeSeries === series && <div className="w-1 h-1 bg-current rounded-full" />}
                                                </div>
                                                {series || 'All Assets'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="lg:col-span-9">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                            <AnimatePresence mode="popLayout">
                                {filteredProducts.map((product, i) => (
                                    <motion.div
                                        key={product.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                    >
                                        <ProductCard product={product} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
