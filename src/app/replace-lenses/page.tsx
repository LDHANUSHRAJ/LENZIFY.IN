"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Upload, CheckCircle2, ShieldCheck, Truck, Eye, Camera, Info, Clock, Calendar, CreditCard, Wallet, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getLenses, getCoatings, createReplacementOrder } from "./actions";
import { toast } from "react-hot-toast";

const steps = [
  { id: 1, title: "Frame Details", icon: <Camera size={18} /> },
  { id: 2, title: "Lens Selection", icon: <Eye size={18} /> },
  { id: 3, title: "Prescription", icon: <Info size={18} /> },
  { id: 4, title: "Pickup Details", icon: <Calendar size={18} /> },
  { id: 5, title: "Summary", icon: <Clock size={18} /> },
  { id: 6, title: "Payment", icon: <CreditCard size={18} /> },
];

const supabase = createClient();

function ReplaceLensesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Data from DB
  const [lenses, setLenses] = useState<any[]>([]);
  const [coatings, setCoatings] = useState<any[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    frame_type: "", // Full Rim, Half Rim, Rimless
    frame_condition: "",
    frame_images: [] as string[],
    lens_id: "",
    coating_ids: [] as string[],
    prescription_type: "upload", // upload or manual
    prescription_url: "",
    prescription_data: {
      od_sph: "", od_cyl: "", od_axis: "", od_add: "",
      os_sph: "", os_cyl: "", os_axis: "", os_add: "",
      pd: ""
    },
    pickup_address: {
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: ""
    },
    delivery_address: {
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: ""
    },
    is_delivery_different: false,
    pickup_date: "",
    pickup_time_slot: "",
    delivery_date: "",
    payment_method: "online" // online or cod
  });

  const pickupFee = 50;
  const deliveryFee = 50;

  useEffect(() => {
    // Initial fetch
    const initAuth = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser);
    };
    initAuth();

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null);
    });

    async function fetchData() {
      const [lensesData, coatingsData] = await Promise.all([
        getLenses(),
        getCoatings()
      ]);
      setLenses(lensesData);
      setCoatings(coatingsData);
      
      // Pre-fill logic
      const prefillLensId = searchParams.get("lensId");
      if (prefillLensId) {
          const lensExists = lensesData.some(l => l.id === prefillLensId);
          if (lensExists) {
              setFormData(prev => ({ ...prev, lens_id: prefillLensId }));
              toast.success("Optical matrix pre-selected from your preference.");
          }
      }
      
      setLoading(false);
    }
    fetchData();

    // Load Razorpay Script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      subscription.unsubscribe();
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [supabase, searchParams]);

  const calculateTotal = () => {
    const selectedLens = lenses.find(l => l.id === formData.lens_id);
    const lensPrice = selectedLens ? Number(selectedLens.price) : 0;
    
    const coatingsPrice = formData.coating_ids.reduce((acc, id) => {
      const coating = coatings.find(c => c.id === id);
      return acc + (coating ? Number(coating.price) : 0);
    }, 0);

    const extraLogisticsFee = formData.is_delivery_different ? 50 : 0;
    return lensPrice + coatingsPrice + pickupFee + deliveryFee + extraLogisticsFee;
  };

  const nextStep = () => {
    if (currentStep === 1) {
        if (!formData.frame_type) { toast.error("Please select a frame architecture"); return; }
        if (!formData.frame_condition) { toast.error("Please select frame condition"); return; }
        // Note: For now frame_images is mock handled, but we check if it's empty
        // In a real app, this would check if the upload process is complete
        if (formData.frame_images.length === 0) { 
            // For testing purposes, we might want to auto-populate or allow bypass if we haven't implemented actual upload
            // but the user explicitly said "make it mandatory"
            toast.error("Visual documentation is mandatory. Please upload frame images.");
            return;
        }
    }
    if (currentStep === 2 && !formData.lens_id) {
        toast.error("Optical matrix selection is required");
        return;
    }
    if (currentStep === 3) {
        if (formData.prescription_type === "upload" && !formData.prescription_url) {
            toast.error("Prescription script is mandatory for upload protocols");
            return;
        }
        if (formData.prescription_type === "manual") {
            const d = formData.prescription_data;
            if (!d.od_sph || !d.os_sph || !d.pd) {
                toast.error("Crucial prescription metrics are missing");
                return;
            }
        }
    }
    if (currentStep === 4) {
        const addr = formData.pickup_address;
        if (!addr.name || !addr.phone || !addr.address || !addr.pincode) {
            toast.error("Pickup coordinates are mandatory");
            return;
        }
        if (!formData.pickup_date) {
            toast.error("Pickup date is required");
            return;
        }
        if (formData.is_delivery_different) {
            const dAddr = formData.delivery_address;
            if (!dAddr.name || !dAddr.phone || !dAddr.address || !dAddr.pincode) {
                toast.error("Delivery coordinates are mandatory for custom routing");
                return;
            }
        }
        if (!formData.delivery_date) {
            toast.error("Delivery date is required");
            return;
        }
    }
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };
  const prevStep = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };

  const uploadToSupabase = async (file: File, folder: string) => {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `${folder}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('replacement-files')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('replacement-files')
            .getPublicUrl(filePath);

        return publicUrl;
    } catch (error: any) {
        console.error("Transmission glitch:", error);
        toast.error(`Upload failed: ${error.message}`);
        return null;
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
     const files = e.target.files;
     if (!files || files.length === 0) return;

     const toastId = toast.loading("Transmitting optical evidence...");

     const uploadPromises = Array.from(files).map(file => uploadToSupabase(file, 'frames'));
     const urls = await Promise.all(uploadPromises);
     
     const validUrls = urls.filter(url => url !== null) as string[];
     
     if (validUrls.length > 0) {
        setFormData({
            ...formData, 
            frame_images: [...formData.frame_images, ...validUrls]
        });
        toast.success("Optical evidence secured.", { id: toastId });
     } else {
        toast.error("Transmission sequence failed.", { id: toastId });
     }
  };

  const removeFrameImage = (index: number) => {
      const newImages = [...formData.frame_images];
      newImages.splice(index, 1);
      setFormData({...formData, frame_images: newImages});
      toast.success("Image purged from manifest.");
  };

  const handleSubmit = async () => {
    if (!user) {
        toast.error("Please login to place an order");
        router.push("/auth/login?redirect=/replace-lenses");
        return;
    }

    setSubmitting(true);
    const total = calculateTotal();
    const selectedLens = lenses.find(l => l.id === formData.lens_id);
    
    const baseOrderData = {
        ...formData,
        lens_price: selectedLens ? Number(selectedLens.price) : 0,
        coatings_price: formData.coating_ids.reduce((acc, id) => {
            const coating = coatings.find(c => c.id === id);
            return acc + (coating ? Number(coating.price) : 0);
        }, 0),
        pickup_fee: pickupFee,
        delivery_fee: deliveryFee,
        total_price: total
    };

    if (formData.payment_method === 'cod') {
        const res = await createReplacementOrder(baseOrderData);
        setSubmitting(false);
        if (res.success) {
            toast.success("Order Placed Successfully!");
            router.push(`/orders/success?id=${res.order.id}`);
        } else {
            toast.error(res.error || "Failed to place order");
        }
        return;
    }

    // Razorpay Flow
    try {
        const toastId = toast.loading("Initializing secure payment vault...");
        const res = await fetch("/api/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: total })
        });
        
        if (!res.ok) {
            const errBody = await res.json().catch(() => ({}));
            console.error("[RAZORPAY CLIENT] API Error:", errBody);
            throw new Error(errBody.details || errBody.error || "Payment gateway initialization failed.");
        }
        const rzpOrder = await res.json();

        if (!(window as any).Razorpay) {
            throw new Error("Razorpay SDK not available.");
        }

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: rzpOrder.amount,
            currency: rzpOrder.currency,
            name: "LENZIFY",
            description: "Visionary Lens Replacement Protocol",
            order_id: rzpOrder.id,
            prefill: {
                name: formData.pickup_address.name || user.user_metadata?.name,
                contact: formData.pickup_address.phone,
                email: user.email
            },
            theme: { color: "#0F172A" },
            handler: async function (response: any) {
                const finalRes = await createReplacementOrder({
                    ...baseOrderData,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id
                });
                
                if (finalRes.success) {
                    toast.success("Transaction Complete. Order Secured.", { id: toastId });
                    router.push(`/orders/success?id=${finalRes.order.id}`);
                } else {
                    toast.error(finalRes.error || "Order synchronization failure.", { id: toastId });
                }
                setSubmitting(false);
            },
            modal: {
                ondismiss: function() {
                    setSubmitting(false);
                    toast.dismiss(toastId);
                }
            }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
    } catch (error: any) {
        console.error("Razorpay Error:", error);
        toast.error(error.message || "Payment Matrix Failure");
        setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-surface font-sans">
        <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-brand-navy">Initializing Protocol...</p>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-surface pt-32 pb-24 font-sans selection:bg-secondary selection:text-brand-navy">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* PROGRESS HEADER */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-serif italic text-brand-navy tracking-tight leading-none">
                    Lens <span className="text-secondary">Renewal</span>
                </h1>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-navy/40">Step {currentStep} of {steps.length}: {steps[currentStep-1].title}</p>
            </div>
            
            <div className="flex gap-2">
                {steps.map((s) => (
                    <div 
                      key={s.id} 
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border",
                        currentStep >= s.id ? "bg-brand-navy border-brand-navy text-white" : "bg-white border-brand-navy/10 text-brand-navy/20"
                      )}
                    >
                        {currentStep > s.id ? <CheckCircle2 size={16} className="text-secondary" /> : s.icon}
                    </div>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2">
                <AnimatePresence mode="wait">
                    
                    {/* STEP 1: FRAME DETAILS */}
                    {currentStep === 1 && (
                        <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                            <div className="space-y-8">
                                <label className="text-[11px] font-black uppercase tracking-widest text-brand-navy">Frame Architecture *</label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {["Full Rim", "Half Rim", "Rimless"].map(type => (
                                        <button 
                                          key={type}
                                          onClick={() => setFormData({...formData, frame_type: type})}
                                          className={cn(
                                            "p-8 border transition-all text-center group",
                                            formData.frame_type === type ? "bg-brand-navy border-secondary text-white shadow-xl scale-[1.02]" : "bg-white border-brand-navy/5 text-brand-navy hover:border-brand-navy/20"
                                          )}
                                        >
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em]">{type}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-8">
                                <label className="text-[11px] font-black uppercase tracking-widest text-brand-navy">Frame Condition *</label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {["Excellent", "Used", "Worn Out"].map(cond => (
                                        <button 
                                          key={cond}
                                          onClick={() => setFormData({...formData, frame_condition: cond})}
                                          className={cn(
                                            "p-8 border transition-all text-center",
                                            formData.frame_condition === cond ? "bg-brand-navy border-secondary text-white shadow-xl scale-[1.02]" : "bg-white border-brand-navy/5 text-brand-navy hover:border-brand-navy/20"
                                          )}
                                        >
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em]">{cond}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <label className="text-[11px] font-black uppercase tracking-widest text-brand-navy block">Visual Documentation *</label>
                                <div className="space-y-6">
                                    <div className="border-2 border-dashed border-brand-navy/10 p-12 text-center bg-white/50 hover:bg-white hover:border-secondary transition-all cursor-pointer group">
                                        <input type="file" multiple className="hidden" id="frame-upload" onChange={handleFileUpload} />
                                        <label htmlFor="frame-upload" className="cursor-pointer space-y-4 block">
                                            <Upload className="mx-auto text-brand-navy/10 group-hover:text-secondary transition-all" size={48} />
                                            <div className="space-y-2">
                                                <p className="text-[11px] font-black uppercase tracking-widest text-brand-navy">Drop frame images or click to scan</p>
                                                <p className="text-[10px] text-brand-navy/40 uppercase font-bold tracking-widest italic">Digital evidence required for processing</p>
                                            </div>
                                        </label>
                                    </div>

                                    {formData.frame_images.length > 0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                            {formData.frame_images.map((url, idx) => (
                                                <div key={idx} className="aspect-square bg-white border border-brand-navy/5 relative group overflow-hidden">
                                                    <img src={url} alt={`Frame ${idx + 1}`} className="w-full h-full object-cover" />
                                                    <button 
                                                        onClick={() => removeFrameImage(idx)}
                                                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 opacity-0 group-hover:opacity-100 transition-all hover:bg-brand-navy"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: LENS & COATINGS */}
                    {currentStep === 2 && (
                        <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                            <div className="space-y-8">
                                <label className="text-[11px] font-black uppercase tracking-widest text-brand-navy">Primary Optic Matrix</label>
                                <div className="space-y-4">
                                    {lenses.map(lens => (
                                        <button 
                                          key={lens.id}
                                          onClick={() => setFormData({...formData, lens_id: lens.id})}
                                          className={cn(
                                            "w-full p-8 border text-left transition-all flex justify-between items-center",
                                            formData.lens_id === lens.id ? "bg-brand-navy border-secondary text-white shadow-2xl" : "bg-white border-brand-navy/5 text-brand-navy hover:border-brand-navy/20"
                                          )}
                                        >
                                            <div>
                                                <h3 className="text-[12px] font-black uppercase tracking-widest mb-1">{lens.name}</h3>
                                                <p className="text-[10px] opacity-60 uppercase tracking-wider">{lens.description}</p>
                                            </div>
                                            <span className="text-xl font-serif italic text-secondary">₹{Number(lens.price).toLocaleString()}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-8">
                                <label className="text-[11px] font-black uppercase tracking-widest text-brand-navy">Protective Enhancements (Coatings)</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {coatings.map(coating => {
                                        const isSelected = formData.coating_ids.includes(coating.id);
                                        return (
                                            <button 
                                              key={coating.id}
                                              onClick={() => {
                                                const newIds = isSelected 
                                                    ? formData.coating_ids.filter(id => id !== coating.id)
                                                    : [...formData.coating_ids, coating.id];
                                                setFormData({...formData, coating_ids: newIds});
                                              }}
                                              className={cn(
                                                "p-6 border text-left transition-all relative overflow-hidden",
                                                isSelected ? "bg-secondary/10 border-secondary text-brand-navy" : "bg-white border-brand-navy/5 text-brand-navy hover:border-brand-navy/20"
                                              )}
                                            >
                                                {isSelected && <div className="absolute top-0 right-0 p-2 text-secondary"><CheckCircle2 size={12} /></div>}
                                                <h4 className="text-[10px] font-black uppercase tracking-widest mb-1">{coating.name}</h4>
                                                <p className="text-[11px] font-serif italic text-brand-navy/60">₹{Number(coating.price).toLocaleString()}</p>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: PRESCRIPTION */}
                    {currentStep === 3 && (
                        <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                            <div className="flex gap-4 p-1 bg-white border border-brand-navy/5 mb-8">
                                {["upload", "manual"].map(type => (
                                    <button 
                                      key={type}
                                      onClick={() => setFormData({...formData, prescription_type: type})}
                                      className={cn(
                                        "flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all",
                                        formData.prescription_type === type ? "bg-brand-navy text-white" : "text-brand-navy/40 hover:text-brand-navy"
                                      )}
                                    >
                                        {type} Data
                                    </button>
                                ))}
                            </div>

                            {formData.prescription_type === "upload" ? (
                                <div className="space-y-6">
                                    <div className="border-2 border-dashed border-brand-navy/10 p-12 text-center bg-white space-y-6">
                                        <input type="file" id="prescription-upload" className="hidden" onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if(file) {
                                                const toastId = toast.loading("Arresting script details...");
                                                const url = await uploadToSupabase(file, 'prescriptions');
                                                if(url) {
                                                    setFormData({...formData, prescription_url: url});
                                                    toast.success("Prescription script secured.", { id: toastId });
                                                }
                                            }
                                        }} />
                                        {formData.prescription_url ? (
                                            <div className="relative group max-w-sm mx-auto aspect-[4/3] bg-brand-surface border border-brand-navy/5 overflow-hidden">
                                                <img src={formData.prescription_url} alt="Prescription Script" className="w-full h-full object-contain" />
                                                <button 
                                                    onClick={() => setFormData({...formData, prescription_url: ""})}
                                                    className="absolute top-4 right-4 bg-brand-navy text-white p-2 opacity-0 group-hover:opacity-100 transition-all hover:bg-secondary"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <label htmlFor="prescription-upload" className="cursor-pointer space-y-4 block">
                                                <Upload className="mx-auto text-brand-navy/10" size={48} />
                                                <div className="space-y-1">
                                                    <p className="text-[11px] font-black uppercase tracking-widest text-brand-navy">Transmit Script (JPG/PNG)</p>
                                                    <p className="text-[9px] font-black text-secondary uppercase tracking-[0.2em]">Select File Phase</p>
                                                </div>
                                            </label>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white border border-brand-navy/5 p-8 space-y-12">
                                    {["od", "os"].map(eye => (
                                        <div key={eye} className="space-y-6">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-navy flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                                                {eye === "od" ? "Right Eye (OD)" : "Left Eye (OS)"}
                                            </h4>
                                            <div className="grid grid-cols-4 gap-4">
                                                {["sph", "cyl", "axis", "add"].map(field => (
                                                    <div key={field}>
                                                        <label className="text-[8px] font-bold uppercase tracking-widest text-brand-navy/40 mb-2 block">{field}</label>
                                                        <input 
                                                          type="text" 
                                                          placeholder="0.00"
                                                          className="w-full bg-brand-surface border-none px-4 py-3 text-[11px] font-bold text-brand-navy focus:ring-1 focus:ring-secondary transition-all"
                                                          value={(formData.prescription_data as any)[`${eye}_${field}`]}
                                                          onChange={(e) => setFormData({
                                                            ...formData, 
                                                            prescription_data: {...formData.prescription_data, [`${eye}_${field}`]: e.target.value}
                                                          })}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    <div className="pt-8 border-t border-brand-navy/5">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-brand-navy mb-4 block">Pupillary Distance (PD)</label>
                                        <input 
                                            type="text" 
                                            placeholder="62mm"
                                            className="w-48 bg-brand-surface border-none px-4 py-3 text-[11px] font-bold text-brand-navy focus:ring-1 focus:ring-secondary transition-all"
                                            value={formData.prescription_data.pd}
                                            onChange={(e) => setFormData({...formData, prescription_data: {...formData.prescription_data, pd: e.target.value}})}
                                        />
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* STEP 4: LOGISTICS PLAN */}
                    {currentStep === 4 && (
                        <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                            {/* Pickup Section */}
                            <div className="space-y-8">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-secondary italic">Step 4A: Retrieval Interface</h3>
                                <div className="bg-white border border-brand-navy/5 p-8 space-y-8 shadow-sm">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-brand-navy/40">Custodian Name *</label>
                                            <input 
                                                className="w-full bg-brand-surface border-none px-4 py-4 text-[11px] font-bold text-brand-navy focus:ring-1 focus:ring-secondary transition-all"
                                                value={formData.pickup_address.name}
                                                onChange={(e) => setFormData({...formData, pickup_address: {...formData.pickup_address, name: e.target.value}})}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-brand-navy/40">Secure Contact *</label>
                                            <input 
                                                className="w-full bg-brand-surface border-none px-4 py-4 text-[11px] font-bold text-brand-navy focus:ring-1 focus:ring-secondary transition-all"
                                                value={formData.pickup_address.phone}
                                                onChange={(e) => setFormData({...formData, pickup_address: {...formData.pickup_address, phone: e.target.value}})}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-brand-navy/40">Pickup Address *</label>
                                        <textarea 
                                            className="w-full bg-brand-surface border-none px-4 py-4 text-[11px] font-bold text-brand-navy focus:ring-1 focus:ring-secondary transition-all h-24 resize-none"
                                            value={formData.pickup_address.address}
                                            onChange={(e) => setFormData({...formData, pickup_address: {...formData.pickup_address, address: e.target.value}})}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {["city", "state", "pincode"].map(field => (
                                            <div key={field} className="space-y-2">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-brand-navy/40">{field} *</label>
                                                <input 
                                                    className="w-full bg-brand-surface border-none px-4 py-4 text-[11px] font-bold text-brand-navy focus:ring-1 focus:ring-secondary transition-all"
                                                    value={(formData.pickup_address as any)[field]}
                                                    onChange={(e) => setFormData({...formData, pickup_address: {...formData.pickup_address, [field]: e.target.value}})}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-4 space-y-4">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-brand-navy">Pickup Date *</label>
                                        <input 
                                            type="date"
                                            className="w-full bg-brand-surface border-none p-4 text-[11px] font-bold text-brand-navy outline-none focus:ring-1 focus:ring-secondary"
                                            value={formData.pickup_date}
                                            onChange={(e) => setFormData({...formData, pickup_date: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Options */}
                            <div className="space-y-8">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-secondary italic">Step 4B: Deployment Interface</h3>
                                    <button 
                                        onClick={() => setFormData({...formData, is_delivery_different: !formData.is_delivery_different})}
                                        className={cn(
                                            "flex items-center gap-3 px-6 py-2 border transition-all text-[9px] font-black uppercase tracking-widest",
                                            formData.is_delivery_different ? "bg-secondary text-brand-navy border-secondary" : "bg-white border-brand-navy/10 text-brand-navy/40 hover:border-brand-navy/30"
                                        )}
                                    >
                                        Custom Delivery Route
                                        {formData.is_delivery_different && <ArrowRight size={12} />}
                                    </button>
                                </div>

                                {formData.is_delivery_different ? (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-white border border-secondary/30 p-8 space-y-8 shadow-xl">
                                        <div className="flex items-center gap-4 p-4 bg-secondary/5 border border-secondary/10 mb-4">
                                            <Info size={16} className="text-secondary" />
                                            <p className="text-[10px] font-black uppercase tracking-widest text-brand-navy/60">Note: Custom routing incurs an additional ₹50 logistics fee</p>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-brand-navy/40">Recipient Name *</label>
                                                <input 
                                                    className="w-full bg-brand-surface border-none px-4 py-4 text-[11px] font-bold text-brand-navy focus:ring-1 focus:ring-secondary transition-all"
                                                    value={formData.delivery_address.name}
                                                    onChange={(e) => setFormData({...formData, delivery_address: {...formData.delivery_address, name: e.target.value}})}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-brand-navy/40">Secure Contact *</label>
                                                <input 
                                                    className="w-full bg-brand-surface border-none px-4 py-4 text-[11px] font-bold text-brand-navy focus:ring-1 focus:ring-secondary transition-all"
                                                    value={formData.delivery_address.phone}
                                                    onChange={(e) => setFormData({...formData, delivery_address: {...formData.delivery_address, phone: e.target.value}})}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-brand-navy/40">Delivery Address *</label>
                                            <textarea 
                                                className="w-full bg-brand-surface border-none px-4 py-4 text-[11px] font-bold text-brand-navy focus:ring-1 focus:ring-secondary transition-all h-24 resize-none"
                                                value={formData.delivery_address.address}
                                                onChange={(e) => setFormData({...formData, delivery_address: {...formData.delivery_address, address: e.target.value}})}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {["city", "state", "pincode"].map(field => (
                                                <div key={field} className="space-y-2">
                                                    <label className="text-[9px] font-black uppercase tracking-widest text-brand-navy/40">{field} *</label>
                                                    <input 
                                                        className="w-full bg-brand-surface border-none px-4 py-4 text-[11px] font-bold text-brand-navy focus:ring-1 focus:ring-secondary transition-all"
                                                        value={(formData.delivery_address as any)[field]}
                                                        onChange={(e) => setFormData({...formData, delivery_address: {...formData.delivery_address, [field]: e.target.value}})}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="p-10 border border-brand-navy/5 bg-white/50 text-center space-y-4">
                                        <CheckCircle2 size={32} className="mx-auto text-brand-navy/10" />
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-navy/40 italic">Same as Pickup Manifest Applied</p>
                                    </div>
                                )}

                                <div className="space-y-4 pt-10 border-t border-brand-navy/5">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-brand-navy">Delivery Date *</label>
                                    <input 
                                        type="date"
                                        className="w-full bg-white border border-brand-navy/5 p-4 text-[11px] font-bold text-brand-navy outline-none focus:border-secondary"
                                        value={formData.delivery_date}
                                        onChange={(e) => setFormData({...formData, delivery_date: e.target.value})}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 5: SUMMARY */}
                    {currentStep === 5 && (
                        <motion.div key="s5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                            <div className="bg-white border border-brand-navy/5 p-10 space-y-10">
                                <div className="flex items-center gap-6 border-b border-brand-navy/5 pb-8">
                                    <div className="w-16 h-16 bg-brand-surface flex items-center justify-center border border-brand-navy/5">
                                        <Eye className="text-secondary" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40 mb-1">Frame Manifest</p>
                                        <p className="text-[14px] font-black uppercase tracking-widest text-brand-navy">{formData.frame_type} • {formData.frame_condition || "Standard"}</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-navy">Optical Ledger</h4>
                                    
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-[11px] font-bold uppercase tracking-widest text-brand-navy/60">{lenses.find(l => l.id === formData.lens_id)?.name}</span>
                                        <span className="text-[14px] font-serif italic">₹{Number(lenses.find(l => l.id === formData.lens_id)?.price || 0).toLocaleString()}</span>
                                    </div>

                                    {formData.coating_ids.map(id => {
                                        const c = coatings.find(x => x.id === id);
                                        return (
                                            <div key={id} className="flex justify-between items-center py-2 border-t border-brand-navy/5">
                                                <span className="text-[11px] font-bold uppercase tracking-widest text-brand-navy/40">Enhancement: {c?.name}</span>
                                                <span className="text-[12px] font-serif italic text-brand-navy/60">₹{Number(c?.price || 0).toLocaleString()}</span>
                                            </div>
                                        );
                                    })}

                                    <div className="flex justify-between items-center py-4 border-y border-brand-navy/5 bg-brand-surface px-4">
                                        <div className="flex items-center gap-3">
                                            <Truck size={14} className="text-secondary" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-brand-navy">Pickup & Delivery Protocol</span>
                                        </div>
                                        <span className="text-[12px] font-serif italic">₹{pickupFee + deliveryFee}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 6: PAYMENT */}
                    {currentStep === 6 && (
                        <motion.div key="s6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <button 
                                  onClick={() => setFormData({...formData, payment_method: "online"})}
                                  className={cn(
                                    "p-10 border transition-all text-left space-y-6 relative overflow-hidden",
                                    formData.payment_method === "online" ? "bg-brand-navy text-white border-secondary shadow-2xl" : "bg-white text-brand-navy border-brand-navy/5"
                                  )}
                                >
                                    <Wallet size={24} className={formData.payment_method === "online" ? "text-secondary" : "text-brand-navy/20"} />
                                    <div>
                                        <h3 className="text-[12px] font-black uppercase tracking-widest mb-1">Digital Settlement</h3>
                                        <p className="text-[10px] opacity-60 uppercase tracking-widest">UPI, Cards, NetBanking</p>
                                    </div>
                                </button>
                                <button 
                                  onClick={() => setFormData({...formData, payment_method: "cod"})}
                                  className={cn(
                                    "p-10 border transition-all text-left space-y-6 relative overflow-hidden",
                                    formData.payment_method === "cod" ? "bg-brand-navy text-white border-secondary shadow-2xl" : "bg-white text-brand-navy border-brand-navy/5"
                                  )}
                                >
                                    <CreditCard size={24} className={formData.payment_method === "cod" ? "text-secondary" : "text-brand-navy/20"} />
                                    <div>
                                        <h3 className="text-[12px] font-black uppercase tracking-widest mb-1">Physical Settlement</h3>
                                        <p className="text-[10px] opacity-60 uppercase tracking-widest">Pay on Pickup/Delivery</p>
                                    </div>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* NAVIGATION */}
                <div className="mt-20 flex gap-6">
                    {currentStep > 1 && (
                        <button 
                          onClick={prevStep}
                          className="px-12 py-5 border border-brand-navy/10 text-[10px] font-black uppercase tracking-widest text-brand-navy hover:bg-white transition-all flex items-center gap-4"
                        >
                            <ArrowLeft size={14} /> Revert
                        </button>
                    )}
                    {currentStep < steps.length ? (
                        <button 
                          onClick={nextStep}
                          className="flex-1 bg-brand-navy text-white text-[10px] font-black uppercase tracking-widest py-5 flex items-center justify-center gap-4 hover:bg-secondary hover:text-brand-navy transition-all shadow-xl"
                        >
                            Continue Phase <ArrowRight size={14} />
                        </button>
                    ) : (
                        <button 
                          onClick={handleSubmit}
                          disabled={submitting}
                          className="flex-1 bg-secondary text-brand-navy text-[12px] font-black uppercase tracking-widest py-5 flex items-center justify-center gap-4 hover:shadow-[0_0_40px_rgba(var(--brand-gold-rgb),0.5)] transition-all disabled:opacity-50"
                        >
                            {submitting ? "Transmitting..." : "Authorize Protocol"}
                        </button>
                    )}
                </div>
            </div>

            {/* SIDEBAR SUMMARY */}
            <aside className="space-y-8">
                <div className="bg-white border border-brand-navy/5 p-8 sticky top-32 shadow-sm">
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-brand-navy/30 mb-6">Live Manifest</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-brand-navy">
                                    <span>Primary Optics</span>
                                    <span>₹{Number(lenses.find(l => l.id === formData.lens_id)?.price || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-brand-navy/40">
                                    <span>Enhancements</span>
                                    <span>₹{formData.coating_ids.reduce((acc, id) => acc + (coatings.find(c => c.id === id)?.price || 0), 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-brand-navy/40">
                                    <span>Logistics Fee</span>
                                    <span>₹100</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-brand-navy/5">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black uppercase tracking-widest text-brand-navy/20 mb-1">Total Authorization</span>
                                <span className="text-4xl font-serif italic text-brand-navy leading-none">₹{calculateTotal().toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-secondary">
                                <ShieldCheck size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Precision Lab Guaranteed</span>
                            </div>
                            <div className="flex items-center gap-3 text-brand-navy/40">
                                <Truck size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest">3-5 Day Completion Cycle</span>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
      </div>
    </div>
  );
}

export default function ReplaceLensesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-brand-surface font-sans">
          <div className="text-center space-y-4">
              <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-[10px] font-black uppercase tracking-widest text-brand-navy">Initializing Protocol...</p>
          </div>
      </div>
    }>
      <ReplaceLensesContent />
    </Suspense>
  );
}
