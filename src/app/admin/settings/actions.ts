"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateStoreSettings(data: any) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("store_settings")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", 1);

  if (error) {
    console.error("Error updating store settings:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/settings");
  revalidatePath("/");
  return { success: true };
}

export async function updateShippingRules(data: any) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("store_settings")
    .update({ 
        base_shipping_charge: data.base_shipping_charge,
        free_shipping_threshold: data.free_shipping_threshold,
        updated_at: new Date().toISOString() 
    })
    .eq("id", 1);

  if (error) {
    console.error("Error updating shipping rules:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/shipping");
  revalidatePath("/admin/settings");
  return { success: true };
}
