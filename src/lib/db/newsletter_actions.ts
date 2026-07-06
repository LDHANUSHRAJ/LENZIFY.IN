"use server";

import { createClient } from "@/lib/supabase/server";
import { rateLimitAction } from "@/lib/rateLimit";

export async function subscribeNewsletter(email: string) {
  if (await rateLimitAction("newsletter", 5)) {
    return { error: "Too many attempts. Please wait a minute." };
  }

  const trimmed = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { error: "Please enter a valid email address." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("newsletter_subscribers").insert({ email: trimmed });

  if (error) {
    if (error.code === "23505") {
      return { error: "You're already subscribed!" };
    }
    return { error: "Failed to subscribe. Please try again." };
  }

  return { success: true };
}
