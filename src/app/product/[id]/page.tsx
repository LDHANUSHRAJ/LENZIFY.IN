"use client";

import { products } from "@/data/products";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { Star, ShieldCheck, Truck, ShoppingBag, ArrowLeft, ChevronRight, Minus, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { toast } from "react-hot-toast";
import ProductCard from "@/components/store/ProductCard";
import { useState } from "react";

export default function ProductDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const product = products.find((p) => p.id === params.id);
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);

  if (!product) notFound();

  const handleAddToCart = () => {
    // Current addItem doesn't support quantity param yet, but we'll add it once if needed
    // or just loop it for now if our store logic is simple.
    // For now, let's just add the product.
    addItem(product);
    toast.success(`${product.name} added to cart!`, {
      style: {
        borderRadius: '0px',
        background: '#1e1b6e',
        color: '#fff',
        fontSize: '12px',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
      },
    });
  };

  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="bg-brand-background min-h-screen pt-32 pb-24 font-sans text-brand-text-primary">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumbs / Back */}
        <button 
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-brand-text-muted hover:text-brand-navy mb-12 transition-colors uppercase text-[10px] font-bold tracking-widest"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Collection
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-32">
          {/* Left: Product Images */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="relative aspect-[4/5] bg-white border border-brand-navy/5 overflow-hidden group">
              <Image 
                src={product.image} 
                alt={product.name} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                priority
              />
            </div>
            {/* Optional Thumbnail Grid can go here */}
          </motion.div>

          {/* Right: Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-center"
          >
            <div className="mb-10">
              <span className="text-brand-gold text-xs font-bold uppercase tracking-[0.3em] mb-4 block">
                {product.brand}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-brand-navy leading-tight mb-6">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < Math.floor(product.rating) ? "text-brand-gold fill-brand-gold" : "text-brand-navy/10"} />
                  ))}
                </div>
                <span className="text-[10px] text-brand-text-muted uppercase tracking-widest font-bold">
                  {product.reviews} Reviews
                </span>
              </div>
            </div>

            <div className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-brand-navy">₹{product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <span className="text-lg text-brand-text-muted line-through">₹{product.originalPrice.toLocaleString()}</span>
                )}
              </div>
              <p className="text-brand-text-muted leading-relaxed text-sm lg:text-base max-w-lg">
                {product.description}
              </p>
            </div>

            {/* Quantity and CTA */}
            <div className="space-y-8 mb-12">
              <div className="flex flex-col gap-3">
                <span className="text-[10px] uppercase font-bold tracking-widest text-brand-navy">Quantity</span>
                <div className="flex items-center w-32 border border-brand-navy/10">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex-1 py-3 flex items-center justify-center hover:bg-brand-background transition-colors border-r border-brand-navy/10"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="flex-1 text-center font-medium text-sm">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex-1 py-3 flex items-center justify-center hover:bg-brand-background transition-colors border-l border-brand-navy/10"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                   onClick={handleAddToCart}
                   className="flex-1 bg-brand-navy text-white px-8 py-5 text-sm font-semibold uppercase tracking-widest hover:bg-brand-navy-light transition-all flex items-center justify-center gap-3 group"
                >
                  <ShoppingBag size={18} className="group-hover:scale-110 transition-transform" />
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Features / Trust */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-brand-navy/5">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-background rounded-full text-brand-navy">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest mb-1 text-brand-navy">Authenticity</h4>
                  <p className="text-[10px] text-brand-text-muted uppercase tracking-wider">100% Genuine Guaranteed</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-background rounded-full text-brand-navy">
                  <Truck size={20} />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest mb-1 text-brand-navy">Express Delivery</h4>
                  <p className="text-[10px] text-brand-text-muted uppercase tracking-wider">Ships within 24-48 hours</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        <section>
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-display text-brand-navy mb-2">Complements Your Style</h2>
              <p className="text-brand-text-muted text-sm uppercase tracking-widest">Selected Pieces for you</p>
            </div>
            <Link href={`/${product.category}`} className="text-brand-navy text-xs font-bold uppercase tracking-widest border-b border-brand-navy pb-1 hover:text-brand-gold hover:border-brand-gold transition-colors flex items-center">
              Discover All <ChevronRight size={14} className="ml-1" />
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
