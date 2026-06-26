import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PrescriptionsClient from "./PrescriptionsClient";

export default async function CustomerPrescriptionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: prescriptions } = await supabase
    .from("prescriptions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return <PrescriptionsClient prescriptions={prescriptions ?? []} userId={user.id} />;
}
