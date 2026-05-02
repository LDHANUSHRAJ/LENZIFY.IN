const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function seed() {
  console.log('Seeding Lenses...');
  const { data: lenses, error: lensError } = await supabase.from('lenses').upsert([
    { name: 'Single Vision', description: 'Standard correction for one distance.', base_price: 500, is_enabled: true },
    { name: 'Bifocal', description: 'Two distinct optical powers.', base_price: 800, is_enabled: true },
    { name: 'Progressive', description: 'Seamless multifocal transition.', base_price: 1500, is_enabled: true },
    { name: 'Blue Cut', description: 'Digital screen protection.', base_price: 1200, is_enabled: true },
    { name: 'Photochromic', description: 'Adapts to light conditions.', base_price: 1800, is_enabled: true },
  ], { onConflict: 'name' });

  if (lensError) console.error('Lens seeding failed:', lensError);
  else console.log('Lenses seeded successfully');

  console.log('Seeding Coatings...');
  const { data: coatings, error: coatingError } = await supabase.from('lens_coatings').upsert([
    { name: 'Anti-Reflective', description: 'Reduces glare.', price: 300, is_enabled: true },
    { name: 'Scratch Resistant', description: 'Durability boost.', price: 200, is_enabled: true },
    { name: 'UV Protection', description: 'Blocks harmful rays.', price: 250, is_enabled: true },
    { name: 'Anti-Fog', description: 'Clear vision in any weather.', price: 400, is_enabled: true },
  ], { onConflict: 'name' });

  if (coatingError) console.error('Coating seeding failed:', coatingError);
  else console.log('Coatings seeded successfully');
}

seed();
