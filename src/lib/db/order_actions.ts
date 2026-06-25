"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { sendEmail, getOrderConfirmationHtml } from "@/lib/mail";

/**
 * CHECKOUT & ORDER ACTIONS
 */

export async function placeOrder(data: {
  items: any[];
  total_price: number;
  address: any;
  prescription?: any;
  payment: { id: string; method: string };
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Security identity required." };

  // Use Admin Client for database mutations to bypass RLS issues during checkout
  const adminSupabase = await createAdminClient();

  // 1. Insert/Get Address ID
  const { data: address, error: addrError } = await adminSupabase
    .from("addresses")
    .insert({
      user_id: user.id,
      name: data.address.name,
      phone: data.address.phone,
      address: data.address.address,
      city: data.address.city,
      state: data.address.state || "Not Specified",
      pincode: data.address.pincode
    })
    .select("id")
    .single();

  if (addrError) return { error: "Address synchronization failure: " + addrError.message };

  // 2. Create Order
  const { data: order, error: orderError } = await adminSupabase
    .from("orders")
    .insert({
      user_id: user.id,
      total_price: data.total_price,
      status: 'confirmed',
      payment_status: data.payment.method === 'cod' ? 'pending' : 'paid',
      payment_method: data.payment.method,
      address_id: address.id
    })
    .select("id")
    .single();

  if (orderError) return { error: "Order initialization failure: " + orderError.message };

  // 3. Create Order Items
  const orderItems = data.items.map(item => ({
    order_id: order.id,
    product_id: item.id,
    quantity: item.quantity,
    price: item.price,
    lens_id: item.lens_id,
    prescription_json: item.prescription_json
  }));

  const { error: itemsError } = await adminSupabase.from("order_items").insert(orderItems);
  if (itemsError) return { error: "Item batch insert failure: " + itemsError.message };

  // 3b. Decrement stock at order creation using safe atomic function.
  // decrement_inventory_safe returns false if stock < qty (prevents oversell).
  // Requires launch_migrations.sql to be applied to the DB.
  for (const item of data.items) {
    const { data: decremented, error: stockErr } = await adminSupabase.rpc(
      "decrement_inventory_safe",
      { p_id: item.id, p_qty: item.quantity }
    );
    if (stockErr || decremented === false) {
      // Roll back: delete the order we just created
      await adminSupabase.from("order_items").delete().eq("order_id", order.id);
      await adminSupabase.from("orders").delete().eq("id", order.id);
      return { error: "One or more items in your cart are out of stock. Please refresh your cart." };
    }
  }

  // 4. Handle Prescription
  if (data.prescription) {
      const { error: prescError } = await adminSupabase.from("prescriptions").insert({
          user_id: user.id,
          order_id: order.id,
          left_eye: data.prescription.left_eye,
          right_eye: data.prescription.right_eye,
          pd: parseFloat(data.prescription.pd) || 0,
          file_url: data.prescription.file_url
      });
      if (prescError) {
          console.error("Prescription Error:", prescError);
      }
  }
  
  // 5. Record Payment
  const { error: payError } = await adminSupabase.from("payments").insert({
      order_id: order.id,
      payment_method: data.payment.method,
      transaction_id: data.payment.id,
      amount: data.total_price,
      status: data.payment.method === 'cod' ? 'pending' : 'Success',
  });

  if (payError) {
      console.error("Payment Record Error:", payError);
      return { error: "Order placed but payment record failed: " + payError.message, order_id: order.id };
  }

  // 6. Clear Cart
  const { error: clearError } = await adminSupabase.from("cart").delete().eq("user_id", user.id);
  if (clearError) console.error("Cart Clear Error:", clearError);

  // 7. Send confirmation email for COD orders (Razorpay orders are emailed via webhook)
  if (data.payment.method === 'cod') {
    try {
      const { data: fullOrder } = await adminSupabase
        .from("orders")
        .select("*, order_items(*, products(name))")
        .eq("id", order.id)
        .single();

      const { data: userData } = await adminSupabase.auth.admin.getUserById(user.id);
      const customerEmail = userData?.user?.email;
      const customerName = data.address.name || "Customer";

      if (customerEmail && fullOrder) {
        await sendEmail({
          to: customerEmail,
          subject: `Order Confirmed - Lenzify #${order.id.slice(0, 8)}`,
          html: getOrderConfirmationHtml(fullOrder, customerName),
        });
        await sendEmail({
          to: process.env.SMTP_USER || "lenzify.in@gmail.com",
          subject: `New COD Order - #${order.id.slice(0, 8)}`,
          html: `<h3>New COD Order</h3><p>Order ID: ${order.id}</p><p>Customer: ${customerName} (${customerEmail})</p><p>Total: ₹${data.total_price}</p>`,
        });
      }
    } catch (mailErr) {
      console.error("[ORDER] COD confirmation email failed:", mailErr);
    }
  }

  revalidatePath("/admin/orders");
  revalidatePath("/profile/orders");

  return { success: true, order_id: order.id };
}

/**
 * ADMIN ORDER MANAGEMENT
 */

export async function updateOrderStatus(
  orderId: string,
  status: string,
  paymentStatus?: string,
  trackingId?: string,
  courier?: string,
  estimatedDeliveryDate?: string,
  note?: string
) {
  const supabase = await createClient();
  const { createAdminClient } = await import("@/lib/supabase/server");
  const adminSupabase = await createAdminClient();

  const { data: order } = await adminSupabase
    .from("orders")
    .select("*, order_items(*), users(email, name)")
    .eq("id", orderId)
    .single();

  if (!order) return { error: "Order not found" };

  const oldStatus = order.status;

  // Restore stock when cancelled from an active state
  if (status === "cancelled" && ["pending", "confirmed", "frame_reserved", "frame_preparing"].includes(oldStatus)) {
    for (const item of order.order_items) {
      await adminSupabase.rpc("increment_stock", {
        product_id: item.product_id,
        quantity: item.quantity,
      });
    }
  }

  const updateData: any = { status, updated_at: new Date().toISOString() };
  if (paymentStatus) updateData.payment_status = paymentStatus;
  if (trackingId !== undefined) updateData.tracking_id = trackingId;
  if (courier !== undefined) updateData.courier_partner = courier;
  if (estimatedDeliveryDate) updateData.estimated_delivery_date = estimatedDeliveryDate;

  const { error } = await adminSupabase.from("orders").update(updateData).eq("id", orderId);
  if (error) return { error: error.message };

  // Record in status history
  try {
    await adminSupabase.from("order_status_history").insert({
      order_id: orderId,
      status,
      note: note || null,
      updated_by: "admin",
    });
  } catch {}

  // In-app notification
  try {
    await adminSupabase.from("notifications").insert({
      user_id: order.user_id,
      title: `Order Update`,
      message: `Your order #${orderId.slice(0, 8).toUpperCase()} is now: ${status.replace(/_/g, " ")}.`,
      type: "order_update",
      metadata: { order_id: orderId, status },
    });
  } catch {}

  // Email notification (fire-and-forget)
  try {
    const customerEmail = (order.users as any)?.email;
    const customerName = (order.users as any)?.name || "Customer";
    if (customerEmail) {
      const { sendEmail, getOrderStatusUpdateHtml } = await import("@/lib/mail");
      const statusLabel = status.replace(/_/g, " ");
      await sendEmail({
        to: customerEmail,
        subject: `Order #${orderId.slice(0, 8).toUpperCase()} — ${statusLabel.charAt(0).toUpperCase() + statusLabel.slice(1)}`,
        html: getOrderStatusUpdateHtml(orderId, status, customerName, estimatedDeliveryDate, trackingId, courier, note),
      });
    }
  } catch (mailErr) {
    console.error("[ORDER] Status email failed:", mailErr);
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath(`/orders/${orderId}`);
  return { success: true };
}

/** Customer: cancel an order (only pending/confirmed) */
export async function cancelOrder(orderId: string, reason?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();

  if (!order) return { error: "Order not found" };
  if (!["pending", "confirmed"].includes(order.status)) {
    return { error: "This order can no longer be cancelled. Please contact support." };
  }

  // Restore stock
  for (const item of order.order_items) {
    try {
      await supabase.rpc("increment_stock", {
        product_id: item.product_id,
        quantity: item.quantity,
      });
    } catch {}
  }

  const { error } = await supabase.from("orders").update({
    status: "cancelled",
    cancelled_at: new Date().toISOString(),
    cancel_reason: reason || "Cancelled by customer",
    updated_at: new Date().toISOString(),
  }).eq("id", orderId);

  if (error) return { error: error.message };

  try {
    await supabase.from("order_status_history").insert({
      order_id: orderId,
      status: "cancelled",
      note: reason || "Cancelled by customer",
      updated_by: "customer",
    });
  } catch {}

  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/orders");
  return { success: true };
}

/** Customer: request return (only if delivered) */
export async function requestReturn(orderId: string, reason: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: order } = await supabase
    .from("orders")
    .select("id, status, user_id")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();

  if (!order) return { error: "Order not found" };
  if (order.status !== "delivered") return { error: "Only delivered orders can be returned." };

  const { error } = await supabase.from("orders").update({
    return_requested_at: new Date().toISOString(),
    return_reason: reason,
    updated_at: new Date().toISOString(),
  }).eq("id", orderId);

  if (error) return { error: error.message };

  try {
    await supabase.from("notifications").insert({
      user_id: user.id,
      title: "Return Requested",
      message: `Return request submitted for order #${orderId.slice(0, 8).toUpperCase()}.`,
      type: "return_request",
      metadata: { order_id: orderId },
    });
  } catch {}

  revalidatePath(`/orders/${orderId}`);
  return { success: true };
}
