"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  operational: { label: "Operational", className: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  coming_soon: { label: "Coming Soon", className: "bg-amber-50 text-amber-600 border-amber-200" },
  closed:      { label: "Closed", className: "bg-red-50 text-red-600 border-red-200" },
};

interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  phone?: string | null;
  hours?: string | null;
  lat?: string | null;
  lng?: string | null;
  status: string;
}

export default function StoresClient({ stores }: { stores: Store[] }) {
  const getDirectionsUrl = (store: Store) => {
    if (store.lat && store.lng) {
      return `https://www.google.com/maps?q=${store.lat},${store.lng}`;
    }
    return `https://www.google.com/maps/search/${encodeURIComponent(`${store.name} ${store.city} ${store.state}`)}`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#03173D] via-[#004AAD] to-[#009DFF] pt-28 md:pt-40 pb-14 md:pb-20">
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
          {stores.length === 0 ? (
            <div className="text-center py-20">
              <MapPin size={40} className="mx-auto text-[#CCCCCC] mb-4" />
              <p className="text-[#666666] text-lg font-serif italic">No stores available at the moment.</p>
              <p className="text-[#999999] text-sm mt-2">Check back soon — we're expanding!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {stores.map((store, i) => {
                const statusCfg = STATUS_CONFIG[store.status] ?? STATUS_CONFIG.operational;
                return (
                  <motion.div
                    key={store.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="bg-white border border-[#ECECEC] rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(0,0,0,0.12)] transition-all duration-300 p-8 group"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <span className={cn("px-3 py-1.5 text-xs font-semibold rounded-full border", statusCfg.className)}>
                        {statusCfg.label}
                      </span>
                      <MapPin size={20} className="text-[#CCCCCC] group-hover:text-[#004AAD] transition-colors" />
                    </div>

                    <h3 className="text-2xl font-serif italic text-[#111111] mb-1">{store.name}</h3>
                    <p className="text-[#666666] text-sm leading-relaxed mb-2">{store.address}</p>
                    <p className="text-[#999999] text-xs mb-4">{store.city}, {store.state}</p>

                    {store.hours && (
                      <div className="flex items-center gap-2 text-[#888888] text-xs mb-2">
                        <Clock size={12} />
                        <span>{store.hours}</span>
                      </div>
                    )}
                    {store.phone && (
                      <div className="flex items-center gap-2 text-[#888888] text-xs mb-6">
                        <Phone size={12} />
                        <span>{store.phone}</span>
                      </div>
                    )}

                    {!store.hours && !store.phone && <div className="mb-8" />}

                    {store.status === "operational" ? (
                      <a
                        href={getDirectionsUrl(store)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-3 bg-[#03173D] text-white rounded-full font-semibold text-sm text-center hover:bg-gradient-to-r hover:from-[#03173D] hover:to-[#004AAD] transition-all duration-300"
                      >
                        Get Directions
                      </a>
                    ) : (
                      <div className="w-full py-3 bg-[#F0F0F0] text-[#999999] rounded-full font-semibold text-sm text-center cursor-default">
                        Opening Soon
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
