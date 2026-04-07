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
  Eye
} from "lucide-react";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login?redirect=/checkout");
        return;
      }
      setUser(user);
      
      const cart = await getCart();
      setCartItems(cart || []);
      
      setAddressData(prev => ({
          ...prev,
          name: user.user_metadata?.name || ""
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

    try {
      const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0) * 1.18; // Including 18% tax
      
      // 1. Create Razorpay Order
      const res = await fetch("/api/checkout", {
        method: "POST",
        body: JSON.stringify({ amount: totalAmount })
      });
      const order = await res.json();

      // 2. Open Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "LENZIFY",
        order_id: order.id,
        handler: async function (response: any) {
          // 3. Place Order in Supabase
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
            router.push(`/orders/success?id=${orderRes.orderId}`);
          } else {
            alert("Database synchronization failure. Please contact support.");
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (e) {
      console.error(e);
      alert("Payment matrix initialization failed.");
    } finally {
      setOrderProcessing(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-surface flex items-center justify-center text-[10px] font-bold uppercase tracking-[0.5em] animate-pulse">Initializing Checkout Matrix...</div>;

  return (
    <div className="bg-surface text-brand-navy min-h-screen pt-24 font-sans">
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
           <h1 className="text-6xl font-serif italic text-brand-navy tracking-tight uppercase leading-none">
              Transaction <span className="text-secondary">Vault</span>
           </h1>
        </header>

        <div className="flex flex-col lg:flex-row gap-20 lg:gap-32">
           {/* Steps Implementation */}
           <div className="flex-grow space-y-12">
              <AnimatePresence mode="wait">
                 {/* Step 1: Address */}
                 {activeStep === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-12">
                       <section className="space-y-10">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                             <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-brand-navy/30 italic">Receiver Name</label>
                                <input value={addressData.name} onChange={(e) => setAddressData({...addressData, name: e.target.value})} className="w-full bg-transparent border-b border-brand-navy/10 py-5 text-sm font-bold tracking-[0.2em] outline-none focus:border-secondary transition-all" />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-brand-navy/30 italic">Communication Line</label>
                                <input value={addressData.phone} onChange={(e) => setAddressData({...addressData, phone: e.target.value})} placeholder="10-DIGIT MOBILE" className="w-full bg-transparent border-b border-brand-navy/10 py-5 text-sm font-bold tracking-[0.2em] outline-none focus:border-secondary transition-all" />
                             </div>
                             <div className="md:col-span-2 space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-brand-navy/30 italic">Location Protocol (Full Address)</label>
                                <textarea rows={2} value={addressData.address} onChange={(e) => setAddressData({...addressData, address: e.target.value})} className="w-full bg-transparent border-b border-brand-navy/10 py-5 text-sm font-bold tracking-[0.2em] outline-none focus:border-secondary transition-all resize-none" />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-brand-navy/30 italic">City Hub</label>
                                <input value={addressData.city} onChange={(e) => setAddressData({...addressData, city: e.target.value})} className="w-full bg-transparent border-b border-brand-navy/10 py-5 text-sm font-bold tracking-[0.2em] outline-none focus:border-secondary transition-all" />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-brand-navy/30 italic">Pincode Coordinate</label>
                                <input value={addressData.pincode} onChange={(e) => setAddressData({...addressData, pincode: e.target.value})} maxLength={6} className="w-full bg-transparent border-b border-brand-navy/10 py-5 text-sm font-bold tracking-[0.2em] outline-none focus:border-secondary transition-all" />
                             </div>
                          </div>
                       </section>
                       <button onClick={() => setActiveStep(2)} className="w-full md:w-auto px-16 py-6 bg-brand-navy text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-secondary transition-all flex items-center justify-center gap-4">
                          <span>AUTHENTICATE LOCATION</span>
                          <ArrowRight size={14} />
                       </button>
                    </motion.div>
                 )}

                 {/* Step 2: Prescription */}
                 {activeStep === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-12">
                       <div className="p-10 bg-brand-navy text-white space-y-10 shadow-2xl relative overflow-hidden group">
                          <FileText size={64} className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-1000" />
                          <div className="space-y-2">
                             <h2 className="text-2xl font-serif italic text-secondary">Clinical Metadata</h2>
                             <p className="text-[10px] uppercase font-bold tracking-widest text-white/40">Optional: Enter your visionary power details for precision grinding.</p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                             <div className="space-y-4">
                                <label className="text-[9px] font-black uppercase tracking-widest text-secondary italic">Power: Left Eye (SPh)</label>
                                <input value={prescription.left_eye} onChange={(e) => setPrescription({...prescription, left_eye: e.target.value})} placeholder="+0.00 / -0.00" className="w-full bg-white/5 border-b border-white/10 py-4 px-2 text-sm font-bold outline-none focus:border-secondary transition-all" />
                             </div>
                             <div className="space-y-4">
                                <label className="text-[9px] font-black uppercase tracking-widest text-secondary italic">Power: Right Eye (SPh)</label>
                                <input value={prescription.right_eye} onChange={(e) => setPrescription({...prescription, right_eye: e.target.value})} placeholder="+0.00 / -0.00" className="w-full bg-white/5 border-b border-white/10 py-4 px-2 text-sm font-bold outline-none focus:border-secondary transition-all" />
                             </div>
                             <div className="space-y-4 md:col-span-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-secondary italic">Pupillary Distance (PD)</label>
                                <input value={prescription.pd} onChange={(e) => setPrescription({...prescription, pd: e.target.value})} placeholder="STANDARD 62mm" className="w-full bg-white/5 border-b border-white/10 py-4 px-2 text-sm font-bold outline-none focus:border-secondary transition-all" />
                             </div>
                          </div>
                          <div className="border-2 border-dashed border-white/10 p-12 text-center space-y-4 group/upload cursor-pointer hover:border-secondary transition-colors">
                             <Upload size={32} className="mx-auto text-white/20 group-hover/upload:text-secondary group-hover/upload:scale-110 transition-all" />
                             <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Upload Clinical Vision Report (Image/PDF)</p>
                          </div>
                       </div>
                       <div className="flex gap-4">
                          <button onClick={() => setActiveStep(1)} className="px-10 py-6 border border-brand-navy/10 text-[10px] font-black uppercase tracking-[0.3em] hover:border-brand-navy transition-all">Back</button>
                          <button onClick={() => setActiveStep(3)} className="flex-grow py-6 bg-brand-navy text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-secondary transition-all flex items-center justify-center gap-4">
                             <span>FINALIZE ARCHIVE SELECTION</span>
                             <ArrowRight size={14} />
                          </button>
                       </div>
                    </motion.div>
                 )}

                 {/* Step 3: Payment */}
                 {activeStep === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-12">
                       <section className="bg-white border border-brand-navy/5 p-12 shadow-sm space-y-10">
                          <div className="flex items-center gap-4 text-emerald-500 bg-emerald-500/5 p-6 border border-emerald-500/10">
                             <ShieldCheck size={24} />
                             <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest">Protocol Verified</p>
                                <p className="text-[9px] uppercase font-bold text-emerald-500/60">Your clinical data and shipping coordinates are synchronized.</p>
                             </div>
                          </div>
                          <div className="space-y-8">
                             <div className="flex justify-between items-end border-b border-brand-navy/5 pb-6 text-brand-navy/40">
                                <p className="text-[10px] font-bold uppercase tracking-widest">Payment Method</p>
                                <p className="text-xs font-serif italic text-brand-navy font-black italic">Razorpay Secured</p>
                             </div>
                             <p className="text-[11px] leading-relaxed italic text-brand-navy/50">
                                By completing this purchase, you authorize the acquisition of the listed optic archives. The transaction is protected under our Sartorial Excellence Guarantee.
                             </p>
                          </div>
                       </section>
                       <div className="flex gap-4">
                          <button onClick={() => setActiveStep(2)} className="px-10 py-6 border border-brand-navy/10 text-[10px] font-black uppercase tracking-[0.3em] hover:border-brand-navy transition-all">Back</button>
                          <button 
                             onClick={handlePayment} 
                             disabled={orderProcessing}
                             className="flex-grow py-6 bg-secondary text-brand-navy text-[10px] font-black uppercase tracking-[0.5em] hover:bg-brand-navy hover:text-white transition-all duration-700 flex items-center justify-center gap-4 shadow-[0_20px_50px_rgba(var(--brand-gold-rgb),0.3)] disabled:opacity-50"
                          >
                             <span>{orderProcessing ? "EXECUTING PROTOCOL..." : "INITIATE TRANSFER"}</span>
                             {!orderProcessing && <CreditCard size={18} />}
                          </button>
                       </div>
                    </motion.div>
                 )}
              </AnimatePresence>
           </div>

           {/* Static Sidebar Summary */}
           <aside className="w-full lg:w-[400px] shrink-0">
             <div className="sticky top-32 space-y-10 bg-white border border-brand-navy/5 p-12 shadow-2xl">
                <div className="space-y-4 border-b border-brand-navy/5 pb-8">
                   <h3 className="text-2xl font-serif italic text-brand-navy uppercase">Order Matrix</h3>
                   <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-brand-navy/30">Lenzify Vault Snapshot</p>
                </div>
                
                <div className="space-y-10 max-h-[350px] overflow-y-auto pr-4 custom-scrollbar">
                   {cartItems.map(item => (
                      <div key={item.id} className="flex gap-6 group">
                         <div className="w-16 h-16 bg-brand-background border border-brand-navy/5 p-2 overflow-hidden flex items-center justify-center grayscale group-hover:grayscale-0 transition-all">
                            <Image src={item.products?.product_images?.[0]?.image_url || "/placeholder.jpg"} alt={item.name} width={50} height={50} className="object-contain" />
                         </div>
                         <div className="flex-1 space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-brand-navy truncate">{item.products?.name}</p>
                            <div className="flex justify-between items-center italic">
                               <span className="text-[9px] font-bold text-brand-navy/30 uppercase">Unit: {item.quantity}</span>
                               <span className="text-xs font-serif italic text-secondary font-black">₹{item.price.toLocaleString()}</span>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>

                <div className="space-y-6 pt-10 border-t border-brand-navy/5">
                   <div className="space-y-4">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-brand-navy/30">
                         <span>Archive Total</span>
                         <span className="text-brand-navy font-black">₹{cartItems.reduce((acc, i) => acc + (i.price * i.quantity), 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-brand-navy/30">
                         <span>Protocol Tax (18%)</span>
                         <span className="text-brand-navy font-black">₹{(cartItems.reduce((acc, i) => acc + (i.price * i.quantity), 0) * 0.18).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-secondary italic font-black">
                         <span>Shipping Matrix</span>
                         <span>COMPLIMENTARY</span>
                      </div>
                   </div>
                   
                   <div className="pt-6 border-t border-brand-navy/10 flex justify-between items-baseline">
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-navy/20">Final Value</span>
                      <span className="text-4xl font-serif italic text-brand-navy font-black pr-2">₹{(cartItems.reduce((acc, i) => acc + (i.price * i.quantity), 0) * 1.18).toLocaleString()}</span>
                   </div>
                </div>
             </div>
           </aside>
        </div>
      </main>
    </div>
  );
}
