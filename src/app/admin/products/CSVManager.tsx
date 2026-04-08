"use client";

import { useState } from "react";
import { Download, Upload, RefreshCw, CheckCircle2, AlertTriangle, FileSpreadsheet } from "lucide-react";
import { exportProducts, importProducts } from "./actions";
import { cn } from "@/lib/utils";

export default function CSVManager() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleExport = async () => {
    setLoading(true);
    setStatus(null);
    const result = await exportProducts();
    if (result.success && result.csv) {
      const blob = new Blob([result.csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', `lenzify_catalog_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setStatus({ type: 'success', message: 'Catalog exported successfully.' });
    } else {
      setStatus({ type: 'error', message: result.error || 'Export failed.' });
    }
    setLoading(false);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setStatus(null);
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      const result = await importProducts(content);
      if (result.success) {
        setStatus({ type: 'success', message: 'Catalog updated via CSV import.' });
        window.location.reload();
      } else {
        setStatus({ type: 'error', message: result.error || 'Import failed.' });
      }
      setLoading(false);
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-[#000000] text-white p-8 lg:p-10 relative overflow-hidden group shadow-2xl">
      <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/5 blur-3xl group-hover:bg-secondary/10 transition-all duration-1000"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
             <FileSpreadsheet size={20} className="text-secondary" />
             <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-secondary">Data Synchronization</h3>
          </div>
          <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-bold italic">Persistence protocol v4.0.21</p>
        </div>

        <div className="flex flex-wrap items-center gap-6">
           {status && (
              <div className={cn(
                "flex items-center gap-3 px-6 py-3 border text-[9px] font-bold uppercase tracking-widest",
                status.type === 'success' ? "border-secondary/20 bg-secondary/5 text-secondary" : "border-red-500/20 bg-red-500/5 text-red-500"
              )}>
                 {status.type === 'success' ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                 {status.message}
              </div>
           )}

           <button 
             onClick={handleExport}
             disabled={loading}
             className="bg-brand-navy text-white px-8 py-4 text-[9px] font-bold uppercase tracking-[0.3em] flex items-center gap-4 hover:bg-secondary transition-all shadow-xl group border border-white/5 disabled:opacity-50"
             suppressHydrationWarning
           >
             {loading ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} className="group-hover:-translate-y-1 transition-transform" />}
             Export Matrix
           </button>

           <label className="bg-white/5 text-white px-8 py-4 text-[9px] font-bold uppercase tracking-[0.3em] flex items-center gap-4 hover:bg-white hover:text-brand-navy transition-all shadow-xl group border border-white/10 cursor-pointer disabled:opacity-50">
             {loading ? <RefreshCw size={14} className="animate-spin" /> : <Upload size={14} className="group-hover:translate-y-1 transition-transform" />}
             Synchronize CSV
             <input type="file" accept=".csv" onChange={handleImport} className="hidden" disabled={loading} suppressHydrationWarning />
           </label>
        </div>
      </div>
      
      <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
         <p className="text-[8px] text-white/20 uppercase font-black tracking-widest italic tracking-[0.4em]">AUTHORIZED ACCESS ONLY // CRYPTO_LOCKED</p>
         <div className="flex gap-2">
            {[1,2,3,4,5,6].map(i => <div key={i} className="w-1 h-1 bg-secondary/20 rounded-full" />)}
         </div>
      </div>
    </div>
  );
}
