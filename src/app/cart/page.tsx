"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { getCart, removeFromCart, addToCart, updateCartQuantity } from "@/lib/db/customer_actions";

const supabaseInstance = createClient();

export default function CartPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Stable supabase reference
  const supabase = useMemo(() => supabaseInstance, []);

  useEffect(() => {
    const init = async () => {
      if (user) return; // Prevent concurrent/redundant auth calls
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        setUser(authUser);
        
        const cartData = await getCart();
      const mappedItems = (cartData || []).map((item: any) => ({
        id: item.id,
        database_id: item.id,
        product_id: item.product_id,
        name: item.products.name,
        brand: "LENZIFY",
        price: item.price || item.products.offer_price || item.products.price,
        image: item.products.product_images?.[0]?.image_url || "/placeholder.jpg",
        category: "Optic Archive",
        quantity: item.quantity,
        lens_name: item.lenses?.name,
        lens_config: item.lens_config,
        prescription: item.prescription_json,
      }));
      setItems(mappedItems);
      setLoading(false);
      } catch (err) {
        console.error("Cart Init Error:", err);
        setLoading(false);
      }
    };
    init();
  }, [supabase]);

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18; 
  const total = subtotal + tax;

  const handleRemove = async (id: number) => {
    await removeFromCart(id);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const handleUpdateQty = async (id: number, delta: number) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    const newQty = item.quantity + delta;
    
    if (newQty < 1) {
      await handleRemove(id);
      return;
    }
    
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: newQty } : i));
    await updateCartQuantity(id, newQty);
  };

  const handleCheckout = () => {
    if (!user) {
      router.push("/auth/login?redirect=/checkout");
      return;
    }
    router.push("/checkout");
  };

  if (loading) return <div className="min-h-screen bg-surface flex items-center justify-center text-[10px] font-bold uppercase tracking-[0.5em] animate-pulse text-brand-navy/30">Synchronizing Vault...</div>;

  return (
    <div className="bg-surface text-brand-navy min-h-screen pb-20 pt-24">
      <main className="max-w-screen-2xl mx-auto px-8 py-12">
        <header className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <span className="h-[1px] w-12 bg-secondary"></span>
            <span className="text-secondary font-bold text-[10px] uppercase tracking-[0.4em] italic">Your Archive</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-serif font-black text-brand-navy tracking-tighter uppercase italic leading-[0.8]">
            The <br/><span className="text-secondary">Vault</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="popLayout">
              {items.length > 0 ? (
                items.map((item, i) => (
                  <motion.div 
                    layout
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group relative p-8 rounded-sm bg-white border border-brand-navy/5 flex flex-col sm:flex-row gap-10 hover:border-secondary/20 transition-all shadow-sm"
                  >
                    <div className="relative w-full sm:w-56 aspect-square bg-brand-background p-8 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-700">
                      <img src={item.image} alt={item.name} className="object-contain w-full h-full mix-blend-multiply" />
                    </div>
                    
                    <div className="flex-grow flex flex-col justify-between py-2">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[10px] text-brand-navy/30 font-black uppercase tracking-[0.3em] mb-1 italic">{item.brand}</p>
                            <h3 className="text-3xl font-serif italic font-black text-brand-navy uppercase tracking-tighter leading-tight">{item.name}</h3>
                            {item.lens_name && (
                               <div className="mt-2 flex items-center gap-2">
                                  <span className="px-2 py-1 bg-secondary/10 border border-secondary/20 text-[8px] font-bold uppercase tracking-widest text-secondary">Optics: {item.lens_name}</span>
                               </div>
                            )}
                          </div>
                          <p className="text-3xl font-serif italic font-black text-brand-navy italic tracking-tighter">₹{item.price}</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-x-10 gap-y-4">
                          <div className="space-y-1">
                            <p className="text-[9px] text-brand-navy/20 uppercase tracking-widest font-black">Classification</p>
                            <p className="text-[11px] text-brand-navy font-black uppercase tracking-widest italic">{item.category}</p>
                          </div>
                          {item.lens_config && (
                            <>
                              {item.lens_config.features?.length > 0 && (
                                <div className="space-y-1">
                                   <p className="text-[9px] text-brand-navy/20 uppercase tracking-widest font-black">Features</p>
                                   <p className="text-[10px] text-secondary font-black uppercase tracking-widest italic">+{item.lens_config.features.length} Modules</p>
                                </div>
                              )}
                              {item.lens_config.coatings?.length > 0 && (
                                <div className="space-y-1">
                                   <p className="text-[9px] text-brand-navy/20 uppercase tracking-widest font-black">Coatings</p>
                                   <p className="text-[10px] text-brand-navy font-black uppercase tracking-widest italic">+{item.lens_config.coatings.length} Layers</p>
                                </div>
                              )}
                              {(item.lens_config.material || item.lens_config.thickness) && (
                                <div className="space-y-1">
                                   <p className="text-[9px] text-brand-navy/20 uppercase tracking-widest font-black">Materials</p>
                                   <p className="text-[10px] text-brand-navy font-black uppercase tracking-widest italic">{item.lens_config.thickness?.name} | {item.lens_config.material?.name}</p>
                                </div>
                              )}
                            </>
                          )}
                          {item.prescription && (
                            <div className="space-y-1">
                               <p className="text-[9px] text-brand-navy/20 uppercase tracking-widest font-black">Calibration</p>
                               <p className="text-[11px] text-brand-navy font-black uppercase tracking-widest italic">OD: {item.prescription.od_sph} | OS: {item.prescription.os_sph}</p>
                            </div>
                          )}
                          <div className="space-y-1">
                            <p className="text-[9px] text-brand-navy/20 uppercase tracking-widest font-black">Availability</p>
                            <p className="text-[11px] text-emerald-500 font-black uppercase tracking-widest italic">In Stock</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-8">
                        <div className="flex items-center bg-brand-background border border-brand-navy/5 p-1 px-6 gap-8">
                          <button onClick={() => handleUpdateQty(item.id, -1)} className="text-brand-navy/30 hover:text-brand-navy transition-colors font-black">-</button>
                          <span className="text-sm font-black text-brand-navy w-4 text-center">{item.quantity}</span>
                          <button onClick={() => handleUpdateQty(item.id, 1)} className="text-brand-navy/30 hover:text-brand-navy transition-colors font-black">+</button>
                        </div>
                        
                        <button 
                          onClick={() => handleRemove(item.id)}
                          className="flex items-center gap-2 text-[10px] font-black text-brand-navy/20 uppercase tracking-[0.2em] hover:text-secondary transition-colors italic"
                        >
                          Eject Item
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-40 text-center border border-dashed border-brand-navy/10 rounded-sm bg-white shadow-inner">
                   <p className="text-brand-navy/20 text-[10px] uppercase tracking-[0.4em] font-black mb-8 italic">The vault is currently empty</p>
                   <Link href="/products" className="bg-brand-navy text-white px-10 py-5 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-secondary transition-all shadow-xl">
                      Initiate Discovery
                   </Link>
                </div>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-4 sticky top-32">
             <div className="bg-white border border-brand-navy/5 p-12 shadow-2xl space-y-12">
                <header className="space-y-4 border-b border-brand-navy/5 pb-8">
                   <h2 className="text-3xl font-serif italic font-black text-brand-navy uppercase tracking-tighter leading-none">Protocol <br/>Summary</h2>
                   <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-brand-navy/20 italic">Final Costing Matrix</p>
                </header>

                <div className="space-y-6">
                   <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-brand-navy/40">
                      <span>Gross Subtotal</span>
                      <span className="text-brand-navy italic">₹{subtotal.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-brand-navy/40">
                      <span>Logistic Matrix</span>
                      <span className="text-secondary italic">Complimentary</span>
                   </div>
                   <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-brand-navy/40">
                      <span>Applied GST (18%)</span>
                      <span className="text-brand-navy italic">₹{tax.toLocaleString()}</span>
                   </div>
                   <div className="pt-8 border-t border-brand-navy/5 flex justify-between items-baseline">
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-navy/20 italic">Total Due</span>
                      <span className="text-4xl font-serif italic font-black text-brand-navy">₹{total.toLocaleString()}</span>
                   </div>
                </div>

                <div className="pt-8">
                   <button 
                     disabled={items.length === 0}
                     onClick={handleCheckout}
                     className="w-full py-6 bg-brand-navy text-white font-black text-[10px] uppercase tracking-[0.5em] hover:bg-secondary hover:shadow-2xl transition-all duration-700 active:scale-95 disabled:opacity-30 disabled:grayscale"
                   >
                     Authorize Checkout
                   </button>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
