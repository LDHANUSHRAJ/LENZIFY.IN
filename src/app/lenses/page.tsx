"use client";

import ProductGrid from "@/components/shop/ProductGrid";
import { Suspense } from "react";

export default function LensesPage() {
  return (
    <div className="bg-background min-h-screen">
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <ProductGrid />
      </Suspense>
    </div>
  );
}
