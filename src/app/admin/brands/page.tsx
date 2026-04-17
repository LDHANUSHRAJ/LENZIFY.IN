import { createClient } from "@/lib/supabase/server";
import { Plus, Tag, Search, ShieldCheck } from "lucide-react";
import BrandList from "@/components/admin/BrandList";
import BrandPageClient from "./BrandPageClient";

export default async function AdminBrandsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params?.q || "";
  const supabase = await createClient();

  let dbQuery = supabase
    .from("brands")
    .select("*")
    .order("name");

  if (query) {
    dbQuery = dbQuery.ilike("name", `%${query}%`);
  }

  const { data: brands, error } = await dbQuery;

  return (
    <div className="space-y-12 pb-24">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-brand-navy/5 pb-10">
        <div>
           <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary italic mb-2">Corporate Hierarchy</p>
          <h1 className="text-4xl md:text-5xl font-serif italic text-brand-navy tracking-tight uppercase">Brand <span className="text-secondary">Nexus</span></h1>
          <p className="text-[9px] uppercase font-bold tracking-[0.3em] text-brand-navy/40 mt-4 italic">Registered Entities: {brands?.length || 0}</p>
        </div>
        
        <BrandPageClient />
      </header>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between bg-white border border-brand-navy/5 p-8 shadow-sm">
        <form className="relative w-full lg:w-[500px] group">
          <Search size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-navy/30 group-focus-within:text-secondary transition-colors" />
          <input 
            name="q"
            defaultValue={query}
            placeholder="FILTER BY BRAND NAME..."
            className="w-full bg-brand-background border border-brand-navy/5 pl-16 pr-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] outline-none focus:border-secondary transition-all"
          />
        </form>
        
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
              <span className="text-[8px] font-bold uppercase tracking-widest text-brand-navy/40 italic">Live Sync Active</span>
           </div>
        </div>
      </div>

      <BrandList brands={brands || []} />
    </div>
  );
}
