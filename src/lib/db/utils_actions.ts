"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Check if the current user has admin access.
 * Uses both the admins table AND user metadata for redundancy.
 */
export async function checkAdminAccess(): Promise<{
  isAdmin: boolean;
  role?: string;
  email?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { isAdmin: false };

  // Check 1: Is the user in the admins table?
  const { data: adminRecord } = await supabase
    .from("admins")
    .select("id, role")
    .eq("id", user.id)
    .maybeSingle();

  if (adminRecord) {
    return { isAdmin: true, role: adminRecord.role, email: user.email };
  }

  // Check 2: Does the user have admin role in user metadata?
  if (user.user_metadata?.role === "admin") {
    return { isAdmin: true, role: "admin", email: user.email };
  }

  // Check 3: Legacy fallback — hardcoded admin email (will be removed in future)
  if (user.email === "lenzify.in@gmail.com") {
    return { isAdmin: true, role: "super admin", email: user.email };
  }

  return { isAdmin: false };
}

/**
 * Subscribe to newsletter
 */
export async function subscribeNewsletter(email: string) {
  if (!email || !email.includes("@")) {
    return { error: "Please enter a valid email address." };
  }

  const supabase = await createClient();

  // Check if already subscribed
  const { data: existing } = await supabase
    .from("store_settings")
    .select("id")
    .eq("key", `newsletter_${email}`)
    .maybeSingle();

  if (existing) {
    return { error: "This email is already subscribed." };
  }

  const { error } = await supabase.from("store_settings").insert({
    key: `newsletter_${email}`,
    value: email,
  });

  if (error) {
    return { error: "Failed to subscribe. Please try again." };
  }

  return { success: true };
}
