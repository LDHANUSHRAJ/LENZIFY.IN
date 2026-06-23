"use client";

import { useEffect, useState } from "react";
import { CheckCircle, X } from "lucide-react";

export default function SuccessToast() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("updated") === "true" || params.get("success") === "true") {
      setShow(true);
      // Hide after 5 seconds
      const timer = setTimeout(() => setShow(false), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed top-8 right-8 z-[100] animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="bg-brand-navy text-white px-8 py-6 shadow-2xl flex items-center gap-6 border-l-4 border-secondary">
        <CheckCircle className="text-secondary" size={24} />
        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-[0.3em]">Protocol Success</h4>
          <p className="text-[9px] text-white/60 uppercase tracking-widest mt-1">Product data synchronized with the matrix.</p>
        </div>
        <button onClick={() => setShow(false)} className="ml-4 text-white/40 hover:text-white transition-colors">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
