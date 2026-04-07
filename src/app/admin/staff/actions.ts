"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createStaffMember(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as string;
  
  // Note: For fully functional admin creation with passwords, this should use Supabase Auth admin API.
  // We're inserting directly into the public.admins table for operational tracking in this matrix.
  const { error } = await supabase.from("admins").insert({
    id: crypto.randomUUID(), // Mock ID if not using Auth
    name,
    email,
    role
  });

  if (error) {
    console.error("Error creating staff:", error);
    return { error: error.message };
  }
  
  revalidatePath("/admin/staff");
}

export async function deleteStaffMember(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("admins").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/staff");
}
