"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateStock(productId: string, newStock: number) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").update({ stock: newStock }).eq("id", productId);
  
  if (error) return { error: error.message };
  
  // Note: Inventory history is logged via trigger on DB or can be inserted here manually if public.inventory is designed as an audit log.
  // Looking at the schema, public.inventory has product_id, stock. Actually, products table HAS stock. public.inventory might be redundant or act as log.
  
  revalidatePath("/admin/inventory");
  revalidatePath("/admin/products");
}
