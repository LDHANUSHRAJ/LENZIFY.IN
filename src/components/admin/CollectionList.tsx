"use client";

import { useState } from "react";
import { Edit, Trash2, Layers, ExternalLink, Compass } from "lucide-react";
import { deleteCollection } from "@/app/admin/collections/actions";
import CollectionForm from "./CollectionForm";
import Image from "next/image";

export default function CollectionList({ collections }: { collections: any[] }) {
  const [editingCollection, setEditingCollection] = useState<any>(null);

  async function handleDelete(id: string) {
    if (confirm("Terminate this collection ensemble? All thematic groupings will be dissolved.")) {
      await deleteCollection(id);
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {collections?.map((col) => (
          <div 
            key={col.id} 
            className="bg-white border border-brand-navy/5 p-8 group hover:border-secondary transition-all duration-700 relative overflow-hidden flex flex-col h-full"
          >
            {/* Type Indicator */}
            <div className="absolute top-0 left-0 px-4 py-1.5 bg-brand-navy/5 text-[7px] font-black uppercase tracking-[0.3em] text-brand-navy/30 group-hover:bg-secondary group-hover:text-white transition-all">
               {col.type || "STANDARD"}
            </div>

            <div className="flex justify-between items-start mb-10 mt-4">
              <div className="w-full h-40 relative bg-brand-background border border-brand-navy/5 overflow-hidden">
                {col.banner_url ? (
                  <Image src={col.banner_url} alt={col.name} fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brand-navy/10 font-black text-[8px] uppercase tracking-widest italic">NO VISUAL ASSET</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/20 to-transparent"></div>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-1 h-1 rounded-full bg-secondary"></div>
                 <p className="text-[9px] font-black tracking-[0.4em] text-brand-navy/20 uppercase italic">Ref: {col.id.slice(0,8)}</p>
              </div>
              <h3 className="text-xl font-serif italic text-brand-navy font-bold leading-tight uppercase tracking-tight">{col.name}</h3>
              <p className="text-[9px] text-brand-navy/40 mt-4 line-clamp-3 uppercase tracking-widest leading-relaxed italic">
                {col.description || "THEMATIC NARRATIVE PENDING REGISTRATION"}
              </p>
            </div>

            <div className="flex items-center gap-4 pt-8 mt-8 border-t border-brand-navy/5">
              <button 
                onClick={() => setEditingCollection(col)}
                className="flex-1 flex items-center justify-center gap-3 px-4 py-3 bg-brand-background border border-brand-navy/5 text-[9px] font-bold uppercase tracking-[0.2em] text-brand-navy/60 hover:text-brand-navy hover:bg-white transition-all"
              >
                <Edit size={12} /> Modification
              </button>
              <button 
                onClick={() => handleDelete(col.id)}
                className="px-4 py-3 text-brand-navy/20 hover:text-red-500 transition-all"
                title="Dissolve"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        {(!collections || collections.length === 0) && (
          <div className="md:col-span-2 lg:col-span-3 py-32 text-center bg-white border border-brand-navy/5 shadow-sm relative overflow-hidden">
             <div className="absolute inset-0 bg-brand-navy/[0.01] animate-pulse"></div>
             <Layers size={48} className="mx-auto text-brand-navy/[0.05] mb-6" />
             <h3 className="text-lg font-serif italic text-brand-navy uppercase tracking-widest relative">No Curated Collections</h3>
             <p className="text-[9px] text-brand-navy/20 uppercase tracking-[0.3em] font-bold mt-4 relative italic">Initialize your first grouping via the Assembly command</p>
          </div>
        )}
      </div>

      {editingCollection && (
        <CollectionForm collection={editingCollection} onClose={() => setEditingCollection(null)} />
      )}
    </div>
  );
}
