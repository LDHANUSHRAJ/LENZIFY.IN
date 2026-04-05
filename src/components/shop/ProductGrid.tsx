"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { products as allProducts } from "@/data/products";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { createClient } from "@/lib/supabase/client";

interface ProductGridProps {
  initialCategory?: string;
}

export default function ProductGrid({ initialCategory }: ProductGridProps) {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const routerSearch = searchParams.get("q")?.toLowerCase() || "";
  const routerCategory = searchParams.get("category")?.toLowerCase() || initialCategory || "";
  
  const [viewMode, setViewMode] = useState<"popularity" | "price" | "newest">("popularity");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 25000 });
  const [selectedShapes, setSelectedShapes] = useState<string[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState("All");

  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, [supabase.auth]);

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push(`/auth/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }
    addItem(product);
  };

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    if (routerSearch) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(routerSearch) || 
        p.brand.toLowerCase().includes(routerSearch) ||
        p.description.toLowerCase().includes(routerSearch)
      );
    }

    if (routerCategory) {
      const cat = routerCategory.toLowerCase().replace("-", " ").replace("spectacles", "spectacles");
      result = result.filter(p => p.category.toLowerCase() === cat || p.category.toLowerCase().replace("-", " ") === cat);
    }

    result = result.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);
    
    if (selectedShapes.length > 0) {
      result = result.filter(p => selectedShapes.some(s => p.description.toLowerCase().includes(s.toLowerCase())));
    }

    if (selectedMaterial !== "All") {
      result = result.filter(p => p.description.toLowerCase().includes(selectedMaterial.toLowerCase()));
    }

    if (viewMode === "price") {
      result.sort((a, b) => a.price - b.price);
    } else if (viewMode === "newest") {
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    } else {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [routerSearch, routerCategory, viewMode, priceRange, selectedShapes, selectedMaterial]);

  const toggleShape = (shape: string) => {
    setSelectedShapes(prev => 
      prev.includes(shape) ? prev.filter(s => s !== shape) : [...prev, shape]
    );
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-8 md:px-12 py-24 flex flex-col lg:flex-row gap-16 md:gap-24">
      {/* Sidebar Filters */}
      <aside className="w-full lg:w-64 space-y-12">
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Filters</h3>
          <div className="h-px w-full bg-outline/10"></div>
        </div>

        <div className="space-y-10">
          {/* Price Filter */}
          <div className="space-y-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface/40">Price Threshold</p>
            <div className="space-y-4">
              <input 
                type="range" 
                min="0" 
                max="25000" 
                step="500"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                className="w-full accent-primary h-1 bg-surface-container rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-bold tracking-tighter text-on-surface/60 italic">
                <span>₹0</span>
                <span>MAX: ₹{priceRange.max}</span>
              </div>
            </div>
          </div>

          {/* Geometric Shape */}
          <div className="space-y-6">
             <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface/40">Geometric Shape</p>
             <div className="flex flex-wrap gap-2">
                {["Rectangle", "Round", "Aviator", "Cat Eye"].map(shape => (
                   <button 
                    key={shape} 
                    onClick={() => toggleShape(shape)}
                    className={cn(
                      "px-4 py-2 border text-[10px] uppercase font-bold tracking-widest transition-all",
                      selectedShapes.includes(shape) 
                        ? "bg-primary text-white border-primary" 
                        : "bg-transparent border-outline/20 text-on-surface hover:border-primary"
                    )}
                   >
                     {shape}
                   </button>
                ))}
             </div>
          </div>

          {/* Materials */}
          <div className="space-y-6">
             <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface/40">Frame Composition</p>
             <div className="space-y-2">
                {["All", "Acetate", "Titanium", "Metal", "Carbon"].map(material => (
                   <label key={material} className="flex items-center gap-3 group cursor-pointer">
                      <div className={cn(
                        "w-3 h-3 border transition-all",
                        selectedMaterial === material ? "bg-secondary border-secondary scale-110" : "bg-transparent border-outline/30"
                      )}></div>
                      <input 
                        type="radio" 
                        name="material" 
                        className="hidden" 
                        checked={selectedMaterial === material}
                        onChange={() => setSelectedMaterial(material)}
                      />
                      <span className={cn(
                        "text-[10px] uppercase font-bold tracking-widest transition-colors",
                        selectedMaterial === material ? "text-primary" : "text-on-surface/60 hover:text-primary"
                      )}>{material === "All" ? "Every Material" : material}</span>
                   </label>
                ))}
             </div>
          </div>
        </div>

        <button 
          onClick={() => {
            setPriceRange({ min: 0, max: 25000 });
            setSelectedShapes([]);
            setSelectedMaterial("All");
          }}
          className="w-full py-4 border border-outline/10 text-[10px] font-bold uppercase tracking-widest hover:bg-primary-container hover:text-white transition-all"
        >
          Reset Filters
        </button>
      </aside>

      {/* Product List */}
      <section className="flex-grow">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="space-y-4">
             <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary italic">Selected Pieces</p>
             <h1 className="text-5xl md:text-6xl font-serif tracking-tight text-primary">
                {routerSearch ? `Search: ${routerSearch}` : routerCategory || "All Frames"}
             </h1>
          </div>
          
          <div className="flex items-center gap-4 border-b border-outline/10 pb-2">
             <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface/40">Sort By</span>
             <select 
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as any)}
                className="bg-transparent border-none focus:ring-0 text-[10px] font-bold uppercase tracking-[0.2em] cursor-pointer"
             >
                <option value="popularity">Popularity</option>
                <option value="price">Price: Low to High</option>
                <option value="newest">Recent Additions</option>
             </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-16 gap-x-12">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, i) => (
              <motion.div 
                layout
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="group flex flex-col h-full"
              >
                <Link href={`/product/${product.id}`} className="block w-full h-full">
                  <div className="relative aspect-[4/5] overflow-hidden bg-surface-container-low mb-8 group">
                    <Image 
                      src={product.image} 
                      alt={product.name} 
                      fill 
                      className="object-contain p-12 mix-blend-multiply grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" 
                    />
                    {product.isNew && (
                       <div className="absolute top-6 left-6 px-4 py-1.5 bg-secondary text-white text-[9px] font-black uppercase tracking-widest">
                          Editorial Choice
                       </div>
                    )}
                    <button 
                      onClick={(e) => handleAddToCart(product, e)}
                      className="absolute bottom-0 left-0 w-full py-5 bg-primary text-white text-[10px] font-bold uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0"
                    >
                      Acquire Vision
                    </button>
                  </div>
                </Link>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold tracking-widest text-secondary">{product.brand}</p>
                      <h3 className="text-xl font-serif italic text-primary">{product.name}</h3>
                    </div>
                    <span className="text-sm font-bold tracking-tighter italic text-primary/60">₹{product.price}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-on-surface/40">
                     <span>{product.category}</span>
                     <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">star</span>
                        <span>{product.rating}</span>
                     </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="py-24 text-center space-y-6">
             <span className="material-symbols-outlined text-6xl text-outline/20">search_off</span>
             <h3 className="text-2xl font-serif text-on-surface/40 italic">The archives are empty.</h3>
             <button 
                onClick={() => {
                  setPriceRange({ min: 0, max: 25000 });
                  setSelectedShapes([]);
                  setSelectedMaterial("All");
                }}
                className="px-12 py-5 border border-primary/10 text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
             >
                Reset Archive Filters
             </button>
          </div>
        )}
      </section>
    </div>
  );
}
