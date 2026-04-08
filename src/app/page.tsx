"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useCartStore } from "@/store/cartStore";
import { cn } from "@/lib/utils";
import { RefreshCw } from "lucide-react";
import ProductCard from "@/components/store/ProductCard";

const CATEGORY_CARDS = [
  { name: "Men", image_url: "/images/categories/men.png", href: "/products?gender=Men" },
  { name: "Women", image_url: "/images/categories/women.png", href: "/products?gender=Women" },
  { name: "Kids", image_url: "/images/categories/kids.png", href: "/products?gender=Kids" },
  { name: "Eyeglasses", image_url: "/images/categories/eyeglasses.png", href: "/products?type=Eyeglasses" },
  { name: "Sunglasses", image_url: "/images/categories/sunglasses.png", href: "/products?type=Sunglasses" },
  { name: "Computer Glasses", image_url: "/images/categories/computer_glasses.png", href: "/products?type=Computer Glasses" },
  { name: "Reading Glasses", image_url: "/images/categories/reading_glasses.png", href: "/products?type=Reading Glasses" },
  { name: "Contact Lenses", image_url: "/images/categories/contact_lenses.png", href: "/products?type=Contact Lenses" },
  { name: "Accessories", image_url: "/images/categories/accessories.png", href: "/products?type=Accessories" },
];

const DEFAULT_SECTIONS = [
  { id: "default-hero", section_key: "hero", content: { subtitle: "The Visionary Editorial", title: "Visionary Excellence. Timeless Style.", description: "Curated eyewear for those who view the world through a lens of sophistication and clarity.", button_text: "Explore Collection", button_link: "/products", image_url: "/images/editorial/hero_woman_reading.png" } },
  { id: "default-categories", section_key: "categories", content: { title: "Categories", subtitle: "Defining the future of optical aesthetics.", items: CATEGORY_CARDS } },
  { id: "default-featured", section_key: "featured_products", content: { title: "Featured Products", subtitle: "Handpicked selections." } },
  { id: "default-trending", section_key: "trending_products", content: { title: "Trending", subtitle: "What everyone is wearing right now." } },
  { id: "default-new", section_key: "new_arrivals", content: { title: "New Arrivals", subtitle: "Fresh out of the design lab." } },
  { id: "default-bestsellers", section_key: "best_sellers", content: { title: "Best Sellers", subtitle: "Our most loved frames." } },
  { id: "default-brands", section_key: "brand_section", content: { title: "Premium Brands", subtitle: "Top tier craftsmanship." } },
];

function ProductRow({ title, subtitle, filterField, filterValue }: { title: string, subtitle: string, filterField?: string, filterValue?: any }) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchProducts = async () => {
      let query = supabase.from("products").select("*").eq("is_enabled", true).limit(4);
      
      if (filterField === 'is_featured') {
          query = query.eq('is_featured', filterValue);
      } else if (filterField === 'collection' && filterValue) {
          query = query.contains("collection", [filterValue]);
      } else {
          // Fallback, order by created at descending
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1">
        {[1, 2, 3, 4].map((p) => (
          <div key={p} className="aspect-[1/1] bg-surface-container animate-pulse" />
        ))}
      </div>
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
             <div className="col-span-12 text-center py-10 opacity-50">No products found for this section.</div>
          )}
        </div>
      </div>
    </section>
  );
}
// Removed old FeaturedProductsGrid function

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      const { data: config } = await supabase
        .from("homepage_config")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      
      if (config && config.length > 0) {
        setSections(config);
      } else {
        setSections(DEFAULT_SECTIONS);
      }
      setLoading(false);
    };
    fetchData();

    const channel = supabase
      .channel("homepage_cms")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "homepage_config" },
        () => { fetchData(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="space-y-4 text-center">
          <RefreshCw className="animate-spin text-secondary mx-auto" size={32} />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary italic">Syncing Matrix...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface text-on-surface selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      {/* Header logic is expected to be in layout, but template provided one. 
          For consistency with before, we might need a separate Header component, 
          but here we'll implement the sections provided. */}
      
      <main className="pt-0">
        {sections.map((section) => {
          const content = section.content;

          switch (section.section_key) {
            case "hero":
              return (
                <section key={section.id} className="relative h-[921px] flex items-center overflow-hidden bg-surface">
                  <div className="container mx-auto px-6 md:px-12 grid grid-cols-12 gap-8 items-center h-full">
                    <div className="col-span-12 lg:col-span-5 z-10">
                      <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="label-md uppercase tracking-[0.2em] text-secondary font-semibold mb-6 block"
                      >
                        {content.subtitle || "The Visionary Editorial"}
                      </motion.span>
                      <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-8xl font-serif leading-[1.1] text-primary -tracking-[0.03em] mb-8"
                        dangerouslySetInnerHTML={{ __html: content.title.replace(" ", "<br/>") }}
                      />
                      <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-body-lg text-on-surface-variant max-w-md mb-10 leading-relaxed"
                      >
                        {content.description || "Curated eyewear for those who view the world through a lens of sophistication and clarity."}
                      </motion.p>
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex gap-6"
                      >
                        <Link href={content.button_link || "/products"} className="px-10 py-4 bg-primary text-on-primary font-medium tracking-tight hover:opacity-90 transition-all">
                          {content.button_text || "Explore Collection"}
                        </Link>
                        <Link href="/try-on" className="px-10 py-4 border border-outline-variant text-primary font-medium tracking-tight hover:bg-surface-container transition-all">
                          Virtual Try-On
                        </Link>
                      </motion.div>
                    </div>
                    <div className="col-span-12 lg:col-span-7 absolute lg:relative right-0 top-0 h-full w-full lg:w-auto overflow-hidden">
                      <Image 
                        src={content.image_url || "/hero_spectacles_editorial_1775490575090.png"} 
                        alt="Hero Image" 
                        fill
                        className="w-full h-full object-cover object-center grayscale-[20%] hover:scale-105 transition-transform duration-[2000ms]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/10 to-transparent lg:hidden"></div>
                    </div>
                  </div>
                </section>
              );

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
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                      {/* Category Items */}
                      {content.items?.map((cat: any, i: number) => (
                        <Link href={cat.href || "/products"} key={cat.name} className="group relative overflow-hidden bg-surface aspect-[4/5] rounded-lg">
                          <Image 
                            src={cat.image_url || "/placeholder.png"} 
                            alt={cat.name} 
                            fill
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <div className="absolute bottom-8 left-8">
                            <span className="text-xs uppercase tracking-widest text-on-surface/60 block mb-2">{cat.label || "Collection"}</span>
                            <h3 className="text-2xl font-serif">{cat.name}</h3>
                          </div>
                        </Link>
                      )) || (
                        <>
                          <div className="group relative overflow-hidden bg-surface aspect-[4/5]">
                            <Image fill alt="Eyeglasses" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCj2O_AQZH-ZiFjxf0fCt9WzORe_6b_73FmcmyDY2SkWLOhmg4WlKdMCpzUGeF4ekus8F3tt1JXo7xCaU6CfWk58r9Oa5CcsR7RI8tVq1aIzMfQ_YUFFaS2D1qWE9Q8g59vYuMCtPcONMGOLG3YBhzfevkFc7a-PXGHiyjTaqHeykhJ2UxN4lTrsFhXSR3KevmRNwB8nJxuOgKAcd43yEW2jzuY1h6XN4i5uhWazdmeYysQaV9blaJLIQ3_7PJbBZM6eFLSiAk1A8c"/>
                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="absolute bottom-8 left-8">
                              <span className="text-xs uppercase tracking-widest text-on-surface/60 block mb-2">Collection</span>
                              <h3 className="text-2xl font-serif">Eyeglasses</h3>
                            </div>
                          </div>
                          <div className="group relative overflow-hidden bg-surface aspect-[4/5]">
                            <Image fill alt="Sunglasses" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKxLpdziL69sjQd1SSiM9DiiZTey5_B102flNc-Z-bYkQiEHT1WXTgy-srtZs69vrmpPWJpyNRHYyPzK1GtprSRQIHwxjxfAQNIomir-PGmrkSUqflGXU8Dm6u22gJEAz-seKVn_BFPRkGoqoo_AD5gK0sSBumdSB3vQtIo2CwtYFfYIsnb7h65hDuArR2NevRv55X0NfvHldl0wusmTISVsibV8W0g6RgSnAVXBEJBhKZ8QxYz5GjNlkQk6FasmPyR7-M59S_dk8"/>
                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="absolute bottom-8 left-8">
                              <span className="text-xs uppercase tracking-widest text-on-surface/60 block mb-2">Essentials</span>
                              <h3 className="text-2xl font-serif">Sunglasses</h3>
                            </div>
                          </div>
                          <div className="group relative overflow-hidden bg-surface aspect-[4/5]">
                            <Image fill alt="Lenses" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7zX0g7XEXmzFBrqwKp3rSAs5VHOZsr3HAWhHrrrdvChHcbTEwpy_BhW0_lRfJQoYMBznkHI2dNU5adwcCwqPiEX9woxTEzr36M_vK_KKoOv_30q84fvt21TzVeziryiag9aObQh48KZjy8-noZ_xrpEtzoJ04tZh51qTGQhXhQeaYbbx13STtkaLLnFVzXsVhxRDvrLLm-VZ1AIVngQ1muNVX9_fLLd2fZD1o2cmP5bTZ_9tcocNySba-_GS9EH1xzX7Cnt5NWAo"/>
                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="absolute bottom-8 left-8">
                              <span className="text-xs uppercase tracking-widest text-on-surface/60 block mb-2">Technical</span>
                              <h3 className="text-2xl font-serif">Precision Lenses</h3>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </section>
              );

            case "featured_products":
              return <ProductRow key={section.id} title={content.title || "Featured"} subtitle={content.subtitle} filterField="is_featured" filterValue={true} />;
            
            case "trending_products":
              return <ProductRow key={section.id} title={content.title || "Trending"} subtitle={content.subtitle} filterField="collection" filterValue="Trending" />;

            case "new_arrivals":
              return <ProductRow key={section.id} title={content.title || "New Arrivals"} subtitle={content.subtitle} filterField="collection" filterValue="New Arrivals" />;

            case "best_sellers":
              return <ProductRow key={section.id} title={content.title || "Best Sellers"} subtitle={content.subtitle} filterField="collection" filterValue="Best Sellers" />;

            case "brand_section":
              return (
                <section key={section.id} className="py-20 bg-surface text-center">
                  <h3 className="text-2xl font-serif mb-10">{content.title || "Premium Brands"}</h3>
                  <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale">
                     <span className="font-bold text-xl uppercase tracking-widest">Ray-Ban</span>
                     <span className="font-bold text-xl uppercase tracking-widest">Oakley</span>
                     <span className="font-bold text-xl uppercase tracking-widest">Gucci</span>
                     <span className="font-bold text-xl uppercase tracking-widest">Prada</span>
                     <span className="font-bold text-xl uppercase tracking-widest">Persol</span>
                  </div>
                </section>
              );

            case "full_width_banner":
              return (
                <section key={section.id} className="py-32 bg-surface">
                  <div className="max-w-screen-2xl mx-auto px-6 md:px-12 grid grid-cols-12 gap-16 items-center">
                    <div className="col-span-12 lg:col-span-6 order-2 lg:order-1">
                      <div className="relative h-[600px] w-full overflow-hidden editorial-shadow">
                        <Image 
                          src={content.image_url || "/heritage_spectacles_editorial_2_1775490822405.png"} 
                          alt="Heritage Series" 
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="col-span-12 lg:col-span-6 order-1 lg:order-2">
                      <span className="text-[10px] font-bold text-secondary tracking-widest mb-4 block uppercase font-body">{content.subtitle || "EXCLUSIVELY LENZIFY"}</span>
                      <h2 className="text-5xl font-serif mb-8">{content.title || "The Heritage Series"}</h2>
                      <p className="text-lg text-on-surface-variant leading-relaxed mb-8">
                        {content.description || "Inspired by the archives of 1950s visionary designers, The Heritage Series combines traditional craftsmanship with modern acetate technology."}
                      </p>
                      <ul className="space-y-4 mb-12">
                        {["Mazzucchelli Acetate", "Five-Barrel Hinges", "Gold Filigree Wire Core"].map(item => (
                          <li key={item} className="flex items-center gap-4 text-on-surface text-sm uppercase tracking-wider font-semibold">
                            <span className="w-1.5 h-1.5 bg-secondary rounded-full"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                      <Link href="/collections/heritage" className="px-12 py-5 bg-primary text-on-primary hover:bg-primary/90 transition-all font-medium inline-block">
                        Explore The Archive
                      </Link>
                    </div>
                  </div>
                </section>
              );

            default:
              return null;
          }
        })}

        {/* Static Section: Virtual Try-On */}
        <section className="py-40 bg-surface">
          <div className="max-w-screen-xl mx-auto px-6 md:px-12 bg-surface-container-lowest editorial-shadow overflow-hidden flex flex-col lg:flex-row">
            <div className="lg:w-1/2 p-20 flex flex-col justify-center">
              <div className="w-12 h-[1px] bg-secondary mb-10"></div>
              <h2 className="text-4xl font-serif mb-8 leading-tight">The Virtual Fitting<br/>Room Experience</h2>
              <p className="text-on-surface-variant mb-10 leading-relaxed">Our advanced AI precision-mapping ensures your frames fit perfectly before you even visit the store. Scan your face in 3D for an uncompromisingly accurate digital preview.</p>
              <div className="flex items-center gap-4 cursor-pointer group">
                <div className="w-14 h-14 rounded-full border border-outline-variant flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-all">
                  <span className="material-symbols-outlined text-[24px]">videocam</span>
                </div>
                <span className="font-medium tracking-tight uppercase text-xs">Launch AR Fitting Room</span>
              </div>
            </div>
            <div className="lg:w-1/2 relative min-h-[500px]">
              <Image 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQjLuHfQY2h-G0d6YMv4XAwlghFlNlhQ9rGLBUBvjQ5EPhttsZolLgb5lV916AIBDWOdeT5qqYK7Hq_aLDwbu3xjKmpriUNLBzWk4457x-7Ko5Gli6mmWfPHVoE95__mrjdGFKPFAZhaqsQcky4xejDmvkxck9TJkdYH7T7vTDOBQ9TWTtlWkRzxePAkkRPeQdtNtexpEqM91mZO0zAAW4ZEpazTMYybwPV41IYrE715TnFWj0ekyydZbDmc1gJFMj-35pWBedVVY"
                alt="Virtual Try On Interface" 
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
