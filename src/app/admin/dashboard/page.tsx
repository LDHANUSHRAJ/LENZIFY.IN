"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, ShoppingCart, DollarSign, ArrowUpRight, ArrowDownRight, Package, Clock, Eye } from "lucide-react";

const stats = [
  { label: "Total Revenue", value: "₹4,82,450", trend: "+12.5%", icon: DollarSign, positive: true },
  { label: "Active Orders", value: "156", trend: "+4.2%", icon: ShoppingCart, positive: true },
  { label: "New Clients", value: "842", trend: "-2.1%", icon: Users, positive: false },
  { label: "Conversion", value: "3.24%", trend: "+1.8%", icon: TrendingUp, positive: true },
];

const recentOrders = [
  { id: "ORD-9912", customer: "Lando Norris", item: "Aero Stealth Blue", status: "Processing", date: "2 mins ago", price: "₹4,999" },
  { id: "ORD-9911", customer: "Lewis Hamilton", item: "Carbon Onyx", status: "Shipped", date: "45 mins ago", price: "₹3,500" },
  { id: "ORD-9910", customer: "Max Verstappen", item: "AquaGlow Daily", status: "Delivered", date: "2 hours ago", price: "₹2,400" },
  { id: "ORD-9909", customer: "Charles Leclerc", item: "Neural Clarity HD", status: "Processing", date: "5 hours ago", price: "₹1,200" },
];

export default function AdminDashboardOverview() {
  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display uppercase tracking-widest text-brand-navy mb-2">Management Terminal</h1>
          <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-brand-text-muted">Real-time performance metrics</p>
        </div>
        <div className="flex gap-4">
          <div className="px-6 py-4 bg-white border border-brand-navy/5 text-[10px] font-bold uppercase tracking-widest text-brand-navy flex items-center gap-3">
             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
             Live Analytics Protocol
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-white border border-brand-navy/5 p-8 group hover:border-brand-gold transition-colors duration-500"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-brand-background text-brand-navy group-hover:bg-brand-navy group-hover:text-white transition-all">
                  <Icon size={20} />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-bold transition-all ${stat.positive ? "text-green-600" : "text-red-500"}`}>
                   {stat.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                   {stat.trend}
                </div>
              </div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-brand-text-muted mb-2">{stat.label}</p>
              <h3 className="text-2xl font-bold text-brand-navy">{stat.value}</h3>
            </motion.div>
          );
        })}
      </div>

      {/* Main Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Transactions */}
        <div className="lg:col-span-8 bg-white border border-brand-navy/5 p-8 lg:p-10 shadow-sm space-y-8">
          <div className="flex items-center justify-between border-b border-brand-navy/5 pb-6">
             <h2 className="text-xl font-display text-brand-navy uppercase tracking-widest">Recent Deployments</h2>
             <button className="text-[9px] font-bold uppercase tracking-widest text-brand-gold hover:text-brand-navy transition-colors">View Logs</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-brand-text-muted border-b border-brand-navy/5">
                  <th className="pb-4 font-bold">Order ID</th>
                  <th className="pb-4 font-bold">Client Matrix</th>
                  <th className="pb-4 font-bold">Unit Designation</th>
                  <th className="pb-4 font-bold text-right">Value</th>
                  <th className="pb-4 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-navy/5">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="group hover:bg-brand-background transition-colors">
                    <td className="py-5 text-sm font-bold text-brand-navy">{order.id}</td>
                    <td className="py-5">
                      <p className="text-xs font-semibold text-brand-navy">{order.customer}</p>
                      <p className="text-[9px] text-brand-text-muted uppercase tracking-widest font-medium">{order.date}</p>
                    </td>
                    <td className="py-5 text-xs text-brand-text-muted font-medium uppercase tracking-widest">{order.item}</td>
                    <td className="py-5 text-sm font-bold text-brand-navy text-right">{order.price}</td>
                    <td className="py-5 text-right">
                       <span className={`text-[9px] uppercase font-bold tracking-widest px-3 py-1 border transition-colors ${
                         order.status === "Delivered" ? "border-green-600 text-green-600" : 
                         order.status === "Shipped" ? "border-brand-gold text-brand-gold" : 
                         "border-brand-navy/30 text-brand-navy/60"
                       }`}>
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
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-brand-navy text-white p-8 lg:p-10 space-y-8">
             <h2 className="text-xl font-display text-brand-gold uppercase tracking-widest">Inventory Nexus</h2>
             <div className="space-y-6">
                {[
                  { label: "Critical Stock (Frames)", value: "12 units", risk: true },
                  { label: "Lens Availability", value: "In Stock", risk: false },
                  { label: "Pending Inspections", value: "5 Orders", risk: true },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-end border-b border-white/5 pb-4">
                     <div>
                        <p className="text-[9px] text-white/40 uppercase tracking-widest font-black mb-1">{item.label}</p>
                        <p className="text-sm font-bold tracking-widest font-display text-white">{item.value}</p>
                     </div>
                     {item.risk && (
                       <span className="text-[8px] bg-red-500/20 text-red-400 px-2 py-1 uppercase font-black tracking-widest">Urgent</span>
                     )}
                  </div>
                ))}
             </div>
             <button className="w-full py-4 border border-brand-gold/30 text-[9px] font-bold uppercase tracking-widest text-brand-gold hover:bg-brand-gold hover:text-brand-navy transition-all">
                Restock Protocol
             </button>
           </div>

           <div className="bg-white border border-brand-navy/5 p-8 lg:p-10">
              <h2 className="text-xl font-display text-brand-navy uppercase tracking-widest mb-6">Nexus Support</h2>
              <p className="text-xs text-brand-text-muted leading-relaxed uppercase tracking-widest font-black mb-6">4 inquiries awaiting administrative response.</p>
              <button className="text-xs font-bold uppercase tracking-[0.3em] text-brand-gold border-b border-brand-gold pb-1 hover:text-brand-navy hover:border-brand-navy transition-all">Access Helpdesk</button>
           </div>
        </div>
      </div>
    </div>
  );
}
