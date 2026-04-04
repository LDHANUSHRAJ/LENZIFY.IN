"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, ArrowUpRight, Star } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: string;
    image: string;
    category: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
    toast.success(`ZENITH ADDED: ${product.name}`, {
      style: {
        background: '#1e1b6e',
        color: '#fff',
        borderRadius: '0px',
        fontSize: '10px',
        fontWeight: '900',
        letterSpacing: '0.2em'
      },
      icon: <ShoppingBag size={14} className="text-brand-gold" />
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative flex flex-col bg-white border border-brand-navy/5 overflow-hidden transition-all duration-[1s] hover:border-brand-gold/30 hover:shadow-[0_40px_80px_rgba(30,27,110,0.08)]"
    >
      {/* Visual Terminal - The Container */}
      <Link href={`/product/${product.id}`} className="block relative aspect-[4/5] p-10 overflow-hidden bg-brand-background">
        <Image 
          src={product.image} 
          alt={product.name} 
          fill 
          className="object-contain p-8 group-hover:scale-110 transition-transform duration-[1.5s] mix-blend-multiply" 
        />
        
        {/* Floating Intelligence Overlay */}
        <div className="absolute inset-0 bg-brand-navy/0 group-hover:bg-brand-navy/5 transition-all duration-[1s] z-10" />
        
        {/* Superior Tags */}
        <div className="absolute top-6 left-6 flex flex-col gap-2 z-20">
           <span className="text-[8px] font-black uppercase tracking-[0.3em] bg-brand-navy text-white px-3 py-1.5 shadow-lg">New Entry</span>
           {/* Materials Tag - Sampled based on Category */}
           <span className="text-[8px] font-black uppercase tracking-[0.3em] bg-white border border-brand-navy/5 text-brand-navy px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-x-[-10px] group-hover:translate-x-0">
             {product.id.includes('sun') ? 'Polarized' : 'Titanium'}
           </span>
        </div>

        {/* Global Heart (Whislist) Trigger */}
        <button className="absolute top-6 right-6 p-4 bg-white shadow-xl translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 z-20 hover:text-red-500 hover:scale-110">
           <Heart size={14} strokeWidth={2.5} />
        </button>

        {/* Luxury Deployment Trigger (Quick Add) */}
        <button 
          onClick={handleQuickAdd}
          className="absolute bottom-0 left-0 right-0 bg-brand-navy text-white text-[9px] font-black uppercase tracking-[0.4em] py-6 translate-y-full group-hover:translate-y-0 transition-all duration-500 z-30 hover:bg-brand-gold flex items-center justify-center gap-4"
        >
           Access Deployment <ArrowUpRight size={14} className="opacity-40" />
        </button>
      </Link>

      {/* Product Identification Area */}
      <div className="p-8 text-center flex flex-col items-center">
         <div className="flex items-center gap-1 mb-4 opacity-20 group-hover:opacity-100 transition-all duration-700">
           {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={8} fill={s <= 4 ? "#c9a227" : "transparent"} stroke={s <= 4 ? "#c9a227" : "#0f0d3d"} />)}
         </div>
         
         <h4 className="text-sm font-black uppercase tracking-[0.2em] text-brand-navy mb-2 group-hover:text-brand-gold transition-colors duration-500">
            {product.name}
         </h4>
         <p className="text-[10px] text-brand-text-muted uppercase tracking-[0.3em] mb-4">
            Zenith Series {product.id.slice(-4)}
         </p>
         
         <div className="relative overflow-hidden h-6 w-full flex flex-col items-center">
            <p className="text-lg font-bold text-brand-navy group-hover:-translate-y-full transition-transform duration-500">
               {product.price}
            </p>
            <p className="absolute top-full text-[9px] font-black uppercase tracking-[0.4em] text-brand-gold group-hover:-translate-y-full transition-transform duration-500 italic">
               Curated Selection
            </p>
         </div>
      </div>
    </motion.div>
  );
}
