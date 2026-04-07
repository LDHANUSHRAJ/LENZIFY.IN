"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "react-router-dom";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useCartStore } from "@/store/cartStore";
import { cn } from "@/lib/utils";
import { RefreshCw } from "lucide-react";
import ProductCard from "@/components/store/ProductCard";

const DEFAULT_SECTIONS = [
  {
    id: "default-hero",
    section_key: "hero",
    content: {
      subtitle: "The Visionary Editorial",
      title: "Visionary Excellence. Timeless Style.",
      description: "Curated eyewear for those who view the world through a lens of sophistication and clarity.",
      button_text: "Explore Collection",
      button_link: "/products",
      image_url: "/images/editorial/hero_woman_reading.png"
    }
  },
  {
    id: "default-categories",
    section_key: "categories",
    content: {
      title: "Curated Categories",
      subtitle: "Defining the future of optical aesthetics.",
      items: [
        { name: "Eyeglasses", label: "Collection", image_url: "/images/editorial/featured_woman.png", href: "/products?category=eyeglasses" },
        { name: "Sunglasses", label: "Essentials", image_url: "/images/editorial/lifestyle_laughing.png", href: "/products?category=sunglasses" },
        { name: "Precision Lenses", label: "Technical", image_url: "/images/editorial/community_group.png", href: "/lenses" }
      ]
    }
  },
  {
    id: "default-featured",
    section_key: "featured_products",
    content: {
      title: "Modern Minimalist",
      subtitle: "Stripped of excess. Defined by structure. The ultimate expression of industrial optical design."
    }
  },
  {
    id: "default-heritage",
    section_key: "full_width_banner",
    content: {
      subtitle: "EXCLUSIVELY LENZIFY",
      title: "The Heritage Series",
      description: "Inspired by the archives of 1950s visionary designers, The Heritage Series combines traditional craftsmanship with modern acetate technology.",
      image_url: "/images/editorial/community_group.png"
    }
  }
];

function FeaturedProductsGrid() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchFeatured = async () => {
      const { data } = await supabase
        .from("products")
        .select("*, categories(name, slug)")
        .eq("is_featured", true)
        .eq("is_enabled", true)
        .limit(4);
      if (data) setProducts(data);
      setLoading(false);
    };
    fetchFeatured();
  }, [supabase]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1">
        {[1, 2, 3, 4].map((p) => (
          <div key={p} className="aspect-[1/1] bg-surface-container animate-pulse" />
        ))}
      </div>
    );
  }

  const displayProducts = products.length > 0 ? products : [
    { id: 'p1', name: 'TITAN 01', price: 295, primary_image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkcfWEWRT3-q-UwrITAs3MTZMqxAHL_jEoGfzFzJ0T5z4puhpNoHT7NLCp2vgx5sQuf9LVorkqdR1BycNFeK9qf4_DkY6OX6anC77pwceLQbRckWF3wwTBodZPlFVaKlJf6Jg_L-R2NuPZ6xPQxluMOhnKwIGUtrcd0qvI7o9dQioXZChqF5aM-MqSqd2fW7Ou3-CIpg8_2Pj3MyXwD7lHtfebmn2Q0ouw01eiiTnMygPwAvQVnjQ3X46yNx3xoAC6As-FrFao59c' },
    { id: 'p2', name: 'CRYSTAL LITE', price: 320, primary_image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0NQL76kz7Cf9S-xGZBpeOQ8pTFn0frAz022U8ukKRZCqMM70UXup8e1M37n2RPFhShg-JnAHil0QzPXKe1-qLgyZSBtvm21uU9RBqZzIQG4cWxDV4ujkAix-h-ZyYLuqv3Gylbc6ayY8HoRoRccaPvv5EsNEvrXxF10rkw07j1efxXKD6gO5rIrNAmquDNN-TIx2e9znXmIGqOu95DujTN_YJ5r-y13jng3Lhp9n2sfA5YQSv0nYLa8vOSCZvYrNPR9tknktVu6M' },
    { id: 'p3', name: 'BOUHAUS ROUND', price: 275, primary_image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3WcmlmrsaUezzzf1uvNnjr0Hgoi_xraZn5gA_xo5xDP5GsMLQ3pN9cOhP8w2NT7J94jGj_D1rzO6ayNVJQuNX-f7-5t50FLonGd1M46kxpR7Z6CVzjMkuU5gIKLQ_iTPRfw0UfeBuN624UgeVJ1hIXIu2npMDOjrO96__CoWtLAZJDl4NSRUPhbWNmsv8FCqRKcZjmkFawSDsZZ17efdwQcdRRhTJ9pUcdb3GGwbRhTV42GnzYTz7XnjWTEmLyVsNj0xAunMtz98' },
    { id: 'p4', name: 'LINEAR GOLD', price: 410, primary_image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvmQ6ZHy5xrwiS5xrFkujTK6qNXlI_OxiXPXwX4z41Bnz5fCwZ-G2DbZiTEjzO7kKyaY08-1IAxboCkQEvigoWOTa1a-ZSLCoSlJ-yvkiMfDmiC-KvASQDIghrRz_4QJiR4X5XI-6WuCyD258jXC6HKdr-rbqEtDfFIM1oTr0OxWC0f67fbb7JWzkSodjsLwA4qjK6YxMFMCnXsyEYQedmwsGQvIphTLEIn8_7MeU8jAO49expZY51k9MUnRXDXq10qFMH0C9xIuc' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
      {displayProducts.map((p: any) => (
        <div key={p.id} className="bg-surface p-8 group transition-all duration-500 hover:bg-surface-container-low">
          <div className="relative aspect-square mb-8 overflow-hidden">
            <Image
              src={p.primary_image || "/placeholder.png"}
              alt={p.name}
              fill
              className="object-contain grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
            />
          </div>
          <h4 className="font-medium text-center uppercase tracking-tight">{p.name}</h4>
          <p className="text-secondary text-sm text-center mt-2 font-semibold tracking-tighter">₹{p.price}</p>
          <Link 
            href={`/product/${p.slug || p.id}`}
            className="mt-4 block text-[10px] text-center uppercase tracking-widest text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity underline underline-offset-4"
          >
            View Specs
          </Link>
        </div>
      ))}
    </div>
  );
}

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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {/* Category Items */}
                      {content.items?.map((cat: any, i: number) => (
                        <Link href={cat.href || "/products"} key={cat.name} className="group relative overflow-hidden bg-surface aspect-[4/5] mt-0 md:mt-0">
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
              return (
                <section key={section.id} className="py-32 bg-surface-container">
                  <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
                    <div className="text-center max-w-2xl mx-auto mb-20">
                      <h2 className="text-5xl font-serif mb-6">{content.title || "Modern Minimalist"}</h2>
                      <p className="text-on-surface-variant">{content.subtitle || "Stripped of excess. Defined by structure. The ultimate expression of industrial optical design."}</p>
                    </div>
                    <FeaturedProductsGrid />
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
