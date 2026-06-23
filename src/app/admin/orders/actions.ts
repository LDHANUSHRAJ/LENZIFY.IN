"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { updateOrderStatus } from "@/lib/db/order_actions";

export { updateOrderStatus };

export async function updatePaymentStatus(orderId: string, payment_status: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("orders")
    .update({ payment_status, updated_at: new Date().toISOString() })
    .eq("id", orderId);

  if (error) return { error: error.message };

  revalidatePath("/admin/orders");
  return { success: true };
}

export async function cancelOrder(orderId: string, reason?: string) {
  return updateOrderStatus(orderId, "cancelled", undefined, undefined, undefined);
}

export async function refundOrder(orderId: string) {
  const supabase = await createClient();
  
  // Update both status and payment
  const { error } = await supabase
    .from("orders")
    .update({ 
      status: 'refunded', 
      payment_status: 'refunded',
      updated_at: new Date().toISOString() 
    })
    .eq("id", orderId);

  if (error) return { error: error.message };

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}
