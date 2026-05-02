import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, Sparkles, ChevronRight, Droplets, Sun, Wind, Ban, Microscope, Beaker, Shield, Activity } from "lucide-react";
import { COATING_CONTENT } from "@/lib/data/coatings";

export const dynamic = "force-dynamic";

export default async function CoatingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: coating, error } = await supabase
    .from("lens_coatings")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Coating Fetch Error:", error, "for ID:", id);
  }

  if (!coating && error?.code !== 'PGRST116') {
     // If it's a network error or something else, show it instead of 404ing blindly
     return (
       <div className="pt-32 text-center text-red-500">
         <h1 className="text-2xl font-bold">Database Connection Error</h1>
         <p>{error?.message}</p>
       </div>
     )
  }

  if (!coating) {
    return notFound();
  }

  // Find editorial content matching the coating name
  const slug = coating.name.toLowerCase().replace(/\s+/g, '-');
  const editorial = Object.entries(COATING_CONTENT).find(([key]) => slug.includes(key))?.[1] || {
    headline: "Ocular Protection. Refined.",
    description: coating.description || "Experimental laboratory-grade coating for supreme visual endurance.",
    features: ["Nanotech Durability", "Ultra-Light Application", "High-Definition Clarity"],
    image: "https://images.unsplash.com/photo-1577744486770-020ab4ca15f6?auto=format&fit=crop&q=80&w=2000"
  };

  return (
    <main className="bg-surface text-brand-navy min-h-screen pt-24 font-sans">
      {/* 1. Cinematic Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden border-b border-brand-navy/5">
        <div className="absolute inset-0 z-0">
          <img 
            src={editorial.image} 
            alt={coating.name} 
            className="w-full h-full object-cover transition-all duration-1000 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/80 to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-4xl space-y-8">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary italic">Molecular Enhancement Protocol</p>
              <h1 className="text-7xl md:text-[100px] font-serif italic tracking-tighter leading-none">
                {coating.name.split(' ').map((word: string, i: number) => (
                  <span key={i} className={i === 1 ? "text-secondary block" : ""}>{word} </span>
                ))}
              </h1>
            </div>
            <p className="text-xl md:text-3xl font-serif italic max-w-2xl text-brand-navy/80 leading-tight">
              {editorial.headline}
            </p>
          </div>
        </div>

        {/* Technical Floating Indicators */}
        <div className="absolute bottom-12 right-12 hidden lg:flex flex-col gap-6 text-right items-end">
          <div className="h-px w-32 bg-brand-navy/20"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40 italic">Signature Enhancement: {id.slice(0, 6)}</p>
          <div className="flex gap-4">
             <div className="w-10 h-10 border border-brand-navy/10 flex items-center justify-center rounded-full"><Microscope size={14} /></div>
             <div className="w-10 h-10 border border-brand-navy/10 flex items-center justify-center rounded-full"><Beaker size={14} /></div>
          </div>
        </div>
      </section>

      {/* 2. Performance Narrative Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
            <div className="space-y-20">
              <div className="space-y-8">
                <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-brand-navy/40 border-b border-brand-navy/5 pb-4 w-fit">Scientific Synthesis</h2>
                <div className="space-y-6">
                  <p className="text-3xl font-serif italic leading-relaxed text-brand-navy/90">
                    {editorial.description}
                  </p>
                  <p className="text-md text-brand-navy/60 font-medium leading-relaxed max-w-lg">
                    Applied using high-vacuum thermal evaporation, the {coating.name} creates an invisible molecular shield that enhances the lifecycle and clarity of your optics.
                  </p>
                </div>
              </div>

              {/* Technical Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {editorial.features.map((feature: string, i: number) => (
                  <div key={i} className="flex gap-6 items-start group">
                    <div className="w-12 h-12 bg-surface-container-low rounded-full flex items-center justify-center text-brand-navy group-hover:bg-secondary group-hover:text-white transition-all duration-500 shrink-0">
                      {feature.toLowerCase().includes('water') ? <Droplets size={20} /> : 
                       feature.toLowerCase().includes('uv') ? <Sun size={20} /> : 
                       feature.toLowerCase().includes('fog') ? <Wind size={20} /> : 
                       feature.toLowerCase().includes('scratch') ? <Ban size={20} /> :
                       <ShieldCheck size={20} />}
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-[11px] font-black uppercase tracking-widest leading-tight">{feature}</h4>
                      <div className="h-0.5 w-8 bg-brand-navy/5 group-hover:w-full group-hover:bg-secondary/40 transition-all duration-500"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative pt-12">
               <div className="aspect-square border border-brand-navy/5 p-4 bg-surface-container-high group overflow-hidden rounded-full">
                  <img 
                    src={editorial.image} 
                    className="w-full h-full object-cover transition-all duration-1000 scale-100 group-hover:scale-110"
                    alt="Coating Macro"
                  />
               </div>
               <div className="absolute top-0 right-0 bg-white p-10 border border-brand-navy/5 shadow-2xl space-y-2">
                  <p className="text-[9px] font-black uppercase tracking-widest text-secondary italic text-center">Laboratory Add-on</p>
                  <p className="text-4xl font-serif italic leading-none text-center">+₹{coating.price.toLocaleString()}</p>
                  <p className="text-[8px] font-bold text-brand-navy/30 uppercase tracking-[0.2em] text-center pt-2 italic">Excl. Base Lens</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Integration Pathway */}
      <section className="py-48 bg-surface-container-low relative">
        <div className="container mx-auto px-6 lg:px-12 text-center space-y-24">
          <div className="space-y-8 max-w-3xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-serif italic leading-none">The <span className="text-secondary">Protection</span> Matrix</h2>
            <div className="h-1 w-20 bg-secondary mx-auto"></div>
            <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-brand-navy/40 italic text-center">Incorporate {coating.name} into your optical protocol</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
             <div className="bg-white border border-brand-navy/5 p-16 space-y-12 text-left hover:border-secondary/20 transition-all duration-700 group">
                <div className="space-y-6 text-left">
                  <div className="w-14 h-14 bg-brand-navy text-white flex items-center justify-center rounded-sm group-hover:bg-secondary group-hover:rotate-12 transition-all">
                    <Zap size={28} />
                  </div>
                  <h3 className="text-3xl font-serif italic">Retrofit Upgrade</h3>
                  <p className="text-[11px] font-bold text-brand-navy/40 leading-relaxed uppercase tracking-widest">
                    Add {coating.name} to your lens replacement order. We will re-surface your frames with new, coated optics.
                  </p>
                </div>
                <Link 
                  href="/replace-lenses"
                  className="inline-flex items-center gap-4 bg-brand-navy text-white px-12 py-6 text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-all"
                >
                  <span>Start Replacement</span>
                  <ArrowRight size={14} />
                </Link>
             </div>

             <div className="bg-white border border-brand-navy/5 p-16 space-y-12 text-left hover:border-brand-navy/20 transition-all duration-700 group">
                <div className="space-y-6 text-left">
                  <div className="w-14 h-14 bg-secondary/10 text-secondary flex items-center justify-center rounded-sm">
                    <Sparkles size={28} />
                  </div>
                  <h3 className="text-3xl font-serif italic">New Silhouette</h3>
                  <p className="text-[11px] font-bold text-brand-navy/40 leading-relaxed uppercase tracking-widest">
                    Browse our frame curation and select {coating.name} as a final laboratory enhancement.
                  </p>
                </div>
                <Link 
                  href="/products?category=spectacles"
                  className="inline-flex items-center gap-6 border-b-2 border-brand-navy pb-3 text-[10px] font-black uppercase tracking-widest hover:text-secondary hover:border-secondary transition-all"
                >
                  <span>Explore Frames</span>
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
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary italic">Certification</p>
                <div className="space-y-2">
                  <p className="text-lg font-serif italic">Laboratory Verified</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 leading-relaxed">Each batch is tested for consistency in refractive index and protective layer thickness.</p>
                </div>
            </div>
            <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary italic">Warranty</p>
                <div className="space-y-2">
                  <p className="text-lg font-serif italic">Integrity Guarantee</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 leading-relaxed">Protected by a 12-month policy against delamination and surfacing defects.</p>
                </div>
            </div>
            <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary italic">Maintenance</p>
                <div className="space-y-2">
                  <p className="text-lg font-serif italic">Care Instructions</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 leading-relaxed">Optimized for cleaning with our signature micro-fiber cloths and PH-neutral solutions.</p>
                </div>
            </div>
        </div>
      </section>
    </main>
  );
}
