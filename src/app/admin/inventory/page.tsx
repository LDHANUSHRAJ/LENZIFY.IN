import { createClient } from "@/lib/supabase/server";
import { Search, Package, AlertTriangle, Filter, Edit2, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { updateStock } from "./actions";
import { cn } from "@/lib/utils";

export default async function AdminInventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const params = await searchParams;
  const query = params?.q || "";
  const filterStatus = params?.status || "all";
  const supabase = await createClient();

  let dbQuery = supabase
    .from("products")
    .select("*, categories(name)")
    .order("name");

  if (query) {
    dbQuery = dbQuery.or(`name.ilike.%${query}%,sku.ilike.%${query}%`);
  }

  const { data: products, error } = await dbQuery;

  // Manual filtering for status since we compute logic in JS or complex query
  let inventory = products || [];
  if (filterStatus === "low") {
    inventory = inventory.filter(p => p.stock > 0 && p.stock <= 5);
  } else if (filterStatus === "out") {
    inventory = inventory.filter(p => p.stock === 0);
  }

  const outOfStockCount = (products || []).filter(p => p.stock === 0).length;
  const lowStockCount = (products || []).filter(p => p.stock > 0 && p.stock <= 5).length;

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-10 border-b border-brand-navy/5">
        <div>
           <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary italic mb-2">Logistics Control</p>
          <h1 className="text-4xl font-serif italic text-brand-navy tracking-tight uppercase">Inventory <span className="text-secondary">Matrix</span></h1>
          <div className="flex gap-4 mt-4">
             <span className="text-[9px] uppercase font-bold tracking-[0.3em] bg-red-50 text-red-600 px-3 py-1">Depleted: {outOfStockCount}</span>
             <span className="text-[9px] uppercase font-bold tracking-[0.3em] bg-amber-50 text-amber-600 px-3 py-1">Critical: {lowStockCount}</span>
          </div>
        </div>
      </header>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between bg-white border border-brand-navy/5 p-8 shadow-sm">
        <form className="relative w-full lg:w-[500px] group">
          <Search size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-navy/30 group-focus-within:text-secondary transition-colors" />
          <input 
            name="q"
            defaultValue={query}
            placeholder="SCAN SKU OR MODEL NAME..."
            className="w-full bg-brand-background border border-brand-navy/5 pl-16 pr-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] outline-none focus:border-secondary transition-all"
          />
        </form>
      </div>

      {/* Control Filters */}
      <div className="flex flex-wrap gap-4">
         <a href="?status=all" className={cn("px-6 py-3 text-[9px] font-bold uppercase tracking-widest transition-all", filterStatus === "all" ? "bg-brand-navy text-white" : "bg-white text-brand-navy/50 border border-brand-navy/5 hover:border-brand-navy/20")}>Global View</a>
         <a href="?status=low" className={cn("px-6 py-3 text-[9px] font-bold uppercase tracking-widest transition-all flex items-center gap-2", filterStatus === "low" ? "bg-amber-500 text-white" : "bg-white text-amber-500 border border-brand-navy/5 hover:border-amber-200")}><AlertTriangle size={12}/> Critical Levels</a>
         <a href="?status=out" className={cn("px-6 py-3 text-[9px] font-bold uppercase tracking-widest transition-all flex items-center gap-2", filterStatus === "out" ? "bg-red-500 text-white" : "bg-white text-red-500 border border-brand-navy/5 hover:border-red-200")}><Package size={12}/> Depleted Models</a>
      </div>

      {/* Inventory List */}
      <div className="bg-white border border-brand-navy/5 shadow-sm">
         <div className="grid grid-cols-12 gap-4 p-6 border-b border-brand-navy/5 bg-brand-background/50 hidden lg:grid">
            <div className="col-span-4 text-[9px] font-black uppercase tracking-widest text-brand-navy/30">Model Registry</div>
            <div className="col-span-3 text-[9px] font-black uppercase tracking-widest text-brand-navy/30">SKU</div>
            <div className="col-span-2 text-[9px] font-black uppercase tracking-widest text-brand-navy/30">Status</div>
            <div className="col-span-3 text-[9px] font-black uppercase tracking-widest text-brand-navy/30 text-right">In-Stock Calibrator</div>
         </div>
         <div className="divide-y divide-brand-navy/5">
            {inventory.map((item) => (
               <div key={item.id} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 p-6 items-center hover:bg-brand-background transition-colors group">
                  <div className="lg:col-span-4 flex items-center gap-4">
                     <div className="w-12 h-12 relative bg-brand-background shrink-0 border border-brand-navy/5">
                        <Image src={item.primary_image || "/placeholder.jpg"} alt={item.name} fill className="object-cover" />
                     </div>
                     <div>
                        <p className="text-sm font-serif italic text-brand-navy font-bold">{item.name}</p>
                        <p className="text-[8px] text-brand-navy/40 uppercase tracking-[0.2em] font-bold mt-1">{item.categories?.name}</p>
                     </div>
                  </div>
                  <div className="lg:col-span-3 font-mono text-[10px] tracking-widest text-brand-navy/60">{item.sku || "NO-SKU"}</div>
                  <div className="lg:col-span-2">
                     {item.stock === 0 ? (
                        <span className="text-[8px] font-black uppercase tracking-widest bg-red-50 text-red-600 px-3 py-1 flex items-center gap-2 w-fit"><AlertTriangle size={10} /> Depleted</span>
                     ) : item.stock <= 5 ? (
                        <span className="text-[8px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 px-3 py-1 flex items-center gap-2 w-fit"><AlertTriangle size={10} /> {item.stock} Left - Critical</span>
                     ) : (
                        <span className="text-[8px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 px-3 py-1 flex items-center gap-2 w-fit"><CheckCircle2 size={10} /> {item.stock} Available</span>
                     )}
                  </div>
                  <div className="lg:col-span-3 flex justify-end">
                     <form action={async (formData) => { "use server"; await updateStock(item.id, parseInt(formData.get("stock") as string)); }} className="flex items-center gap-2">
                        <input 
                           name="stock"
                           type="number" 
                           defaultValue={item.stock} 
                           className="w-20 bg-white border border-brand-navy/10 px-3 py-2 text-center text-[10px] font-bold tracking-widest outline-none focus:border-secondary shadow-inner" 
                        />
                        <button type="submit" className="p-2 bg-brand-navy text-white hover:bg-secondary transition-all" title="Recalibrate">
                           <Edit2 size={14} />
                        </button>
                     </form>
                  </div>
               </div>
            ))}
            
            {inventory.length === 0 && (
               <div className="p-20 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-brand-navy/[0.01] animate-pulse"></div>
                  <Package size={48} className="mx-auto text-brand-navy/5 mb-6" />
                  <h3 className="text-lg font-serif italic text-brand-navy uppercase tracking-widest relative">No Logistical Matches</h3>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
