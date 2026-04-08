import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ProductDetailsClient from "./ProductDetailsClient";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Fetch Product with Images
  const { data: product } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .eq("id", id)
    .single();

  if (!product) {
    notFound();
  }

  // 2. Fetch Similar Products
  const { data: similarProducts } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .eq("category_id", product.category_id)
    .neq("id", id)
    .limit(4);

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

  return (
    <ProductDetailsClient 
      product={product}
      user={user}
      similarProducts={similarProducts || []}
      initialReviews={reviews || []}
      isInWishlist={isInWishlist}
    />
  );
}
