"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Upload, CheckCircle2, ShieldCheck, Truck, PackageCheck, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { getLensTypes, getLensAddons, createReplacementOrder } from "./actions";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ReplaceLensesPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  
  const [step, setStep] = useState(1);
  const totalSteps = 6;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Data State
  const [lensTypes, setLensTypes] = useState<any[]>([]);
  const [lensAddons, setLensAddons] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    frame_type: "",
    frame_condition: "",
    frame_image_url: "",
    lens_id: "",
    add_ons: [] as string[],
    prescription_json: { od_sph: "", od_cyl: "", od_axis: "", od_add: "", os_sph: "", os_cyl: "", os_axis: "", os_add: "", pd: "" },
    prescription_file_url: "",
    address_id: "",
    pickup_date: "",
    pickup_slot: "",
    payment_method: "cash_on_delivery"
  });

  const generateDates = () => {
     const dates = [];
     for(let i=1; i<=7; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        dates.push(d.toISOString().split('T')[0]);
     }
     return dates;
  };
  const pickupDates = generateDates();
  const pickupSlots = ["09:00 AM - 12:00 PM", "12:00 PM - 03:00 PM", "03:00 PM - 06:00 PM"];

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
         const { data: addrs } = await supabase.from("addresses").select("*").eq("user_id", user.id);
         setAddresses(addrs || []);
         if (addrs && addrs.length > 0) setFormData(p => ({...p, address_id: addrs[0].id.toString()}));
      }

      const types = await getLensTypes();
      const addons = await getLensAddons();
      setLensTypes(types);
      setLensAddons(addons);
      setLoading(false);
    };
    init();
  }, [supabase]);

  const handleNext = () => {
     if(step === 1 && !user) {
        alert("Please login first to proceed with lens replacement.");
        return router.push(`/auth/login?redirect=/replace-lenses`);
     }
     if (step < totalSteps) setStep(s => s + 1);
  };
  const handleBack = () => { if (step > 1) setStep(s => s - 1); };

  const calculateTotal = () => {
    let t = 99; // Base Service Fee
    const selectedLens = lensTypes.find(l => l.id === formData.lens_id);
    if(selectedLens) t += selectedLens.price;
    
    formData.add_ons.forEach(addonId => {
       const addon = lensAddons.find(a => a.id === addonId);
       if(addon) t += addon.price;
    });
    return t;
  };

  const handleSubmit = async () => {
     setSubmitting(true);
     const res = await createReplacementOrder({
        ...formData,
        total_price: calculateTotal(),
        service_fee: 99,
        pickup_fee: 0,
        lensName: lensTypes.find(l => l.id === formData.lens_id)?.name
     });

     setSubmitting(false);
     if(res.error) alert(res.error);
     else router.push(`/orders/success?id=${res.baseOrderId}`);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Setup Protocol...</div>;

  const currentLensPrice = lensTypes.find(l => l.id === formData.lens_id)?.[`price`] || 0;

  return (
    <div className="min-h-screen bg-brand-surface pt-32 pb-24 font-sans selection:bg-secondary selection:text-brand-navy">
      <div className="max-w-7xl mx-auto px-6">
         {/* HEADER */}
         <div className="mb-16">
            <h1 className="text-4xl md:text-6xl font-serif italic tracking-tight text-brand-navy leading-none mb-4">
              Lens <span className="text-secondary">Replacement</span> Protocol
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-navy/40 mb-10">Renew your trusted frames with precision optics</p>
            
            {/* Service Cycle Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-12 bg-white border border-brand-navy/5 editorial-shadow mb-16 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <span className="material-symbols-outlined text-8xl">cycle</span>
               </div>
               <div className="space-y-4 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                     <span className="material-symbols-outlined">hail</span>
                  </div>
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-brand-navy">01. Secure Pickup</h3>
                  <p className="text-[10px] text-brand-text-muted leading-relaxed">We collect your existing frames directly from your preferred address at no extra logistics cost.</p>
               </div>
               <div className="space-y-4 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                     <span className="material-symbols-outlined">precision_manufacturing</span>
                  </div>
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-brand-navy">02. Lab Integration</h3>
                  <p className="text-[10px] text-brand-text-muted leading-relaxed">Our master opticians extract the old lenses and inject your frames with state-of-the-art vision technology.</p>
               </div>
               <div className="space-y-4 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                     <span className="material-symbols-outlined">local_shipping</span>
                  </div>
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-brand-navy">03. Return Delivery</h3>
                  <p className="text-[10px] text-brand-text-muted leading-relaxed">Your renewed eyewear is delivered back to you, fully sanitized, aligned, and ready for the world.</p>
               </div>
            </div>
         </div>

         {/* PROGRESS BAR */}
         <div className="flex gap-2 mb-16">
            {[...Array(totalSteps)].map((_, i) => (
               <div key={i} className="flex-1 h-1.5 bg-brand-navy/5 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: step > i ? "100%" : "0%" }} 
                    className={cn("h-full", step > i ? "bg-secondary" : "")} 
                    transition={{ duration: 0.5 }}
                  />
               </div>
            ))}
         </div>

         <div className="flex flex-col lg:flex-row gap-16">
            <main className="flex-1 max-w-3xl">
               <AnimatePresence mode="wait">
                  
                  {/* STEP 1: FRAME DETAILS */}
                  {step === 1 && (
                     <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                        <div className="space-y-2">
                           <h2 className="text-2xl font-serif italic text-brand-navy">Step 01. Frame Architecture</h2>
                           <p className="text-[10px] uppercase font-bold tracking-widest text-brand-text-muted">Define your existing frame's parameters.</p>
                        </div>

                        <div className="space-y-6">
                           <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy">Frame Type</label>
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {["Full Rim", "Half Rim", "Rimless"].map(type => (
                                 <button 
                                   key={type}
                                   onClick={() => setFormData({...formData, frame_type: type})}
                                   className={cn(
                                     "p-6 border transition-all duration-300 text-center font-bold tracking-widest uppercase text-[10px]",
                                     formData.frame_type === type ? "bg-brand-navy border-secondary text-white shadow-xl" : "bg-white border-brand-navy/10 text-brand-navy hover:border-brand-navy"
                                   )}
                                 >
                                    {type}
                                 </button>
                              ))}
                           </div>
                        </div>

                        <div className="space-y-6">
                           <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy">Frame Condition</label>
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {["Excellent", "Slightly Worn", "Damaged"].map(cond => (
                                 <button 
                                   key={cond}
                                   onClick={() => setFormData({...formData, frame_condition: cond})}
                                   className={cn(
                                     "p-6 border transition-all duration-300 text-center font-bold tracking-widest uppercase text-[10px]",
                                     formData.frame_condition === cond ? "bg-brand-navy border-secondary text-white shadow-xl" : "bg-white border-brand-navy/10 text-brand-navy hover:border-brand-navy"
                                   )}
                                 >
                                    {cond}
                                 </button>
                              ))}
                           </div>
                        </div>
                     </motion.div>
                  )}

                  {/* STEP 2: LENS SELECTION */}
                  {step === 2 && (
                     <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                        <div className="space-y-2">
                           <h2 className="text-2xl font-serif italic text-brand-navy">Step 02. Optical Engine</h2>
                           <p className="text-[10px] uppercase font-bold tracking-widest text-brand-text-muted">Select your primary vision correction technology.</p>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                           {lensTypes.filter(l => l.category === 'type' || l.category === 'Single Vision' || l.category === 'Progressive' || l.category === 'Bifocal').map(lens => (
                              <button 
                                key={lens.id}
                                onClick={() => setFormData({...formData, lens_id: lens.id})}
                                className={cn(
                                  "p-8 border text-left transition-all duration-300 flex justify-between items-center group",
                                  formData.lens_id === lens.id ? "bg-brand-navy border-secondary text-white shadow-xl" : "bg-white border-brand-navy/10 hover:border-brand-navy text-brand-navy"
                                )}
                              >
                                 <div className="space-y-2">
                                    <h3 className="text-[11px] font-black uppercase tracking-widest">{lens.name}</h3>
                                    <p className={cn("text-[10px]", formData.lens_id === lens.id ? "text-white/60" : "text-brand-text-muted")}>{lens.description}</p>
                                 </div>
                                 <span className={cn("text-lg font-serif italic", formData.lens_id === lens.id ? "text-secondary" : "text-brand-navy")}>₹{lens.price.toLocaleString()}</span>
                              </button>
                           ))}
                        </div>
                     </motion.div>
                  )}

                  {/* STEP 3: LENS ADDONS */}
                  {step === 3 && (
                     <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                        <div className="space-y-2">
                           <h2 className="text-2xl font-serif italic text-brand-navy">Step 03. Optical Enhancements</h2>
                           <p className="text-[10px] uppercase font-bold tracking-widest text-brand-text-muted">Add premium coatings for protection and clarity.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {lensAddons.map(addon => {
                              const isSelected = formData.add_ons.includes(addon.id);
                              return (
                                 <div 
                                   key={addon.id}
                                   onClick={() => {
                                      setFormData(prev => ({
                                         ...prev, 
                                         add_ons: isSelected 
                                            ? prev.add_ons.filter(id => id !== addon.id) 
                                            : [...prev.add_ons, addon.id]
                                      }))
                                   }}
                                   className={cn(
                                     "p-6 border cursor-pointer transition-all duration-300 text-center space-y-4",
                                     isSelected ? "bg-secondary/10 border-secondary text-brand-navy" : "bg-white border-brand-navy/10 text-brand-navy hover:border-brand-navy/30"
                                   )}
                                 >
                                    <div className="w-12 h-12 rounded-full border border-brand-navy/10 flex items-center justify-center mx-auto text-brand-navy">
                                       <ShieldCheck size={20} className={isSelected ? "text-secondary" : ""} />
                                    </div>
                                    <div>
                                       <h3 className="text-[10px] font-black uppercase tracking-widest mb-1">{addon.name}</h3>
                                       <span className="text-[12px] font-serif italic">₹{addon.price.toLocaleString()}</span>
                                    </div>
                                 </div>
                              )
                           })}
                        </div>
                     </motion.div>
                  )}

                  {/* STEP 4: PRESCRIPTION */}
                  {step === 4 && (
                     <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                        <div className="space-y-2">
                           <h2 className="text-2xl font-serif italic text-brand-navy">Step 04. Medical Data</h2>
                           <p className="text-[10px] uppercase font-bold tracking-widest text-brand-text-muted">Provide your clinical prescription metrics.</p>
                        </div>

                        <div className="bg-white border border-brand-navy/10 p-8 space-y-8">
                           {['od', 'os'].map(eye => (
                              <div key={eye} className="space-y-4">
                                 <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-navy border-b border-brand-navy/5 pb-2">
                                    {eye === 'od' ? 'Right Eye (OD)' : 'Left Eye (OS)'}
                                 </h4>
                                 <div className="grid grid-cols-4 gap-4">
                                    {["sph", "cyl", "axis", "add"].map(field => (
                                       <div key={`${eye}_${field}`}>
                                          <label className="text-[8px] font-bold uppercase tracking-widest text-brand-navy/40 mb-2 block">{field}</label>
                                          <input 
                                            value={(formData.prescription_json as any)[`${eye}_${field}`]}
                                            onChange={(e) => setFormData(p => ({
                                               ...p, 
                                               prescription_json: { ...p.prescription_json, [`${eye}_${field}`]: e.target.value } 
                                            }))}
                                            className="w-full bg-brand-background border-none px-4 py-3 text-[11px] font-bold text-brand-navy focus:ring-1 focus:ring-secondary transition-all"
                                            placeholder="0.00"
                                          />
                                       </div>
                                    ))}
                                 </div>
                              </div>
                           ))}

                           <div className="pt-4 border-t border-brand-navy/5">
                              <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy mb-2 block">Pupillary Distance (PD)</label>
                              <input 
                                 value={formData.prescription_json.pd}
                                 onChange={(e) => setFormData(p => ({
                                    ...p, 
                                    prescription_json: { ...p.prescription_json, pd: e.target.value } 
                                 }))}
                                 className="w-full max-w-xs bg-brand-background border-none px-4 py-3 text-[11px] font-bold text-brand-navy focus:ring-1 focus:ring-secondary transition-all"
                                 placeholder="62"
                              />
                           </div>
                        </div>

                        <div className="text-center">
                           <p className="text-[10px] font-bold uppercase tracking-widest text-brand-text-muted italic">OR UPLOAD PRESCRIPTION IMAGE (COMING SOON)</p>
                        </div>
                     </motion.div>
                  )}

                  {/* STEP 5: LOGISTICS */}
                  {step === 5 && (
                     <motion.div key="s5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                        <div className="space-y-2">
                           <h2 className="text-2xl font-serif italic text-brand-navy">Step 05. Logistics Exchange</h2>
                           <p className="text-[10px] uppercase font-bold tracking-widest text-brand-text-muted">Schedule the pickup of your frames for laboratory processing.</p>
                        </div>

                        <div className="space-y-8">
                           <div className="space-y-4">
                              <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-navy">Extraction Point (Address)</h3>
                              {addresses.length === 0 ? (
                                 <Link href="/dashboard/addresses" className="block text-brand-navy text-[11px] font-bold underline bg-white p-6 border border-brand-navy/10">Add an Address in Dashboard first</Link>
                              ) : (
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {addresses.map(addr => (
                                       <div 
                                         key={addr.id}
                                         onClick={() => setFormData({...formData, address_id: addr.id.toString()})}
                                         className={cn(
                                            "p-6 border cursor-pointer transition-all duration-300",
                                            formData.address_id === addr.id.toString() ? "bg-brand-navy text-white shadow-xl" : "bg-white text-brand-navy border-brand-navy/10"
                                         )}
                                       >
                                          <p className="text-[11px] font-bold uppercase tracking-widest mb-1">{addr.full_name}</p>
                                          <p className="text-[10px] opacity-70 leading-relaxed">{addr.address_line1}, {addr.city}, {addr.state} {addr.postal_code}</p>
                                       </div>
                                    ))}
                                 </div>
                              )}
                           </div>

                           <div className="space-y-4">
                              <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-navy">Extraction Date</h3>
                              <select 
                                 value={formData.pickup_date}
                                 onChange={(e) => setFormData({...formData, pickup_date: e.target.value})}
                                 className="w-full bg-white border border-brand-navy/10 p-4 text-[11px] font-bold uppercase tracking-widest text-brand-navy outline-none focus:border-secondary"
                              >
                                 <option value="">Select Date</option>
                                 {pickupDates.map(d => <option key={d} value={d}>{new Date(d).toLocaleDateString()}</option>)}
                              </select>
                           </div>

                           <div className="space-y-4">
                              <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-navy">Extraction Window (Time)</h3>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                 {pickupSlots.map(slot => (
                                    <button 
                                      key={slot}
                                      onClick={() => setFormData({...formData, pickup_slot: slot})}
                                      className={cn(
                                        "p-4 border transition-all text-center text-[10px] font-bold tracking-widest",
                                        formData.pickup_slot === slot ? "bg-brand-navy text-white" : "bg-white text-brand-navy border-brand-navy/10 hover:border-brand-navy/30"
                                      )}
                                    >
                                       {slot}
                                    </button>
                                 ))}
                              </div>
                           </div>
                        </div>
                     </motion.div>
                  )}

                  {/* STEP 6: SUMMARY */}
                  {step === 6 && (
                     <motion.div key="s6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                        <div className="space-y-2">
                           <h2 className="text-2xl font-serif italic text-brand-navy">Final Authentication</h2>
                           <p className="text-[10px] uppercase font-bold tracking-widest text-brand-text-muted">Review manifest before transmission.</p>
                        </div>
                        
                        <div className="bg-white border border-brand-navy/10 p-8 space-y-6">
                           <div className="flex items-center gap-4 border-b border-brand-navy/5 pb-6">
                              <div className="w-16 h-16 bg-brand-background flex items-center justify-center">
                                 <Eye size={24} className="text-secondary" />
                              </div>
                              <div>
                                 <p className="text-[10px] uppercase font-bold tracking-widest text-brand-navy/40">Frame Status</p>
                                 <p className="text-[12px] font-black uppercase tracking-widest text-brand-navy">{formData.frame_type} • {formData.frame_condition}</p>
                              </div>
                           </div>

                           <div className="space-y-4">
                              <h4 className="text-[10px] uppercase font-black tracking-widest text-brand-navy">Billing Summary</h4>
                              
                              <div className="flex justify-between items-center bg-brand-background p-4">
                                 <span className="text-[10px] font-bold uppercase tracking-widest text-brand-navy">Optic Engine ({lensTypes.find(l => l.id === formData.lens_id)?.name})</span>
                                 <span className="text-[11px] font-serif italic">₹{currentLensPrice.toLocaleString()}</span>
                              </div>
                              
                              {formData.add_ons.map(id => {
                                 const a = lensAddons.find(x => x.id === id);
                                 return a && (
                                    <div key={id} className="flex justify-between items-center bg-brand-background p-4">
                                       <span className="text-[10px] font-bold uppercase tracking-widest text-brand-navy/60">Enhancement: {a.name}</span>
                                       <span className="text-[10px] font-serif italic text-brand-text-muted">₹{a.price.toLocaleString()}</span>
                                    </div>
                                 )
                              })}

                              <div className="flex justify-between items-center p-4 border border-secondary/20 bg-secondary/5">
                                 <div className="flex items-center gap-2">
                                    <Truck size={14} className="text-secondary" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-navy">Logistics Extraction & Injection</span>
                                 </div>
                                 <span className="text-[10px] font-serif italic">₹99</span>
                              </div>
                           </div>

                        </div>
                     </motion.div>
                  )}
               </AnimatePresence>

               {/* NAVIGATION BUTTONS */}
               <div className="mt-16 flex gap-6">
                  {step > 1 && (
                     <button 
                       onClick={handleBack}
                       disabled={submitting}
                       className="px-8 py-4 border border-brand-navy/10 text-[10px] font-bold uppercase tracking-widest text-brand-navy hover:bg-brand-background transition-all"
                     >
                       Reverse
                     </button>
                  )}
                  {step < totalSteps && (
                     <button 
                       onClick={handleNext}
                       disabled={(step === 1 && (!formData.frame_type || !formData.frame_condition)) || (step === 2 && !formData.lens_id) || (step === 5 && (!formData.pickup_date || !formData.pickup_slot || !formData.address_id))}
                       className="flex-1 bg-brand-navy text-white text-[10px] font-bold uppercase tracking-widest py-4 flex items-center justify-center gap-4 hover:bg-secondary transition-all disabled:opacity-50"
                     >
                        Proceed to Next Phase <ArrowRight size={14} />
                     </button>
                  )}
                  {step === totalSteps && (
                     <button 
                       onClick={handleSubmit}
                       disabled={submitting}
                       className="flex-1 bg-secondary text-brand-navy text-[12px] font-black uppercase tracking-widest py-4 flex items-center justify-center gap-4 hover:shadow-[0_0_20px_rgba(var(--brand-gold-rgb),0.5)] transition-all disabled:opacity-50"
                     >
                        {submitting ? "Transmitting..." : "Authorize Transmission"}
                     </button>
                  )}
               </div>
            </main>

            {/* SIDEBAR SUMMARY */}
            <aside className="w-full lg:w-80 space-y-8 shrink-0">
               <div className="bg-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-brand-navy/5 p-8 sticky top-32">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-brand-navy border-b border-brand-navy/5 pb-4 mb-6">Live Manifest</h3>
                  
                  <div className="space-y-6">
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-brand-text-muted">Total Authorized Value</span>
                        <span className="text-2xl font-serif italic text-brand-navy">₹{calculateTotal().toLocaleString()}</span>
                     </div>
                     <p className="text-[9px] uppercase font-bold tracking-widest text-secondary italic opacity-60">*Includes logistics fee (₹99)</p>
                  </div>
               </div>
            </aside>
         </div>
      </div>
    </div>
  );
}
