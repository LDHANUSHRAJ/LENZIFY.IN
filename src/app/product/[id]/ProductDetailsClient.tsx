"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { addToCart, toggleWishlist } from "@/lib/db/customer_actions";
import { cn } from "@/lib/utils";
import { Star, ShoppingBag, Heart, Verified, RotateCw } from "lucide-react";
import Product360Viewer from "./Product360Viewer";

interface ProductDetailsClientProps {
  product: any;
  user: any;
  similarProducts: any[];
  initialReviews: any[];
  isInWishlist: boolean;
}

export default function ProductDetailsClient({ 
  product, 
  user, 
  similarProducts, 
  initialReviews, 
  isInWishlist 
}: ProductDetailsClientProps) {
  const router = useRouter();
  const supabase = createClient();
  const [currentUser, setCurrentUser] = useState(user);
  const [isInWish, setIsInWish] = useState(isInWishlist);
  
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, [supabase.auth]);
  const [activeTab, setActiveTab] = useState<"craftsmanship" | "specs" | "heritage">("specs");
  const [selectedLens, setSelectedLens] = useState("Premium Clear");
  const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0] || "");
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || "");
  const [viewMode, setViewMode] = useState<"static" | "360">("static");

  const handleAddToCart = async () => {
    if (!currentUser) {
      router.push(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    const res = await addToCart(product.id, { 
        quantity: 1, 
        lens_type: selectedLens,
        color: selectedColor,
        size: selectedSize,
        price: product.discount_price || product.price 
    });
    if (res.success) router.push("/cart");
  };

  const handleWishlist = async () => {
    if (!currentUser) {
      router.push(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    const res = await toggleWishlist(product.id);
    setIsInWish(!!res.success);
  };

  const primaryImage = product.product_images?.find((img: any) => img.is_primary)?.image_url || product.product_images?.[0]?.image_url;

  return (
    <div className="bg-surface text-brand-navy min-h-screen pt-24 font-sans">
      {/* Breadcrumbs */}
      <nav className="max-w-screen-2xl mx-auto px-8 md:px-12 py-8">
         <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-navy/30">
           <Link href="/" className="hover:text-secondary transition-colors">Nexus</Link>
           <span className="w-1 h-1 bg-brand-navy/30 rounded-full"></span>
           <Link href="/products" className="hover:text-secondary transition-colors">Archive</Link>
           <span className="w-1 h-1 bg-brand-navy/30 rounded-full"></span>
           <span className="text-secondary italic">{product.name}</span>
         </div>
      </nav>

      <main className="max-w-screen-2xl mx-auto px-8 md:px-12 pb-32">
        <div className="flex flex-col lg:flex-row gap-20 lg:gap-32 items-start">
          {/* Left: Visualization */}
          <div className="w-full lg:w-[55%] lg:sticky lg:top-32 space-y-12">
            <AnimatePresence mode="wait">
              {viewMode === "static" ? (
                <motion.div 
                  key="static"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative aspect-[4/5] bg-white border border-brand-navy/5 overflow-hidden group shadow-sm flex items-center justify-center p-12"
                >
                  <Image 
                    src={primaryImage || "/placeholder.jpg"} 
                    alt={product.name} 
                    fill 
                    priority
                    className="object-contain p-12 mix-blend-multiply opacity-80 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110" 
                  />
                  <div className="absolute top-10 left-10">
                     <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-secondary/50 italic">Visual Simulation v2.0</p>
                  </div>
                  
                  {product.images_360?.length > 0 && (
                    <button 
                      onClick={() => setViewMode("360")}
                      className="absolute bottom-10 right-10 bg-brand-navy text-white px-8 py-4 text-[9px] font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-secondary transition-all shadow-xl"
                    >
                      <RotateCw size={14} className="animate-spin-slow" />
                      Initialize 360-View
                    </button>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="360"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Product360Viewer images={product.images_360} />
                  <button 
                    onClick={() => setViewMode("static")}
                    className="mt-6 text-[9px] font-bold uppercase tracking-widest text-secondary hover:text-brand-navy border-b border-secondary/20 pb-1"
                  >
                    Return to Blueprint View
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="grid grid-cols-4 gap-6">
              {product.product_images?.map((img: any) => (
                <div key={img.id} className="aspect-square bg-white border border-brand-navy/5 cursor-pointer hover:border-secondary transition-all p-4 group">
                  <Image src={img.image_url} alt="Perspective" width={100} height={100} className="object-contain w-full h-full mix-blend-multiply opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Info Components */}
          <div className="w-full lg:w-[45%] space-y-16">
            <header className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                   <p className="text-xs font-bold uppercase tracking-[0.4em] text-secondary italic">{product.brand}</p>
                   <span className="h-px flex-1 bg-brand-navy/5"></span>
                </div>
                <h1 className="text-5xl md:text-8xl font-serif italic tracking-tight text-brand-navy leading-none uppercase pr-10">
                  {product.name}
                </h1>
              </div>
              
              <div className="flex items-center gap-12 pt-8">
                 <div className="space-y-2">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-brand-navy/30">Exchange Rate</p>
                    <div className="flex items-baseline gap-4">
                       <span className="text-5xl font-serif text-brand-navy italic">₹{product.discount_price?.toLocaleString() || product.price.toLocaleString()}</span>
                       {product.discount_price && product.discount_price < product.price && <span className="text-lg line-through text-brand-navy/20">₹{product.price.toLocaleString()}</span>}
                    </div>
                 </div>
                 <div className="h-16 w-px bg-brand-navy/5"></div>
                 <div className="space-y-2">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-brand-navy/30 italic">Availability Protocol</p>
                    <span className={cn(
                        "text-[10px] font-bold tracking-[0.3em] uppercase flex items-center gap-3",
                        product.stock > 0 ? "text-emerald-500" : "text-red-500"
                    )}>
                       <span className={cn("w-2 h-2 rounded-full", product.stock > 0 ? "bg-emerald-500 animate-pulse" : "bg-red-500")}></span>
                       {product.stock > 0 ? `${product.stock} Units Sync'd` : "Archive Locked"}
                    </span>
                 </div>
              </div>
            </header>

            {/* Lens Configuration */}
            <div className="space-y-12 bg-white border border-brand-navy/5 p-10 lg:p-14 shadow-sm relative">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                   <Verified size={48} />
               </div>
               <div className="space-y-8">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.4em]">
                     <span className="text-secondary italic">Step 02: Optic Configuration</span>
                     <span className="text-brand-navy/40">{selectedLens}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     {["Premium Clear", "Blue Cut HD", "Bifocal Pro", "Zero Distort"].map(lens => (
                        <button 
                           key={lens}
                           onClick={() => setSelectedLens(lens)}
                           className={cn(
                             "px-8 py-6 border text-[10px] uppercase font-black tracking-widest text-left transition-all duration-500",
                             selectedLens === lens ? "bg-brand-navy text-white border-brand-navy shadow-2xl" : "border-brand-navy/5 hover:border-secondary text-brand-navy/30 hover:text-secondary bg-brand-background/50"
                           )}
                        >
                           {lens}
                        </button>
                     ))}
                  </div>
               </div>
            </div>

            {/* Action Matrix */}
            <div className="flex flex-col gap-6 pt-4">
              <div className="flex gap-4">
                <button 
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-grow py-8 bg-brand-navy text-white font-black text-[12px] uppercase tracking-[0.5em] hover:bg-secondary transition-all duration-700 active:scale-95 flex items-center justify-center gap-6 shadow-2xl disabled:opacity-30 disabled:grayscale"
                >
                  <ShoppingBag size={20} />
                  <span>{product.stock > 0 ? "ADD TO CART" : "Waitlist Protocol"}</span>
                </button>
                
                <button 
                  onClick={handleWishlist}
                  className={cn(
                    "w-28 border flex items-center justify-center transition-all duration-700 active:rotate-12",
                    isInWish ? "bg-secondary/10 border-secondary text-secondary" : "bg-white border-brand-navy/5 text-brand-navy/10 hover:text-secondary hover:border-secondary/20"
                  )}
                >
                  <Heart size={32} className={cn(isInWish && "fill-secondary")} />
                </button>
              </div>
              <p className="text-[9px] uppercase font-bold text-center tracking-[0.3em] text-brand-navy/10 italic">Secured via encrypted checkout protocol v4.2</p>
            </div>

            {/* Technical Matrix Tabs */}
            <div className="space-y-10 pt-16 border-t border-brand-navy/5">
               <div className="flex items-center gap-10 border-b border-brand-navy/5">
                  {[
                    { id: "specs", label: "Spec Sheet" },
                    { id: "craftsmanship", label: "Build Quality" },
                    { id: "heritage", label: "Design Log" }
                  ].map(tab => (
                    <button 
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={cn(
                        "pb-6 text-[10px] font-bold uppercase tracking-[0.4em] transition-all relative",
                        activeTab === tab.id ? "text-secondary" : "text-brand-navy/30 hover:text-brand-navy"
                      )}
                    >
                      {tab.label}
                      {activeTab === tab.id && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary" />}
                    </button>
                  ))}
               </div>

               <div className="min-h-[200px]">
                  <AnimatePresence mode="wait">
                    {activeTab === "specs" && (
                      <motion.div 
                        key="specs"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-12"
                      >
                         {[
                           { label: "Frame Protocol", value: product.frame_type },
                           { label: "Geometry", value: product.shape },
                           { label: "Componentry", value: product.material },
                           { label: "Identity", value: product.gender },
                           { label: "Chroma", value: product.color },
                           { label: "Scale", value: product.size }
                         ].map(item => (
                           <div key={item.label} className="space-y-2">
                              <p className="text-[9px] font-bold uppercase tracking-widest text-brand-navy/30 italic">{item.label}</p>
                              <p className="text-xs font-serif italic text-brand-navy uppercase tracking-tight">{item.value || 'Unspecified'}</p>
                           </div>
                         ))}
                      </motion.div>
                    )}

                    {activeTab === "craftsmanship" && (
                       <motion.div 
                         key="craftsmanship"
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         className="space-y-6"
                       >
                          <p className="text-xs font-serif text-brand-navy/60 leading-loose italic max-w-2xl">
                             Precision-engineered using ultra-lightweight high-tensile components. Each node is hand-calibrated for maximum ergonomic synchronization. Features anti-abrasive coating and neural-interface lens stabilization.
                          </p>
                          <div className="flex gap-4">
                             <div className="px-6 py-3 bg-brand-background border border-brand-navy/5 text-[8px] font-bold uppercase tracking-widest text-brand-navy">ISO-9002 Certified</div>
                             <div className="px-6 py-3 bg-brand-background border border-brand-navy/5 text-[8px] font-bold uppercase tracking-widest text-brand-navy">Hand-Finished</div>
                          </div>
                       </motion.div>
                    )}

                    {activeTab === "heritage" && (
                       <motion.div 
                         key="heritage"
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         className="space-y-6"
                       >
                          <p className="text-xs font-serif text-brand-navy/60 leading-loose italic max-w-2xl">
                             Originating from the 2026 Archive Series, the {product.name} represents a paradigm shift in optical aesthetics. Designed in the Lenzify Design Nexus, it merges historical silhouettes with future-forward material matrices.
                          </p>
                          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-secondary italic">Serial Hash: {product.id.slice(0, 16)}</p>
                       </motion.div>
                    )}
                  </AnimatePresence>
               </div>
            </div>

            {/* Similar Products */}
            {similarProducts.length > 0 && (
              <section className="space-y-10 pt-16 border-t border-brand-navy/5">
                <div className="flex justify-between items-end">
                   <h2 className="text-2xl font-serif italic text-brand-navy">Relational <span className="text-secondary">Aesthetics</span></h2>
                   <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-brand-navy/30">AI Recommendation Engine</p>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  {similarProducts.map((p) => {
                    const img = p.product_images?.find((i: any) => i.is_primary)?.image_url || p.product_images?.[0]?.image_url;
                    return (
                      <Link key={p.id} href={`/product/${p.id}`} className="group space-y-4">
                         <div className="aspect-[4/5] bg-white border border-brand-navy/5 p-8 overflow-hidden flex items-center justify-center relative">
                            <Image src={img || "/placeholder.jpg"} alt={p.name} fill className="object-contain p-8 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 opacity-40 group-hover:opacity-100" />
                            <div className="absolute top-4 left-4 p-2 bg-brand-navy text-white text-[8px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">View Design</div>
                         </div>
                         <div className="space-y-1">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-navy/30 italic">{p.brand}</p>
                            <h3 className="text-sm font-serif italic text-brand-navy font-black tracking-tight">{p.name}</h3>
                         </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Sentimental Analysis */}
            <section className="space-y-10 pt-16 border-t border-brand-navy/5">
              <div className="flex justify-between items-center bg-brand-navy text-white p-10 shadow-xl">
                 <div className="space-y-2">
                    <h2 className="text-2xl font-serif italic text-secondary">Public Feedback</h2>
                    <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/40 italic">Aggregate Nexus Score: {product.rating || '4.8'}/5.0</p>
                 </div>
                 <button className="text-[10px] font-bold uppercase tracking-widest bg-secondary text-brand-navy px-8 py-4 hover:shadow-[0_0_20px_rgba(var(--brand-gold-rgb),0.5)] transition-all">Submit Entry</button>
              </div>

              <div className="space-y-8">
                 {initialReviews.map(review => (
                   <div key={review.id} className="p-8 border border-brand-navy/5 bg-white space-y-4 italic">
                      <div className="flex justify-between items-center italic">
                         <p className="text-[10px] font-black uppercase tracking-widest text-brand-navy">{review.users?.name}</p>
                         <div className="flex gap-1">
                            {[...Array(review.rating)].map((_, i) => <Star key={i} size={10} className="fill-secondary text-secondary" />)}
                         </div>
                      </div>
                      <p className="text-xs font-serif text-brand-navy/60 leading-relaxed italic pr-12">"{review.review}"</p>
                      <p className="text-[8px] font-bold text-brand-navy/10 uppercase tracking-widest">{new Date(review.created_at).toLocaleDateString()}</p>
                   </div>
                 ))}
                 {initialReviews.length === 0 && <p className="text-[10px] text-center text-brand-navy/20 uppercase tracking-[0.4em] font-bold py-12">Awaiting first feedback transmission...</p>}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
