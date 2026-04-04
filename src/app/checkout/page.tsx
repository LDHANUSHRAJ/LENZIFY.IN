"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Shield, CreditCard, Truck, User, ArrowRight, ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

const steps = [
  { id: "shipping", label: "Shipping", icon: Truck },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "confirm", label: "Confirm", icon: Check },
];

export default function CheckoutPage() {
  const [step, setStep] = useState(0);
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
  });

  const nextStep = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const subtotal = getTotalPrice();
  const total = subtotal;

  const handlePlaceOrder = () => {
    // Here we would normally trigger Razorpay
    // For now, we'll just move to the confirmation step
    nextStep();
    clearCart();
  };

  if (items.length === 0 && step < 2) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-brand-background">
        <h1 className="text-3xl font-display text-brand-navy mb-4 uppercase tracking-widest">Bag is Empty</h1>
        <Link href="/spectacles" className="text-brand-gold text-xs font-bold uppercase tracking-widest border-b border-brand-gold pb-1">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-background pt-32 pb-24 px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-display uppercase tracking-[0.2em] text-brand-navy mb-4">Checkout</h1>
          <div className="flex justify-center items-center gap-8 mt-12 relative max-w-md mx-auto">
             <div className="absolute top-1/2 left-0 w-full h-[1px] bg-brand-navy/10 -z-10" />
             {steps.map((s, i) => (
                <div key={s.id} className="flex flex-col items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500 ${step >= i ? "bg-brand-navy border-brand-navy text-white shadow-lg" : "bg-white border-brand-navy/10 text-brand-navy/30"}`}>
                    <s.icon size={16} />
                  </div>
                  <span className={`text-[9px] uppercase font-bold tracking-widest ${step >= i ? "text-brand-navy" : "text-brand-navy/30"}`}>
                    {s.label}
                  </span>
                </div>
             ))}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Form Content */}
          <div className="lg:col-span-12">
            <div className="bg-white border border-brand-navy/5 p-8 lg:p-12 shadow-sm min-h-[500px] flex flex-col justify-between">
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div
                    key="shipping"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-10"
                  >
                    <div className="flex items-center gap-4 border-b border-brand-navy/5 pb-4">
                      <div className="p-2 bg-brand-background text-brand-navy"><Truck size={20} /></div>
                      <h2 className="text-xl font-display uppercase tracking-widest text-brand-navy">Shipping Details</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-brand-text-muted">Full Name</label>
                        <input 
                          type="text" 
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-brand-background border border-brand-navy/10 px-6 py-4 outline-none focus:border-brand-gold transition-colors text-sm uppercase tracking-widest" 
                          placeholder="John Doe" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-brand-text-muted">Email Address</label>
                        <input 
                          type="email" 
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full bg-brand-background border border-brand-navy/10 px-6 py-4 outline-none focus:border-brand-gold transition-colors text-sm uppercase tracking-widest" 
                          placeholder="john@example.com" 
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-brand-text-muted">Shipping Address</label>
                        <textarea 
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          className="w-full bg-brand-background border border-brand-navy/10 px-6 py-4 outline-none focus:border-brand-gold transition-colors text-sm uppercase tracking-widest h-32" 
                          placeholder="Complete Address, Apartment, etc." 
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-10"
                  >
                    <div className="flex items-center gap-4 border-b border-brand-navy/5 pb-4">
                      <div className="p-2 bg-brand-background text-brand-navy"><CreditCard size={20} /></div>
                      <h2 className="text-xl font-display uppercase tracking-widest text-brand-navy">Payment Method</h2>
                    </div>

                    <div className="space-y-6 max-w-2xl mx-auto">
                      <div className="p-8 border border-brand-gold bg-brand-background/50 flex items-center justify-between group cursor-pointer hover:border-brand-gold transition-all">
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-brand-navy text-white flex items-center justify-center">
                              <CreditCard size={20} />
                            </div>
                            <div>
                                <span className="block text-sm font-bold uppercase tracking-widest text-brand-navy mb-1">Razorpay Secure</span>
                                <span className="text-[10px] text-brand-text-muted uppercase tracking-wider italic font-medium leading-relaxed">UPI, Cards, Netbanking</span>
                            </div>
                        </div>
                        <div className="w-6 h-6 rounded-full border-2 border-brand-gold flex items-center justify-center">
                          <div className="w-3 h-3 bg-brand-gold rounded-full" />
                        </div>
                      </div>

                      <div className="p-6 text-center">
                         <div className="flex items-center justify-center gap-4 text-brand-text-muted opacity-40 grayscale">
                            <Shield size={16} />
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">PCI-DSS Compliant Terminal</span>
                         </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16"
                  >
                    <div className="w-20 h-20 bg-brand-navy text-white rounded-full flex items-center justify-center mx-auto mb-10 shadow-xl">
                      <Check size={32} />
                    </div>
                    <h2 className="text-4xl font-display uppercase tracking-widest text-brand-navy mb-4">Order Confirmed</h2>
                    <p className="text-brand-text-muted max-w-sm mx-auto text-xs uppercase tracking-widest leading-relaxed mb-12 font-medium">
                      Your vision journey has begun. We will notify you once your order is deployed.
                    </p>
                    <Link href="/spectacles" className="bg-brand-navy text-white px-10 py-4 text-xs font-bold uppercase tracking-widest hover:bg-brand-gold transition-colors">
                      Continue Discovery
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation UI */}
              <div className="mt-16 pt-8 border-t border-brand-navy/5 flex flex-col md:flex-row items-center justify-between gap-8">
                {step < 2 ? (
                  <>
                    <button
                      onClick={prevStep}
                      disabled={step === 0}
                      className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] transition-all ${step === 0 ? "opacity-0 pointer-events-none" : "text-brand-text-muted hover:text-brand-navy"}`}
                    >
                      <ArrowLeft size={14} /> Back
                    </button>
                    
                    <div className="flex flex-col md:flex-row items-center gap-12 w-full md:w-auto">
                        <div className="text-right">
                           <span className="block text-[9px] uppercase tracking-widest text-brand-text-muted mb-1 font-bold">Payable Amount</span>
                           <span className="text-2xl font-bold text-brand-navy">₹{total.toLocaleString()}</span>
                        </div>
                        <button 
                          onClick={step === 1 ? handlePlaceOrder : nextStep}
                          className="w-full md:w-auto bg-brand-navy text-white px-12 py-5 text-xs font-bold uppercase tracking-widest hover:bg-brand-gold transition-all flex items-center justify-center gap-3 group"
                        >
                          {step === 1 ? "Complete Transaction" : "Proceed to Payment"}
                          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-center items-center gap-6 opacity-30">
          <Lock size={14} className="text-brand-navy" />
          <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-brand-navy">End-to-End Encryption Enabled</span>
        </div>
      </div>
    </div>
  );
}
