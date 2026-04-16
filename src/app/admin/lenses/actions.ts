"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createLens(formData: FormData) {
  const supabase = await createAdminClient();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const category = formData.get("category") as string || "type";
  const sub_category = formData.get("sub_category") as string || null;
  const is_active = formData.get("is_active") === "true";
  
  // Extract features (it comes as a string array or comma separated, let's assume JSON array from hidden input or textarea)
  const featuresRaw = formData.get("features") as string;
  let features = [];
  try {
    features = JSON.parse(featuresRaw || "[]");
  } catch (e) {
    features = featuresRaw.split(",").map(f => f.trim()).filter(Boolean);
  }

  const { error } = await supabase.from("lenses").insert({
    name,
    description,
    price,
    features,
    category,
    sub_category,
    is_active
  });

  if (error) {
    console.error("Error creating lens:", error);
    redirect(`/admin/lenses/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/lenses");
  redirect("/admin/lenses");
}

export async function updateLens(id: string, formData: FormData) {
  const supabase = await createAdminClient();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const category = formData.get("category") as string || "type";
  const sub_category = formData.get("sub_category") as string || null;
  const is_active = formData.get("is_active") === "true";

  const featuresRaw = formData.get("features") as string;
  let features = [];
  try {
    features = JSON.parse(featuresRaw || "[]");
  } catch (e) {
    features = featuresRaw.split(",").map(f => f.trim()).filter(Boolean);
  }

  const { error } = await supabase.from("lenses").update({
    name,
    description,
    price,
    features,
    category,
    sub_category,
    is_active
  }).eq("id", id);

  if (error) {
    console.error("Error updating lens:", error);
    redirect(`/admin/lenses/${id}/edit?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/lenses");
  redirect("/admin/lenses");
}

export async function deleteLens(id: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("lenses").delete().eq("id", id);

  if (error) {
    console.error("Error deleting lens:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/lenses");
}

export async function toggleLensStatus(id: string, currentStatus: boolean) {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from("lenses")
    .update({ is_active: !currentStatus })
    .eq("id", id);
    
  if (error) {
    console.error("Error toggling lens status:", error);
    return { error: error.message };
  }
  
  revalidatePath("/admin/lenses");
}
