"use client";

import { useState } from "react";
import { Search, Filter, ShoppingCart, Eye, FileText, Download, CheckCircle2, Truck, Clock, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const orders = [
  { id: "ORD-9912", customer: "Lando Norris", email: "lando@mclaren.com", total: "₹4,999", status: "Processing", date: "FEB 18, 2026, 14:30", items: 2, payment: "Paid (Razorpay)" },
  { id: "ORD-9911", customer: "Lewis Hamilton", email: "lh44@mercedes.com", total: "₹3,500", status: "Shipped", date: "FEB 18, 2026, 12:45", items: 1, payment: "Paid (Razorpay)" },
  { id: "ORD-9910", customer: "Max Verstappen", email: "max@redbull.com", total: "₹2,400", status: "Delivered", date: "FEB 17, 2026, 09:20", items: 3, payment: "UPI" },
  { id: "ORD-9909", customer: "Charles Leclerc", email: "charles@ferrari.com", total: "₹1,200", status: "Cancelled", date: "FEB 17, 2026, 08:15", items: 1, payment: "Refunded" },
  { id: "ORD-9908", customer: "George Russell", email: "george@mercedes.com", total: "₹8,900", status: "Processing", date: "FEB 16, 2026, 16:50", items: 4, payment: "Paid (Razorpay)" },
];

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || order.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered": return "border-green-600 text-green-600 bg-green-50";
      case "shipped": return "border-brand-gold text-brand-gold bg-brand-gold/5";
      case "processing": return "border-brand-navy text-brand-navy bg-brand-navy/5";
      case "cancelled": return "border-red-500 text-red-500 bg-red-50";
      default: return "border-brand-navy/20 text-brand-navy/60 bg-brand-background";
    }
  };

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display uppercase tracking-widest text-brand-navy mb-2">Order Deployments</h1>
          <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-brand-text-muted">Total Shipments: {orders.length}</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-white border border-brand-navy/5 px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-brand-navy flex items-center gap-3 hover:bg-brand-background transition-colors">
            <Download size={16} />
            Export Orders
          </button>
        </div>
      </header>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white border border-brand-navy/5 p-6 shadow-sm">
        <div className="relative w-full md:w-96 group">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-muted group-focus-within:text-brand-gold transition-colors" />
          <input 
            type="text" 
            placeholder="Search order hash or client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-brand-background border border-brand-navy/5 pl-12 pr-4 py-4 text-xs font-bold uppercase tracking-widest outline-none focus:border-brand-gold transition-colors"
          />
        </div>
        
        <div className="flex items-center gap-6 w-full md:w-auto">
          <div className="relative group flex-1 md:flex-none">
             <Filter size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-navy/40" />
             <select 
               value={filterStatus}
               onChange={(e) => setFilterStatus(e.target.value)}
               className="appearance-none bg-brand-background border border-brand-navy/10 pl-10 pr-12 py-4 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-brand-gold cursor-pointer"
             >
               <option value="all">All Protocols</option>
               <option value="delivered">Delivered</option>
               <option value="shipped">Shipped</option>
               <option value="processing">Processing</option>
               <option value="cancelled">Cancelled</option>
             </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-brand-navy/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-brand-background text-[10px] uppercase tracking-widest text-brand-text-muted border-b border-brand-navy/5">
                <th className="px-8 py-5 font-bold">Protocol ID</th>
                <th className="px-8 py-5 font-bold">Client Data</th>
                <th className="px-8 py-5 font-bold">Timeline</th>
                <th className="px-8 py-5 font-bold">Units</th>
                <th className="px-8 py-5 font-bold">Value</th>
                <th className="px-8 py-5 font-bold">Status</th>
                <th className="px-8 py-5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-navy/5">
              <AnimatePresence mode="popLayout">
                {filteredOrders.map((order, i) => (
                  <motion.tr 
                    key={order.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="group hover:bg-brand-background transition-colors"
                  >
                    <td className="px-8 py-6 text-xs font-bold text-brand-navy">{order.id}</td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-semibold text-brand-navy">{order.customer}</p>
                      <p className="text-[10px] text-brand-text-muted uppercase tracking-widest font-medium mt-0.5">{order.email}</p>
                    </td>
                    <td className="px-8 py-6">
                       <p className="text-[10px] text-brand-navy font-bold uppercase tracking-widest leading-relaxed">
                          {order.date}
                       </p>
                    </td>
                    <td className="px-8 py-6 text-[10px] font-bold text-brand-navy uppercase tracking-widest">{order.items} Units</td>
                    <td className="px-8 py-6">
                       <p className="text-sm font-bold text-brand-navy">{order.total}</p>
                       <p className="text-[9px] text-green-600 uppercase font-black tracking-widest mt-1">{order.payment}</p>
                    </td>
                    <td className="px-8 py-6">
                       <span className={`text-[9px] uppercase font-bold tracking-widest px-3 py-1.5 border transition-colors ${getStatusColor(order.status)}`}>
                         {order.status}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end gap-3">
                          <button className="p-2.5 text-brand-text-muted hover:text-brand-navy transition-colors bg-brand-background hover:bg-white border border-transparent hover:border-brand-navy/5">
                            <Eye size={16} />
                          </button>
                          <button className="p-2.5 text-brand-text-muted hover:text-brand-gold transition-colors bg-brand-background hover:bg-white border border-transparent hover:border-brand-navy/5">
                            <FileText size={16} />
                          </button>
                       </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        {filteredOrders.length === 0 && (
          <div className="py-24 text-center">
             <ShoppingCart size={48} className="mx-auto text-brand-navy/10 mb-6" />
             <h3 className="text-2xl font-display text-brand-navy uppercase tracking-widest">No Transmissions Found</h3>
             <p className="text-xs text-brand-text-muted uppercase tracking-widest mt-2">Update your tracking parameters</p>
          </div>
        )}
      </div>

      {/* Order Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
         {[
           { label: "Pending", value: "24", icon: Clock, color: "text-brand-navy" },
           { label: "In Deployment", value: "86", icon: Truck, color: "text-brand-gold" },
           { label: "Successful", value: "1,245", icon: CheckCircle2, color: "text-green-600" },
           { label: "Anomalies", value: "3", icon: AlertCircle, color: "text-red-500" },
         ].map((stat, i) => {
           const Icon = stat.icon;
           return (
             <div key={i} className="bg-white border border-brand-navy/5 p-6 flex flex-col items-center text-center group hover:border-brand-navy transition-colors duration-500">
                <div className={`p-3 bg-brand-background ${stat.color} mb-4 group-hover:scale-110 transition-transform`}>
                   <Icon size={20} />
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-text-muted mb-2">{stat.label}</h4>
                <p className="text-2xl font-bold text-brand-navy">{stat.value}</p>
             </div>
           );
         })}
      </div>
    </div>
  );
}
