"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?q=80&w=2600&auto=format&fit=crop",
    heading: "Blue Light Defense",
    subtext: "Optimize your digital performance with our latest blue-cut technology, designed for the modern visionary.",
    ctaText: "View Technology",
    ctaLink: "/lenses/5e621f5d-7ad8-4c7e-854c-bbca08e78004",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=2600&auto=format&fit=crop",
    heading: "The Heritage Collection",
    subtext: "Timeless silhouettes reimagined. Experience the peak of optical craftsmanship.",
    ctaText: "Explore Now",
    ctaLink: "/products",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=2600&auto=format&fit=crop",
    heading: "Summer Solstice",
    subtext: "Precision-polarized lenses for unparalleled protection and clarity under the sun.",
    ctaText: "Shop Sunglasses",
    ctaLink: "/products?type=Sunglasses",
  },
];

export default function HomeCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "20%" : "-20%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "20%" : "-20%",
      opacity: 0,
    }),
  };

  return (
    <section className="relative w-full h-[75vh] md:h-[85vh] lg:h-[90vh] min-h-[600px] overflow-hidden bg-black">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "tween", duration: 0.8, ease: [0.22, 1, 0.36, 1] },
            opacity: { duration: 0.6 },
          }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Slide Image */}
          <div className="relative w-full h-full overflow-hidden">
            <motion.div
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              transition={{ duration: 7, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <Image
                src={SLIDES[current].image}
                alt={SLIDES[current].heading}
                fill
                priority
                className="object-cover object-center"
              />
            </motion.div>
            
            {/* Darker Side-Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
            
            {/* Content Container - Grouped for proper alignment */}
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-6 md:px-12 lg:px-24">
                <div className="pt-16 md:pt-24"> {/* Push whole block down below navbar */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 1 }}
                    className="max-w-2xl text-white space-y-6"
                  >
                    <div className="space-y-4">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: 60 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="h-1 bg-secondary"
                      />
                      <motion.p className="text-xs md:text-sm font-black uppercase tracking-[0.5em] text-white/50">
                        Premium Optical Experience
                      </motion.p>
                    </div>

                    <motion.h2 className="text-4xl md:text-6xl lg:text-7xl font-serif leading-[0.9] tracking-tighter">
                      {SLIDES[current].heading.split(' ').map((word, i) => (
                         <span key={i} className={i % 2 === 1 ? "block italic text-white/90" : "block"}>{word}</span>
                      ))}
                    </motion.h2>

                    <div className="space-y-8"> {/* Group subtext, progress, and button */}
                      <motion.p className="text-lg md:text-xl text-white/70 font-body max-w-md leading-relaxed">
                        {SLIDES[current].subtext}
                      </motion.p>

                      {/* Progress Indicator - Inside the text block for better alignment */}
                      <div className="flex items-center gap-6">
                        <div className="flex gap-3">
                          {SLIDES.map((_, index) => (
                            <div 
                              key={index}
                              className={`h-[2px] transition-all duration-700 ${
                                current === index ? "w-12 bg-secondary" : "w-6 bg-white/20"
                              }`} 
                            />
                          ))}
                        </div>
                        <span className="text-[10px] font-black text-white/30 tracking-widest">0{current + 1} / 0{SLIDES.length}</span>
                      </div>

                      <motion.div>
                        <Link
                          href={SLIDES[current].ctaLink}
                          className="group relative inline-flex items-center gap-6 px-12 py-6 bg-white text-black font-black uppercase tracking-widest text-[11px] hover:bg-secondary hover:text-white transition-all duration-700 overflow-hidden"
                        >
                          <span className="relative z-10">{SLIDES[current].ctaText}</span>
                          <ChevronRight size={16} className="relative z-10 group-hover:translate-x-2 transition-transform" />
                        </Link>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Manual Controls - Modern minimal arrows */}
      <div className="absolute bottom-12 right-12 flex gap-4 z-30">
        <button
          onClick={prevSlide}
          suppressHydrationWarning
          className="w-14 h-14 rounded-full border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all backdrop-blur-md"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          suppressHydrationWarning
          className="w-14 h-14 rounded-full border border-white/10 bg-white text-black flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-xl"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>

      </div>
    </section>
  );
}
