import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  return (
    <SettingsClient
      userId={user.id}
      email={user.email ?? ""}
      currentName={user.user_metadata?.name ?? ""}
      currentPhone={user.user_metadata?.phone ?? ""}
      notifyOrderUpdates={user.user_metadata?.notify_order_updates ?? true}
      notifyOffers={user.user_metadata?.notify_offers ?? true}
    />
  );
}
