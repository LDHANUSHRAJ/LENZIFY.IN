"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";

function LetterReveal({
  text,
  delay = 0,
  className = "",
  style = {},
}: {
  text: string;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span className={className} style={{ display: "block", ...style }}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          style={{ display: "inline-block" }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.035,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {char === " " ? " " : char}
        </motion.span>
      ))}
    </span>
  );
}

export default function HomeHero() {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20 });
  const rotateX = useTransform(springY, [-300, 300], [4, -4]);
  const rotateY = useTransform(springX, [-500, 500], [-6, 6]);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const scrollDown = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <section
      className="relative w-full min-h-screen overflow-hidden flex flex-col items-center justify-center"
      style={{
        background:
          "linear-gradient(135deg, #020229 0%, #02104A 25%, #042F80 60%, #0097FF 85%, #00D4FF 100%)",
      }}
    >
      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(0,175,255,0.20) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-1/4 right-1/3 w-80 h-80 rounded-full blur-3xl"
          style={{ background: "rgba(0,216,255,0.08)" }}
        />
        <div
          className="absolute bottom-1/3 left-1/4 w-60 h-60 rounded-full blur-3xl"
          style={{ background: "rgba(0,151,255,0.08)" }}
        />
      </div>

      {/* Floating particles */}
      {mounted &&
        [...Array(18)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: i % 3 === 0 ? 3 : 2,
              height: i % 3 === 0 ? 3 : 2,
              left: `${8 + ((i * 5.3) % 84)}%`,
              top: `${6 + ((i * 7.9) % 86)}%`,
              background:
                i % 2 === 0
                  ? "rgba(0,212,255,0.45)"
                  : "rgba(255,255,255,0.25)",
            }}
            animate={{ y: [-8, 8, -8], opacity: [0.3, 0.8, 0.3] }}
            transition={{
              duration: 2.5 + (i % 4),
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        ))}

      {/* Content */}
      <div className="relative z-10 max-w-screen-2xl mx-auto px-6 lg:px-12 w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 pt-24 pb-16">
        {/* Left: Text */}
        <div className="flex-1 text-center lg:text-left">
          {/* Eyebrow */}
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="block text-[11px] font-black uppercase tracking-[0.5em] mb-8"
            style={{ color: "#00D4FF" }}
          >
            Lenzify.in — Premium Eyewear
          </motion.span>

          {/* Hero headline — Bodoni Moda italic */}
          <h1
            className="mb-10 text-left font-serif italic tracking-tighter"
            style={{
              fontWeight: 900,
              lineHeight: 0.9,
              fontSize: "clamp(42px, 5vw, 76px)",
            }}
          >
            <LetterReveal
              text="See The"
              delay={0.4}
              style={{
                color: "#FFFFFF",
                textShadow: "0 0 30px rgba(0,180,255,0.15)",
              }}
            />
            <LetterReveal
              text="World"
              delay={0.7}
              style={{
                background: "linear-gradient(90deg, #00D9FF, #0090FF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            />
            <LetterReveal
              text="Differently"
              delay={1.0}
              style={{
                color: "#FFFFFF",
                textShadow: "0 0 30px rgba(0,180,255,0.15)",
              }}
            />
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
            className="text-white/55 text-sm md:text-base leading-relaxed max-w-md mb-10 mx-auto lg:mx-0 font-medium"
          >
            Premium eyewear crafted for vision, style, and everyday comfort.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <Link
              href="/products"
              className="px-10 py-5 text-[11px] font-black uppercase tracking-[0.3em] text-[#020229] rounded-full transition-all duration-300 hover:scale-105 text-center"
              style={{
                background: "linear-gradient(135deg, #00D4FF, #00AFFF)",
                boxShadow: "0 0 30px rgba(0,212,255,0.35)",
              }}
            >
              Shop Collection
            </Link>
            <button
              suppressHydrationWarning
              onClick={() =>
                document.dispatchEvent(new CustomEvent("open-virtual-tryon"))
              }
              className="px-10 py-5 text-[11px] font-black uppercase tracking-[0.3em] text-white rounded-full border border-white/25 backdrop-blur-sm hover:border-[#00D4FF] hover:text-[#00D4FF] transition-all duration-300"
            >
              Virtual Try-On
            </button>
          </motion.div>
        </div>

        {/* Right: Floating product images with 3D parallax */}
        <motion.div
          className="flex-1 relative flex items-center justify-center h-[380px] md:h-[500px] lg:h-[580px] w-full"
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        >
          {/* Glow rings */}
          <div
            className="absolute w-80 h-80 md:w-96 md:h-96 rounded-full border border-[#00AFFF]/20"
            style={{ animation: "spin 20s linear infinite" }}
          />
          <div
            className="absolute w-56 h-56 md:w-72 md:h-72 rounded-full border border-[#00D4FF]/12"
            style={{ animation: "spin 14s linear infinite reverse" }}
          />

          {/* Left product */}
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-0 md:left-4 top-1/2 -translate-y-1/2"
          >
            <div
              className="w-40 h-28 md:w-52 md:h-32 rounded-2xl overflow-hidden relative border border-white/15"
              style={{ boxShadow: "0 20px 50px rgba(0,175,255,0.3)" }}
            >
              <Image
                src="https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=400&auto=format&fit=crop"
                alt="Sunglasses"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          </motion.div>

          {/* Center hero */}
          <motion.div
            animate={{ y: [8, -8, 8] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="relative z-10"
          >
            <div
              className="w-64 h-40 md:w-80 md:h-52 rounded-3xl overflow-hidden relative border border-white/20"
              style={{ boxShadow: "0 30px 80px rgba(0,175,255,0.45)" }}
            >
              <Image
                src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=600&auto=format&fit=crop"
                alt="Eyeglasses"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          </motion.div>

          {/* Right product */}
          <motion.div
            animate={{ y: [12, -12, 12] }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute right-0 md:right-4 top-1/2 -translate-y-1/2"
          >
            <div
              className="w-40 h-28 md:w-52 md:h-32 rounded-2xl overflow-hidden relative border border-white/15"
              style={{ boxShadow: "0 20px 50px rgba(0,212,255,0.3)" }}
            >
              <Image
                src="https://images.unsplash.com/photo-1591076482161-42ce6da69f67?q=80&w=400&auto=format&fit=crop"
                alt="Smart Glasses"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          </motion.div>

          {/* Floating badges */}
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-6 right-4 md:right-10 rounded-2xl px-5 py-4 border border-white/20"
            style={{
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)",
            }}
          >
            <p className="text-white text-[10px] font-black uppercase tracking-widest">
              500+ Frames
            </p>
            <p className="text-sm font-black mt-0.5" style={{ color: "#00D4FF" }}>
              In Stock
            </p>
          </motion.div>

          <motion.div
            animate={{ y: [5, -5, 5] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.8,
            }}
            className="absolute bottom-6 left-4 md:left-10 rounded-2xl px-5 py-4 border border-white/20"
            style={{
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)",
            }}
          >
            <p className="text-white text-[10px] font-black uppercase tracking-widest">
              AI Try-On
            </p>
            <p className="text-sm font-black mt-0.5" style={{ color: "#00D4FF" }}>
              Free
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        suppressHydrationWarning
        onClick={scrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer bg-transparent border-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">
          Scroll
        </span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>
          <ChevronDown className="w-5 h-5" style={{ color: "#00D4FF" }} />
        </motion.div>
      </motion.button>
    </section>
  );
}
