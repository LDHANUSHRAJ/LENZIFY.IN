"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const supabase = createClient();
  const router = useRouter();
  const totalPrice = getTotalPrice();
  const tax = totalPrice * 0.18;
  const grandTotal = totalPrice + tax;

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login?redirect=/checkout");
        return;
      }
      setUser(user);
      setFormData(prev => ({
        ...prev,
        name: user.user_metadata?.name || "",
        email: user.email || "",
      }));
    };
    checkAuth();

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, [supabase.auth, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    if (!formData.address || !formData.pincode || !formData.phone) {
      alert("Missing required verification protocols (Address, Pincode, Phone).");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: grandTotal,
          items,
          address: formData,
        }),
      });

      const order = await response.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "LENZIFY.IN",
        description: "Premium Vision Acquisition",
        order_id: order.id,
        handler: async function (response: any) {
          clearCart();
          router.push("/dashboard?success=true");
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#000000",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment initialization failed:", error);
      alert("Verification sequence failed. Re-initiating...");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-serif italic text-primary mb-8 tracking-tighter">Inventory Empty</h1>
        <Link href="/products" className="bg-primary text-white px-10 py-4 rounded-lg font-bold text-[10px] uppercase tracking-widest">Return to Catalogue</Link>
      </div>
    );
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen pt-24">
      <main className="max-w-screen-2xl mx-auto px-8 md:px-12 py-20 pb-32">
        <div className="flex flex-col lg:flex-row gap-24 lg:gap-32">
          {/* Shipping Form */}
          <div className="flex-grow space-y-16">
            <header className="space-y-6">
              <p className="text-xs font-bold uppercase tracking-[0.4em] text-secondary italic">Step 02/03</p>
              <h1 className="text-6xl font-serif tracking-tight text-primary">
                Shipping & <span className="italic">Verification</span>
              </h1>
              <p className="text-on-surface/60 font-medium tracking-wide leading-relaxed italic">
                Enter your shipping address and contact details to finalize your eyewear purchase.
              </p>
            </header>

            <div className="space-y-12">
              {/* Personal Identity */}
              <section className="space-y-8">
                 <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Receiver Details</span>
                    <div className="h-px flex-grow bg-outline/10"></div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface/40">Full Name</label>
                      <input name="name" value={formData.name} onChange={handleInputChange} placeholder="AS PER GOVT ID" className="w-full bg-transparent border-b border-outline/20 py-4 text-sm text-primary font-bold tracking-widest focus:border-primary outline-none transition-all placeholder:text-on-surface/20" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface/40">Email Address</label>
                       <input name="email" value={formData.email} onChange={handleInputChange} placeholder="YOUR@IDENTITY.COM" className="w-full bg-transparent border-b border-outline/20 py-4 text-sm text-primary font-bold tracking-widest focus:border-primary outline-none transition-all placeholder:text-on-surface/20" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface/40">Phone Number</label>
                       <div className="flex gap-4">
                          <span className="py-4 border-b border-outline/20 text-sm font-bold text-on-surface/40">+91</span>
                          <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="CONTACT NUMBER" type="tel" maxLength={10} className="w-full bg-transparent border-b border-outline/20 py-4 text-sm text-primary font-bold tracking-widest focus:border-primary outline-none transition-all placeholder:text-on-surface/20" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface/40">Secure Pincode</label>
                       <input name="pincode" value={formData.pincode} onChange={handleInputChange} placeholder="000 000" maxLength={6} className="w-full bg-transparent border-b border-outline/20 py-4 text-sm text-primary font-bold tracking-widest focus:border-primary outline-none transition-all placeholder:text-on-surface/20" />
                    </div>
                 </div>
              </section>

              {/* Delivery Coordinates */}
              <section className="space-y-8">
                 <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Shipping Information</span>
                    <div className="h-px flex-grow bg-outline/10"></div>
                 </div>
                 <div className="space-y-10">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface/40">Shipping Address</label>
                       <textarea name="address" rows={3} value={formData.address} onChange={handleInputChange} placeholder="STREET, BUILDING, LANDMARK..." className="w-full bg-transparent border-b border-outline/20 py-4 text-sm text-primary font-bold tracking-widest focus:border-primary outline-none transition-all placeholder:text-on-surface/20 resize-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface/40">City</label>
                          <input name="city" value={formData.city} onChange={handleInputChange} placeholder="CITY NAME" className="w-full bg-transparent border-b border-outline/20 py-4 text-sm text-primary font-bold tracking-widest focus:border-primary outline-none transition-all placeholder:text-on-surface/20" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface/40">State</label>
                          <input name="state" value={formData.state} onChange={handleInputChange} placeholder="STATE" className="w-full bg-transparent border-b border-outline/20 py-4 text-sm text-primary font-bold tracking-widest focus:border-primary outline-none transition-all placeholder:text-on-surface/20" />
                       </div>
                    </div>
                 </div>
              </section>
            </div>
            
            <div className="p-8 bg-surface-container-low border border-outline/5 rounded-xl flex items-start gap-6 italic">
              <span className="material-symbols-outlined text-secondary text-3xl">local_shipping</span>
              <div className="space-y-2">
                 <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Quality Control & Shipping</p>
                 <p className="text-[10px] font-medium tracking-wide text-on-surface/60 leading-relaxed">
                   Your selection will undergo high-precision calibration and quality checks in our laboratory before being dispatched via priority logistics within 48 hours.
                 </p>
              </div>
            </div>
          </div>

          {/* Cart Sidebar */}
          <aside className="w-full lg:w-[400px] shrink-0">
             <div className="sticky top-32 space-y-12 bg-white p-12 editorial-shadow rounded-sm border border-outline/10">
                <div className="space-y-4">
                   <h2 className="text-2xl font-serif italic text-primary">Order Summary</h2>
                   <div className="h-0.5 w-12 bg-secondary"></div>
                </div>

                <div className="space-y-8">
                   <div className="max-h-[300px] overflow-y-auto space-y-6 pr-4 custom-scrollbar">
                      {items.map(item => (
                         <div key={item.id} className="flex gap-6 items-center">
                            <div className="w-20 h-20 bg-surface-container-low rounded-lg overflow-hidden flex items-center justify-center grayscale mix-blend-multiply border border-outline/5">
                               <Image src={item.image} alt={item.name} width={60} height={60} className="object-contain" />
                            </div>
                            <div className="flex-grow space-y-1">
                               <p className="text-[10px] font-bold uppercase tracking-widest text-primary truncate max-w-[150px]">{item.name}</p>
                               <div className="flex justify-between items-center">
                                  <span className="text-[9px] font-bold text-on-surface/40 uppercase">QTY: {item.quantity}</span>
                                  <span className="text-xs font-serif italic text-secondary font-bold">₹{item.price * item.quantity}</span>
                               </div>
                            </div>
                         </div>
                      ))}
                   </div>

                   <div className="space-y-6 border-t border-outline/10 pt-8 mt-8">
                      <div className="space-y-3">
                         <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-on-surface/40">
                            <span>Archives Total</span>
                            <span className="text-primary tracking-tighter">₹{totalPrice.toFixed(2)}</span>
                         </div>
                         <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-on-surface/40">
                            <span>Sartorial Tax (18%)</span>
                            <span className="text-primary tracking-tighter">₹{tax.toFixed(2)}</span>
                         </div>
                         <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-on-surface/40">
                            <span>Editorial Shipping</span>
                            <span className="text-secondary tracking-widest italic italic">COMPLIMENTARY</span>
                         </div>
                      </div>

                      <div className="pt-6 flex justify-between items-baseline border-t border-outline/10">
                         <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Protocol Final</span>
                         <span className="text-4xl font-serif text-primary italic font-bold">₹{grandTotal.toFixed(2)}</span>
                      </div>

                      <button 
                         onClick={handlePayment}
                         disabled={loading}
                         className="w-full py-6 bg-primary text-white font-bold text-[10px] uppercase tracking-[0.3em] rounded-lg hover:opacity-80 transition-all duration-500 active:scale-95 relative overflow-hidden"
                      >
                         <span>{loading ? "PROCESSING..." : "COMPLETE PURCHASE"}</span>
                      </button>

                      <div className="flex items-center justify-center gap-4 text-[9px] font-bold uppercase tracking-widest text-on-surface/30">
                         <span className="material-symbols-outlined text-sm">security</span>
                         <span>SSL SECURE ENCRYPTION ENFORCED</span>
                      </div>
                   </div>
                </div>
             </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
