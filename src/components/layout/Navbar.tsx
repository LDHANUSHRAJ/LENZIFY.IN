"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { createClient } from "@/lib/supabase/client";
import UserMenu from "./UserMenu";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const [user, setUser] = useState<any>(null);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const supabase = createClient();

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
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "Eyeglasses", href: "/products?category=eyeglasses" },
    { name: "Sunglasses", href: "/products?category=sunglasses" },
    { name: "Lenses", href: "/lenses" },
    { name: "Stores", href: "/stores" },
    { name: "Contact Us", href: "/contact" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className={cn(
      "fixed top-0 w-full z-50 transition-all duration-500",
      isScrolled ? "bg-surface/95 backdrop-blur-md editorial-shadow py-4" : "bg-surface py-6"
    )}>
      <nav className="flex justify-between items-center px-12 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-12">
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-primary focus:outline-none p-1"
          >
            <span className="material-symbols-outlined text-2xl">
              {isMobileMenuOpen ? "close" : "menu"}
            </span>
          </button>

          <Link 
            href="/" 
            className="text-2xl font-serif italic tracking-tighter text-primary hover:opacity-70 transition-opacity"
          >
            LENZIFY
          </Link>
          
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "font-medium transition-colors duration-300 py-1",
                    isActive 
                      ? "text-secondary border-b border-secondary" 
                      : "text-primary hover:text-secondary"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
        
        <div className="flex items-center gap-4 md:gap-6">
          <div className={cn(
            "hidden md:flex items-center border-b transition-all duration-500",
            isSearchOpen ? "w-48 border-outline/30" : "w-8 border-transparent"
          )}>
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={cn("text-on-surface hover:text-secondary transition-colors p-1", isSearchOpen && "text-secondary")}
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
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-primary/20 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Content */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 left-0 w-[85%] max-w-sm h-full bg-surface editorial-shadow p-12 flex flex-col"
            >
              <div className="flex justify-between items-center mb-16">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-serif italic italic tracking-tighter text-primary">
                  LENZIFY
                </Link>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-secondary p-2">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Mobile Search */}
              <div className="mb-12">
                <form onSubmit={handleSearch} className="flex items-center border-b border-outline/20 pb-2">
                  <span className="material-symbols-outlined text-xl text-on-surface/40 mr-3">search</span>
                  <input 
                    type="text" 
                    placeholder="Search Archive..." 
                    className="bg-transparent border-none focus:ring-0 text-xs font-bold uppercase tracking-widest w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
              </div>

              {/* Links */}
              <div className="space-y-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-lg font-serif italic text-primary hover:text-secondary transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="mt-auto space-y-6 pt-12 border-t border-outline/10">
                <div className="flex items-center gap-6">
                  <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                    <span className="material-symbols-outlined text-xl">person</span>
                    Identity
                  </Link>
                  <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                    <span className="material-symbols-outlined text-xl text-secondary">favorite</span>
                    Vault
                  </Link>
                </div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface/30 italic">© 2026 Lenzify Archive</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
