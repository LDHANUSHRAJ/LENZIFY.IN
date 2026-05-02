"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getLenses() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lenses")
    .select("*")
    .eq("is_active", true)
    .eq("category", "type")
    .order("price", { ascending: true });
  
  if (error) {
    console.error("Error fetching lenses:", error);
    return [];
  }
  return data;
}

export async function getCoatings() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lenses")
    .select("*")
    .eq("is_active", true)
    .eq("category", "feature")
    .order("price", { ascending: true });

  if (error) {
    console.error("Error fetching coatings:", error);
    return [];
  }
  return data;
}

export async function createReplacementOrder(orderData: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Session expired. Please re-authenticate." };
  }

  // Create the replacement order record
  const { data, error } = await supabase
    .from("lens_replacement_orders")
    .insert({
      user_id: user.id,
      frame_type: orderData.frame_type,
      frame_condition: orderData.frame_condition,
      frame_images: orderData.frame_images,
      lens_id: orderData.lens_id,
      coating_ids: orderData.coating_ids,
      prescription_type: orderData.prescription_type,
      prescription_data: orderData.prescription_data,
      prescription_url: orderData.prescription_url,
      pickup_address: orderData.pickup_address,
      delivery_address: orderData.is_delivery_different ? orderData.delivery_address : orderData.pickup_address,
      is_delivery_different: orderData.is_delivery_different,
      pickup_date: orderData.pickup_date,
      pickup_time_slot: orderData.pickup_time_slot,
      delivery_date: orderData.delivery_date,
      lens_price: orderData.lens_price,
      coatings_price: orderData.coatings_price,
      pickup_fee: orderData.pickup_fee,
      delivery_fee: orderData.delivery_fee,
      total_price: orderData.total_price,
      payment_method: orderData.payment_method,
      razorpay_payment_id: orderData.razorpay_payment_id,
      razorpay_order_id: orderData.razorpay_order_id,
      payment_status: orderData.payment_method === 'online' ? 'paid' : 'pending',
      status: "Order Placed"
    })
    .select()
    .single();

  if (error) {
    console.error("CRITICAL: Replacement order transmission failed.", error);
    return { error: `Transmission failed: ${error.message}. Please verify network.` };
  }

  revalidatePath("/profile/orders");
  return { success: true, order: data };
}

export async function getReplacementOrders() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lens_replacement_orders")
    .select(`
      *,
      lenses (name)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
  return data;
}

export async function updateReplacementOrderStatus(
    orderId: string, 
    status: string, 
    notes?: string,
    deliveryPerson?: string
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("lens_replacement_orders")
    .update({ 
        status, 
        admin_notes: notes,
        delivery_person: deliveryPerson,
        updated_at: new Date().toISOString()
    })
    .eq("id", orderId);

  if (error) {
    console.error("Error updating order:", error);
    return { error: error.message };
  }
  
  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/admin/replacements");
  return { success: true };
}
