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
    .select("*, products(name, price, offer_price, product_images(*))")
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching cart:", error);
    return [];
  }
  return data;
}

export async function addToCart(product_id: string, options: { 
  quantity?: number; 
  lens_type?: string; 
  power_left?: string; 
  power_right?: string;
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
    .maybeSingle();

  if (existing) {
    await supabase
      .from("cart")
      .update({ quantity: (existing.quantity || 0) + (options.quantity || 1) })
      .eq("id", existing.id);
  } else {
    await supabase.from("cart").insert({
      user_id: user.id,
      product_id,
      quantity: options.quantity || 1,
      lens_type: options.lens_type,
      power_left: options.power_left,
      power_right: options.power_right,
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
