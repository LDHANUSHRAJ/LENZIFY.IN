const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://lglknxmkgoixyhksfbjy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnbGtueG1rZ29peHloa3NmYmp5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDc5MzM2MCwiZXhwIjoyMDkwMzY5MzYwfQ.R1PGfbzeSBt0bLv9gYHmP_NO28-7Omem12EE89_0uxA'
);

async function checkSchema() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error:', error);
    return;
  }

  if (data && data.length > 0) {
    console.log('Product Columns:', Object.keys(data[0]));
    console.log('Sample Data:', JSON.stringify(data[0], null, 2));
  } else {
    console.log('No products found');
  }
}

checkSchema();
