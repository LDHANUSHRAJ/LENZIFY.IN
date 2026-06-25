import { createClient } from "@/lib/supabase/server";
import { Plus, Trash2, Edit, Layout, CheckCircle2, XCircle, Layers, MoveUp, MoveDown } from "lucide-react";
import { toggleSectionStatus, deleteSection, moveSectionUp, moveSectionDown } from "./actions";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function AdminHomepagePage() {
  const supabase = await createClient();

  const { data: sections } = await supabase
    .from("homepage_config")
    .select("*")
    .order("sort_order", { ascending: true });

  const activeCount = sections?.filter(s => s.is_active).length || 0;

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-brand-navy/5 pb-10">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary italic mb-2">Store Front</p>
          <h1 className="text-4xl font-serif italic text-brand-navy tracking-tight uppercase">Homepage <span className="text-secondary">Sections</span></h1>
          <p className="text-[9px] uppercase font-bold tracking-[0.3em] text-brand-text-muted mt-3 italic">{activeCount} active section{activeCount !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/admin/homepage/new"
          className="bg-brand-navy text-white px-10 py-5 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-4 hover:bg-secondary transition-all shadow-xl group border border-transparent active:scale-95"
        >
          <Plus size={16} className="group-hover:rotate-90 transition-transform duration-500" />
          Add Section
        </Link>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {sections?.map((section) => (
          <div key={section.id} className={cn(
            "group bg-white border p-8 flex flex-col lg:flex-row gap-10 transition-all duration-300 shadow-sm relative overflow-hidden",
            section.is_active ? "border-brand-navy/5" : "border-brand-navy/10 opacity-60 bg-brand-background grayscale"
          )}>
            {/* Preview */}
            <div className="lg:w-[360px] aspect-[16/7] relative bg-brand-background border border-brand-navy/5 overflow-hidden shrink-0">
              {section.content?.image_url ? (
                <img
                  src={section.content.image_url}
                  alt={section.section_key}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-brand-navy/10 space-y-3">
                  <Layers size={40} />
                  <p className="text-[8px] font-black uppercase tracking-widest">{section.section_key}</p>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 p-6 flex flex-col justify-end">
                <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-secondary italic">{section.section_key}</p>
                <h4 className="text-lg font-serif italic text-white tracking-tight">{section.content?.title || 'Untitled'}</h4>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col justify-between py-1">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-brand-navy text-white flex items-center justify-center text-[10px] font-black rounded-full shrink-0">
                      {section.sort_order}
                    </span>
                    <div>
                      <p className="text-[11px] font-bold text-brand-navy uppercase tracking-widest">{section.section_key.replace(/_/g, ' ')}</p>
                      <p className="text-[9px] text-brand-navy/40 uppercase tracking-[0.15em] font-bold mt-0.5">{section.is_active ? 'Active' : 'Inactive'}</p>
                    </div>
                  </div>
                  <p className="text-[9px] text-brand-navy/40 font-bold uppercase tracking-widest">
                    {Object.keys(section.content || {}).length} content fields
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <form action={async () => { "use server"; await toggleSectionStatus(section.id, section.is_active); }}>
                    <button className={cn(
                      "p-3 transition-all rounded-sm",
                      section.is_active ? "bg-secondary text-white shadow-md" : "bg-brand-background text-brand-navy/20 hover:text-secondary border border-brand-navy/5"
                    )}>
                      {section.is_active ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                    </button>
                  </form>
                  <Link
                    href={`/admin/homepage/${section.id}`}
                    className="p-3 bg-brand-background text-brand-navy/20 hover:text-brand-navy transition-all border border-brand-navy/5"
                  >
                    <Edit size={16} />
                  </Link>
                  <form action={async () => { "use server"; await deleteSection(section.id); }} onSubmit={(e) => { if (!confirm("Delete this section?")) e.preventDefault(); }}>
                    <button className="p-3 bg-brand-background text-brand-navy/20 hover:text-red-500 transition-all border border-brand-navy/5">
                      <Trash2 size={16} />
                    </button>
                  </form>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-brand-navy/5 mt-4">
                <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-brand-navy/30">
                  <Layout size={13} className="text-secondary" />
                  Section order
                </div>
                <div className="flex gap-2">
                  <form action={async () => { "use server"; await moveSectionUp(section.id, section.sort_order); }}>
                    <button className="p-2.5 bg-brand-background hover:bg-white border border-brand-navy/5 text-brand-navy/40 hover:text-secondary transition-all">
                      <MoveUp size={14} />
                    </button>
                  </form>
                  <form action={async () => { "use server"; await moveSectionDown(section.id, section.sort_order); }}>
                    <button className="p-2.5 bg-brand-background hover:bg-white border border-brand-navy/5 text-brand-navy/40 hover:text-secondary transition-all">
                      <MoveDown size={14} />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        ))}

        {(!sections || sections.length === 0) && (
          <div className="py-32 bg-white border border-brand-navy/5 text-center shadow-sm">
            <Layers size={48} className="mx-auto text-brand-navy/[0.05] mb-6" />
            <h3 className="text-2xl font-serif italic text-brand-navy tracking-widest uppercase">No sections yet</h3>
            <p className="text-[10px] text-brand-navy/30 uppercase tracking-[0.3em] font-bold mt-3">Add your first section to customize the homepage</p>
          </div>
        )}
      </div>
    </div>
  );
}
