"use client";

import { Activity, Star, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopProductsProps {
  products: {
    name: string;
    brand: string;
    sales: number;
  }[];
}

export default function TopProducts({ products }: TopProductsProps) {
  return (
    <div className="bg-white border border-brand-navy/5 p-10 lg:p-14 shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/[0.03] -mr-32 -mt-32 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
      
      <div className="flex items-center justify-between mb-12 border-b border-brand-navy/5 pb-8 relative">
        <div className="space-y-1">
          <h2 className="text-2xl font-serif italic text-brand-navy uppercase tracking-tight">Product <span className="text-secondary">Authority</span></h2>
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-text-muted italic">Volume-Weighted Sales Velocity</p>
        </div>
        <TrendingUp className="text-secondary opacity-20" size={32} />
      </div>

      <div className="space-y-8 relative">
        {products.map((product, i) => (
          <div key={i} className="flex items-center justify-between group/item border-b border-brand-navy/[0.03] pb-6">
            <div className="flex items-center gap-6">
               <div className="w-10 h-10 bg-brand-background border border-brand-navy/5 flex items-center justify-center text-[10px] font-black text-brand-navy group-hover/item:bg-brand-navy group-hover/item:text-white transition-all">
                  0{i + 1}
               </div>
               <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-brand-navy/30 mb-1">{product.brand}</p>
                  <h4 className="text-sm font-serif italic text-brand-navy font-black tracking-tight">{product.name}</h4>
               </div>
            </div>
            <div className="text-right">
               <div className="flex items-center gap-2 text-secondary justify-end">
                  <Activity size={10} className="animate-pulse" />
                  <p className="text-xs font-black tracking-tighter">{product.sales}</p>
               </div>
               <p className="text-[7px] uppercase font-bold tracking-widest text-brand-navy/20 italic">Validated Units</p>
            </div>
          </div>
        ))}
        
        {products.length === 0 && (
           <div className="py-12 text-center space-y-4 opacity-20">
              <Star className="mx-auto" size={32} />
              <p className="text-[9px] uppercase font-bold tracking-widest">Protocol Staging Underway</p>
           </div>
        )}
      </div>

      <div className="mt-12 pt-8 border-t border-brand-navy/[0.03] flex items-center justify-between relative">
         <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
            <span className="text-[8px] font-bold uppercase tracking-widest text-brand-navy/40">Real-time Acquisition Active</span>
         </div>
         <p className="text-[7px] font-black uppercase tracking-[0.2em] text-secondary bg-secondary/5 px-3 py-1">Top Tier Matrix</p>
      </div>
    </div>
  );
}
