"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Package, ArrowRight, ShoppingBag, MapPin, Printer } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  return (
    <main className="max-w-4xl mx-auto px-8 py-20 pb-32 space-y-16">
      <header className="text-center space-y-8">
         <motion.div 
           initial={{ scale: 0.5, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ type: "spring", damping: 15 }}
           className="w-24 h-24 bg-emerald-500 rounded-full mx-auto flex items-center justify-center text-white shadow-[0_20px_40px_rgba(16,185,129,0.3)]"
         >
            <CheckCircle2 size={48} />
         </motion.div>
         
         <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.6em] text-emerald-500 italic">Transmission Complete</p>
            <h1 className="text-5xl md:text-7xl font-serif italic tracking-tight text-brand-navy uppercase leading-none">
               Order <span className="text-emerald-500">Placed</span>
            </h1>
            <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-brand-navy/30 italic">Order Hash: #{orderId?.slice(0, 12)}</p>
         </div>
      </header>

      <section className="bg-white border border-brand-navy/5 p-12 md:p-16 shadow-2xl space-y-12 relative overflow-hidden group print:shadow-none print:border-none">
         <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-1000">
            <Package size={80} />
         </div>

         <div className="space-y-8">
            <h3 className="text-xl font-serif italic text-brand-navy font-black tracking-tight uppercase border-b border-brand-navy/5 pb-6">Acquisition Summary</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div className="space-y-6">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-brand-background rounded-full flex items-center justify-center text-secondary">
                        <ShoppingBag size={18} />
                     </div>
                     <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase tracking-widest text-brand-navy/30">Deployment Status</p>
                        <p className="text-[11px] font-bold text-brand-navy uppercase italic">Vault encryption complete. Awaiting logistics sync.</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-brand-background rounded-full flex items-center justify-center text-secondary">
                        <MapPin size={18} />
                     </div>
                     <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase tracking-widest text-brand-navy/30">Routed To</p>
                        <p className="text-[11px] font-bold text-brand-navy uppercase italic">Verified Delivery Coordinates</p>
                     </div>
                  </div>
               </div>

               <div className="bg-brand-background/30 p-8 space-y-4 border border-brand-navy/5">
                  <p className="text-[9px] font-black uppercase tracking-widest text-brand-navy/20 text-center">Next Synchronization</p>
                  <p className="text-[10px] font-bold text-brand-navy leading-relaxed italic text-center">
                     You will receive a transmission with your tracking protocols as soon as the optical archives are dispatched from our lab.
                  </p>
               </div>
            </div>
         </div>

         <div className="pt-8 border-t border-brand-navy/5 flex flex-col md:flex-row gap-6 justify-between items-center">
            <div className="flex gap-4">
               <button onClick={() => window.print()} className="print:hidden flex items-center gap-2 py-4 px-8 bg-brand-navy text-white text-[9px] font-black uppercase tracking-widest hover:bg-secondary transition-all">
                  <Printer size={12} />
                  Download Order Details
               </button>
            </div>
            <div className="flex gap-2 items-center">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               <span className="text-[9px] font-black uppercase tracking-widest text-brand-navy/30 italic">Registry Secure</span>
            </div>
         </div>
      </section>

      <footer className="print:hidden flex flex-col md:flex-row justify-center gap-8 md:gap-16 pt-12">
         <Link href="/profile/orders" className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-navy hover:text-secondary transition-all flex items-center gap-4">
            <span>View Acquisition Logs</span>
            <ArrowRight size={14} />
         </Link>
         <Link href="/products" className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary hover:text-brand-navy transition-all flex items-center gap-4">
            <span>Continue Discovery</span>
            <ShoppingBag size={14} />
         </Link>
      </footer>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <div className="bg-surface text-brand-navy min-h-screen pt-24 font-sans">
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Verifying Protocol...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
