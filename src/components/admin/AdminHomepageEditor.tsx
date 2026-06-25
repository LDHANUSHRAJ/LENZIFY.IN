"use client";

import { useState, useEffect } from "react";
import { Save, ArrowLeft, Image as ImageIcon, RefreshCw, Layout, Layers, Type, Link as LinkIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { updateHomepageSection } from "@/app/admin/homepage/actions";
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
      alert("Failed to save: " + error);
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
    <div className="space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-brand-navy/5 pb-10">
        <div>
          <Link href="/admin/homepage" className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-navy/30 hover:text-secondary mb-5 flex items-center gap-2 group transition-all">
            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
            Back to Homepage
          </Link>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary italic mb-2">Store Front</p>
          <h1 className="text-4xl font-serif italic text-brand-navy tracking-tight uppercase">
            {id === "new" ? "Add" : "Edit"} <span className="text-secondary">Section</span>
          </h1>
        </div>
      </header>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Config */}
        <div className="lg:col-span-8 space-y-8">

          {/* Section Settings */}
          <section className="bg-white border border-brand-navy/5 p-10 space-y-8 shadow-sm">
            <div className="flex items-center justify-between border-b border-brand-navy/5 pb-5">
              <div className="flex items-center gap-3">
                <Layout size={15} className="text-secondary" />
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-navy">Section Settings</h3>
              </div>
              {id !== "new" && (
                <span className="bg-brand-background px-3 py-1.5 border border-brand-navy/5 text-[9px] font-black uppercase tracking-widest text-brand-navy/30">
                  ID: {id}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-brand-navy/40">Section Type</label>
                <select
                  value={section.section_key}
                  onChange={(e) => setSection({ ...section, section_key: e.target.value })}
                  className="w-full bg-brand-background border border-brand-navy/10 px-5 py-3.5 text-[11px] font-medium tracking-wider outline-none focus:border-secondary transition-all"
                >
                  <option value="hero">Hero Banner</option>
                  <option value="categories">Categories Grid</option>
                  <option value="featured_products">Featured Products</option>
                  <option value="full_width_banner">Full Width Banner</option>
                  <option value="minimalist_focus">Minimalist Focus</option>
                </select>
                <p className="text-[8px] text-brand-navy/30 uppercase font-bold tracking-widest">Determines how this section renders on the homepage</p>
              </div>
              <div className="space-y-4 pt-7">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={section.is_active}
                    onChange={(e) => setSection({ ...section, is_active: e.target.checked })}
                    className="w-5 h-5 accent-secondary"
                  />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-navy group-hover:text-secondary transition-colors">Active — visible on site</span>
                </label>
              </div>
            </div>
          </section>

          {/* Image */}
          <section className="bg-white border border-brand-navy/5 p-10 space-y-6 shadow-sm">
            <div className="flex items-center gap-3 border-b border-brand-navy/5 pb-5">
              <ImageIcon size={15} className="text-secondary" />
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-navy">Image</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-brand-navy/40">Image URL</label>
                <input
                  value={section.content?.image_url || ""}
                  onChange={(e) => updateContent("image_url", e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-brand-background border border-brand-navy/10 px-5 py-3.5 text-[11px] font-medium tracking-wider outline-none border-l-4 border-l-secondary focus:border-secondary transition-all"
                />
              </div>
              {section.content?.image_url && (
                <div className="aspect-video w-full bg-brand-background border border-brand-navy/10 overflow-hidden relative">
                  <img src={section.content.image_url} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </section>

          {/* Text Content */}
          <section className="bg-white border border-brand-navy/5 p-10 space-y-6 shadow-sm">
            <div className="flex items-center gap-3 border-b border-brand-navy/5 pb-5">
              <Type size={15} className="text-secondary" />
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-navy">Text Content</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-brand-navy/40">Headline</label>
                <input
                  value={section.content?.title || ""}
                  onChange={(e) => updateContent("title", e.target.value)}
                  className="w-full bg-brand-background border border-brand-navy/10 px-5 py-3.5 text-[11px] font-medium tracking-wider outline-none focus:border-secondary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-brand-navy/40">Subtitle</label>
                <input
                  value={section.content?.subtitle || ""}
                  onChange={(e) => updateContent("subtitle", e.target.value)}
                  className="w-full bg-brand-background border border-brand-navy/10 px-5 py-3.5 text-[11px] font-medium tracking-wider outline-none focus:border-secondary transition-all"
                />
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="bg-white border border-brand-navy/5 p-10 space-y-6 shadow-sm">
            <div className="flex items-center gap-3 border-b border-brand-navy/5 pb-5">
              <LinkIcon size={15} className="text-secondary" />
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-navy">Call to Action</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-brand-navy/40">Button Label</label>
                <input
                  value={section.content?.button_text || ""}
                  onChange={(e) => updateContent("button_text", e.target.value)}
                  className="w-full bg-brand-background border border-brand-navy/10 px-5 py-3.5 text-[11px] font-medium tracking-wider outline-none focus:border-secondary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-brand-navy/40">Button Link</label>
                <input
                  value={section.content?.button_link || ""}
                  onChange={(e) => updateContent("button_link", e.target.value)}
                  className="w-full bg-brand-background border border-brand-navy/10 px-5 py-3.5 text-[11px] font-medium tracking-wider outline-none focus:border-secondary transition-all"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-brand-navy text-white p-10 space-y-6">
            <div className="border-b border-white/10 pb-5">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">Publish</h3>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-secondary text-brand-navy text-[10px] font-bold uppercase tracking-[0.4em] py-5 shadow-xl hover:bg-white transition-all duration-300 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
              Save Section
            </button>
          </div>

          <div className="bg-white border border-brand-navy/5 p-8 space-y-5 shadow-sm">
            <div className="flex items-center gap-3">
              <Layers size={14} className="text-secondary" />
              <h3 className="text-[13px] font-serif italic text-brand-navy">Section Info</h3>
            </div>
            <p className="text-[10px] text-brand-navy/40 leading-relaxed uppercase tracking-[0.15em] font-bold">
              This section will appear on the customer-facing homepage when marked active.
            </p>
            <div className="p-3 bg-brand-background border-l-4 border-l-secondary">
              <p className="text-[8px] font-black uppercase tracking-widest text-brand-navy/30">Type</p>
              <p className="text-[10px] font-bold text-brand-navy uppercase tracking-widest mt-1">{section.section_key}</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
