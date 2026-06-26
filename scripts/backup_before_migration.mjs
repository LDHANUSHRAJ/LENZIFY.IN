/**
 * Manual Supabase backup — exports 4 tables to timestamped JSON files.
 * Run: node scripts/backup_before_migration.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const SUPABASE_URL = "https://lglknxmkgoixyhksfbjy.supabase.co";
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnbGtueG1rZ29peHloa3NmYmp5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDc5MzM2MCwiZXhwIjoyMDkwMzY5MzYwfQ.R1PGfbzeSBt0bLv9gYHmP_NO28-7Omem12EE89_0uxA";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const TABLES = [
  "orders",
  "order_items",
  "order_status_history",
  "products",
];

async function fetchAll(table) {
  let rows = [];
  let from = 0;
  const PAGE = 1000;

  while (true) {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .range(from, from + PAGE - 1);

    if (error) throw new Error(`[${table}] ${error.message}`);
    rows = rows.concat(data);
    if (data.length < PAGE) break;
    from += PAGE;
  }

  return rows;
}

async function main() {
  const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const outDir = join(ROOT, "backups", ts);
  mkdirSync(outDir, { recursive: true });

  console.log(`\nLENZIFY — Pre-migration backup`);
  console.log(`Timestamp : ${ts}`);
  console.log(`Output    : ${outDir}\n`);

  const summary = [];

  for (const table of TABLES) {
    process.stdout.write(`  Exporting ${table.padEnd(28)}`);
    try {
      const rows = await fetchAll(table);
      const file = join(outDir, `${table}.json`);
      writeFileSync(file, JSON.stringify(rows, null, 2), "utf8");
      const label = rows.length === 0 ? "⚠️  0 rows (table empty or not yet created)" : `✅  ${rows.length} rows`;
      console.log(label);
      summary.push({ table, rows: rows.length, file });
    } catch (err) {
      console.log(`❌  ${err.message}`);
      summary.push({ table, rows: null, error: err.message });
    }
  }

  // Write manifest
  const manifest = {
    timestamp: new Date().toISOString(),
    supabase_url: SUPABASE_URL,
    tables: summary,
  };
  writeFileSync(join(outDir, "_manifest.json"), JSON.stringify(manifest, null, 2));

  console.log(`\nManifest  : ${outDir}/_manifest.json`);
  console.log("Done.\n");
}

main().catch((err) => {
  console.error("\nFatal:", err.message);
  process.exit(1);
});
