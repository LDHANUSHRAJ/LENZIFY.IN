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

async function run() {
  console.log("Fixing lens categories and inserting features...");

  // 1. Update existing lenses' categories to 'type'
  const { error: updateError } = await supabase
    .from("lenses")
    .update({ category: "type" })
    .in("name", ["Single Vision", "Bifocal", "Progressive", "Blue Cut", "Photochromic"]);

  if (updateError) {
    console.error("Error updating lenses category:", updateError);
  } else {
    console.log("Successfully set categories for 'Single Vision', 'Bifocal', 'Progressive', 'Blue Cut', 'Photochromic' to 'type'.");
  }

  // 2. Insert features (laboratory enhancements) into lenses table with category 'feature'
  const features = [
    { name: "Anti-Reflective Coating", description: "Reduces glare and reflections.", base_price: 300, price: 300, category: "feature", is_active: true },
    { name: "Scratch Resistant Shield", description: "Protects lenses from daily wear.", base_price: 200, price: 200, category: "feature", is_active: true },
    { name: "UV Block Protection", description: "Blocks harmful ultraviolet rays.", base_price: 250, price: 250, category: "feature", is_active: true },
    { name: "Anti-Fog Coating", description: "Prevents lenses from fogging up.", base_price: 400, price: 400, category: "feature", is_active: true }
  ];

  for (const feature of features) {
    const { data: existing } = await supabase
      .from("lenses")
      .select("id")
      .eq("name", feature.name)
      .maybeSingle();

    if (!existing) {
      const { error: insertError } = await supabase
        .from("lenses")
        .insert(feature);
      if (insertError) {
        console.error(`Error inserting feature ${feature.name}:`, insertError);
      } else {
        console.log(`Inserted feature: ${feature.name}`);
      }
    } else {
      console.log(`Feature already exists: ${feature.name}`);
    }
  }

  console.log("Database category fix executed successfully!");
}

run();
