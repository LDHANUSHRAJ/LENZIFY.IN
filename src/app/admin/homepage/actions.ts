"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
