"use client";

import { useState } from "react";
import { User, Package, Heart, Settings, LogOut, ChevronRight, Download, Eye, MapPin, CreditCard } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "My Profile", icon: User },
    { id: "orders", label: "Order History", icon: Package },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="bg-brand-background min-h-screen pt-32 pb-24 px-6 font-sans text-brand-text-primary">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-display uppercase tracking-[0.2em] text-brand-navy">Account Dashboard</h1>
          <p className="text-brand-text-muted text-[10px] uppercase tracking-widest mt-4">Welcome back, Dhanush Dev</p>
        </header>

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 lg:items-start">
          {/* Sidebar Nav */}
          <aside className="lg:col-span-3 space-y-2">
            <div className="bg-white border border-brand-navy/5 p-4 space-y-1">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-4 px-6 py-4 transition-all duration-300 text-xs font-bold uppercase tracking-widest ${isActive ? "bg-brand-navy text-white shadow-md" : "text-brand-text-muted hover:bg-brand-background hover:text-brand-navy"}`}
                  >
                    <Icon size={16} /> 
                    <span>{tab.label}</span>
                    {isActive && <ChevronRight size={14} className="ml-auto" />}
                  </button>
                );
              })}
              <button className="w-full flex items-center gap-4 px-6 py-4 transition-all duration-300 text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-red-50">
                <LogOut size={16} /> Logout
              </button>
            </div>

            <div className="mt-8 p-6 bg-brand-navy text-white space-y-4">
               <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-gold">Lenzify Elite</h4>
               <p className="text-xs text-white/60 leading-relaxed font-medium">You have 1,450 points to redeem on your next purchase.</p>
               <button className="text-[10px] uppercase font-bold tracking-widest border-b border-brand-gold pb-1 text-brand-gold">View Benefits</button>
            </div>
          </aside>

          {/* Content Area */}
          <main className="lg:col-span-9">
            <AnimatePresence mode="wait">
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white border border-brand-navy/5 p-8 lg:p-12 shadow-sm space-y-12"
                >
                  <div>
                    <h2 className="text-2xl font-display text-brand-navy uppercase tracking-widest mb-8 pb-4 border-b border-brand-navy/5">Identity Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-brand-text-muted">Full Name</label>
                        <p className="text-sm font-semibold text-brand-navy uppercase tracking-widest">Dhanush Dev</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-brand-text-muted">Email Protocol</label>
                        <p className="text-sm font-semibold text-brand-navy uppercase tracking-widest">dhanu@lenzify.in</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-brand-text-muted">Phone Line</label>
                        <p className="text-sm font-semibold text-brand-navy uppercase tracking-widest">+91 99887 76655</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-brand-text-muted">Preferred Store</label>
                        <p className="text-sm font-semibold text-brand-navy uppercase tracking-widest">Bangalore Flagship</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-display text-brand-navy uppercase tracking-widest mb-8 pb-4 border-b border-brand-navy/5">Primary Address</h2>
                    <div className="flex items-start gap-6 p-6 bg-brand-background border border-brand-navy/5">
                       <MapPin className="text-brand-gold shrink-0" size={20} />
                       <p className="text-xs text-brand-text-primary leading-relaxed uppercase tracking-widest font-medium">
                          123 Luxury Avenue, Indiranagar<br />
                          Bangalore, Karnataka - 560038<br />
                          India
                       </p>
                       <button className="ml-auto text-[10px] font-bold text-brand-navy underline tracking-widest uppercase">Edit</button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "orders" && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {[
                    { id: "LZ-0912", date: "FEB 18, 2026", total: "₹6,149", status: "Delivered", items: 2 },
                    { id: "LZ-0845", date: "JAN 22, 2026", total: "₹3,500", status: "Processing", items: 1 },
                  ].map(order => (
                    <div key={order.id} className="bg-white border border-brand-navy/5 p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 group hover:border-brand-gold transition-colors duration-500">
                      <div className="flex gap-8">
                        <div className="w-14 h-14 bg-brand-background border border-brand-navy/5 flex items-center justify-center text-brand-navy group-hover:bg-brand-navy group-hover:text-white transition-all">
                          <Package size={24} />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-display text-xl text-brand-navy uppercase tracking-widest">Order #{order.id}</h3>
                          <p className="text-[10px] text-brand-text-muted uppercase tracking-[0.2em] font-bold">{order.date} &bull; {order.items} Items</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-12 w-full md:w-auto border-t md:border-none pt-4 md:pt-0">
                        <div className="text-left md:text-right space-y-1">
                          <p className="text-lg font-bold text-brand-navy">{order.total}</p>
                          <span className={`text-[10px] uppercase font-bold tracking-widest ${order.status === "Delivered" ? "text-green-600" : "text-brand-gold"}`}>{order.status}</span>
                        </div>
                        <div className="flex gap-4 ml-auto md:ml-0">
                          <button className="p-3 text-brand-text-muted hover:text-brand-navy transition-colors"><Download size={18} /></button>
                          <button className="p-3 text-brand-text-muted hover:text-brand-navy transition-colors"><Eye size={18} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === "wishlist" && (
                <motion.div
                  key="wishlist"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                   <div className="bg-white border border-brand-navy/5 p-6 group hover:border-brand-gold transition-all duration-500">
                      <div className="flex gap-6">
                        <div className="relative w-28 h-32 bg-brand-background border border-brand-navy/5 overflow-hidden shrink-0">
                          <Image src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800" alt="Spectacle" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-2">
                           <div className="space-y-1">
                              <h3 className="font-display text-lg text-brand-navy uppercase tracking-widest">Carbon Onyx Elite</h3>
                              <p className="text-brand-gold text-xs font-bold">₹3,500</p>
                           </div>
                           <button className="w-full bg-brand-navy text-white py-3 text-[9px] font-bold uppercase tracking-widest hover:bg-brand-gold transition-colors">Move to Bag</button>
                        </div>
                      </div>
                   </div>
                </motion.div>
              )}

              {activeTab === "settings" && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white border border-brand-navy/5 p-8 lg:p-12 shadow-sm space-y-12"
                >
                  <h2 className="text-2xl font-display text-brand-navy uppercase tracking-widest mb-8 pb-4 border-b border-brand-navy/5">Preferences</h2>
                  <div className="space-y-8 max-w-2xl">
                    <div className="flex items-center justify-between p-6 bg-brand-background border border-brand-navy/5">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-brand-navy mb-1">Email Notifications</h4>
                        <p className="text-[10px] text-brand-text-muted uppercase tracking-widest leading-relaxed">Receive updates on limited collections.</p>
                      </div>
                      <div className="w-10 h-5 bg-brand-navy rounded-full relative">
                        <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-6 bg-brand-background border border-brand-navy/5">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-brand-navy mb-1">Security Protocols</h4>
                        <p className="text-[10px] text-brand-text-muted uppercase tracking-widest leading-relaxed">Enable biometric authentication for faster checkout.</p>
                      </div>
                      <div className="w-10 h-5 bg-brand-navy/10 rounded-full relative">
                        <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
                      </div>
                    </div>
                    <button className="bg-brand-navy text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-brand-gold transition-all">Update Preferences</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
