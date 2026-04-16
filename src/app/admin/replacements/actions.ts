"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateReplacementStatus(id: string, status: string, trackingInfo?: { tracking_id?: string, courier_name?: string }) {
  const supabase = await createClient();

  // Update order status
  const { error } = await supabase
    .from("lens_replacement_orders")
    .update({ status: status })
    .eq("id", id);
    
  if (error) {
    console.error("Replacement Status update failed", error);
    return { error: error.message };
  }

  // Update Tracking Info if provided
  if (trackingInfo && (trackingInfo.tracking_id || trackingInfo.courier_name)) {
     // Check if tracking exists
     const { data: trackData } = await supabase.from("order_tracking").select("*").eq("order_id", id).maybeSingle();
     
     if (trackData) {
        await supabase.from("order_tracking").update({ 
           tracking_id: trackingInfo.tracking_id || trackData.tracking_id,
           courier_name: trackingInfo.courier_name || trackData.courier_name
        }).eq("order_id", id);
     } else {
        await supabase.from("order_tracking").insert({
           order_id: id,
           tracking_id: trackingInfo.tracking_id,
           courier_name: trackingInfo.courier_name,
           status: status,
           checkpoint_location: "Processing Center"
        });
     }
  }

  revalidatePath(`/admin/replacements`);
  revalidatePath(`/admin/replacements/${id}`);
  return { success: true };
}
