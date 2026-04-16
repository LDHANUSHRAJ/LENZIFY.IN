"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { createClient } from "@/lib/supabase/client";
import UserMenu from "./UserMenu";

// Mega Menu Content
const SHOP_CATEGORIES = [
  { name: "Eyeglasses", href: "/products?category=eyeglasses" },
  { name: "Sunglasses", href: "/products?category=sunglasses" },
  { name: "Computer Glasses", href: "/products?category=computer-glasses" },
  { name: "Reading Glasses", href: "/products?category=reading-glasses" },
  { name: "Contact Lenses", href: "/products?category=contact-lenses" },
  { name: "Accessories", href: "/products?category=accessories" },
];

const SHOP_GENDER = [
  { name: "Men", href: "/products?gender=men" },
  { name: "Women", href: "/products?gender=women" },
  { name: "Kids", href: "/products?gender=kids" },
];

const SHOP_COLLECTION = [
  { name: "New Arrivals", href: "/products?collection=new-arrivals" },
  { name: "Trending", href: "/products?collection=trending" },
  { name: "Best Sellers", href: "/products?collection=best-sellers" },
  { name: "Premium Collection", href: "/products?collection=premium" },
];

const LENS_OPTIONS = [
  { name: "Single Vision", href: "/products?type=lens&lens_type=single-vision" },
  { name: "Progressive", href: "/products?type=lens&lens_type=progressive" },
  { name: "Blue Light", href: "/products?type=lens&lens_type=blue-light" },
  { name: "Photochromic", href: "/products?type=lens&lens_type=photochromic" },
  { name: "Zero Power", href: "/products?type=lens&lens_type=zero-power" },
];

const OFFERS = [
  { name: "Discounts", href: "/offers?type=discounts" },
  { name: "Coupons", href: "/offers?type=coupons" },
  { name: "Seasonal Sales", href: "/offers?type=seasonal-sales" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const [user, setUser] = useState<any>(null);
  const [brands, setBrands] = useState<{name: string, slug: string}[]>([]);
  
  const totalItems = useCartStore((state) => state.getTotalItems());
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const supabase = createClient();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  useEffect(() => {
    const fetchBrands = async () => {
      const { data } = await supabase
        .from("categories")
        .select("name, slug")
        .eq("type", "brand")
        .eq("is_active", true)
        .order("name", { ascending: true });
        
      if (data && data.length > 0) {
        setBrands(data);
      } else {
        setBrands([
          { name: "RayBan", slug: "rayban" },
          { name: "Titan", slug: "titan" },
          { name: "Fastrack", slug: "fastrack" },
          { name: "Oakley", slug: "oakley" }
        ]);
      }
    };
    fetchBrands();
  }, [supabase]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setActiveMenu(null);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
      setSearchQuery("");
      setActiveMenu(null);
    }
  };

  const toggleMenu = (menu: string) => {
    if (activeMenu === menu) setActiveMenu(null);
    else setActiveMenu(menu);
  };

  return (
    <header 
      ref={navRef}
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-500",
        (isScrolled || activeMenu) ? "bg-surface/95 backdrop-blur-md editorial-shadow py-4" : "bg-surface py-6"
      )}
    >
      <nav className="flex justify-between items-center px-6 lg:px-12 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-4">
          {/* Back Button (Conditional) */}
          {pathname !== '/' && (
            <button 
              onClick={() => router.back()}
              className="text-primary hover:text-secondary transition-colors p-1 flex items-center gap-1 group"
              title="Go Back"
              suppressHydrationWarning
            >
              <span className="material-symbols-outlined text-2xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
              <span className="hidden sm:inline text-[8px] font-black uppercase tracking-widest">Back</span>
            </button>
          )}

          {/* Mobile Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-primary focus:outline-none p-1"
            suppressHydrationWarning
          >
            <span className="material-symbols-outlined text-2xl">
              {isMobileMenuOpen ? "close" : "menu"}
            </span>
          </button>

          {/* 🔹 Left Side (Brand) */}
          <Link 
            href="/" 
            className="text-2xl font-serif italic tracking-tighter text-primary hover:opacity-70 transition-opacity"
          >
            LENZIFY
          </Link>
        </div>
        
        {/* 🔹 Center (Core Navigation) */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-10 absolute left-1/2 -translate-x-1/2">
          {/* Home */}
          <Link
            href="/"
            className={cn(
              "font-medium transition-colors duration-300 py-1",
              pathname === '/' ? "text-secondary border-b border-secondary" : "text-primary hover:text-secondary"
            )}
          >
            Home
          </Link>

          {/* Shop */}
          <div className="relative">
            <button 
              onClick={() => toggleMenu('shop')}
              className={cn(
                "font-medium transition-colors duration-300 py-1 flex items-center gap-1",
                activeMenu === 'shop' || pathname.startsWith('/products') ? "text-secondary border-b border-secondary" : "text-primary hover:text-secondary"
              )}
              suppressHydrationWarning
            >
              Shop
              <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>
          </div>

          {/* Lenses */}
          <div className="relative">
            <button 
              onClick={() => toggleMenu('lenses')}
              className={cn(
                "font-medium transition-colors duration-300 py-1 flex items-center gap-1",
                activeMenu === 'lenses' ? "text-secondary border-b border-secondary" : "text-primary hover:text-secondary"
              )}
              suppressHydrationWarning
            >
              Lenses
              <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>
          </div>

          {/* Replace Lenses */}
          <Link
            href="/replace-lenses"
            className={cn(
              "font-medium transition-colors duration-300 py-1",
              pathname === '/replace-lenses' ? "text-secondary border-b border-secondary" : "text-primary hover:text-secondary"
            )}
          >
            Replace Lenses
          </Link>

          {/* Offers */}
          <div className="relative">
            <button 
              onClick={() => toggleMenu('offers')}
              className={cn(
                "font-medium transition-colors duration-300 py-1 flex items-center gap-1",
                activeMenu === 'offers' ? "text-secondary border-b border-secondary" : "text-primary hover:text-secondary"
              )}
              suppressHydrationWarning
            >
              Offers
              <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>
          </div>

          {/* Brands */}
          <div className="relative">
            <button 
              onClick={() => toggleMenu('brands')}
              className={cn(
                "font-medium transition-colors duration-300 py-1 flex items-center gap-1",
                activeMenu === 'brands' ? "text-secondary border-b border-secondary" : "text-primary hover:text-secondary"
              )}
              suppressHydrationWarning
            >
              Brands
              <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>
          </div>
        </div>

        {/* 🔹 Right Side (User Actions) */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Search */}
          <div className={cn(
            "hidden md:flex items-center border-b transition-all duration-500",
            isSearchOpen ? "w-48 border-outline/30" : "w-8 border-transparent"
          )}>
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={cn("text-on-surface hover:text-secondary transition-colors p-1 flex items-center", isSearchOpen && "text-secondary")}
              suppressHydrationWarning
            >
              <span className="material-symbols-outlined text-2xl">search</span>
            </button>
            <form onSubmit={handleSearch} className={cn("flex-grow", !isSearchOpen && "hidden")}>
              <input 
                type="text" 
                placeholder="Product Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-[10px] uppercase font-bold tracking-widest text-on-surface placeholder:text-outline/40 w-full px-2"
              />
            </form>
          </div>

          <Link href="/wishlist" className="relative group p-1 transition-transform hover:scale-110">
            <span className="material-symbols-outlined text-2xl text-primary hover:text-secondary transition-colors">favorite</span>
            {mounted && wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[8px] font-bold text-white shadow-sm">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link href="/cart" className="relative group p-1 transition-transform hover:scale-110">
            <span className="material-symbols-outlined text-2xl text-primary hover:text-secondary transition-colors">shopping_cart</span>
            {mounted && totalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-white shadow-sm">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Account */}
          {user ? (
            <UserMenu user={user} />
          ) : (
            <Link 
              href="/auth/login"
              className="group p-1 transition-transform hover:scale-110"
            >
              <span className="material-symbols-outlined text-2xl text-primary hover:text-secondary transition-colors">person</span>
            </Link>
          )}

          {/* Support */}
          <div className="relative hidden sm:block">
            <button 
              onClick={() => toggleMenu('support')}
              className="group p-1 transition-transform hover:scale-110 flex items-center"
              suppressHydrationWarning
            >
              <span className="material-symbols-outlined text-2xl text-primary hover:text-secondary transition-colors">support_agent</span>
            </button>
            
            <AnimatePresence>
              {activeMenu === 'support' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-6 w-48 bg-white border border-outline/10 shadow-lg p-2 flex flex-col gap-1 z-50 rounded-sm editorial-shadow"
                >
                  <Link href="/contact" className="px-4 py-3 hover:bg-surface-container-low text-xs font-bold uppercase tracking-widest text-primary transition-colors">
                    Contact Us
                  </Link>
                  <Link href="/help" className="px-4 py-3 hover:bg-surface-container-low text-xs font-bold uppercase tracking-widest text-primary transition-colors">
                    Help
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      {/* 🔹 Mega Menu Dropdowns (Desktop) */}
      <AnimatePresence>
        {activeMenu === 'shop' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 w-full bg-white border-t border-outline/10 shadow-xl overflow-hidden z-40 hidden lg:block"
          >
            <div className="max-w-screen-2xl mx-auto px-12 py-10 flex gap-20">
              <div className="flex flex-col gap-4">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-on-surface/40 mb-2">By Category</h3>
                {SHOP_CATEGORIES.map(link => (
                  <Link key={link.name} href={link.href} className="text-sm font-medium text-primary hover:text-secondary transition-colors">
                    {link.name}
                  </Link>
                ))}
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-on-surface/40 mb-2">By Gender</h3>
                {SHOP_GENDER.map(link => (
                  <Link key={link.name} href={link.href} className="text-sm font-medium text-primary hover:text-secondary transition-colors">
                    {link.name}
                  </Link>
                ))}
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-on-surface/40 mb-2">By Collection</h3>
                {SHOP_COLLECTION.map(link => (
                  <Link key={link.name} href={link.href} className="text-sm font-medium text-primary hover:text-secondary transition-colors">
                    {link.name}
                  </Link>
                ))}
              </div>
              <div className="flex-1 bg-surface-container-low p-8 rounded-sm shrink-0 border border-outline/5 relative overflow-hidden group">
                <div className="relative z-10">
                  <h3 className="text-xl font-serif italic text-primary mb-2">Find Your Perfect Pair</h3>
                  <p className="text-xs text-on-surface/60 mb-6 max-w-[200px]">Explore our curated collections designed for every face shape and aesthetic.</p>
                  <Link href="/products" className="inline-block border-b border-primary text-xs font-bold uppercase tracking-widest hover:text-secondary hover:border-secondary transition-all">
                    Shop All
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Small Dropdowns */}
        {(activeMenu === 'lenses' || activeMenu === 'offers' || activeMenu === 'brands') && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={cn(
              "absolute top-full bg-white border border-outline/10 shadow-lg p-2 flex flex-col gap-1 z-50 rounded-sm hidden lg:flex min-w-[200px] editorial-shadow mt-4",
              activeMenu === 'lenses' && "left-[calc(50%-150px)]",
              activeMenu === 'offers' && "left-[calc(50%+60px)]",
              activeMenu === 'brands' && "left-[calc(50%+140px)]"
            )}
          >
            {activeMenu === 'lenses' && LENS_OPTIONS.map(link => (
              <Link key={link.name} href={link.href} className="px-4 py-3 hover:bg-surface-container-low text-xs font-bold uppercase tracking-widest text-primary hover:text-secondary transition-colors rounded-sm">
                {link.name}
              </Link>
            ))}
            {activeMenu === 'offers' && OFFERS.map(link => (
              <Link key={link.name} href={link.href} className="px-4 py-3 hover:bg-surface-container-low text-xs font-bold uppercase tracking-widest text-primary hover:text-secondary transition-colors rounded-sm">
                {link.name}
              </Link>
            ))}
            {activeMenu === 'brands' && brands.map(brand => (
              <Link key={brand.slug} href={`/products?brand=${brand.slug}`} className="px-4 py-3 hover:bg-surface-container-low text-xs font-bold uppercase tracking-widest text-primary hover:text-secondary transition-colors rounded-sm">
                {brand.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔹 Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div 
              className="absolute inset-0 bg-primary/20 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 left-0 w-[85%] max-w-sm h-full bg-surface editorial-shadow p-8 flex flex-col overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-10">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-serif italic tracking-tighter text-primary">
                  LENZIFY
                </Link>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-secondary p-2">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Mobile Search */}
              <div className="mb-8">
                <form onSubmit={handleSearch} className="flex items-center border-b border-outline/20 pb-2">
                  <span className="material-symbols-outlined text-xl text-on-surface/40 mr-3">search</span>
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="bg-transparent border-none focus:ring-0 text-xs font-bold uppercase tracking-widest w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
              </div>

              {/* Mobile Links */}
              <div className="space-y-6 flex-1">
                {/* Home */}
                <Link 
                  href="/" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 transition-colors",
                    pathname === '/' ? "text-secondary" : "text-primary hover:text-secondary"
                  )}
                >
                  <span className="material-symbols-outlined text-xl">home</span>
                  Home
                </Link>

                {/* Shop */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-on-surface/40 mb-4 border-b border-outline/10 pb-2">Shop</h3>
                  <div className="space-y-4 pl-2">
                    <div className="space-y-3 pb-2 border-b border-outline/5">
                      <p className="text-[10px] font-bold text-on-surface/30 uppercase">By Category</p>
                      {SHOP_CATEGORIES.map((link) => (
                        <Link key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-medium text-primary">
                          {link.name}
                        </Link>
                      ))}
                    </div>
                    <div className="space-y-3 pb-2 border-b border-outline/5">
                      <p className="text-[10px] font-bold text-on-surface/30 uppercase">By Gender</p>
                      {SHOP_GENDER.map((link) => (
                        <Link key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-medium text-primary">
                          {link.name}
                        </Link>
                      ))}
                    </div>
                    <div className="space-y-3">
                      <p className="text-[10px] font-bold text-on-surface/30 uppercase">By Collection</p>
                      {SHOP_COLLECTION.map((link) => (
                        <Link key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-medium text-primary">
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Lenses */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-on-surface/40 mb-4 border-b border-outline/10 pb-2">Lenses</h3>
                  <div className="space-y-3 pl-2">
                    {LENS_OPTIONS.map((link) => (
                      <Link key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-medium text-primary">
                        {link.name}
                      </Link>
                    ))}
                    <Link href="/replace-lenses" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-medium text-secondary mt-2">
                      Replace Your Lenses
                    </Link>
                  </div>
                </div>

                {/* Offers */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-on-surface/40 mb-4 border-b border-outline/10 pb-2">Offers</h3>
                  <div className="space-y-3 pl-2">
                    {OFFERS.map((link) => (
                      <Link key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-medium text-primary">
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-on-surface/40 mb-4 border-b border-outline/10 pb-2">Brands</h3>
                  <div className="space-y-3 pl-2">
                    {brands.map((brand) => (
                      <Link key={brand.slug} href={`/products?brand=${brand.slug}`} onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-medium text-primary">
                        {brand.name}
                      </Link>
                    ))}
                  </div>
                </div>
                
                {/* Support */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-on-surface/40 mb-4 border-b border-outline/10 pb-2">Support</h3>
                  <div className="space-y-3 pl-2">
                    <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-medium text-primary">
                      Contact Us
                    </Link>
                    <Link href="/help" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-medium text-primary">
                      Help
                    </Link>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-6 pt-8 border-t border-outline/10 mb-8">
                <div className="flex items-center gap-6">
                  <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                    <span className="material-symbols-outlined text-xl">person</span>
                    Account
                  </Link>
                  <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                    <span className="material-symbols-outlined text-xl text-secondary">favorite</span>
                    Wishlist
                  </Link>
                </div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface/30 italic">© 2026 Lenzify</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
