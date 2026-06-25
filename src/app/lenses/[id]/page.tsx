import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Eye, Zap, Sparkles, ChevronRight, Shield, Activity, CheckCircle2 } from "lucide-react";
import { LENS_CONTENT } from "@/lib/data/lenses";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export default async function LensDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

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

  if (!lens && error?.code !== "PGRST116") {
    return (
      <div className="pt-32 text-center text-red-500">
        <h1 className="text-2xl font-bold">Database Connection Error</h1>
        <p>{error?.message}</p>
      </div>
    );
  }

  if (!lens) return notFound();

  const slug = lens.name.toLowerCase().replace(/\s+/g, "-");
  const editorial = Object.entries(LENS_CONTENT).find(([key]) => slug.includes(key))?.[1] || {
    headline: "Precision crafted for clarity and comfort.",
    description: lens.description || "Premium quality lenses tailored for your unique visual needs.",
    features: lens.features || ["High-Contrast Clarity", "UV Protection", "Scratch Resistant"],
    image: "https://images.unsplash.com/photo-1577744486770-020ab4ca15f6?auto=format&fit=crop&q=80&w=2000",
  };

  return (
    <main className="bg-white min-h-screen font-sans">
      {/* Hero */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={editorial.image}
            alt={lens.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#03173D]/90 via-[#03173D]/60 to-transparent" />
        </div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10 pt-24">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-white/60 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/lenses" className="hover:text-white transition-colors">Lenses</Link>
            <span>/</span>
            <span className="text-white">{lens.name}</span>
          </div>

          <div className="max-w-2xl space-y-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#00AEEF]">
              {lens.sub_category || lens.category || "Premium Lens"}
            </span>
            <h1 className="text-5xl md:text-7xl font-[var(--font-hero)] italic text-white leading-none">
              {lens.name}
            </h1>
            <p className="text-xl text-white/70 leading-relaxed max-w-lg">
              {editorial.headline}
            </p>
            <div className="flex items-center gap-4 pt-2">
              <span className="text-3xl font-bold text-white">₹{lens.price.toLocaleString()}</span>
              <span className="text-white/50 text-sm">starting price</span>
            </div>
            <div className="flex gap-3 pt-2">
              <Link
                href={`/replace-lenses?lensId=${lens.id}`}
                className="bg-white text-[#03173D] rounded-full px-8 py-3.5 font-semibold text-sm hover:bg-[#00AEEF] hover:text-white transition-all inline-flex items-center gap-2"
              >
                Replace Lenses <ArrowRight size={16} />
              </Link>
              <Link
                href="/products"
                className="border border-white/40 text-white rounded-full px-8 py-3.5 font-semibold text-sm hover:border-white hover:bg-white/10 transition-all"
              >
                Shop Frames
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Description + Features */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            <div className="space-y-12">
              <div className="space-y-6">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#004AAD]">About This Lens</span>
                <h2 className="text-4xl font-[var(--font-hero)] italic text-[#111111] leading-tight">
                  {editorial.description}
                </h2>
                <p className="text-[#666666] leading-relaxed text-base">
                  Every {lens.name} lens is precision crafted to ensure zero-distortion vision
                  and long-lasting durability for everyday wear.
                </p>
              </div>

              {/* Feature grid */}
              <div className="grid grid-cols-2 gap-6">
                {editorial.features.map((feature: string, i: number) => (
                  <div key={i} className="bg-white border border-[#ECECEC] rounded-2xl p-5 hover:border-[#004AAD]/30 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-300">
                    <div className="w-10 h-10 bg-[#EEF3FF] rounded-xl flex items-center justify-center mb-3">
                      {i % 4 === 0 && <Shield size={18} className="text-[#004AAD]" />}
                      {i % 4 === 1 && <Activity size={18} className="text-[#004AAD]" />}
                      {i % 4 === 2 && <Eye size={18} className="text-[#004AAD]" />}
                      {i % 4 === 3 && <Sparkles size={18} className="text-[#004AAD]" />}
                    </div>
                    <h4 className="text-sm font-semibold text-[#111111] leading-tight">{feature}</h4>
                    <p className="text-xs text-[#999999] mt-1">Certified</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Image + pricing card */}
            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-[#F8F9FC]">
                <img
                  src="https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&q=80&w=1200"
                  className="w-full h-full object-cover"
                  alt="Laboratory Process"
                />
              </div>
              <div className="absolute -bottom-6 -right-4 lg:-right-8 bg-white rounded-3xl border border-[#ECECEC] shadow-[0_20px_60px_rgba(0,0,0,0.12)] p-8 space-y-4 max-w-[220px]">
                <div>
                  <p className="text-xs font-semibold text-[#004AAD] uppercase tracking-wider mb-1">Starting from</p>
                  <p className="text-3xl font-bold text-[#111111]">₹{lens.price.toLocaleString()}</p>
                </div>
                <div className="border-t border-[#E8EAF2] pt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={12} className="text-[#004AAD]" />
                    <span className="text-xs text-[#666666]">ISO-9001 Certified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={12} className="text-[#004AAD]" />
                    <span className="text-xs text-[#666666]">Multi-Step QC</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#F8F9FC]">
        <div className="container mx-auto px-6 lg:px-12 text-center space-y-16">
          <div className="space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#004AAD]">Get Started</span>
            <h2 className="text-4xl md:text-5xl font-[var(--font-hero)] italic text-[#111111] leading-tight">
              Choose how you want to experience {lens.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Replace lenses */}
            <div className="bg-white border border-[#ECECEC] rounded-3xl p-10 text-left hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.10)] transition-all duration-300 group">
              <div className="w-12 h-12 bg-[#03173D] text-white flex items-center justify-center rounded-2xl mb-6 group-hover:bg-[#004AAD] transition-colors">
                <Zap size={22} />
              </div>
              <h3 className="text-2xl font-[var(--font-hero)] italic text-[#111111] mb-3">Replace Existing Lenses</h3>
              <p className="text-sm text-[#666666] leading-relaxed mb-8">
                Professional lens replacement for your current frames. Includes pickup and precision fitting.
              </p>
              <Link
                href={`/replace-lenses?lensId=${lens.id}`}
                className="inline-flex items-center gap-2 bg-[#03173D] text-white rounded-full px-6 py-3 text-sm font-semibold hover:bg-[#004AAD] transition-all"
              >
                Order Lens Only <ArrowRight size={14} />
              </Link>
            </div>

            {/* Buy with new frame */}
            <div className="bg-white border border-[#ECECEC] rounded-3xl p-10 text-left hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.10)] transition-all duration-300 group">
              <div className="w-12 h-12 bg-[#EEF3FF] text-[#004AAD] flex items-center justify-center rounded-2xl mb-6 group-hover:bg-[#004AAD] group-hover:text-white transition-colors">
                <Sparkles size={22} />
              </div>
              <h3 className="text-2xl font-[var(--font-hero)] italic text-[#111111] mb-3">Shop with New Frames</h3>
              <p className="text-sm text-[#666666] leading-relaxed mb-8">
                Combine {lens.name} with a new designer frame from our collection. Includes personalized fitting.
              </p>
              <Link
                href="/products?category=spectacles"
                className="inline-flex items-center gap-2 border border-[#03173D] text-[#03173D] rounded-full px-6 py-3 text-sm font-semibold hover:bg-[#03173D] hover:text-white transition-all"
              >
                Explore Frames <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-gradient-to-br from-[#03173D] via-[#004AAD] to-[#009DFF]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#00AEEF]">Certification</p>
              <h4 className="text-lg font-[var(--font-hero)] italic text-white">Optical Health Standards</h4>
              <p className="text-sm text-white/60 leading-relaxed">
                Conforming to clinical precision guidelines for ocular protection and correction.
              </p>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#00AEEF]">Guarantee</p>
              <h4 className="text-lg font-[var(--font-hero)] italic text-white">12-Month Warranty</h4>
              <p className="text-sm text-white/60 leading-relaxed">
                Full integrity warranty against functional defects and lab-surfacing errors.
              </p>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#00AEEF]">Delivery</p>
              <h4 className="text-lg font-[var(--font-hero)] italic text-white">Express Processing</h4>
              <p className="text-sm text-white/60 leading-relaxed">
                All lenses are surfaced and dispatched within 3–5 working days.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
