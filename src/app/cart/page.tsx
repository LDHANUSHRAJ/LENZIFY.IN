"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, [supabase.auth]);

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.18; // 18% GST for India/Premium feel
  const total = subtotal + tax;

  const handleCheckout = () => {
    if (!user) {
      router.push("/auth/login?redirect=/checkout");
      return;
    }
    router.push("/checkout");
  };

  return (
    <div className="bg-background text-on-background min-h-screen pb-20">
      <main className="max-w-screen-2xl mx-auto px-8 py-12">
        <header className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <span className="h-[1px] w-12 bg-primary"></span>
            <span className="text-primary font-label text-[10px] uppercase tracking-[0.4em] font-black">Your Inventory</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-headline font-bold text-white tracking-tighter uppercase italic leading-[0.8]">
            The <br/><span className="text-secondary">Vault</span>
          </h1>
          
          <div className="flex items-center gap-6 mt-12 bg-white/5 p-4 rounded-3xl w-fit border border-white/5 backdrop-blur-xl">
            <div className="flex items-center gap-3 px-4">
              <span className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-black text-slate-900">01</span>
              <span className="text-[10px] text-white font-black uppercase tracking-widest">Bag Selection</span>
            </div>
            <div className="w-12 h-px bg-white/10"></div>
            <div className="flex items-center gap-3 px-4 opacity-40">
              <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black text-white">02</span>
              <span className="text-[10px] text-white font-black uppercase tracking-widest">Protocol</span>
            </div>
            <div className="w-12 h-px bg-white/10"></div>
            <div className="flex items-center gap-3 px-4 opacity-40">
              <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black text-white">03</span>
              <span className="text-[10px] text-white font-black uppercase tracking-widest">Verification</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="popLayout">
              {items.length > 0 ? (
                items.map((item, i) => (
                  <motion.div 
                    layout
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.1, duration: 0.5, ease: [] } as any}
                    className="group relative p-8 rounded-[3rem] bg-slate-900/40 border border-white/5 flex flex-col sm:flex-row gap-10 hover:border-white/10 transition-all backdrop-blur-xl"
                  >
                    <div className="relative w-full sm:w-56 aspect-square rounded-[2rem] overflow-hidden bg-white/5 p-8 group-hover:bg-white/10 transition-colors">
                      <Image src={item.image} alt={item.name} fill className="object-contain group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    
                    <div className="flex-grow flex flex-col justify-between py-2">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[10px] text-secondary font-black uppercase tracking-[0.3em] mb-1">{item.brand}</p>
                            <h3 className="text-3xl font-headline font-bold text-white uppercase italic tracking-tighter leading-tight">{item.name}</h3>
                          </div>
                          <p className="text-3xl font-headline font-bold text-white italic tracking-tighter">₹{item.price}</p>
                        </div>
                        
                        <div className="flex gap-10">
                          <div className="space-y-1">
                            <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black">Classification</p>
                            <p className="text-[11px] text-white font-black uppercase tracking-widest">{item.category}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black">Availability</p>
                            <p className="text-[11px] text-emerald-400 font-black uppercase tracking-widest">In Stock</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-8">
                        <div className="flex items-center bg-white/5 rounded-2xl border border-white/5 p-1 h-12 px-6 gap-8">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="text-slate-400 hover:text-white transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">remove</span>
                          </button>
                          <span className="text-sm font-black text-white w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="text-slate-400 hover:text-white transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">add</span>
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hover:text-red-400 transition-colors group/del"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                          Eject Item
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-32 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[4rem] bg-white/5">
                  <span className="material-symbols-outlined text-6xl text-slate-700 mb-6 font-thin scale-150 opacity-20">inventory_2</span>
                  <p className="text-slate-500 text-[10px] uppercase tracking-[0.4em] font-black mb-8">The vault is currently empty</p>
                  <Link href="/products" className="bg-white text-slate-900 px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all">
                    Initialize Discovery
                  </Link>
                </div>
              )}
            </AnimatePresence>

            {items.length > 0 && (
              <div className="pt-10 flex flex-col sm:flex-row gap-4">
                <Link href="/products" className="px-10 py-5 bg-white/5 border border-white/10 rounded-3xl text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center justify-center gap-6 group">
                  <span className="material-symbols-outlined text-sm group-hover:-translate-x-2 transition-transform">arrow_back</span>
                  Return to Catalogue
                </Link>
              </div>
            )}
          </div>

          {/* Order Summary */}
          {items.length > 0 && (
            <div className="lg:col-span-4 sticky top-32">
              <div className="p-10 rounded-[3rem] bg-slate-900/60 border border-white/10 space-y-10 shadow-[0_40px_100px_rgba(0,0,0,0.5)] backdrop-blur-3xl">
                <h2 className="text-3xl font-headline font-bold text-white uppercase italic tracking-tighter mb-2">Protocol <br/>Summary</h2>
                
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500">Gross Subtotal</span>
                    <span className="text-white font-black text-sm">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500">Logistic Matrix</span>
                    <span className="text-secondary font-black text-[10px] uppercase tracking-widest bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">Complimentary</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500">Applied GST (18%)</span>
                    <span className="text-white font-black text-sm">₹{tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="h-px bg-white/5 my-6"></div>
                  
                  <div className="flex justify-between items-end pb-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] uppercase tracking-[0.4em] font-black text-primary">Total Amount Due</span>
                      <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Final Calculation</span>
                    </div>
                    <span className="text-5xl font-headline font-bold text-white italic tracking-tighter leading-none">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  {!user && (
                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl mb-4">
                      <p className="text-[10px] text-primary font-black uppercase tracking-widest text-center">Authentication required for checkout</p>
                    </div>
                  )}
                  <button 
                    onClick={handleCheckout}
                    className="w-full py-6 bg-primary text-slate-900 font-black text-xs uppercase tracking-[0.3em] rounded-[2rem] hover:bg-white hover:shadow-[0_0_40px_rgba(165,200,255,0.4)] transition-all duration-700 active:scale-95 group overflow-hidden relative"
                  >
                    <span className="relative z-10">{user ? "Authorize Checkout" : "Login to Proceed"}</span>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                  </button>
                </div>

                <div className="pt-8 space-y-6">
                  <p className="text-[9px] text-center text-slate-500 font-black uppercase tracking-[0.5em]">Security Protocols</p>
                  <div className="flex justify-center gap-8 opacity-40">
                    <span className="material-symbols-outlined text-white text-xl">shield</span>
                    <span className="material-symbols-outlined text-white text-xl">verified_user</span>
                    <span className="material-symbols-outlined text-white text-xl">lock</span>
                  </div>
                </div>
              </div>

              {/* Specialist Assist */}
              <div className="mt-8 p-8 rounded-[2.5rem] bg-white/5 border border-white/5 flex items-center gap-6 hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
                  <span className="material-symbols-outlined text-2xl">hearing</span>
                </div>
                <div className="flex-grow">
                  <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Human Protocol Available</p>
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest font-medium">Optics specialists online now.</p>
                </div>
                <button className="text-secondary hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-xl">terminal</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
