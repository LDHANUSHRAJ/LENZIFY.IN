"use client";

import { motion } from "framer-motion";
import { Layers, ShieldCheck, Zap, Sparkles, ChevronRight } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";

interface LensCardProps {
  lens: {
    id: string;
    name: string;
    description: string;
    price: number;
    features?: string[];
    category?: string;
    sub_category?: string;
  };
}

export default function LensCard({ lens }: LensCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();
  const { user } = useAuth();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    addItem({
      id: lens.id,
      name: lens.name,
      price: lens.price,
      image: "", // Lenses typically don't have separate product images
      quantity: 1,
      metadata: { type: 'lens', category: lens.category, sub_category: lens.sub_category }
    } as any);

    toast.success(`ADDED TO SELECTION: ${lens.name}`, {
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
      icon: <Layers className="text-secondary w-4 h-4" />
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white border border-outline/10 p-10 flex flex-col justify-between h-full hover:border-secondary transition-all duration-500 editorial-shadow relative overflow-hidden"
    >
        {/* Abstract Lens Graphic Background */}
        <div className="absolute -right-10 -top-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 pointer-events-none">
            <Layers size={200} className="text-primary rotate-12" />
        </div>

      <div className="space-y-8 relative z-10">
        <div className="flex justify-between items-start">
            <div className="w-12 h-12 bg-primary/5 flex items-center justify-center rounded-sm group-hover:bg-secondary/10 transition-colors">
                <Sparkles size={20} className="text-primary/40 group-hover:text-secondary transition-colors" />
            </div>
            <div className="px-3 py-1 bg-primary/5 border border-primary/10">
                <span className="text-[8px] font-black tracking-widest uppercase text-primary">Precision Lens</span>
            </div>
        </div>

        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary italic">
            {lens.sub_category || lens.category || 'Optical Elite'}
          </p>
          <h3 className="text-3xl font-serif italic text-primary uppercase leading-tight group-hover:text-secondary transition-colors">
            {lens.name}
          </h3>
          <p className="text-xs text-on-surface/50 font-medium italic line-clamp-2">
            {lens.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
           {(lens.features || []).slice(0, 3).map((feature, idx) => (
             <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-surface-container-low border border-outline/5">
                <ShieldCheck size={10} className="text-secondary" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-on-surface/60">{feature}</span>
             </div>
           ))}
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-outline/10 space-y-8 relative z-10">
        <div className="flex items-baseline justify-between">
           <span className="text-[9px] font-black uppercase tracking-[0.3em] text-on-surface/30 italic">Investment</span>
           <p className="text-2xl font-serif italic text-primary">
              <span className="text-sm font-sans font-bold not-italic mr-1 opacity-50">₹</span>
              {lens.price.toLocaleString()}
           </p>
        </div>

        <button
          onClick={handleQuickAdd}
          className="w-full bg-primary text-white py-6 text-[9px] font-black uppercase tracking-[0.4em] italic hover:bg-secondary transition-all flex items-center justify-center gap-4 active:scale-95 group/btn"
        >
          Select Lens Module
          <ChevronRight size={14} className="group-hover/btn:translate-x-2 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}
