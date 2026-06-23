"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { getCart } from "@/lib/db/customer_actions";
import { placeOrder } from "@/lib/db/order_actions";
import { cn } from "@/lib/utils";
import { validateCheckoutAddress, sanitizeErrorMessage } from "@/lib/validation";
import { applyCoupon } from "@/lib/db/coupon_actions";
import toast from "react-hot-toast";
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

import { useAuth } from "@/components/providers/AuthProvider";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const { user, loading: authLoading } = useAuth();
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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingPrescription, setUploadingPrescription] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPrescription(true);
    const toastId = toast.loading("Uploading clinical vision report...");

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `prescriptions/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      setPrescription(prev => ({
        ...prev,
        file_url: publicUrl
      }));

      toast.success("Vision report uploaded successfully!", { id: toastId });
    } catch (err: any) {
      console.error("Prescription upload error:", err);
      toast.error(err.message || "Failed to upload vision report.", { id: toastId });
    } finally {
      setUploadingPrescription(false);
    }
  };

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) { toast.error("Enter a coupon code."); return; }
    setApplyingCoupon(true);
    const subtotal = cartItems.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
    const result = await applyCoupon(couponCode.trim(), subtotal);
    setApplyingCoupon(false);
    if (result.error) {
      toast.error(result.error);
    } else if (result.success) {
      setCouponDiscount(result.discount!);
      setCouponApplied(result.description!);
      toast.success(`Coupon applied! ${result.description}`);
    }
  };

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login?redirect=/checkout");
      return;
    }

    if (user) {
        const init = async () => {
          const cart = await getCart();
          if (!cart || cart.length === 0) {
            router.push("/cart");
            return;
          }
          setCartItems(cart);
          
          setAddressData(prev => ({
              ...prev,
              name: user.user_metadata?.name || ""
          }));
          setLoading(false);
        };
        init();
    }

    // Load Razorpay Script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, [user, authLoading, router]);

  const handlePayment = async () => {
    // Validate address fields
    const validationErrors = validateCheckoutAddress(addressData);
    if (validationErrors.length > 0) {
      validationErrors.forEach(err => toast.error(err.message));
      return;
    }
    setOrderProcessing(true);

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const discountedSubtotal = Math.max(0, subtotal - couponDiscount);
    const tax = discountedSubtotal * 0.18;
    const totalAmount = discountedSubtotal + tax;

    // CASE 1: Cash on Delivery
    if (paymentMethod === "cod") {
      try {
        const orderRes = await placeOrder({
          items: cartItems.map(item => ({
              id: item.product_id,
              quantity: item.quantity,
              price: item.price,
              lens_id: item.lens_id,
              prescription_json: item.prescription_json || (prescription.left_eye ? { 
                od_sph: prescription.right_eye, 
                os_sph: prescription.left_eye,
                pd: prescription.pd
              } : null)
          })),
          total_price: totalAmount,
          address: addressData,
          prescription: (prescription.left_eye || prescription.file_url) ? prescription : undefined,
          payment: {
              id: `cod_${Date.now()}`,
              method: "cod"
          }
        });

        if (orderRes.success) {
          router.push(`/orders/success?id=${orderRes.order_id}`);
        } else {
          toast.error(sanitizeErrorMessage(orderRes.error || ""));
        }
      } catch (e) {
        console.error("COD Error:", e);
        toast.error("Failed to place your order. Please try again.");
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
            // STEP 1: Verify payment signature server-side
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();

            if (!verifyData.verified) {
              toast.error("Payment verification failed. Please contact support.");
              setOrderProcessing(false);
              return;
            }

            // STEP 2: Place order after verified payment
            const orderRes = await placeOrder({
              items: cartItems.map(item => ({
                  id: item.product_id,
                  quantity: item.quantity,
                  price: item.price,
                  lens_id: item.lens_id,
                  prescription_json: item.prescription_json || (prescription.left_eye ? { 
                    od_sph: prescription.right_eye, 
                    os_sph: prescription.left_eye,
                    pd: prescription.pd
                  } : null)
              })),
              total_price: totalAmount,
              address: addressData,
              prescription: (prescription.left_eye || prescription.file_url) ? prescription : undefined,
              payment: {
                  id: response.razorpay_payment_id,
                  method: "razorpay"
              }
            });

            if (orderRes.success) {
              router.push(`/orders/success?id=${orderRes.order_id}`);
            } else {
              console.error("Order Placement Error:", orderRes.error);
              toast.error(orderRes.error || "Order placement failed. Please contact support.");
              setOrderProcessing(false);
            }
          } catch (err: any) {
            console.error("Fulfillment Exception:", err);
            toast.error(`Order processing failed: ${err.message || "Unknown error"}. Please contact support.`);
            setOrderProcessing(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
          console.error("Payment Failed Callback:", response.error);
          toast.error("Payment failed: " + (response.error.description || "Please try again."));
          setOrderProcessing(false);
      });
      rzp.open();
    } catch (e: any) {
      console.error("Razorpay Init Error:", e);
      toast.error("Payment initialization failed. Please try again.");
      setOrderProcessing(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-surface flex items-center justify-center text-[10px] font-bold uppercase tracking-[0.5em] animate-pulse text-brand-navy/30">Initializing Checkout Matrix...</div>;

  return (
    <div className="bg-surface text-brand-navy min-h-screen pt-24 font-sans text-brand-navy">
      <main className="max-w-screen-2xl mx-auto px-8 md:px-12 py-12 lg:py-20 pb-32">
        <header className="mb-20 space-y-6">
           <div className="flex flex-wrap items-center gap-4 md:gap-6">
              {[1, 2, 3].map(step => (
                <div key={step} className="flex items-center gap-2 md:gap-3">
                   <div className={cn(
                      "w-7 h-7 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center text-[9px] md:text-[10px] font-black transition-all duration-700",
                      activeStep === step ? "border-secondary bg-secondary text-brand-navy shadow-lg" : 
                      activeStep > step ? "border-emerald-500 bg-emerald-500 text-white" : "border-brand-navy/10 text-brand-navy/20"
                   )}>
                      {activeStep > step ? <CheckCircle2 size={12} /> : step}
                   </div>
                   <span className={cn(
                      "text-[9px] md:text-[10px] font-bold uppercase tracking-widest italic",
                      activeStep === step ? "text-brand-navy" : "text-brand-navy/20"
                   )}>
                      {step === 1 ? "COORDINATES" : step === 2 ? "CLINICAL" : "FINALIZE"}
                   </span>
                   {step < 3 && <div className="hidden sm:block w-8 md:w-12 h-px bg-brand-navy/5"></div>}
                </div>
              ))}
           </div>
           <h1 className="text-4xl md:text-6xl font-serif italic text-brand-navy font-black tracking-tight uppercase leading-none">
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

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
                              <div className="space-y-4">
                                 <label className="text-[9px] font-black uppercase tracking-widest text-brand-navy/40">Consignee Name</label>
                                 <input value={addressData.name} onChange={(e) => setAddressData({...addressData, name: e.target.value})} placeholder="ENTROPY RECIPIENT" className="w-full bg-transparent border-b border-brand-navy/10 py-4 px-2 text-sm font-bold text-brand-navy outline-none focus:border-secondary transition-all" />
                              </div>
                              <div className="space-y-4">
                                 <label className="text-[9px] font-black uppercase tracking-widest text-brand-navy/40">Secure Contact</label>
                                 <input value={addressData.phone} onChange={(e) => setAddressData({...addressData, phone: e.target.value})} placeholder="+91 XXXXXXXXXX" className="w-full bg-transparent border-b border-brand-navy/10 py-4 px-2 text-sm font-bold text-brand-navy outline-none focus:border-secondary transition-all" />
                              </div>
                              <div className="space-y-4">
                                 <label className="text-[9px] font-black uppercase tracking-widest text-brand-navy/40">Destination Pincode</label>
                                 <input value={addressData.pincode} onChange={(e) => setAddressData({...addressData, pincode: e.target.value})} placeholder="XXXXXX" className="w-full bg-transparent border-b border-brand-navy/10 py-4 px-2 text-sm font-bold text-brand-navy outline-none focus:border-secondary transition-all" />
                              </div>
                              <div className="space-y-4">
                                 <label className="text-[9px] font-black uppercase tracking-widest text-brand-navy/40">Urban Sector (City)</label>
                                 <input value={addressData.city} onChange={(e) => setAddressData({...addressData, city: e.target.value})} placeholder="METROPOLIS" className="w-full bg-transparent border-b border-brand-navy/10 py-4 px-2 text-sm font-bold text-brand-navy outline-none focus:border-secondary transition-all" />
                              </div>
                              <div className="space-y-4">
                                 <label className="text-[9px] font-black uppercase tracking-widest text-brand-navy/40">Region (State)</label>
                                 <input value={addressData.state} onChange={(e) => setAddressData({...addressData, state: e.target.value})} placeholder="STATE/PROVINCE" className="w-full bg-transparent border-b border-brand-navy/10 py-4 px-2 text-sm font-bold text-brand-navy outline-none focus:border-secondary transition-all" />
                              </div>
                              <div className="md:col-span-2 space-y-4 pt-4">
                                 <label className="text-[9px] font-black uppercase tracking-widest text-brand-navy/40">Structural Address (House/Street)</label>
                                 <textarea value={addressData.address} onChange={(e) => setAddressData({...addressData, address: e.target.value})} rows={3} placeholder="STREET, BUILDING, SECTOR" className="w-full bg-transparent border-b border-brand-navy/10 py-4 px-2 text-sm font-bold text-brand-navy outline-none focus:border-secondary transition-all resize-none" />
                              </div>
                           </div>
                        </section>
                        {/* Check if ALL items are frame only */}
                        {(() => {
                           const isFrameOnly = cartItems.length > 0 && cartItems.every(item => !item.lens_id && !item.prescription_json);
                           return (
                              <button onClick={() => setActiveStep(isFrameOnly ? 3 : 2)} className="w-full md:w-auto flex items-center justify-center gap-6 py-6 px-12 bg-brand-navy text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-secondary hover:text-brand-navy transition-all shadow-xl group">
                                 <span>{isFrameOnly ? "Proceed to Finalize" : "Proceed to Clinical Data"}</span>
                                 <ChevronRight size={14} className="group-hover:translate-x-2 transition-transform" />
                              </button>
                           );
                        })()}
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
                           <div 
                              onClick={() => fileInputRef.current?.click()}
                              className="border border-dashed border-brand-navy/10 p-12 text-center space-y-4 group/upload cursor-pointer hover:border-secondary transition-colors bg-brand-background/30 relative"
                           >
                              <input 
                                 type="file" 
                                 ref={fileInputRef} 
                                 className="hidden" 
                                 onChange={handleFileUpload} 
                                 accept="image/*,application/pdf"
                                 disabled={uploadingPrescription}
                              />
                              <Upload size={32} className="mx-auto text-brand-navy/20 group-hover/upload:text-secondary group-hover/upload:scale-110 transition-all" />
                              {uploadingPrescription ? (
                                <p className="text-[10px] font-bold uppercase tracking-widest text-secondary italic animate-pulse">Uploading...</p>
                              ) : prescription.file_url ? (
                                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 italic">Report Linked ✓</p>
                              ) : (
                                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-navy/30 italic">Upload Clinical Vision Report (Image/PDF)</p>
                              )}
                           </div>
                       </div>
                       <div className="flex flex-col sm:flex-row gap-4">
                          <button onClick={() => setActiveStep(1)} className="py-6 px-12 border border-brand-navy/10 text-brand-navy text-[10px] font-black uppercase tracking-[0.4em] hover:bg-brand-background transition-all">Back</button>
                          <button onClick={() => setActiveStep(3)} className="flex-grow flex items-center justify-center gap-6 py-6 px-12 bg-brand-navy text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-secondary hover:text-brand-navy transition-all shadow-xl group">
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
                       <div className="flex flex-col sm:flex-row gap-4">
                          <button onClick={() => {
                             const isFrameOnly = cartItems.length > 0 && cartItems.every(item => !item.lens_id && !item.prescription_json);
                             setActiveStep(isFrameOnly ? 1 : 2);
                          }} className="py-6 px-12 border border-brand-navy/10 text-brand-navy text-[10px] font-black uppercase tracking-[0.4em] hover:bg-brand-background transition-all">Back</button>
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
                               <p className="text-[11px] font-black text-brand-navy italic">₹{(item.price || item.products?.offer_price || 0).toLocaleString()}</p>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>

                 {/* Coupon Code Input */}
                 <div className="pt-10 border-t border-brand-navy/5 space-y-4">
                    <p className="text-[9px] font-black uppercase tracking-widest text-brand-navy/30 italic">Promotion Code</p>
                    <div className="flex gap-2">
                       <input
                         value={couponCode}
                         onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                         placeholder="ENTER CODE"
                         disabled={!!couponApplied}
                         className="flex-1 bg-transparent border border-brand-navy/10 py-3 px-4 text-[10px] font-bold text-brand-navy uppercase tracking-widest outline-none focus:border-secondary transition-all disabled:opacity-40"
                       />
                       {couponApplied ? (
                         <button
                           onClick={() => { setCouponDiscount(0); setCouponApplied(""); setCouponCode(""); }}
                           className="px-4 py-3 bg-red-50 text-red-500 text-[9px] font-black uppercase tracking-widest border border-red-100 hover:bg-red-100 transition-all"
                         >Remove</button>
                       ) : (
                         <button
                           onClick={handleApplyCoupon}
                           disabled={applyingCoupon}
                           className="px-6 py-3 bg-brand-navy text-white text-[9px] font-black uppercase tracking-widest hover:bg-secondary hover:text-brand-navy transition-all disabled:opacity-50"
                         >{applyingCoupon ? "..." : "Apply"}</button>
                       )}
                    </div>
                    {couponApplied && (
                       <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">✓ {couponApplied} applied</p>
                    )}
                 </div>

                 <div className="space-y-6 pt-6">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-brand-navy/40">
                       <span className="italic text-brand-navy/40">Archive Total</span>
                       <span className="text-brand-navy">₹{cartItems.reduce((acc: number, i: any) => acc + (i.price * i.quantity), 0).toLocaleString()}</span>
                    </div>
                    {couponDiscount > 0 && (
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-emerald-500">
                          <span className="italic">Coupon Discount</span>
                          <span>-₹{couponDiscount.toLocaleString()}</span>
                       </div>
                    )}
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-brand-navy/40">
                       <span className="italic text-brand-navy/40">Protocol Tax (18%)</span>
                       <span className="text-brand-navy">₹{((cartItems.reduce((acc: number, i: any) => acc + (i.price * i.quantity), 0) - couponDiscount) * 0.18).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                       <span className="text-secondary italic">Shipping Matrix</span>
                       <span className="text-secondary italic">Complimentary</span>
                    </div>
                    <div className="pt-8 flex justify-between items-baseline border-t border-brand-navy/5">
                       <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-navy/20 italic">Final Value</span>
                       <span className="text-4xl font-serif italic text-brand-navy font-black">₹{((cartItems.reduce((acc: number, i: any) => acc + (i.price * i.quantity), 0) - couponDiscount) * 1.18).toLocaleString()}</span>
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
