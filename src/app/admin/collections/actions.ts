"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createCollection(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const banner_url = formData.get("banner_url") as string;
  const description = formData.get("description") as string;
  const type = formData.get("type") as string;

  const { data, error } = await supabase
    .from("collections")
    .insert([{ name, banner_url, description, type }])
    .select();

  if (error) {
    console.error("Error creating collection:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/collections");
  return { data };
}

export async function updateCollection(id: string, formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const banner_url = formData.get("banner_url") as string;
  const description = formData.get("description") as string;
  const type = formData.get("type") as string;

  const { data, error } = await supabase
    .from("collections")
    .update({ name, banner_url, description, type })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating collection:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/collections");
  return { data };
}

export async function deleteCollection(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("collections").delete().eq("id", id);

  if (error) {
    console.error("Error deleting collection:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/collections");
  return { success: true };
}
