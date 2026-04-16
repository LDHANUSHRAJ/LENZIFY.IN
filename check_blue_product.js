const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://lglknxmkgoixyhksfbjy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnbGtueG1rZ29peHloa3NmYmp5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDc5MzM2MCwiZXhwIjoyMDkwMzY5MzYwfQ.R1PGfbzeSBt0bLv9gYHmP_NO28-7Omem12EE89_0uxA'
);

async function checkSpecificProduct() {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('id', '6ce75380-c06a-4c76-bc10-48544e0d1268')
    .single();

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Product Data:', JSON.stringify(data, null, 2));
}

checkSpecificProduct();
