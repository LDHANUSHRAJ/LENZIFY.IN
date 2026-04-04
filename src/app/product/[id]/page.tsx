"use client";

import { products } from "@/data/products";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { Star, ShieldCheck, Truck, RefreshCcw, ShoppingBag, Zap, ArrowLeft, ChevronRight } from "lucide-react";
import GlowButton from "@/components/ui/GlowButton";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { toast } from "react-hot-toast";
import ProductCard from "@/components/ui/ProductCard";

export default function ProductDetail({ params }: { params: { id: string } }) {
    const router = useRouter();
    const product = products.find((p) => p.id === params.id);
    const addItem = useCartStore((state) => state.addItem);

    if (!product) notFound();

    const handleAddToCart = () => {
        addItem(product);
        toast.success(`${product.name} added to cart!`, {
            style: { background: '#0B1C2D', color: '#fff', border: '1px solid rgba(47,140,255,0.2)' }
        });
    };

    const handleBuyNow = () => {
        addItem(product);
        router.push("/checkout");
    };

    const relatedProducts = products.filter(p => p.id !== product.id).slice(0, 4);

    return (
        <div className="relative min-h-screen bg-[#0B1C2D] pt-32 pb-20 overflow-hidden">
            {/* Cinematic Background Gradient */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#2F8CFF]/5 to-transparent pointer-events-none" />

            <div className="max-w-[1400px] mx-auto px-8 relative z-10">
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => router.back()}
                    className="group flex items-center gap-3 text-white/40 hover:text-white mb-16 smooth-transition uppercase text-[10px] font-black tracking-[0.4em]"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 smooth-transition" /> Back to Protocol
                </motion.button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                    {/* Left: Product Image Scaling Entry */}
                    <div className="lg:col-span-7">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
                            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            className="relative aspect-[4/5] rounded-[40px] overflow-hidden border border-white/5 bg-brand-navy-dark shadow-2xl"
                        >
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1C2D]/40 to-transparent" />
                        </motion.div>
                    </div>

                    {/* Right: Glass Panel Slide-in Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                        className="lg:col-span-5 flex flex-col justify-center"
                    >
                        <div className="glass-morphism p-12 rounded-[40px] border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-32 bg-brand-electric opacity-50" />

                            <div className="mb-10">
                                <span className="text-brand-electric text-[10px] font-black tracking-[0.5em] uppercase mb-4 block">{product.brand}</span>
                                <h1 className="text-5xl md:text-6xl font-black mb-6 uppercase tracking-tighter italic leading-[0.9]">{product.name}</h1>
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} className={i < 4 ? "text-brand-electric fill-brand-electric" : "text-white/10"} />
                                        ))}
                                    </div>
                                    <span className="text-white/20 text-[10px] uppercase font-black tracking-widest">Certified Precision</span>
                                </div>
                            </div>

                            <div className="mb-12">
                                <div className="text-4xl font-black mb-6">₹{product.price.toLocaleString()}</div>
                                <p className="text-white/60 leading-relaxed font-medium italic text-lg pr-4">
                                    "{product.description || "Uncompromising clarity meets high-performance engineering. A testament to ocular luxury."}"
                                </p>
                            </div>

                            <div className="flex flex-col gap-4 mb-12">
                                <GlowButton onClick={handleBuyNow} className="w-full py-6 text-xl">
                                    <Zap size={20} className="mr-2" /> Buy Instant
                                </GlowButton>
                                <button
                                    onClick={handleAddToCart}
                                    className="group w-full py-6 rounded-full border border-white/10 hover:border-brand-electric smooth-transition flex items-center justify-center gap-4"
                                >
                                    <ShoppingBag size={20} className="group-hover:text-brand-electric smooth-transition" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Add to Neural Cart</span>
                                </button>
                            </div>

                            {/* Trust Markers */}
                            <div className="grid grid-cols-2 gap-6 pt-10 border-t border-white/5">
                                <div className="flex items-center gap-4 text-white/40">
                                    <ShieldCheck size={20} className="text-brand-electric" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Global Warranty</span>
                                </div>
                                <div className="flex items-center gap-4 text-white/40">
                                    <Truck size={20} className="text-brand-electric" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Express Access</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Related Products Horizontal Scroll */}
                <section className="mt-40">
                    <div className="flex justify-between items-end mb-16">
                        <div>
                            <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">Related</h2>
                            <div className="h-1 w-20 bg-brand-electric mt-4" />
                        </div>
                        <Link href="/spectacles" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-white smooth-transition">
                            View All <ChevronRight size={14} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {relatedProducts.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
