"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import ProductCard from "@/components/store/ProductCard";
import LensCard from "@/components/store/LensCard";
import Link from "next/link";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Grid2X2,
  Grid3X3,
  LayoutGrid,
  SlidersHorizontal,
  X,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const parseArray = (val: any): string[] => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    if (val === "[]") return [];
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {}
    return [val];
  }
  return [];
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface FilterSectionProps {
  title: string;
  activeCount: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FilterSection({ title, activeCount, children, defaultOpen = false }: FilterSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#ECECEC] pb-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-3 group"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[#111111]">{title}</span>
          {activeCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#004AAD] text-white text-[10px] font-bold flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </div>
        {open ? (
          <ChevronUp size={14} className="text-[#666666]" />
        ) : (
          <ChevronDown size={14} className="text-[#666666]" />
        )}
      </button>
      {open && <div className="mt-1 space-y-0.5">{children}</div>}
    </div>
  );
}

interface CheckboxOptionProps {
  opt: string;
  checked: boolean;
  onChange: () => void;
}

function CheckboxOption({ opt, checked, onChange }: CheckboxOptionProps) {
  return (
    <label className="flex items-center gap-3 py-2 cursor-pointer group">
      <div
        className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
          checked
            ? "bg-[#03173D] border-[#03173D]"
            : "border-[#E8EAF2] bg-white group-hover:border-[#004AAD]"
        }`}
      >
        {checked && <Check size={10} className="text-white" />}
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span className="text-sm text-[#666666] group-hover:text-[#111111] transition-colors">
        {opt}
      </span>
    </label>
  );
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type GridMode = "2col" | "3col" | "4col";
type SortMode = "newest" | "price_asc" | "price_desc" | "popularity";

interface ProductGridProps {
  initialCategory?: string;
  initialGender?: string;
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function ProductGrid({ initialCategory, initialGender }: ProductGridProps) {
  // ---- data state ----
  const [products, setProducts] = useState<any[]>([]);
  const [lenses, setLenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

  const [categories, setCategories] = useState<any[]>([]);

  const supabase = createClient();
  const searchParams = useSearchParams();

  const routerSearch = searchParams.get("q")?.toLowerCase() || "";
  const searchGender = searchParams.get("gender") || "";
  const searchType = searchParams.get("type") || "";
  const searchLensType = searchParams.get("lens_type") || "";
  const searchCollection = searchParams.get("collection") || "";
  const searchBrand = searchParams.get("brand") || "";

  // ---- ui state ----
  const [viewMode, setViewMode] = useState<SortMode>("newest");
  const [gridMode, setGridMode] = useState<GridMode>("4col");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 25000 });

  // ---- filter state ----
  const [selectedGenders, setSelectedGenders] = useState<string[]>(
    searchGender ? [searchGender] : initialGender ? [initialGender] : []
  );
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    searchType ? [searchType] : initialCategory ? [initialCategory] : []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchBrand ? [searchBrand] : []
  );
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedFrameTypes, setSelectedFrameTypes] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>(
    searchCollection ? [searchCollection] : []
  );

  // ---- data fetching ----
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setFetchError(null);
      setPage(1);

      try {
        const promises: any[] = [
          supabase
            .from("products")
            .select(
              `*, product_categories (categories (id, name, type)), product_images (image_url, is_primary)`
            )
            .eq("is_enabled", true),
          supabase.from("categories").select("*"),
        ];

        if (searchType === "lens" || selectedTypes.includes("lens")) {
          promises.push(
            supabase.from("lenses").select("*").eq("is_active", true)
          );
        }

        const [productsRes, catRes, lensesRes] = await Promise.all(promises);

        if (productsRes?.error) throw productsRes.error;
        if (productsRes?.data) setProducts(productsRes.data);
        if (catRes?.data) setCategories(catRes.data);
        if (lensesRes?.data) setLenses(lensesRes.data);
      } catch (err: any) {
        setFetchError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase, searchType, selectedTypes]);

  // ---- url sync effects ----
  useEffect(() => {
    setSelectedBrands(searchBrand ? [searchBrand] : []);
  }, [searchBrand]);

  useEffect(() => {
    setSelectedGenders(
      searchGender ? [searchGender] : initialGender ? [initialGender] : []
    );
  }, [searchGender, initialGender]);

  useEffect(() => {
    setSelectedTypes(
      searchType ? [searchType] : initialCategory ? [initialCategory] : []
    );
  }, [searchType, initialCategory]);

  useEffect(() => {
    setSelectedCollections(searchCollection ? [searchCollection] : []);
  }, [searchCollection]);

  // ---- derived filter options ----
  const genderCategories = useMemo(
    () => categories.filter((c) => c.type === "gender").map((c) => c.name),
    [categories]
  );
  const productTypeCategories = useMemo(
    () => categories.filter((c) => c.type === "product").map((c) => c.name),
    [categories]
  );
  const collectionCategories = useMemo(
    () => categories.filter((c) => c.type === "collection").map((c) => c.name),
    [categories]
  );

  const dynamicGenders = useMemo(() => {
    const fromCats = products.flatMap(
      (p) =>
        p.product_categories
          ?.map((pc: any) =>
            pc.categories?.type === "gender" ? pc.categories.name : null
          )
          .filter(Boolean) || []
    );
    const fromProps = products.flatMap((p) => parseArray(p.gender));
    return Array.from(new Set([...genderCategories, ...fromCats, ...fromProps]))
      .filter(Boolean)
      .sort();
  }, [genderCategories, products]);

  const dynamicTypes = useMemo(() => {
    const fromCats = products.flatMap(
      (p) =>
        p.product_categories
          ?.map((pc: any) =>
            pc.categories?.type === "product" ? pc.categories.name : null
          )
          .filter(Boolean) || []
    );
    const fromProps = products.flatMap((p) => parseArray(p.product_type));
    return Array.from(
      new Set([...productTypeCategories, ...fromCats, ...fromProps])
    )
      .filter(Boolean)
      .sort();
  }, [productTypeCategories, products]);

  const dynamicCollections = useMemo(() => {
    const fromCats = products.flatMap(
      (p) =>
        p.product_categories
          ?.map((pc: any) =>
            pc.categories?.type === "collection" ? pc.categories.name : null
          )
          .filter(Boolean) || []
    );
    const fromProps = products.flatMap((p) => parseArray(p.collection));
    return Array.from(
      new Set([...collectionCategories, ...fromCats, ...fromProps])
    )
      .filter(Boolean)
      .sort();
  }, [collectionCategories, products]);

  const brands = useMemo(
    () =>
      Array.from(new Set(products.map((p) => p.brand).filter(Boolean))),
    [products]
  );
  const colors = useMemo(
    () =>
      Array.from(
        new Set(products.flatMap((p) => p.colors || []).filter(Boolean))
      ),
    [products]
  );
  const sizes = useMemo(
    () =>
      Array.from(
        new Set(products.flatMap((p) => p.sizes || []).filter(Boolean))
      ),
    [products]
  );
  const frameTypes = useMemo(
    () =>
      Array.from(new Set(products.map((p) => p.frame_type).filter(Boolean))),
    [products]
  );
  const materials = useMemo(
    () =>
      Array.from(new Set(products.map((p) => p.material).filter(Boolean))),
    [products]
  );

  // ---- filter toggle helper ----
  const toggleFilter = (setState: any, item: string) => {
    setState((prev: string[]) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  };

  // ---- clear all ----
  const clearAll = () => {
    setPriceRange({ min: 0, max: 25000 });
    setSelectedGenders([]);
    setSelectedTypes([]);
    setSelectedBrands([]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedFrameTypes([]);
    setSelectedMaterials([]);
    setSelectedCollections([]);
  };

  const totalActiveFilters =
    selectedGenders.length +
    selectedTypes.length +
    selectedBrands.length +
    selectedColors.length +
    selectedSizes.length +
    selectedFrameTypes.length +
    selectedMaterials.length +
    selectedCollections.length +
    (priceRange.max < 25000 ? 1 : 0);

  // ---- filtered + sorted products ----
  const filteredProducts = useMemo(() => {
    const isLensMode =
      searchType === "lens" || selectedTypes.includes("lens");

    if (isLensMode) {
      let result = [...lenses];
      if (routerSearch) {
        result = result.filter(
          (l) =>
            l.name.toLowerCase().includes(routerSearch) ||
            l.description?.toLowerCase().includes(routerSearch)
        );
      }
      if (searchLensType) {
        result = result.filter(
          (l) =>
            l.sub_category?.toLowerCase() === searchLensType.toLowerCase() ||
            l.category?.toLowerCase() === searchLensType.toLowerCase()
        );
      }
      result = result.filter(
        (l) => l.price >= priceRange.min && l.price <= priceRange.max
      );
      return result.map((l) => ({ ...l, isLens: true }));
    }

    let result = [...products];

    if (routerSearch) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(routerSearch) ||
          p.brand?.toLowerCase().includes(routerSearch) ||
          p.description?.toLowerCase().includes(routerSearch)
      );
    }

    if (selectedGenders.length > 0) {
      result = result.filter((p) => {
        const pGenders = parseArray(p.gender);
        return (
          pGenders.some((g) => selectedGenders.includes(g)) ||
          p.product_categories?.some(
            (pc: any) =>
              pc.categories?.type === "gender" &&
              selectedGenders.includes(pc.categories.name)
          )
        );
      });
    }

    if (selectedTypes.length > 0) {
      result = result.filter((p) => {
        const pTypes = parseArray(p.product_type).map((t) => t.toLowerCase());
        const selectedLower = selectedTypes.map((t) => t.toLowerCase());

        const matchesType = pTypes.some((t) => {
          if (selectedLower.includes(t)) return true;
          if (t === "accessory" && selectedLower.includes("accessories"))
            return true;
          if (t === "accessories" && selectedLower.includes("accessory"))
            return true;
          return false;
        });

        const matchesCategory = p.product_categories?.some(
          (pc: any) =>
            pc.categories?.type === "product" &&
            selectedLower.includes(pc.categories.name.toLowerCase())
        );

        return matchesType || matchesCategory;
      });
    }

    if (selectedCollections.length > 0) {
      result = result.filter((p) => {
        const pCollections = parseArray(p.collection);
        return (
          pCollections.some((col) => selectedCollections.includes(col)) ||
          p.product_categories?.some(
            (pc: any) =>
              pc.categories?.type === "collection" &&
              selectedCollections.includes(pc.categories.name)
          )
        );
      });
    }

    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }
    if (selectedColors.length > 0) {
      result = result.filter(
        (p) => p.colors && selectedColors.some((c) => p.colors.includes(c))
      );
    }
    if (selectedSizes.length > 0) {
      result = result.filter(
        (p) => p.sizes && selectedSizes.some((s) => p.sizes.includes(s))
      );
    }
    if (selectedFrameTypes.length > 0) {
      result = result.filter((p) => selectedFrameTypes.includes(p.frame_type));
    }
    if (selectedMaterials.length > 0) {
      result = result.filter((p) => selectedMaterials.includes(p.material));
    }

    result = result.filter((p) => {
      const effectivePrice = p.discount_price || p.price;
      return effectivePrice >= priceRange.min && effectivePrice <= priceRange.max;
    });

    if (viewMode === "price_asc") {
      result.sort(
        (a, b) =>
          (a.discount_price || a.price) - (b.discount_price || b.price)
      );
    } else if (viewMode === "price_desc") {
      result.sort(
        (a, b) =>
          (b.discount_price || b.price) - (a.discount_price || a.price)
      );
    } else if (viewMode === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }

    return result;
  }, [
    products,
    lenses,
    searchType,
    searchLensType,
    routerSearch,
    selectedGenders,
    selectedTypes,
    selectedCollections,
    selectedBrands,
    selectedColors,
    selectedSizes,
    selectedFrameTypes,
    selectedMaterials,
    priceRange,
    viewMode,
  ]);

  // ---- derived heading ----
  const pageTitle = routerSearch
    ? `Results for "${routerSearch}"`
    : [...selectedTypes, ...selectedGenders, ...selectedCollections].join(", ") ||
      "Shop Eyewear";

  const activeCrumb =
    [...selectedTypes, ...selectedGenders, ...selectedCollections][0] || "All";

  // ---- grid classes ----
  const gridColClass =
    gridMode === "2col"
      ? "grid-cols-2"
      : gridMode === "3col"
      ? "grid-cols-2 md:grid-cols-3"
      : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

  // ---- sidebar content (shared between desktop and mobile drawer) ----
  const SidebarContent = () => (
    <div className="space-y-0">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#ECECEC]">
        <span className="text-sm font-semibold text-[#111111]">Filters</span>
        {totalActiveFilters > 0 && (
          <button
            onClick={clearAll}
            className="bg-[#F8F9FC] border border-[#ECECEC] text-sm text-[#666666] rounded-full px-4 py-1.5 hover:border-[#004AAD] hover:text-[#004AAD] transition-all"
          >
            Clear All
          </button>
        )}
      </div>

      {dynamicGenders.length > 0 && (
        <FilterSection
          title="Gender"
          activeCount={selectedGenders.length}
          defaultOpen
        >
          {dynamicGenders.map((opt) => (
            <CheckboxOption
              key={opt}
              opt={opt}
              checked={selectedGenders.includes(opt)}
              onChange={() => toggleFilter(setSelectedGenders, opt)}
            />
          ))}
        </FilterSection>
      )}

      {dynamicTypes.length > 0 && (
        <FilterSection
          title="Type"
          activeCount={selectedTypes.length}
          defaultOpen
        >
          {dynamicTypes.map((opt) => (
            <CheckboxOption
              key={opt}
              opt={opt}
              checked={selectedTypes.includes(opt)}
              onChange={() => toggleFilter(setSelectedTypes, opt)}
            />
          ))}
        </FilterSection>
      )}

      {dynamicCollections.length > 0 && (
        <FilterSection
          title="Collection"
          activeCount={selectedCollections.length}
        >
          {dynamicCollections.map((opt) => (
            <CheckboxOption
              key={opt}
              opt={opt}
              checked={selectedCollections.includes(opt)}
              onChange={() => toggleFilter(setSelectedCollections, opt)}
            />
          ))}
        </FilterSection>
      )}

      {brands.length > 0 && (
        <FilterSection title="Brand" activeCount={selectedBrands.length}>
          {brands.map((opt) => (
            <CheckboxOption
              key={opt}
              opt={opt}
              checked={selectedBrands.includes(opt)}
              onChange={() => toggleFilter(setSelectedBrands, opt)}
            />
          ))}
        </FilterSection>
      )}

      {/* Price Slider */}
      <FilterSection
        title="Price"
        activeCount={priceRange.max < 25000 ? 1 : 0}
        defaultOpen
      >
        <div className="space-y-3 pt-1 pb-2">
          <div className="flex justify-between text-sm">
            <span className="text-[#666666]">₹0</span>
            <span className="font-semibold text-[#03173D]">
              ₹{priceRange.max.toLocaleString()}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="25000"
            step="500"
            value={priceRange.max}
            onChange={(e) =>
              setPriceRange((prev) => ({
                ...prev,
                max: Number(e.target.value),
              }))
            }
            className="w-full accent-[#03173D] h-1.5 rounded-full cursor-pointer"
          />
        </div>
      </FilterSection>

      {frameTypes.length > 0 && (
        <FilterSection
          title="Frame Type"
          activeCount={selectedFrameTypes.length}
        >
          {frameTypes.map((opt) => (
            <CheckboxOption
              key={opt}
              opt={opt}
              checked={selectedFrameTypes.includes(opt)}
              onChange={() => toggleFilter(setSelectedFrameTypes, opt)}
            />
          ))}
        </FilterSection>
      )}

      {materials.length > 0 && (
        <FilterSection title="Material" activeCount={selectedMaterials.length}>
          {materials.map((opt) => (
            <CheckboxOption
              key={opt}
              opt={opt}
              checked={selectedMaterials.includes(opt)}
              onChange={() => toggleFilter(setSelectedMaterials, opt)}
            />
          ))}
        </FilterSection>
      )}

      {colors.length > 0 && (
        <FilterSection title="Colors" activeCount={selectedColors.length}>
          <div className="flex flex-wrap gap-2 pt-1 pb-2">
            {colors.map((color) => (
              <button
                key={color}
                title={color}
                onClick={() => toggleFilter(setSelectedColors, color)}
                className={`w-6 h-6 rounded-full border-2 transition-all ${
                  selectedColors.includes(color)
                    ? "border-[#03173D] ring-2 ring-[#03173D]/20"
                    : "border-transparent hover:border-[#E8EAF2]"
                }`}
                style={{
                  backgroundColor: color.startsWith("#") ? color : undefined,
                  background: !color.startsWith("#") ? color : undefined,
                }}
              />
            ))}
          </div>
        </FilterSection>
      )}

      {sizes.length > 0 && (
        <FilterSection title="Size" activeCount={selectedSizes.length}>
          {sizes.map((opt) => (
            <CheckboxOption
              key={opt}
              opt={opt}
              checked={selectedSizes.includes(opt)}
              onChange={() => toggleFilter(setSelectedSizes, opt)}
            />
          ))}
        </FilterSection>
      )}
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      {/* ------------------------------------------------------------------ */}
      {/* Page Header                                                          */}
      {/* ------------------------------------------------------------------ */}
      <div className="bg-white pt-28 pb-8 px-6 lg:px-12 border-b border-[#ECECEC]">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#666666] mb-4">
          <Link href="/" className="hover:text-[#004AAD] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href="/products"
            className="hover:text-[#004AAD] transition-colors"
          >
            Shop
          </Link>
          <span>/</span>
          <span className="text-[#111111] font-medium">{activeCrumb}</span>
        </nav>

        <h1
          className="text-4xl font-[var(--font-hero)] italic text-[#111111] mb-2"
          style={{ fontFamily: "var(--font-hero, serif)" }}
        >
          {pageTitle}
        </h1>
        <p className="text-sm text-[#666666]">
          {loading ? "Loading..." : `${filteredProducts.length} results`}
        </p>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Sticky Toolbar                                                        */}
      {/* ------------------------------------------------------------------ */}
      <div className="bg-white border-b border-[#ECECEC] sticky top-0 z-30 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="px-6 lg:px-12 py-4 flex items-center gap-3 flex-wrap">
          {/* Mobile filter toggle */}
          <button
            className="lg:hidden flex items-center gap-2 rounded-full border border-[#E8EAF2] text-[#111111] text-sm px-4 py-2.5 hover:border-[#004AAD] transition-colors"
            onClick={() => setMobileFilterOpen(true)}
          >
            <SlidersHorizontal size={14} />
            Filters
            {totalActiveFilters > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#004AAD] text-white text-[10px] font-bold flex items-center justify-center">
                {totalActiveFilters}
              </span>
            )}
          </button>

          {/* Search */}
          <input
            type="text"
            placeholder="Search eyewear..."
            defaultValue={routerSearch}
            readOnly
            className="bg-[#F8F9FC] border border-[#E8EAF2] rounded-full px-4 py-2.5 text-sm w-56 text-[#111111] focus:border-[#004AAD] focus:ring-2 focus:ring-[#004AAD]/10 outline-none cursor-default"
          />

          {/* Spacer */}
          <div className="flex-1" />

          {/* Results count */}
          <span className="hidden sm:block text-sm text-[#666666]">
            {loading ? "—" : `${filteredProducts.length} items`}
          </span>

          {/* Sort */}
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as SortMode)}
            className="bg-[#F8F9FC] border border-[#E8EAF2] rounded-full px-4 py-2.5 text-sm text-[#111111] focus:border-[#004AAD] focus:ring-2 focus:ring-[#004AAD]/10 outline-none cursor-pointer"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="popularity">Popularity</option>
          </select>

          {/* Grid toggle */}
          <div className="hidden md:flex items-center gap-1 bg-[#F8F9FC] border border-[#E8EAF2] rounded-full p-1">
            <button
              onClick={() => setGridMode("2col")}
              className={`p-1.5 rounded-full transition-all ${
                gridMode === "2col"
                  ? "bg-[#03173D] text-white"
                  : "text-[#666666] hover:text-[#111111]"
              }`}
              title="2 columns"
            >
              <Grid2X2 size={14} />
            </button>
            <button
              onClick={() => setGridMode("3col")}
              className={`p-1.5 rounded-full transition-all ${
                gridMode === "3col"
                  ? "bg-[#03173D] text-white"
                  : "text-[#666666] hover:text-[#111111]"
              }`}
              title="3 columns"
            >
              <Grid3X3 size={14} />
            </button>
            <button
              onClick={() => setGridMode("4col")}
              className={`p-1.5 rounded-full transition-all ${
                gridMode === "4col"
                  ? "bg-[#03173D] text-white"
                  : "text-[#666666] hover:text-[#111111]"
              }`}
              title="4 columns"
            >
              <LayoutGrid size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Mobile Filter Drawer                                                  */}
      {/* ------------------------------------------------------------------ */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/20 z-40 lg:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed left-0 top-0 h-full w-80 bg-white z-50 overflow-y-auto p-6 shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-base font-semibold text-[#111111]">
                  Filters
                </span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F8F9FC] text-[#666666] hover:text-[#111111] transition-all"
                >
                  <X size={16} />
                </button>
              </div>
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------------ */}
      {/* Main Content                                                          */}
      {/* ------------------------------------------------------------------ */}
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-10 flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <div className="bg-white border border-[#ECECEC] rounded-3xl p-6 space-y-2 sticky top-24">
            <SidebarContent />
          </div>
        </aside>

        {/* Product Grid */}
        <section className="flex-1 min-w-0">
          {loading ? (
            <div
              className={`grid ${gridColClass} gap-6 md:gap-8`}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-[#F8F9FC] rounded-3xl animate-pulse border border-[#ECECEC] aspect-square"
                />
              ))}
            </div>
          ) : fetchError ? (
            <div className="py-32 text-center flex flex-col items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-[#F8F9FC] border border-[#ECECEC] flex items-center justify-center text-2xl">
                📡
              </div>
              <h3 className="text-xl font-semibold text-[#111111]">
                Failed to load products
              </h3>
              <p className="text-sm text-[#666666]">{fetchError}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-[#03173D] text-white rounded-full px-8 py-3 font-semibold hover:bg-[#004AAD] transition-all"
              >
                Try Again
              </button>
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              <div className={`grid ${gridColClass} gap-6 md:gap-8`}>
                <AnimatePresence mode="popLayout">
                  {filteredProducts.slice(0, page * PAGE_SIZE).map((item, i) => (
                    <motion.div
                      layout
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{
                        duration: 0.4,
                        delay: (i % 12) * 0.04,
                      }}
                    >
                      {item.isLens ? (
                        <LensCard lens={item} />
                      ) : (
                        <ProductCard product={item} />
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Load More */}
              {filteredProducts.length > page * PAGE_SIZE && (
                <div className="mt-12 mx-auto flex flex-col items-center gap-3">
                  <p className="text-sm text-[#666666]">
                    Showing{" "}
                    {Math.min(page * PAGE_SIZE, filteredProducts.length)} of{" "}
                    {filteredProducts.length}
                  </p>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    className="bg-[#03173D] text-white rounded-full px-10 py-4 font-semibold hover:bg-[#004AAD] transition-all"
                  >
                    Load More
                  </button>
                </div>
              )}

              {filteredProducts.length <= page * PAGE_SIZE &&
                filteredProducts.length > PAGE_SIZE && (
                  <p className="mt-12 text-center text-sm text-[#666666]">
                    All {filteredProducts.length} results shown
                  </p>
                )}
            </>
          ) : (
            <div className="py-32 text-center flex flex-col items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-[#F8F9FC] border border-[#ECECEC] flex items-center justify-center text-2xl">
                🔍
              </div>
              <h3 className="text-xl font-semibold text-[#111111]">
                No matches found
              </h3>
              <p className="text-sm text-[#666666]">
                Try adjusting your filters to find what you&apos;re looking for.
              </p>
              <button
                onClick={clearAll}
                className="bg-[#03173D] text-white rounded-full px-8 py-3 font-semibold hover:bg-[#004AAD] transition-all"
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
