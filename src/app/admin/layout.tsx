import Sidebar from "@/components/admin/Sidebar";
import TopBar from "@/components/admin/TopBar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-surface font-sans selection:bg-secondary selection:text-brand-navy">
      {/* Global Administrative Sidebar - Fixed Navigation */}
      <Sidebar />

      {/* Primary Command Interface Area */}
      <div className="pl-64 flex flex-col min-h-screen">
        {/* Dynamic Operational Content Viewport */}
        <main className="flex-1 p-8 lg:p-12 max-w-[1920px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="bg-white/40 backdrop-blur-sm border border-brand-navy/5 rounded-3xl p-8 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] min-h-[calc(100vh-4rem)]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
