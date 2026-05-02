"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function DynamicThemeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    // 1. Fetch initial settings
    const fetchSettings = async () => {
      const { data } = await supabase.from("store_settings").select("*").eq("id", 1).single();
      if (data) setSettings(data);
    };
    fetchSettings();

    // 2. Subscribe to real-time changes
    const channel = supabase
      .channel("store_settings_changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "store_settings", filter: "id=eq.1" },
        (payload: any) => {
          setSettings(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  // 3. Inject CSS Variables
  const brandColor = settings?.brand_color || "#775a19"; // Default secondary
  const primaryColor = settings?.primary_color || "#000000"; // Default primary

  const dynamicStyles = `
    :root {
      --secondary: ${brandColor};
      --primary: ${primaryColor};
      --color-secondary: ${brandColor};
      --color-primary: ${primaryColor};
    }
    
    /* Override Tailwind generated colors if necessary */
    .text-secondary { color: ${brandColor} !important; }
    .bg-secondary { background-color: ${brandColor} !important; }
    .border-secondary { border-color: ${brandColor} !important; }
    .ring-secondary { --tw-ring-color: ${brandColor} !important; }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: dynamicStyles }} />
      {children}
    </>
  );
}
