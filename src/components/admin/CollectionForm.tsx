"use client";

import { useState } from "react";
import { X, Save, Layers, Image as ImageIcon } from "lucide-react";
import { createCollection, updateCollection } from "@/app/admin/collections/actions";
import { cn } from "@/lib/utils";

export default function CollectionForm({ collection, onClose }: { collection?: any; onClose: () => void }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    if (collection) {
      await updateCollection(collection.id, formData);
    } else {
      await createCollection(formData);
    }
    
    setLoading(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm z-[150] flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-2xl border border-white/10 shadow-2xl relative overflow-hidden group">
        {/* Header Decor */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent group-hover:via-secondary/50 transition-all duration-1000"></div>
        
        <div className="p-8 md:p-12">
          <div className="flex justify-between items-start mb-12">
            <div>
               <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary italic mb-2">Curated Taxonomy</p>
               <h2 className="text-3xl font-serif italic text-brand-navy uppercase tracking-tight">
                 {collection ? "Modify" : "Assemble"} <span className="text-secondary">Collection</span>
               </h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-brand-background transition-colors text-brand-navy/20 hover:text-brand-navy">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 gap-8">
               <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-brand-navy/40 flex items-center gap-2 italic">
                    <Layers size={10} className="text-secondary" /> Collection Designation
                  </label>
                  <input 
                    name="name" 
                    defaultValue={collection?.name} 
                    required 
                    placeholder="E.G., SUMMER NOIR, TRENDING 2026..."
                    className="w-full bg-brand-background border border-brand-navy/5 px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] focus:border-secondary outline-none transition-all placeholder:text-brand-navy/10"
                  />
               </div>

               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                     <label className="text-[9px] font-black uppercase tracking-[0.3em] text-brand-navy/40 flex items-center gap-2 italic">
                       Classification
                     </label>
                     <select 
                       name="type" 
                       defaultValue={collection?.type || "standard"}
                       className="w-full appearance-none bg-brand-background border border-brand-navy/5 px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] focus:border-secondary outline-none transition-all cursor-pointer"
                     >
                        <option value="standard">STANDARD</option>
                        <option value="trending">TRENDING</option>
                        <option value="seasonal">SEASONAL</option>
                        <option value="limited">LIMITED EDITION</option>
                        <option value="essential">ESSENTIALS</option>
                     </select>
                  </div>

                  <div className="space-y-2 text-right flex flex-col justify-end">
                     <p className="text-[8px] font-bold uppercase tracking-widest text-emerald-500 italic">SYSTEM VALIDATED</p>
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-brand-navy/40 flex items-center gap-2 italic">
                    <ImageIcon size={10} className="text-secondary" /> Visual Asset (Banner URL)
                  </label>
                  <input 
                    name="banner_url" 
                    defaultValue={collection?.banner_url} 
                    placeholder="SOURCE BANNER URL (HTTPS)..."
                    className="w-full bg-brand-background border border-brand-navy/5 px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] focus:border-secondary outline-none transition-all placeholder:text-brand-navy/10"
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-brand-navy/40 flex items-center gap-2 italic">
                    Thematic Description
                  </label>
                  <textarea 
                    name="description" 
                    defaultValue={collection?.description} 
                    rows={4}
                    placeholder="DESCRIBE THE AESTHETIC AND PURPOSE..."
                    className="w-full bg-brand-background border border-brand-navy/5 px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] focus:border-secondary outline-none transition-all placeholder:text-brand-navy/10 min-h-[120px]"
                  />
               </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
               <button 
                 type="button" 
                 onClick={onClose}
                 className="px-10 py-5 text-[9px] font-bold uppercase tracking-[0.3em] text-brand-navy/40 hover:text-brand-navy transition-all"
               >
                 Abort Session
               </button>
               <button 
                 type="submit" 
                 disabled={loading}
                 className="bg-brand-navy text-white px-12 py-5 text-[9px] font-bold uppercase tracking-[0.3em] flex items-center gap-4 hover:bg-secondary transition-all shadow-xl group disabled:opacity-50"
               >
                 <Save size={16} className={cn(loading && "animate-spin")} />
                 {loading ? "CONFIGURING..." : "DEPLOY COLLECTION"}
               </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
