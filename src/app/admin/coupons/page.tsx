import { createClient } from "@/lib/supabase/server";
import { Tag, Plus, Target, CalendarDays, KeySquare, Trash2 } from "lucide-react";
import { createCoupon, deleteCoupon } from "./actions";

export default async function AdminCouponsPage() {
  const supabase = await createClient();
  const { data: coupons, error } = await supabase.from("coupons").select("*").order("id", { ascending: false });

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-10 border-b border-brand-navy/5">
        <div>
           <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary italic mb-2">Discount Engines</p>
          <h1 className="text-4xl font-serif italic text-brand-navy tracking-tight uppercase">Promotion <span className="text-secondary">Matrix</span></h1>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 border-t pt-10 border-brand-navy/5">
        {/* CREATE COUPON FORM */}
        <div className="xl:col-span-4 max-w-sm w-full space-y-8 self-start sticky top-10">
          <section className="bg-brand-navy p-8 lg:p-10 text-white shadow-xl">
             <div className="flex items-center gap-4 border-b border-white/10 pb-6 mb-8">
                <KeySquare size={16} className="text-secondary" />
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">New Key</h3>
             </div>
             
             <form action={createCoupon} className="space-y-8">
                <div className="space-y-2 group">
                   <label className="text-[9px] font-bold uppercase tracking-widest text-white/50 italic">Coupon Alias</label>
                   <input required name="code" placeholder="WINTER20" className="w-full bg-white/5 border border-white/10 px-4 py-3 text-[11px] font-bold tracking-widest outline-none focus:border-secondary transition-all uppercase placeholder:text-white/20" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2 group">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-white/50 italic">Type</label>
                      <select name="discount_type" className="w-full bg-brand-navy border border-white/10 px-4 py-3 text-[11px] font-bold tracking-widest outline-none focus:border-secondary transition-all appearance-none cursor-pointer">
                         <option value="percentage">Percent (%)</option>
                         <option value="flat">Flat (₹)</option>
                      </select>
                   </div>
                   <div className="space-y-2 group">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-white/50 italic">Value</label>
                      <input required name="discount_value" type="number" step="0.01" placeholder="20" className="w-full bg-white/5 border border-white/10 px-4 py-3 text-[11px] font-bold tracking-widest outline-none focus:border-secondary transition-all placeholder:text-white/20" />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2 group">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-white/50 italic">Min Total</label>
                      <input name="min_order" type="number" defaultValue="0" className="w-full bg-white/5 border border-white/10 px-4 py-3 text-[11px] font-bold tracking-widest outline-none focus:border-secondary transition-all placeholder:text-white/20" />
                   </div>
                   <div className="space-y-2 group">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-white/50 italic">Usage Max</label>
                      <input name="usage_limit" type="number" defaultValue="100" className="w-full bg-white/5 border border-white/10 px-4 py-3 text-[11px] font-bold tracking-widest outline-none focus:border-secondary transition-all placeholder:text-white/20" />
                   </div>
                </div>

                <div className="space-y-2 group">
                   <label className="text-[9px] font-bold uppercase tracking-widest text-white/50 italic">Expiration Date</label>
                   <input required name="expiry" type="date" className="w-full bg-white/5 border border-white/10 px-4 py-3 text-[11px] font-bold tracking-widest outline-none focus:border-secondary transition-all placeholder:text-white/20 [color-scheme:dark]" />
                </div>

                <button type="submit" className="w-full bg-secondary text-brand-navy hover:bg-white text-[10px] font-bold uppercase tracking-[0.4em] py-5 shadow-xl transition-all duration-500 mt-4 flex items-center justify-center gap-3">
                  <Plus size={14} /> Instantiate
                </button>
             </form>
          </section>
        </div>

        {/* Existing Coupons */}
        <div className="xl:col-span-8 flex flex-col gap-6">
           {coupons?.map((c) => {
             const isExpired = c.expiry && new Date(c.expiry) < new Date();
             return (
               <div key={c.id} className="bg-white border border-brand-navy/5 shadow-sm p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 group hover:border-secondary transition-all">
                  <div className="flex items-center gap-6 w-full md:w-auto">
                     <div className="w-16 h-16 bg-brand-background flex items-center justify-center border border-brand-navy/5 shrink-0">
                        <Tag size={20} className={isExpired ? "text-red-300" : "text-brand-navy/30"} />
                     </div>
                     <div>
                        <h3 className="text-xl font-bold tracking-[0.2em] uppercase text-brand-navy">{c.code}</h3>
                        <p className="text-[10px] text-brand-navy/40 uppercase font-black tracking-widest mt-1">
                          {c.discount_type === 'percentage' ? `${c.discount_value}% OFF` : `₹${c.discount_value} FLAT`}
                        </p>
                        {isExpired && (
                          <span className="inline-block mt-2 text-[8px] bg-red-50 text-red-600 px-2 py-1 uppercase tracking-widest font-black">Expired Engine</span>
                        )}
                     </div>
                  </div>

                  <div className="flex items-center gap-10 w-full md:w-auto px-6 py-4 md:py-0 border-y md:border-y-0 md:border-l border-brand-navy/5">
                     <div className="space-y-2">
                        <p className="text-[8px] text-brand-navy/30 uppercase font-bold tracking-[0.3em] flex items-center gap-1"><Target size={10}/> Boundary</p>
                        <p className="text-[11px] font-mono text-brand-navy font-bold">MIN: ₹{c.min_order}</p>
                     </div>
                     <div className="space-y-2">
                        <p className="text-[8px] text-brand-navy/30 uppercase font-bold tracking-[0.3em] flex items-center gap-1"><CalendarDays size={10}/> Limit</p>
                        <p className="text-[11px] font-mono text-brand-navy font-bold">{c.usage_limit} TOTAL</p>
                     </div>
                  </div>

                  <div className="shrink-0 flex gap-2">
                     <form action={async () => { "use server"; await deleteCoupon(c.id); }}>
                        <button className="p-4 bg-brand-background hover:bg-red-50 border border-transparent hover:border-red-100 text-brand-navy/30 hover:text-red-500 transition-all shadow-sm">
                           <Trash2 size={16} />
                        </button>
                     </form>
                  </div>
               </div>
             );
           })}
           
           {coupons?.length === 0 && (
             <div className="py-32 text-center bg-white border border-brand-navy/5 shadow-sm">
                 <Tag size={48} className="mx-auto text-brand-navy/[0.05] mb-6" />
                 <h3 className="text-xl font-serif italic text-brand-navy uppercase tracking-widest">No Active Promotions</h3>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
