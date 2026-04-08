"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { getCart } from "@/lib/db/customer_actions";
import { placeOrder } from "@/lib/db/order_actions";
import { cn } from "@/lib/utils";
import { 
  Package, 
  ChevronRight, 
  MapPin, 
  FileText, 
  CreditCard, 
  CheckCircle2, 
  AlertTriangle,
  Upload,
  ArrowRight,
  ShieldCheck,
  Eye,
  Shield
} from "lucide-react";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "cod">("upi");
  
  const [addressData, setAddressData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [prescription, setPrescription] = useState<{
    file_url?: string;
    left_eye: string;
    right_eye: string;
    pd: string;
  }>({ left_eye: "", right_eye: "", pd: "" });

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        router.push("/auth/login?redirect=/checkout");
        return;
      }
      setUser(currentUser);
      
      const cart = await getCart();
      if (!cart || cart.length === 0) {
        router.push("/cart");
        return;
      }
      setCartItems(cart);
      
      setAddressData(prev => ({
          ...prev,
          name: currentUser.user_metadata?.name || ""
      }));
      setLoading(false);
    };
    init();

    // Load Razorpay Script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, [supabase.auth, router]);

  const handlePayment = async () => {
    if (!addressData.address || !addressData.pincode) {
      alert("Delivery coordinates required for protocol execution.");
      return;
    }
    setOrderProcessing(true);

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const tax = subtotal * 0.18;
    const totalAmount = subtotal + tax;

    // CASE 1: Cash on Delivery
    if (paymentMethod === "cod") {
      try {
        const orderRes = await placeOrder({
          items: cartItems.map(item => ({
              id: item.product_id,
              quantity: item.quantity,
              price: item.price,
              lens_type: item.lens_type,
              power_left: prescription.left_eye,
              power_right: prescription.right_eye
          })),
          total_price: totalAmount,
          address: addressData,
          prescription: prescription.left_eye ? prescription : undefined,
          payment: {
              id: `cod_${Date.now()}`,
              method: "cod"
          }
        });

        if (orderRes.success) {
          router.push(`/orders/success?id=${orderRes.order_id}`);
        } else {
          alert("Database synchronization failure: " + orderRes.error);
        }
      } catch (e) {
        console.error("COD Error:", e);
        alert("COD Protocol failed to initialize.");
      } finally {
        setOrderProcessing(false);
      }
      return;
    }

    // CASE 2: UPI / Razorpay Flow
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalAmount })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`${errorData.error}: ${errorData.details || "Unknown protocol failure"}`);
      }

      const order = await res.json();

      if (!order.id) {
        throw new Error("Invalid order identity received from vault.");
      }

      if (!(window as any).Razorpay) {
        throw new Error("Razorpay SDK not loaded. Check network protocol.");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "LENZIFY",
        description: "Visionary Optic Acquisition",
        order_id: order.id,
        prefill: {
          name: addressData.name,
          contact: addressData.phone,
          email: user?.email
        },
        theme: {
          color: "#0F172A"
        },
        modal: {
          ondismiss: function() {
            setOrderProcessing(false);
          }
        },
        handler: async function (response: any) {
          try {
            const orderRes = await placeOrder({
              items: cartItems.map(item => ({
                  id: item.product_id,
                  quantity: item.quantity,
                  price: item.price,
                  lens_type: item.lens_type,
                  power_left: prescription.left_eye,
                  power_right: prescription.right_eye
              })),
              total_price: totalAmount,
              address: addressData,
              prescription: prescription.left_eye ? prescription : undefined,
              payment: {
                  id: response.razorpay_payment_id,
                  method: "razorpay"
              }
            });

            if (orderRes.success) {
              router.push(`/orders/success?id=${orderRes.order_id}`);
            } else {
              alert("Database synchronization failure. Please contact support.");
              setOrderProcessing(false);
            }
          } catch (err) {
            console.error("Fulfillment Error:", err);
            alert("Database fulfillment protocol failed.");
            setOrderProcessing(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
          console.error("Payment Failed Callback:", response.error);
          alert("Payment Failed: " + response.error.description);
          setOrderProcessing(false);
      });
      rzp.open();
    } catch (e: any) {
      console.error("Razorpay Init Error:", e);
      alert("Payment Matrix Failure: " + (e.message || "Initialization error"));
      setOrderProcessing(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-surface flex items-center justify-center text-[10px] font-bold uppercase tracking-[0.5em] animate-pulse text-brand-navy/30">Initializing Checkout Matrix...</div>;

  return (
    <div className="bg-surface text-brand-navy min-h-screen pt-24 font-sans text-brand-navy">
      <main className="max-w-screen-2xl mx-auto px-8 md:px-12 py-12 lg:py-20 pb-32">
        <header className="mb-20 space-y-6">
           <div className="flex items-center gap-6">
              {[1, 2, 3].map(step => (
                <div key={step} className="flex items-center gap-3">
                   <div className={cn(
                      "w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-black transition-all duration-700",
                      activeStep === step ? "border-secondary bg-secondary text-brand-navy shadow-lg" : 
                      activeStep > step ? "border-emerald-500 bg-emerald-500 text-white" : "border-brand-navy/10 text-brand-navy/20"
                   )}>
                      {activeStep > step ? <CheckCircle2 size={14} /> : step}
                   </div>
                   <span className={cn(
                      "text-[10px] font-bold uppercase tracking-widest italic",
                      activeStep === step ? "text-brand-navy" : "text-brand-navy/20"
                   )}>
                      {step === 1 ? "COORDINATES" : step === 2 ? "CLINICAL DATA" : "FINALIZE"}
                   </span>
                   {step < 3 && <div className="w-12 h-px bg-brand-navy/5"></div>}
                </div>
              ))}
           </div>
           <h1 className="text-6xl font-serif italic text-brand-navy font-black tracking-tight uppercase leading-none">
              Transaction <span className="text-secondary">Vault</span>
           </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
           <div className="lg:col-span-8 space-y-12">
              <AnimatePresence mode="wait">
                  {activeStep === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-12">
                       <section className="bg-white border border-brand-navy/5 p-12 shadow-sm space-y-10 group transition-all">
                          <header className="flex justify-between items-start border-b border-brand-navy/5 pb-8">
                             <div className="space-y-2">
                                <h2 className="text-2xl font-serif italic text-brand-navy font-black tracking-tight uppercase">Logistics Coordinates</h2>
                                <p className="text-[10px] uppercase font-bold tracking-widest text-brand-navy/30 italic">Provide secure destination for archival dispatch.</p>
                             </div>
                             <MapPin className="text-brand-navy/10 group-hover:text-secondary transition-colors" size={32} />
                          </header>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                             <div className="space-y-8">
                                <div className="space-y-4">
                                   <label className="text-[9px] font-black uppercase tracking-widest text-brand-navy/40">Consignee Name</label>
                                   <input value={addressData.name} onChange={(e) => setAddressData({...addressData, name: e.target.value})} placeholder="ENTROPY RECIPIENT" className="w-full bg-transparent border-b border-brand-navy/10 py-4 px-2 text-sm font-bold text-brand-navy outline-none focus:border-secondary transition-all" />
                                </div>
                                <div className="space-y-4">
                                   <label className="text-[9px] font-black uppercase tracking-widest text-brand-navy/40">Secure Contact</label>
                                   <input value={addressData.phone} onChange={(e) => setAddressData({...addressData, phone: e.target.value})} placeholder="+91 XXXXXXXXXX" className="w-full bg-transparent border-b border-brand-navy/10 py-4 px-2 text-sm font-bold text-brand-navy outline-none focus:border-secondary transition-all" />
                                </div>
                             </div>
                             <div className="space-y-8">
                                <div className="space-y-4">
                                   <label className="text-[9px] font-black uppercase tracking-widest text-brand-navy/40">Destination Pincode</label>
                                   <input value={addressData.pincode} onChange={(e) => setAddressData({...addressData, pincode: e.target.value})} placeholder="XXXXXX" className="w-full bg-transparent border-b border-brand-navy/10 py-4 px-2 text-sm font-bold text-brand-navy outline-none focus:border-secondary transition-all" />
                                </div>
                                <div className="space-y-4">
                                   <label className="text-[9px] font-black uppercase tracking-widest text-brand-navy/40">Urban Sector (City)</label>
                                   <input value={addressData.city} onChange={(e) => setAddressData({...addressData, city: e.target.value})} placeholder="METROPOLIS" className="w-full bg-transparent border-b border-brand-navy/10 py-4 px-2 text-sm font-bold text-brand-navy outline-none focus:border-secondary transition-all" />
                                </div>
                             </div>
                             <div className="md:col-span-2 space-y-4">
                                <label className="text-[9px] font-black uppercase tracking-widest text-brand-navy/40">Structural Address</label>
                                <textarea value={addressData.address} onChange={(e) => setAddressData({...addressData, address: e.target.value})} rows={3} placeholder="STREET, BUILDING, SECTOR" className="w-full bg-transparent border-b border-brand-navy/10 py-4 px-2 text-sm font-bold text-brand-navy outline-none focus:border-secondary transition-all resize-none" />
                             </div>
                          </div>
                       </section>
                       <button onClick={() => setActiveStep(2)} className="flex items-center gap-6 py-6 px-12 bg-brand-navy text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-secondary hover:text-brand-navy transition-all shadow-xl group">
                          <span>Proceed to Clinical Data</span>
                          <ChevronRight size={14} className="group-hover:translate-x-2 transition-transform" />
                       </button>
                    </motion.div>
                  )}

                  {activeStep === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-12">
                       <div className="p-10 bg-white border border-brand-navy/5 text-brand-navy space-y-10 shadow-sm relative overflow-hidden group transition-all">
                          <FileText size={64} className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-1000" />
                          <div className="space-y-2">
                             <h2 className="text-2xl font-serif italic text-secondary font-black tracking-tight uppercase leading-none text-secondary">Clinical Metadata</h2>
                             <p className="text-[10px] uppercase font-bold tracking-widest text-brand-navy/30 italic pt-2">Optional: Enter your visionary power details for precision grinding.</p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                             <div className="space-y-4">
                                <label className="text-[9px] font-black uppercase tracking-widest text-brand-navy/40 italic">Power: Left Eye (SPh)</label>
                                <input value={prescription.left_eye} onChange={(e) => setPrescription({...prescription, left_eye: e.target.value})} placeholder="+0.00 / -0.00" className="w-full bg-brand-background border-b border-brand-navy/10 py-4 px-2 text-sm font-bold text-brand-navy outline-none focus:border-secondary transition-all" />
                             </div>
                             <div className="space-y-4">
                                <label className="text-[9px] font-black uppercase tracking-widest text-brand-navy/40 italic">Power: Right Eye (SPh)</label>
                                <input value={prescription.right_eye} onChange={(e) => setPrescription({...prescription, right_eye: e.target.value})} placeholder="+0.00 / -0.00" className="w-full bg-brand-background border-b border-brand-navy/10 py-4 px-2 text-sm font-bold text-brand-navy outline-none focus:border-secondary transition-all" />
                             </div>
                             <div className="space-y-4 md:col-span-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-brand-navy/40 italic">Pupillary Distance (PD)</label>
                                <input value={prescription.pd} onChange={(e) => setPrescription({...prescription, pd: e.target.value})} placeholder="STANDARD 62mm" className="w-full bg-brand-background border-b border-brand-navy/10 py-4 px-2 text-sm font-bold text-brand-navy outline-none focus:border-secondary transition-all" />
                             </div>
                          </div>
                          <div className="border border-dashed border-brand-navy/10 p-12 text-center space-y-4 group/upload cursor-pointer hover:border-secondary transition-colors bg-brand-background/30">
                             <Upload size={32} className="mx-auto text-brand-navy/20 group-hover/upload:text-secondary group-hover/upload:scale-110 transition-all" />
                             <p className="text-[10px] font-bold uppercase tracking-widest text-brand-navy/30 italic">Upload Clinical Vision Report (Image/PDF)</p>
                          </div>
                       </div>
                       <div className="flex gap-4">
                          <button onClick={() => setActiveStep(1)} className="py-6 px-12 border border-brand-navy/10 text-brand-navy text-[10px] font-black uppercase tracking-[0.4em] hover:bg-brand-background transition-all">Back</button>
                          <button onClick={() => setActiveStep(3)} className="flex items-center gap-6 py-6 px-12 bg-brand-navy text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-secondary hover:text-brand-navy transition-all shadow-xl group">
                            <span>Proceed to Finalize</span>
                            <ChevronRight size={14} className="group-hover:translate-x-2 transition-transform" />
                          </button>
                       </div>
                    </motion.div>
                  )}

                  {activeStep === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-12">
                       <section className="bg-white border border-brand-navy/5 p-12 shadow-sm space-y-12">
                          <div className="space-y-6">
                             <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-navy/20 italic">Select Settlement Protocol</h4>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <button 
                                  onClick={() => setPaymentMethod("upi")}
                                  className={cn(
                                    "p-10 border-2 transition-all text-left space-y-4 group",
                                    paymentMethod === 'upi' ? "border-secondary bg-secondary/5" : "border-brand-navy/5 hover:border-brand-navy/20"
                                  )}
                                >
                                   <div className="flex justify-between items-center">
                                      <CreditCard size={24} className={paymentMethod === 'upi' ? "text-secondary" : "text-brand-navy/20"} />
                                      {paymentMethod === 'upi' && <div className="w-3 h-3 rounded-full bg-secondary shadow-lg"></div>}
                                   </div>
                                   <div>
                                      <p className="text-[11px] font-black uppercase tracking-widest text-brand-navy">UPI / Net Banking</p>
                                      <p className="text-[9px] font-bold text-brand-navy/30 uppercase italic">Instant Archive Lock (Razorpay)</p>
                                   </div>
                                </button>

                                <button 
                                  onClick={() => setPaymentMethod("cod")}
                                  className={cn(
                                    "p-10 border-2 transition-all text-left space-y-4 group",
                                    paymentMethod === 'cod' ? "border-secondary bg-secondary/5" : "border-brand-navy/5 hover:border-brand-navy/20"
                                  )}
                                >
                                   <div className="flex justify-between items-center">
                                      <Package size={24} className={paymentMethod === 'cod' ? "text-secondary" : "text-brand-navy/20"} />
                                      {paymentMethod === 'cod' && <div className="w-3 h-3 rounded-full bg-secondary shadow-lg"></div>}
                                   </div>
                                   <div>
                                      <p className="text-[11px] font-black uppercase tracking-widest text-brand-navy">Cash on Delivery</p>
                                      <p className="text-[9px] font-bold text-brand-navy/30 uppercase italic">Settlement upon Logistics Arrival</p>
                                   </div>
                                </button>
                             </div>
                          </div>

                          <div className="space-y-8 border-t border-brand-navy/5 pt-10">
                             <p className="text-[11px] leading-relaxed italic text-brand-navy/40 font-bold">
                                By completing this purchase via <span className="text-secondary font-black uppercase italic">{paymentMethod === 'upi' ? 'Digital Gateway' : 'Logistic Settlement'}</span>, you authorize the acquisition of the listed optic archives.
                             </p>
                          </div>
                       </section>
                       <div className="flex gap-4">
                          <button onClick={() => setActiveStep(2)} className="py-6 px-12 border border-brand-navy/10 text-brand-navy text-[10px] font-black uppercase tracking-[0.4em] hover:bg-brand-background transition-all">Back</button>
                          <button 
                            disabled={orderProcessing}
                            onClick={handlePayment} 
                            className="flex-grow flex items-center justify-center gap-6 py-6 px-12 bg-brand-navy text-white text-[10px] font-black uppercase tracking-[0.5em] hover:bg-secondary hover:text-brand-navy transition-all shadow-2xl disabled:opacity-50 disabled:grayscale"
                          >
                            {orderProcessing ? "INITIALIZING TRANSFER..." : `INITIATE ${paymentMethod === 'upi' ? 'UPI PROTOCOL' : 'COD PROTOCOL'}`}
                            {!orderProcessing && <ArrowRight size={14} />}
                          </button>
                       </div>
                    </motion.div>
                  )}
              </AnimatePresence>
           </div>

           {/* Order Matrix Sidebar */}
           <div className="lg:col-span-4 sticky top-32">
              <div className="bg-white border border-brand-navy/5 p-12 shadow-2xl space-y-12 transition-all">
                 <header className="space-y-4 border-b border-brand-navy/5 pb-10">
                    <h2 className="text-3xl font-serif italic text-brand-navy font-black tracking-tighter uppercase leading-none italic">Order <span className="text-secondary">Matrix</span></h2>
                    <p className="text-[9px] font-bold uppercase tracking-[0.6em] text-brand-navy/20 italic">Lenzify Vault Snapshot</p>
                 </header>

                 <div className="space-y-8">
                    {cartItems.map((item, i) => (
                      <div key={i} className="flex gap-8 group">
                         <div className="w-20 h-20 bg-brand-background p-4 grayscale group-hover:grayscale-0 transition-all duration-700">
                            <img src={item.products.product_images?.[0]?.image_url || "/placeholder.jpg"} className="w-full h-full object-contain mix-blend-multiply" />
                         </div>
                         <div className="flex-grow space-y-2">
                            <h4 className="text-[11px] font-black uppercase tracking-widest text-brand-navy">{item.products.name}</h4>
                            <div className="flex justify-between items-baseline">
                               <p className="text-[9px] font-bold text-brand-navy/30 uppercase italic">Unit: {item.quantity}</p>
                               <p className="text-[11px] font-black text-brand-navy italic">₹{(item.price || item.products.offer_price).toLocaleString()}</p>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>

                 <div className="space-y-6 pt-10 border-t border-brand-navy/5">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-brand-navy/40">
                       <span className="italic text-brand-navy/40">Archive Total</span>
                       <span className="text-brand-navy">₹{cartItems.reduce((acc, i) => acc + (i.price * i.quantity), 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-brand-navy/40">
                       <span className="italic text-brand-navy/40">Protocol Tax (18%)</span>
                       <span className="text-brand-navy">₹{(cartItems.reduce((acc, i) => acc + (i.price * i.quantity), 0) * 0.18).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                       <span className="text-secondary italic">Shipping Matrix</span>
                       <span className="text-secondary italic">Complimentary</span>
                    </div>
                    <div className="pt-8 flex justify-between items-baseline border-t border-brand-navy/5">
                       <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-navy/20 italic">Final Value</span>
                       <span className="text-4xl font-serif italic text-brand-navy font-black italic">₹{(cartItems.reduce((acc, i) => acc + (i.price * i.quantity), 0) * 1.18).toLocaleString()}</span>
                    </div>
                 </div>

                 <div className="pt-8 space-y-6">
                    <p className="text-[9px] text-center font-black uppercase tracking-[0.5em] text-brand-navy/20 italic">Encrypted Protocol</p>
                    <div className="flex justify-center gap-10 opacity-10">
                       <Shield size={20} className="text-brand-navy" />
                       <Eye size={20} className="text-brand-navy" />
                       <ShieldCheck size={20} className="text-brand-navy" />
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
