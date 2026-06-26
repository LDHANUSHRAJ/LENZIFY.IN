"use client";

import { useState } from "react";
import Image from "next/image";
import { Zap, Truck, RotateCcw, HelpCircle, CheckCircle2, X } from "lucide-react";
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
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl border border-[#ECECEC] shadow-[0_25px_60px_rgba(0,0,0,0.15)] w-full max-w-lg max-h-[90vh] overflow-y-auto relative"
      >
        <button onClick={onClose} className="absolute top-5 right-5 text-[#AAAAAA] hover:text-[#111111] transition-colors z-10">
          <X size={20} />
        </button>

        {done ? (
          <div className="p-12 text-center">
            <CheckCircle2 size={48} className="text-[#004AAD] mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-[#111111] mb-4">Booking Confirmed!</h2>
            <p className="text-[#666666] text-sm mb-2">A confirmation has been sent to <strong className="text-[#111111]">{form.email}</strong>.</p>
            <p className="text-[#AAAAAA] text-xs">We will call you 24 hours before your slot.</p>
            <button onClick={onClose} className="mt-8 px-10 py-4 bg-[#03173D] text-white rounded-full font-semibold hover:bg-gradient-to-r hover:from-[#03173D] hover:to-[#004AAD] transition-all">
              Close
            </button>
          </div>
        ) : (
          <div className="p-8">
            <p className="text-[#004AAD] text-xs font-semibold uppercase tracking-widest mb-1">Try-at-Home</p>
            <h2 className="text-2xl font-serif italic text-[#111111] mt-1 mb-8">
              {step === 1 ? "Your Details" : "Schedule Your Visit"}
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
                    <label className="text-xs font-semibold text-[#666666] uppercase tracking-widest block mb-1.5">{label}</label>
                    <input
                      type={type}
                      value={form[key as keyof BookingData]}
                      onChange={e => set(key as keyof BookingData, e.target.value)}
                      placeholder={placeholder}
                      className="bg-[#F8F9FC] border border-[#E8EAF2] rounded-xl px-4 py-3 text-[#111111] focus:border-[#004AAD] focus:ring-2 focus:ring-[#004AAD]/10 outline-none w-full text-sm placeholder:text-[#AAAAAA]"
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
                  className="w-full mt-4 py-4 bg-[#03173D] text-white rounded-full font-semibold hover:bg-gradient-to-r hover:from-[#03173D] hover:to-[#004AAD] transition-all"
                >
                  Continue
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-semibold text-[#666666] uppercase tracking-widest block mb-2">Preferred Date</label>
                  <input
                    type="date"
                    min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
                    value={form.preferred_date}
                    onChange={e => set("preferred_date", e.target.value)}
                    className="bg-[#F8F9FC] border border-[#E8EAF2] rounded-xl px-4 py-3 text-[#111111] focus:border-[#004AAD] focus:ring-2 focus:ring-[#004AAD]/10 outline-none w-full text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#666666] uppercase tracking-widest block mb-2">Time Slot</label>
                  <div className="grid grid-cols-2 gap-2">
                    {TIME_SLOTS.map(slot => (
                      <button
                        key={slot}
                        onClick={() => set("preferred_time", slot)}
                        className={`py-3 px-3 text-xs font-semibold rounded-xl border transition-all ${form.preferred_time === slot ? "border-[#004AAD] bg-[#004AAD]/10 text-[#004AAD]" : "border-[#E8EAF2] text-[#666666] hover:border-[#004AAD]/50 bg-[#F8F9FC]"}`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#666666] uppercase tracking-widest block mb-2">Frame Preference</label>
                  <div className="flex gap-2">
                    {["Spectacles", "Sunglasses", "Both"].map(p => (
                      <button
                        key={p}
                        onClick={() => set("frame_preference", p)}
                        className={`flex-1 py-3 text-xs font-semibold rounded-xl border transition-all ${form.frame_preference === p ? "border-[#004AAD] bg-[#004AAD]/10 text-[#004AAD]" : "border-[#E8EAF2] text-[#666666] hover:border-[#004AAD]/50 bg-[#F8F9FC]"}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#666666] uppercase tracking-widest block mb-1.5">Notes (optional)</label>
                  <textarea
                    value={form.notes}
                    onChange={e => set("notes", e.target.value)}
                    rows={2}
                    placeholder="Any specific requirements..."
                    className="bg-[#F8F9FC] border border-[#E8EAF2] rounded-xl px-4 py-3 text-[#111111] focus:border-[#004AAD] focus:ring-2 focus:ring-[#004AAD]/10 outline-none w-full text-sm placeholder:text-[#AAAAAA] resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 border border-[#E8EAF2] text-[#666666] text-sm font-semibold rounded-full hover:border-[#004AAD] hover:text-[#004AAD] transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || !form.preferred_date}
                    className="flex-1 py-4 bg-[#03173D] text-white text-sm font-semibold rounded-full hover:bg-gradient-to-r hover:from-[#03173D] hover:to-[#004AAD] transition-all disabled:opacity-50"
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
    <div className="min-h-screen bg-white overflow-hidden">
      <AnimatePresence>
        {showBooking && <BookingModal key="booking-modal" onClose={() => setShowBooking(false)} />}
      </AnimatePresence>

      {/* 1. Hero */}
      <section className="bg-gradient-to-br from-[#03173D] via-[#004AAD] to-[#009DFF] pt-28 md:pt-40 pb-14 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-6 block">Exclusive Home Service</p>
            <h1 className="font-[var(--font-hero)] italic text-white text-5xl md:text-7xl leading-none mb-6">
              Try Before <br />You Buy.
            </h1>
            <p className="text-white/70 text-base leading-relaxed mb-10 max-w-lg">
              Bringing the best of optical engineering to your home. Experience 150+ frames with a certified optometrist — all at zero pressure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowBooking(true)}
                className="bg-white text-[#03173D] px-8 py-4 rounded-full font-semibold hover:bg-[#F8F9FC] transition-all"
              >
                Book Your Session
              </button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[4/5] bg-white/10 rounded-3xl overflow-hidden group"
          >
            <Image src="/images/hero/hero4.jpg" alt="Try at home eyewear session" fill className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-[2s]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#03173D]/60 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-sm rounded-2xl p-6">
              <Zap size={20} className="text-[#004AAD] mb-2" />
              <h3 className="text-[#111111] text-lg font-semibold mb-1">150+ Frames Available</h3>
              <p className="text-[#666666] text-xs">Certified Optometrist in every session.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. How It Works */}
      <section className="py-12 md:py-20 bg-[#F8F9FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-14">
            <p className="text-[#004AAD] text-xs font-semibold uppercase tracking-widest mb-3">The Process</p>
            <h2 className="font-[var(--font-hero)] italic text-[#111111] text-4xl md:text-6xl leading-tight">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Zap, step: "01", title: "Book Your Slot", desc: "Select your preferred date and time via our booking portal. We confirm within 2 hours." },
              { icon: Truck, step: "02", title: "Expert Arrives", desc: "Our certified optician arrives with 150+ curated frames and examination equipment." },
              { icon: RotateCcw, step: "03", title: "Try & Decide", desc: "Take your time, get a checkup, and purchase what feels perfect. Zero pressure." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white border border-[#ECECEC] rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(0,0,0,0.12)] transition-all duration-300 p-10 text-center"
              >
                <div className="w-12 h-12 bg-[#03173D] text-white rounded-full flex items-center justify-center mx-auto mb-6 font-bold text-sm">
                  {item.step}
                </div>
                <h4 className="text-xl font-serif italic text-[#111111] mb-4">{item.title}</h4>
                <p className="text-[#666666] text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button
              onClick={() => setShowBooking(true)}
              className="bg-[#03173D] text-white px-10 py-4 rounded-full font-semibold hover:bg-gradient-to-r hover:from-[#03173D] hover:to-[#004AAD] transition-all"
            >
              Book Your Session
            </button>
          </div>
        </div>
      </section>

      {/* 3. Features */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-14">
            <p className="text-[#004AAD] text-xs font-semibold uppercase tracking-widest mb-3">Why Choose Us</p>
            <h2 className="font-[var(--font-hero)] italic text-[#111111] text-4xl md:text-6xl leading-tight">What&apos;s Included</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Free Service", desc: "₹99 fee, waived entirely on any purchase." },
              { title: "150+ Frames", desc: "Curated selection across all styles and budgets." },
              { title: "Eye Checkup", desc: "Certified optometrist included in every session." },
              { title: "No Pressure", desc: "Try everything, buy only what you love." },
            ].map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white border border-[#ECECEC] rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(0,0,0,0.12)] transition-all duration-300 p-8"
              >
                <p className="text-[#004AAD] text-xs font-semibold uppercase tracking-widest mb-3">Included</p>
                <h4 className="text-lg font-serif italic text-[#111111] mb-3">{feat.title}</h4>
                <p className="text-[#666666] text-sm leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FAQ */}
      <section className="py-12 md:py-20 bg-[#F8F9FC]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-14">
            <HelpCircle size={36} className="text-[#004AAD]/30 mx-auto mb-5" strokeWidth={1.5} />
            <p className="text-[#004AAD] text-xs font-semibold uppercase tracking-widest mb-3">Got Questions?</p>
            <h2 className="font-[var(--font-hero)] italic text-[#111111] text-4xl md:text-5xl">Common Questions</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: "Is the eye checkup clinically certified?", a: "Every concierge is a certified optical professional with clinical authority." },
              { q: "Is there a service fee?", a: "Service fee is ₹99, waived entirely upon any product purchase during the session." },
              { q: "Which cities are currently served?", a: "We currently serve major Indian metros. More cities coming soon." },
            ].map((faq, i) => (
              <div key={i} className="bg-white border border-[#ECECEC] rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-7">
                <h4 className="text-sm font-semibold text-[#111111] mb-2">{faq.q}</h4>
                <p className="text-sm text-[#666666] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
