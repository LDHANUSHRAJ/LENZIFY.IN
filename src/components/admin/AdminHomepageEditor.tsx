"use client";

import { useState, useEffect } from "react";
import { 
  Save, 
  ArrowLeft, 
  Image as ImageIcon, 
  Zap, 
  RefreshCw,
  Layout,
  Layers,
  ChevronRight,
  Type,
  Link as LinkIcon
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { updateHomepageSection } from "@/app/admin/homepage/actions";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminHomepageEditor({ id }: { id?: string }) {
  const [loading, setLoading] = useState(id !== "new");
  const [saving, setSaving] = useState(false);
  const [section, setSection] = useState<any>({
    section_key: "hero",
    content: {
      title: "",
      subtitle: "",
      image_url: "",
      button_text: "Shop Collection",
      button_link: "/products"
    },
    is_active: true
  });

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    if (id && id !== "new") {
      fetchSection();
    }
  }, [id]);

  async function fetchSection() {
    setLoading(true);
    const { data } = await supabase.from("homepage_config").select("*").eq("id", id).single();
    if (data) setSection(data);
    setLoading(false);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const { success, error } = await updateHomepageSection(
        section.section_key, 
        section.content, 
        section.is_active
    );

    if (success) {
        router.push("/admin/homepage");
        router.refresh();
    } else {
        alert("Persistence error: " + error);
    }
    setSaving(false);
  };

  const updateContent = (field: string, value: any) => {
    setSection((prev: any) => ({
      ...prev,
      content: { ...prev.content, [field]: value }
    }));
  };

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
       <RefreshCw className="animate-spin text-secondary" size={32} />
    </div>
  );

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-brand-navy/5 pb-10">
        <div>
           <Link href="/admin/homepage" className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-navy/30 hover:text-secondary mb-6 flex items-center gap-2 group transition-all">
              <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
              Return to Matrix
           </Link>
           <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary italic mb-2">Protocol Override</p>
           <h1 className="text-4xl font-serif italic text-brand-navy tracking-tight uppercase">
             {id === "new" ? "Orchestrate" : "Modify"} <span className="text-secondary">Section</span>
           </h1>
        </div>
      </header>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
         {/* Main Config */}
         <div className="lg:col-span-8 space-y-12">
            <section className="bg-white border border-brand-navy/5 p-10 lg:p-14 space-y-10 shadow-sm relative overflow-hidden">
               <div className="flex items-center justify-between border-b border-brand-navy/5 pb-6">
                  <div className="flex items-center gap-4">
                     <Layout size={16} className="text-secondary" />
                     <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-navy">Structural Identity</h3>
                  </div>
                  <div className="bg-brand-background px-4 py-2 border border-brand-navy/5 text-[9px] font-black uppercase tracking-widest italic">
                     ID: {id === "new" ? "PENDING" : id}
                  </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-2 group">
                     <label className="text-[9px] font-bold uppercase tracking-widest text-brand-navy/30 italic">Protocol Designation (Key)</label>
                     <select 
                       value={section.section_key}
                       onChange={(e) => setSection({...section, section_key: e.target.value})}
                       className="w-full bg-brand-background border border-brand-navy/10 px-6 py-4 text-[11px] font-medium tracking-wider outline-none focus:border-secondary transition-all"
                     >
                        <option value="hero">Hero Primary</option>
                        <option value="categories">Curated Bento Grid</option>
                        <option value="featured_products">Product Showcase</option>
                        <option value="full_width_banner">Heritage Editorial</option>
                        <option value="minimalist_focus">Minimalist Split</option>
                     </select>
                     <p className="text-[8px] text-brand-navy/20 uppercase font-black tracking-widest italic mt-2">Determines the visual rendering engine</p>
                  </div>
                  <div className="space-y-4 pt-10">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input 
                           type="checkbox" 
                           checked={section.is_active}
                           onChange={(e) => setSection({...section, is_active: e.target.checked})}
                           className="w-5 h-5 accent-secondary"
                        />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-navy group-hover:text-secondary transition-colors italic">Activate Deployment</span>
                      </label>
                  </div>
               </div>
            </section>

            <section className="bg-white border border-brand-navy/5 p-10 lg:p-14 space-y-10 shadow-sm relative overflow-hidden">
               <div className="flex items-center gap-4 mb-2">
                  <ImageIcon size={16} className="text-secondary" />
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-navy">Visual Assets</h3>
               </div>
               
               <div className="space-y-6">
                  <div className="space-y-2 group">
                     <label className="text-[9px] font-bold uppercase tracking-widest text-brand-navy/30 italic">Asset Uplink (Full URL)</label>
                     <div className="flex gap-4">
                        <input 
                           value={section.content?.image_url || ""}
                           onChange={(e) => updateContent("image_url", e.target.value)}
                           placeholder="https://images.unsplash.com/..."
                           className="flex-1 bg-brand-background border border-brand-navy/10 px-6 py-4 text-[11px] font-medium tracking-wider outline-none border-l-4 border-l-secondary focus:border-secondary transition-all"
                        />
                     </div>
                  </div>
                  {section.content?.image_url && (
                    <div className="aspect-video w-full bg-brand-background border border-brand-navy/10 overflow-hidden relative group">
                       <img src={section.content.image_url} alt="Preview" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                       <div className="absolute inset-0 bg-brand-navy/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white italic">Live Feed Status: OK</p>
                       </div>
                    </div>
                  )}
               </div>
            </section>

            <section className="bg-white border border-brand-navy/5 p-10 lg:p-14 space-y-10 shadow-sm relative overflow-hidden">
               <div className="flex items-center gap-4 mb-2">
                  <Type size={16} className="text-secondary" />
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-navy">Verbal Content</h3>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-2 group">
                     <label className="text-[9px] font-bold uppercase tracking-widest text-brand-navy/30 italic">Primary Headline</label>
                     <input 
                       value={section.content?.title || ""}
                       onChange={(e) => updateContent("title", e.target.value)}
                       className="w-full bg-brand-background border border-brand-navy/10 px-6 py-4 text-[11px] font-medium tracking-wider outline-none focus:border-secondary transition-all"
                     />
                  </div>
                  <div className="space-y-2 group">
                     <label className="text-[9px] font-bold uppercase tracking-widest text-brand-navy/30 italic">Protocol Subtext</label>
                     <input 
                       value={section.content?.subtitle || ""}
                       onChange={(e) => updateContent("subtitle", e.target.value)}
                       className="w-full bg-brand-background border border-brand-navy/10 px-6 py-4 text-[11px] font-medium tracking-wider outline-none focus:border-secondary transition-all"
                     />
                  </div>
               </div>
            </section>

            <section className="bg-white border border-brand-navy/5 p-10 lg:p-14 space-y-10 shadow-sm relative overflow-hidden">
               <div className="flex items-center gap-4 mb-2">
                  <LinkIcon size={16} className="text-secondary" />
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-navy">Call to Action</h3>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-2 group">
                     <label className="text-[9px] font-bold uppercase tracking-widest text-brand-navy/30 italic">Action Designation (Label)</label>
                     <input 
                       value={section.content?.button_text || ""}
                       onChange={(e) => updateContent("button_text", e.target.value)}
                       className="w-full bg-brand-background border border-brand-navy/10 px-6 py-4 text-[11px] font-medium tracking-wider outline-none focus:border-secondary transition-all"
                     />
                  </div>
                  <div className="space-y-2 group">
                     <label className="text-[9px] font-bold uppercase tracking-widest text-brand-navy/30 italic">Destination Uplink (Path)</label>
                     <input 
                       value={section.content?.button_link || ""}
                       onChange={(e) => updateContent("button_link", e.target.value)}
                       className="w-full bg-brand-background border border-brand-navy/10 px-6 py-4 text-[11px] font-medium tracking-wider outline-none focus:border-secondary transition-all"
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
                     <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">Authorized Deployment</h3>
                  </div>
                  <p className="text-[8px] text-white/30 uppercase tracking-widest font-bold italic">Persistence protocol v2.8.1</p>
               </div>
               
               <button 
                 type="submit" 
                 disabled={saving}
                 className="w-full bg-brand-navy text-white text-[10px] font-bold uppercase tracking-[0.4em] py-6 shadow-xl hover:bg-secondary transition-all duration-700 flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50"
               >
                  {saving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                  PERSIST CONFIG
               </button>
               
               <p className="text-center text-[7px] text-brand-navy/20 uppercase font-black tracking-widest italic pt-4">Irreversible until next override</p>
            </div>

            <div className="bg-white border border-brand-navy/5 p-10 lg:p-14 space-y-8 shadow-sm">
               <h3 className="text-xl font-serif italic text-brand-navy leading-tight">Visual <br/>Nexus Link</h3>
               <p className="text-[10px] text-brand-navy/40 leading-relaxed uppercase tracking-[0.2em] font-bold italic">
                 This section will be integrated into the primary visual sequence on the storefront.
               </p>
               <div className="p-4 bg-brand-background border-l-4 border-l-secondary space-y-2">
                  <p className="text-[8px] font-black uppercase tracking-widest text-brand-navy/30 italic">Active Render Mode</p>
                  <p className="text-[9px] font-bold text-brand-navy uppercase tracking-widest">{section.section_key} Sequence</p>
               </div>
            </div>
         </div>
      </form>
    </div>
  );
}
