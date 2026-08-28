import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrate() {
  console.log("Connecting to Supabase at:", supabaseUrl);
  console.log("Fetching products...");

  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, colors, sizes");

  if (error) {
    console.error("Error fetching products:", error);
    process.exit(1);
  }

  console.log(`Found ${products.length} products. Checking for legacy variant formats...`);

  let migratedCount = 0;

  for (const product of products) {
    let needsUpdate = false;
    let newColors = product.colors || [];
    let newSizes = product.sizes || [];

    // Parse and convert colors
    if (product.colors && product.colors.length > 0) {
      newColors = product.colors.map((c: string) => {
        if (typeof c === 'string' && !c.trim().startsWith('{')) {
          needsUpdate = true;
          return JSON.stringify({ name: c.trim(), hex: "#000000", image: null });
        }
        return c;
      });
    }

    // Parse and convert sizes
    if (product.sizes && product.sizes.length > 0) {
      newSizes = product.sizes.map((s: string) => {
        if (typeof s === 'string' && !s.trim().startsWith('{')) {
          needsUpdate = true;
          return JSON.stringify({ label: s.trim(), inStock: true, stockQty: null });
        }
        return s;
      });
    }

    if (needsUpdate) {
      console.log(`Migrating legacy variants for product: "${product.name}" (${product.id})`);
      const { error: updateError } = await supabase
        .from("products")
        .update({
          colors: newColors,
          sizes: newSizes
        })
        .eq("id", product.id);

      if (updateError) {
        console.error(`Failed to update product ${product.id}:`, updateError);
      } else {
        migratedCount++;
      }
    }
  }

  console.log(`Migration complete. Successfully converted ${migratedCount} products to the new JSON variant format!`);
}

migrate();
