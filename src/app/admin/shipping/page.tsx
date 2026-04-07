"use client";

import { useState } from "react";
import { 
  Truck, 
  MapPin, 
  Plus, 
  Trash2, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowRight,
  Globe,
  Zap,
  ShieldCheck,
  Edit
} from "lucide-react";
import { cn } from "@/lib/utils";

const partners = [
  { name: "BlueDart Express", id: "BLU-01", status: "Active", coverage: "Pan-India", speed: "24-48h" },
  { name: "Delhivery Pro", id: "DEL-02", status: "Active", coverage: "Global Tier 1", speed: "48-72h" },
  { name: "Shadowfax Local", id: "SHA-03", status: "Maintenance", coverage: "Inter-City", speed: "12-24h" },
];

const zones = [
  { city: "Mumbai", state: "Maharashtra", charge: "0 (Free)", active: true },
  { city: "Delhi", state: "NCR", charge: "49", active: true },
  { city: "Bangalore", state: "Karnataka", charge: "49", active: true },
  { city: "Chennai", state: "Tamil Nadu", charge: "99", active: false },
];

export default function AdminShippingPage() {
  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-brand-navy/5 pb-10">
        <div>
           <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary italic mb-2">Logistics Control</p>
          <h1 className="text-4xl font-serif italic text-brand-navy tracking-tight uppercase">Distribution <span className="text-secondary">Nexus</span></h1>
        </div>
        <div className="flex gap-4">
           <button className="bg-brand-navy text-white px-10 py-5 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-4 hover:bg-secondary transition-all shadow-xl group border border-transparent">
              <Plus size={16} />
              Register Partner
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
         {/* Courier Partners */}
         <div className="lg:col-span-8 space-y-12">
            <section className="bg-white border border-brand-navy/5 p-10 lg:p-14 space-y-10 shadow-sm relative overflow-hidden">
               <div className="flex items-center justify-between border-b border-brand-navy/5 pb-8 relative">
                  <div className="flex items-center gap-4">
                     <Truck size={16} className="text-secondary" />
                     <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-navy">Authorized Courier Partners</h3>
                  </div>
                  <p className="text-[8px] font-black uppercase tracking-[0.2em] text-brand-navy/20 italic">v2.1 Synchronized</p>
               </div>
               
               <div className="space-y-6">
                  {partners.map((p, i) => (
                    <div key={i} className="flex flex-col md:flex-row items-center justify-between p-8 border border-brand-navy/5 bg-brand-background hover:border-secondary transition-all group">
                       <div className="flex items-center gap-8">
                          <div className="w-12 h-12 bg-white flex items-center justify-center text-brand-navy ring-4 ring-brand-navy/5 group-hover:bg-brand-navy group-hover:text-white transition-all">
                             <Truck size={20} />
                          </div>
                          <div>
                             <h4 className="text-sm font-serif font-black italic text-brand-navy">{p.name}</h4>
                             <p className="text-[9px] text-brand-navy/30 uppercase font-black tracking-widest mt-1">ID: {p.id}</p>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-12 mt-6 md:mt-0">
                          <div className="text-center md:text-right">
                             <p className="text-[8px] uppercase font-black tracking-widest text-brand-navy/20 mb-1 italic">Coverage</p>
                             <p className="text-[10px] font-bold text-brand-navy uppercase tracking-widest">{p.coverage}</p>
                          </div>
                          <div className="text-center md:text-right">
                             <p className="text-[8px] uppercase font-black tracking-widest text-brand-navy/20 mb-1 italic">Latency</p>
                             <p className="text-[10px] font-bold text-brand-navy uppercase tracking-widest">{p.speed}</p>
                          </div>
                          <div className="flex items-center gap-3 pl-8 border-l border-brand-navy/10">
                              <span className={cn(
                                "w-2 h-2 rounded-full",
                                p.status === "Active" ? "bg-secondary shadow-[0_0_8px_rgba(212,175,55,0.5)]" : "bg-red-500"
                              )} />
                              <span className="text-[9px] uppercase font-black tracking-widest text-brand-navy italic">{p.status}</span>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </section>

            {/* Delivery Zones */}
            <section className="bg-white border border-brand-navy/5 p-10 lg:p-14 space-y-10 shadow-sm relative overflow-hidden">
               <div className="flex items-center justify-between border-b border-brand-navy/5 pb-8 relative">
                  <div className="flex items-center gap-4">
                     <MapPin size={16} className="text-secondary" />
                     <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-navy">Serviceable Sector Map</h3>
                  </div>
                  <button className="text-[9px] font-bold uppercase tracking-widest text-secondary hover:text-brand-navy transition-all flex items-center gap-3 group">
                     Add New Zone
                     <Plus size={12} className="group-hover:rotate-90 transition-transform" />
                  </button>
               </div>
               
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead>
                     <tr className="text-[9px] uppercase tracking-[0.3em] text-brand-navy/20 border-b border-brand-navy/5">
                        <th className="pb-6 font-black">Designation (City)</th>
                        <th className="pb-6 font-black text-center">Sector (State)</th>
                        <th className="pb-6 font-black text-center">Rate Protocol</th>
                        <th className="pb-6 font-black text-right">Integrity</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-brand-navy/[0.03]">
                      {zones.map((z, i) => (
                        <tr key={i} className="group hover:bg-brand-background transition-all">
                           <td className="py-6 text-xs font-serif font-black italic text-brand-navy">{z.city}</td>
                           <td className="py-6 text-[10px] font-bold text-center text-brand-navy/40 uppercase tracking-widest">{z.state}</td>
                           <td className="py-6 text-[10px] font-black text-center text-secondary uppercase tracking-widest">₹{z.charge}</td>
                           <td className="py-6 text-right">
                              <div className="flex items-center justify-end gap-3 px-4">
                                 {z.active ? <CheckCircle2 size={14} className="text-secondary" /> : <XCircle size={14} className="text-brand-navy/20" />}
                                 <span className={cn("text-[8px] font-black uppercase tracking-widest italic", z.active ? "text-secondary" : "text-brand-navy/20")}>{z.active ? 'Linked' : 'Inhibited'}</span>
                              </div>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                 </table>
               </div>
            </section>
         </div>

         {/* Logic Constraints */}
         <div className="lg:col-span-4 space-y-12">
            <div className="bg-[#000000] text-white p-10 lg:p-14 space-y-10 relative overflow-hidden group shadow-2xl">
               <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-3xl group-hover:bg-secondary/20 transition-all duration-1000"></div>
               <div className="space-y-4">
                  <h2 className="text-2xl font-serif italic text-secondary uppercase tracking-tight leading-tight">Global <br/>Logistics Rules</h2>
                  <div className="h-px w-12 bg-secondary"></div>
               </div>
               
               <div className="space-y-8">
                  {[
                    { label: "Free Logistics Trigger", value: "₹4,999+", dynamic: true },
                    { label: "Flat Surchage Rate", value: "₹49 Units", dynamic: true },
                    { label: "Auto-Dispatch Link", value: "Enabled", dynamic: false },
                  ].map((rule, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-white/5 pb-5">
                       <p className="text-[9px] text-white/30 uppercase font-black tracking-widest italic">{rule.label}</p>
                       <span className="text-[10px] font-black text-white italic">{rule.value}</span>
                    </div>
                  ))}
               </div>

               <button className="w-full py-5 border border-secondary/20 text-[10px] font-bold uppercase tracking-[0.4em] text-secondary hover:bg-secondary hover:text-white transition-all group/btn shadow-xl">
                  RECALIBRATE RULES
               </button>
            </div>

            <div className="bg-white border border-brand-navy/5 p-10 lg:p-14 space-y-8 shadow-sm">
               <div className="flex items-center gap-4 mb-2">
                  <Zap size={16} className="text-secondary" />
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-navy">Neural Tracking</h3>
               </div>
               <p className="text-[10px] text-brand-navy/40 leading-relaxed uppercase tracking-[0.2em] font-bold italic">Real-time GPS synchronization enabled for 94% of active courier partners.</p>
               <button className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary hover:text-brand-navy transition-all flex items-center gap-3 group">
                  ACCESS TRACKING HUB
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
