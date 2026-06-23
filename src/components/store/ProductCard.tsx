"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { addToCart, toggleWishlist } from "@/lib/db/customer_actions";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number | string;
    primary_image?: string;
    image?: string; // Fallback
    product_images?: Array<{ image_url: string; is_primary: boolean }>;
    category?: string;
    categories?: { name: string; slug: string };
    brand?: string;
    rating?: number;
    slug?: string;
    discount_price?: number;
    colors?: string[];
  };
}

import { useAuth } from "@/components/providers/AuthProvider";

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, removeItem } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const router = useRouter();
  const { user } = useAuth();

  const getInitialImage = () => {
    if (product.primary_image) return product.primary_image;
    if (product.image) return product.image;
    if (product.product_images && product.product_images.length > 0) {
      const primary = product.product_images.find(img => img.is_primary);
      return primary ? primary.image_url : product.product_images[0].image_url;
    }
    return "/placeholder.jpg";
  };

  const [imgSrc, setImgSrc] = useState(getInitialImage());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setImgSrc(getInitialImage());
    setIsLoaded(false);
  }, [product.id, product.primary_image, product.image, product.product_images]);

  const rawPrice = Number(product.price) || 0;
  const rawDiscount = product.discount_price ? Number(product.discount_price) : null;
  
  const hasValidDiscount = rawDiscount !== null && rawDiscount < rawPrice;
  const displayPrice = hasValidDiscount ? rawDiscount : rawPrice;
  const originalPrice = rawPrice;
  const hasDiscount = hasValidDiscount;

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    // 1. Sync local store FIRST for instant Navbar feedback (Optimistic Update)
    const tempItem = {
      id: product.id,
      name: product.name,
      price: displayPrice,
      image: imgSrc,
      quantity: 1
    };
    
    addItem(tempItem as any);

    const toastId = toast.loading('ADDING TO CART...', {
      style: {
        background: '#000000',
        color: '#fff',
        borderRadius: '2px',
        fontSize: '10px',
        fontWeight: '700',
        letterSpacing: '0.3em',
        padding: '20px',
        border: '1px solid rgba(255,255,255,0.1)'
      }
    });

    try {
      // 2. Add to database (The source of truth)
      const result = await addToCart(product.id, {
        quantity: 1,
        price: displayPrice
      });

      if (result.success) {
        toast.success(`ADDED TO CART: ${product.name}`, {
          id: toastId,
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
      } else {
        throw new Error("Failed to add to database");
      }
    } catch (err) {
      // Rollback local state if database fails
      removeItem(product.id);
      toast.error("COULD NOT ADD TO CART", { id: toastId });
    }
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    try {
      const result = await toggleWishlist(product.id);
      if (result.success) {
        // Sync local store
        if (isInWishlist(product.id)) {
          removeFromWishlist(product.id);
        } else {
          addToWishlist(product as any);
        }

        toast.success("WISHLIST UPDATED", {
          style: {
            background: '#000000',
            color: '#fff',
            borderRadius: '2px',
            fontSize: '10px',
            fontWeight: '700',
            letterSpacing: '0.3em',
            padding: '20px',
            border: '1px solid rgba(255,255,255,0.1)'
          }
        });
      }
    } catch (err) {
      toast.error("WISHLIST ERROR");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" } as any}
      className="group flex flex-col bg-white border border-black/[0.06] overflow-hidden rounded-[14px] transition-all duration-300 hover:shadow-md editorial-shadow"
    >
      {/* Product Image Area */}
      <div className="relative aspect-square overflow-hidden bg-[#F5F2EE]">
        <Link href={`/product/${product.slug || product.id}`} className="absolute inset-0 z-10" aria-label={`View ${product.name}`}>
          <Image 
            src={imgSrc} 
            alt={product.name} 
            fill 
            onError={() => setImgSrc("/placeholder.jpg")}
            className="object-contain p-3 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1.2s] ease-out" 
          />
          
          {/* Subtle Overlay */}
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/[0.02] transition-colors duration-700" />
        </Link>
        
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1 z-20 pointer-events-none">
            Sale
          </div>
        )}

        {/* Action Triggers */}
        <button 
           suppressHydrationWarning
           onClick={handleWishlist}
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
      <div className="px-4 py-3 flex flex-col gap-1">
        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-on-surface/40">
          {product.brand || "Lenzify"}
        </p>
        <h4 className="text-sm font-serif italic text-primary leading-tight group-hover:text-secondary transition-colors duration-500 line-clamp-1">
          {product.name}
        </h4>
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm font-bold text-primary flex items-center gap-1">
            {hasDiscount ? (
              <>
                <span className="text-xs font-sans opacity-40 line-through">₹{originalPrice.toLocaleString()}</span>
                <span className="text-red-600">₹{displayPrice.toLocaleString()}</span>
              </>
            ) : (
              <span>₹{displayPrice.toLocaleString()}</span>
            )}
          </p>
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1">
              {(product.colors as string[]).slice(0, 4).map((color: string, i: number) => (
                <span
                  key={i}
                  title={color}
                  className="w-3 h-3 rounded-full border border-black/10 inline-block"
                  style={{ backgroundColor: color.startsWith('#') ? color : undefined, background: !color.startsWith('#') ? color : undefined }}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-[9px] text-on-surface/30 font-bold">+{product.colors.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
