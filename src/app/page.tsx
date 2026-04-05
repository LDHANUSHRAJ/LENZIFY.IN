"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useCartStore } from "@/store/cartStore";
import { cn } from "@/lib/utils";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, [supabase.auth]);

  const handleProtectedAction = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      router.push(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return false;
    }
    return true;
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: [] } as any
  };

  const categories = [
    { 
      name: "The Heritage Series", 
      subtitle: "Classic silhouettes, reimagined.", 
      img: "/heritage_spectacles_editorial_1775377795216.png", 
      href: "/products?collection=heritage",
      size: "large"
    },
    { 
      name: "Modern Minimalist", 
      subtitle: "Stripping back to the essentials.", 
      img: "/modern_minimalist_spectacles_editorial_1775379062591.png", 
      href: "/products?collection=minimalist",
      size: "small"
    },
    { 
      name: "Avant-Garde", 
      subtitle: "Daring frames for the visionary.", 
      img: "/avant_garde_spectacles_editorial_1775377885089.png", 
      href: "/products?collection=avant-garde",
      size: "small"
    }
  ];

  return (
    <div className="flex flex-col w-full bg-surface">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-44 pb-20">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-surface-container/30"></div>
          <Image 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAryKkyXIXhUlJ6LOOQ5MAratIAmRPCbNcTtgeeMAQglZiE5kqNu7vFY7pRf-Pe5vvWEAvyd6k9Ci6R6R0fcQJhLG9zhlkOFbC5tk27gztLljp0k3lazeS3yiVYyBq1r73e_VIQ8mzOuoaTKBcTtM3DsdHSDuglaoeAJ9YB0ihE9bIFlGrPs5pbS5Qtfr0t8Lvl_WXEWWvK2kuZNA8WenXBQlmtW6BgrV-2fo1DAZdrJOWAW-wKHuAqICnZYUbKc0ZAHvnN0oYa9jc" 
            alt="Editorial Vision" 
            fill
            className="object-cover object-center scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/40 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-screen-2xl mx-auto px-8 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [] } as any}
            className="lg:col-span-12 space-y-8"
          >
            <div className="space-y-4">
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-xs font-bold uppercase tracking-[0.4em] text-secondary"
              >
                Visionary Editorial
              </motion.p>
              <h1 className="text-7xl md:text-[10rem] font-serif tracking-tighter leading-[0.8] mb-8 text-primary">
                Excellence<br/>
                <span className="italic ml-8 md:ml-24">In Every</span><br/>
                Frame.
              </h1>
            </div>
            
            <div className="flex flex-col md:flex-row items-start gap-12 pt-8">
              <div className="max-w-md space-y-6">
                <p className="text-sm md:text-base text-on-surface-variant font-medium leading-relaxed tracking-wide">
                  Experience the future of vision. Engineering precision optics with high-fashion editorial aesthetics. Our lenses are crafted for those who see beyond the ordinary.
                </p>
                <div className="flex gap-4">
                  <Link href="/products" className="px-10 py-5 bg-primary text-white font-bold rounded-lg hover:opacity-80 transition-all uppercase tracking-widest text-[10px]">
                    Shop Collection
                  </Link>
                  <Link href="/try-at-home" className="px-10 py-5 border border-primary/20 bg-white/50 backdrop-blur-md text-primary font-bold rounded-lg hover:bg-white transition-all uppercase tracking-widest text-[10px]">
                    Virtual Fitting
                  </Link>
                </div>
              </div>
              <div className="hidden lg:block pt-12">
                <div className="w-1 px-8 py-24 border-r border-outline/20"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Curated Categories - Bento Grid */}
      <section className="py-32 px-8 md:px-12">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex justify-between items-end mb-20">
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-[0.4em] text-secondary">The Collection</p>
              <h2 className="text-5xl font-serif tracking-tight">Curated Categories</h2>
            </div>
            <Link href="/products" className="text-[10px] font-bold uppercase tracking-widest border-b border-primary pb-2 hover:opacity-60 transition-opacity">
              View All Catalogue
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat, i) => (
              <motion.div 
                key={cat.name}
                {...fadeInUp}
                transition={{  } as any}
                className={cn(
                  "relative group overflow-hidden bg-surface-container-low rounded-xl",
                  cat.size === "large" ? "md:col-span-2 lg:col-span-2 aspect-[21/9]" : "aspect-[3/4]"
                )}
              >
                <Link href={cat.href} className="block w-full h-full">
                  <Image 
                    src={cat.img} 
                    alt={cat.name} 
                    fill 
                    className="object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-1000 grayscale group-hover:grayscale-0" 
                  />
                  <div className="absolute inset-x-0 bottom-0 p-12 bg-gradient-to-t from-surface/80 via-surface/20 to-transparent">
                    <h3 className="text-3xl font-serif italic mb-2">{cat.name}</h3>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface/60">{cat.subtitle}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Heritage Series - Asymmetric Layout */}
      <section className="py-32 bg-primary text-white overflow-hidden">
        <div className="max-w-screen-2xl mx-auto px-8 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-6">
              <p className="text-xs font-bold uppercase tracking-[0.4em] text-secondary">Editorial Focus</p>
              <h2 className="text-6xl font-serif leading-[1.1] italic">
                The Heritage<br/> Series.
              </h2>
              <p className="text-base text-outline leading-relaxed tracking-wide font-medium">
                Our Heritage Series draws inspiration from archival silhouttes, meticulously engineered with modern aerospace titanium and precision-ground Japanese lenses. A testament to timeless craftsmanship.
              </p>
            </div>
            <Link href="/products?collection=heritage" className="inline-block px-12 py-6 border border-white/20 rounded-lg hover:bg-white hover:text-primary transition-all text-[10px] font-bold uppercase tracking-widest">
              Explore The Legacy
            </Link>
          </div>
          <div className="lg:col-span-7 relative">
            <motion.div 
               whileInView={{ x: [0, -20, 0], y: [0, 10, 0] }}
               transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
               className="relative z-10 aspect-video rounded-2xl overflow-hidden bg-surface-container-highest/10"
            >
              <Image 
                src="/heritage_series_detail_shot_1775377923477.png" 
                alt="Heritage Series" 
                fill
                className="object-contain p-12"
              />
            </motion.div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-white/5 rounded-full pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* Modern Minimalist */}
      <section className="py-48 px-8 md:px-12 text-center">
        <div className="max-w-4xl mx-auto space-y-12">
          <motion.div {...fadeInUp} className="space-y-6">
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-secondary">Craftsmanship</p>
            <h2 className="text-6xl font-serif">Modern Minimalist</h2>
            <p className="text-lg text-on-surface-variant font-medium max-w-2xl mx-auto leading-relaxed italic">
              "True sophistication lies in the removal of the unnecessary."
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
             <div className="aspect-[4/5] bg-surface-container-low rounded-xl overflow-hidden relative group">
                <Image 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTALpYDue6PV1lQ2jHeFCeDpS_JSiS7Chdgn5ZHaPwG12qlD6sdCNS6sVK_JFyixeGD71yI9LVZo5U8b1bycfZXoVpH-rNbvq_FRasYNCmktGpWbzZFQaR-IQSimRMrsPhijyso7W8SQ7xlu9XblqJWvf0jq8F12AQ8JBWam372QqJzDU0d72bvC1wYI8mJANxlQY0FzQYllZ2usC_v1WouOJ3brD342lj_29B_Dv23wZr6O8sC6ii-GjzoIPtEgndVnMQgVv1_Ak" 
                  alt="Minimalist A" 
                  fill 
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                />
             </div>
             <div className="aspect-[4/5] bg-surface-container-low rounded-xl overflow-hidden relative group md:mt-24">
                <Image 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgn8Gq6_Z6ttFUH1I6nTz6lUWUI5CMy9afDvxjoDaFaPrvC8V6Tu5QNov5GxwINLv4Pjs8A8UXFfw542n3Hq_C4zzwJCzHCDj1RpixgVb9Vwk858bXowvgrXdCYovOc_S5DM6pa6RoFvBp2AzNQiBxhL__wXjzfetE2WEcteQ_qI81F3gpUYyTFvkI6fOZj4cZOiirWnzWTCs1YQycPi1QRGJmB9lgK3DtVPPCuJd7WkPSMQ1Ty_HLfSwTu8qKIuqqeAAE9Oe04LY" 
                  alt="Minimalist B" 
                  fill 
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                />
             </div>
          </div>
        </div>
      </section>

      {/* Virtual Fitting Room CTA */}
      <section className="py-32 px-8">
        <motion.div 
          {...fadeInUp}
          className="max-w-screen-2xl mx-auto bg-surface-container-high rounded-[2.5rem] overflow-hidden relative min-h-[500px] flex items-center p-12 md:p-24"
        >
          <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-primary/5"></div>
             <div className="absolute top-0 right-0 w-1/2 h-full border-l border-outline/10"></div>
          </div>
          <div className="relative z-10 max-w-2xl space-y-8">
             <h2 className="text-5xl md:text-7xl font-serif tracking-tight text-primary">
                Experience Vision.<br/>
                <span className="italic">Virtually.</span>
             </h2>
             <p className="text-on-surface-variant font-medium tracking-wide">
                Our AI-powered Virtual Fitting Room uses medical-grade spatial mapping to ensure your selected frames complement your facial structure perfectly.
             </p>
             <Link href="/try-at-home" className="inline-flex items-center gap-4 px-12 py-6 bg-primary text-white rounded-lg hover:opacity-80 transition-all text-[10px] font-bold uppercase tracking-widest">
                Start Fitting <span className="material-symbols-outlined">center_focus_strong</span>
             </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
