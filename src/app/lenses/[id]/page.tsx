import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Eye, Zap, Sparkles, ChevronRight, Microscope, Shield, Activity, Beaker, CheckCircle2 } from "lucide-react";
import { LENS_CONTENT } from "@/lib/data/lenses";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export default async function LensDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Use standard JS client to avoid Next.js SSR fetch/cookie bugs on public pages
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: lens, error } = await supabase
    .from("lenses")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Lens Fetch Error:", error.message || error, "for ID:", id);
  }

  if (!lens && error?.code !== 'PGRST116') {
     return (
       <div className="pt-32 text-center text-red-500">
         <h1 className="text-2xl font-bold">Database Connection Error</h1>
         <p>{error?.message}</p>
       </div>
     )
  }

  if (!lens) {
    return notFound();
  }

  // Find editorial content matching the lens name/category or fallback
  const slug = lens.name.toLowerCase().replace(/\s+/g, '-');
  const editorial = Object.entries(LENS_CONTENT).find(([key]) => slug.includes(key))?.[1] || {
    headline: "Visionary Clinical Precision.",
    description: lens.description || "Archival-quality optics tailored for your unique visual signature.",
    features: lens.features || ["High-Contrast Clarity", "Diamond-Carbon Durability", "Ultra-Light Construction"],
    image: "https://images.unsplash.com/photo-1577744486770-020ab4ca15f6?auto=format&fit=crop&q=80&w=2000"
  };

  return (
    <main className="bg-surface text-brand-navy min-h-screen pt-24 font-sans">
      {/* 1. Cinematic Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden border-b border-brand-navy/5">
        <div className="absolute inset-0 z-0">
          <img 
            src={editorial.image} 
            alt={lens.name} 
            className="w-full h-full object-cover transition-all duration-1000 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/80 to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-4xl space-y-8">
            <div className="space-y-2">
              <p 
                className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary italic"
              >
                Optical Architecture Protocol
              </p>
              <h1 className="text-7xl md:text-[120px] font-serif italic tracking-tighter leading-none">
                {lens.name.split(' ').map((word: string, i: number) => (
                  <span key={i} className={i === 1 ? "text-secondary block" : ""}>{word} </span>
                ))}
              </h1>
            </div>
            <p className="text-xl md:text-3xl font-serif italic max-w-2xl text-brand-navy/80 leading-tight">
              {editorial.headline}
            </p>
          </div>
        </div>

        {/* Floating Side Info */}
        <div className="absolute bottom-12 right-12 hidden lg:flex flex-col gap-6 text-right items-end">
          <div className="h-px w-32 bg-brand-navy/20"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Lab Batch No: {id.slice(0, 8)}</p>
          <div className="flex gap-4">
             <div className="w-10 h-10 border border-brand-navy/10 flex items-center justify-center rounded-full"><Microscope size={14} /></div>
             <div className="w-10 h-10 border border-brand-navy/10 flex items-center justify-center rounded-full"><Beaker size={14} /></div>
          </div>
        </div>
      </section>

      {/* 2. Scientific Narrative Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
            <div className="space-y-20">
              <div className="space-y-8">
                <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-brand-navy/40 border-b border-brand-navy/5 pb-4 w-fit">The Laboratory Narrative</h2>
                <div className="space-y-6">
                  <p className="text-3xl font-serif italic leading-relaxed text-brand-navy/90">
                    {editorial.description}
                  </p>
                  <p className="text-md text-brand-navy/60 font-medium leading-relaxed max-w-lg">
                    Every {lens.name} lens is digitally surfaced using proprietary diamond-carbon milling protocols to ensure zero-distortion vision across the entire curvature.
                  </p>
                </div>
              </div>

              {/* Technical Icons Grid */}
              <div className="grid grid-cols-2 gap-12">
                {editorial.features.map((feature: string, i: number) => (
                  <div key={i} className="space-y-4 group">
                    <div className="w-12 h-12 bg-surface-container-low rounded-sm flex items-center justify-center text-brand-navy group-hover:bg-secondary group-hover:text-white transition-all duration-500">
                      {i % 4 === 0 && <Shield size={20} />}
                      {i % 4 === 1 && <Activity size={20} />}
                      {i % 4 === 2 && <Eye size={20} />}
                      {i % 4 === 3 && <Sparkles size={20} />}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-[11px] font-black uppercase tracking-widest leading-tight">{feature}</h4>
                      <p className="text-[9px] font-medium text-brand-navy/40 uppercase tracking-wider">Certified Status</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
               <div className="aspect-[4/5] border border-brand-navy/5 p-4 bg-surface-container-high group overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&q=80&w=2000" 
                    className="w-full h-full object-cover transition-all duration-1000 scale-100 group-hover:scale-105"
                    alt="Laboratory Process"
                  />
               </div>
               {/* Fixed Laboratory Metadata Card */}
               <div className="absolute -bottom-10 -right-1 lg:-right-10 bg-white p-10 border border-brand-navy/5 shadow-2xl space-y-4">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-secondary">Service Baseline</p>
                    <p className="text-4xl font-serif italic leading-none">₹{lens.price.toLocaleString()}</p>
                  </div>
                  <div className="h-px w-full bg-brand-navy/5"></div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-brand-navy/40"><CheckCircle2 size={10} className="text-secondary" /> ISO-9001 Certified</li>
                    <li className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-brand-navy/40"><CheckCircle2 size={10} className="text-secondary" /> Multi-Step Inspection</li>
                  </ul>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Conversion Orbital Section */}
      <section className="py-48 bg-surface-container-low relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none flex items-center justify-center">
          <span className="text-[500px] font-serif italic">{lens.name[0]}</span>
        </div>
        
        <div className="container mx-auto px-6 lg:px-12 text-center space-y-24 relative z-10">
          <div className="space-y-8 max-w-3xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-serif italic leading-none">Define Your <span className="text-secondary">Signature</span> Path</h2>
            <div className="h-1 w-20 bg-secondary mx-auto"></div>
            <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-brand-navy/40">Select your deployment protocol</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Pathway A: Replacement */}
            <div className="bg-white border border-brand-navy/5 p-16 space-y-12 text-left hover:border-secondary/20 transition-all duration-700 group relative">
              <div className="space-y-6">
                <div className="w-14 h-14 bg-brand-navy text-white flex items-center justify-center rounded-sm group-hover:bg-secondary group-hover:rotate-12 transition-all">
                  <Zap size={28} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-serif italic">Retrofit Existing Archive</h3>
                  <p className="text-[11px] font-bold text-brand-navy/40 leading-relaxed uppercase tracking-widest">
                    Professional lens replacement for your current silhouettes. Includes secure pickup and laboratory precision fitting.
                  </p>
                </div>
              </div>
              <Link 
                href={`/replace-lenses?lensId=${lens.id}`}
                className="inline-flex items-center gap-4 bg-brand-navy text-white px-12 py-6 text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-all"
              >
                <span>Order Lens Only</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Pathway B: New Acquire */}
            <div className="bg-white border border-brand-navy/5 p-16 space-y-12 text-left hover:border-brand-navy/20 transition-all duration-700 group">
              <div className="space-y-6">
                <div className="w-14 h-14 bg-secondary/10 text-secondary flex items-center justify-center rounded-sm">
                  <Sparkles size={28} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-serif italic">New Curated Silhouette</h3>
                  <p className="text-[11px] font-bold text-brand-navy/40 leading-relaxed uppercase tracking-widest">
                    Combine {lens.name} technology with a new designer frame from our archival collection. Includes personalized fitting.
                  </p>
                </div>
              </div>
              <Link 
                href="/products?category=spectacles"
                className="inline-flex items-center gap-6 border-b-2 border-brand-navy pb-3 text-[10px] font-black uppercase tracking-widest hover:text-secondary hover:border-secondary transition-all"
              >
                <span>Explore Frame Catalog</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Trust Matrix */}
      <section className="py-32 bg-brand-navy text-white/90">
        <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-16 border-t border-white/5 pt-16">
            <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Certification</p>
                <div className="space-y-2">
                  <p className="text-lg font-serif italic">Optical Health Standards</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 leading-relaxed">Conforming to clinical precision guidelines for ocular protection and correction.</p>
                </div>
            </div>
            <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Guarantee</p>
                <div className="space-y-2">
                  <p className="text-lg font-serif italic">Signature Endurance</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 leading-relaxed">12-Month integrity warranty against functional defects and lab-surfacing errors.</p>
                </div>
            </div>
            <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Processing</p>
                <div className="space-y-2">
                  <p className="text-lg font-serif italic">Zero-Waste Lab</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 leading-relaxed">All lens surfacing is performed in climate-neutral environments with 100% material recycling.</p>
                </div>
            </div>
        </div>
      </section>
    </main>
  );
}
