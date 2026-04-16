"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Heart, Grid } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/store/ProductCard";
import { getWishlist, toggleWishlist } from "@/lib/db/customer_actions";

export default function WishlistPage() {
    const [wishlistItems, setWishlistItems] = useState<any[]>([]);
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setMounted(true);
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        setLoading(true);
        const data = await getWishlist();
        // data contains objects like { id, product_id, products: { ... } }
        const formatted = data.map((item: any) => ({
            ...item.products,
            id: item.product_id,
            wishlist_id: item.id
        }));
        setWishlistItems(formatted);
        setLoading(false);
    };

    if (!mounted) return null;

    const removeItem = async (productId: string) => {
        // Optimistic UI update
        setWishlistItems(prev => prev.filter(item => item.id !== productId));
        await toggleWishlist(productId);
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading Archives...</div>;
    }

    if (wishlistItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-brand-background">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-20 h-20 bg-brand-surface rounded-full flex items-center justify-center mb-8 border border-brand-navy/5 shadow-sm"
                >
                    <Heart size={32} className="text-brand-navy/20" />
                </motion.div>
                <h1 className="text-4xl font-display text-brand-navy mb-4 uppercase tracking-widest text-center">Empty Archives</h1>
                <p className="text-brand-text-muted mb-10 max-w-sm text-center text-sm uppercase tracking-widest leading-relaxed">
                   Your curated selection of luxury eyewear is awaiting its first addition.
                </p>
                <Link href="/spectacles" className="bg-brand-navy text-white px-10 py-4 text-xs font-bold uppercase tracking-widest hover:bg-brand-gold transition-colors">
                    Access Catalog
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-background pt-32 pb-24 px-6">
            <div className="max-w-7xl mx-auto">
                <header className="mb-16 text-center lg:text-left flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-display uppercase tracking-[0.2em] text-brand-navy">Private Archives</h1>
                        <p className="text-brand-text-muted text-xs uppercase tracking-widest mt-4">Your Curated Perspective</p>
                    </div>
                    <div className="flex items-center gap-6 text-[10px] uppercase font-bold tracking-[0.3em] text-brand-navy/40">
                         <span className="flex items-center gap-2"><Grid size={14} /> Grid View</span>
                         <span className="w-px h-4 bg-brand-navy/10" />
                         <span>{wishlistItems.length} Selections</span>
                    </div>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                    <AnimatePresence mode="popLayout">
                        {wishlistItems.map((item, i) => (
                           <motion.div 
                              key={item.id}
                              layout
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.4, delay: i * 0.1 }}
                              className="relative"
                           >
                              <div className="absolute top-4 right-4 z-20">
                                 <button 
                                    onClick={() => removeItem(item.id)}
                                    className="p-3 bg-white/80 backdrop-blur-sm border border-brand-navy/5 text-brand-text-muted hover:text-red-500 transition-colors shadow-sm"
                                 >
                                    <Trash2 size={16} />
                                 </button>
                              </div>
                              <ProductCard product={item} />
                           </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
