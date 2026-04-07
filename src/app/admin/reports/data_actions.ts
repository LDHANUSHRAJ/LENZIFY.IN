"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * 📊 FINANCIAL SUMMARY PROTOCOL
 * Aggregates revenue, order volume, and customer acquisition metrics.
 */
export async function getFinancialSummary() {
  const supabase = await createClient();

  // 1. Total Revenue (Paid Orders)
  const { data: revenueData } = await supabase
    .from("orders")
    .select("total_price")
    .eq("payment_status", "paid");

  const totalRevenue = revenueData?.reduce((acc, curr) => acc + Number(curr.total_price), 0) || 0;

  // 2. Order Volume (Paid)
  const orderVolume = revenueData?.length || 0;

  // 3. Customer Acquisition
  const { count: customerCount } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("role", "customer");

  // 4. Conversion Analysis (Mocking visitor count for ratio calculation)
  const estimatedVisitors = 12500; 
  const conversionRate = orderVolume > 0 ? (orderVolume / estimatedVisitors) * 100 : 0;

  return {
    totalRevenue,
    orderVolume,
    customerCount: customerCount || 0,
    conversionRate: conversionRate.toFixed(2)
  };
}

/**
 * 📈 REVENUE STREAM MATRIX
 * Generates the 7-day transaction telemetry for area chart visualization.
 */
export async function getRevenueStream() {
  const supabase = await createClient();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const matrix = [];

  // Fetch last 7 days of paid orders
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data: orders } = await supabase
    .from("orders")
    .select("total_price, created_at")
    .eq("payment_status", "paid")
    .gte("created_at", sevenDaysAgo.toISOString());

  // Group by day of week
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayName = days[d.getDay()];
    
    const dayTotal = orders
      ?.filter(o => new Date(o.created_at).toDateString() === d.toDateString())
      .reduce((acc, curr) => acc + Number(curr.total_price), 0) || 0;

    matrix.push({ name: dayName, value: dayTotal });
  }

  return matrix;
}

/**
 * 🍕 SECTOR DISTRIBUTION ANALYSIS
 * Calculates sales percentage across product categories.
 */
export async function getSectorDistribution() {
  const supabase = await createClient();

  const { data: items } = await supabase
    .from("order_items")
    .select(`
      quantity,
      products(category_id, categories(name))
    `);

  const distribution: Record<string, number> = {};
  let totalItems = 0;

  items?.forEach((item: any) => {
    const catName = item.products?.categories?.name || "Uncategorized";
    distribution[catName] = (distribution[catName] || 0) + item.quantity;
    totalItems += item.quantity;
  });

  return Object.entries(distribution).map(([name, value]) => ({
    name,
    value: totalItems > 0 ? Math.round((value / totalItems) * 100) : 0
  }));
}

/**
 * 📥 EXPORT PROTOCOL (CSV)
 * Generates a transaction matrix for offline audit.
 */
export async function exportTransactionMatrix() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("id, created_at, total_price, payment_status, status, users(name, email)")
    .order("created_at", { ascending: false });

  if (!orders) return "";

  const headers = ["Protocol ID", "Timestamp", "Client", "Email", "Value", "Payment", "State"];
  const rows = orders.map(o => [
    o.id.slice(0, 8),
    new Date(o.created_at).toLocaleString(),
    (o.users as any)?.name || "N/A",
    (o.users as any)?.email || "N/A",
    `₹${o.total_price}`,
    o.payment_status,
    o.status
  ]);

  const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
  return csvContent;
}
