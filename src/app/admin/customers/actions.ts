"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleCustomerBlock(userId: string, currentStatus: boolean) {
  const supabase = await createClient();
  
  // Since we assume an 'is_blocked' column exists or will exist in public.users:
  const { error } = await supabase.from("users").update({ is_blocked: !currentStatus }).eq("id", userId);
  
  if (error) {
    console.error("Error blocking customer:", error);
    return { error: error.message };
  }
  
  revalidatePath("/admin/customers");
}

export async function deleteCustomer(userId: string) {
  const supabase = await createClient();
  
  // Note: True deletion of users usually requires Admin Auth API, but we delete from public.users here.
  // The trigger might recreate or cascade delete.
  const { error } = await supabase.from("users").delete().eq("id", userId);
  
  if (error) {
    return { error: error.message };
  }
  
  revalidatePath("/admin/customers");
}
