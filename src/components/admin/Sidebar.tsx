"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Layers, 
  Users, 
  Warehouse, 
  Ticket, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  ChevronRight,
  LogOut,
  Zap,
  Globe,
  Search,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/app/auth/actions";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
  { name: "Orders", icon: ShoppingCart, href: "/admin/orders" },
  { name: "Catalog", icon: Package, href: "/admin/products" },
  { name: "Inventory", icon: Warehouse, href: "/admin/inventory" },
  { name: "Promotions", icon: Ticket, href: "/admin/offers" },
  { name: "Insights", icon: BarChart3, href: "/admin/reports" },
  { name: "Banners", icon: Globe, href: "/admin/homepage" },
  { name: "Clients", icon: Users, href: "/admin/customers" },
  { name: "Settings", icon: Settings, href: "/admin/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase.auth]);

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-[#0F1115] border-r border-white/5 flex flex-col z-[100] overflow-hidden font-sans">
      {/* Brand Header: High Contrast Terminal Style */}
      <div className="p-8 border-b border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
        <Link href="/admin/dashboard" className="group block">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-brand-navy shadow-[0_0_20px_rgba(var(--brand-gold-rgb),0.3)] group-hover:scale-110 transition-transform duration-500">
                <Zap size={16} strokeWidth={3} />
             </div>
             <div>
                <h2 className="text-xl font-black text-white tracking-widest leading-none">LENZIFY</h2>
                <p className="text-[7px] uppercase font-bold tracking-[0.4em] text-white/30 mt-1 italic">Command Nexus</p>
             </div>
          </div>
        </Link>

        {/* Operational Search - Integrated */}
        <div className="mt-8 px-2">
          <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 group focus-within:border-secondary/30 transition-all duration-500">
            <Search size={14} className="text-white/20 group-focus-within:text-secondary transition-colors" />
            <input 
              type="text" 
              placeholder="SEARCH COMMANDS..." 
              className="bg-transparent text-[8px] font-black tracking-[0.2em] uppercase focus:outline-none placeholder:text-white/10 text-white w-full"
              suppressHydrationWarning
            />
          </div>
        </div>
      </div>

      {/* Navigation Matrix */}
      <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-1 custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-500 group relative overflow-hidden",
                isActive 
                  ? "bg-secondary text-brand-navy shadow-[0_10px_20px_rgba(var(--brand-gold-rgb),0.15)]" 
                  : "text-white/40 hover:text-white hover:bg-white/[0.03]"
              )}
            >
              {/* Active Glow Effect */}
              {isActive && <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>}
              
              <div className="flex items-center gap-4 relative z-10">
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={cn("transition-transform duration-500 group-hover:scale-110", isActive ? "text-brand-navy" : "group-hover:text-white")} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.name}</span>
              </div>
              
              {isActive && <ChevronRight size={14} className="relative z-10 animate-pulse" />}
            </Link>
          );
        })}
      </nav>

      {/* System Footer: Matrix Metadata */}
      <div className="p-6 border-t border-white/5 bg-white/[0.01]">
        <div className="mb-6 px-4 space-y-4">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest italic">System v4.2 Stable</span>
              </div>
           </div>
        </div>

        {/* Identity Signature - Integrated */}
        <div className="mb-6 px-4 py-4 bg-white/[0.03] rounded-2xl border border-white/5 group transform transition-all duration-500 hover:bg-white/[0.05]">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-gradient-to-br from-white/10 to-transparent rounded-xl flex items-center justify-center text-white ring-1 ring-white/10 shadow-2xl relative overflow-hidden">
                <Shield size={18} className="relative z-10 text-secondary" />
             </div>
             <div className="flex-1 min-w-0">
                <p className="text-[9px] font-black text-white tracking-widest uppercase truncate mb-0.5 italic">
                  {user?.user_metadata?.name || "Root Admin"}
                </p>
                <div className="flex items-center gap-1.5">
                   <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div>
                   <p className="text-[6px] font-bold text-white/20 tracking-[0.2em] uppercase truncate">Verified Instance</p>
                </div>
             </div>
          </div>
        </div>
        
        <form action={logout}>
          <button 
            className="w-full flex items-center gap-4 px-5 py-4 bg-red-500/5 border border-red-500/10 rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition-all duration-700 text-[10px] font-black uppercase tracking-[0.3em] group shadow-lg"
            suppressHydrationWarning
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>Terminate</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
