"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCategory(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const image_url = formData.get("image_url") as string;
  const is_featured = formData.get("is_featured") === "true";
  const is_active = formData.get("is_active") === "true";
  const parent_id_val = formData.get("parent_id") as string;
  const parent_id = parent_id_val ? parseInt(parent_id_val) : null;
  const sort_order = parseInt(formData.get("sort_order") as string || "0");

  const { error } = await supabase.from("categories").insert({
    name,
    slug,
    image_url,
    is_featured,
    is_active,
    parent_id,
    sort_order
  });

  if (error) {
    console.error("Error creating category:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/");
  redirect("/admin/categories");
}

export async function updateCategory(id: number, formData: FormData) {
  const supabase = await createClient();

  const parent_id_val = formData.get("parent_id") as string;

  const updates = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    image_url: formData.get("image_url") as string,
    is_featured: formData.get("is_featured") === "true",
    is_active: formData.get("is_active") === "true",
    parent_id: parent_id_val ? parseInt(parent_id_val) : null,
    sort_order: parseInt(formData.get("sort_order") as string || "0")
  };

  const { error } = await supabase.from("categories").update(updates).eq("id", id);

  if (error) {
    console.error("Error updating category:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/categories");
  return { success: true };
}

export async function deleteCategory(id: number) {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    console.error("Error deleting category:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/categories");
}

export async function toggleCategoryStatus(id: number, currentStatus: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("categories")
    .update({ is_active: !currentStatus })
    .eq("id", id);
    
  if (error) {
    console.error("Error toggling category status:", error);
    return { error: error.message };
  }
  
  revalidatePath("/admin/categories");
  revalidatePath("/");
}
