"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const stats = [
    { label: "Active Protocols", value: "02", color: "text-primary" },
    { label: "Vision Credits", value: "₹3450", color: "text-secondary" },
    { label: "Archive Tier", value: "HERITAGE", color: "text-primary" },
    { label: "Access Window", value: "14 APR", color: "text-on-surface/60" },
  ];

  const activeOrders = [
    { 
      id: "LX-90122", 
      status: "Optical Calibration", 
      progress: 65, 
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCPJOFZOe3u0TQLIlFjJS59aDoiG9Z_j1KG7zZWvtJ6SRbyGHrdgaZtXs_ipzi61i8zoEczz4l3tDilIC557iERv3uoWcbBIrWoiUZtHTM4I4wAWU_2EF6luh1xx82lWeis7MDW-nkmQ2rUHRWfKoyQdSPym8MTXVhobxt-VWYBjEKQmMFS5Rjm9S8BwEfX17u15c43k4-YGqjFn1btVVNwwoH1XShyPqQLelcmQ0RGk_WRHpVRICKumJNkMrReUJDf3unNmIwaOL8" 
    },
    { 
      id: "LX-90125", 
      status: "Final Inspection", 
      progress: 92, 
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBPfiZ7Fa-dRXkhRrkOnrPABL-vOvUxT4j09uA4dDObbjCHoSZO5rzKiOJZhHvZ-NBiBYfLrMmRdzIaXjTxrTtnXQEMdxIpsaOWdLEIzabJbkhXFx4VfyOElz8-pK7AruLrVMOo7zw4seLIzRjWeD-mlp8PLQbkIWSiTrPwEcxjgOU4BWbr-m9yESFySl3sxgBeZ1jWjC1iWHsKkkzX4gnuzATtbxCdKxwQuKSpL0V_B4MzWANdMmrO_Y4lmK6MeRVsUB2B0gza804" 
    },
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [] } as any
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen pt-24">
      <main className="max-w-screen-2xl mx-auto px-8 md:px-12 py-12 pb-32 flex flex-col lg:flex-row gap-16 lg:gap-24">
        {/* Profile Sidebar */}
        <aside className="w-full lg:w-80 flex-shrink-0">
          <div className="sticky top-32 space-y-12">
            <div className="bg-white p-10 editorial-shadow rounded-sm border border-outline/10 text-center space-y-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
              <div className="relative z-10 space-y-6">
                <div className="w-24 h-24 mx-auto rounded-full border border-outline/20 p-2 grayscale hover:grayscale-0 transition-all duration-700">
                  <div className="w-full h-full rounded-full bg-surface-container flex items-center justify-center text-primary text-3xl font-serif italic border border-outline/10">JD</div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-serif italic text-primary leading-tight">James Dalton</h3>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface/40">Editorial Member</p>
                </div>
                <div className="pt-8 border-t border-outline/10 space-y-4 text-left">
                  {["Member Dashboard", "Purchase History", "Vision Vault", "Archive Settings", "Concierge"].map((item, i) => (
                    <button key={item} className={cn(
                      "w-full py-4 px-6 text-[10px] font-bold uppercase tracking-widest transition-all text-left flex items-center gap-4",
                      i === 0 ? "bg-primary text-white" : "text-on-surface/60 hover:text-primary hover:bg-surface-container-low"
                    )}>
                      <span className="material-symbols-outlined text-[18px]">
                        {["dashboard", "history", "visibility", "settings", "support_agent"][i]}
                      </span>
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button className="w-full flex items-center justify-center gap-3 py-4 text-[10px] font-bold text-on-surface/40 uppercase tracking-widest hover:text-secondary transition-colors">
              <span className="material-symbols-outlined text-[18px]">logout</span>
              Terminate Session
            </button>
          </div>
        </aside>

        {/* Dashboard Content */}
        <section className="flex-grow space-y-20">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div 
                key={stat.label}
                {...fadeInUp}
                transition={{  } as any}
                className="bg-white p-8 border border-outline/10 space-y-4"
              >
                <p className="text-[10px] font-bold text-on-surface/40 uppercase tracking-widest">{stat.label}</p>
                <p className={cn("text-5xl font-serif italic tracking-tighter", stat.color)}>{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Active Status */}
          <div className="space-y-12">
            <header className="flex justify-between items-end border-b border-outline/10 pb-6">
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary">Operational Status</p>
                <h2 className="text-4xl font-serif italic text-primary">Active Protocols</h2>
              </div>
              <button className="text-[10px] font-bold uppercase tracking-widest text-on-surface/40 hover:text-primary transition-colors pb-2">Full History Detail</button>
            </header>
            
            <div className="space-y-8">
              {activeOrders.map((order, i) => (
                <motion.div 
                  key={order.id}
                  {...fadeInUp}
                  transition={{  } as any}
                  className="group flex flex-col md:flex-row items-center gap-12 p-8 bg-white border border-outline/10 hover:border-primary/20 transition-all"
                >
                  <div className="w-32 h-32 bg-surface-container-low p-4 flex-shrink-0 grayscale group-hover:grayscale-0 transition-all duration-1000 border border-outline/10">
                    <Image src={order.img} alt={order.id} fill className="object-contain mix-blend-multiply" />
                  </div>
                  <div className="flex-grow space-y-6 w-full">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h4 className="text-xl font-serif italic text-primary">Protocol {order.id}</h4>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface/40">Standard Vision Acquisition</p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface/40">State</p>
                        <p className="text-xs font-bold text-secondary uppercase tracking-widest italic">{order.status}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-bold text-on-surface/60 uppercase tracking-widest">
                        <span>Calibration Progress</span>
                        <span>{order.progress}%</span>
                      </div>
                      <div className="h-0.5 w-full bg-surface-container overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${order.progress}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full bg-primary"
                        ></motion.div>
                      </div>
                    </div>
                  </div>
                  <button className="w-full md:w-auto px-10 py-5 border border-outline/10 text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all">Track Coordinates</button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Lower Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="space-y-10">
              <h3 className="text-2xl font-serif italic text-primary">Vision Vault</h3>
              <div className="bg-white p-10 border border-outline/10 space-y-8 italic">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-surface-container flex items-center justify-center text-primary border border-outline/10">
                    <span className="material-symbols-outlined">medical_mask</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-serif text-primary">Prescription 2024.1</h4>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface/40">Verified Archival Entry</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-8 border-y border-outline/10 py-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface/40">Oculus Sinister</p>
                    <p className="text-2xl font-serif text-primary">-1.25 SPH</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface/40">Oculus Dexter</p>
                    <p className="text-2xl font-serif text-primary">-1.50 SPH</p>
                  </div>
                </div>
                <button className="w-full py-5 text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary-container hover:text-white transition-all flex items-center justify-center gap-3">
                  <span className="material-symbols-outlined text-[18px]">download_for_offline</span>
                  Export Archival PDF
                </button>
              </div>
            </div>

            <div className="space-y-10">
              <h3 className="text-2xl font-serif italic text-primary">Member Schedule</h3>
              <div className="bg-white p-10 border border-outline/10 space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
                    <span className="material-symbols-outlined">calendar_today</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-serif text-primary">Expert Vision Exam</h4>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface/40">Lenzify Flagship Atelier</p>
                  </div>
                </div>
                <div className="space-y-6">
                   <div className="flex justify-between items-baseline border-b border-outline/10 pb-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface/40">Scheduled Horizon</p>
                      <p className="text-2xl font-serif italic text-primary">14 APR, 14:30</p>
                   </div>
                   <div className="flex gap-4">
                      <button className="flex-grow py-5 text-[10px] font-bold uppercase tracking-widest bg-primary text-white hover:opacity-80 transition-all text-center">Reschedule Access</button>
                   </div>
                </div>
              </div>
              <button className="w-full py-6 border border-outline/10 border-dashed text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface/40 hover:border-primary hover:text-primary transition-all">
                Request Protocol Maintenance
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
