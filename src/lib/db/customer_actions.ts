"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * CART ACTIONS
 */

export async function getCart() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("cart")
    .select("*, products(name, price, offer_price, product_images(*)), lenses(name, price), lens_config")
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching cart:", error);
    return [];
  }
  return data;
}

export async function addToCart(product_id: string, options: { 
  quantity?: number; 
  lens_id?: string | null; 
  lens_config?: any;
  prescription_json?: any;
  price?: number;
  color?: string;
  size?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Login required" };

  // Check if item already in cart
  const { data: existing } = await supabase
    .from("cart")
    .select("id, quantity")
    .eq("user_id", user.id)
    .eq("product_id", product_id)
    // If it has a prescription or specific lens, we usually don't merge quantities, but for simplicity we can just check if it's identical
    // Actually, if they are adding different prescriptions for the same frame, we shouldn't merge them.
    // For now, let's strictly match product, lens_id, and prescription
    // But supabase maybeSingle throws if multiple. We will handle without merging if there's a prescription.
    .eq("lens_id", options.lens_id || null)
    .limit(1)
    .single();

  // It's safer to always insert a new cart item if there's a custom prescription, or we can just ignore maybeSingle error. Let's just insert as new if prescription exists.
  if (existing && !options.prescription_json && !options.lens_config) {
    await supabase
      .from("cart")
      .update({ quantity: (existing.quantity || 0) + (options.quantity || 1) })
      .eq("id", existing.id);
  } else {
    await supabase.from("cart").insert({
      user_id: user.id,
      product_id,
      quantity: options.quantity || 1,
      lens_id: options.lens_id || null,
      lens_config: options.lens_config || null,
      prescription_json: options.prescription_json || null,
      price: options.price
    });
  }

  revalidatePath("/cart");
  return { success: true };
}

export async function removeFromCart(cartItemId: number) {
  const supabase = await createClient();
  await supabase.from("cart").delete().eq("id", cartItemId);
  revalidatePath("/cart");
}

export async function updateCartQuantity(cartItemId: number, quantity: number) {
  const supabase = await createClient();
  await supabase.from("cart").update({ quantity }).eq("id", cartItemId);
  revalidatePath("/cart");
}

/**
 * WISHLIST ACTIONS
 */

export async function getWishlist() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("wishlist")
    .select("*, products(name, price, offer_price, product_images(*))")
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching wishlist:", error);
    return [];
  }
  return data;
}

export async function toggleWishlist(product_id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Login required" };

  const { data: existing } = await supabase
    .from("wishlist")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", product_id)
    .maybeSingle();

  if (existing) {
    await supabase.from("wishlist").delete().eq("id", existing.id);
  } else {
    await supabase.from("wishlist").insert({ user_id: user.id, product_id });
  }

  revalidatePath("/wishlist");
  revalidatePath("/");
  return { success: !existing };
}
