"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ProductCard from "@/components/store/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Ticket, Tag, Zap, Percent, ShoppingBag } from "lucide-react";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

function OffersContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "discounts";
  
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      if (type === "coupons") {
        const { data } = await supabase
          .from("coupons")
          .select("*")
          .eq("is_active", true)
          .gte("expiry_date", new Date().toISOString());
        setItems(data || []);
      } else if (type === "discounts") {
        const { data } = await supabase
          .from("products")
          .select("*")
          .not("discount_price", "is", null)
          .eq("is_enabled", true);
        setItems(data || []);
      } else if (type === "seasonal-sales") {
        // Defining seasonal sales as products in a 'Sale' category or having a 'Seasonal Sale' tag
        const { data } = await supabase
          .from("products")
          .select(`
            *,
            categories (name)
          `)
          .eq("is_enabled", true)
          .or("tags.cs.{Seasonal-Sale},is_featured.eq.true") // Check for tag or featured sale
          .not("discount_price", "is", null);
        
        setItems(data || []);
      }
      setLoading(false);
    }
    fetchData();
  }, [type, supabase]);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`COPIED: ${code}`, {
        style: {
            background: '#000',
            color: '#fff',
            fontSize: '10px',
            fontWeight: '900',
            letterSpacing: '0.2em',
            borderRadius: '0'
        }
    });
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-32">
      <header className="mb-20 text-center space-y-4">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-secondary italic">
          {type === 'coupons' ? 'Voucher Protocols' : type === 'discounts' ? 'Price Reductions' : 'Collection Clearance'}
        </p>
        <h1 className="text-5xl md:text-7xl font-serif italic text-primary tracking-tighter uppercase">
          Exclusive <span className="text-secondary">{type.replace('-', ' ')}</span>
        </h1>
        <div className="w-24 h-px bg-secondary mx-auto mt-8 opacity-30" />
      </header>

      {loading ? (
        <div className="py-40 text-center font-serif italic text-2xl animate-pulse text-outline">
          Syncing with Matrix...
        </div>
      ) : items.length > 0 ? (
        <div className={cn(
            "grid gap-8 md:gap-12",
            type === 'coupons' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        )}>
          <AnimatePresence mode="popLayout">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                {type === 'coupons' ? (
                  <div className="group bg-surface border border-outline/10 p-10 relative overflow-hidden flex flex-col justify-between h-full editorial-shadow hover:border-secondary transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                        <Ticket size={120} className="text-primary" />
                    </div>
                    
                    <div className="space-y-6 relative z-10">
                        <div className="flex justify-between items-start">
                             <div className="w-12 h-12 bg-secondary/10 flex items-center justify-center rounded-sm">
                                <Percent size={20} className="text-secondary" />
                             </div>
                             <div className="px-3 py-1 bg-primary/5 border border-primary/10">
                                <span className="text-[8px] font-black tracking-widest uppercase text-primary">Valid Module</span>
                             </div>
                        </div>
                        
                        <div>
                            <h3 className="text-2xl font-serif italic font-black text-primary uppercase">
                                {item.discount_type === 'flat' ? `₹${item.discount_value} OFF` : `${item.discount_value}% OFF`}
                            </h3>
                            <p className="text-[10px] text-on-surface/40 font-bold uppercase tracking-widest mt-2 leading-relaxed">
                                {item.description || `Applicable for orders above ₹${item.min_order_value || 0}`}
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-outline/5 flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-on-surface/30">Module ID:</span>
                            <span className="text-[10px] font-mono font-bold text-primary">{item.code}</span>
                        </div>
                        <button 
                            onClick={() => copyToClipboard(item.code)}
                            className="bg-primary text-white py-5 text-[9px] font-black uppercase tracking-[0.4em] italic hover:bg-secondary transition-all flex items-center justify-center gap-3 active:scale-95 translate-y-0"
                        >
                            Deploy Code <Copy size={12} />
                        </button>
                    </div>
                  </div>
                ) : (
                  <ProductCard product={item} />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="py-40 text-center space-y-6 flex flex-col items-center">
            <ShoppingBag size={48} className="text-outline/20 mb-4" />
            <h3 className="text-2xl font-serif text-outline italic">No active protocols in this matrix.</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface/30">Check back shortly for new deployment updates.</p>
        </div>
      )}
    </div>
  );
}

export default function OffersPage() {
  return (
    <div className="bg-surface min-h-screen">
      <Suspense fallback={<div className="min-h-screen bg-surface flex items-center justify-center text-primary font-serif italic text-2xl">Accessing Archives...</div>}>
        <OffersContent />
      </Suspense>
    </div>
  );
}
