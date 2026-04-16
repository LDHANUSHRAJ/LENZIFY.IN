import { BarChart3, ShoppingCart, Package, Users, Warehouse, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ReportTabs({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: any) => void }) {
  const tabs = [
    { id: "sales", label: "Sales Matrix", icon: BarChart3 },
    { id: "orders", label: "Global Orders", icon: ShoppingCart },
    { id: "products", label: "Product Performance", icon: Package },
    { id: "customers", label: "Customer Manifest", icon: Users },
    { id: "inventory", label: "Inventory Audit", icon: Warehouse },
    { id: "lenses", label: "Lens Exchange", icon: Search },
  ];

  return (
    <div className="bg-brand-navy text-white p-6 space-y-2 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-[50px]"></div>
      <h3 className="text-xs font-bold uppercase tracking-widest mb-8 border-b border-white/10 pb-4 italic">Filter Perspectives</h3>
      <div className="space-y-2 relative z-10">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={cn(
              "w-full flex items-center gap-4 px-4 py-4 text-[10px] font-bold uppercase tracking-widest transition-all",
              activeTab === t.id ? "bg-secondary text-brand-navy shadow-lg" : "hover:bg-white/5 text-white/50 hover:text-white"
            )}
          >
            <t.icon size={16} />
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
