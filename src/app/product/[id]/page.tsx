import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ProductDetailsClient from "./ProductDetailsClient";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Fetch Product with Images and Category info
  const { data: product } = await supabase
    .from("products")
    .select(`
      *,
      product_images(*),
      categories (*)
    `)
    .eq("id", id)
    .single();

  if (!product) {
    notFound();
  }

  // 2. Fetch Similar Products (Based on categories junction table)
  const categoryIds = (product.categories || []).map((c: any) => c.id);
  const { data: similarProducts } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .neq("id", id)
    .limit(4);
  
  // NOTE: Simple filtering for now, in a real app we'd join and filter by categoryIds
  // and maybe prioritize products with matching categories.

  // 3. Fetch Reviews
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, users(name)")
    .eq("product_id", id)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  // 4. Get User Session
  const { data: { user } } = await supabase.auth.getUser();

  // 5. Check Wishlist status
  let isInWishlist = false;
  if (user) {
    const { data: wish } = await supabase
      .from("wishlist")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", id)
      .maybeSingle();
    isInWishlist = !!wish;
  }

  // 6. Fetch compatible lenses (if product_type is frame)
  // and also fetch global options (coatings, materials, etc.)
  let productLenses: any[] = [];
  
  // Fetch ALL active lenses and categorize them
  const { data: allLenses } = await supabase
    .from("lenses")
    .select("*")
    .eq("is_active", true);
  
  if (product.product_type === "frame") {
    // For frames, we specifically want to know which 'primary' lenses are compatible
    const { data: pl } = await supabase
      .from("product_lenses")
      .select("lens_id")
      .eq("product_id", id);
    
    const compatibleLensIds = (pl || []).map(p => p.lens_id);
    
    // We separate lenses into those specifically compatible and global add-ons
    // FALLBACK: If a frame has NO specific mappings, assume ALL primary lenses are compatible
    productLenses = (allLenses || []).filter(lens => 
      lens.category !== "type" || 
      compatibleLensIds.length === 0 || 
      compatibleLensIds.includes(lens.id)
    );
  } else {
    productLenses = allLenses || [];
  }

  return (
    <ProductDetailsClient 
      product={product}
      user={user}
      similarProducts={similarProducts || []}
      initialReviews={reviews || []}
      isInWishlist={isInWishlist}
      availableLenses={productLenses}
    />
  );
}
