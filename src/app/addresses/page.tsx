import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AddressesClient from "./AddressesClient";

export default async function AddressesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: addresses } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return <AddressesClient addresses={addresses ?? []} userId={user.id} />;
}
