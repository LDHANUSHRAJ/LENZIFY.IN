"use client";

import { useState, useMemo } from "react";
import ReportTabs from "./ReportTabs";
import ReportTable from "./ReportTable";
import ReportExporter from "./ReportExporter";
import { Download, Filter, Calendar, BarChart3, TrendingUp, Users, Package } from "lucide-react";
import { cn } from "@/lib/utils";

type TabType = "sales" | "orders" | "products" | "customers" | "inventory" | "lenses";

export default function ReportDashboardClient({ initialData }: { initialData: any }) {
  const [activeTab, setActiveTab] = useState<TabType>("sales");
  const [dateRange, setDateRange] = useState("all"); // 'today', 'week', 'month', 'all'
  const [searchQuery, setSearchQuery] = useState("");

  // FILTER LOGIC
  const filterByDate = (data: any[], dateField: string = "created_at") => {
    if (dateRange === "all") return data;
    const now = new Date();
    return data.filter(item => {
      const itemDate = new Date(item[dateField]);
      if (dateRange === "today") {
        return itemDate.toDateString() === now.toDateString();
      }
      if (dateRange === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return itemDate >= weekAgo;
      }
      if (dateRange === "month") {
        const monthAgo = new Date();
        monthAgo.setMonth(now.getMonth() - 1);
        return itemDate >= monthAgo;
      }
      return true;
    });
  };

  // DATASOURCE MAPPING
  const processedData = useMemo(() => {
    switch(activeTab) {
      case "sales": {
        const _orders = filterByDate(initialData.orders);
        return _orders.map((o: any) => ({
          Date: new Date(o.created_at).toLocaleDateString(),
          "Order ID": o.id.slice(0,8),
          Customer: o.users?.name || "Guest",
          Amount: o.total_price,
          Status: o.status,
          Payment: o.payment_method || "System",
          Type: "Standard"
        }));
      }
      case "orders": {
        const _orders = filterByDate(initialData.orders);
        const _reps = filterByDate(initialData.replacements);
        return [
          ..._orders.map((o: any) => ({
            Date: new Date(o.created_at).toLocaleDateString(),
            "Order ID": o.id.slice(0,8),
            Customer: o.users?.name || "Guest",
            Amount: o.total_price,
            Type: "Standard Purchase",
            Status: o.status,
          })),
          ..._reps.map((o: any) => ({
            Date: new Date(o.created_at).toLocaleDateString(),
            "Order ID": o.id.slice(0,8),
            Customer: o.users?.name || "Guest",
            Amount: o.total_price,
            Type: "Lens Replacement",
            Status: o.status,
          }))
        ];
      }
      case "products": {
        // Flatten order items
        const _orders = filterByDate(initialData.orders);
        const productSales: any = {};
        _orders.forEach((o: any) => {
          o.order_items?.forEach((item: any) => {
              const pid = item.products?.name || "Unknown";
              const catName = item.products?.categories?.name || "N/A";
              if(!productSales[pid]) productSales[pid] = { Product: pid, Category: catName, Brand: item.products?.brand, "Units Sold": 0, Revenue: 0 };
             productSales[pid]["Units Sold"] += item.quantity;
             productSales[pid].Revenue += (item.quantity * item.price);
          });
        });
        return Object.values(productSales).sort((a: any, b: any) => b["Units Sold"] - a["Units Sold"]);
      }
      case "customers": {
         const _users = filterByDate(initialData.customers);
         return _users.map((u: any) => ({
           Date: new Date(u.created_at).toLocaleDateString(),
           Name: u.name || "N/A",
           Email: u.email,
           Role: u.role,
           "Account Status": u.is_blocked ? "Suspended" : "Active"
         }));
      }
      case "inventory": {
         return initialData.products?.map((p: any) => ({
           Product: p.name,
           Brand: p.brand,
           Category: p.categories?.name || "N/A",
           Stock: p.stock,
           "Stock Value": p.stock * (p.price || 0), // Fallback to price
           Status: p.stock === 0 ? "Out of Stock" : p.stock < 5 ? "Critical" : "Healthy"
         }));
      }
      case "lenses": {
         const _reps = filterByDate(initialData.replacements);
         return _reps.map((r: any) => ({
           Date: new Date(r.created_at).toLocaleDateString(),
           "Order ID": r.id.slice(0,8),
           "Frame Type": r.frame_type,
           "Frame Cond.": r.frame_condition,
           "Lens Type": r.lens_type,
           Amount: r.total_price,
         }));
      }
      default: return [];
    }
  }, [activeTab, dateRange, initialData]);

  // Derived Metrics
  const totalSales = initialData.orders.reduce((acc: number, o: any) => acc + (o.payment_status === 'paid' ? Number(o.total_price) : 0), 0);
  const totalOrdersCount = initialData.orders.length + initialData.replacements.length;

  return (
    <div className="space-y-12 pb-24">
      {/* GLOBAL HEADER */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-brand-navy/5 pb-10">
        <div className="space-y-2">
           <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary italic">Data Intelligence</p>
          <h1 className="text-4xl md:text-5xl font-serif italic text-brand-navy tracking-tight uppercase">Archive <span className="text-secondary">Analytics</span></h1>
        </div>
        
        <div className="flex gap-4 items-center">
           {/* Date Range Selector */}
           <div className="flex bg-white border border-brand-navy/10 rounded-sm overflow-hidden text-[10px] font-bold uppercase tracking-widest text-brand-navy">
              {[
                { id: "today", label: "24H" },
                { id: "week", label: "7D" },
                { id: "month", label: "30D" },
                { id: "all", label: "MAX" }
              ].map(opt => (
                <button 
                  key={opt.id}
                  onClick={() => setDateRange(opt.id)}
                  className={cn("px-4 py-3 border-r border-brand-navy/5 last:border-0 hover:bg-brand-background transition-colors", dateRange === opt.id && "bg-secondary text-white")}
                >
                  {opt.label}
                </button>
              ))}
           </div>
           
           <ReportExporter data={processedData} activeTab={activeTab} />
        </div>
      </header>

      {/* QUICK METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
         {[
           { label: "Lifespan Revenue", value: `₹${totalSales.toLocaleString()}`, icon: BarChart3 },
           { label: "Total Interventions", value: totalOrdersCount.toString(), icon: Package },
           { label: "Registered Agents", value: initialData.customers.length.toString(), icon: Users },
           { label: "Matrix AOV", value: `₹${totalOrdersCount ? Math.floor(totalSales/totalOrdersCount).toLocaleString() : 0}`, icon: TrendingUp },
         ].map((stat, i) => (
           <div key={i} className="bg-white border border-brand-navy/5 p-8 space-y-6 group hover:border-secondary transition-all">
              <div className="flex justify-between items-start">
                 <div className="w-10 h-10 bg-brand-background flex items-center justify-center text-brand-navy group-hover:bg-brand-navy group-hover:text-white transition-all">
                    <stat.icon size={18} />
                 </div>
              </div>
              <div>
                 <p className="text-[9px] text-brand-navy/30 uppercase font-black tracking-widest mb-1 italic">{stat.label}</p>
                 <h3 className="text-2xl font-serif font-black italic text-brand-navy">{stat.value}</h3>
              </div>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-3">
           <ReportTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className="lg:col-span-9 bg-white border border-brand-navy/5 p-8 shadow-sm">
           <ReportTable 
              data={processedData} 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
           />
        </div>
      </div>
    </div>
  );
}
