import Sidebar from "@/components/admin/Sidebar";
import TopBar from "@/components/admin/TopBar";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    if (user.user_metadata?.role === "admin") {
      isAdmin = true;
    } else {
      const { data: adminRecord } = await supabase
        .from("admins")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();
      if (adminRecord) {
        isAdmin = true;
      } else if (user.email === "lenzify.in@gmail.com") {
        isAdmin = true;
      }
    }
  }

  if (!user || !isAdmin) {
    redirect("/");
  }

  return (
    <div
      className="min-h-screen bg-[#F4F6F8] font-sans"
      suppressHydrationWarning
    >
      <Sidebar />
      <div className="lg:pl-60 flex flex-col min-h-screen">
        <TopBar />
        <main className="flex-1 p-5 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
