"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Shield, Search, CheckCircle2, XCircle } from "lucide-react";
import { deleteCoating, toggleCoatingStatus } from "./actions";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AdminCoatingsPage() {
  const [coatings, setCoatings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const supabase = createClient();

  useEffect(() => {
    fetchCoatings();
  }, []);

  async function fetchCoatings() {
    setLoading(true);
    const { data, error } = await supabase.from("lens_coatings").select("*").order("name");
    if (data) setCoatings(data);
    setLoading(false);
  }

  const filteredCoatings = coatings.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-brand-navy/5 pb-10">
        <div>
           <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary italic mb-2">Enhancment matrix</p>
          <h1 className="text-4xl font-serif italic text-brand-navy tracking-tight uppercase">Lens <span className="text-secondary">Coatings</span></h1>
          <p className="text-[9px] uppercase font-bold tracking-[0.3em] text-brand-text-muted mt-3 italic">Active Modules: {coatings.length}</p>
        </div>
        <Link 
          href="/admin/coatings/new"
          className="bg-brand-navy text-white px-10 py-5 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-4 hover:bg-secondary hover:text-brand-navy transition-all shadow-xl group border border-transparent active:scale-95"
        >
          <Plus size={16} className="group-hover:rotate-90 transition-transform duration-500" />
          Register New Coating
        </Link>
      </header>

      {/* Control Bar */}
      <div className="bg-white border border-brand-navy/5 p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="relative w-full md:w-[400px] group">
            <Search size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-navy/30 group-focus-within:text-secondary transition-colors" />
            <input 
              type="text" 
              placeholder="SEARCH COATINGS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-brand-background border border-brand-navy/5 pl-16 pr-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] outline-none focus:border-secondary transition-all"
            />
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCoatings.map((coating) => (
          <div key={coating.id} className="group bg-white border border-brand-navy/5 overflow-hidden transition-all duration-700 hover:border-secondary hover:-translate-y-1 shadow-sm p-8 space-y-6 flex flex-col">
            <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-serif italic text-brand-navy tracking-tight">{coating.name}</h3>
                  <p className="text-[12px] text-brand-navy font-bold tracking-[0.1em] mt-2">₹{coating.price.toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                   <Link href={`/admin/coatings/${coating.id}/edit`} className="p-3 bg-brand-background hover:bg-white border border-brand-navy/5 text-brand-navy/30 hover:text-secondary transition-all"><Edit size={16} /></Link>
                   <button 
                      onClick={async () => { if(confirm("Terminate coating?")) { await deleteCoating(coating.id); fetchCoatings(); } }}
                      className="p-3 bg-brand-background hover:bg-red-50 border border-brand-navy/5 text-brand-navy/30 hover:text-red-500 transition-all"
                   >
                     <Trash2 size={16} />
                   </button>
                </div>
            </div>
            
            <p className="text-xs text-brand-text-muted italic flex-grow">{coating.description}</p>
            
            <div className="pt-6 border-t border-brand-navy/5 flex flex-col gap-4">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                      <button 
                         onClick={async () => { await toggleCoatingStatus(coating.id, coating.is_active); fetchCoatings(); }}
                         className={cn("flex items-center gap-2 px-3 py-1 border transition-all text-[9px] font-bold uppercase tracking-[0.2em] italic", 
                           coating.is_active ? "border-secondary/20 bg-secondary/5 text-secondary hover:bg-red-50 hover:text-red-500" : "border-brand-navy/20 text-brand-navy/30 hover:bg-emerald-50 hover:text-emerald-600"
                         )}
                      >
                         {coating.is_active ? <><CheckCircle2 size={12} /> Operational</> : <><XCircle size={12} /> Deactivated</>}
                      </button>
                  </div>
               </div>
            </div>
          </div>
        ))}
        
        {filteredCoatings.length === 0 && !loading && (
          <div className="col-span-full py-40 bg-white border border-brand-navy/5 text-center relative overflow-hidden shadow-sm">
             <div className="absolute inset-0 bg-brand-navy/[0.01] animate-pulse"></div>
             <Shield size={64} className="mx-auto text-brand-navy/[0.05] mb-8" />
             <h3 className="text-2xl font-serif italic text-brand-navy tracking-widest relative">Nexus Void</h3>
             <p className="text-[10px] text-brand-navy/20 uppercase tracking-[0.4em] font-bold mt-4 relative">No coatings detected in current matrix</p>
          </div>
        )}
      </div>
    </div>
  );
}
