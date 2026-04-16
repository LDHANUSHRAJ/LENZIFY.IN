"use server";

import { createClient } from "@/lib/supabase/server";

export async function fetchReportData() {
  const supabase = await createClient();

  // Fetch all massive core datasets required for cross-dimensional reporting
  const [
    ordersRes,
    replacementOrdersRes,
    productsRes,
    usersRes
  ] = await Promise.all([
    supabase
      .from("orders")
      .select("*, order_items(*, products(name, category, brand, cost_price, price)), users(name, email, created_at)")
      .order("created_at", { ascending: false }),
      
    supabase
      .from("lens_replacement_orders")
      .select("*, users(name, email)")
      .order("created_at", { ascending: false }),
      
    supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false }),
      
    supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false })
  ]);

  return {
    orders: ordersRes.data || [],
    replacements: replacementOrdersRes.data || [],
    products: productsRes.data || [],
    customers: usersRes.data || [],
  };
}
