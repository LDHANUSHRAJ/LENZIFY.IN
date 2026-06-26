require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const categories = [
  { name: 'Men', type: 'gender', slug: 'men' },
  { name: 'Women', type: 'gender', slug: 'women' },
  { name: 'Kids', type: 'gender', slug: 'kids' },
  { name: 'Eyeglasses', type: 'product', slug: 'eyeglasses' },
  { name: 'Sunglasses', type: 'product', slug: 'sunglasses' },
  { name: 'Reading Glasses', type: 'product', slug: 'reading-glasses' },
  { name: 'Computer Glasses', type: 'product', slug: 'computer-glasses' },
  { name: 'Contact Lenses', type: 'product', slug: 'contact-lenses' },
  { name: 'Accessories', type: 'product', slug: 'accessories' },
  { name: 'Featured', type: 'display', slug: 'featured' },
  { name: 'New Arrivals', type: 'collection', slug: 'new-arrivals' },
  { name: 'Trending', type: 'collection', slug: 'trending' },
  { name: 'Best Sellers', type: 'collection', slug: 'best-sellers' }
];

async function seed() {
  console.log('Seeding categories...');
  for (const cat of categories) {
    const { error } = await supabase
      .from('categories')
      .insert(cat);
    
    if (error) {
      if (error.code === '23505') {
        console.log(`Category already exists: ${cat.name}`);
      } else {
        console.error(`Error seeding ${cat.name}:`, error.message);
      }
    } else {
      console.log(`Successfully seeded: ${cat.name}`);
    }
  }
  console.log('Done.');
}

seed();
