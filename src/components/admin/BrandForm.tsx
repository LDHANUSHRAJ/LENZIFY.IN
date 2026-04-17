"use client";

import { useState } from "react";
import { X, Save, Shield, Image as ImageIcon } from "lucide-react";
import { createBrand, updateBrand } from "@/app/admin/brands/actions";
import { cn } from "@/lib/utils";

export default function BrandForm({ brand, onClose }: { brand?: any; onClose: () => void }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    if (brand) {
      await updateBrand(brand.id, formData);
    } else {
      await createBrand(formData);
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
               <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary italic mb-2">Entity Registration</p>
               <h2 className="text-3xl font-serif italic text-brand-navy uppercase tracking-tight">
                 {brand ? "Modify" : "Register"} <span className="text-secondary">Brand</span>
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
                    <Shield size={10} className="text-secondary" /> Brand Identity Name
                  </label>
                  <input 
                    name="name" 
                    defaultValue={brand?.name} 
                    required 
                    placeholder="ENTER OFFICIAL BRAND NAME..."
                    className="w-full bg-brand-background border border-brand-navy/5 px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] focus:border-secondary outline-none transition-all placeholder:text-brand-navy/10"
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-brand-navy/40 flex items-center gap-2 italic">
                    <ImageIcon size={10} className="text-secondary" /> Asset Identifier (Logo URL)
                  </label>
                  <input 
                    name="logo_url" 
                    defaultValue={brand?.logo_url} 
                    placeholder="SOURCE LOGO URL (HTTPS)..."
                    className="w-full bg-brand-background border border-brand-navy/5 px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] focus:border-secondary outline-none transition-all placeholder:text-brand-navy/10"
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-brand-navy/40 flex items-center gap-2 italic">
                    Corporate Narrative
                  </label>
                  <textarea 
                    name="description" 
                    defaultValue={brand?.description} 
                    rows={4}
                    placeholder="SPECIFY BRAND MISSION AND CHARACTERISTICS..."
                    className="w-full bg-brand-background border border-brand-navy/5 px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] focus:border-secondary outline-none transition-all placeholder:text-brand-navy/10 min-h-[120px]"
                  />
               </div>

               <div className="flex items-center gap-4 py-4 border-y border-brand-navy/5">
                  <input 
                    id="is_featured" 
                    name="is_featured" 
                    type="checkbox" 
                    defaultChecked={brand?.is_featured}
                    className="w-5 h-5 accent-secondary cursor-pointer"
                  />
                  <label htmlFor="is_featured" className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-navy cursor-pointer italic">
                    Mark as <span className="text-secondary">Premium/Featured</span> Brand
                  </label>
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
                 {loading ? "SYNCHRONIZING..." : "COMMIT TO DATABASE"}
               </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
