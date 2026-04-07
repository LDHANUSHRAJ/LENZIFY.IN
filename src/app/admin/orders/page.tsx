import { createClient } from "@/lib/supabase/server";
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Eye, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle, 
  Package,
  Calendar,
  User,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { updateOrderStatus } from "@/lib/db/order_actions";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string; from?: string; to?: string }>;
}) {
  const params = await searchParams;
  const query = params?.q || "";
  const status = params?.status || "all";
  const page = parseInt(params?.page || "1");
  const fromDate = params?.from || "";
  const toDate = params?.to || "";
  const pageSize = 10;

  const supabase = await createClient();

  // Load orders with Pagination and Filtering
  let dbQuery = supabase
    .from("orders")
    .select("*, users(name, email)", { count: "exact" })
    .order("created_at", { ascending: false });

  if (query) {
    dbQuery = dbQuery.or(`id.ilike.%${query}%,tracking_id.ilike.%${query}%`);
  }
  if (status !== "all") {
    dbQuery = dbQuery.eq("status", status);
  }
  if (fromDate) {
    dbQuery = dbQuery.gte("created_at", `${fromDate}T00:00:00`);
  }
  if (toDate) {
    dbQuery = dbQuery.lte("created_at", `${toDate}T23:59:59`);
  }

  // Pagination Range
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data: orders, count } = await dbQuery.range(from, to);

  const totalPages = Math.ceil((count || 0) / pageSize);

  const statusOptions = [
    { value: "all", label: "All Protocols" },
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
    { value: "refunded", label: "Refunded" },
  ];

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-brand-navy/5 pb-10">
        <div>
           <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary italic mb-2">Order Matrix</p>
          <h1 className="text-4xl font-serif italic text-brand-navy tracking-tight uppercase">System <span className="text-secondary">Logs</span></h1>
          <p className="text-[9px] uppercase font-bold tracking-[0.3em] text-brand-text-muted mt-3 italic">Active Transactions: {count || 0}</p>
        </div>
      </header>

      {/* Control Bar */}
      <div className="bg-white border border-brand-navy/5 p-8 shadow-sm space-y-6">
         <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <form className="relative w-full lg:w-[450px] group">
               <Search size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-navy/30 group-focus-within:text-secondary transition-colors" />
               <input 
                 name="q"
                 defaultValue={query}
                 placeholder="SEARCH BY PROTOCOL ID / CLIENT..."
                 className="w-full bg-brand-background border border-brand-navy/5 pl-16 pr-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] outline-none focus:border-secondary transition-all"
               />
            </form>

            <div className="flex flex-wrap items-center gap-6 w-full lg:w-auto">
               {/* Date Range */}
               <form className="flex items-center gap-4 bg-brand-background border border-brand-navy/5 px-6 py-4">
                  <Calendar size={14} className="text-brand-navy/30" />
                  <input type="date" name="from" defaultValue={fromDate} className="bg-transparent text-[10px] font-bold uppercase tracking-widest outline-none" />
                  <span className="text-[8px] font-black text-brand-navy/20">TO</span>
                  <input type="date" name="to" defaultValue={toDate} className="bg-transparent text-[10px] font-bold uppercase tracking-widest outline-none" />
                  <button type="submit" className="hidden">Filter</button>
               </form>

               <div className="relative group flex-1 lg:flex-none">
                  <Filter size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-navy/30" />
                  <select 
                    name="status"
                    defaultValue={status}
                    className="appearance-none bg-brand-background border border-brand-navy/10 pl-14 pr-16 py-5 text-[10px] font-bold uppercase tracking-[0.2em] outline-none focus:border-secondary cursor-pointer min-w-[200px]"
                  >
                    {statusOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
               </div>
            </div>
         </div>
      </div>

      {/* Order List Table */}
      <div className="bg-white border border-brand-navy/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[9px] uppercase tracking-[0.3em] text-brand-text-muted bg-brand-background border-b border-brand-navy/5">
                <th className="px-10 py-6 font-bold">Protocol ID</th>
                <th className="px-6 py-6 font-bold">Timestamp</th>
                <th className="px-6 py-6 font-bold">Client Matrix</th>
                <th className="px-6 py-6 font-bold">Financials</th>
                <th className="px-6 py-6 font-bold">Payment</th>
                <th className="px-6 py-6 font-bold">State</th>
                <th className="px-10 py-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-navy/[0.03]">
              {orders?.map((order) => (
                <tr key={order.id} className="group hover:bg-brand-background transition-all duration-300">
                  <td className="px-10 py-8">
                     <p className="text-xs font-bold text-brand-navy tracking-widest">{order.id.slice(0, 8)}...</p>
                  </td>
                  <td className="px-6 py-8">
                    <div className="flex items-center gap-2">
                       <Clock size={12} className="text-brand-navy/20" />
                       <span className="text-[10px] font-bold text-brand-navy/60 uppercase tracking-widest">
                          {new Date(order.created_at).toLocaleDateString()}
                       </span>
                    </div>
                  </td>
                   <td className="px-6 py-8">
                    <div className="flex items-center gap-4">
                       <div className="w-8 h-8 rounded-full bg-brand-navy text-white flex items-center justify-center text-[10px] font-black uppercase ring-2 ring-brand-navy/5">
                          {(order.users as any)?.name?.[0] || 'U'}
                       </div>
                       <div>
                          <p className="text-xs font-bold text-brand-navy italic uppercase font-serif">{(order.users as any)?.name || 'Generic Client'}</p>
                          <p className="text-[9px] text-brand-navy/30 uppercase tracking-widest font-bold mt-1">{(order.users as any)?.email}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-8">
                     <p className="text-sm font-serif italic text-brand-navy font-black tracking-tight">₹{order.total_price.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-8">
                     <span className={cn(
                       "text-[8px] uppercase font-serif italic font-black tracking-[0.2em] px-3 py-1 border transition-all",
                       order.payment_status === "paid" ? "border-secondary/20 bg-secondary/5 text-secondary" : "border-brand-navy/10 text-brand-navy/30"
                     )}>
                       {order.payment_status}
                     </span>
                  </td>
                  <td className="px-6 py-8">
                     <div className="flex items-center gap-3">
                        <span className={cn(
                          "w-2 h-2 rounded-full",
                          order.status === "delivered" ? "bg-secondary shadow-[0_0_10px_rgba(var(--brand-gold-rgb),0.5)]" : 
                          order.status === "shipped" ? "bg-blue-400" : 
                          order.status === "cancelled" ? "bg-red-500" : 
                          order.status === "confirmed" ? "bg-emerald-500" : "bg-brand-navy/20 animate-pulse"
                        )} />
                        <span className="text-[9px] uppercase font-black tracking-[0.2em] text-brand-navy italic">{order.status}</span>
                     </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-3">
                       {order.status === 'pending' && (
                          <form action={async () => { "use server"; await updateOrderStatus(order.id, 'confirmed'); }}>
                             <button title="Confirm Order" className="p-3 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100"><CheckCircle2 size={16} /></button>
                          </form>
                       )}
                       {order.status === 'confirmed' && (
                          <div className="flex gap-2">
                             <form action={async () => { "use server"; await updateOrderStatus(order.id, 'shipped'); }}>
                                <button title="Dispatch Order" className="p-3 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all border border-blue-100"><Truck size={16} /></button>
                             </form>
                          </div>
                       )}
                       <Link 
                         href={`/admin/orders/${order.id}`}
                         className="p-3 bg-brand-background hover:bg-brand-navy text-brand-navy/40 hover:text-white transition-all border border-brand-navy/5"
                       >
                         <Eye size={16} />
                       </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {(!orders || orders.length === 0) && (
          <div className="py-32 text-center bg-white border-t border-brand-navy/5 relative overflow-hidden">
             <div className="absolute inset-0 bg-brand-navy/[0.01] animate-pulse"></div>
             <ShoppingCart size={64} className="mx-auto text-brand-navy/[0.05] mb-8" />
             <h3 className="text-2xl font-serif italic text-brand-navy tracking-widest relative">Pipeline Null</h3>
             <p className="text-[10px] text-brand-navy/20 uppercase tracking-[0.4em] font-bold mt-4 relative">No logs detected in the current transaction stream</p>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-10 py-8 bg-brand-background border-t border-brand-navy/5 flex items-center justify-between">
             <p className="text-[9px] font-bold uppercase tracking-widest text-brand-navy/30 italic">Showing {from + 1} - {Math.min(to + 1, count || 0)} of {count} entries</p>
             <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                   <Link
                      key={p}
                      href={`/admin/orders?page=${p}&q=${query}&status=${status}&from=${fromDate}&to=${toDate}`}
                      className={cn(
                         "w-10 h-10 flex items-center justify-center text-[10px] font-black border transition-all",
                         page === p 
                           ? "bg-brand-navy text-white border-brand-navy shadow-lg" 
                           : "bg-white text-brand-navy border-brand-navy/5 hover:border-brand-navy"
                      )}
                   >
                      {p}
                   </Link>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
