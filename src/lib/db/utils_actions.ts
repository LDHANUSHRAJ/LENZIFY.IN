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
