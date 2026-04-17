"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createBrand(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const logo_url = formData.get("logo_url") as string;
  const description = formData.get("description") as string;
  const is_featured = formData.get("is_featured") === "on";

  const { data, error } = await supabase
    .from("brands")
    .insert([{ name, logo_url, description, is_featured }])
    .select();

  if (error) {
    console.error("Error creating brand:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/brands");
  return { data };
}

export async function updateBrand(id: string, formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const logo_url = formData.get("logo_url") as string;
  const description = formData.get("description") as string;
  const is_featured = formData.get("is_featured") === "on";

  const { data, error } = await supabase
    .from("brands")
    .update({ name, logo_url, description, is_featured })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating brand:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/brands");
  return { data };
}

export async function deleteBrand(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("brands").delete().eq("id", id);

  if (error) {
    console.error("Error deleting brand:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/brands");
  return { success: true };
}
