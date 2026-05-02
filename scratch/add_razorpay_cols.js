const { createClient } = require('@supabase/supabase-js');

const s = createClient(
  'https://lglknxmkgoixyhksfbjy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnbGtueG1rZ29peHloa3NmYmp5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDc5MzM2MCwiZXhwIjoyMDkwMzY5MzYwfQ.R1PGfbzeSBt0bLv9gYHmP_NO28-7Omem12EE89_0uxA'
);

async function run() {
  const { data, error } = await s.rpc('exec_sql', {
    query: "ALTER TABLE lens_replacement_orders ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT; ALTER TABLE lens_replacement_orders ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT;"
  });
  
  if (error) {
    console.log("RPC not available, trying direct SQL via REST...");
    // Try adding columns via a dummy insert test
    const { error: testErr } = await s.from('lens_replacement_orders').select('razorpay_order_id').limit(1);
    console.log("Column check:", testErr ? testErr.message : "Column already exists");
  } else {
    console.log("Success:", data);
  }
}

run();
