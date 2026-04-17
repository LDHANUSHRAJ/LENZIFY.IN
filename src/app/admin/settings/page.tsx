"use client";

import { useState, useEffect } from "react";
import { 
  Settings, 
  Save, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  RefreshCw
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { updateStoreSettings } from "./actions";
import { cn } from "@/lib/utils";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setLoading(true);
    const { data } = await supabase.from("store_settings").select("*").eq("id", 1).single();
    if (data) setSettings(data);
    setLoading(false);
  }

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    // Convert base_shipping_charge and free_shipping_threshold to numeric
    const payload = {
        ...data,
        base_shipping_charge: parseFloat(data.base_shipping_charge as string),
        free_shipping_threshold: parseFloat(data.free_shipping_threshold as string)
    };

    const { success, error } = await updateStoreSettings(payload);
    if (success) fetchSettings();
    setSaving(false);
  };

  if (loading) return null;

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-brand-navy/5 pb-10">
        <div>
           <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary italic mb-2">Internal Framework</p>
          <h1 className="text-4xl font-serif italic text-brand-navy tracking-tight uppercase">System <span className="text-secondary">Calibration</span></h1>
        </div>
      </header>

      <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
         {/* Core Config */}
         <div className="lg:col-span-8 space-y-12">
            <section className="bg-white border border-brand-navy/5 p-10 lg:p-14 space-y-10 shadow-sm relative overflow-hidden">
               <div className="flex items-center gap-4 mb-2">
                  <Globe size={16} className="text-secondary" />
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-navy">Brand Identity Matrix</h3>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-2 group">
                     <label className="text-[9px] font-bold uppercase tracking-widest text-brand-navy/30 italic">Organization Designation</label>
                     <input 
                       name="store_name"
                       defaultValue={settings?.store_name || ""}
                       className="w-full bg-brand-background border border-brand-navy/10 px-6 py-4 text-[11px] font-medium tracking-wider outline-none focus:border-secondary transition-all"
                     />
                  </div>
                  <div className="space-y-2 group">
                     <label className="text-[9px] font-bold uppercase tracking-widest text-brand-navy/30 italic">Logo Protocol (URL)</label>
                     <input 
                       name="logo_url"
                       defaultValue={settings?.logo_url || ""}
                       className="w-full bg-brand-background border border-brand-navy/10 px-6 py-4 text-[11px] font-medium tracking-wider outline-none focus:border-secondary transition-all"
                     />
                  </div>
                  <div className="space-y-2 group">
                     <label className="text-[9px] font-bold uppercase tracking-widest text-brand-navy/30 italic">Favicon Registry (URL)</label>
                     <input 
                       name="favicon_url"
                       defaultValue={settings?.favicon_url || ""}
                       className="w-full bg-brand-background border border-brand-navy/10 px-6 py-4 text-[11px] font-medium tracking-wider outline-none focus:border-secondary transition-all"
                     />
                  </div>
                  <div className="space-y-2 group">
                     <label className="text-[9px] font-bold uppercase tracking-widest text-brand-navy/30 italic">Primary Core Hex</label>
                     <div className="flex gap-4">
                        <input 
                          name="primary_color"
                          type="color"
                          defaultValue={settings?.primary_color || "#000000"}
                          className="h-14 w-20 bg-brand-background border border-brand-navy/10 p-1 cursor-pointer"
                        />
                        <input 
                          type="text"
                          value={settings?.primary_color || "#000000"}
                          readOnly
                          className="flex-1 bg-brand-background border border-brand-navy/10 px-6 py-4 text-[11px] font-mono tracking-wider outline-none"
                        />
                     </div>
                  </div>
                  <div className="space-y-2 group">
                     <label className="text-[9px] font-bold uppercase tracking-widest text-brand-navy/30 italic">Secondary Accent Hex (Brand)</label>
                     <div className="flex gap-4">
                        <input 
                          name="brand_color"
                          type="color"
                          defaultValue={settings?.brand_color || "#775a19"}
                          className="h-14 w-20 bg-brand-background border border-brand-navy/10 p-1 cursor-pointer"
                        />
                        <input 
                          type="text"
                          value={settings?.brand_color || "#775a19"}
                          readOnly
                          className="flex-1 bg-brand-background border border-brand-navy/10 px-6 py-4 text-[11px] font-mono tracking-wider outline-none"
                        />
                     </div>
                  </div>
               </div>
            </section>

            <section className="bg-white border border-brand-navy/5 p-10 lg:p-14 space-y-10 shadow-sm relative overflow-hidden">
               <div className="flex items-center gap-4 mb-2">
                  <Mail size={16} className="text-secondary" />
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-navy">Comms Channels</h3>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-2 group">
                     <label className="text-[9px] font-bold uppercase tracking-widest text-brand-navy/30 italic">Support Uplink (Email)</label>
                     <input 
                       name="contact_email"
                       defaultValue={settings?.contact_email || ""}
                       className="w-full bg-brand-background border border-brand-navy/10 px-6 py-4 text-[11px] font-medium tracking-wider outline-none focus:border-secondary transition-all"
                     />
                  </div>
                  <div className="space-y-2 group">
                     <label className="text-[9px] font-bold uppercase tracking-widest text-brand-navy/30 italic">Voice Frequency (Phone)</label>
                     <input 
                       name="contact_phone"
                       defaultValue={settings?.contact_phone || ""}
                       className="w-full bg-brand-background border border-brand-navy/10 px-6 py-4 text-[11px] font-medium tracking-wider outline-none focus:border-secondary transition-all"
                     />
                  </div>
               </div>
               <div className="space-y-2 group">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-brand-navy/30 italic">Physical Nexus (Address)</label>
                  <textarea 
                    name="address"
                    defaultValue={settings?.address || ""}
                    rows={3}
                    className="w-full bg-brand-background border border-brand-navy/10 px-6 py-4 text-[11px] font-medium tracking-wider outline-none focus:border-secondary transition-all resize-none italic"
                  />
               </div>
            </section>

            <section className="bg-white border border-brand-navy/5 p-10 lg:p-14 space-y-10 shadow-sm relative overflow-hidden">
               <div className="flex items-center gap-4 mb-2">
                  <ShieldCheck size={16} className="text-secondary" />
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-navy">Economic Defaults</h3>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-2 group">
                     <label className="text-[9px] font-bold uppercase tracking-widest text-brand-navy/30 italic">Base Logistics Charge (₹)</label>
                     <input 
                       name="base_shipping_charge"
                       type="number"
                       defaultValue={settings?.base_shipping_charge || 0}
                       className="w-full bg-brand-background border border-brand-navy/10 px-6 py-4 text-[11px] font-bold tracking-wider outline-none focus:border-secondary transition-all"
                     />
                  </div>
                  <div className="space-y-2 group">
                     <label className="text-[9px] font-bold uppercase tracking-widest text-brand-navy/30 italic">Free Logistics Threshold (₹)</label>
                     <input 
                       name="free_shipping_threshold"
                       type="number"
                       defaultValue={settings?.free_shipping_threshold || 0}
                       className="w-full bg-brand-background border border-brand-navy/10 px-6 py-4 text-[11px] font-bold tracking-wider outline-none focus:border-secondary transition-all"
                     />
                  </div>
               </div>
            </section>
         </div>

         {/* Side Context */}
         <div className="lg:col-span-4 space-y-12">
            <div className="bg-[#000000] text-white p-10 lg:p-14 space-y-10 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 blur-3xl group-hover:bg-secondary/10 transition-all duration-1000"></div>
               <div className="space-y-2 border-b border-white/5 pb-6">
                  <div className="flex items-center gap-4 mb-1">
                     <Zap size={16} className="text-secondary" />
                     <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">Authorized Update</h3>
                  </div>
                  <p className="text-[8px] text-white/30 uppercase tracking-widest font-bold italic">Persistence protocol v1.0.4</p>
               </div>
               
               <button 
                 type="submit" 
                 disabled={saving}
                 className="w-full bg-brand-navy text-white text-[10px] font-bold uppercase tracking-[0.4em] py-6 shadow-xl hover:bg-secondary transition-all duration-700 flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50"
               >
                  {saving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                  PERSIST CONFIG
               </button>
               
               <p className="text-center text-[7px] text-brand-navy/20 uppercase font-black tracking-widest italic pt-4">Requires Superuser Authorization</p>
            </div>

            <div className="bg-white border border-brand-navy/5 p-10 lg:p-14 space-y-8 shadow-sm">
               <h3 className="text-xl font-serif italic text-brand-navy leading-tight">System <br/>Integrity</h3>
               <p className="text-[10px] text-brand-navy/40 leading-relaxed uppercase tracking-[0.2em] font-bold italic">Configuration changes are immediate and reflect across all edge nodes.</p>
               <div className="flex flex-col gap-4">
                  <button type="button" onClick={fetchSettings} className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary hover:text-brand-navy transition-all flex items-center gap-3 group">
                     RELOAD CORE
                     <RefreshCw size={12} className="group-hover:rotate-180 transition-transform duration-700" />
                  </button>
                  {!settings && (
                    <p className="text-[8px] text-red-500 font-bold uppercase tracking-widest animate-pulse mt-2">
                       [!] SYSTEM NOT INITIALIZED
                    </p>
                  )}
               </div>
            </div>
         </div>
      </form>
    </div>
  );
}
