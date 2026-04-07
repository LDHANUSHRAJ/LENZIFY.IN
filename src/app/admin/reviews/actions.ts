"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateReviewStatus(id: number, newStatus: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("reviews").update({ status: newStatus }).eq("id", id);
  
  if (error) return { error: error.message };
  revalidatePath("/admin/reviews");
}

export async function deleteReview(id: number) {
  const supabase = await createClient();
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  
  if (error) return { error: error.message };
  revalidatePath("/admin/reviews");
}
