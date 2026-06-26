import { createClient } from "@/lib/supabase/server";
import StoresClient from "./StoresClient";

export const revalidate = 3600;

export default async function StoresPage() {
  const supabase = await createClient();
  const { data: stores } = await supabase
    .from("stores")
    .select("*")
    .neq("status", "closed")
    .order("sort_order", { ascending: true });

  return <StoresClient stores={stores ?? []} />;
}
