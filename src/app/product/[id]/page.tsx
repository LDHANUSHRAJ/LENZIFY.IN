"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { products as allProducts } from "@/data/products";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = allProducts.find(p => p.id === id);
  
  const [activeTab, setActiveTab] = useState<"craftsmanship" | "specs" | "heritage">("craftsmanship");
  const [selectedColor, setSelectedColor] = useState("Midnight Black");
  const [selectedLens, setSelectedLens] = useState("Premium Clear");
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  const router = useRouter();
  
  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, [supabase.auth]);

  const handleAddToCart = () => {
    if (!user) {
      router.push(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    if (product) addItem(product);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-serif italic text-primary mb-8 tracking-tighter">Archive Entry Not Found</h1>
        <Link href="/products" className="bg-primary text-white px-10 py-4 rounded-lg font-bold text-[10px] uppercase tracking-widest">Return to Catalogue</Link>
      </div>
    );
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: [] } as any
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen pt-24">
      {/* Breadcrumbs */}
      <nav className="max-w-screen-2xl mx-auto px-8 md:px-12 py-8">
         <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-on-surface/40">
           <Link href="/" className="hover:text-primary transition-colors">Home</Link>
           <span className="material-symbols-outlined text-[10px]">chevron_right</span>
           <Link href="/products" className="hover:text-primary transition-colors">Archive</Link>
           <span className="material-symbols-outlined text-[10px]">chevron_right</span>
           <span className="text-on-surface/80">{product.name}</span>
         </div>
      </nav>

      <main className="max-w-screen-2xl mx-auto px-8 md:px-12 pb-32">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-32 items-start">
          {/* Left: Visualization */}
          <div className="w-full lg:w-[55%] lg:sticky lg:top-32 space-y-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [] } as any}
              className="relative aspect-[4/5] bg-surface-container-low overflow-hidden group"
            >
              <Image 
                src={product.image} 
                alt={product.name} 
                fill 
                priority
                className="object-contain p-12 mix-blend-multiply grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" 
              />
              <div className="absolute top-8 left-8">
                 <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary italic">Editorial Visualization</p>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-square bg-surface-container/30 border border-outline/5 cursor-pointer hover:border-primary/20 transition-all p-4 grayscale hover:grayscale-0">
                  <Image src={product.image} alt="Angle" width={100} height={100} className="object-contain w-full h-full mix-blend-multiply" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Info Components */}
          <div className="w-full lg:w-[45%] space-y-12">
            <motion.header {...fadeInUp} className="space-y-6">
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-[0.4em] text-secondary">{product.brand}</p>
                <div className="flex justify-between items-start">
                  <h1 className="text-5xl md:text-7xl font-serif italic tracking-tight text-primary leading-tight">
                    {product.name}
                  </h1>
                </div>
              </div>
              
              <div className="flex items-center gap-8 border-y border-outline/10 py-6">
                 <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface/40">Member Price</p>
                    <span className="text-4xl font-serif text-primary italic">₹{product.price}</span>
                 </div>
                 <div className="h-10 w-px bg-outline/10"></div>
                 <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface/40">Protocol Rating</p>
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-secondary fill-1">star</span>
                        <span className="text-sm font-bold tracking-tighter text-on-surface/80">{product.rating}</span>
                    </div>
                 </div>
              </div>
            </motion.header>

            {/* Configurator */}
            <div className="space-y-10">
               {/* Frame Color */}
               <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                     <span>Frame Finish</span>
                     <span className="text-secondary italic">{selectedColor}</span>
                  </div>
                  <div className="flex gap-4">
                     {["Midnight Black", "Polished Gold", "Brushed Silver"].map(color => (
                        <button 
                           key={color}
                           onClick={() => setSelectedColor(color)}
                           className={cn(
                             "w-10 h-10 border transition-all duration-300",
                             selectedColor === color ? "border-primary p-1" : "border-outline/20 p-0 hover:border-primary/50"
                           )}
                        >
                           <div className={cn(
                              "w-full h-full",
                              color === "Midnight Black" ? "bg-black" : color === "Polished Gold" ? "bg-[#775a19]" : "bg-[#c4c6cc]"
                           )}></div>
                        </button>
                     ))}
                  </div>
               </div>

               {/* Lens Selection */}
               <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                     <span>Lens Configuration</span>
                     <span className="text-secondary italic">Selected</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     {["Premium Clear", "Blue Defense", "Photochromic", "Sun Polarized"].map(lens => (
                        <button 
                           key={lens}
                           onClick={() => setSelectedLens(lens)}
                           className={cn(
                             "px-6 py-4 border text-[10px] uppercase font-bold tracking-widest text-left transition-all",
                             selectedLens === lens ? "bg-primary text-white border-primary" : "border-outline/20 hover:border-primary/50 text-on-surface/60 hover:text-primary"
                           )}
                        >
                           {lens}
                        </button>
                     ))}
                  </div>
               </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button 
                onClick={handleAddToCart}
                className="flex-grow py-6 bg-primary text-white font-bold text-[10px] uppercase tracking-[0.3em] rounded-lg hover:opacity-80 transition-all duration-500 active:scale-95 flex items-center justify-center gap-4"
              >
                <span>Acquire Vision</span>
                <span className="material-symbols-outlined text-sm">lock</span>
              </button>
              
              <button 
                onClick={() => {
                   isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product);
                }}
                className={cn(
                  "w-20 rounded-lg border flex items-center justify-center transition-all duration-500 active:scale-90",
                  isInWishlist(product.id) ? "bg-secondary/10 border-secondary text-secondary" : "bg-transparent border-outline/20 text-on-surface/40 hover:text-secondary"
                )}
              >
                <span className={cn("material-symbols-outlined text-2xl", isInWishlist(product.id) && "fill-1")}>favorite</span>
              </button>
            </div>

            {/* Detailed Content */}
            <div className="pt-12 space-y-8 border-t border-outline/10">
               <div className="flex gap-12 border-b border-outline/10">
                  {["craftsmanship", "specs", "heritage"].map((tab) => (
                    <button 
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-[0.3em] transition-all relative pb-6",
                        activeTab === tab ? "text-primary" : "text-on-surface/40 hover:text-primary"
                      )}
                    >
                      {tab}
                      {activeTab === tab && <motion.div layoutId="tab-underline" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary" />}
                    </button>
                  ))}
               </div>

               <div className="min-h-[160px] prose prose-sm text-on-surface/60 font-medium tracking-wide leading-relaxed italic">
                  <AnimatePresence mode="wait">
                    {activeTab === "craftsmanship" && (
                      <motion.div key="craft" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                        <p>Each frame is meticulously hand-sculpted in our Japanese atelier, undergoing a 32-step inspection protocol. Our artisans utilize cold-forged aerospace titanium and medical-grade acetate, ensuring a structural integrity that lasts a lifetime.</p>
                        <p className="mt-4">Lenses are precision-ground with atomic-level accuracy, featuring our signature 7-layer anti-reflective coating.</p>
                      </motion.div>
                    )}
                    {activeTab === "specs" && (
                      <motion.div key="specs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="grid grid-cols-2 gap-y-6 gap-x-12 not-italic underline-offset-4">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface/40 mb-1">Architecture</p>
                          <p className="text-primary font-bold">Cold-Forged Titanium</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface/40 mb-1">Optic Mass</p>
                          <p className="text-primary font-bold">14.8g Ultra Light</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface/40 mb-1">Chassis</p>
                          <p className="text-primary font-bold">54 [] 18 - 145</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface/40 mb-1">Fitting</p>
                          <p className="text-primary font-bold">Global Ergonomic</p>
                        </div>
                      </motion.div>
                    )}
                    {activeTab === "heritage" && (
                      <motion.div key="heritage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                        <p>Inspired by the architectural brutalism of the 1960s, this silhouette reimagines classic visionary aesthetics through a lens of modern minimalism. Designed to be more than eyewear—it is a statement of intellectual presence and sartorial excellence.</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>
            </div>

            {/* Authenticity Badge */}
            <div className="flex items-center gap-6 p-8 bg-surface-container-low border border-outline/5 rounded-xl">
               <span className="material-symbols-outlined text-secondary text-3xl">verified</span>
               <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Authenticity Protocol Guaranteed</p>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface/40">Secure Digital Ownership Certificate included with every archive piece.</p>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
