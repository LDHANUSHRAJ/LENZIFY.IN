import { Edit, ArrowLeft, Cpu } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import EditProductForm from "./EditProductForm";
import { notFound } from "next/navigation";

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const { id } = await params;
  const sParams = await searchParams;
  const isSuccess = sParams.success === "true";
  const error = sParams.error;

  const supabase = await createClient();

  // Fetch product data
  const { data: product } = await supabase
    .from("products")
    .select(`
      *,
      product_images (
        id,
        image_url,
        is_primary
      ),
      product_lenses (
        lens_id
      ),
      product_categories (
        category_id
      )
    `)
    .eq("id", id)
    .single();

  if (!product) {
    notFound();
  }

  const productLenses = (product.product_lenses || []).map((pl: any) => pl.lens_id);
  const productCategories = (product.product_categories || []).map((pc: any) => pc.category_id);

  const { data: categories } = await supabase.from("categories").select("*").eq("is_active", true);
  const { data: lenses } = await supabase.from("lenses").select("*").eq("is_active", true);

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 border-b border-brand-navy/5 pb-10">
        <div className="space-y-2">
           <Link href="/admin/products" className="text-[9px] font-bold uppercase tracking-[0.4em] text-secondary flex items-center gap-2 hover:translate-x-1 transition-transform mb-4">
              <ArrowLeft size={10} />
              Return to Catalog
           </Link>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary italic">Modify Resource</p>
          <h1 className="text-4xl md:text-5xl font-serif italic text-brand-navy tracking-tight">Edit <span className="text-secondary">{product.name}</span></h1>
        </div>
      </header>

      {isSuccess && (
        <div className="bg-emerald-50 border border-emerald-100 p-8 flex items-center gap-6 shadow-xl">
           <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white shrink-0"><Edit size={24} /></div>
           <div>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-emerald-900">Protocol Success</h3>
              <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-600 mt-1 italic">Model updated successfully.</p>
           </div>
           <Link href={`/product/${product.id}`} className="ml-auto bg-emerald-500 text-white px-6 py-3 text-[9px] font-bold uppercase tracking-widest hover:bg-emerald-600">View Public Listing</Link>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-100 p-8 flex items-center gap-6 shadow-xl">
           <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white shrink-0"><Cpu size={24} /></div>
           <div className="flex-1">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-red-900">Update Failure</h3>
              <p className="text-[9px] font-bold uppercase tracking-widest text-red-600 mt-1 italic">{error}</p>
           </div>
        </div>
      )}

      <EditProductForm 
        product={product} 
        categories={categories || []} 
        lenses={lenses || []} 
        productLenses={productLenses}
        productCategories={productCategories}
      />
    </div>
  );
}
