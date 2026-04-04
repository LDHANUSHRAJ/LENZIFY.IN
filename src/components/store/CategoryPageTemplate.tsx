"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/store/ProductCard";
import { products, Product } from "@/data/products";
import { ChevronDown, SlidersHorizontal, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CategoryPageProps {
    category: "spectacles" | "lenses" | "contact-lenses";
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

    return (
        <div className="bg-brand-background min-h-screen pt-32 font-sans overflow-hidden">
            {/* Category Hero */}
            <section className="max-w-7xl mx-auto px-6 mb-20">
                <div className="relative p-12 md:p-20 bg-brand-navy overflow-hidden">
                    {/* Abstract background elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-gold/5 blur-2xl rounded-full -translate-x-1/3 translate-y-1/3" />
                    
                    <div className="relative z-10 max-w-2xl">
                        <span className="text-brand-gold text-xs font-bold uppercase tracking-[0.4em] mb-4 block">
                            Limited Edition Collection
                        </span>
                        <h1 className="text-5xl md:text-7xl font-display text-white leading-tight mb-6">
                            {title}
                        </h1>
                        <p className="text-white/60 text-sm md:text-base leading-relaxed tracking-wide">
                            {description}
                        </p>
                    </div>
                </div>
            </section>

            {/* Filter Bar */}
            <section className="max-w-7xl mx-auto px-6 mb-12 border-b border-brand-navy/5 pb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="flex items-center gap-2 bg-brand-navy text-white px-5 py-3 text-xs font-bold uppercase tracking-widest hover:bg-brand-gold transition-colors"
                        >
                            <SlidersHorizontal size={14} />
                            Filters
                        </button>
                        
                        <div className="relative group flex-1 md:w-64">
                            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-navy/40" />
                            <input 
                                type="text" 
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-brand-surface border border-brand-navy/10 pl-10 pr-4 py-3 text-xs outline-none focus:border-brand-gold transition-colors"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <p className="text-[10px] text-brand-text-muted uppercase tracking-widest font-black">
                            {filteredProducts.length} Results
                        </p>
                        
                        <div className="relative group">
                            <select 
                                onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none bg-brand-surface border border-brand-navy/10 pl-5 pr-10 py-3 text-xs font-bold uppercase tracking-widest outline-none focus:border-brand-gold cursor-pointer"
                            >
                                <option value="featured">Sort: Featured</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Rating: High to Low</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-brand-navy" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Product Grid */}
            <section className="max-w-7xl mx-auto px-6 pb-24">
                <AnimatePresence mode="wait">
                    {filteredProducts.length > 0 ? (
                        <motion.div 
                            key="grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16"
                        >
                            {filteredProducts.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="empty"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="py-40 text-center"
                        >
                            <h3 className="font-display text-4xl text-brand-navy/20 mb-4 uppercase tracking-tighter">
                                No Vision Found
                            </h3>
                            <button 
                                onClick={() => {setSearchQuery(""); setSortBy("featured")}}
                                className="text-brand-gold hover:text-brand-navy font-bold uppercase text-xs tracking-widest transition-colors underline"
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
