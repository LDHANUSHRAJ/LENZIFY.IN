"use client";

import { useState } from "react";
import { Edit, Trash2, Tag, ExternalLink, ShieldCheck } from "lucide-react";
import { deleteBrand } from "@/app/admin/brands/actions";
import BrandForm from "./BrandForm";
import Image from "next/image";

export default function BrandList({ brands }: { brands: any[] }) {
  const [editingBrand, setEditingBrand] = useState<any>(null);

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to terminate this brand registration? This action is irreversible.")) {
      await deleteBrand(id);
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {brands?.map((brand) => (
          <div 
            key={brand.id} 
            className="bg-white border border-brand-navy/5 p-8 group hover:border-secondary transition-all duration-700 relative overflow-hidden"
          >
            {/* Background Polish */}
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
               <Tag size={64} className="text-brand-navy" />
            </div>

            <div className="flex flex-col h-full">
              <div className="flex justify-between items-start mb-8">
                <div className="w-16 h-16 relative bg-brand-background border border-brand-navy/5 p-2 shrink-0">
                  {brand.logo_url ? (
                    <Image src={brand.logo_url} alt={brand.name} fill className="object-contain p-2" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand-navy/10 font-black text-[8px] uppercase tracking-widest text-center">No Assets</div>
                  )}
                </div>
                {brand.is_featured && (
                  <span className="text-[7px] font-black uppercase tracking-[0.3em] bg-secondary text-white px-3 py-1 flex items-center gap-2">
                    <ShieldCheck size={8} /> Premium Entity
                  </span>
                )}
              </div>

              <div className="flex-1">
                <p className="text-[9px] font-black tracking-[0.4em] text-brand-navy/20 uppercase mb-2 italic">Registry ID: {brand.id.slice(0,8)}</p>
                <h3 className="text-xl font-serif italic text-brand-navy font-bold leading-tight">{brand.name}</h3>
                <p className="text-[9px] text-brand-navy/40 mt-4 line-clamp-2 uppercase tracking-widest leading-relaxed">
                  {brand.description || "NO NARRATIVE PROVIDED IN DATABASE"}
                </p>
              </div>

              <div className="flex items-center gap-4 pt-8 mt-8 border-t border-brand-navy/5">
                <button 
                  onClick={() => setEditingBrand(brand)}
                  className="flex-1 flex items-center justify-center gap-3 px-4 py-3 bg-brand-background border border-brand-navy/5 text-[9px] font-bold uppercase tracking-[0.2em] text-brand-navy/60 hover:text-brand-navy hover:bg-white transition-all"
                >
                  <Edit size={12} /> Configure
                </button>
                <button 
                  onClick={() => handleDelete(brand.id)}
                  className="px-4 py-3 text-brand-navy/20 hover:text-red-500 transition-all"
                  title="Terminate"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {(!brands || brands.length === 0) && (
          <div className="md:col-span-2 lg:col-span-3 py-32 text-center bg-white border border-brand-navy/5 shadow-sm relative overflow-hidden">
             <div className="absolute inset-0 bg-brand-navy/[0.01] animate-pulse"></div>
             <Tag size={48} className="mx-auto text-brand-navy/[0.05] mb-6" />
             <h3 className="text-lg font-serif italic text-brand-navy uppercase tracking-widest relative">No Brands Registered</h3>
             <p className="text-[9px] text-brand-navy/20 uppercase tracking-[0.3em] font-bold mt-4 relative italic">Use the Add Brand command to begin registration</p>
          </div>
        )}
      </div>

      {editingBrand && (
        <BrandForm brand={editingBrand} onClose={() => setEditingBrand(null)} />
      )}
    </div>
  );
}
