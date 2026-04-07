"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createCoupon(formData: FormData) {
  const supabase = await createClient();
  const code = formData.get("code") as string;
  const discount_type = formData.get("discount_type") as string;
  const discount_value = parseFloat(formData.get("discount_value") as string);
  const min_order = parseFloat(formData.get("min_order") as string || "0");
  const usage_limit = parseInt(formData.get("usage_limit") as string || "999");
  const expiry = formData.get("expiry") as string;

  const { error } = await supabase.from("coupons").insert({
    code: code.toUpperCase(),
    discount_type,
    discount_value,
    min_order,
    usage_limit,
    expiry: expiry || null
  });

  if (error) {
    console.error("Error creating coupon:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/coupons");
}

export async function deleteCoupon(id: number) {
  const supabase = await createClient();
  const { error } = await supabase.from("coupons").delete().eq("id", id);
  
  if (error) return { error: error.message };
  revalidatePath("/admin/coupons");
}
