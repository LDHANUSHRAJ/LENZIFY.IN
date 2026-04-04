"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, ShieldCheck, Truck, RotateCcw, Zap, ChevronRight, Ruler, Eye, Package, Info, CheckCircle2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [lensFlowOpen, setLensFlowOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLensType, setSelectedLensType] = useState("");

  const lensSteps = [
    { id: "type", title: "Select Lens Type", options: ["Single Vision", "Bifocal", "Progressive", "Zero Power"] },
    { id: "package", title: "Select Lens Package", options: ["Essential (Free)", "Gold (₹999)", "Platinum (₹1999)"] },
    { id: "prescription", title: "Prescription Protocol", options: ["Manual Entry", "Upload File", "Call Me"] },
  ];

  return (
    <div className="bg-[#fcfcfc] pt-[120px] lg:pt-[180px] pb-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-20">
          
          {/* Vertical Media Stack - 1:1 Layout */}
          <div className="w-full lg:w-1/2 flex gap-6">
             <div className="hidden md:flex flex-col gap-4 w-24 flex-shrink-0">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-white border border-brand-navy/5 rounded-2xl p-4 overflow-hidden group cursor-pointer hover:border-brand-gold transition-all duration-500">
                     <Image src="https://static1.lenskart.com/media/desktop/img/Apr21/Eyeglasses.png" alt="Thumb" width={100} height={100} className="object-contain group-hover:scale-110 transition-transform" />
                  </div>
                ))}
             </div>
             <div className="flex-1 aspect-[4/5] bg-white border border-brand-navy/5 rounded-[3rem] p-16 relative overflow-hidden group shadow-2xl">
                <Image src="https://static1.lenskart.com/media/desktop/img/Apr21/Eyeglasses.png" alt="Product" fill className="object-contain p-12 group-hover:scale-105 transition-transform duration-[2s]" />
                <div className="absolute top-10 left-10 flex flex-col gap-3">
                   <div className="bg-brand-navy text-white px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.4em] shadow-xl italic cursor-default">Archive Entry</div>
                </div>
                <button className="absolute bottom-10 right-10 bg-white/80 backdrop-blur-xl p-6 rounded-full shadow-2xl hover:bg-brand-navy hover:text-white transition-all duration-500 group/zoom">
                   <Eye size={24} className="group-hover/zoom:scale-110 transition-transform" />
                </button>
             </div>
          </div>

          {/* Product Intelligence Panel */}
          <div className="w-full lg:w-1/2">
             <div className="mb-12">
                <div className="flex items-center gap-4 mb-6">
                   <span className="text-brand-gold text-[10px] font-black uppercase tracking-[0.6em]">John Jacobs Portfolio</span>
                   <div className="flex items-center gap-2 bg-brand-navy/5 px-3 py-1.5 rounded-full">
                      <Star size={10} className="text-brand-gold fill-current" />
                      <span className="text-[10px] font-black text-brand-navy">4.9 Authority</span>
                   </div>
                </div>
                <h1 className="text-5xl lg:text-7xl font-black text-brand-navy mb-4 tracking-tighter uppercase leading-[0.85] italic">
                   Aurelius <br /> <span className="text-brand-navy/20 not-italic">Prime X</span>
                </h1>
                <p className="text-brand-navy/40 text-[10px] font-black uppercase tracking-[0.4em] mb-10">Series 2026 • Italian Acetate • Medium Grid</p>
                
                <div className="flex items-end gap-10 border-b border-brand-navy/5 pb-12">
                   <div className="flex flex-col">
                      <span className="text-brand-navy/20 text-sm font-bold line-through mb-1 tracking-widest italic">₹18,000 VALUE</span>
                      <span className="text-5xl font-black text-brand-navy tracking-tighter">₹12,499</span>
                   </div>
                   <div className="bg-brand-gold/10 text-brand-gold px-6 py-3 text-[10px] font-black uppercase tracking-widest italic rounded-sm mb-1">
                      Buy 1 Get 1 Gold Protocol Applied
                   </div>
                </div>
             </div>

             {/* Functional Triggers */}
             <div className="space-y-6 mb-16">
                <button 
                  onClick={() => setLensFlowOpen(true)}
                  className="w-full bg-brand-navy text-white py-8 text-[11px] font-black uppercase tracking-[0.4em] shadow-[0_20px_50px_rgba(30,27,110,0.2)] hover:bg-brand-gold hover:text-brand-navy transition-all duration-500 flex items-center justify-center gap-6 group"
                >
                   Initiate Lens Selection <ChevronRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </button>
                <div className="grid grid-cols-2 gap-4">
                   <button className="border-2 border-brand-navy bg-white text-brand-navy py-6 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-brand-background transition-all group">
                      Visual Sandbox <Eye size={12} className="inline ml-3 opacity-30 group-hover:opacity-100 transition-opacity" />
                   </button>
                   <button className="border-2 border-brand-navy/5 bg-brand-surface text-brand-navy py-6 text-[10px] font-black uppercase tracking-[0.3em] hover:border-brand-navy hover:text-brand-gold transition-all">
                      Archive Fragment <CheckCircle2 size={12} className="inline ml-3 opacity-30" />
                   </button>
                </div>
             </div>

             {/* Technical DNA Matrices */}
             <div className="grid grid-cols-3 gap-8 mb-16 border-y border-brand-navy/5 py-12">
                <div className="flex flex-col gap-3 group cursor-help">
                   <Ruler size={18} className="text-brand-navy/20 group-hover:text-brand-gold transition-colors" />
                   <span className="text-[9px] font-black uppercase tracking-widest text-brand-navy/40">Bridge Matrix</span>
                   <span className="text-[11px] font-black text-brand-navy">18MM</span>
                </div>
                <div className="flex flex-col gap-3 group cursor-help">
                   <Package size={18} className="text-brand-navy/20 group-hover:text-brand-gold transition-colors" />
                   <span className="text-[9px] font-black uppercase tracking-widest text-brand-navy/40">Gram Mass</span>
                   <span className="text-[11px] font-black text-brand-navy">122 G</span>
                </div>
                <div className="flex flex-col gap-3 group cursor-help">
                   <Info size={18} className="text-brand-navy/20 group-hover:text-brand-gold transition-colors" />
                   <span className="text-[9px] font-black uppercase tracking-widest text-brand-navy/40">Visual Type</span>
                   <span className="text-[11px] font-black text-brand-navy">Full Rim</span>
                </div>
             </div>

             {/* Logistics Trust Protocols */}
             <div className="space-y-6">
                <div className="flex items-center gap-6 group">
                   <Truck size={18} className="text-brand-gold group-hover:scale-110 transition-transform" />
                   <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-navy mb-1">Insured Deployment</h4>
                      <p className="text-[9px] text-brand-navy/40 font-bold uppercase tracking-widest italic">Delivered in 48-72 Cycles (Hours)</p>
                   </div>
                </div>
                <div className="flex items-center gap-6 group">
                   <ShieldCheck size={18} className="text-brand-gold group-hover:scale-110 transition-transform" />
                   <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-navy mb-1">Atomic Warranty</h4>
                      <p className="text-[9px] text-brand-navy/40 font-bold uppercase tracking-widest italic">Zero-Cost Replacement Security</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Advanced Multi-Step "Select Lens" Flow Overlay */}
      <AnimatePresence>
        {lensFlowOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-brand-navy/98 backdrop-blur-2xl flex flex-col items-center justify-center p-6"
          >
            <button 
              onClick={() => { setLensFlowOpen(false); setCurrentStep(1); }}
              className="absolute top-12 right-12 text-white/40 hover:text-white transition-all transform hover:rotate-90"
            >
              <X size={48} strokeWidth={1} />
            </button>

            <div className="w-full max-w-4xl">
               <div className="flex justify-between items-center mb-20">
                  <span className="text-brand-gold text-[10px] font-black uppercase tracking-[0.5em] italic">Step {currentStep} of {lensSteps.length}</span>
                  <div className="flex gap-4">
                     {lensSteps.map((s, idx) => (
                        <div key={idx} className={`h-1 w-20 transition-all duration-700 ${idx + 1 <= currentStep ? "bg-brand-gold" : "bg-white/10"}`} />
                     ))}
                  </div>
               </div>

               <motion.div 
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-16"
               >
                  <h2 className="text-4xl lg:text-7xl font-black text-white italic uppercase tracking-tighter text-center">
                     {lensSteps[currentStep-1].title}
                  </h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                     {lensSteps[currentStep-1].options.map((option) => (
                        <button 
                          key={option}
                          onClick={() => {
                             if (currentStep < lensSteps.length) {
                                setCurrentStep(prev => prev + 1);
                             } else {
                                toast.success("PRESCRIPTION PROTOCOL RECEIVED", { style: { background: '#1e1b6e', color: '#fff', fontSize: '10px', fontBlack: '900' }});
                                setLensFlowOpen(false);
                                setCurrentStep(1);
                             }
                          }}
                          className="flex flex-col items-center gap-10 p-12 border border-white/5 bg-white/5 hover:bg-brand-gold hover:border-brand-gold transition-all duration-500 group"
                        >
                           <Zap size={32} className="text-brand-gold group-hover:text-brand-navy" strokeWidth={1.5} />
                           <span className="text-[10px] font-black uppercase tracking-widest text-white group-hover:text-brand-navy transition-colors">{option}</span>
                        </button>
                     ))}
                  </div>
               </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
