"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number | string;
    primary_image?: string;
    image?: string; // Fallback
    category?: string;
    categories?: { name: string; slug: string };
    brand?: string;
    rating?: number;
    slug?: string;
    discount_price?: number;
  };
}

import { useAuth } from "@/components/providers/AuthProvider";

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();
  const { user } = useAuth();

  const rawPrice = typeof product.price === 'string' ? parseFloat(product.price) : (product.price || 0);
  const rawDiscount = typeof product.discount_price === 'string' ? parseFloat(product.discount_price) : (product.discount_price || null);
  
  const [imgSrc, setImgSrc] = useState(product.primary_image || product.image || "/placeholder.jpg");
  const displayImage = imgSrc;
  const displayPrice = rawDiscount !== null ? rawDiscount : rawPrice;
  const originalPrice = rawPrice;
  const hasDiscount = rawDiscount !== null && rawDiscount < rawPrice;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    addItem({
      id: product.id,
      name: product.name,
      price: displayPrice,
      image: displayImage,
      quantity: 1
    } as any);
    toast.success(`ADDED TO CART: ${product.name}`, {
      style: {
        background: '#000000',
        color: '#fff',
        borderRadius: '2px',
        fontSize: '10px',
        fontWeight: '700',
        letterSpacing: '0.3em',
        padding: '20px',
        border: '1px solid rgba(255,255,255,0.1)'
      },
      icon: <span className="material-symbols-outlined text-secondary">shopping_cart</span>
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" } as any}
      className="group flex flex-col bg-surface border border-black/5 overflow-hidden transition-all duration-300 hover:bg-surface-container-low editorial-shadow"
    >
      {/* Product Image Area */}
      <div className="relative aspect-[4/5] p-12 overflow-hidden bg-surface-container-low">
        <Link href={`/product/${product.slug || product.id}`} className="absolute inset-0 z-10" aria-label={`View ${product.name}`}>
          <Image 
            src={displayImage} 
            alt={product.name} 
            fill 
            onError={() => setImgSrc("/placeholder.jpg")}
            className="object-contain p-10 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[1.2s] ease-out" 
          />
          
          {/* Subtle Overlay */}
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/[0.02] transition-colors duration-700" />
        </Link>
        
        {/* Discount Badge */}
        {product.discount_price && product.discount_price < displayPrice && (
          <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1 z-20 pointer-events-none">
            Sale
          </div>
        )}

        {/* Action Triggers */}
        <button 
           suppressHydrationWarning
           onClick={(e) => { e.preventDefault(); e.stopPropagation(); /* Wishlist trigger */ }}
           className="absolute top-6 right-6 w-12 h-12 bg-surface flex items-center justify-center translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 border border-outline/10 transition-all duration-500 z-20 hover:text-secondary hover:border-secondary shadow-lg"
        >
           <span className="material-symbols-outlined text-lg">favorite</span>
        </button>

        {/* Acquisition Deployment */}
        <button 
          suppressHydrationWarning
          onClick={handleQuickAdd}
          className="absolute bottom-0 left-0 right-0 bg-primary text-on-primary text-[10px] font-bold uppercase tracking-[0.4em] py-6 translate-y-full group-hover:translate-y-0 transition-all duration-700 z-20 hover:bg-secondary transition-colors flex items-center justify-center gap-4 italic"
        >
           Add to Cart <span className="material-symbols-outlined text-sm">shopping_cart</span>
        </button>
      </div>

      {/* Product Details Area */}
      <div className="p-8 space-y-4 text-center flex flex-col items-center">
         <div className="space-y-2">
            <h4 className="text-xl font-serif italic text-primary leading-tight group-hover:text-secondary transition-colors duration-700 uppercase">
               {product.name}
            </h4>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface/30">
               {product.brand || "Lenzify Archive"}
            </p>
         </div>
         
          <div className="pt-4 border-t border-black/5 w-full flex flex-col items-center gap-4">
             <p className="text-2xl font-serif italic text-primary flex items-center gap-2">
                {hasDiscount ? (
                  <>
                    <span className="text-sm font-sans font-bold not-italic opacity-50 line-through mr-1">₹{originalPrice.toLocaleString()}</span>
                    <span className="text-red-600"><span className="text-sm font-sans font-bold not-italic mr-1 opacity-50">₹</span>{displayPrice.toLocaleString()}</span>
                  </>
                ) : (
                  <><span className="text-sm font-sans font-bold not-italic mr-1 opacity-50">₹</span>{displayPrice.toLocaleString()}</>
                )}
             </p>


          </div>
      </div>
    </motion.div>
  );
}
