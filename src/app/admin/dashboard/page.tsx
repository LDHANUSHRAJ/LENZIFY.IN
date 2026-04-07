import { 
  Plus,
  Tag,
  Layers,
  ShoppingBag,
  ChevronRight,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { getDashboardStats } from "@/lib/db/admin_actions";
import { createClient } from "@/lib/supabase/server";
import DashboardStats from "@/components/admin/DashboardStats";
import DashboardCharts from "@/components/admin/DashboardCharts";
import TopProducts from "@/components/admin/TopProducts";

export default async function AdminDashboardOverview() {
  const statsData = await getDashboardStats();
  const supabase = await createClient();

  const quickActions = [
    { name: "Deploy Model", icon: Plus, href: "/admin/products/new", color: "bg-brand-navy" },
    { name: "Sector Registry", icon: Layers, href: "/admin/categories/new", color: "bg-brand-navy" },
    { name: "Offer Matrix", icon: Tag, href: "/admin/offers/new", color: "bg-secondary" },
    { name: "Generate Coupon", icon: ShoppingBag, href: "/admin/offers/coupons/new", color: "bg-secondary" },
  ];

  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="space-y-12 text-brand-navy">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 border-b border-brand-navy/5 pb-10">
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary italic">Step 01: Global Overview</p>
          <h1 className="text-4xl md:text-5xl font-serif italic text-brand-navy tracking-tight">Management <span className="text-secondary">Terminal</span></h1>
        </div>
        <div className="flex gap-4">
          <div className="px-8 py-4 bg-white border border-brand-navy/10 text-[10px] font-bold uppercase tracking-widest text-brand-navy flex items-center gap-4 shadow-sm">
             <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
             Live Network Protocol Active
          </div>
        </div>
      </header>

      {/* Real-time Stats Grid */}
      <DashboardStats initialStats={{
        totalSales: statsData.totalSales,
        totalOrders: statsData.totalOrders,
        totalCustomers: statsData.totalCustomers,
        lowStockCount: statsData.lowStockCount,
        abandonedCarts: statsData.abandonedCarts
      }} />

      {/* Quick Actions */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, i) => (
          <Link 
            key={i} 
            href={action.href}
            className="group relative bg-white border border-brand-navy/5 p-6 overflow-hidden hover:border-secondary transition-all duration-500 shadow-sm"
          >
            <div className="flex items-center gap-4 z-10 relative">
               <div className={cn("p-3 text-white transition-transform group-hover:scale-110", action.color)}>
                  <action.icon size={18} />
               </div>
               <span className="text-[10px] font-bold uppercase tracking-widest text-brand-navy">{action.name}</span>
            </div>
            <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-10 transition-opacity">
               <action.icon size={48} />
            </div>
          </Link>
        ))}
      </section>

      {/* Analytics Charts */}
      <DashboardCharts data={statsData.chartData} />

      {/* Main Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Recent Transactions */}
        <div className="lg:col-span-8 bg-white border border-brand-navy/5 p-10 lg:p-14 space-y-10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-navy/[0.02] -mr-32 -mt-32 rounded-full blur-3xl"></div>
          
          <div className="flex items-center justify-between border-b border-brand-navy/5 pb-8">
             <div className="space-y-1">
                <h2 className="text-2xl font-serif italic text-brand-navy uppercase tracking-tight">Order <span className="text-secondary">Pipeline</span></h2>
                <p className="text-[9px] font-bold uppercase tracking-widest text-brand-text-muted italic">Real-time synchronized tactical feed</p>
             </div>
             <Link href="/admin/orders" className="text-[10px] font-bold uppercase tracking-widest text-secondary hover:text-brand-navy transition-colors border-b border-secondary/20 pb-1">View Full Log</Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase tracking-[0.2em] text-brand-text-muted border-b border-brand-navy/5">
                  <th className="pb-6 font-bold">ID</th>
                  <th className="pb-6 font-bold">Client</th>
                  <th className="pb-6 font-bold text-right">Value</th>
                  <th className="pb-6 font-bold text-right">State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-navy/[0.03]">
                {statsData.recentOrders?.map((order) => (
                  <tr key={order.id} className="group hover:bg-brand-background transition-colors">
                    <td className="py-6 text-xs font-bold text-brand-navy tracking-widest uppercase">{order.id.slice(0, 8)}</td>
                    <td className="py-6">
                      <p className="text-xs font-bold text-brand-navy italic uppercase font-serif">{(order.users as any)?.name || "Generic Client"}</p>
                      <p className="text-[9px] text-brand-text-muted uppercase tracking-widest font-bold mt-1">
                        <Calendar size={10} className="inline mr-1 opacity-20" />
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="py-6 text-xs font-serif italic text-brand-navy text-right font-bold">₹{order.total_price.toLocaleString()}</td>
                    <td className="py-6 text-right">
                       <span className={cn(
                         "text-[9px] uppercase font-bold tracking-[0.2em] px-4 py-2 border transition-all italic",
                         order.status === "delivered" ? "bg-secondary text-white border-secondary shadow-[0_0_10px_rgba(var(--brand-gold-rgb),0.3)]" : 
                         order.status === "shipped" ? "border-secondary text-secondary" : 
                         order.status === "confirmed" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                         "border-brand-navy/10 text-brand-navy/40 animate-pulse"
                       )}>
                         {order.status}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side Panel Analysis */}
        <div className="lg:col-span-4 space-y-12">
           <TopProducts products={statsData.topProducts} />

           <div className="bg-[#000000] text-white p-10 lg:p-14 space-y-10 relative overflow-hidden group shadow-2xl">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/10 blur-[100px] group-hover:bg-secondary/20 transition-all duration-1000"></div>
              <div className="space-y-4">
                 <h2 className="text-2xl font-serif italic text-secondary uppercase tracking-tight">Stock <span className="text-white">Alerts</span></h2>
                 <div className="h-px w-12 bg-secondary"></div>
                 <p className="text-[9px] text-white/30 uppercase tracking-widest font-bold italic italic">Critical stock levels in {statsData.lowStockCount} units.</p>
              </div>
              <div className="space-y-6">
                 {statsData.lowStockProducts?.map((item: any) => (
                   <div key={item.id} className="flex justify-between items-center border-b border-white/5 pb-5 group/item">
                      <div className="space-y-1">
                         <p className="text-[9px] text-white/30 uppercase tracking-widest font-bold group-hover/item:text-secondary/50 transition-colors">{item.brand}</p>
                         <p className="text-xs font-serif italic text-white tracking-wide truncate max-w-[150px]">{item.name}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-[12px] font-black text-secondary">{item.stock}</p>
                         <p className="text-[7px] text-white/20 uppercase font-black italic">Remaining</p>
                      </div>
                   </div>
                 ))}
                 
                 {statsData.lowStockProducts?.length === 0 && (
                    <div className="py-10 text-center space-y-4 opacity-20">
                       <ShoppingBag className="mx-auto" size={32} />
                       <p className="text-[9px] uppercase font-bold tracking-widest">Inventory Fully Sustained</p>
                    </div>
                 )}
              </div>
              <Link href="/admin/products" className="w-full py-5 border border-secondary/20 text-[10px] font-bold uppercase tracking-[0.3em] text-secondary hover:bg-secondary hover:text-white transition-all flex items-center justify-center gap-3 group/btn">
                 <span>REPLENISH MATRIX</span>
                 <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
