"use client";

import { useState } from "react";
import Image from "next/image";
import { Zap, Truck, RotateCcw, HelpCircle, ChevronRight, Play, CheckCircle2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createTryAtHomeBooking, type BookingData } from "./actions";
import toast from "react-hot-toast";

const TIME_SLOTS = [
  "9:00 AM - 11:00 AM",
  "11:00 AM - 1:00 PM",
  "2:00 PM - 4:00 PM",
  "4:00 PM - 6:00 PM",
];

function BookingModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState<BookingData>({
    name: "", email: "", phone: "",
    address: "", city: "", pincode: "",
    preferred_date: "", preferred_time: TIME_SLOTS[0],
    frame_preference: "Both", notes: "",
  });

  const set = (k: keyof BookingData, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setSubmitting(true);
    const res = await createTryAtHomeBooking(form);
    setSubmitting(false);
    if (res.error) { toast.error(res.error); return; }
    setDone(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-brand-navy/40 hover:text-brand-navy transition-colors z-10">
          <X size={20} />
        </button>

        {done ? (
          <div className="p-12 text-center">
            <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-6" />
            <h2 className="text-2xl font-black uppercase tracking-tighter text-brand-navy mb-4">Booking Confirmed</h2>
            <p className="text-brand-navy/60 text-sm mb-2">A confirmation has been sent to <strong>{form.email}</strong>.</p>
            <p className="text-brand-navy/40 text-xs uppercase tracking-widest">We will call you 24 hours before your slot.</p>
            <button onClick={onClose} className="mt-8 px-10 py-4 bg-brand-navy text-white text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-all">
              Close
            </button>
          </div>
        ) : (
          <div className="p-8">
            <span className="text-brand-gold text-[9px] font-black uppercase tracking-[0.4em]">Try-at-Home</span>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-brand-navy mt-2 mb-8">
              {step === 1 ? "Your Details" : "Schedule"}
            </h2>

            {step === 1 && (
              <div className="space-y-5">
                {[
                  { label: "Full Name", key: "name", type: "text", placeholder: "Your name" },
                  { label: "Email", key: "email", type: "email", placeholder: "your@email.com" },
                  { label: "Phone", key: "phone", type: "tel", placeholder: "+91 XXXXX XXXXX" },
                  { label: "Address", key: "address", type: "text", placeholder: "Door no, Street, Area" },
                  { label: "City", key: "city", type: "text", placeholder: "City" },
                  { label: "Pincode", key: "pincode", type: "text", placeholder: "6-digit pincode" },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <label className="text-[9px] font-black uppercase tracking-widest text-brand-navy/40 block mb-1">{label}</label>
                    <input
                      type={type}
                      value={form[key as keyof BookingData]}
                      onChange={e => set(key as keyof BookingData, e.target.value)}
                      placeholder={placeholder}
                      className="w-full border-b border-brand-navy/10 py-3 text-sm font-bold text-brand-navy outline-none focus:border-brand-navy transition-all bg-transparent"
                    />
                  </div>
                ))}
                <button
                  onClick={() => {
                    if (!form.name || !form.email || !form.phone || !form.address || !form.city || !form.pincode) {
                      toast.error("Please fill all required fields."); return;
                    }
                    setStep(2);
                  }}
                  className="w-full mt-4 py-4 bg-brand-navy text-white text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-all"
                >
                  Continue
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-brand-navy/40 block mb-2">Preferred Date</label>
                  <input
                    type="date"
                    min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
                    value={form.preferred_date}
                    onChange={e => set("preferred_date", e.target.value)}
                    className="w-full border-b border-brand-navy/10 py-3 text-sm font-bold text-brand-navy outline-none focus:border-brand-navy transition-all bg-transparent"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-brand-navy/40 block mb-2">Time Slot</label>
                  <div className="grid grid-cols-2 gap-2">
                    {TIME_SLOTS.map(slot => (
                      <button
                        key={slot}
                        onClick={() => set("preferred_time", slot)}
                        className={`py-3 px-3 text-[9px] font-black uppercase tracking-wider border transition-all ${form.preferred_time === slot ? "border-brand-navy bg-brand-navy text-white" : "border-brand-navy/10 text-brand-navy hover:border-brand-navy/40"}`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-brand-navy/40 block mb-2">Frame Preference</label>
                  <div className="flex gap-2">
                    {["Spectacles", "Sunglasses", "Both"].map(p => (
                      <button
                        key={p}
                        onClick={() => set("frame_preference", p)}
                        className={`flex-1 py-3 text-[9px] font-black uppercase tracking-wider border transition-all ${form.frame_preference === p ? "border-brand-navy bg-brand-navy text-white" : "border-brand-navy/10 text-brand-navy hover:border-brand-navy/40"}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-brand-navy/40 block mb-1">Notes (optional)</label>
                  <textarea
                    value={form.notes}
                    onChange={e => set("notes", e.target.value)}
                    rows={2}
                    placeholder="Any specific requirements..."
                    className="w-full border border-brand-navy/10 py-3 px-3 text-sm text-brand-navy outline-none focus:border-brand-navy transition-all bg-transparent resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="flex-1 py-4 border border-brand-navy/10 text-brand-navy text-[10px] font-black uppercase tracking-widest hover:border-brand-navy transition-all">
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || !form.preferred_date}
                    className="flex-1 py-4 bg-brand-navy text-white text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-all disabled:opacity-50"
                  >
                    {submitting ? "Booking..." : "Confirm Booking"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function TryAtHome() {
  const [showBooking, setShowBooking] = useState(false);

  return (
    <div className="bg-white pt-[120px] lg:pt-[180px] pb-32 overflow-hidden">
      <AnimatePresence>
        {showBooking && <BookingModal onClose={() => setShowBooking(false)} />}
      </AnimatePresence>

      {/* 1. Hero */}
      <section className="max-w-7xl mx-auto px-6 mb-32 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
         <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
         >
            <span className="text-brand-gold text-[10px] font-black uppercase tracking-[0.5em] mb-8 block">Exclusive Service Deployment</span>
            <h1 className="text-6xl lg:text-[7.5rem] font-black text-brand-navy mb-8 tracking-tighter leading-[0.85] italic uppercase group">
               12-Step <br /> <span className="text-brand-navy/10 group-hover:text-brand-navy transition-colors">Visual Archive</span>
            </h1>
            <p className="text-brand-navy/60 text-sm lg:text-lg font-bold uppercase tracking-[0.2em] mb-12 max-w-lg leading-relaxed">
               Bringing the zenith of optical engineering to your safe zone. Experience 150+ frames with clinical accuracy.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
               <button
                 onClick={() => setShowBooking(true)}
                 className="bg-brand-navy text-white px-12 py-5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-brand-gold shadow-[0_20px_40px_rgba(30,27,110,0.2)] transition-all"
               >
                 Book Protocol
               </button>
               <button className="flex items-center gap-4 group">
                  <div className="w-14 h-14 rounded-full border border-brand-navy/10 flex items-center justify-center group-hover:bg-brand-navy group-hover:text-white transition-all">
                     <Play size={16} fill="currentColor" />
                  </div>
                  <span className="text-brand-navy text-[10px] font-black uppercase tracking-widest">Observe Process</span>
               </button>
            </div>
         </motion.div>
         <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-[4/5] bg-brand-surface rounded-[3rem] p-16 overflow-hidden group shadow-2xl"
         >
            <Image src="https://static1.lenskart.com/media/desktop/img/rebrand/HomeBanner.jpg" alt="At Home" fill className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-[2s]" />
            <div className="absolute inset-0 bg-brand-navy/10 mix-blend-multiply" />
            <div className="absolute bottom-12 left-12 right-12 bg-white/10 backdrop-blur-3xl p-10 rounded-[2rem] border border-white/10">
               <Zap size={24} className="text-brand-gold mb-4" />
               <h3 className="text-white text-xl font-black uppercase tracking-tighter italic mb-2">150+ Frames Deployed</h3>
               <p className="text-white/60 text-[9px] uppercase tracking-widest font-black italic">Certified Optometrist included in every sequence.</p>
            </div>
         </motion.div>
      </section>

      {/* 2. Process */}
      <section className="bg-brand-navy py-32 px-6 relative overflow-hidden">
         <div className="max-w-7xl mx-auto flex flex-col items-center">
            <h2 className="text-4xl lg:text-7xl font-black text-white mb-24 italic uppercase tracking-tighter text-center leading-[0.85]">
               Operational <br /> <span className="text-brand-gold">Flow-State</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 w-full">
               {[
                  { icon: Zap, step: "01", title: "Inscribe Data", desc: "Select your preferred slot & curation intent via our portal." },
                  { icon: Truck, step: "02", title: "Nexus Arrival", desc: "Our concierge arrives with 150+ frames & clinical equipment." },
                  { icon: RotateCcw, step: "03", title: "Prescription Lab", desc: "Instant clinical checkup & trial protocol at your convenience." },
               ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center text-center group">
                     <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10 group-hover:bg-brand-gold group-hover:text-brand-navy transition-all duration-500">
                        <item.icon size={24} strokeWidth={1.5} />
                     </div>
                     <span className="text-brand-gold text-[10px] font-black uppercase tracking-[0.5em] mb-4">Phase {item.step}</span>
                     <h4 className="text-xl font-black uppercase tracking-tight text-white mb-4 italic">{item.title}</h4>
                     <p className="text-white/40 text-xs font-bold uppercase tracking-widest max-w-[250px] leading-relaxed">{item.desc}</p>
                  </div>
               ))}
            </div>
            <button
              onClick={() => setShowBooking(true)}
              className="mt-16 bg-brand-gold text-brand-navy px-16 py-5 text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-2xl"
            >
              Book Your Session
            </button>
         </div>
      </section>

      {/* 3. FAQ */}
      <section className="py-32 px-6">
         <div className="max-w-4xl mx-auto">
            <div className="text-center mb-20">
               <HelpCircle size={40} className="text-brand-gold mx-auto mb-8 animate-pulse" strokeWidth={1} />
               <h2 className="text-4xl font-black text-brand-navy uppercase tracking-tighter italic">Common Inquisitions</h2>
            </div>
            <div className="space-y-6">
               {[
                 { q: "Is the eye checkup clinically certified?", a: "Every concierge is a certified optical doctor with clinical authority." },
                 { q: "Is there a service fee for the protocol?", a: "Service fee is ₹99, waived entirely upon any product acquisition." },
                 { q: "Which regions are currently in nexus?", a: "Singapore, Dubai, and Major Indian Metros are operational." },
               ].map((faq, i) => (
                  <div key={i} className="group cursor-pointer border border-brand-navy/5 hover:border-brand-navy/20 p-8 hover:shadow-2xl transition-all duration-500 rounded-3xl">
                     <div className="flex items-center justify-between">
                        <h4 className="text-sm font-black uppercase tracking-widest text-brand-navy group-hover:text-brand-gold transition-colors">{faq.q}</h4>
                        <ChevronRight size={16} className="text-brand-navy/20 group-hover:translate-x-2 transition-transform" />
                     </div>
                     <div className="max-h-0 overflow-hidden group-hover:max-h-40 transition-all duration-700 ease-in-out">
                        <p className="mt-6 text-[11px] font-bold uppercase tracking-widest text-brand-navy/40 leading-relaxed">{faq.a}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

    </div>
  );
}
