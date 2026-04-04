"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ParticleBackground from "@/components/three/ParticleBackground";
import FloatingFrame from "@/components/three/FloatingFrame";
import GlowButton from "@/components/ui/GlowButton";
import Magnetic from "@/components/ui/Magnetic";
import { products } from "@/data/products";
import { ArrowUpRight, ArrowRight, MousePointer2, ChevronRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef(null);
  const textSectionsRef = useRef<HTMLDivElement[]>([]);

  useGSAP(() => {
    // Scroll-driven text animations for the massive words
    textSectionsRef.current.forEach((section) => {
      if (!section) return;

      const word = section.querySelector("h2");
      const bg = section.querySelector(".parallax-bg");

      gsap.fromTo(word,
        { opacity: 0, scale: 0.8, y: 100 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.5,
          ease: "expo.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          }
        }
      );

      gsap.to(bg, {
        yPercent: -40,
        scale: 1.5,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          scrub: true,
        }
      });
    });

    // Cinematic category transitions
    const categories = gsap.utils.toArray(".category-section");
    categories.forEach((cat: any, i) => {
      const title = cat.querySelector("h3");
      const images = cat.querySelectorAll(".floating-img");

      gsap.to(title, {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: cat,
          scrub: 1,
          start: "top bottom",
          end: "bottom top",
        }
      });

      images.forEach((img: any, idx: number) => {
        gsap.to(img, {
          yPercent: -20 * (idx + 1),
          rotate: idx % 2 === 0 ? 5 : -5,
          ease: "none",
          scrollTrigger: {
            trigger: cat,
            scrub: 2,
          }
        });
      });

      ScrollTrigger.create({
        trigger: cat,
        start: "top center",
        onEnter: () => gsap.to("body", { backgroundColor: i % 2 === 0 ? "#050505" : "#0B1C2D", duration: 1.5 }),
        onEnterBack: () => gsap.to("body", { backgroundColor: i % 2 === 0 ? "#050505" : "#0B1C2D", duration: 1.5 }),
      });
    });
  }, { scope: containerRef });

  const addToTextRefs = (el: HTMLDivElement | null) => {
    if (el && !textSectionsRef.current.includes(el)) {
      textSectionsRef.current.push(el);
    }
  };

  return (
    <div ref={containerRef} className="relative bg-[#0B1C2D] transition-colors duration-1000 selection:bg-brand-electric selection:text-white">
      <ParticleBackground />

      {/* Hero Section - Immersive 3D */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <FloatingFrame />
        </div>

        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-[12vw] md:text-[10vw] font-black leading-[0.75] uppercase tracking-tighter text-white italic mb-10">
              SEE VISION <br />
              <span className="hero-text-stroke opacity-60">DIFFERENTLY</span>
            </h1>
            <p className="text-white/40 text-sm md:text-xl max-w-xl mx-auto font-black tracking-[0.4em] uppercase mb-16">
              Engineering the Future of Optics
            </p>

            <div className="flex flex-col md:flex-row gap-10 justify-center items-center">
              <Magnetic>
                <Link href="/spectacles">
                  <GlowButton className="text-xl px-16 py-8">
                    Explore Collection
                  </GlowButton>
                </Link>
              </Magnetic>
              <div className="flex items-center gap-4 text-white/20 uppercase text-[10px] font-black tracking-[0.5em] animate-pulse">
                <MousePointer2 size={16} />
                Inertial Scroll to Immerse
              </div>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 p-2 glass-morphism rounded-full border-white/5">
          <div className="w-1 h-12 bg-gradient-to-b from-brand-electric to-transparent rounded-full" />
        </div>
      </section>

      {/* Massive Typography Sections */}
      <div className="relative z-10 pointer-events-none">
        {["PRECISION.", "STYLE.", "CLARITY."].map((text, i) => (
          <section key={text} ref={addToTextRefs} className="h-screen flex items-center justify-center overflow-hidden">
            <div className={`parallax-bg absolute inset-0 -z-10 opacity-20 blur-[150px] rounded-full scale-150 ${i === 1 ? 'bg-brand-highlight' : 'bg-brand-electric'}`} />
            <h2 className="text-[25vw] font-extrabold italic uppercase leading-none text-white/5 cursor-default select-none tracking-tighter">
              {text}
            </h2>
          </section>
        ))}
      </div>

      {/* Category Transitions Section - Improved Depth */}
      <section className="category-section relative min-h-screen py-60 px-12 overflow-hidden bg-transparent">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center z-0">
          <h3 className="text-[20vw] font-black uppercase italic text-white/5 leading-none">SPECTACLES</h3>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-40 relative z-10">
          {products.filter(p => p.category === 'spectacles').slice(0, 2).map((p, i) => (
            <div key={p.id} className={`floating-img relative aspect-square group ${i % 2 === 0 ? 'mt-20' : '-mt-20'}`}>
              <Link href={`/product/${p.id}`}>
                <div className="absolute inset-0 glass-card rounded-[40px] border-none flex flex-col justify-end p-12 overflow-hidden shadow-2xl">
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-electric/10 blur-3xl rounded-full group-hover:bg-brand-electric/30 smooth-transition" />
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 smooth-transition"
                  />
                  <div className="relative z-10">
                    <span className="text-brand-electric text-[10px] font-black uppercase tracking-[0.5em]">{p.brand}</span>
                    <h4 className="text-4xl font-black italic uppercase mt-2">{p.name}</h4>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="category-section relative min-h-screen py-60 px-12 overflow-hidden bg-[#050505]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center z-0">
          <h3 className="text-[20vw] font-black uppercase italic text-white/5 leading-none">LENSES</h3>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-40 relative z-10">
          {products.filter(p => !p.category || p.category === 'lenses').slice(0, 2).map((p, i) => (
            <div key={p.id} className={`floating-img relative aspect-square group ${i % 2 !== 0 ? 'mt-20' : '-mt-20'}`}>
              <Link href={`/product/${p.id}`}>
                <div className="absolute inset-0 glass-card rounded-[40px] border-none flex flex-col justify-end p-12 overflow-hidden shadow-2xl">
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-highlight/10 blur-3xl rounded-full group-hover:bg-brand-highlight/30 smooth-transition" />
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 smooth-transition"
                  />
                  <div className="relative z-10">
                    <span className="text-brand-highlight text-[10px] font-black uppercase tracking-[0.5em]">TECH SERIES</span>
                    <h4 className="text-4xl font-black italic uppercase mt-2">{p.name}</h4>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Profile / Dashboard Quick Access */}
      <section className="py-60 px-12 flex flex-col items-center justify-center text-center">
        <h2 className="text-6xl md:text-[10vw] font-black uppercase italic tracking-tighter mb-20 leading-[0.8]">UNLIMITED <br /> VISION</h2>
        <Magnetic>
          <Link href="/profile">
            <button className="group relative px-20 py-10 glass-morphism rounded-full overflow-hidden border-white/5 border">
              <div className="absolute inset-0 bg-brand-electric/20 translate-y-full group-hover:translate-y-0 smooth-transition" />
              <span className="relative z-10 text-3xl font-black uppercase italic flex items-center gap-6">
                Enter Protocol <ArrowUpRight size={32} className="group-hover:translate-x-2 group-hover:-translate-y-2 smooth-transition" />
              </span>
            </button>
          </Link>
        </Magnetic>
      </section>

      {/* Kinetic Marquee */}
      <div className="py-20 overflow-hidden border-y border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="kinetic-text text-[10vw] text-white/5 italic font-black">
          PRECISION OPTICS &nbsp; LUXURY FRAMES &nbsp; NEURAL LENSES &nbsp; LENZIFY ELITE &nbsp;
          PRECISION OPTICS &nbsp; LUXURY FRAMES &nbsp; NEURAL LENSES &nbsp; LENZIFY ELITE &nbsp;
        </div>
      </div>
    </div>
  );
}
