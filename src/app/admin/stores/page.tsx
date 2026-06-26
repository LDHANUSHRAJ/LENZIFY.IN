import { createAdminClient } from "@/lib/supabase/server";
import { MapPin, Plus, Trash2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { addStore, deleteStore, updateStoreStatus } from "./actions";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  operational: "bg-emerald-50 text-emerald-700",
  coming_soon: "bg-amber-50 text-amber-700",
  closed: "bg-red-50 text-red-600",
};

const STATUS_LABELS: Record<string, string> = {
  operational: "Operational",
  coming_soon: "Coming Soon",
  closed: "Closed",
};

export default async function AdminStoresPage() {
  const supabase = await createAdminClient();
  const { data: stores } = await supabase
    .from("stores")
    .select("*")
    .order("sort_order", { ascending: true });

  const all = stores ?? [];

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-brand-navy/5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary italic mb-2">Retail Network</p>
          <h1 className="text-4xl font-serif italic text-brand-navy tracking-tight uppercase">Store <span className="text-secondary">Management</span></h1>
        </div>
        <div className="text-sm text-brand-navy/40">{all.length} location{all.length !== 1 ? "s" : ""} total</div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Add Store Form */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-brand-navy p-8 text-white shadow-xl">
            <div className="flex items-center gap-3 border-b border-white/10 pb-5 mb-6">
              <Plus size={14} className="text-secondary" />
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">Add New Location</h3>
            </div>
            <form
              action={async (fd) => {
                "use server";
                await addStore(fd);
              }}
              className="space-y-5"
            >
              {[
                { name: "name", label: "Store Name", placeholder: "Lenzify Chennai" },
                { name: "address", label: "Address", placeholder: "Anna Salai, T. Nagar" },
                { name: "city", label: "City", placeholder: "Chennai" },
                { name: "state", label: "State", placeholder: "Tamil Nadu" },
                { name: "phone", label: "Phone (optional)", placeholder: "+91 98765 43210" },
                { name: "hours", label: "Hours (optional)", placeholder: "Mon–Sat: 10 AM – 8 PM" },
                { name: "lat", label: "Latitude (optional)", placeholder: "13.0827" },
                { name: "lng", label: "Longitude (optional)", placeholder: "80.2707" },
              ].map(({ name, label, placeholder }) => (
                <div key={name} className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-white/50">{label}</label>
                  <input
                    name={name}
                    placeholder={placeholder}
                    className="w-full bg-white/10 border border-white/10 px-4 py-3 text-xs text-white placeholder-white/30 outline-none focus:border-secondary transition-all"
                  />
                </div>
              ))}
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-widest text-white/50">Status</label>
                <select
                  name="status"
                  className="w-full bg-white/10 border border-white/10 px-4 py-3 text-xs text-white outline-none focus:border-secondary transition-all"
                >
                  <option value="operational">Operational</option>
                  <option value="coming_soon">Coming Soon</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-secondary text-brand-navy py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:opacity-90 transition-all mt-2"
              >
                Add Store
              </button>
            </form>
          </div>
        </div>

        {/* Store List */}
        <div className="xl:col-span-8 space-y-4">
          {all.length === 0 ? (
            <div className="bg-white border border-brand-navy/5 p-16 text-center">
              <MapPin size={32} className="mx-auto text-brand-navy/15 mb-4" />
              <p className="text-sm text-brand-navy/40 uppercase tracking-widest font-bold">No stores yet</p>
              <p className="text-xs text-brand-navy/25 mt-2">Add your first location using the form.</p>
            </div>
          ) : (
            all.map((store: any) => (
              <div key={store.id} className="bg-white border border-brand-navy/5 p-6 lg:p-8 flex flex-col md:flex-row md:items-center gap-6 shadow-sm">
                <div className="w-10 h-10 bg-brand-background flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-secondary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-serif italic font-black text-brand-navy text-lg">{store.name}</h3>
                    <span className={cn("text-[10px] font-bold uppercase tracking-widest px-2.5 py-1", STATUS_STYLES[store.status] || "bg-gray-50 text-gray-600")}>
                      {STATUS_LABELS[store.status] || store.status}
                    </span>
                  </div>
                  <p className="text-xs text-brand-navy/50 mt-1">{store.address}, {store.city}, {store.state}</p>
                  {store.hours && <p className="text-[10px] text-brand-navy/35 mt-1">{store.hours}</p>}
                  {store.phone && <p className="text-[10px] text-brand-navy/35">{store.phone}</p>}
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  {/* Status Toggle */}
                  {store.status !== "operational" && (
                    <form action={async () => { "use server"; await updateStoreStatus(store.id, "operational"); }}>
                      <button className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-emerald-600 border border-emerald-100 bg-emerald-50 px-3 py-2 hover:bg-emerald-100 transition-all">
                        <CheckCircle2 size={12} />
                        Set Operational
                      </button>
                    </form>
                  )}
                  {store.status === "operational" && (
                    <form action={async () => { "use server"; await updateStoreStatus(store.id, "coming_soon"); }}>
                      <button className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-amber-600 border border-amber-100 bg-amber-50 px-3 py-2 hover:bg-amber-100 transition-all">
                        <Clock size={12} />
                        Mark Coming Soon
                      </button>
                    </form>
                  )}
                  <form action={async () => { "use server"; await deleteStore(store.id); }}>
                    <button className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-red-500 border border-red-100 bg-red-50 px-3 py-2 hover:bg-red-100 transition-all">
                      <Trash2 size={12} />
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
