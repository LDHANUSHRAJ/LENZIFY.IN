"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/AuthProvider";
import { cn } from "@/lib/utils";
import ProductCard from "@/components/store/ProductCard";
import HomeCarousel from "./HomeCarousel";
import SectionBanner from "./SectionBanner";
import LensesSection from "./LensesSection";


interface HomeClientProps {
  initialSections: any[];
  initialProducts?: {
    featured: any[];
    trending: any[];
  };
}

function ProductRow({ title, subtitle, filterField, filterValue, initialData }: { title: string, subtitle: string, filterField?: string, filterValue?: any, initialData?: any[] }) {
  const [products, setProducts] = useState<any[]>(initialData || []);
  const [loading, setLoading] = useState(!initialData);
  const supabase = createClient();

  useEffect(() => {
    const fetchProducts = async () => {
      let query = supabase.from("products").select("*, categories(slug)").eq("is_enabled", true).limit(4);
      
      if (filterField === 'is_featured') {
          query = query.eq('is_featured', filterValue);
      } else if (filterField === 'collection' && filterValue) {
          query = query.contains("collection", [filterValue]);
      } else {
          query = query.order('created_at', { ascending: false });
      }

      const { data } = await query;
      if (data) setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, [supabase, filterField, filterValue]);

  if (loading) {
    return (
      <section className="py-24 bg-surface-container">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((p) => (
                    <div key={p} className="aspect-[4/5] bg-surface-container-high animate-pulse rounded-lg" />
                ))}
            </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-surface-container">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-4xl font-serif text-primary">{title}</h2>
            <p className="text-on-surface-variant mt-2 font-body">{subtitle}</p>
          </div>
          <Link href="/products" className="text-secondary font-medium underline underline-offset-8 hover:opacity-70 transition-all">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
          {products.length === 0 && (
             <div className="col-span-12 text-center py-20 opacity-30 uppercase tracking-[0.3em] font-bold text-xs">No archives found.</div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function HomeClient({ initialSections, initialProducts }: HomeClientProps) {
  const [sections, setSections] = useState(initialSections);
  const { user } = useAuth();
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel("homepage_cms_updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "homepage_config" },
        async () => {
            const { data } = await supabase
                .from("homepage_config")
                .select("*")
                .eq("is_active", true)
                .order("sort_order", { ascending: true });
            if (data) setSections(data);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [supabase]);

  return (
    <div className="bg-surface text-on-surface selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      <main className="pt-0">
        <HomeCarousel />
        
        {sections.map((section) => {

          const content = section.content;

          switch (section.section_key) {
            case "hero":
              return null;


            case "categories":
              return (
                <section key={section.id} className="py-32 bg-surface-container-low">


                  <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
                    <div className="flex justify-between items-end mb-16">
                      <div>
                        <h2 className="text-4xl font-serif text-primary">{content.title || "Curated Categories"}</h2>
                        <p className="text-on-surface-variant mt-2 font-body">{content.subtitle || "Defining the future of optical aesthetics."}</p>
                      </div>
                      <Link href="/products" className="text-secondary font-medium underline underline-offset-8 hover:opacity-70 transition-all">
                        View All
                      </Link>
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-6">
                      {content.items?.map((cat: any, i: number) => (
                        <Link href={cat.href || "/products"} key={cat.name} className="group relative overflow-hidden bg-surface aspect-[3/4] md:aspect-[4/5] rounded-lg">
                          <Image 
                            src={cat.image_url || "/placeholder.png"} 
                            alt={cat.name} 
                            fill
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <div className="absolute bottom-3 left-3 md:bottom-8 md:left-8">
                            <span className="text-[7px] md:text-[9px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-on-surface/50 block mb-1 md:mb-2">{cat.type || cat.label || "Collection"}</span>
                            <h3 className="text-sm md:text-2xl font-serif">{cat.name}</h3>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </section>
              );


            case "featured_products":
              return <ProductRow key={section.id} title={content.title || "Featured"} subtitle={content.subtitle} filterField="is_featured" filterValue={true} initialData={initialProducts?.featured} />;


            
            case "trending_products":
              return <ProductRow key={section.id} title={content.title || "Trending"} subtitle={content.subtitle} filterField="collection" filterValue="Trending" initialData={initialProducts?.trending} />;

            case "new_arrivals":
              return (
                <div key={section.id}>
                  <SectionBanner title={content.title || "New Arrivals"} image="/images/editorial/lifestyle_laughing.png" />
                  <ProductRow title={content.title || "New Arrivals"} subtitle={content.subtitle} filterField="collection" filterValue="New Arrivals" />
                </div>
              );

            case "collections_gallery":
              const collections = content.items || [];
              return (
                <div key={section.id}>
                  <LensesSection />
                  <section className="py-32 bg-brand-background">


                   <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
                      <div className="flex justify-between items-end mb-16">
                        <div>
                          <h2 className="text-4xl font-serif text-brand-navy italic">{content.title || "The Collections"}</h2>
                          <p className="text-brand-navy/40 mt-2 font-body uppercase tracking-widest text-[10px] font-bold">{content.subtitle || "Curated aesthetic narratives."}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                         {collections.length > 0 ? (
                           collections.map((col: any) => (
                            <Link href={`/products?collection=${col.name}`} key={col.id} className="group relative aspect-[16/10] overflow-hidden bg-white border border-brand-navy/5">
                               {col.banner_url ? (
                                 <Image src={col.banner_url} alt={col.name} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                               ) : (
                                 <div className="w-full h-full flex items-center justify-center bg-brand-navy/[0.02] text-[8px] font-bold tracking-widest uppercase text-brand-navy/10 italic">SCHEMA ASSET MISSING</div>
                               )}
                               <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                               <div className="absolute bottom-8 left-8 right-8">
                                  <p className="text-[9px] font-bold text-white/60 tracking-[0.3em] uppercase mb-2">{col.type || "CURATED"}</p>
                                  <h3 className="text-2xl font-serif text-white italic">{col.name}</h3>
                               </div>
                            </Link>
                          ))
                         ) : (
                           [1,2,3].map(i => (
                            <div key={i} className="aspect-[16/10] bg-brand-navy/5 animate-pulse rounded-lg" />
                           ))
                         )}
                      </div>
                   </div>
                </section>
                </div>
              );

            case "best_sellers":
              return (
                <div key={section.id}>
                  <SectionBanner title={content.title || "Best Sellers"} image="/images/editorial/featured_woman.png" />
                  <ProductRow title={content.title || "Best Sellers"} subtitle={content.subtitle} filterField="collection" filterValue="Best Sellers" />
                </div>
              );



            case "brand_section":
              const brands = content.items || [];
              return (
                <section key={section.id} className="py-32 bg-surface text-center border-t border-brand-navy/5">
                  <div className="container mx-auto px-6">
                    <span className="text-[10px] font-bold text-secondary tracking-[0.4em] mb-4 block uppercase leading-none italic">{content.subtitle || "The Vanguard of Optics"}</span>
                    <h3 className="text-4xl font-serif italic mb-20 text-brand-navy">{content.title || "Premium Partners"}</h3>
                    
                    <div className="flex flex-wrap justify-center items-center gap-x-20 gap-y-16 lg:gap-x-32">
                       {brands.length > 0 ? (
                         brands.map((brand: any) => (
                          <div key={brand.id} className="group flex flex-col items-center gap-4 transition-all duration-700 hover:-translate-y-2">
                            <div className="w-24 h-16 relative grayscale hover:grayscale-0 transition-all duration-700 opacity-40 hover:opacity-100">
                               {brand.logo_url ? (
                                 <Image src={brand.logo_url} alt={brand.name} fill className="object-contain" />
                               ) : (
                                 <span className="font-black text-lg uppercase tracking-widest text-brand-navy whitespace-nowrap">{brand.name}</span>
                               )}
                            </div>
                          </div>
                        ))
                       ) : (
                         ["Ray-Ban", "Oakley", "Gucci", "Prada", "Persol"].map(brand => (
                            <span key={brand} className="font-black text-xl lg:text-3xl uppercase tracking-[0.2em] text-brand-navy/20 hover:text-secondary hover:opacity-100 transition-all cursor-default">{brand}</span>
                         ))
                       )}
                    </div>
                  </div>
                </section>
              );

            case "full_width_banner":
              return null;


            default:
              return null;
          }
        })}



        <section className="py-24 bg-brand-navy text-white text-center px-6 border-t border-white/5">
          <div className="max-w-4xl mx-auto space-y-8">
             <h2 className="text-4xl md:text-6xl font-serif italic tracking-tight">Replace Your Lenses</h2>
             <p className="text-[12px] uppercase font-bold tracking-widest text-white/60 leading-relaxed max-w-2xl mx-auto">
               Love your current frames but need a new prescription? Send them to us and our master opticians will fit them with state-of-the-art lenses.
             </p>
             <Link href="/replace-lenses" className="inline-block bg-secondary text-brand-navy px-12 py-5 text-[11px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_40px_rgba(var(--brand-gold-rgb),0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)]">
                Initiate Lens Replacement
             </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
