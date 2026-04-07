import { createClient } from "@/lib/supabase/server";
import { 
  Tag, 
  Plus, 
  Trash2, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  Ticket, 
  Zap,
  TrendingDown,
  ChevronRight
} from "lucide-react";
import { toggleCouponStatus, deleteCoupon } from "./actions";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function AdminOffersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params?.q || "";
  const supabase = await createClient();

  // 1. Fetch Coupons
  let dbQuery = supabase
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });

  if (query) {
    dbQuery = dbQuery.ilike("code", `%${query}%`);
  }

  const { data: coupons, error } = await dbQuery;

  const activeCount = coupons?.filter(c => c.is_active).length || 0;

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-brand-navy/5 pb-10">
        <div>
           <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary italic mb-2">Incentive Protocols</p>
          <h1 className="text-4xl font-serif italic text-brand-navy tracking-tight uppercase">Offer <span className="text-secondary">Matrix</span></h1>
          <p className="text-[9px] uppercase font-bold tracking-[0.3em] text-brand-text-muted mt-3 italic">Active Coupons: {activeCount}</p>
        </div>
        <Link 
          href="/admin/offers/new"
          className="bg-brand-navy text-white px-10 py-5 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-4 hover:bg-secondary transition-all shadow-xl group border border-transparent active:scale-95"
        >
          <Plus size={16} className="group-hover:rotate-90 transition-transform duration-500" />
          Generate Coupon
        </Link>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-white border border-brand-navy/5 p-8 shadow-sm flex items-center gap-6 group hover:border-secondary transition-all">
            <div className="w-12 h-12 bg-secondary text-white flex items-center justify-center rounded-sm">
               <TrendingDown size={20} />
            </div>
            <div>
               <p className="text-[9px] text-brand-navy/30 uppercase font-black tracking-widest italic">Retention Protocol</p>
               <p className="text-xl font-serif font-black italic text-brand-navy">Active Engagement</p>
            </div>
         </div>
         <div className="bg-white border border-brand-navy/5 p-8 shadow-sm flex items-center gap-6 group hover:border-secondary transition-all">
            <div className="w-12 h-12 bg-brand-navy text-white flex items-center justify-center rounded-sm">
               <Ticket size={20} />
            </div>
            <div>
               <p className="text-[9px] text-brand-navy/30 uppercase font-black tracking-widest italic">Matrix Coverage</p>
               <p className="text-xl font-serif font-black italic text-brand-navy">{coupons?.length || 0} Units Deployed</p>
            </div>
         </div>
         <div className="bg-white border border-brand-navy/5 p-8 shadow-sm flex items-center gap-6 group hover:border-secondary transition-all">
            <div className="w-12 h-12 bg-brand-background text-brand-navy flex items-center justify-center rounded-sm border border-brand-navy/5">
               <Zap size={20} />
            </div>
            <div>
               <p className="text-[9px] text-brand-navy/30 uppercase font-black tracking-widest italic">Efficiency Index</p>
               <p className="text-xl font-serif font-black italic text-brand-navy">Real-time Validated</p>
            </div>
         </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white border border-brand-navy/5 p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
         <form className="relative w-full md:w-[450px] group">
            <Search size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-navy/30 group-focus-within:text-secondary transition-colors" />
            <input 
              name="q"
              defaultValue={query}
              placeholder="SEARCH BY COUPON IDENTITY..."
              className="w-full bg-brand-background border border-brand-navy/5 pl-16 pr-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] outline-none focus:border-secondary transition-all"
            />
         </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {coupons?.map((coupon) => (
          <div key={coupon.id} className="group bg-white border border-brand-navy/5 p-10 transition-all duration-700 hover:border-secondary shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-1000">
               <Ticket size={120} className="text-brand-navy" />
            </div>
            
            <div className="space-y-8">
               <div className="flex justify-between items-start">
                  <div className="space-y-1">
                     <p className="text-[8px] text-brand-navy/30 uppercase font-black tracking-widest italic">System Access Code</p>
                     <h3 className="text-2xl font-serif italic font-black text-brand-navy tracking-tight group-hover:text-secondary transition-colors">{coupon.code}</h3>
                  </div>
                  <form action={async () => { "use server"; await toggleCouponStatus(coupon.id, coupon.is_active); }}>
                    <button 
                      className={cn(
                         "p-2 rounded-full ring-4 transition-all duration-500",
                         coupon.is_active ? "ring-secondary/5 bg-secondary/10 text-secondary" : "ring-brand-navy/5 bg-brand-background text-brand-navy/20"
                      )}
                    >
                       {coupon.is_active ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                    </button>
                  </form>
               </div>
               
               <div className="bg-brand-background p-6 border border-brand-navy/5 space-y-4">
                  <div className="flex justify-between items-end">
                     <div>
                        <p className="text-[8px] text-brand-navy/30 uppercase font-black tracking-widest italic">Reduction Module</p>
                        <p className="text-xl font-serif font-black italic text-brand-navy">{coupon.discount_type === 'flat' ? `₹${coupon.discount_value}` : `${coupon.discount_value}%`}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-[8px] text-brand-navy/30 uppercase font-black tracking-widest italic">Activation Threshold</p>
                        <p className="text-[10px] font-bold text-brand-navy uppercase tracking-widest">₹{coupon.min_order_value || 0}</p>
                     </div>
                  </div>
                  
                  <div className="pt-4 border-t border-brand-navy/5 flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <Calendar size={12} className="text-brand-navy/20" />
                        <span className="text-[9px] font-bold text-brand-navy/40 uppercase tracking-widest">{coupon.expiry_date ? new Date(coupon.expiry_date).toLocaleDateString() : 'PERPETUAL'}</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <Ticket size={12} className="text-brand-navy/20" />
                        <span className="text-[9px] font-bold text-brand-navy/40 uppercase tracking-widest">{coupon.used_count || 0} / {coupon.usage_limit || '∞'} UNITS</span>
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="flex items-center gap-4 w-full pt-8">
               <Link 
                 href={`/admin/offers/${coupon.id}`}
                 className="flex-1 py-4 bg-brand-navy text-white text-[9px] font-black uppercase tracking-[0.3em] hover:bg-secondary transition-all shadow-xl active:scale-95 text-center flex items-center justify-center gap-2"
               >
                  <span>RECALIBRATE MODULE</span>
                  <ChevronRight size={12} />
               </Link>
               <form action={async () => { "use server"; await deleteCoupon(coupon.id); }} className="shrink-0" onSubmit={(e) => { if(!confirm("Terminate coupon?")) e.preventDefault(); }}>
                 <button 
                    className="p-4 bg-brand-background text-brand-navy/40 hover:text-red-500 hover:bg-red-50 border border-brand-navy/5 transition-all shadow-sm"
                 >
                    <Trash2 size={16} />
                 </button>
               </form>
            </div>
          </div>
        ))}
        
        {(!coupons || coupons.length === 0) && (
          <div className="col-span-full py-40 bg-white border border-brand-navy/5 text-center relative overflow-hidden shadow-sm">
             <div className="absolute inset-0 bg-brand-navy/[0.01] animate-pulse"></div>
             <Tag size={64} className="mx-auto text-brand-navy/[0.05] mb-8" />
             <h3 className="text-2xl font-serif italic text-brand-navy tracking-widest relative lowercase uppercase">Incentive Void</h3>
             <p className="text-[10px] text-brand-navy/20 uppercase tracking-[0.4em] font-bold mt-4 relative">No active protocols detected in current matrix</p>
          </div>
        )}
      </div>
    </div>
  );
}
