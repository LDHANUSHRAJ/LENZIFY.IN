"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="font-sans">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-brand-navy z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/90 to-transparent z-10" />
          <Image
            src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=2000&auto=format&fit=crop"
            alt="Luxury Eyewear"
            fill
            className="object-cover opacity-80"
            priority
          />
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-6 w-full flex flex-col items-start">
          <span className="text-brand-gold font-semibold uppercase tracking-[0.3em] mb-4 text-sm">
            The Spring Collection
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display text-white leading-[1.1] mb-8 max-w-3xl">
            Elegance in <br /> Every Glance.
          </h1>
          <Link href="/spectacles" className="group flex items-center bg-white text-brand-navy px-8 py-4 text-sm font-semibold uppercase tracking-widest hover:bg-brand-gold hover:text-white transition-all">
            Explore Collection
            <ArrowRight size={16} className="ml-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-brand-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display text-brand-navy mb-4">Curated Categories</h2>
            <p className="text-brand-text-muted">Discover our meticulously crafted optical frames and lenses.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Spectacles", image: "https://images.unsplash.com/photo-1591076482161-42ce6ebaa410?q=80&w=800&auto=format&fit=crop" },
              { title: "Sunglasses", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop" },
              { title: "Premium Lenses", image: "https://images.unsplash.com/photo-1577900232427-18219b9166a0?q=80&w=800&auto=format&fit=crop" },
            ].map((cat, i) => (
              <div key={i} className="group relative aspect-[4/5] overflow-hidden cursor-pointer bg-white border border-brand-navy/5">
                <Image src={cat.image} alt={cat.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-8 left-8">
                  <h3 className="text-2xl font-display text-white mb-2">{cat.title}</h3>
                  <span className="text-brand-gold text-xs font-semibold uppercase tracking-widest flex items-center">
                    Shop Now <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-24 bg-white border-t border-brand-navy/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl font-display text-brand-navy mb-4">Featured Pieces</h2>
              <p className="text-brand-text-muted">The zenith of optical craftsmanship.</p>
            </div>
            <Link href="/products" className="hidden md:flex text-brand-navy text-sm font-semibold uppercase tracking-widest items-center border-b border-brand-navy pb-1 hover:text-brand-gold hover:border-brand-gold transition-all">
              View All <ArrowRight size={14} className="ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="group cursor-pointer">
                <div className="relative aspect-square mb-6 bg-brand-background border border-brand-navy/5 overflow-hidden flex items-center justify-center p-8">
                  <Image src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop" alt="Glasses" width={400} height={400} className="object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 bg-brand-navy text-white text-[10px] uppercase tracking-widest px-2 py-1">New</div>
                </div>
                <div>
                  <h4 className="font-display text-xl text-brand-navy mb-2 group-hover:text-brand-gold transition-colors">Aurelius Frame</h4>
                  <p className="text-brand-text-muted text-sm mb-3">Titanium & Acetate</p>
                  <p className="font-medium text-brand-navy">₹12,499</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
