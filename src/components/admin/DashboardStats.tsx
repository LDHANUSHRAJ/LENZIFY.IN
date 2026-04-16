"use client";

import { useEffect, useState } from "react";
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  AlertCircle, 
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  Package
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface StatsProps {
  initialStats: {
    totalSales: number;
    totalOrders: number;
    totalCustomers: number;
    lowStockCount: number;
    abandonedCarts: number;
    replacementsCount?: number;
  };
}

export default function DashboardStats({ initialStats }: StatsProps) {
  const [stats, setStats] = useState(initialStats);
  const supabase = createClient();

  useEffect(() => {
    // 📡 Live Network Protocol Synchronization
    const channel = supabase
      .channel("dashboard_realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => fetchUpdatedStats())
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => fetchUpdatedStats())
      .on("postgres_changes", { event: "*", schema: "public", table: "users" }, () => fetchUpdatedStats())
      .on("postgres_changes", { event: "*", schema: "public", table: "cart" }, () => fetchUpdatedStats())
      .subscribe();

    async function fetchUpdatedStats() {
      // Re-fetch only metrics to keep it light
      const { data: salesData } = await supabase.from("orders").select("total_price").eq("payment_status", "paid");
      const { count: totalOrders } = await supabase.from("orders").select("*", { count: "exact", head: true });
      const { count: totalCustomers } = await supabase.from("users").select("*", { count: "exact", head: true }).eq("role", "customer");
      const { count: lowStockCount } = await supabase.from("products").select("*", { count: "exact", head: true }).lte("stock", 5);
      const { data: cartUsers } = await supabase.from("cart").select("user_id");
      const { count: replacementsCount } = await supabase.from("lens_replacement_orders").select("*", { count: "exact", head: true });
      const abandonedCarts = new Set(cartUsers?.map(c => c.user_id)).size;

      setStats({
        ...stats,
        totalSales: salesData?.reduce((acc, curr) => acc + Number(curr.total_price), 0) || 0,
        totalOrders: totalOrders || 0,
        totalCustomers: totalCustomers || 0,
        lowStockCount: lowStockCount || 0,
        replacementsCount: replacementsCount || 0,
        abandonedCarts
      });
    }

    return () => { supabase.removeChannel(channel); };
  }, [supabase]);

  const cards = [
    { label: "Total Revenue", value: `₹${stats.totalSales.toLocaleString()}`, icon: DollarSign, trend: "+12.5%", positive: true, period: "Cumulative" },
    { label: "Active Orders", value: stats.totalOrders.toString(), icon: ShoppingBag, trend: "+3.2%", positive: true, period: "Life-cycle Total" },
    { label: "Client Base", value: stats.totalCustomers.toString(), icon: Users, trend: "+8.1%", positive: true, period: "Verified Agents" },
    { label: "Critical Stock", value: stats.lowStockCount.toString(), icon: AlertCircle, trend: "Priority", positive: false, period: "Units < 5" },
    { label: "Replacements", value: stats.replacementsCount?.toString() || "0", icon: Package, trend: "Active", positive: true, period: "Service Lane" },
    { label: "Abandoned Carts", value: stats.abandonedCarts.toString(), icon: ShoppingCart, trend: "-2.4%", positive: false, period: "Inactive Sessions" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="bg-white border border-brand-navy/5 p-8 group hover:border-brand-navy transition-all duration-700 hover:-translate-y-1 relative overflow-hidden shadow-sm"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 bg-brand-background flex items-center justify-center text-brand-navy border border-brand-navy/5 group-hover:bg-brand-navy group-hover:text-white transition-all duration-700">
                <Icon size={16} />
              </div>
              <div className={cn("flex items-center gap-1 text-[9px] font-bold transition-all italic", card.positive ? "text-secondary" : "text-red-500")}>
                 {card.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                 {card.trend}
              </div>
            </div>
            <p className="text-[9px] uppercase font-bold tracking-widest text-brand-text-muted mb-2">{card.label}</p>
            <h3 className="text-2xl font-serif italic text-brand-navy leading-none tracking-tight mb-1">{card.value}</h3>
            <p className="text-[7px] uppercase font-bold tracking-widest text-brand-navy/20 italic">{card.period}</p>
          </div>
        );
      })}
    </div>
  );
}
