"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * CHECKOUT & ORDER ACTIONS
 */

export async function placeOrder(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Security identity required." };

  // 1. Get Cart Items
  const { data: cartItems, error: cartError } = await supabase
    .from("cart")
    .select("*, products(price, offer_price)")
    .eq("user_id", user.id);

  if (cartError || !cartItems || cartItems.length === 0) {
    return { error: "Nexus cart empty. Cannot finalize order." };
  }

  // 2. Extract Data
  const address_id = parseInt(formData.get("address_id") as string);
  const total_price = cartItems.reduce((acc, item) => {
    const price = item.products.offer_price || item.products.price;
    return acc + (price * item.quantity);
  }, 0);

  // 3. Create Order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      total_price,
      status: 'pending',
      payment_status: 'pending',
      address_id
    })
    .select("id")
    .single();

  if (orderError) return { error: orderError.message };

  // 4. Create Order Items
  const orderItems = cartItems.map(item => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.products.offer_price || item.products.price,
    lens_type: item.lens_type,
    power_left: item.power_left,
    power_right: item.power_right
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
  if (itemsError) return { error: itemsError.message };

  // 5. Handle Prescription Upload (if exists)
  const prescription_url = formData.get("prescription_url") as string;
  if (prescription_url) {
      await supabase.from("prescriptions").insert({
          user_id: user.id,
          order_id: order.id,
          file_url: prescription_url
      });
  }

  // 6. Record Payment Metadata (Simulated for flow)
  const payment_method = formData.get("payment_method") as string;
  await supabase.from("payments").insert({
      order_id: order.id,
      payment_method,
      amount: total_price,
      status: 'Success' // In reality, wait for Razorpay success
  });

  // 7. Clear Cart
  await supabase.from("cart").delete().eq("user_id", user.id);

  revalidatePath("/admin/orders");
  revalidatePath("/profile/orders");
  
  return { success: true, order_id: order.id };
}

/**
 * ADMIN ORDER MANAGEMENT
 */

export async function updateOrderStatus(
  order_id: string, 
  status?: string, 
  payment_status?: string,
  tracking_id?: string,
  courier_partner?: string
) {
  const supabase = await createClient();
  const updates: any = {};
  
  if (status) updates.status = status;
  if (payment_status) updates.payment_status = payment_status;
  if (tracking_id) updates.tracking_id = tracking_id;
  if (courier_partner) updates.courier_partner = courier_partner;
  
  updates.updated_at = new Date().toISOString();

  // Logic: If status is 'confirmed', reduce inventory
  if (status === 'confirmed') {
    const { data: items } = await supabase
        .from("order_items")
        .select("product_id, quantity")
        .eq("order_id", order_id);
    
    if (items) {
        for (const item of items) {
           // Decrement stock in products table
           await supabase.rpc('decrement_inventory', { 
               p_id: item.product_id, 
               p_qty: item.quantity 
           });
        }
    }
  }

  const { error } = await supabase
    .from("orders")
    .update(updates)
    .eq("id", order_id);

  if (error) return { error: error.message };

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${order_id}`);
  return { success: true };
}
