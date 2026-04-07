import { createClient } from "@/lib/supabase/server";
import { 
  Plus, 
  Trash2, 
  Edit, 
  Layout, 
  CheckCircle2, 
  XCircle, 
  Image as ImageIcon, 
  MoveUp, 
  MoveDown, 
  Layers, 
  Zap,
  ChevronRight
} from "lucide-react";
import { toggleSectionStatus, deleteSection } from "./actions";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default async function AdminHomepagePage() {
  const supabase = await createClient();

  // Fetch Homepage Sections
  const { data: sections } = await supabase
    .from("homepage_config")
    .select("*")
    .order("sort_order", { ascending: true });

  const activeCount = sections?.filter(s => s.is_active).length || 0;

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-brand-navy/5 pb-10">
        <div>
           <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary italic mb-2">Visual Orchestration</p>
          <h1 className="text-4xl font-serif italic text-brand-navy tracking-tight uppercase">Homepage <span className="text-secondary">Matrix</span></h1>
          <p className="text-[9px] uppercase font-bold tracking-[0.3em] text-brand-text-muted mt-3 italic">Active Deployments: {activeCount}</p>
        </div>
        <Link 
          href="/admin/homepage/new"
          className="bg-brand-navy text-white px-10 py-5 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-4 hover:bg-secondary transition-all shadow-xl group border border-transparent active:scale-95"
        >
          <Plus size={16} className="group-hover:rotate-90 transition-transform duration-500" />
          Deploy New Section
        </Link>
      </header>

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 gap-12">
        {sections?.map((section, i) => (
          <div key={section.id} className={cn(
             "group bg-white border p-8 flex flex-col lg:flex-row gap-12 transition-all duration-1000 shadow-sm relative overflow-hidden",
             section.is_active ? "border-brand-navy/5" : "border-brand-navy/20 opacity-60 bg-brand-background grayscale"
          )}>
             {/* Section Preview Node */}
             <div className="lg:w-[400px] aspect-[16/7] relative bg-brand-background border border-brand-navy/5 overflow-hidden ring-1 ring-brand-navy/5">
                {section.content?.image_url ? (
                  <img 
                    src={section.content.image_url} 
                    alt={section.section_key} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-brand-navy/10 space-y-4">
                    <Layers size={48} />
                    <p className="text-[8px] font-black uppercase tracking-widest">{section.section_key} Protocol</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 p-8 flex flex-col justify-end">
                   <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-secondary italic">{section.section_key}</p>
                   <h4 className="text-xl font-serif italic text-white tracking-tight">{section.content?.title || 'Protocol Untitled'}</h4>
                </div>
             </div>

             {/* Metadata Node */}
             <div className="flex-1 flex flex-col justify-between py-2">
                <div className="flex justify-between items-start">
                   <div className="space-y-4">
                      <div className="flex items-center gap-4">
                         <span className="w-8 h-8 bg-brand-navy text-white flex items-center justify-center text-[10px] font-black italic rounded-full ring-4 ring-brand-navy/5">
                            {section.sort_order}
                         </span>
                         <div>
                            <p className="text-[10px] font-bold text-brand-navy uppercase tracking-widest">{section.section_key.replace('_', ' ')}</p>
                            <p className="text-[8px] text-brand-navy/30 uppercase tracking-[0.2em] font-black italic mt-1">Status: {section.is_active ? 'Active' : 'Inhibiting'}</p>
                         </div>
                      </div>
                      
                      <div className="flex gap-10 mt-6 lg:mt-0">
                         <div className="space-y-1">
                            <p className="text-[8px] text-brand-navy/20 uppercase font-black tracking-widest italic">Content Analysis</p>
                            <p className="text-[9px] font-bold text-brand-navy/60 uppercase tracking-widest">
                               {Object.keys(section.content || {}).length} Parameters Detected
                            </p>
                         </div>
                      </div>
                   </div>
                   
                   <div className="flex items-center gap-3">
                      <form action={async () => { "use server"; await toggleSectionStatus(section.id, section.is_active); }}>
                        <button 
                          className={cn(
                             "p-4 transition-all rounded-sm",
                             section.is_active ? "bg-secondary text-white shadow-lg" : "bg-brand-background text-brand-navy/20 hover:text-secondary border border-brand-navy/5"
                          )}
                        >
                           {section.is_active ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                        </button>
                      </form>
                      <Link 
                        href={`/admin/homepage/${section.id}`}
                        className="p-4 bg-brand-background text-brand-navy/20 hover:text-brand-navy transition-all border border-brand-navy/5"
                      >
                        <Edit size={16} />
                      </Link>
                      <form action={async () => { "use server"; await deleteSection(section.id); }} onSubmit={(e) => { if(!confirm("Terminate deployment?")) e.preventDefault(); }}>
                        <button 
                          className="p-4 bg-brand-background text-brand-navy/20 hover:text-red-500 transition-all border border-brand-navy/5"
                        >
                           <Trash2 size={16} />
                        </button>
                      </form>
                   </div>
                </div>
                
                <div className="flex items-center justify-between pt-8 border-t border-brand-navy/5">
                   <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-brand-navy/30 italic">
                      <Layout size={14} className="text-secondary" />
                      Sequence Control Module Enabled
                   </div>
                   <div className="flex gap-2">
                      <button className="p-3 bg-brand-background hover:bg-white border border-brand-navy/5 text-brand-navy/40 hover:text-secondary transition-all"><MoveUp size={14} /></button>
                      <button className="p-3 bg-brand-background hover:bg-white border border-brand-navy/5 text-brand-navy/40 hover:text-secondary transition-all"><MoveDown size={14} /></button>
                   </div>
                </div>
             </div>
          </div>
        ))}
        
        {(!sections || sections.length === 0) && (
          <div className="py-40 bg-white border border-brand-navy/5 text-center relative overflow-hidden shadow-sm">
             <div className="absolute inset-0 bg-brand-navy/[0.01] animate-pulse"></div>
             <Layers size={64} className="mx-auto text-brand-navy/[0.05] mb-8" />
             <h3 className="text-2xl font-serif italic text-brand-navy tracking-widest relative uppercase">Visual Nexus Empty</h3>
             <p className="text-[10px] text-brand-navy/20 uppercase tracking-[0.4em] font-bold mt-4 relative">No visual protocols detected in current matrix</p>
          </div>
        )}
      </div>
    </div>
  );
}
