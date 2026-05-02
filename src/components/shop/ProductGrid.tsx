"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import ProductCard from "@/components/store/ProductCard";
import LensCard from "@/components/store/LensCard";

const parseArray = (val: any): string[] => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    if (val === "[]") return [];
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch(e) {}
    return [val];
  }
  return [];
};

interface ProductGridProps {
  initialCategory?: string;
  initialGender?: string;
}

export default function ProductGrid({ initialCategory, initialGender }: ProductGridProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [lenses, setLenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const routerSearch = searchParams.get("q")?.toLowerCase() || "";
  
  const searchGender = searchParams.get("gender") || "";
  const searchType = searchParams.get("type") || "";
  const searchLensType = searchParams.get("lens_type") || "";
  const searchCollection = searchParams.get("collection") || "";

  const [viewMode, setViewMode] = useState<"popularity" | "price_asc" | "price_desc" | "newest">("newest");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 25000 });
  
  const [selectedGenders, setSelectedGenders] = useState<string[]>(
    searchGender ? [searchGender] : (initialGender ? [initialGender] : [])
  );
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    searchType ? [searchType] : (initialCategory ? [initialCategory] : [])
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedFrameTypes, setSelectedFrameTypes] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>(
    searchCollection ? [searchCollection] : []
  );

  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      const promises: any[] = [
         supabase.from("products").select(`
            *,
            categories (id, name, type)
         `).eq("is_enabled", true),
         supabase.from("categories").select("*").eq("is_active", true)
      ];

      if (searchType === 'lens' || selectedTypes.includes('lens')) {
         promises.push(supabase.from("lenses").select("*").eq("is_active", true));
      }

      const [productsRes, catRes, lensesRes] = await Promise.all(promises);
      
      if (productsRes?.data) {
        setProducts(productsRes.data);
      }
      if (catRes?.data) {
        setCategories(catRes.data);
      }
      if (lensesRes?.data) {
        setLenses(lensesRes.data);
      }
      setLoading(false);
    };
    fetchData();
  }, [supabase, searchType, selectedTypes]);

  const genderCategories = useMemo(() => categories.filter(c => c.type === 'gender').map(c => c.name), [categories]);
  const productTypeCategories = useMemo(() => categories.filter(c => c.type === 'product').map(c => c.name), [categories]);
  const collectionCategories = useMemo(() => categories.filter(c => c.type === 'collection').map(c => c.name), [categories]);

  const dynamicGenders = useMemo(() => {
    const fromCats = products.flatMap(p => p.categories?.filter((c: any) => c.type === 'gender').map((c: any) => c.name) || []);
    const fromProps = products.flatMap(p => parseArray(p.gender));
    return Array.from(new Set([...genderCategories, ...fromCats, ...fromProps])).filter(Boolean).sort();
  }, [genderCategories, products]);

  const dynamicTypes = useMemo(() => {
    const fromCats = products.flatMap(p => p.categories?.filter((c: any) => c.type === 'product').map((c: any) => c.name) || []);
    const fromProps = products.flatMap(p => parseArray(p.type));
    return Array.from(new Set([...productTypeCategories, ...fromCats, ...fromProps])).filter(Boolean).sort();
  }, [productTypeCategories, products]);

  const dynamicCollections = useMemo(() => {
    const fromCats = products.flatMap(p => p.categories?.filter((c: any) => c.type === 'collection').map((c: any) => c.name) || []);
    const fromProps = products.flatMap(p => parseArray(p.collection));
    return Array.from(new Set([...collectionCategories, ...fromCats, ...fromProps])).filter(Boolean).sort();
  }, [collectionCategories, products]);

  // ... (brands, colors, etc. remain derived from base product fields)
  const brands = useMemo(() => Array.from(new Set(products.map(p => p.brand).filter(Boolean))), [products]);
  const colors = useMemo(() => Array.from(new Set(products.flatMap(p => p.colors || []).filter(Boolean))), [products]);
  const sizes = useMemo(() => Array.from(new Set(products.flatMap(p => p.sizes || []).filter(Boolean))), [products]);
  const frameTypes = useMemo(() => Array.from(new Set(products.map(p => p.frame_type).filter(Boolean))), [products]);
  const materials = useMemo(() => Array.from(new Set(products.map(p => p.material).filter(Boolean))), [products]);

  const toggleFilter = (setState: any, item: string) => {
    setState((prev: string[]) => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]);
  };

  const filteredProducts = useMemo(() => {
    // Determine if we are in Lens mode
    const isLensMode = searchType === 'lens' || selectedTypes.includes('lens');
    
    if (isLensMode) {
      let result = [...lenses];
      if (routerSearch) {
        result = result.filter(l => 
          l.name.toLowerCase().includes(routerSearch) || 
          l.description?.toLowerCase().includes(routerSearch)
        );
      }
      
      if (searchLensType) {
         result = result.filter(l => 
          l.sub_category?.toLowerCase() === searchLensType.toLowerCase() ||
          l.category?.toLowerCase() === searchLensType.toLowerCase()
         );
      }

      // Price Filter
      result = result.filter(l => l.price >= priceRange.min && l.price <= priceRange.max);

      return result.map(l => ({ ...l, isLens: true }));
    }

    let result = [...products];

    // Search filter
    if (routerSearch) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(routerSearch) || 
        p.brand?.toLowerCase().includes(routerSearch) ||
        p.description?.toLowerCase().includes(routerSearch)
      );
    }

    // New Multi-Sector Filtering
    if (selectedGenders.length > 0) {
      result = result.filter(p => {
        const pGenders = parseArray(p.gender);
        return pGenders.some(g => selectedGenders.includes(g)) || p.categories?.some((c: any) => c.type === 'gender' && selectedGenders.includes(c.name));
      });
    }
    if (selectedTypes.length > 0) {
      result = result.filter(p => {
        const pTypes = parseArray(p.type);
        return pTypes.some(t => selectedTypes.includes(t)) || p.categories?.some((c: any) => c.type === 'product' && selectedTypes.includes(c.name));
      });
    }
    if (selectedCollections.length > 0) {
      result = result.filter(p => {
        const pCollections = parseArray(p.collection);
        return pCollections.some(col => selectedCollections.includes(col)) || p.categories?.some((c: any) => c.type === 'collection' && selectedCollections.includes(c.name));
      });
    }

    // Standard attribute filters
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand));
    }
    if (selectedColors.length > 0) {
      result = result.filter(p => p.colors && selectedColors.some(c => p.colors.includes(c)));
    }
    if (selectedSizes.length > 0) {
      result = result.filter(p => p.sizes && selectedSizes.some(s => p.sizes.includes(s)));
    }
    if (selectedFrameTypes.length > 0) {
      result = result.filter(p => selectedFrameTypes.includes(p.frame_type));
    }
    if (selectedMaterials.length > 0) {
      result = result.filter(p => selectedMaterials.includes(p.material));
    }


    // Price Filter
    result = result.filter(p => {
       const effectivePrice = p.discount_price || p.price;
       return effectivePrice >= priceRange.min && effectivePrice <= priceRange.max;
    });

    // Sorting 
    if (viewMode === "price_asc") {
      result.sort((a, b) => (a.discount_price || a.price) - (b.discount_price || b.price));
    } else if (viewMode === "price_desc") {
      result.sort((a, b) => (b.discount_price || b.price) - (a.discount_price || a.price));
    } else if (viewMode === "newest") {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [products, lenses, searchType, searchLensType, routerSearch, selectedGenders, selectedTypes, selectedCollections, selectedBrands, selectedColors, selectedSizes, selectedFrameTypes, selectedMaterials, priceRange, viewMode]);

  const FilterCheckboxBlock = ({ title, options, state, setter }: any) => {
     if (!options || options.length === 0) return null;
     return (
        <div className="space-y-4">
           <p className="text-[10px] font-bold uppercase tracking-widest text-brand-navy border-b border-brand-navy/10 pb-2">{title}</p>
           <div className="space-y-2">
              {options.map((opt: string) => (
                 <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={state.includes(opt)}
                      onChange={() => toggleFilter(setter, opt)}
                      className="accent-secondary w-4 h-4 rounded border-brand-navy/20 cursor-pointer"
                    />
                    <span className="text-[11px] font-medium tracking-wider text-brand-text-muted group-hover:text-brand-navy transition-colors">{opt}</span>
                 </label>
              ))}
           </div>
        </div>
     );
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-12 flex flex-col lg:flex-row gap-12">
      {/* Sidebar Filters - Sticky */}
      <aside className="w-full lg:w-72 flex-shrink-0 space-y-10 lg:sticky lg:top-32 h-fit max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar pr-4 pb-12">
        <div className="space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-brand-navy">Advanced Filters</h3>
          <p className="text-xs text-brand-text-muted">{filteredProducts.length} Results Found</p>
        </div>

        <div className="space-y-8">
           <FilterCheckboxBlock title="Category (Gender)" options={dynamicGenders} state={selectedGenders} setter={setSelectedGenders} />
           <FilterCheckboxBlock title="Product Type" options={dynamicTypes} state={selectedTypes} setter={setSelectedTypes} />
           <FilterCheckboxBlock title="Collection" options={dynamicCollections} state={selectedCollections} setter={setSelectedCollections} />
           
           <FilterCheckboxBlock title="Brand" options={brands} state={selectedBrands} setter={setSelectedBrands} />

           {/* Price Slider */}
           <div className="space-y-4">
             <p className="text-[10px] font-bold uppercase tracking-widest text-brand-navy border-b border-brand-navy/10 pb-2">Price Threshold</p>
             <div className="space-y-4">
               <input 
                 type="range" 
                 min="0" 
                 max="25000" 
                 step="500"
                 value={priceRange.max}
                 onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                 className="w-full accent-brand-navy h-1 bg-brand-navy/10 rounded-lg appearance-none cursor-pointer"
               />
               <div className="flex justify-between text-[11px] font-bold tracking-widest text-brand-text-muted">
                 <span>₹0</span>
                 <span>MAX: ₹{priceRange.max}</span>
               </div>
             </div>
           </div>

           <FilterCheckboxBlock title="Frame Type" options={frameTypes} state={selectedFrameTypes} setter={setSelectedFrameTypes} />
           <FilterCheckboxBlock title="Material" options={materials} state={selectedMaterials} setter={setSelectedMaterials} />
           <FilterCheckboxBlock title="Colors" options={colors} state={selectedColors} setter={setSelectedColors} />
           <FilterCheckboxBlock title="Sizes" options={sizes} state={selectedSizes} setter={setSelectedSizes} />
        </div>

        <button 
          onClick={() => {
            setPriceRange({ min: 0, max: 25000 });
            setSelectedGenders([]); setSelectedTypes([]); setSelectedBrands([]);
            setSelectedColors([]); setSelectedSizes([]); setSelectedFrameTypes([]);
            setSelectedMaterials([]); setSelectedCollections([]);
          }}
          className="w-full py-4 border border-brand-navy/20 text-[10px] font-bold uppercase tracking-widest text-brand-navy hover:bg-brand-navy hover:text-white transition-all mt-8"
        >
          Reset All Filters
        </button>
      </aside>

      {/* Product List Grid */}
      <section className="flex-grow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-brand-navy/10 pb-4">
          <h1 className="text-3xl font-serif text-brand-navy">
            {routerSearch ? `Search: "${routerSearch}"` : ([...selectedTypes, ...selectedGenders, ...selectedCollections].join(", ") || "All Archives")}
          </h1>
          
          <div className="flex items-center gap-3">
             <span className="text-[10px] font-bold uppercase tracking-widest text-brand-text-muted">Sort By</span>
             <select 
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as any)}
                className="bg-transparent border border-brand-navy/20 px-4 py-2 text-[11px] font-bold tracking-wider uppercase cursor-pointer focus:outline-none"
             >
                <option value="newest">Newest Additions</option>
                <option value="price_asc">Price Low to High</option>
                <option value="price_desc">Price High to Low</option>
                <option value="popularity">Popularity</option>
             </select>
          </div>
        </div>

        {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 opacity-60 pointer-events-none">
               {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="aspect-[4/5] bg-brand-navy/5 animate-pulse" />
               ))}
            </div>
        ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((item, i) => (
                  <motion.div 
                    layout
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, delay: (i % 10) * 0.05 }}
                  >
                     {item.isLens ? <LensCard lens={item} /> : <ProductCard product={item} />}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
        ) : (
            <div className="py-32 text-center flex flex-col items-center">
               <span className="material-symbols-outlined text-6xl text-brand-navy/20 mb-6">search_off</span>
               <h3 className="text-2xl font-serif text-brand-text-muted mb-6">No matches found for your filter combo.</h3>
               <button 
                  onClick={() => {
                     setPriceRange({ min: 0, max: 25000 });
                     setSelectedGenders([]); setSelectedTypes([]); setSelectedBrands([]);
                     setSelectedColors([]); setSelectedSizes([]); setSelectedFrameTypes([]);
                     setSelectedMaterials([]); setSelectedCollections([]);
                  }}
                  className="px-8 py-4 bg-brand-navy text-white text-[10px] font-bold uppercase tracking-widest hover:bg-secondary hover:text-brand-navy transition-all"
               >
                  Clear Strict Filters
               </button>
            </div>
        )}
      </section>
    </div>
  );
}
