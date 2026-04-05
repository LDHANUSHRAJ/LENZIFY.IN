"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/store/ProductCard";
import { products, Product } from "@/data/products";
import { ChevronDown, SlidersHorizontal, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CategoryPageProps {
    category: "spectacles" | "lenses" | "contact-lenses" | "sunglasses" | "accessories";
    title: string;
    description: string;
}

export default function CategoryPageTemplate({ category, title, description }: CategoryPageProps) {
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [sortBy, setSortBy] = useState("featured");
    const [searchQuery, setSearchQuery] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    useEffect(() => {
        let result = products.filter(p => !category || p.category === category);
        
        if (searchQuery) {
            result = result.filter(p => 
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                p.brand.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (sortBy === "price-low") {
            result.sort((a, b) => a.price - b.price);
        } else if (sortBy === "price-high") {
            result.sort((a, b) => b.price - a.price);
        } else if (sortBy === "rating") {
            result.sort((a, b) => b.rating - a.rating);
        }

        setFilteredProducts(result);
    }, [category, sortBy, searchQuery]);

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } as any
    };

    return (
        <div className="bg-surface min-h-screen pt-32 pb-32">
            {/* Category Hero */}
            <section className="max-w-screen-2xl mx-auto px-8 md:px-12 mb-24">
                <div className="relative p-12 md:p-24 bg-[#000000] overflow-hidden rounded-sm">
                    {/* Abstract background elements */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 blur-[100px] rounded-full translate-x-1/4 -translate-y-1/4" />
                    
                    <div className="relative z-10 max-w-3xl space-y-8">
                        <div className="space-y-4">
                            <span className="text-secondary text-[10px] font-bold uppercase tracking-[0.5em] block italic">
                                Archival Collection
                            </span>
                            <h1 className="text-5xl md:text-8xl font-serif text-white italic leading-none tracking-tight">
                                {title}
                            </h1>
                        </div>
                        <p className="text-white/40 text-sm md:text-lg leading-relaxed max-w-xl font-medium italic">
                            {description}
                        </p>
                        <div className="pt-4">
                            <div className="h-px w-24 bg-secondary/30"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Filter Bar */}
            <section className="max-w-screen-2xl mx-auto px-8 md:px-12 mb-16">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-y border-outline/10 py-10">
                    <div className="flex flex-wrap items-center gap-6">
                        <button 
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="flex items-center gap-3 px-8 py-4 bg-primary text-white text-[10px] font-bold uppercase tracking-widest hover:opacity-80 transition-all"
                        >
                            <SlidersHorizontal size={14} />
                            Refine Access
                        </button>
                        
                        <div className="relative w-full md:w-80">
                            <Search size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface/30" />
                            <input 
                                type="text" 
                                placeholder="SEARCH ARCHIVE..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-surface-container border border-outline/10 pl-14 pr-6 py-4 text-[10px] font-bold tracking-widest outline-none focus:border-secondary transition-all uppercase placeholder:text-on-surface/20"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-8 justify-between lg:justify-end">
                        <p className="text-[10px] text-on-surface/40 uppercase tracking-widest font-bold italic">
                            Showing {filteredProducts.length} entries
                        </p>
                        
                        <div className="relative">
                            <select 
                                onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none bg-surface-container border border-outline/10 pl-8 pr-14 py-4 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-secondary cursor-pointer italic"
                            >
                                <option value="featured">Sort: Featured</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Rating: High to Low</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface/40" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Product Grid */}
            <section className="max-w-screen-2xl mx-auto px-8 md:px-12">
                <AnimatePresence mode="wait">
                    {filteredProducts.length > 0 ? (
                        <motion.div 
                            key="grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-20"
                        >
                            {filteredProducts.map((p, i) => (
                                <motion.div key={p.id} {...fadeInUp} transition={{ ...fadeInUp.transition, delay: (i % 4) * 0.1 }}>
                                    <ProductCard product={p} />
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="empty"
                            {...fadeInUp}
                            className="py-48 text-center space-y-6"
                        >
                            <h3 className="font-serif text-5xl text-on-surface/10 uppercase italic tracking-tighter">
                                No Vision Found
                            </h3>
                            <button 
                                onClick={() => {setSearchQuery(""); setSortBy("featured")}}
                                className="text-secondary hover:text-primary font-bold uppercase text-[10px] tracking-widest transition-colors underline underline-offset-8 decoration-secondary/30"
                            >
                                Reset Search Parameters
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>
        </div>
    );
}
