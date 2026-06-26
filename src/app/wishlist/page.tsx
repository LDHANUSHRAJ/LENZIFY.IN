"use client";

import Link from "next/link";
import { Trash2, Heart } from "lucide-react";
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
        return (
            <div className="bg-[#F8F9FC] min-h-screen">
                {/* Header skeleton */}
                <div className="bg-white border-b border-[#ECECEC] pt-20 md:pt-28 pb-6 md:pb-8 px-4 sm:px-6 lg:px-12">
                    <div className="max-w-screen-xl mx-auto">
                        <div className="h-3 w-24 bg-[#ECECEC] rounded-full animate-pulse mb-4" />
                        <div className="h-10 w-64 bg-[#ECECEC] rounded-full animate-pulse mb-2" />
                        <div className="h-3 w-20 bg-[#ECECEC] rounded-full animate-pulse" />
                    </div>
                </div>
                {/* Card skeletons */}
                <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-3xl animate-pulse border border-[#ECECEC] aspect-[3/4]" />
                    ))}
                </div>
            </div>
        );
    }

    if (wishlistItems.length === 0) {
        return (
            <div className="bg-[#F8F9FC] min-h-screen">
                <div className="bg-white border-b border-[#ECECEC] pt-20 md:pt-28 pb-6 md:pb-8 px-4 sm:px-6 lg:px-12">
                    <div className="max-w-screen-xl mx-auto">
                        <p className="text-xs font-semibold uppercase tracking-widest text-[#004AAD] mb-2">Your Wishlist</p>
                        <h1 className="text-4xl font-[var(--font-hero)] italic text-[#111111]">Saved Items</h1>
                    </div>
                </div>
                <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-24 flex flex-col items-center justify-center">
                    <div className="bg-white border border-[#ECECEC] rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] p-16 text-center max-w-md w-full">
                        <div className="w-20 h-20 bg-[#F8F9FC] rounded-full flex items-center justify-center mx-auto mb-8 border border-[#ECECEC]">
                            <Heart size={32} className="text-[#004AAD]/30" />
                        </div>
                        <h2 className="text-2xl font-[var(--font-hero)] italic text-[#111111] mb-3">Your wishlist is empty</h2>
                        <p className="text-[#666666] text-sm mb-8 leading-relaxed">
                            Save your favourite frames and lenses here to revisit them later.
                        </p>
                        <Link
                            href="/products"
                            className="inline-block bg-[#03173D] text-white rounded-full px-8 py-3 font-semibold hover:bg-[#004AAD] transition-all"
                        >
                            Browse Collection
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#F8F9FC] min-h-screen">
            {/* Header */}
            <div className="bg-white border-b border-[#ECECEC] pt-20 md:pt-28 pb-6 md:pb-8 px-4 sm:px-6 lg:px-12">
                <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-[#004AAD] mb-2">Your Wishlist</p>
                        <h1 className="text-4xl font-[var(--font-hero)] italic text-[#111111]">Saved Items</h1>
                    </div>
                    <p className="text-[#666666] text-sm">{wishlistItems.length} item{wishlistItems.length !== 1 ? "s" : ""} saved</p>
                </div>
            </div>

            {/* Grid */}
            <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                    {wishlistItems.map((item, i) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3, delay: i * 0.05 }}
                            className="relative group"
                        >
                            <ProductCard product={item} />
                            {/* Remove button */}
                            <button
                                onClick={() => removeItem(item.id)}
                                className="mt-2 w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-[#666666] hover:text-red-500 border border-[#ECECEC] rounded-xl bg-white hover:border-red-200 transition-all"
                            >
                                <Trash2 size={13} />
                                Remove
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
