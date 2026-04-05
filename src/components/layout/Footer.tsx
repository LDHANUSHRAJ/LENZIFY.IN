"use client";

import Link from "next/link";

export default function Footer() {
  const footerLinks = {
    collections: [
      { name: "The Heritage Series", href: "/products?collection=heritage" },
      { name: "Modern Minimalist", href: "/products?collection=minimalist" },
      { name: "Avant-Garde", href: "/products?collection=avant-garde" },
      { name: "Virtual Fitting Room", href: "/try-at-home" },
    ],
    support: [
      { name: "Shipping & Returns", href: "/shipping" },
      { name: "Prescription Guide", href: "/prescription-guide" },
      { name: "Frame Care", href: "/care" },
      { name: "Find a Store", href: "/stores" },
    ],
    company: [
      { name: "Our Story", href: "/about" },
      { name: "Craftsmanship", href: "/craftsmanship" },
      { name: "Sustainability", href: "/sustainability" },
      { name: "Press", href: "/press" },
    ]
  };

  return (
    <footer className="bg-primary text-white pt-24 pb-12">
      <div className="max-w-screen-2xl mx-auto px-8 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24 mb-24">
          <div className="space-y-8">
            <Link href="/" className="text-3xl font-serif italic tracking-tighter">
              LENZIFY
            </Link>
            <p className="text-sm text-outline tracking-wider leading-relaxed">
              Redefining vision through the lens of high-fashion editorial. Excellence in every frame, engineered for the visionary.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-secondary transition-colors">
                <span className="material-symbols-outlined text-xl">public</span>
              </Link>
              <Link href="#" className="hover:text-secondary transition-colors">
                <span className="material-symbols-outlined text-xl">share</span>
              </Link>
              <Link href="#" className="hover:text-secondary transition-colors">
                <span className="material-symbols-outlined text-xl">photo_camera</span>
              </Link>
            </div>
          </div>

          <div className="space-y-8">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">The Collections</h4>
            <ul className="space-y-4">
              {footerLinks.collections.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-outline hover:text-white transition-colors tracking-wide">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">Client Service</h4>
            <ul className="space-y-4">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-outline hover:text-white transition-colors tracking-wide">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">Newsletter</h4>
            <p className="text-sm text-outline tracking-wide">
              Join the vision. Subscribe for exclusive releases and editorial insights.
            </p>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="border-b border-outline/30 flex items-center py-2">
                <input 
                  type="email" 
                  placeholder="EMAIL ADDRESS" 
                  className="bg-transparent border-none focus:ring-0 text-[10px] uppercase font-bold tracking-widest w-full placeholder:text-outline/40"
                />
                <button type="submit" className="text-secondary hover:translate-x-1 transition-transform">
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-outline/60">
            © 2026 LENZIFY STUDIO. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8">
            <Link href="/privacy" className="text-[10px] font-bold uppercase tracking-[0.2em] text-outline/60 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-[10px] font-bold uppercase tracking-[0.2em] text-outline/60 hover:text-white transition-colors">
              Terms of Use
            </Link>
            <Link href="/cookies" className="text-[10px] font-bold uppercase tracking-[0.2em] text-outline/60 hover:text-white transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
