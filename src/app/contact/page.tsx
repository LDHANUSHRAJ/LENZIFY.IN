"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, ArrowRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "VISION CONSULTATION",
    message: ""
  });

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } as any
  };

  return (
    <div className="bg-surface min-h-screen pt-44 pb-32">
      <main className="max-w-screen-2xl mx-auto px-8 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 lg:gap-32">
          {/* Left Column: Editorial Info */}
          <div className="lg:col-span-5 space-y-16">
            <header className="space-y-8">
              <p className="text-xs font-bold uppercase tracking-[0.5em] text-secondary italic">Atelier Contact</p>
              <h1 className="text-6xl md:text-8xl font-serif text-primary italic leading-none tracking-tighter">
                Connect <br/>With Excellence.
              </h1>
              <p className="text-on-surface-variant text-lg font-medium tracking-wide leading-relaxed italic max-w-md">
                Our visionaries and optical engineers are available for private consultations and technical inquiries. Reach out to coordinate your elite acquisition.
              </p>
            </header>

            <div className="space-y-12">
              <section className="space-y-4">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary text-white flex items-center justify-center rounded-full">
                       <Mail size={18} />
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">Editorial Queries</p>
                       <p className="text-sm font-bold text-primary tracking-widest">ARCHIVE@LENZIFY.IN</p>
                    </div>
                 </div>
              </section>

              <section className="space-y-4">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary text-white flex items-center justify-center rounded-full">
                       <Phone size={18} />
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">Nexus Hot-Line</p>
                       <p className="text-sm font-bold text-primary tracking-widest">+91 1800-LENZIFY</p>
                    </div>
                 </div>
              </section>

              <section className="space-y-4">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-secondary text-white flex items-center justify-center rounded-full">
                       <MapPin size={18} />
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">Flagship Atelier</p>
                       <p className="text-sm font-bold text-primary tracking-widest uppercase">7th Horizon, Innovation District, Tokyo / BLR</p>
                    </div>
                 </div>
              </section>
            </div>

            <div className="p-10 bg-[#000000] text-white rounded-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-24 h-full bg-secondary/10 translate-x-12 skew-x-12 group-hover:translate-x-0 transition-transform duration-1000"></div>
               <div className="relative z-10 space-y-4">
                  <h3 className="text-xl font-serif italic text-secondary">Expert Consultation</h3>
                  <p className="text-[10px] font-medium tracking-widest text-white/60 leading-relaxed uppercase">
                    Schedule a synchronized eye examination with our senior optical architects at any flagship location.
                  </p>
                  <button className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.3em] text-white hover:text-secondary transition-colors">
                    BOOK APPOINTMENT <ArrowRight size={14} />
                  </button>
               </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7">
            <motion.div 
               {...fadeInUp}
               className="bg-white p-12 lg:p-20 border border-outline/10 editorial-shadow rounded-sm relative"
            >
               <div className="absolute top-0 left-0 w-1.5 h-full bg-primary"></div>
               
               <form className="space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                     <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">Requester Name</label>
                        <input 
                          type="text" 
                          placeholder="IDENTITY"
                          className="w-full bg-transparent border-b border-outline/20 py-4 text-sm text-primary font-bold tracking-widest focus:border-primary outline-none transition-all placeholder:text-on-surface/20"
                        />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">Digital Address</label>
                        <input 
                          type="email" 
                          placeholder="YOU@EXAMPLE.COM"
                          className="w-full bg-transparent border-b border-outline/20 py-4 text-sm text-primary font-bold tracking-widest focus:border-primary outline-none transition-all placeholder:text-on-surface/20"
                        />
                     </div>
                  </div>

                  <div className="space-y-3">
                     <label className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">Inquiry Subject</label>
                     <select className="w-full bg-transparent border-b border-outline/20 py-4 text-sm text-primary font-bold tracking-widest focus:border-primary outline-none transition-all cursor-pointer appearance-none uppercase">
                        <option>Vision Consultation</option>
                        <option>Technical Frame Inquiry</option>
                        <option>Archival Restock Request</option>
                        <option>Bilateral Cooperation</option>
                     </select>
                  </div>

                  <div className="space-y-3">
                     <label className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">Detailed Coordination</label>
                     <textarea 
                        rows={5}
                        placeholder="MESSAGE..."
                        className="w-full bg-transparent border-b border-outline/20 py-4 text-sm text-primary font-bold tracking-widest focus:border-primary outline-none transition-all placeholder:text-on-surface/20 resize-none"
                     />
                  </div>

                  <button className="w-full py-6 bg-primary text-white font-bold text-[10px] uppercase tracking-[0.5em] rounded-lg hover:opacity-80 active:scale-[0.98] transition-all duration-500">
                     INITIATE COMMUNICATION
                  </button>

                  <div className="flex items-center justify-center gap-4 text-[8px] font-bold text-on-surface/30 uppercase tracking-[0.3em]">
                     <Clock size={12} />
                     <span>AVERAGE RESPONSE TIME: 4-6 ARCHIVAL HOURS</span>
                  </div>
               </form>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
