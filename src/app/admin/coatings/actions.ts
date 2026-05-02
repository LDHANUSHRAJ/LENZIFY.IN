"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCoating(formData: FormData) {
  const supabase = await createAdminClient();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const is_active = formData.get("is_active") === "true";

  const { error } = await supabase.from("lens_coatings").insert({
    name,
    description,
    price,
    is_active
  });

  if (error) {
    console.error("Error creating coating:", error);
    redirect(`/admin/coatings/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/coatings");
  revalidatePath("/replace-lenses");
  redirect("/admin/coatings");
}

export async function updateCoating(id: string, formData: FormData) {
  const supabase = await createAdminClient();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const is_active = formData.get("is_active") === "true";

  const { error } = await supabase.from("lens_coatings").update({
    name,
    description,
    price,
    is_active
  }).eq("id", id);

  if (error) {
    console.error("Error updating coating:", error);
    redirect(`/admin/coatings/${id}/edit?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/coatings");
  revalidatePath("/replace-lenses");
  redirect("/admin/coatings");
}

export async function deleteCoating(id: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("lens_coatings").delete().eq("id", id);

  if (error) {
    console.error("Error deleting coating:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/coatings");
}

export async function toggleCoatingStatus(id: string, currentStatus: boolean) {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from("lens_coatings")
    .update({ is_active: !currentStatus })
    .eq("id", id);
    
  if (error) {
    console.error("Error toggling coating status:", error);
    return { error: error.message };
  }
  
  revalidatePath("/admin/coatings");
}
