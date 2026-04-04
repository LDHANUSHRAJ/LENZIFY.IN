import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-brand-background min-h-screen text-brand-text-primary">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8 lg:p-12 min-h-screen">
        {children}
      </main>
    </div>
  );
}
