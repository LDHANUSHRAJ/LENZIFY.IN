"use server";

import { createClient } from "@/lib/supabase/server";
import { rateLimitAction } from "@/lib/rateLimit";

/**
 * Validate and apply a coupon code
 */
export async function applyCoupon(code: string, subtotal: number) {
  if (await rateLimitAction('coupon', 10)) {
    return { error: "Too many coupon attempts. Please wait a minute." };
  }

  if (!code || !code.trim()) {
    return { error: "Please enter a coupon code." };
  }

  const supabase = await createClient();

  const { data: coupon, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", code.trim().toUpperCase())
    .eq("is_enabled", true)
    .single();

  if (error || !coupon) {
    return { error: "Invalid coupon code. Please check and try again." };
  }

  // Check expiry
  if (coupon.expiry && new Date(coupon.expiry) < new Date()) {
    return { error: "This coupon has expired." };
  }

  // Check usage limit
  if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
    return { error: "This coupon has reached its usage limit." };
  }

  // Check minimum order
  if (coupon.min_order && subtotal < coupon.min_order) {
    return { error: `Minimum order of ₹${coupon.min_order} required for this coupon.` };
  }

  // Calculate discount
  let discount = 0;
  if (coupon.discount_type === "percentage") {
    discount = (subtotal * coupon.discount_value) / 100;
    // Cap at max discount if defined in rules
    const maxDiscount = coupon.rules?.max_discount;
    if (maxDiscount && discount > maxDiscount) {
      discount = maxDiscount;
    }
  } else {
    // flat
    discount = coupon.discount_value;
  }

  // Don't let discount exceed subtotal
  if (discount > subtotal) {
    discount = subtotal;
  }

  return {
    success: true,
    discount: Math.round(discount * 100) / 100,
    coupon_id: coupon.id,
    description:
      coupon.discount_type === "percentage"
        ? `${coupon.discount_value}% off`
        : `₹${coupon.discount_value} off`,
  };
}

/**
 * Increment coupon usage count after successful order
 */
export async function incrementCouponUsage(couponId: number) {
  const supabase = await createClient();
  await supabase.rpc("increment_coupon_usage", { coupon_id: couponId });
}
