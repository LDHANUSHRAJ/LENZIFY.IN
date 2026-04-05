"use client";

import ProductGrid from "@/components/shop/ProductGrid";
import { Suspense } from "react";

export default function ProductsPage() {
  return (
    <div className="bg-surface pt-24 min-h-screen">
      <Suspense fallback={
        <div className="min-h-screen bg-surface flex items-center justify-center text-primary font-serif italic text-2xl tracking-tighter">
          Accessing Archive...
        </div>
      }>
        <ProductGrid />
      </Suspense>
    </div>
  );
}
