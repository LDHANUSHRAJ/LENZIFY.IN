"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SmoothScroll from "@/components/lenis/SmoothScroll";

/**
 * 🛠️ CONDITIONAL LAYOUT ORCHESTRATOR
 * This wrapper ensures that storefront navigation protocols are inhibited
 * during administrative sessions to prevent UI collision.
 */
export default function ConditionalWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Logic: Isolate any route starting with /admin or the admin login portal
  const isAdminPath = pathname?.startsWith("/admin") || pathname === "/secure-admin-login";
  
  if (isAdminPath) {
    return (
      <main className="min-h-screen">
        {children}
      </main>
    );
  }

  return (
    <SmoothScroll>
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </SmoothScroll>
  );
}
