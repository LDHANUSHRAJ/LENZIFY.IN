import { createClient } from "@/lib/supabase/server";
import { 
  Search, Filter, Eye, Clock, CheckCircle2, Truck, Calendar, User
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function AdminReplacementsPage({
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

  let dbQuery = supabase
    .from("lens_replacement_orders")
    .select("*, users(name, email)", { count: "exact" })
    .order("created_at", { ascending: false });

  if (query) {
    dbQuery = dbQuery.or(`id.ilike.%${query}%`);
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

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data: orders, count } = await dbQuery.range(from, to);
  const totalPages = Math.ceil((count || 0) / pageSize);

  const statusOptions = [
    { value: "all", label: "All Replacements" },
    { value: "pending", label: "Pending Setup" },
    { value: "pickup_scheduled", label: "Pickup Scheduled" },
    { value: "processing", label: "In Lab" },
    { value: "shipped", label: "Dispatched Frame" },
    { value: "delivered", label: "Delivered" }
  ];

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-brand-navy/5 pb-10">
        <div>
           <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary italic mb-2">Service Center</p>
          <h1 className="text-4xl font-serif italic text-brand-navy tracking-tight uppercase">Lens <span className="text-secondary">Replacements</span></h1>
          <p className="text-[9px] uppercase font-bold tracking-[0.3em] text-brand-text-muted mt-3 italic">Active Modules: {count || 0}</p>
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
                 placeholder="SEARCH BY PROTOCOL ID..."
                 className="w-full bg-brand-background border border-brand-navy/5 pl-16 pr-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] outline-none focus:border-secondary transition-all"
                 suppressHydrationWarning
               />
            </form>

            <div className="flex flex-wrap items-center gap-6 w-full lg:w-auto">
               <div className="relative group flex-1 lg:flex-none">
                  <Filter size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-navy/30" />
                  <select 
                    name="status"
                    defaultValue={status}
                    className="appearance-none bg-brand-background border border-brand-navy/10 pl-14 pr-16 py-5 text-[10px] font-bold uppercase tracking-[0.2em] outline-none focus:border-secondary cursor-pointer min-w-[200px]"
                    suppressHydrationWarning
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
                <th className="px-6 py-6 font-bold">Extraction Date</th>
                <th className="px-6 py-6 font-bold">Client Matrix</th>
                <th className="px-6 py-6 font-bold">Frame Profile</th>
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
                       <Calendar size={12} className="text-brand-navy/20" />
                       <span className="text-[10px] font-bold text-brand-navy/60 uppercase tracking-widest">
                          {order.pickup_date ? new Date(order.pickup_date).toLocaleDateString() : 'TBD'}
                       </span>
                    </div>
                  </td>
                   <td className="px-6 py-8">
                    <div className="flex items-center gap-4">
                       <div>
                          <p className="text-xs font-bold text-brand-navy italic uppercase font-serif">{(order.users as any)?.name || 'Generic Client'}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-8">
                     <p className="text-[10px] font-black uppercase tracking-widest text-brand-navy">{order.frame_type}</p>
                     <p className="text-[8px] font-bold uppercase tracking-widest text-brand-navy/40 mt-1">{order.frame_condition}</p>
                  </td>
                  <td className="px-6 py-8">
                     <div className="flex items-center gap-3">
                        <span className={cn(
                          "w-2 h-2 rounded-full",
                          order.status === "delivered" ? "bg-secondary" : 
                          order.status === "shipped" || order.status === "pickup_scheduled" ? "bg-blue-400" :
                          order.status === "processing" ? "bg-indigo-500 animate-pulse" : "bg-brand-navy/20"
                        )} />
                        <span className="text-[9px] uppercase font-black tracking-[0.2em] text-brand-navy italic">{order.status.replace("_", " ")}</span>
                     </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-3">
                       <Link 
                         href={`/admin/replacements/${order.id}`}
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
          <div className="py-20 text-center relative overflow-hidden">
             <h3 className="text-xl font-serif italic text-brand-navy tracking-widest relative">Pipeline Null</h3>
          </div>
        )}
      </div>
    </div>
  );
}
