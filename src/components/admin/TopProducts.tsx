"use client";

import { TrendingUp, Package } from "lucide-react";

interface TopProductsProps {
  products: {
    name: string;
    brand: string;
    sales: number;
  }[];
}

export default function TopProducts({ products }: TopProductsProps) {
  const max = Math.max(...products.map((p) => p.sales), 1);

  return (
    <div className="bg-white border border-[#ECEFF5] rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#ECEFF5]">
        <div className="flex items-center gap-2">
          <TrendingUp size={14} className="text-[#004AAD]" />
          <h2 className="text-sm font-semibold text-[#111111]">Top Products</h2>
        </div>
        <span className="text-[10px] text-[#AAAAAA] font-medium">By units sold</span>
      </div>

      <div className="divide-y divide-[#F5F5F5]">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2 text-[#CCCCCC]">
            <Package size={24} />
            <p className="text-xs">No sales data yet</p>
          </div>
        ) : (
          products.map((product, i) => (
            <div key={i} className="px-5 py-3.5">
              <div className="flex items-center justify-between mb-1.5">
                <div className="min-w-0 flex-1 mr-3">
                  <p className="text-xs font-medium text-[#111111] truncate">{product.name}</p>
                  <p className="text-[10px] text-[#AAAAAA]">{product.brand}</p>
                </div>
                <span className="text-xs font-bold text-[#004AAD] tabular-nums flex-shrink-0">
                  {product.sales} sold
                </span>
              </div>
              <div className="h-1 bg-[#F4F6F8] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#004AAD] rounded-full transition-all duration-500"
                  style={{ width: `${(product.sales / max) * 100}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
