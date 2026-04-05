"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, ShoppingCart, DollarSign, ArrowUpRight, ArrowDownRight, Package, Clock, Eye, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Archival Revenue", value: "₹4,82,450", trend: "+12.5%", icon: DollarSign, positive: true },
  { label: "Active Protocols", value: "156", trend: "+4.2%", icon: ShoppingCart, positive: true },
  { label: "Archive Clients", value: "842", trend: "-2.1%", icon: Users, positive: false },
  { label: "Conversion rate", value: "3.24%", trend: "+1.8%", icon: TrendingUp, positive: true },
];

const recentOrders = [
  { id: "ORD-9912", customer: "Lando Norris", item: "Aero Stealth Blue", status: "In Calibration", date: "2 mins ago", price: "₹4,999" },
  { id: "ORD-9911", customer: "Lewis Hamilton", item: "Carbon Onyx", status: "Dispatched", date: "45 mins ago", price: "₹3,500" },
  { id: "ORD-9910", customer: "Max Verstappen", item: "AquaGlow Daily", status: "Delivered", date: "2 hours ago", price: "₹2,400" },
  { id: "ORD-9909", customer: "Charles Leclerc", item: "Neural Clarity HD", status: "In Calibration", date: "5 hours ago", price: "₹1,200" },
];

export default function AdminDashboardOverview() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } as any
  };

  return (
    <div className="space-y-16">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 border-b border-outline/10 pb-10">
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary italic">Step 01: Global Overview</p>
          <h1 className="text-4xl md:text-5xl font-serif italic text-primary tracking-tight">Management <span className="text-secondary">Terminal</span></h1>
        </div>
        <div className="flex gap-4">
          <div className="px-8 py-4 bg-white border border-outline/10 text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-4 editorial-shadow">
             <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
             Live Network Protocol Active
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              {...fadeInUp}
              transition={{ ...fadeInUp.transition, delay: i * 0.1 }}
              className="bg-white border border-outline/10 p-10 group hover:border-primary transition-all duration-700 editorial-shadow hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="w-12 h-12 bg-surface-container flex items-center justify-center text-primary border border-outline/5 group-hover:bg-primary group-hover:text-white transition-all duration-700">
                  <Icon size={18} />
                </div>
                <div className={cn("flex items-center gap-1 text-[10px] font-bold transition-all italic", stat.positive ? "text-secondary" : "text-primary/40")}>
                   {stat.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                   {stat.trend}
                </div>
              </div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface/40 mb-3">{stat.label}</p>
              <h3 className="text-3xl font-serif italic text-primary leading-none tracking-tight">{stat.value}</h3>
            </motion.div>
          );
        })}
      </div>

      {/* Main Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Recent Transactions */}
        <div className="lg:col-span-8 bg-white border border-outline/10 p-10 lg:p-14 space-y-10 editorial-shadow">
          <div className="flex items-center justify-between border-b border-outline/10 pb-8">
             <div className="space-y-1">
                <h2 className="text-2xl font-serif italic text-primary">Deployment Logs</h2>
                <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface/30">Real-time order synchronization</p>
             </div>
             <button className="text-[10px] font-bold uppercase tracking-widest text-secondary hover:text-primary transition-colors border-b border-secondary/20 pb-1">Archive Search</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase tracking-[0.2em] text-on-surface/40 border-b border-outline/10">
                  <th className="pb-6 font-bold">Protocol ID</th>
                  <th className="pb-6 font-bold">Client Matrix</th>
                  <th className="pb-6 font-bold">Unit Designation</th>
                  <th className="pb-6 font-bold text-right">Value</th>
                  <th className="pb-6 font-bold text-right">State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline/5">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="group hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-6 text-xs font-bold text-primary tracking-widest">{order.id}</td>
                    <td className="py-6">
                      <p className="text-xs font-bold text-primary italic">{order.customer}</p>
                      <p className="text-[9px] text-on-surface/30 uppercase tracking-widest font-bold mt-1">{order.date}</p>
                    </td>
                    <td className="py-6 text-[10px] text-on-surface/60 font-bold uppercase tracking-widest italic">{order.item}</td>
                    <td className="py-6 text-xs font-serif italic text-primary text-right font-bold">{order.price}</td>
                    <td className="py-6 text-right">
                       <span className={cn(
                         "text-[9px] uppercase font-bold tracking-[0.2em] px-4 py-2 border transition-all italic",
                         order.status === "Delivered" ? "bg-secondary text-white border-secondary" : 
                         order.status === "Dispatched" ? "border-secondary text-secondary" : 
                         "border-outline/20 text-on-surface/40"
                       )}>
                         {order.status}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Activity */}
        <div className="lg:col-span-4 space-y-12">
           <div className="bg-[#000000] text-white p-10 lg:p-14 space-y-10 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/10 blur-3xl"></div>
             <div className="space-y-4">
                <h2 className="text-2xl font-serif italic text-secondary">Inventory Nexus</h2>
                <div className="h-px w-12 bg-secondary"></div>
             </div>
             <div className="space-y-8">
                {[
                   { label: "Critical Frame Stock", value: "12 units", risk: true },
                   { label: "Lens Availability", value: "94% Global", risk: false },
                   { label: "Pending Inspections", value: "5 Protocols", risk: true },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-end border-b border-white/5 pb-5">
                     <div className="space-y-1">
                        <p className="text-[9px] text-white/30 uppercase tracking-widest font-bold">{item.label}</p>
                        <p className="text-sm font-serif italic text-white tracking-wide">{item.value}</p>
                     </div>
                     {item.risk && (
                       <span className="text-[8px] bg-secondary/20 text-secondary px-3 py-1 uppercase font-bold tracking-widest italic border border-secondary/20">Action Req</span>
                     )}
                  </div>
                ))}
             </div>
             <button className="w-full py-5 border border-secondary/20 text-[10px] font-bold uppercase tracking-[0.3em] text-secondary hover:bg-secondary hover:text-white transition-all">
                INITIATE RESTOCK
             </button>
           </div>

           <div className="bg-white border border-outline/10 p-10 lg:p-14 space-y-8 editorial-shadow border-t-4 border-t-primary">
              <h2 className="text-2xl font-serif italic text-primary leading-tight">Nexus <br/>Support</h2>
              <p className="text-[10px] text-on-surface/40 leading-relaxed uppercase tracking-[0.2em] font-bold italic">4 inquiries awaiting administrative response from elite members.</p>
              <button className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary hover:text-primary transition-all flex items-center gap-3 group">
                ACCESS HELPDESK
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
