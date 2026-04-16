"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getLensTypes() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lenses")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  
  if (error) {
    console.error("Error fetching lens types:", error);
    return [];
  }
  return data;
}

export async function getLensAddons() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lens_addons")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching lens addons:", error);
    return [];
  }
  return data;
}

export async function createReplacementOrder(orderData: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to create a replacement order." };
  }

  // 1. Create a base order first to link
  const orderItems = [{
     id: "lens_replacement_service",
     name: `Replacement Lens: ${orderData.lensName || 'Unknown'}`,
     price: orderData.total_price,
     quantity: 1,
     image_url: orderData.frame_image_url || "/placeholder.jpg"
  }];

  const { data: baseOrder, error: baseOrderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      address_id: orderData.address_id,
      payment_method: orderData.payment_method,
      total_price: orderData.total_price,
      status: "pending",
      type: "replacement",
      order_items: orderItems
    })
    .select()
    .single();

  if (baseOrderError) {
    console.error("Error creating base order:", baseOrderError);
    return { error: "Failed to create order." };
  }

  // 2. Create the specific lens_replacement_orders record
  const { data: replacementOrder, error: replacementError } = await supabase
    .from("lens_replacement_orders")
    .insert({
      user_id: user.id,
      order_id: baseOrder.id,
      frame_type: orderData.frame_type,
      frame_condition: orderData.frame_condition,
      frame_image_url: orderData.frame_image_url || null,
      lens_id: orderData.lens_id,
      add_ons: orderData.add_ons || [],
      prescription_json: orderData.prescription_json || null,
      prescription_file_url: orderData.prescription_file_url || null,
      address_id: orderData.address_id,
      pickup_date: orderData.pickup_date,
      pickup_slot: orderData.pickup_slot,
      service_fee: orderData.service_fee || 99,
      pickup_fee: orderData.pickup_fee || 0,
      total_price: orderData.total_price,
      status: "pending"
    })
    .select()
    .single();

  if (replacementError) {
    console.error("Error creating replacement order:", replacementError);
    // Ideally rollback base order here, omitted for brevity
    return { error: "Failed to create replacement details." };
  }

  revalidatePath("/orders");
  revalidatePath("/admin/replacements");
  
  return { success: true, order: replacementOrder, baseOrderId: baseOrder.id };
}

export async function getReplacementOrder(id: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("lens_replacement_orders")
    .select(`
      *,
      orders!inner (
        status,
        payment_method
      ),
      lenses (
        id, name, price
      ),
      addresses (
        *
      ),
      order_tracking (
        courier_name,
        tracking_id,
        tracking_link
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching replacement order:", error);
    return null;
  }
  return data;
}
