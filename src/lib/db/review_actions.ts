"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { rateLimitAction } from "@/lib/rateLimit";
import { revalidatePath } from "next/cache";

export async function submitReview(productId: string, rating: number, review: string) {
  if (await rateLimitAction('review', 5)) {
    return { error: "Too many review submissions. Please wait a minute." };
  }

  if (!productId || rating < 1 || rating > 5 || !review.trim() || review.trim().length < 10) {
    return { error: "Invalid review data." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Please log in to submit a review." };

  const { error } = await supabase.from("reviews").insert({
    user_id: user.id,
    product_id: productId,
    rating,
    review: review.trim(),
    status: "pending",
  });

  if (error) {
    console.error("[REVIEW] Submit error:", error);
    return { error: "Failed to submit review. Please try again." };
  }

  try {
    const adminSupabase = await createAdminClient();
    await adminSupabase.from("notifications").insert({
      user_id: null,
      title: "New Review",
      message: `A new ${rating}-star review was submitted and is awaiting approval.`,
      type: "New Review",
      metadata: { product_id: productId },
    });
  } catch {}

  revalidatePath(`/product/${productId}`);
  return { success: true };
}
