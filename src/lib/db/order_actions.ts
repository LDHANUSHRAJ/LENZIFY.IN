"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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

  // 1. Insert/Get Address ID
  const { data: address, error: addrError } = await supabase
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
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      total_price: data.total_price,
      status: 'pending',
      payment_status: 'paid', // Assuming Razorpay success if this is called
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
    lens_type: item.lens_type,
    power_left: item.power_left,
    power_right: item.power_right
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
  if (itemsError) return { error: "Item batch insert failure: " + itemsError.message };

  // 4. Handle Prescription
  if (data.prescription) {
      await supabase.from("prescriptions").insert({
          user_id: user.id,
          order_id: order.id,
          left_eye: data.prescription.left_eye,
          right_eye: data.prescription.right_eye,
          pd: parseFloat(data.prescription.pd) || 0,
          file_url: data.prescription.file_url
      });
  }

  // 5. Record Payment
  await supabase.from("payments").insert({
      order_id: order.id,
      payment_method: data.payment.method,
      transaction_id: data.payment.id,
      amount: data.total_price,
      status: 'Success'
  });

  // 6. Clear Cart
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
