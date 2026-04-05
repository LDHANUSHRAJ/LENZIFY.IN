"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { createClient } from "@/lib/supabase/client";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const totalItems = useCartStore((state) => state.getTotalItems());
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const supabase = createClient();

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

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Eyeglasses", href: "/products" },
    { name: "Sunglasses", href: "/sunglasses" },
    { name: "Lenses", href: "/lenses" },
    { name: "Stores", href: "/stores" },
    { name: "Contact Us", href: "/contact" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className={cn(
      "fixed top-0 w-full z-50 transition-all duration-500",
      isScrolled ? "bg-surface/90 backdrop-blur-md editorial-shadow py-4" : "bg-surface py-6"
    )}>
      <nav className="flex justify-between items-center px-8 md:px-12 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-12">
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
                    "text-xs font-medium tracking-[0.05em] transition-colors duration-300",
                    isActive 
                      ? "text-secondary border-b border-secondary pb-1" 
                      : "text-on-surface hover:text-secondary"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
        
        <div className="flex items-center gap-6 md:gap-8">
          <div className={cn(
            "hidden md:flex items-center border-b transition-all duration-500",
            isSearchOpen ? "w-48 border-outline/30" : "w-8 border-transparent"
          )}>
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={cn("text-on-surface hover:text-secondary transition-colors p-1", isSearchOpen && "text-secondary")}
            >
              <span className="material-symbols-outlined text-xl">search</span>
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

          <Link href="/dashboard" className="relative group">
            <span className="material-symbols-outlined text-xl md:text-2xl hover:text-secondary transition-colors">favorite</span>
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-secondary text-[8px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link href="/cart" className="relative group">
            <span className="material-symbols-outlined text-xl md:text-2xl text-secondary hover:opacity-70 transition-colors">shopping_cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </Link>

          <Link 
            href={user ? "/dashboard" : "/auth/login"}
            className="flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-xl md:text-2xl hover:text-secondary transition-colors">
              {user ? "person" : "login"}
            </span>
            {user && (
              <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface border-b border-on-surface/20 pb-0.5">
                {user.user_metadata?.name?.split(' ')[0] || "Profile"}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}
