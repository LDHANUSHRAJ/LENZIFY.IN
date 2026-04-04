"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, Heart, ShoppingBag } from "lucide-react";
import { Product } from "@/data/products";
import { useCartStore } from "@/store/cartStore";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(`${product.name} added to cart`, {
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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group"
    >
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-[4/5] bg-brand-background overflow-hidden border border-brand-navy/5">
          {/* Image */}
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90"
          />
          
          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-brand-navy/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Top Badges */}
          {product.originalPrice && (
            <div className="absolute top-4 left-4 bg-brand-gold text-white text-[10px] uppercase tracking-widest px-2 py-1">
              Sale
            </div>
          )}
          
          <button className="absolute top-4 right-4 w-8 h-8 bg-white/80 backdrop-blur-sm border border-brand-navy/5 flex items-center justify-center text-brand-navy hover:text-brand-gold transition-colors opacity-0 group-hover:opacity-100 translate-y-[-10px] group-hover:translate-y-0 transition-all duration-300">
            <Heart size={14} />
          </button>

          {/* Quick Add Button */}
          <button 
            onClick={handleAddToCart}
            className="absolute bottom-0 left-0 right-0 bg-brand-navy text-white py-4 flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out uppercase text-[10px] font-bold tracking-[0.2em]"
          >
            <ShoppingBag size={14} />
            Quick Add
          </button>
        </div>

        {/* Product Info */}
        <div className="mt-6 space-y-1">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-brand-text-muted uppercase tracking-widest font-semibold">
              {product.brand}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-brand-gold font-bold">★</span>
              <span className="text-[10px] text-brand-text-muted">{product.rating}</span>
            </div>
          </div>
          
          <h3 className="font-display text-lg text-brand-navy group-hover:text-brand-gold transition-colors duration-300">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-brand-navy">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-brand-text-muted line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
