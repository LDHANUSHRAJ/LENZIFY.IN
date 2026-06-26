"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Vision Consultation",
    message: ""
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#03173D] via-[#004AAD] to-[#009DFF] pt-28 md:pt-40 pb-14 md:pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <p className="text-[#004AAD] text-xs font-semibold uppercase tracking-widest mb-4 bg-white/20 text-white/80 px-0">
              <span className="text-white/70 text-xs font-semibold uppercase tracking-widest">Atelier Contact</span>
            </p>
            <h1 className="font-[var(--font-hero)] italic text-white text-5xl md:text-8xl leading-none mb-6">
              Get In Touch.
            </h1>
            <p className="text-white/70 text-base leading-relaxed max-w-md">
              Our optical experts are available for consultations and inquiries. Reach out and we&apos;ll be happy to assist you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

            {/* Left Column: Contact Info */}
            <div className="lg:col-span-5 space-y-5">
              {[
                { icon: Mail, label: "Email Us", value: "lenzify.in@gmail.com" },
                { icon: Phone, label: "Call Us", value: "+91 1800-LENZIFY" },
                { icon: MapPin, label: "Visit Us", value: "7th Horizon, Innovation District, Bangalore" },
                { icon: Clock, label: "Store Hours", value: "Mon – Sat, 10 AM – 7 PM IST" },
              ].map(({ icon: Icon, label, value }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-white border border-[#ECECEC] rounded-2xl shadow-sm p-6 flex items-center gap-5"
                >
                  <div className="w-12 h-12 bg-[#F0F5FF] rounded-xl flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-[#004AAD]" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[#004AAD] text-xs font-semibold uppercase tracking-widest">{label}</p>
                    <p className="text-sm font-semibold text-[#111111]">{value}</p>
                  </div>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="bg-gradient-to-br from-[#03173D] to-[#004AAD] rounded-2xl p-8 mt-4"
              >
                <h3 className="text-xl font-serif italic text-white mb-3">Book a Consultation</h3>
                <p className="text-white/70 text-sm leading-relaxed mb-6">
                  Schedule an eye examination with our senior optical team at any flagship location.
                </p>
                <button className="flex items-center gap-3 text-sm font-semibold text-white hover:gap-4 transition-all duration-300">
                  Book Appointment <ArrowRight size={16} />
                </button>
              </motion.div>
            </div>

            {/* Right Column: Inquiry Form */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white rounded-3xl border border-[#ECECEC] shadow-[0_10px_30px_rgba(0,0,0,0.05)] p-8 lg:p-10"
              >
                <p className="text-[#004AAD] text-xs font-semibold uppercase tracking-widest mb-2">Send a Message</p>
                <h2 className="text-2xl font-serif italic text-[#111111] mb-8">How can we help you?</h2>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-[#666666] uppercase tracking-widest">Your Name</label>
                      <input
                        type="text"
                        placeholder="Full name"
                        value={formData.name}
                        onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                        className="bg-[#F8F9FC] border border-[#E8EAF2] rounded-xl px-4 py-3 text-[#111111] focus:border-[#004AAD] focus:ring-2 focus:ring-[#004AAD]/10 outline-none w-full text-sm placeholder:text-[#AAAAAA]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-[#666666] uppercase tracking-widest">Email Address</label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={e => setFormData(f => ({ ...f, email: e.target.value }))}
                        className="bg-[#F8F9FC] border border-[#E8EAF2] rounded-xl px-4 py-3 text-[#111111] focus:border-[#004AAD] focus:ring-2 focus:ring-[#004AAD]/10 outline-none w-full text-sm placeholder:text-[#AAAAAA]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#666666] uppercase tracking-widest">Subject</label>
                    <select
                      value={formData.subject}
                      onChange={e => setFormData(f => ({ ...f, subject: e.target.value }))}
                      className="bg-[#F8F9FC] border border-[#E8EAF2] rounded-xl px-4 py-3 text-[#111111] focus:border-[#004AAD] focus:ring-2 focus:ring-[#004AAD]/10 outline-none w-full text-sm appearance-none cursor-pointer"
                    >
                      <option>Vision Consultation</option>
                      <option>Frame Inquiry</option>
                      <option>Order Support</option>
                      <option>Lens Replacement</option>
                      <option>Returns & Refunds</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#666666] uppercase tracking-widest">Message</label>
                    <textarea
                      rows={5}
                      placeholder="Tell us how we can help..."
                      value={formData.message}
                      onChange={e => setFormData(f => ({ ...f, message: e.target.value }))}
                      className="bg-[#F8F9FC] border border-[#E8EAF2] rounded-xl px-4 py-3 text-[#111111] focus:border-[#004AAD] focus:ring-2 focus:ring-[#004AAD]/10 outline-none w-full text-sm placeholder:text-[#AAAAAA] resize-none"
                    />
                  </div>

                  <button className="w-full py-4 bg-[#03173D] text-white rounded-full font-semibold hover:bg-gradient-to-r hover:from-[#03173D] hover:to-[#004AAD] transition-all duration-300">
                    Send Message
                  </button>

                  <div className="flex items-center justify-center gap-3 text-xs text-[#AAAAAA]">
                    <Clock size={12} />
                    <span>Average response time: 4–6 hours</span>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="bg-[#F8F9FC] rounded-2xl border border-[#ECECEC] h-64 flex items-center justify-center relative overflow-hidden"
          >
            <div className="text-center space-y-3">
              <MapPin size={32} className="text-[#004AAD]/40 mx-auto" />
              <p className="text-[#004AAD] text-xs font-semibold uppercase tracking-widest">Our Flagship Store</p>
              <p className="text-[#666666] text-sm">7th Horizon, Innovation District, Bangalore</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
