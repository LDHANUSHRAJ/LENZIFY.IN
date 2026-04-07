"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * 🛠️ ORDER PROTOCOL ORCHESTRATION
 * Handles status transitions, stock calibration, and notification logs.
 */
export async function updateOrderStatus(
  orderId: string, 
  status: string, 
  paymentStatus?: string, 
  trackingId?: string, 
  courier?: string
) {
  const supabase = await createClient();

  // 1. Get current order state for comparison
  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderId)
    .single();

  if (!order) return { error: "Protocol not found" };

  const oldStatus = order.status;

  // 2. Perform Stock Calibration
  // Strategy: Reduce stock on CONFIRMED, Restore on CANCELLED (if previously confirmed)
  if (status === "confirmed" && oldStatus === "pending") {
    for (const item of order.order_items) {
      await supabase.rpc("decrement_stock", { 
        product_id: item.product_id, 
        quantity: item.quantity 
      });
    }
  } else if (status === "cancelled" && ["confirmed", "shipped"].includes(oldStatus)) {
    for (const item of order.order_items) {
      await supabase.rpc("increment_stock", { 
        product_id: item.product_id, 
        quantity: item.quantity 
      });
    }
  }

  // 3. Update Order Matrix
  const updateData: any = { 
    status, 
    updated_at: new Date().toISOString() 
  };
  if (paymentStatus) updateData.payment_status = paymentStatus;
  if (trackingId) updateData.tracking_id = trackingId;
  if (courier) updateData.courier_partner = courier;

  const { error } = await supabase
    .from("orders")
    .update(updateData)
    .eq("id", orderId);

  if (error) {
    console.error("Error updating order status:", error);
    return { error: error.message };
  }

  // 4. Log Notification
  await supabase.from("notifications").insert({
    user_id: order.user_id,
    title: `Order Status: ${status.toUpperCase()}`,
    message: `Your order #${orderId.slice(0, 8)} has been transitioned to ${status}.`,
    type: "order_update",
    metadata: { order_id: orderId, status }
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}

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
