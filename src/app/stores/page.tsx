"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StoresPage() {
  const outlets = [
    { name: "Lenzify Bangalore", address: "Alpha Sector 4, Silicon Valley", status: "Operational", lat: "12.9716", lng: "77.5946" },
    { name: "Lenzify Mumbai", address: "Marine Drive Promenade", status: "Operational", lat: "18.9220", lng: "72.8347" },
    { name: "Lenzify Delhi", address: "Connaught Outer Ring", status: "Coming Soon", lat: "28.6139", lng: "77.2090" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#03173D] via-[#004AAD] to-[#009DFF] pt-40 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-5"
          >
            <p className="text-white/70 text-xs font-semibold uppercase tracking-widest">Visit Us</p>
            <h1 className="font-[var(--font-hero)] italic text-white text-5xl md:text-8xl leading-none">
              Find A Store
            </h1>
            <p className="text-white/70 text-base leading-relaxed max-w-xl mx-auto">
              Experience Lenzify in person at one of our flagship locations for personalized optical care.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Store Cards */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {outlets.map((outlet, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white border border-[#ECECEC] rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(0,0,0,0.12)] transition-all duration-300 p-8 group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={cn(
                    "px-3 py-1.5 text-xs font-semibold rounded-full border",
                    outlet.status === "Operational"
                      ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                      : "bg-amber-50 text-amber-600 border-amber-200"
                  )}>
                    {outlet.status}
                  </div>
                  <MapPin size={20} className="text-[#CCCCCC] group-hover:text-[#004AAD] transition-colors" />
                </div>

                <h3 className="text-2xl font-serif italic text-[#111111] mb-2">{outlet.name}</h3>
                <p className="text-[#666666] text-sm leading-relaxed mb-8">{outlet.address}</p>

                <button className="w-full py-3 bg-[#03173D] text-white rounded-full font-semibold text-sm hover:bg-gradient-to-r hover:from-[#03173D] hover:to-[#004AAD] transition-all duration-300">
                  Get Directions
                </button>
              </motion.div>
            ))}
          </div>

          {/* Map Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="h-[400px] w-full bg-[#F8F9FC] rounded-2xl border border-[#ECECEC] relative flex items-center justify-center overflow-hidden"
          >
            <div className="text-center space-y-4">
              <MapPin size={40} className="text-[#004AAD]/30 mx-auto" />
              <h2 className="text-2xl font-serif italic text-[#111111]">Store Map</h2>
              <p className="text-[#666666] text-sm">Interactive map coming soon</p>
              <div className="mt-6 flex justify-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#004AAD] animate-ping" />
                <div className="w-2 h-2 rounded-full bg-[#004AAD] animate-ping delay-200" />
                <div className="w-2 h-2 rounded-full bg-[#004AAD] animate-ping delay-500" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
