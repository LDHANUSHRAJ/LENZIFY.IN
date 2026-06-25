"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function moveSectionUp(id: number, currentSortOrder: number) {
  const supabase = await createClient();
  const { data: prev } = await supabase
    .from("homepage_config")
    .select("id, sort_order")
    .lt("sort_order", currentSortOrder)
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();

  if (!prev) return;

  await supabase.from("homepage_config").update({ sort_order: prev.sort_order }).eq("id", id);
  await supabase.from("homepage_config").update({ sort_order: currentSortOrder }).eq("id", prev.id);

  revalidatePath("/admin/homepage");
  revalidatePath("/");
}

export async function moveSectionDown(id: number, currentSortOrder: number) {
  const supabase = await createClient();
  const { data: next } = await supabase
    .from("homepage_config")
    .select("id, sort_order")
    .gt("sort_order", currentSortOrder)
    .order("sort_order", { ascending: true })
    .limit(1)
    .single();

  if (!next) return;

  await supabase.from("homepage_config").update({ sort_order: next.sort_order }).eq("id", id);
  await supabase.from("homepage_config").update({ sort_order: currentSortOrder }).eq("id", next.id);

  revalidatePath("/admin/homepage");
  revalidatePath("/");
}

export async function updateHomepageSection(sectionKey: string, content: any, isActive: boolean = true) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("homepage_config")
    .upsert({ 
      section_key: sectionKey, 
      content, 
      is_active: isActive,
      updated_at: new Date().toISOString() 
    }, { onConflict: "section_key" });

  if (error) {
    console.error("Error updating homepage section:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/homepage");
  revalidatePath("/");
  return { success: true };
}

export async function toggleSectionStatus(id: number, isActive: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from("homepage_config").update({ is_active: !isActive }).eq("id", id);

  if (error) {
    console.error("Error toggling section status:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/homepage");
  revalidatePath("/");
}

export async function deleteSection(id: number) {
  const supabase = await createClient();
  const { error } = await supabase.from("homepage_config").delete().eq("id", id);

  if (error) {
    console.error("Error deleting section:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/homepage");
  revalidatePath("/");
}

export async function createBanner(formData: FormData) {
  // Legacy support for banners, re-routing to homepage_config as a 'hero' section
  const title = formData.get("title") as string;
  const subtitle = formData.get("subtitle") as string;
  const image_url = formData.get("image_url") as string;
  const button_text = formData.get("button_text") as string;
  const button_link = formData.get("button_link") as string;

  return await updateHomepageSection("hero", {
    title,
    subtitle,
    image_url,
    button_text,
    button_link
  });
}
