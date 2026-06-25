"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBag, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const totalItems = useCartStore((s) => s.items.reduce((a, i) => a + Number(i.quantity || 0), 0));
  const wishlistCount = useWishlistStore((s) => s.items.length);

  const isAdmin = pathname?.startsWith("/admin") || pathname === "/secure-admin-login";
  if (isAdmin) return null;

  const tabs = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/products", icon: Search, label: "Shop" },
    { href: "/cart", icon: ShoppingBag, label: "Cart", badge: totalItems },
    { href: "/wishlist", icon: Heart, label: "Wishlist", badge: wishlistCount },
    { href: "/dashboard", icon: User, label: "Account" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-[#E8EAF2] shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-around px-2 py-2 pb-[env(safe-area-inset-bottom,8px)]">
        {tabs.map(({ href, icon: Icon, label, badge }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all min-w-[56px]"
            >
              <div className="relative">
                <Icon
                  size={22}
                  className={cn(
                    "transition-colors",
                    active ? "text-[#03173D]" : "text-[#999999]"
                  )}
                  strokeWidth={active ? 2.5 : 1.8}
                />
                {badge != null && badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#004AAD] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {badge > 9 ? "9+" : badge}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium transition-colors",
                  active ? "text-[#03173D] font-semibold" : "text-[#999999]"
                )}
              >
                {label}
              </span>
              {active && (
                <div className="w-1 h-1 bg-[#03173D] rounded-full mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
