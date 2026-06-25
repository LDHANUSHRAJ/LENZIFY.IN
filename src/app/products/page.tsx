import ProductGrid from "@/components/shop/ProductGrid";
import { Suspense } from "react";

export default function ProductsPage() {
  return (
    <div className="bg-white min-h-screen">
      <Suspense
        fallback={
          <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#004AAD] border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <ProductGrid />
      </Suspense>
    </div>
  );
}
