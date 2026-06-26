"use client";

import { motion } from "framer-motion";
import { Mail, Phone, Clock, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { sendContactMessage } from "./actions";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Vision Consultation",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof formData, v: string) =>
    setFormData((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await sendContactMessage(formData);
    setSubmitting(false);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#03173D] via-[#004AAD] to-[#009DFF] pt-28 md:pt-40 pb-14 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <span className="text-white/70 text-xs font-semibold uppercase tracking-widest">
              Atelier Contact
            </span>
            <h1 className="font-[var(--font-hero)] italic text-white text-5xl md:text-8xl leading-none mb-6 mt-3">
              Get In Touch.
            </h1>
            <p className="text-white/70 text-base leading-relaxed max-w-md">
              Our optical experts are available for consultations and inquiries.
              Reach out and we&apos;ll be happy to assist you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20">

            {/* Left: Contact Cards */}
            <div className="lg:col-span-4 space-y-4">
              {[
                {
                  icon: Mail,
                  label: "Email Us",
                  value: "lenzify.in@gmail.com",
                  href: "mailto:lenzify.in@gmail.com",
                },
                {
                  icon: Phone,
                  label: "Call Us",
                  value: "+91 72047 70688",
                  href: "tel:+917204770688",
                },
                {
                  icon: Clock,
                  label: "Store Hours",
                  value: "Open All Day, Every Day",
                  href: null,
                },
              ].map(({ icon: Icon, label, value, href }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-white border border-[#ECECEC] rounded-2xl shadow-sm p-6 flex items-center gap-5"
                >
                  <div className="w-12 h-12 bg-[#F0F5FF] rounded-xl flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-[#004AAD]" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[#004AAD] text-xs font-semibold uppercase tracking-widest">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        className="text-sm font-semibold text-[#111111] hover:text-[#004AAD] transition-colors"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm font-semibold text-[#111111]">{value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right: Contact Form */}
            <div className="lg:col-span-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-3xl border border-[#ECECEC] shadow-[0_10px_30px_rgba(0,0,0,0.05)] p-8 lg:p-10"
              >
                {sent ? (
                  <div className="text-center py-12">
                    <CheckCircle2 size={52} className="text-[#004AAD] mx-auto mb-5" />
                    <h2 className="text-2xl font-serif italic text-[#111111] mb-3">
                      Message Sent!
                    </h2>
                    <p className="text-[#666666] text-sm mb-1">
                      We&apos;ve received your message and will get back to you shortly.
                    </p>
                    <p className="text-[#AAAAAA] text-xs">
                      Average response time: 4–6 hours
                    </p>
                    <button
                      onClick={() => {
                        setSent(false);
                        setFormData({ name: "", email: "", phone: "", subject: "Vision Consultation", message: "" });
                      }}
                      className="mt-8 px-8 py-3 bg-[#03173D] text-white rounded-full text-sm font-semibold hover:bg-[#004AAD] transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-[#004AAD] text-xs font-semibold uppercase tracking-widest mb-2">
                      Send a Message
                    </p>
                    <h2 className="text-2xl font-serif italic text-[#111111] mb-8">
                      How can we help you?
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-[#666666] uppercase tracking-widest">
                            Your Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Full name"
                            value={formData.name}
                            onChange={(e) => set("name", e.target.value)}
                            className="bg-[#F8F9FC] border border-[#E8EAF2] rounded-xl px-4 py-3 text-[#111111] focus:border-[#004AAD] focus:ring-2 focus:ring-[#004AAD]/10 outline-none w-full text-sm placeholder:text-[#AAAAAA]"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-[#666666] uppercase tracking-widest">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => set("email", e.target.value)}
                            className="bg-[#F8F9FC] border border-[#E8EAF2] rounded-xl px-4 py-3 text-[#111111] focus:border-[#004AAD] focus:ring-2 focus:ring-[#004AAD]/10 outline-none w-full text-sm placeholder:text-[#AAAAAA]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-[#666666] uppercase tracking-widest">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            placeholder="+91 XXXXX XXXXX"
                            value={formData.phone}
                            onChange={(e) => set("phone", e.target.value)}
                            className="bg-[#F8F9FC] border border-[#E8EAF2] rounded-xl px-4 py-3 text-[#111111] focus:border-[#004AAD] focus:ring-2 focus:ring-[#004AAD]/10 outline-none w-full text-sm placeholder:text-[#AAAAAA]"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-[#666666] uppercase tracking-widest">
                            Subject
                          </label>
                          <select
                            value={formData.subject}
                            onChange={(e) => set("subject", e.target.value)}
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
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#666666] uppercase tracking-widest">
                          Message *
                        </label>
                        <textarea
                          rows={5}
                          required
                          placeholder="Tell us how we can help..."
                          value={formData.message}
                          onChange={(e) => set("message", e.target.value)}
                          className="bg-[#F8F9FC] border border-[#E8EAF2] rounded-xl px-4 py-3 text-[#111111] focus:border-[#004AAD] focus:ring-2 focus:ring-[#004AAD]/10 outline-none w-full text-sm placeholder:text-[#AAAAAA] resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-4 bg-[#03173D] text-white rounded-full font-semibold text-sm hover:bg-[#004AAD] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {submitting ? "Sending…" : "Send Message"}
                      </button>

                      <p className="text-center text-xs text-[#AAAAAA]">
                        Average response time: 4–6 hours
                      </p>
                    </form>
                  </>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
