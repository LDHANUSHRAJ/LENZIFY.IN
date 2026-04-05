"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, ArrowUpRight, Star } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, [supabase.auth]);

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
      price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
      image: product.image,
      quantity: 1
    } as any);
    toast.success(`ARCHIVE ADDED: ${product.name}`, {
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
      icon: <ShoppingBag size={14} className="text-secondary" />
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col bg-white border border-outline/5 overflow-hidden transition-all duration-700 hover:border-primary/20 editorial-shadow"
    >
      {/* Product Image Area */}
      <Link href={`/product/${product.id}`} className="block relative aspect-[4/5] p-12 overflow-hidden bg-surface-container-low">
        <Image 
          src={product.image} 
          alt={product.name} 
          fill 
          className="object-contain p-10 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1.2s] ease-out mix-blend-multiply" 
        />
        
        {/* Subtle Overlay */}
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/[0.02] transition-colors duration-700" />
        
        {/* Editorial Badges */}
        <div className="absolute top-6 left-6 flex flex-col gap-3 z-20">
           <span className="text-[9px] font-bold uppercase tracking-[0.4em] bg-primary text-white px-4 py-2 italic font-serif">A/W 2024</span>
           <span className="text-[8px] font-bold uppercase tracking-[0.3em] bg-white border border-outline/10 px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-x-[-10px] group-hover:translate-x-0">
             {product.id.includes('sun') ? 'Polarized Optics' : 'Aerospace Grade'}
           </span>
        </div>

        {/* Action Triggers */}
        <button className="absolute top-6 right-6 w-12 h-12 bg-white flex items-center justify-center translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 border border-outline/10 transition-all duration-500 z-20 hover:text-secondary hover:border-secondary">
           <Heart size={14} />
        </button>

        {/* Acquisition Deployment */}
        <button 
          onClick={handleQuickAdd}
          className="absolute bottom-0 left-0 right-0 bg-[#000000] text-white text-[10px] font-bold uppercase tracking-[0.4em] py-6 translate-y-full group-hover:translate-y-0 transition-all duration-700 z-30 hover:bg-white hover:text-primary border-t border-white/5 flex items-center justify-center gap-4 italic"
        >
           Acquire Vision <ArrowUpRight size={14} className="opacity-40" />
        </button>
      </Link>

      {/* Product Details Area */}
      <div className="p-8 space-y-6 text-center lg:text-left flex flex-col">
         <div className="space-y-3">
            <div className="flex justify-center lg:justify-start items-center gap-1.5 opacity-30 group-hover:opacity-100 transition-all duration-1000">
              {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={10} fill={s <= 4 ? "#775a19" : "transparent"} stroke={s <= 4 ? "#775a19" : "#000"} />)}
            </div>
            
            <h4 className="text-xl font-serif italic text-primary leading-tight group-hover:text-secondary transition-colors duration-700">
               {product.name}
            </h4>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface/30">
               Series {product.id.slice(-4)} Archival Entry
            </p>
         </div>
         
         <div className="relative pt-6 border-t border-outline/5 overflow-hidden h-14 w-full flex flex-col items-center lg:items-start group/price">
            <p className="text-2xl font-serif italic text-primary group-hover:-translate-y-full transition-transform duration-700 ease-in-out">
               <span className="text-sm font-sans font-bold not-italic mr-1 opacity-50">₹</span>{product.price}
            </p>
            <p className="absolute top-6 left-0 right-0 lg:right-auto text-[9px] font-bold uppercase tracking-[0.4em] text-secondary opacity-0 group-hover:opacity-100 transition-all duration-700 italic">
               Secured Deployment Available
            </p>
         </div>
      </div>
    </motion.div>
  );
}
