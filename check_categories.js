const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://lglknxmkgoixyhksfbjy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnbGtueG1rZ29peHloa3NmYmp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3OTMzNjAsImV4cCI6MjA5MDM2OTM2MH0.1JAcFpT8MuomBTbtedUktKWhj--vxe1HxKuCzQp7SEA'
);

async function listCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Categories:', JSON.stringify(data, null, 2));
}

listCategories();
