"use client";

import { useState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import { User, Package, Heart, Settings, LogOut, ChevronRight, Download, Eye } from "lucide-react";
import Image from "next/image";

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState("profile");

    const tabs = [
        { id: "profile", label: "Profile", icon: User },
        { id: "orders", label: "Orders", icon: Package },
        { id: "wishlist", label: "Wishlist", icon: Heart },
        { id: "settings", label: "Settings", icon: Settings },
    ];

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row gap-12">
                {/* Sidebar Nav */}
                <aside className="md:w-64 space-y-2">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs smooth-transition border ${activeTab === tab.id ? "bg-brand-electric border-brand-electric text-white" : "glass-morphism border-white/5 hover:border-white/20 text-brand-text-muted"}`}
                            >
                                <Icon size={18} /> {tab.label}
                            </button>
                        );
                    })}
                    <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs smooth-transition border border-white/5 hover:bg-brand-status-error/10 hover:border-brand-status-error/20 text-brand-status-error mt-12">
                        <LogOut size={18} /> Logout
                    </button>
                </aside>

                {/* Content Area */}
                <div className="flex-1">
                    {activeTab === "profile" && (
                        <GlassCard className="p-10 animate-fade-in" hoverGlow={false}>
                            <h2 className="text-2xl font-black uppercase tracking-tighter mb-8 text-glow">Identity Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="text-[10px] font-black tracking-widest uppercase text-brand-text-muted mb-2 block">Full Name</label>
                                    <p className="text-lg font-bold">Dhanush Dev</p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black tracking-widest uppercase text-brand-text-muted mb-2 block">Email Protocol</label>
                                    <p className="text-lg font-bold">dhanu@lenzify.in</p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black tracking-widest uppercase text-brand-text-muted mb-2 block">Phone Line</label>
                                    <p className="text-lg font-bold">+91 99887 76655</p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black tracking-widest uppercase text-brand-text-muted mb-2 block">Active Sector</label>
                                    <p className="text-lg font-bold">Bangalore, IN</p>
                                </div>
                            </div>
                            <button className="mt-12 text-brand-cyan text-xs font-bold uppercase tracking-[0.3em] hover:text-white smooth-transition">Modify Personal Matrix</button>
                        </GlassCard>
                    )}

                    {activeTab === "orders" && (
                        <div className="space-y-6 animate-fade-in">
                            {[
                                { id: "LZ-0912", date: "FEB 18, 2026", total: "₹6,149", status: "Delivered", items: 2 },
                                { id: "LZ-0845", date: "JAN 22, 2026", total: "₹3,500", status: "Processing", items: 1 },
                            ].map(order => (
                                <GlassCard key={order.id} className="p-6" hoverGlow={false}>
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                        <div className="flex gap-6">
                                            <div className="p-3 bg-brand-electric/10 border border-brand-electric/20 rounded-xl text-brand-electric">
                                                <Package size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold uppercase tracking-widest text-sm">Order #{order.id}</h3>
                                                <p className="text-xs text-brand-text-muted mt-1">{order.date} • {order.items} items</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <p className="font-black text-lg">{order.total}</p>
                                                <span className={`text-[10px] uppercase font-black tracking-widest ${order.status === "Delivered" ? "text-brand-status-success" : "text-brand-electric"}`}>{order.status}</span>
                                            </div>
                                            <button className="p-3 glass-morphism rounded-xl hover:bg-white/10 text-brand-text-muted hover:text-white smooth-transition">
                                                <Download size={18} />
                                            </button>
                                            <button className="p-3 glass-morphism rounded-xl hover:bg-white/10 text-brand-text-muted hover:text-white smooth-transition">
                                                <Eye size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    )}

                    {activeTab === "wishlist" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                            <GlassCard className="p-4" hoverGlow={false}>
                                <div className="flex gap-6">
                                    <div className="relative w-24 h-24 rounded-xl overflow-hidden glass-morphism shrink-0">
                                        <Image src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800" alt="Spectacle" fill className="object-cover" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between py-1">
                                        <div>
                                            <h3 className="font-bold text-sm uppercase">Carbon Onyx Elite</h3>
                                            <p className="text-brand-cyan text-[10px] font-bold mt-1">₹3,500</p>
                                        </div>
                                        <button className="text-[10px] font-black uppercase tracking-widest text-brand-electric hover:text-white smooth-transition flex items-center gap-2">
                                            Move to orbital cart <ChevronRight size={12} />
                                        </button>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>
                    )}

                    {activeTab === "settings" && (
                        <GlassCard className="p-10 animate-fade-in" hoverGlow={false}>
                            <h2 className="text-2xl font-black uppercase tracking-tighter mb-8 text-glow">System Configuration</h2>
                            <div className="space-y-8">
                                <div className="flex items-center justify-between p-4 glass-morphism rounded-xl border-white/5">
                                    <div>
                                        <h4 className="font-bold text-sm uppercase mb-1">Optical Bio-Sync Notifications</h4>
                                        <p className="text-[10px] text-brand-text-muted">Receive order updates via encrypted matrix.</p>
                                    </div>
                                    <div className="w-12 h-6 bg-brand-electric rounded-full relative">
                                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-lg" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 glass-morphism rounded-xl border-white/5">
                                    <div>
                                        <h4 className="font-bold text-sm uppercase mb-1">Two-Factor Authentication</h4>
                                        <p className="text-[10px] text-brand-text-muted">Enhance orbital defense protocols.</p>
                                    </div>
                                    <div className="w-12 h-6 bg-white/10 rounded-full relative">
                                        <div className="absolute left-1 top-1 w-4 h-4 bg-white/40 rounded-full" />
                                    </div>
                                </div>
                                <button className="px-8 py-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 text-xs font-black uppercase tracking-widest smooth-transition">Resync Secure Keys</button>
                            </div>
                        </GlassCard>
                    )}
                </div>
            </div>

            <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(10px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
        </div>
    );
}
