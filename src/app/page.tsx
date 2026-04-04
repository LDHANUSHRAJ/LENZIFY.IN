"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight, Star, ShieldCheck, Truck, RotateCcw, Zap, Eye, MapPin } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      title: "PAYDAY SALE",
      subtitle: "Styles Starting @ ₹500",
      description: "EXTENDED | Ends In 2 Days",
      image: "https://static1.lenskart.com/media/desktop/img/Apr22/Banner-Web.jpg",
      bg: "bg-[#e8f1f5]"
    },
    {
      title: "FREE LENS REPLACEMENT",
      subtitle: "Any Frame | Any Power",
      description: "LIMITED TIME: 100% OFF LENSES",
      image: "https://static1.lenskart.com/media/desktop/img/rebrand/HomeBanner.jpg",
      bg: "bg-brand-navy"
    },
    {
      title: "ITALIAN ARTISTRY",
      subtitle: "The Zenith Collection",
      description: "NEW ARRIVALS: STARTING @ ₹4,500",
      image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1600",
      bg: "bg-[#f4f7f9]"
    }
  ];

  useEffect(() => {
     const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
     }, 5000);
     return () => clearInterval(timer);
  }, []);

  const categories = [
    { name: "Eyeglasses", img: "https://static1.lenskart.com/media/desktop/img/Apr21/Eyeglasses.png" },
    { name: "Sunglasses", img: "https://static1.lenskart.com/media/desktop/img/Apr21/Sunglasses.png" },
    { name: "Computer Glasses", img: "https://static1.lenskart.com/media/desktop/img/Apr21/ComputerGlasses.png" },
    { name: "Contact Lenses", img: "https://static1.lenskart.com/media/desktop/img/Apr21/ContactLenses.png" },
    { name: "Power Sunglasses", img: "https://static1.lenskart.com/media/desktop/img/Apr21/PowerSunglasses.png" },
    { name: "Kids Glasses", img: "https://static1.lenskart.com/media/desktop/img/Apr21/KidsGlasses.png", badge: "NEW" },
    { name: "Sale", img: "https://static1.lenskart.com/media/desktop/img/Apr21/Sale.png", badge: "60% OFF" },
  ];

  const shapes = [
    { name: "Rectangle", img: "https://static.lenskart.com/media/desktop/img/sep21/rectangle.png" },
    { name: "Cateye", img: "https://static.lenskart.com/media/desktop/img/sep21/cateye.png" },
    { name: "Aviator", img: "https://static.lenskart.com/media/desktop/img/sep21/aviator.png" },
    { name: "Geometric", img: "https://static.lenskart.com/media/desktop/img/sep21/geometric.png" },
    { name: "Round", img: "https://static.lenskart.com/media/desktop/img/sep21/round.png" },
    { name: "Clubmaster", img: "https://static.lenskart.com/media/desktop/img/sep21/clubmaster.png" },
    { name: "Square", img: "https://static.lenskart.com/media/desktop/img/sep21/square.png" },
  ];

  return (
    <main className="bg-white pt-[50px] lg:pt-[105px]">
      
      {/* 1. Hero Multi-Banner Slider (Auto-playing) */}
      <section className="relative h-[250px] lg:h-[450px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className={`absolute inset-0 flex items-center justify-between px-6 lg:px-32 ${heroSlides[currentSlide].bg}`}
          >
             <div className="max-w-xl z-20">
                <span className="text-brand-navy font-black text-sm lg:text-2xl tracking-tighter mb-1 block">{heroSlides[currentSlide].title}</span>
                <p className="text-2xl lg:text-6xl font-black text-brand-navy mb-3 lg:mb-6 tracking-tighter uppercase italic leading-[0.9]">{heroSlides[currentSlide].subtitle}</p>
                <div className="bg-brand-navy text-white px-3 py-1.5 lg:px-5 lg:py-2 text-[10px] lg:text-sm font-black inline-block mb-8 rounded-sm tracking-widest shadow-lg">
                   {heroSlides[currentSlide].description}
                </div>
                <div>
                   <Link href="/products" className="bg-brand-navy text-white px-10 py-3 lg:px-14 lg:py-4 rounded-full font-black text-[10px] lg:text-xs uppercase tracking-[0.2em] hover:bg-brand-gold transition-all shadow-xl">Deploy View</Link>
                </div>
             </div>
             <div className="relative w-1/2 h-full hidden md:block">
                <Image 
                  src={heroSlides[currentSlide].image} 
                  alt="Slide" 
                  fill 
                  className="object-contain" 
                  priority 
                />
             </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Carousel Controls */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-30">
           {heroSlides.map((_, i) => (
             <button key={i} onClick={() => setCurrentSlide(i)} className={`h-1 rounded-full transition-all border border-brand-navy/20 ${currentSlide === i ? "bg-brand-navy w-12" : "bg-brand-navy/10 w-6"}`} />
           ))}
        </div>
      </section>

      {/* 2. Top Categories (Lenskart Styled Exact) */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
             <h2 className="text-xl font-black text-brand-navy uppercase tracking-tighter italic">Top Categories</h2>
             <Link href="/products" className="text-[10px] font-black uppercase text-brand-gold tracking-widest border-b border-brand-gold/20 pb-1">Browse All</Link>
          </div>
          <div className="flex lg:justify-between items-start gap-12 overflow-x-auto no-scrollbar py-6">
             {categories.map((cat, i) => (
               <Link href="/products" key={i} className="flex flex-col items-center gap-4 group min-w-[140px] text-center">
                  <div className="relative w-24 h-24 lg:w-36 lg:h-36 bg-[#f8f9fa] rounded-full p-6 group-hover:shadow-[0_20px_40px_rgba(30,27,110,0.1)] transition-all flex items-center justify-center border border-brand-navy/5 group-hover:border-brand-navy/20 overflow-hidden">
                     <Image src={cat.img} alt={cat.name} width={120} height={120} className="object-contain transform group-hover:scale-110 transition-transform duration-700" />
                     {cat.badge && (
                       <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-[#0000ff] text-white text-[8px] font-black px-3 py-1 rounded-full whitespace-nowrap shadow-xl">
                          {cat.badge}
                       </div>
                     )}
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-widest text-brand-navy/60 group-hover:text-brand-navy transition-all duration-500">{cat.name}</span>
               </Link>
             ))}
          </div>
        </div>
      </section>

      {/* 3. FREE LENSE REPLACEMENT Banner (The "Crazy" Professional Version) */}
      <section className="bg-brand-navy py-24 px-6 relative overflow-hidden group">
         <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent z-10" />
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16 relative z-20">
            <div className="max-w-2xl">
               <span className="text-brand-gold font-black text-[10px] uppercase tracking-[0.5em] mb-6 block opacity-60">Visual Empowerment</span>
               <h2 className="text-5xl lg:text-[6.5rem] font-black text-white leading-[0.85] mb-8 italic tracking-tighter uppercase">
                  Zero-Cost <br /> <span className="text-transparent border-b-4 border-brand-gold/30">Lens Matrix</span>
               </h2>
               <p className="text-white text-lg lg:text-xl font-bold tracking-widest opacity-40 uppercase mb-12">
                  Any Frame | Any Power | Any Visionary
               </p>
               <button className="flex items-center gap-6 group/btn">
                  <div className="w-16 h-16 rounded-full bg-brand-gold flex items-center justify-center group-hover/btn:bg-white transition-all duration-500">
                     <Zap size={20} className="text-brand-navy animate-pulse" />
                  </div>
                  <span className="text-white text-[10px] font-black uppercase tracking-[0.3em]">Redeem Protocol</span>
               </button>
            </div>
            <div className="relative w-full max-w-xl aspect-[16/10] group-hover:scale-105 transition-transform duration-[2s]">
               <Image 
                  src="https://static5.lenskart.com/media/desktop/img/rebrand/HomeBanner.jpg" 
                  alt="Lenses" 
                  fill 
                  className="object-contain mix-blend-screen scale-125" 
               />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[120%] h-[120%] bg-brand-navy-light rounded-full blur-[150px] opacity-40 -translate-x-1/2" />
               </div>
            </div>
         </div>
         {/* Kinetic Particles (Placeholder visual layer) */}
         <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none overflow-hidden">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[30vw] text-white italic font-black whitespace-nowrap">ZENITH VERTICAL</div>
         </div>
      </section>

      {/* 4. Get the Perfect Shape Grid (1:1 UI) */}
      <section className="py-32 px-6 bg-[#fcfcfc] border-b border-brand-navy/5">
        <div className="max-w-7xl mx-auto text-center">
           <span className="text-brand-navy/20 font-black text-[10px] uppercase tracking-[0.6em] mb-4 block">Morphology Selection</span>
           <h2 className="text-3xl font-black text-brand-navy mb-20 italic uppercase tracking-tighter">Get the perfect shape <span className="text-brand-navy/40">—</span> Eyeglasses</h2>
           <div className="flex flex-wrap justify-center gap-12 lg:gap-24">
              {shapes.map((shape, i) => (
                <div key={i} className="flex flex-col items-center gap-8 group cursor-pointer">
                   <div className="relative w-24 h-24 lg:w-40 lg:h-40 bg-white rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.03)] group-hover:shadow-[0_40px_80px_rgba(30,27,110,0.12)] transition-all duration-[0.8s] flex items-center justify-center p-8 border border-brand-navy/5 group-hover:border-brand-navy/20 overflow-hidden">
                      <div className="absolute inset-0 bg-brand-navy/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Image src={shape.img} alt={shape.name} width={100} height={50} className="relative z-10 object-contain opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-[0.8s] group-hover:rotate-6" />
                   </div>
                   <span className="text-[10px] font-black uppercase text-brand-navy/40 tracking-[0.4em] group-hover:text-brand-navy group-hover:tracking-[0.6em] transition-all duration-700">{shape.name}</span>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 5. Premium Eyewear MATRIX (Brand Grid Luxe) */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
           <div className="flex justify-between items-end mb-20 border-b border-brand-navy/5 pb-12">
              <div>
                 <h2 className="text-5xl font-black text-brand-navy uppercase tracking-tighter italic">Premium <span className="text-brand-navy/20 not-italic">Archive</span></h2>
                 <p className="text-brand-navy/40 text-[10px] font-black uppercase tracking-[0.4em] mt-4">Global Curations • Seasonal Drops</p>
              </div>
              <Link href="/brand-portfolio" className="bg-brand-navy text-white px-8 py-3 text-[9px] font-black uppercase tracking-widest hover:bg-brand-gold transition-all">View All Labs</Link>
           </div>
           
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { name: "MELLER", origin: "Made in Spain", span: "row-span-2 col-span-2", img: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800" },
                { name: "JOHN JACOBS", origin: "Made in India", img: "https://static1.lenskart.com/media/desktop/img/Apr22/JJ-Web.jpg" },
                { name: "OWNDAYS", origin: "Made in Japan", img: "https://static1.lenskart.com/media/desktop/img/Apr22/Owndays-Web.jpg" },
                { name: "VINCENT CHASE", origin: "Made in Italy", img: "https://static1.lenskart.com/media/desktop/img/Apr22/VC-Web.jpg" },
                { name: "FOSSIL", origin: "U.S. Luxury", img: "https://static1.lenskart.com/media/desktop/img/Apr22/Fossil-Web.jpg" },
              ].map((brand, i) => (
                <div 
                  key={i} 
                  className={`group relative overflow-hidden rounded-[2.5rem] bg-[#f4f7f9] shadow-2xl ${brand.span || ""}`}
                >
                   <Image src={brand.img} alt={brand.name} fill className="object-cover group-hover:scale-110 transition-transform duration-[3s]" />
                   <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-brand-navy/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-[1s]" />
                   <div className="absolute inset-0 border border-white/5 m-4 rounded-[2rem]" />
                   
                   <div className="absolute bottom-0 left-0 p-10 w-full z-20">
                      <h3 className="text-2xl lg:text-4xl font-black text-white mb-2 tracking-tighter">{brand.name}</h3>
                      <p className="text-[10px] font-black text-brand-gold uppercase tracking-[0.5em]">{brand.origin}</p>
                      
                      <button className="mt-8 flex items-center gap-4 text-white hover:text-brand-gold transition-colors">
                         <span className="text-[9px] font-black uppercase tracking-widest">Inscribe</span>
                         <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                      </button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 6. #Trending section (Lifestyle Feed) */}
      <section className="py-32 px-6 bg-brand-navy overflow-hidden">
         <div className="max-w-7xl mx-auto flex flex-col items-center">
            <h2 className="text-4xl lg:text-7xl font-black text-white mb-20 italic uppercase tracking-tighter text-center leading-[0.85]">
               #Trending <br /> <span className="text-brand-gold">at Lenzify</span>
            </h2>
            <div className="flex gap-10 min-w-max animate-marquee">
               {[
                 "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800",
                 "https://images.unsplash.com/photo-1591076482161-42ce6ebaa410?q=80&w=800",
                 "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800",
                 "https://images.unsplash.com/photo-1493863641943-9b68991a8d07?q=80&w=800",
                 "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800",
               ].map((img, i) => (
                 <div key={i} className="relative w-[300px] lg:w-[450px] aspect-[4/5] rounded-[2rem] overflow-hidden group border border-white/5 hover:border-brand-gold/30 transition-all duration-700">
                    <Image src={img} alt="Trending" fill className="object-cover group-hover:scale-110 transition-transform duration-[2s]" />
                    <div className="absolute inset-0 bg-brand-navy/10 group-hover:bg-brand-navy/0 transition-all" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
                       <Eye size={40} className="text-white" />
                    </div>
                 </div>
               ))}
               {/* Duplicate for marquee continuity */}
               {[
                 "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800",
                 "https://images.unsplash.com/photo-1591076482161-42ce6ebaa410?q=80&w=800",
                 "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800",
               ].map((img, i) => (
                 <div key={i} className="relative w-[300px] lg:w-[450px] aspect-[4/5] rounded-[2rem] overflow-hidden group">
                    <Image src={img} alt="Trending" fill className="object-cover" />
                 </div>
               ))}
            </div>
         </div>
      </section>

    </main>
  );
}
