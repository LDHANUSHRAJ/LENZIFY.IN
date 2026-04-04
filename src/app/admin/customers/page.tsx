"use client";

import { useState } from "react";
import { Search, Filter, Users, UserPlus, Mail, Phone, MoreHorizontal, ShieldCheck, MapPin, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const customers = [
  { id: "CL-501", name: "Dhanush Dev", email: "dhanu@lenzify.in", phone: "+91 99887 76655", orders: 12, spent: "₹45,200", status: "Elite", joined: "JAN 12, 2026" },
  { id: "CL-502", name: "Lando Norris", email: "lando@mclaren.com", phone: "+44 20 7890 1234", orders: 3, spent: "₹12,499", status: "Active", joined: "FEB 05, 2026" },
  { id: "CL-503", name: "Lewis Hamilton", email: "lh44@mercedes.com", phone: "+44 20 1234 5678", orders: 8, spent: "₹28,600", status: "Elite", joined: "JAN 20, 2026" },
  { id: "CL-504", name: "Max Verstappen", email: "max@redbull.com", phone: "+31 20 6543 2109", orders: 1, spent: "₹2,400", status: "New", joined: "FEB 18, 2026" },
  { id: "CL-505", name: "Charles Leclerc", email: "charles@ferrari.com", phone: "+377 93 25 12 34", orders: 4, spent: "₹8,900", status: "Active", joined: "FEB 10, 2026" },
];

export default function AdminCustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || c.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "elite": return "border-brand-gold text-brand-gold bg-brand-gold/10";
      case "active": return "border-brand-navy text-brand-navy bg-brand-navy/5";
      case "new": return "border-green-600 text-green-600 bg-green-50";
      default: return "border-brand-navy/20 text-brand-navy/60 bg-brand-background";
    }
  };

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display uppercase tracking-widest text-brand-navy mb-2">Authenticated Clients</h1>
          <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-brand-text-muted">Total Directory: {customers.length}</p>
        </div>
        <button className="bg-brand-navy text-white px-8 py-4 text-xs font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-brand-gold hover:text-white transition-all shadow-lg group">
          <UserPlus size={16} className="group-hover:scale-110 transition-transform" />
          Enroll New Client
        </button>
      </header>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white border border-brand-navy/5 p-6 shadow-sm">
        <div className="relative w-full md:w-96 group">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-muted group-focus-within:text-brand-gold transition-colors" />
          <input 
            type="text" 
            placeholder="Search client index (Name, Email)..."
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
               <option value="all">All Classifications</option>
               <option value="elite">Elite</option>
               <option value="active">Active</option>
               <option value="new">New Entry</option>
             </select>
          </div>
        </div>
      </div>

      {/* Customers List - Grid Layout for Premium Feel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredCustomers.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-white border border-brand-navy/5 p-8 group hover:border-brand-gold transition-all duration-500 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                   <div className="w-12 h-12 bg-brand-navy text-white flex items-center justify-center font-display text-xl">
                      {c.name.split(" ").map(n => n[0]).join("")}
                   </div>
                   <span className={`text-[9px] uppercase font-bold tracking-widest px-3 py-1.5 border transition-colors ${getStatusStyle(c.status)}`}>
                     {c.status}
                   </span>
                </div>

                <div>
                   <h3 className="text-xl font-display text-brand-navy uppercase tracking-widest mb-1">{c.name}</h3>
                   <p className="text-[10px] text-brand-text-muted font-black uppercase tracking-[0.2em]">{c.id}</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-brand-navy/5">
                   <div className="flex items-center gap-4 text-brand-text-muted group-hover:text-brand-navy transition-colors">
                      <Mail size={14} />
                      <span className="text-xs font-medium lowercase tracking-wider">{c.email}</span>
                   </div>
                   <div className="flex items-center gap-4 text-brand-text-muted group-hover:text-brand-navy transition-colors">
                      <Phone size={14} />
                      <span className="text-xs font-medium">{c.phone}</span>
                   </div>
                   <div className="flex items-center gap-4 text-brand-text-muted group-hover:text-brand-navy transition-colors">
                      <Calendar size={14} />
                      <span className="text-[10px] uppercase font-bold tracking-widest">Enrolled: {c.joined}</span>
                   </div>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-brand-navy/5 flex justify-between items-center bg-brand-background/30 -mx-8 -mb-8 px-8 py-5">
                 <div className="text-left">
                    <p className="text-[8px] uppercase tracking-tighter font-black text-brand-navy/40 mb-1 leading-none">Total Value</p>
                    <p className="text-lg font-bold text-brand-navy leading-none">{c.spent}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[8px] uppercase tracking-tighter font-black text-brand-navy/40 mb-1 leading-none">Orders</p>
                    <p className="text-lg font-bold text-brand-navy leading-none">{c.orders}</p>
                 </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredCustomers.length === 0 && (
          <div className="col-span-full py-24 text-center bg-white border border-brand-navy/5">
             <Users size={48} className="mx-auto text-brand-navy/10 mb-6" />
             <h3 className="text-2xl font-display text-brand-navy uppercase tracking-widest">Client Not Found</h3>
             <p className="text-xs text-brand-text-muted uppercase tracking-widest mt-2">Adjust your search parameters</p>
          </div>
        )}
      </div>

      {/* Trust & Database Markers */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 pt-12 opacity-30 grayscale border-t border-brand-navy/5">
         <div className="flex items-center gap-3">
            <ShieldCheck size={18} />
            <span className="text-[9px] font-black uppercase tracking-[0.4em]">GDPR Compliant Nexus</span>
         </div>
         <div className="flex items-center gap-3">
            <MapPin size={18} />
            <span className="text-[9px] font-black uppercase tracking-[0.4em]">Integrated Supply Chain</span>
         </div>
      </div>
    </div>
  );
}
