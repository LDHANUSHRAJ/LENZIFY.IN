"use client";

import { Suspense } from "react";
import { createCoating } from "../actions";
import { ArrowLeft, Save, Shield } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function NewCoatingPage() {
  return (
    <Suspense fallback={<div>Loading Matrix...</div>}>
      <NewCoatingContent />
    </Suspense>
  );
}

function NewCoatingContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header className="flex items-center justify-between border-b border-brand-navy/5 pb-10">
        <div className="space-y-4">
           <Link href="/admin/coatings" className="inline-flex items-center gap-2 text-[10px] font-bold text-brand-navy/30 hover:text-secondary transition-colors uppercase tracking-widest">
              <ArrowLeft size={12} /> Back to Matrix
           </Link>
           <h1 className="text-4xl font-serif italic text-brand-navy tracking-tight uppercase">Register <span className="text-secondary">New Coating</span></h1>
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

      <form action={createCoating} className="bg-white border border-brand-navy/5 p-12 shadow-sm space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Coating Designation</label>
            <input 
              name="name"
              required
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
            placeholder="DEFINE CAPABILITIES..."
            className="w-full bg-brand-background border border-brand-navy/5 px-6 py-4 text-[11px] font-bold uppercase tracking-[0.1em] outline-none focus:border-secondary transition-all resize-none"
          />
        </div>

        <div className="pt-10 border-t border-brand-navy/5 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <input 
                type="hidden" 
                name="is_active" 
                value="true" 
              />
              <div className="flex items-center gap-3 bg-secondary/10 px-4 py-2 border border-secondary/20">
                 <Shield size={14} className="text-secondary" />
                 <span className="text-[9px] font-black uppercase tracking-widest text-brand-navy">Auto-Activation Protocol Enabled</span>
              </div>
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
