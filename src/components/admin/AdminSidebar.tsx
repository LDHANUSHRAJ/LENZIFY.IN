"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Users, BarChart3, Settings, LogOut, ChevronRight, Tags, Image as ImageIcon } from "lucide-react";

const menuItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, href: "/admin/dashboard" },
  { id: "products", label: "Catalog", icon: Package, href: "/admin/products" },
  { id: "orders", label: "Orders", icon: ShoppingCart, href: "/admin/orders" },
  { id: "customers", label: "Clients", icon: Users, href: "/admin/customers" },
  { id: "coupons", label: "Promotions", icon: Tags, href: "/admin/coupons" },
  { id: "analytics", label: "Insights", icon: BarChart3, href: "/admin/analytics" },
  { id: "banners", label: "Banners", icon: ImageIcon, href: "/admin/banners" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-brand-navy text-white flex flex-col border-r border-white/5 z-50">
      <div className="p-8 pb-12">
        <Link href="/admin/dashboard" className="font-display text-2xl font-bold tracking-widest uppercase text-brand-gold">
          Lenzify Admin
        </Link>
        <p className="text-[10px] uppercase font-bold tracking-widest text-white/40 mt-2">v.2.4 Elite Terminal</p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-4 px-6 py-4 transition-all duration-300 text-xs font-bold uppercase tracking-widest hover:bg-white/5 group ${isActive ? "bg-white/10 text-brand-gold" : "text-white/60 hover:text-white"}`}
            >
              <Icon size={16} className={isActive ? "text-brand-gold" : "text-white/40 group-hover:text-white transition-colors"} />
              <span>{item.label}</span>
              {isActive && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button className="w-full flex items-center gap-4 px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-red-400 hover:bg-red-500/5 transition-all">
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
