import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-surface min-h-screen text-on-surface">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-12 lg:p-16 min-h-screen">
        {children}
      </main>
    </div>
  );
}
