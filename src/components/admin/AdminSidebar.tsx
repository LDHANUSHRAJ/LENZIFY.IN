"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Users, BarChart3, Settings, LogOut, ChevronRight, Tags, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/app/auth/actions";

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
    <aside className="w-64 h-screen fixed left-0 top-0 bg-[#000000] text-white flex flex-col border-r border-white/5 z-50">
      <div className="p-10 pb-16">
        <Link href="/admin/dashboard" className="font-serif italic text-2xl font-bold tracking-tight text-white block">
          Lenzify <span className="text-secondary italic">Admin</span>
        </Link>
        <p className="text-[9px] uppercase font-bold tracking-[0.4em] text-white/30 mt-3 font-sans">v.2.4 Editorial Protocol</p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex items-center gap-5 px-8 py-5 transition-all duration-500 text-[10px] font-bold uppercase tracking-widest group relative",
                isActive ? "text-secondary" : "text-white/40 hover:text-white"
              )}
            >
              {isActive && <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-secondary"></div>}
              <Icon size={14} className={cn("transition-colors duration-500", isActive ? "text-secondary" : "text-white/20 group-hover:text-white")} />
              <span>{item.label}</span>
              {isActive && <ChevronRight size={12} className="ml-auto text-secondary/40" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-8 border-t border-white/5">
        <button 
          onClick={() => logout()}
          className="w-full flex items-center gap-5 px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-secondary transition-all group"
        >
          <LogOut size={14} className="text-white/20 group-hover:text-secondary transition-colors" />
          Terminate Access
        </button>
      </div>
    </aside>
  );
}
