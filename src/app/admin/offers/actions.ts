"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCoupon(formData: FormData) {
  const supabase = await createClient();

  const code = formData.get("code") as string;
  const discount_value = parseFloat(formData.get("discount_value") as string);
  const discount_type = formData.get("discount_type") as string;
  const min_order_value = parseFloat(formData.get("min_order_value") as string);
  const expiry_date = formData.get("expiry_date") as string;
  const usage_limit = parseInt(formData.get("usage_limit") as string);
  const is_active = formData.get("is_active") === "true";

  const { error } = await supabase.from("coupons").insert({
    code,
    discount_value,
    discount_type,
    min_order_value,
    expiry_date: expiry_date || null,
    usage_limit: usage_limit || null,
    is_active
  });

  if (error) {
    console.error("Error creating coupon:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/offers");
  redirect("/admin/offers");
}

export async function toggleCouponStatus(id: number, isActive: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from("coupons").update({ is_active: !isActive }).eq("id", id);

  if (error) {
    console.error("Error toggling coupon status:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/offers");
}

export async function deleteCoupon(id: number) {
  const supabase = await createClient();
  const { error } = await supabase.from("coupons").delete().eq("id", id);

  if (error) {
    console.error("Error deleting coupon:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/offers");
}
