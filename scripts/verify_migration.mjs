import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://lglknxmkgoixyhksfbjy.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnbGtueG1rZ29peHloa3NmYmp5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDc5MzM2MCwiZXhwIjoyMDkwMzY5MzYwfQ.R1PGfbzeSBt0bLv9gYHmP_NO28-7Omem12EE89_0uxA",
  { auth: { persistSession: false } }
);

async function check(label, fn) {
  try {
    const result = await fn();
    console.log(`✅  ${label}:`, result);
  } catch (e) {
    console.log(`❌  ${label}: ${e.message}`);
  }
}

console.log("\nLENZIFY — Migration verification\n");

// 1. order_status_history exists and is queryable
await check("order_status_history (table exists)", async () => {
  const { data, error } = await supabase.from("order_status_history").select("*").limit(1);
  if (error) throw new Error(error.message);
  return `reachable, ${data.length} rows`;
});

// 2. New orders columns exist
await check("orders.estimated_delivery_date", async () => {
  const { data, error } = await supabase.from("orders").select("estimated_delivery_date").limit(1);
  if (error) throw new Error(error.message);
  return `column present`;
});

await check("orders.cancel_reason", async () => {
  const { data, error } = await supabase.from("orders").select("cancel_reason").limit(1);
  if (error) throw new Error(error.message);
  return `column present`;
});

await check("orders.payment_id", async () => {
  const { data, error } = await supabase.from("orders").select("payment_id").limit(1);
  if (error) throw new Error(error.message);
  return `column present`;
});

// 3. products.availability exists
await check("products.availability", async () => {
  const { data, error } = await supabase.from("products").select("availability").limit(1);
  if (error) throw new Error(error.message);
  return `column present, first value: ${data[0]?.availability}`;
});

// 4. Corrected order status
await check("order 58ebcffd status", async () => {
  const { data, error } = await supabase
    .from("orders")
    .select("status, payment_status")
    .eq("id", "58ebcffd-ae74-4058-871f-66c000ed7da6")
    .single();
  if (error) throw new Error(error.message);
  return `status=${data.status}, payment_status=${data.payment_status}`;
});

console.log("\nDone.\n");
