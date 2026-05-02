"use client";

import { updateCoating } from "../../actions";
import { ArrowLeft, Save, Shield, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export default function EditCoatingPage() {
  const params = useParams();
  const id = params.id as string;
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  
  const [coating, setCoating] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isActive, setIsActive] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function fetchCoating() {
      const { data, error } = await supabase.from("lens_coatings").select("*").eq("id", id).single();
      if (data) {
        setCoating(data);
        setIsActive(data.is_active);
      }
      setLoading(false);
    }
    fetchCoating();
  }, [id, supabase]);

  const updateAction = updateCoating.bind(null, id);

  if (loading) return (
    <div className="py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-[10px] font-black uppercase tracking-widest text-brand-navy">Initializing Protocol...</p>
    </div>
  );

  if (!coating) return (
    <div className="py-20 text-center">
       <h2 className="text-2xl font-serif italic text-brand-navy">Coating Not Found</h2>
       <Link href="/admin/coatings" className="text-secondary uppercase text-[10px] font-bold tracking-widest mt-4 inline-block">Return to Matrix</Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header className="flex items-center justify-between border-b border-brand-navy/5 pb-10">
        <div className="space-y-4">
           <Link href="/admin/coatings" className="inline-flex items-center gap-2 text-[10px] font-bold text-brand-navy/30 hover:text-secondary transition-colors uppercase tracking-widest">
              <ArrowLeft size={12} /> Back to Matrix
           </Link>
           <h1 className="text-4xl font-serif italic text-brand-navy tracking-tight uppercase">Modify <span className="text-secondary">Coating</span></h1>
        </div>
      </header>

      {error && (
        <div className="bg-red-50 border border-red-200 p-6 flex items-start gap-4">
           <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
           <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-red-600">Sync Error Detected</p>
              <p className="text-xs text-red-500 mt-1">{error}</p>
           </div>
        </div>
      )}

      <form action={updateAction} className="bg-white border border-brand-navy/5 p-12 shadow-sm space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Coating Designation</label>
            <input 
              name="name"
              required
              defaultValue={coating.name}
              placeholder="e.g. ULTRA VIOLET SHIELD"
              className="w-full bg-brand-background border border-brand-navy/5 px-6 py-4 text-[11px] font-bold uppercase tracking-widest outline-none focus:border-secondary transition-all"
            />
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Monetary Value (₹)</label>
            <input 
              name="price"
              type="number"
              required
              defaultValue={coating.price}
              placeholder="0.00"
              className="w-full bg-brand-background border border-brand-navy/5 px-6 py-4 text-[11px] font-bold uppercase tracking-widest outline-none focus:border-secondary transition-all"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Technical Overview</label>
          <textarea 
            name="description"
            rows={4}
            defaultValue={coating.description}
            placeholder="DEFINE CAPABILITIES..."
            className="w-full bg-brand-background border border-brand-navy/5 px-6 py-4 text-[11px] font-bold uppercase tracking-[0.1em] outline-none focus:border-secondary transition-all resize-none"
          />
        </div>

        <div className="pt-10 border-t border-brand-navy/5 flex items-center justify-between">
           <div className="flex items-center gap-6">
              <input type="hidden" name="is_active" value={isActive ? "true" : "false"} />
              <button 
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={cn(
                    "flex items-center gap-3 px-6 py-3 border text-[10px] font-black uppercase tracking-widest transition-all",
                    isActive ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-red-50 border-red-100 text-red-600"
                )}
              >
                  {isActive ? <><CheckCircle2 size={14} /> Operational</> : <><XCircle size={14} /> Offline</>}
              </button>
           </div>
           
           <button 
             type="submit"
             className="bg-brand-navy text-white px-12 py-5 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-4 hover:bg-secondary hover:text-brand-navy transition-all shadow-xl active:scale-95"
           >
             <Save size={16} />
             Commit Data
           </button>
        </div>
      </form>
    </div>
  );
}
