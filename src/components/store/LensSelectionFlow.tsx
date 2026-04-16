"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, ChevronRight, ArrowLeft, Info, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface LensSelectionFlowProps {
  product: any;
  availableLenses: any[];
  onClose: () => void;
  onAddToCart: (lensData: any) => void;
}

type Step = "TYPE" | "FEATURES" | "COATINGS" | "MATERIAL" | "SUMMARY" | "PRESCRIPTION";

export default function LensSelectionFlow({ product, availableLenses, onClose, onAddToCart }: LensSelectionFlowProps) {
  const [step, setStep] = useState<Step>("TYPE");
  const [error, setError] = useState<string | null>(null);
  
  // Selections state
  const [selectedType, setSelectedType] = useState<any | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<any[]>([]);
  const [selectedCoatings, setSelectedCoatings] = useState<any[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<any | null>(null);
  const [selectedThickness, setSelectedThickness] = useState<any | null>(null);
  const [selectedTint, setSelectedTint] = useState<any | null>(null);

  // Prescription State
  const [prescription, setPrescription] = useState({
    od_sph: "", od_cyl: "", od_axis: "", od_add: "",
    os_sph: "", os_cyl: "", os_axis: "", os_add: "",
    pd: ""
  });

  // Filtered available lenses by category
  const lensTypes = useMemo(() => availableLenses.filter(l => l.category === "type"), [availableLenses]);
  const lensFeatures = useMemo(() => availableLenses.filter(l => l.category === "feature"), [availableLenses]);
  const lensCoatings = useMemo(() => availableLenses.filter(l => l.category === "coating"), [availableLenses]);
  const lensMaterials = useMemo(() => availableLenses.filter(l => l.category === "material"), [availableLenses]);
  const lensThicknesses = useMemo(() => availableLenses.filter(l => l.category === "thickness"), [availableLenses]);
  const lensTints = useMemo(() => availableLenses.filter(l => l.category === "tint"), [availableLenses]);

  const calculateTotalLensPrice = () => {
    let total = 0;
    if (selectedType) total += selectedType.price;
    selectedFeatures.forEach(f => total += f.price);
    selectedCoatings.forEach(c => total += c.price);
    if (selectedMaterial) total += selectedMaterial.price;
    if (selectedThickness) total += selectedThickness.price;
    if (selectedTint) total += selectedTint.price;
    return total;
  };

  const calculateGrandTotal = () => {
    const framePrice = product.discount_price || product.price;
    return framePrice + calculateTotalLensPrice();
  };

  const handleNext = () => {
    if (step === "TYPE" && selectedType) setStep("FEATURES");
    else if (step === "FEATURES") setStep("COATINGS");
    else if (step === "COATINGS") setStep("MATERIAL");
    else if (step === "MATERIAL") setStep("PRESCRIPTION");
    else if (step === "PRESCRIPTION") {
      // VALIDATION: If CYL is entered, AXIS is mandatory
      const od_cyl = prescription.od_cyl.trim();
      const od_axis = prescription.od_axis.trim();
      const os_cyl = prescription.os_cyl.trim();
      const os_axis = prescription.os_axis.trim();

      if (od_cyl !== "" && od_axis === "") {
        setError("Axis is required for Right Eye (OD) when Cylinder is present.");
        return;
      }
      if (os_cyl !== "" && os_axis === "") {
        setError("Axis is required for Left Eye (OS) when Cylinder is present.");
        return;
      }
      
      setError(null);
      setStep("SUMMARY");
    }
    else if (step === "SUMMARY") {
      onAddToCart({
        lens_id: selectedType.id,
        lens_price: calculateTotalLensPrice(),
        lens_config: {
            type: selectedType,
            features: selectedFeatures,
            coatings: selectedCoatings,
            material: selectedMaterial,
            thickness: selectedThickness,
            tint: selectedTint
        },
        prescription_json: prescription
      });
    }
  };

  const handleBack = () => {
    if (step === "FEATURES") setStep("TYPE");
    else if (step === "COATINGS") setStep("FEATURES");
    else if (step === "MATERIAL") setStep("COATINGS");
    else if (step === "PRESCRIPTION") {
      setError(null);
      setStep("MATERIAL");
    }
    else if (step === "SUMMARY") setStep("PRESCRIPTION");
  };

  const toggleFeature = (feature: any) => {
    if (selectedFeatures.find(f => f.id === feature.id)) {
      setSelectedFeatures(selectedFeatures.filter(f => f.id !== feature.id));
    } else {
      setSelectedFeatures([...selectedFeatures, feature]);
    }
  };

  const toggleCoating = (coating: any) => {
    if (selectedCoatings.find(c => c.id === coating.id)) {
      setSelectedCoatings(selectedCoatings.filter(c => c.id !== coating.id));
    } else {
      setSelectedCoatings([...selectedCoatings, coating]);
    }
  };

  const stepInfo = {
    TYPE: { title: "Step 01: Lens Matrix", subtitle: "Select your primary vision correction technology." },
    FEATURES: { title: "Step 02: Advanced Features", subtitle: "Enhance your vision with light-adaptive or digital protection." },
    COATINGS: { title: "Step 03: Optic Armor", subtitle: "Add premium coatings for protection and clarity." },
    MATERIAL: { title: "Step 04: Component Specs", subtitle: "Choose lens material and refractive index (thickness)." },
    PRESCRIPTION: { title: "Step 05: Ocular Data", subtitle: "Input your clinical prescription metrics." },
    SUMMARY: { title: "Final Auth", subtitle: "Review your configuration before calibration." }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-5xl bg-white shadow-[0_0_100px_rgba(0,0,0,0.3)] flex flex-col md:flex-row overflow-hidden h-[90vh] min-h-[600px]"
      >
        {/* Left Side: Dynamic configuration info */}
        <div className="w-full md:w-[30%] bg-brand-background p-8 border-r border-brand-navy/5 flex flex-col justify-between hidden md:flex">
          <div className="space-y-10">
            <div>
               <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-secondary italic mb-2">Build Manifest</p>
               <h2 className="text-3xl font-serif italic text-brand-navy tracking-tight leading-none uppercase">Step Selection<br/><span className="text-secondary">Protocol</span></h2>
            </div>

            <div className="space-y-6">
               <div className="aspect-[4/3] bg-white border border-brand-navy/5 p-6 flex items-center justify-center relative group">
                  <img src={product.product_images?.[0]?.image_url || "/placeholder.jpg"} alt={product.name} className="object-contain w-full h-full mix-blend-multiply opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-2 right-2 px-2 py-1 bg-brand-navy text-white text-[7px] font-bold tracking-widest uppercase italic">Archive Entry</div>
               </div>
               
               <div className="space-y-4 text-brand-navy">
                  <div className="flex justify-between items-end border-b border-brand-navy/5 pb-2">
                     <span className="text-[10px] uppercase font-bold tracking-widest opacity-40 italic">Base Frame</span>
                     <span className="text-[11px] font-bold tracking-wider italic">₹{(product.discount_price || product.price).toLocaleString()}</span>
                  </div>
                  
                  {selectedType && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex justify-between items-end border-b border-brand-navy/5 pb-2">
                       <span className="text-[10px] uppercase font-bold tracking-widest opacity-40 italic">{selectedType.name}</span>
                       <span className="text-[11px] font-bold tracking-wider italic">₹{selectedType.price.toLocaleString()}</span>
                    </motion.div>
                  )}

                  {(selectedFeatures.length > 0) && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex justify-between items-end border-b border-brand-navy/5 pb-2">
                       <span className="text-[10px] uppercase font-bold tracking-widest opacity-40 italic">Add-ons (+{selectedFeatures.length})</span>
                       <span className="text-[11px] font-bold tracking-wider italic">₹{selectedFeatures.reduce((acc, f) => acc + f.price, 0).toLocaleString()}</span>
                    </motion.div>
                  )}

                  {selectedCoatings.length > 0 && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex justify-between items-end border-b border-brand-navy/5 pb-2">
                       <span className="text-[10px] uppercase font-bold tracking-widest opacity-40 italic">Coatings (+{selectedCoatings.length})</span>
                       <span className="text-[11px] font-bold tracking-wider italic">₹{selectedCoatings.reduce((acc, c) => acc + c.price, 0).toLocaleString()}</span>
                    </motion.div>
                  )}
               </div>
            </div>
          </div>

          <div className="border-t-2 border-brand-navy pt-8">
             <p className="text-[9px] uppercase font-black tracking-[0.5em] text-secondary italic mb-2">Total Calibrated Value</p>
             <div className="text-4xl font-serif italic text-brand-navy">₹{calculateGrandTotal().toLocaleString()}</div>
          </div>
        </div>

        {/* Right Side: Step Matrix */}
        <div className="w-full md:w-[70%] flex flex-col bg-white overflow-hidden h-full">
          <header className="p-8 border-b border-brand-navy/5 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-20">
            <div className="flex gap-6 items-center">
               {step !== "TYPE" && (
                   <button onClick={handleBack} className="p-3 border border-brand-navy/10 text-brand-navy hover:text-secondary hover:border-secondary transition-all group">
                     <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                   </button>
               )}
               <div className="space-y-1">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-brand-navy">{stepInfo[step].title}</h3>
                  <p className="text-[9px] uppercase font-bold tracking-widest text-brand-text-muted italic">{stepInfo[step].subtitle}</p>
               </div>
            </div>
            <button onClick={onClose} className="p-3 text-brand-navy/20 hover:text-secondary transition-colors"><X size={20} /></button>
          </header>

          <div className="flex-grow overflow-y-auto custom-scrollbar bg-white min-h-0">
             <div className="p-10 space-y-10">
             <AnimatePresence mode="wait">
                {/* STEP 1: LENS TYPE */}
                {step === "TYPE" && (
                   <motion.div key="st-type" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         {lensTypes.map(lens => (
                            <button 
                              key={lens.id} 
                              onClick={() => setSelectedType(lens)}
                              className={cn(
                                "p-8 border transition-all duration-700 relative text-left group overflow-hidden",
                                selectedType?.id === lens.id ? "border-secondary bg-brand-navy shadow-2xl" : "border-brand-navy/5 hover:border-brand-navy/20"
                              )}
                            >
                               <div className="relative z-10">
                                  <div className="flex justify-between items-start mb-4">
                                     <h4 className={cn("text-xs font-black uppercase tracking-widest", selectedType?.id === lens.id ? "text-white" : "text-brand-navy")}>{lens.name}</h4>
                                     <span className={cn("text-[10px] font-bold italic", selectedType?.id === lens.id ? "text-secondary" : "text-brand-navy/40")}>₹{lens.price.toLocaleString()}</span>
                                  </div>
                                  <p className={cn("text-[10px] leading-relaxed tracking-wider", selectedType?.id === lens.id ? "text-white/60" : "text-brand-text-muted")}>{lens.description}</p>
                               </div>
                               {selectedType?.id === lens.id && <div className="absolute top-1/2 left-4 -translate-y-1/2 text-white/5 pointer-events-none"><CheckCircle2 size={120} /></div>}
                            </button>
                         ))}
                      </div>
                   </motion.div>
                )}

                {/* STEP 2: FEATURES */}
                {step === "FEATURES" && (
                   <motion.div key="st-feat" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                      <div className="grid grid-cols-1 gap-6">
                         {lensFeatures.map(feat => (
                            <div 
                              key={feat.id} 
                              onClick={() => toggleFeature(feat)}
                              className={cn(
                                "flex items-center justify-between p-8 border cursor-pointer transition-all duration-500 hover:shadow-lg",
                                selectedFeatures.find(f => f.id === feat.id) ? "border-secondary bg-secondary/5" : "border-brand-navy/5"
                              )}
                            >
                               <div className="space-y-2">
                                  <div className="flex items-center gap-4">
                                     <h4 className="text-xs font-black uppercase tracking-widest text-brand-navy">{feat.name}</h4>
                                     <span className="text-[10px] font-bold text-secondary italic">₹{feat.price.toLocaleString()}</span>
                                  </div>
                                  <p className="text-[10px] text-brand-text-muted tracking-wide max-w-md">{feat.description}</p>
                               </div>
                               <div className={cn("w-6 h-6 border flex items-center justify-center transition-all", selectedFeatures.find(f => f.id === feat.id) ? "bg-secondary border-secondary text-brand-navy" : "border-brand-navy/10 text-transparent")}>
                                  <CheckCircle2 size={16} />
                               </div>
                            </div>
                         ))}
                         {lensFeatures.length === 0 && (
                            <div className="py-20 text-center border border-dashed border-brand-navy/10 opacity-30">
                               <p className="text-[10px] uppercase font-bold tracking-[0.4em]">No adaptive modules detected.</p>
                            </div>
                         )}
                      </div>
                   </motion.div>
                )}

                {/* STEP 3: COATINGS */}
                {step === "COATINGS" && (
                   <motion.div key="st-coat" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                      {lensCoatings.map(coat => (
                         <div 
                           key={coat.id} 
                           onClick={() => toggleCoating(coat)}
                           className={cn(
                             "p-6 border cursor-pointer transition-all duration-500 hover:-translate-y-1 text-center space-y-4",
                             selectedCoatings.find(c => c.id === coat.id) ? "border-secondary bg-secondary/5" : "border-brand-navy/5"
                           )}
                         >
                            <div className="w-10 h-10 border border-brand-navy/5 rounded-full flex items-center justify-center mx-auto text-brand-navy/40">
                               {selectedCoatings.find(c => c.id === coat.id) ? <CheckCircle2 size={24} className="text-secondary" /> : <Info size={18} />}
                            </div>
                            <div>
                               <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-navy">{coat.name}</h4>
                               <p className="text-[9px] font-bold text-secondary mt-1">₹{coat.price.toLocaleString()}</p>
                            </div>
                         </div>
                      ))}
                   </motion.div>
                )}

                {/* STEP 4: MATERIAL & THICKNESS */}
                {step === "MATERIAL" && (
                   <motion.div key="st-mat" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                      <div className="space-y-6">
                         <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-navy flex items-center gap-3">
                            <span className="w-2 h-2 bg-secondary rounded-full" />
                            Refractive Index (Thickness)
                         </h4>
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {lensThicknesses.map(th => (
                               <button 
                                 key={th.id}
                                 onClick={() => setSelectedThickness(th)}
                                 className={cn(
                                   "py-6 px-4 border text-[11px] font-black tracking-widest transition-all",
                                   selectedThickness?.id === th.id ? "bg-brand-navy text-white border-secondary" : "bg-brand-background border-brand-navy/5 text-brand-navy hover:border-brand-navy/20"
                                 )}
                               >
                                  {th.name}
                               </button>
                            ))}
                         </div>
                      </div>

                      <div className="space-y-6">
                         <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-navy flex items-center gap-3">
                            <span className="w-2 h-2 bg-secondary rounded-full" />
                            Lens Material Componentry
                         </h4>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {lensMaterials.map(mat => (
                               <button 
                                 key={mat.id}
                                 onClick={() => setSelectedMaterial(mat)}
                                 className={cn(
                                   "p-6 border text-left flex justify-between items-center transition-all",
                                   selectedMaterial?.id === mat.id ? "bg-brand-navy text-white border-secondary" : "bg-brand-background border-brand-navy/5 text-brand-navy"
                                 )}
                               >
                                  <span className="text-[10px] font-black uppercase tracking-widest">{mat.name}</span>
                                  <span className="text-[9px] font-bold text-secondary">₹{mat.price.toLocaleString()}</span>
                               </button>
                            ))}
                         </div>
                      </div>
                   </motion.div>
                )}

                {/* STEP 5: PRESCRIPTION */}
                {step === "PRESCRIPTION" && (
                   <motion.div key="st-pres" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                      <div className="grid grid-cols-1 gap-6">
                         <div className="bg-brand-navy p-8 text-white space-y-6">
                            <div className="flex justify-between items-center border-b border-white/10 pb-4">
                               <h4 className="text-[11px] font-black uppercase tracking-[0.5em]">Right Eye (OD)</h4>
                               <span className="text-[10px] italic opacity-50 uppercase tracking-widest">Oculus Dexter</span>
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                               {["SPH", "CYL", "AXIS", "ADD"].map(f => (
                                  <div key={`od-${f}`} className="space-y-2">
                                     <label className="text-[8px] font-bold tracking-widest uppercase opacity-40">{f}</label>
                                     <input 
                                       value={prescription[`od_${f.toLowerCase()}` as keyof typeof prescription]}
                                       onChange={(e) => setPrescription({...prescription, [`od_${f.toLowerCase()}`]: e.target.value})}
                                       className="w-full bg-white/5 border border-white/10 p-4 text-[11px] font-bold outline-none focus:border-secondary transition-all" 
                                       placeholder="+0.00"
                                     />
                                  </div>
                               ))}
                            </div>
                         </div>

                         <div className="bg-brand-navy p-8 text-white space-y-6">
                            <div className="flex justify-between items-center border-b border-white/10 pb-4">
                               <h4 className="text-[11px] font-black uppercase tracking-[0.5em]">Left Eye (OS)</h4>
                               <span className="text-[10px] italic opacity-50 uppercase tracking-widest">Oculus Sinister</span>
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                               {["SPH", "CYL", "AXIS", "ADD"].map(f => (
                                  <div key={`os-${f}`} className="space-y-2">
                                     <label className="text-[8px] font-bold tracking-widest uppercase opacity-40">{f}</label>
                                     <input 
                                       value={prescription[`os_${f.toLowerCase()}` as keyof typeof prescription]}
                                       onChange={(e) => setPrescription({...prescription, [`os_${f.toLowerCase()}`]: e.target.value})}
                                       className="w-full bg-white/5 border border-white/10 p-4 text-[11px] font-bold outline-none focus:border-secondary transition-all" 
                                       placeholder="+0.00"
                                     />
                                  </div>
                               ))}
                            </div>
                         </div>
                         
                         <div className="p-8 border border-brand-navy/10 space-y-6">
                            <div className="flex items-center gap-4">
                               <div className="flex-1 space-y-2">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy">Pupillary Distance (PD)</label>
                                  <input 
                                    value={prescription.pd}
                                    onChange={(e) => setPrescription({...prescription, pd: e.target.value})}
                                    className="w-full bg-brand-background border border-brand-navy/10 p-4 text-[11px] font-bold outline-none focus:border-secondary transition-all" 
                                    placeholder="62"
                                  />
                               </div>
                               <div className="flex-1 p-4 bg-secondary/5 rounded border border-secondary/10 flex items-center gap-4">
                                  <HelpCircle size={20} className="text-secondary" />
                                  <p className="text-[9px] uppercase font-bold tracking-widest text-secondary leading-relaxed">Required for correct lens alignment across optical centers.</p>
                               </div>
                            </div>
                         </div>
                      </div>
                   </motion.div>
                )}

                {/* FINAL SUMMARY */}
                {step === "SUMMARY" && (
                   <motion.div key="st-sum" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                      <div className="flex flex-col items-center justify-center py-10 text-center border-b border-brand-navy/5">
                         <div className="w-20 h-20 bg-brand-navy rounded-full flex items-center justify-center text-secondary mb-8 shadow-2xl relative">
                            <CheckCircle2 size={40} />
                            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1.2 }} className="absolute inset-0 border border-secondary rounded-full animate-ping opacity-20" />
                         </div>
                         <h2 className="text-4xl font-serif italic text-brand-navy tracking-tight uppercase">Calibration <span className="text-secondary">Ready</span></h2>
                         <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-text-muted mt-2 italic">Architecture verified and finalized.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                         <div className="space-y-6">
                            <h4 className="text-[11px] font-black uppercase tracking-widest text-brand-navy opacity-40 italic">Optic Specifications</h4>
                            <div className="space-y-4">
                               <div className="flex justify-between p-4 bg-brand-background border-l-4 border-secondary">
                                  <span className="text-[10px] uppercase font-bold tracking-widest text-brand-navy">Lens Type</span>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-secondary">{selectedType?.name}</span>
                               </div>
                               {selectedMaterial && (
                                 <div className="flex justify-between p-4 bg-brand-background border-l-4 border-secondary/40">
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-brand-navy">Material</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest">{selectedMaterial.name}</span>
                                 </div>
                               )}
                               {selectedThickness && (
                                 <div className="flex justify-between p-4 bg-brand-background border-l-4 border-secondary/40">
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-brand-navy">Refractive Index</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest">{selectedThickness.name}</span>
                                 </div>
                               )}
                            </div>
                         </div>

                         <div className="space-y-6">
                            <h4 className="text-[11px] font-black uppercase tracking-widest text-brand-navy opacity-40 italic">Selected Enhancements</h4>
                            <div className="flex flex-wrap gap-2">
                               {selectedFeatures.map(f => (
                                  <span key={f.id} className="px-4 py-2 border border-brand-navy/10 text-[9px] font-black uppercase tracking-widest text-brand-navy bg-white">{f.name}</span>
                               ))}
                               {selectedCoatings.map(c => (
                                  <span key={c.id} className="px-4 py-2 border border-secondary/30 text-[9px] font-black uppercase tracking-widest text-secondary bg-secondary/5">{c.name}</span>
                               ))}
                               {selectedFeatures.length === 0 && selectedCoatings.length === 0 && <span className="text-[10px] italic opacity-30 tracking-widest">No add-ons selected.</span>}
                            </div>
                         </div>
                      </div>
                   </motion.div>
                )}
             </AnimatePresence>
             </div>
          </div>

          <footer className="p-8 border-t border-brand-navy/5 bg-white flex-shrink-0">
             {error && (
               <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-50 border border-red-100 text-[10px] font-bold uppercase tracking-widest text-red-600 flex items-center gap-3 italic">
                  <Info size={14} />
                  {error}
               </motion.div>
             )}
             <button 
               onClick={handleNext}
               disabled={step === "TYPE" && !selectedType}
               className="w-full py-8 bg-brand-navy text-white text-[12px] font-black uppercase tracking-[0.5em] hover:bg-secondary hover:text-brand-navy transition-all duration-700 flex items-center justify-center gap-6 shadow-[0_20px_40px_rgba(0,0,0,0.2)] disabled:opacity-20 disabled:grayscale active:scale-95"
             >
                <span>{step === "SUMMARY" ? "INJECT TO CART" : "PROCEED TO NEXT PHASE"}</span>
                <ChevronRight size={18} />
             </button>
          </footer>
        </div>
      </motion.div>
    </div>
  );
}
