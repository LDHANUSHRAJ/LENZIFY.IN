import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Eye, Shield, Truck, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "About Lenzify — India's Premium Eyewear Brand",
  description: "Learn about Lenzify's mission to make premium eyewear accessible to every Indian. Our story, values, and commitment to quality optics.",
};

const values = [
  {
    icon: Eye,
    title: "Clarity First",
    desc: "Every product we sell starts with the lens. We source and manufacture optics that meet international standards — because your vision deserves nothing less.",
  },
  {
    icon: Shield,
    title: "Quality You Can Trust",
    desc: "All frames and lenses go through rigorous quality checks before reaching you. We back every purchase with our warranty and hassle-free replacement programme.",
  },
  {
    icon: Truck,
    title: "Delivered to Your Door",
    desc: "From Try-at-Home frames to prescription lens replacements, we bring the optical store experience to you — wherever you are in India.",
  },
  {
    icon: Star,
    title: "Customer First, Always",
    desc: "Our opticians and support team are here throughout your journey — from choosing the right frame to getting the perfect fit on your prescription.",
  },
];

const stats = [
  { value: "10,000+", label: "Happy Customers" },
  { value: "500+", label: "Frame Styles" },
  { value: "3", label: "Flagship Stores" },
  { value: "100%", label: "Quality Checked" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#03173D] via-[#004AAD] to-[#009DFF] pt-28 md:pt-40 pb-16 md:pb-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-4">Our Story</p>
          <h1 className="font-[var(--font-hero)] italic text-white text-5xl md:text-8xl leading-none mb-6">
            About Lenzify
          </h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto">
            We started with a simple belief — that great eyewear shouldn't be a luxury. Premium lenses, beautiful frames, and expert care, made accessible for every Indian.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#004AAD] mb-3">Who We Are</p>
                <h2 className="text-4xl md:text-5xl font-serif italic text-[#111111] leading-tight">
                  Vision care, reimagined for India
                </h2>
              </div>
              <div className="space-y-5 text-[#555555] text-base leading-relaxed">
                <p>
                  Lenzify was founded with one goal: to bridge the gap between premium international eyewear and what Indian consumers could actually access and afford.
                </p>
                <p>
                  We curate frames from the world's best brands and pair them with optical-grade lenses — single vision, progressive, blue-light blocking, and more — all fitted by certified opticians and delivered to your doorstep.
                </p>
                <p>
                  Our Try-at-Home service, lens replacement programme, and dedicated customer support make us more than a store. We're your optical partner.
                </p>
              </div>
              <Link
                href="/products"
                className="inline-flex items-center gap-3 bg-[#03173D] text-white rounded-full px-8 py-4 font-semibold hover:bg-[#004AAD] transition-all"
              >
                Shop Eyewear <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {stats.map(({ value, label }) => (
                <div key={label} className="bg-[#F8F9FC] rounded-3xl p-8 text-center border border-[#ECECEC]">
                  <p className="text-4xl font-bold text-[#03173D] mb-2">{value}</p>
                  <p className="text-sm text-[#666666] font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-[#F8F9FC]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#004AAD] mb-3">What We Stand For</p>
            <h2 className="text-4xl font-serif italic text-[#111111]">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-3xl p-8 border border-[#ECECEC] shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-300">
                <div className="w-12 h-12 bg-[#F0F4FF] rounded-2xl flex items-center justify-center mb-5">
                  <Icon size={22} className="text-[#004AAD]" />
                </div>
                <h3 className="font-bold text-[#111111] text-lg mb-3">{title}</h3>
                <p className="text-[#666666] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#03173D]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-serif italic text-white mb-6">Ready to see the difference?</h2>
          <p className="text-white/60 text-base mb-10 max-w-xl mx-auto">
            Explore our full range of frames, lenses, and optical care services — or book a Try-at-Home session.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#03173D] rounded-full px-8 py-4 font-semibold hover:bg-[#009DFF] hover:text-white transition-all"
            >
              Browse Frames <ArrowRight size={16} />
            </Link>
            <Link
              href="/try-at-home"
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white rounded-full px-8 py-4 font-semibold hover:bg-white/10 transition-all"
            >
              Try at Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
