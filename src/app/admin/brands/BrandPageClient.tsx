"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import BrandForm from "@/components/admin/BrandForm";

export default function BrandPageClient() {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <>
      <button 
        onClick={() => setShowAddModal(true)}
        className="bg-brand-navy text-white px-10 py-5 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-4 hover:bg-secondary transition-all shadow-xl group border border-white/10"
      >
        <Plus size={16} className="group-hover:rotate-90 transition-transform duration-500" />
        New Registration
      </button>

      {showAddModal && (
        <BrandForm onClose={() => setShowAddModal(false)} />
      )}
    </>
  );
}
