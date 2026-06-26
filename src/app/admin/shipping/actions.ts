"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addShippingPartner(formData: FormData) {
  const supabase = await createAdminClient();
  const name = (formData.get("name") as string)?.trim();
  const coverage = (formData.get("coverage") as string)?.trim();
  const speed = (formData.get("speed") as string)?.trim();

  if (!name || !coverage || !speed) return { error: "All fields are required." };

  const partner_id = name.slice(0, 3).toUpperCase() + "-" + Date.now().toString().slice(-2);

  const { error } = await supabase.from("shipping_partners").insert({ name, partner_id, coverage, speed });
  if (error) return { error: error.message };
  revalidatePath("/admin/shipping");
  return { success: true };
}

export async function updatePartnerStatus(id: string, status: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("shipping_partners").update({ status }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/shipping");
  return { success: true };
}

export async function deleteShippingPartner(id: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("shipping_partners").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/shipping");
  return { success: true };
}

export async function addShippingZone(formData: FormData) {
  const supabase = await createAdminClient();
  const city = (formData.get("city") as string)?.trim();
  const state = (formData.get("state") as string)?.trim();
  const charge = parseFloat(formData.get("charge") as string) || 0;

  if (!city || !state) return { error: "City and state are required." };

  const { error } = await supabase.from("shipping_zones").insert({ city, state, charge });
  if (error) return { error: error.message };
  revalidatePath("/admin/shipping");
  return { success: true };
}

export async function toggleZoneStatus(id: string, is_active: boolean) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("shipping_zones").update({ is_active }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/shipping");
  return { success: true };
}

export async function deleteShippingZone(id: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("shipping_zones").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/shipping");
  return { success: true };
}
