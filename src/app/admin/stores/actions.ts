"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addStore(formData: FormData) {
  const supabase = await createAdminClient();
  const name = (formData.get("name") as string)?.trim();
  const address = (formData.get("address") as string)?.trim();
  const city = (formData.get("city") as string)?.trim();
  const state = (formData.get("state") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim() || null;
  const email = (formData.get("email") as string)?.trim() || null;
  const hours = (formData.get("hours") as string)?.trim() || "Mon–Sat: 10 AM – 8 PM";
  const status = (formData.get("status") as string) || "operational";
  const lat = (formData.get("lat") as string)?.trim() || null;
  const lng = (formData.get("lng") as string)?.trim() || null;

  if (!name || !address || !city || !state) return { error: "Name, address, city, and state are required." };

  const { error } = await supabase.from("stores").insert({ name, address, city, state, phone, email, hours, status, lat, lng });
  if (error) return { error: error.message };
  revalidatePath("/admin/stores");
  revalidatePath("/stores");
  return { success: true };
}

export async function updateStoreStatus(id: string, status: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("stores").update({ status }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/stores");
  revalidatePath("/stores");
  return { success: true };
}

export async function deleteStore(id: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("stores").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/stores");
  revalidatePath("/stores");
  return { success: true };
}

export async function updateStore(id: string, formData: FormData) {
  const supabase = await createAdminClient();
  const payload: Record<string, string | null> = {};
  for (const [key, val] of formData.entries()) {
    payload[key] = (val as string)?.trim() || null;
  }
  const { error } = await supabase.from("stores").update(payload).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/stores");
  revalidatePath("/stores");
  return { success: true };
}
