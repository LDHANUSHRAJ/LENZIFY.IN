"use client";

import { motion } from "framer-motion";

export default function StoresPage() {
  const outlets = [
    { name: "Lenzify Neo-City", address: "Alpha Sector 4, Silicon Valley", status: "Operational", lat: "12.9716", lng: "77.5946" },
    { name: "The Vault - Mumbai", address: "Marine Drive Promenade", status: "Operational", lat: "18.9220", lng: "72.8347" },
    { name: "Quantum Optics - Delhi", address: "Connaught Outer Ring", status: "Maintenance", lat: "28.6139", lng: "77.2090" },
  ];

  return (
    <div className="bg-background text-on-background min-h-screen">
      <main className="max-w-screen-2xl mx-auto px-8 py-20">
        <header className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1.5 mb-6 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black tracking-[0.4em] uppercase"
          >
            Physical Protocol
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-headline font-bold text-white tracking-tighter uppercase italic leading-[0.8] mb-8">
            Global <br/><span className="text-secondary">Nodes</span>
          </h1>
          <p className="text-slate-500 uppercase tracking-[0.2em] font-black text-sm max-w-2xl mx-auto">
            Tactile verification centers for high-fidelity optics and personalized ocular calibration.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {outlets.map((outlet, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-10 rounded-[3rem] border border-white/5 bg-slate-900/40 backdrop-blur-3xl group hover:border-primary/20 transition-all"
            >
              <div className="flex justify-between items-start mb-10">
                <div className={cn(
                  "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border",
                  outlet.status === "Operational" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                )}>
                  {outlet.status}
                </div>
                <span className="material-symbols-outlined text-white/20 group-hover:text-primary transition-colors">location_on</span>
              </div>
              
              <h3 className="text-3xl font-headline font-bold text-white uppercase italic tracking-tighter mb-4">{outlet.name}</h3>
              <p className="text-slate-500 text-xs uppercase tracking-widest font-black leading-relaxed mb-8">{outlet.address}</p>
              
              <button className="w-full py-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-slate-900 transition-all duration-500">
                Synchronize Path (Get Directions)
              </button>
            </motion.div>
          ))}
        </div>

        <div className="h-[400px] w-full rounded-[4rem] overflow-hidden border border-white/5 bg-slate-900/60 relative flex items-center justify-center p-12">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
            <div className="text-center relative z-10">
                <h2 className="text-2xl font-headline font-bold text-white uppercase italic mb-4 tracking-tighter">Ocular Map Initializing...</h2>
                <p className="text-slate-500 text-[10px] uppercase tracking-widest font-black">Satellite verification in progress</p>
                <div className="mt-8 flex justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                    <div className="w-2 h-2 rounded-full bg-primary animate-ping delay-200" />
                    <div className="w-2 h-2 rounded-full bg-primary animate-ping delay-500" />
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}

// Minimal cn for component
function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
