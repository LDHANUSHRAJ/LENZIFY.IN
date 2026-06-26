import { createAdminClient } from "@/lib/supabase/server";
import { Truck, MapPin, Plus, Trash2, CheckCircle2, XCircle, Globe, Zap, ShieldCheck } from "lucide-react";
import { addShippingPartner, deleteShippingPartner, updatePartnerStatus, addShippingZone, toggleZoneStatus, deleteShippingZone } from "./actions";
import { cn } from "@/lib/utils";

const PARTNER_STATUS_STYLES: Record<string, string> = {
  active: "text-emerald-600",
  inactive: "text-red-500",
  maintenance: "text-amber-500",
};

export default async function AdminShippingPage() {
  const supabase = await createAdminClient();

  const [partnersRes, zonesRes] = await Promise.all([
    supabase.from("shipping_partners").select("*").order("created_at"),
    supabase.from("shipping_zones").select("*").order("created_at"),
  ]);

  const partners = partnersRes.data ?? [];
  const zones = zonesRes.data ?? [];

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-brand-navy/5 pb-10">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary italic mb-2">Logistics Control</p>
          <h1 className="text-4xl font-serif italic text-brand-navy tracking-tight uppercase">Distribution <span className="text-secondary">Nexus</span></h1>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left column */}
        <div className="lg:col-span-8 space-y-12">
          {/* Courier Partners */}
          <section className="bg-white border border-brand-navy/5 p-10 lg:p-14 space-y-10 shadow-sm">
            <div className="flex items-center justify-between border-b border-brand-navy/5 pb-8">
              <div className="flex items-center gap-4">
                <Truck size={16} className="text-secondary" />
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-navy">Courier Partners</h3>
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-brand-navy/20 italic">{partners.length} registered</span>
            </div>

            {partners.length === 0 ? (
              <p className="text-sm text-brand-navy/40 text-center py-8">No courier partners added yet.</p>
            ) : (
              <div className="space-y-6">
                {partners.map((p: any) => (
                  <div key={p.id} className="flex flex-col md:flex-row items-center justify-between p-8 border border-brand-navy/5 bg-brand-background hover:border-secondary transition-all group">
                    <div className="flex items-center gap-8">
                      <div className="w-12 h-12 bg-white flex items-center justify-center text-brand-navy ring-4 ring-brand-navy/5 group-hover:bg-brand-navy group-hover:text-white transition-all">
                        <Truck size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-serif font-black italic text-brand-navy">{p.name}</h4>
                        <p className="text-[9px] text-brand-navy/30 uppercase font-black tracking-widest mt-1">ID: {p.partner_id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-10 mt-6 md:mt-0 flex-wrap">
                      <div className="text-right">
                        <p className="text-[8px] uppercase font-black tracking-widest text-brand-navy/20 mb-1">Coverage</p>
                        <p className="text-[10px] font-bold text-brand-navy uppercase">{p.coverage}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] uppercase font-black tracking-widest text-brand-navy/20 mb-1">Speed</p>
                        <p className="text-[10px] font-bold text-brand-navy uppercase">{p.speed}</p>
                      </div>
                      <div className="flex items-center gap-3 pl-6 border-l border-brand-navy/10">
                        <span className={cn("w-2 h-2 rounded-full",
                          p.status === "active" ? "bg-secondary" : p.status === "maintenance" ? "bg-amber-400" : "bg-red-500"
                        )} />
                        <span className={cn("text-[9px] uppercase font-black tracking-widest", PARTNER_STATUS_STYLES[p.status] || "text-brand-navy")}>
                          {p.status}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {p.status !== "active" && (
                          <form action={async () => { "use server"; await updatePartnerStatus(p.id, "active"); }}>
                            <button className="text-[8px] font-black uppercase tracking-widest text-emerald-600 border border-emerald-100 bg-emerald-50 px-3 py-2 hover:bg-emerald-100 transition-all">
                              Activate
                            </button>
                          </form>
                        )}
                        {p.status === "active" && (
                          <form action={async () => { "use server"; await updatePartnerStatus(p.id, "maintenance"); }}>
                            <button className="text-[8px] font-black uppercase tracking-widest text-amber-600 border border-amber-100 bg-amber-50 px-3 py-2 hover:bg-amber-100 transition-all">
                              Maintenance
                            </button>
                          </form>
                        )}
                        <form action={async () => { "use server"; await deleteShippingPartner(p.id); }}>
                          <button className="text-[8px] font-black uppercase tracking-widest text-red-500 border border-red-100 bg-red-50 px-3 py-2 hover:bg-red-100 transition-all">
                            <Trash2 size={11} />
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Delivery Zones */}
          <section className="bg-white border border-brand-navy/5 p-10 lg:p-14 space-y-10 shadow-sm">
            <div className="flex items-center justify-between border-b border-brand-navy/5 pb-8">
              <div className="flex items-center gap-4">
                <MapPin size={16} className="text-secondary" />
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-navy">Delivery Zones</h3>
              </div>
            </div>

            {zones.length === 0 ? (
              <p className="text-sm text-brand-navy/40 text-center py-8">No delivery zones configured yet.</p>
            ) : (
              <div className="space-y-4">
                {zones.map((z: any) => (
                  <div key={z.id} className="flex items-center justify-between p-6 border border-brand-navy/5 bg-brand-background">
                    <div className="flex items-center gap-6">
                      <div className={cn("w-2 h-2 rounded-full flex-shrink-0", z.is_active ? "bg-secondary" : "bg-brand-navy/20")} />
                      <div>
                        <p className="text-sm font-serif font-black italic text-brand-navy">{z.city}, {z.state}</p>
                        <p className="text-[9px] text-brand-navy/40 uppercase tracking-widest mt-0.5">
                          {Number(z.charge) === 0 ? "Free Shipping" : `₹${z.charge} shipping charge`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <form action={async () => { "use server"; await toggleZoneStatus(z.id, !z.is_active); }}>
                        <button className={cn(
                          "text-[8px] font-black uppercase tracking-widest px-3 py-2 border transition-all",
                          z.is_active
                            ? "text-red-500 border-red-100 bg-red-50 hover:bg-red-100"
                            : "text-emerald-600 border-emerald-100 bg-emerald-50 hover:bg-emerald-100"
                        )}>
                          {z.is_active ? "Deactivate" : "Activate"}
                        </button>
                      </form>
                      <form action={async () => { "use server"; await deleteShippingZone(z.id); }}>
                        <button className="text-[8px] font-black uppercase tracking-widest text-red-500 border border-red-100 bg-red-50 px-3 py-2 hover:bg-red-100 transition-all">
                          <Trash2 size={11} />
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right column — Add forms */}
        <div className="lg:col-span-4 space-y-8 sticky top-10 self-start">
          {/* Add Partner */}
          <div className="bg-brand-navy p-8 text-white shadow-xl">
            <div className="flex items-center gap-3 border-b border-white/10 pb-5 mb-6">
              <Truck size={14} className="text-secondary" />
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">Register Partner</h3>
            </div>
            <form action={async (fd) => { "use server"; await addShippingPartner(fd); }} className="space-y-4">
              {[
                { name: "name", label: "Partner Name", placeholder: "DTDC Express" },
                { name: "coverage", label: "Coverage", placeholder: "Pan-India" },
                { name: "speed", label: "Delivery Speed", placeholder: "48-72h" },
              ].map(({ name, label, placeholder }) => (
                <div key={name} className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-white/50">{label}</label>
                  <input
                    name={name}
                    placeholder={placeholder}
                    required
                    className="w-full bg-white/10 border border-white/10 px-3 py-2.5 text-xs text-white placeholder-white/30 outline-none focus:border-secondary transition-all"
                  />
                </div>
              ))}
              <button type="submit" className="w-full bg-secondary text-brand-navy py-3 text-[10px] font-black uppercase tracking-[0.3em] hover:opacity-90 transition-all mt-2">
                Register
              </button>
            </form>
          </div>

          {/* Add Zone */}
          <div className="bg-white border border-brand-navy/5 p-8 shadow-sm">
            <div className="flex items-center gap-3 border-b border-brand-navy/5 pb-5 mb-6">
              <MapPin size={14} className="text-secondary" />
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-navy">Add Zone</h3>
            </div>
            <form action={async (fd) => { "use server"; await addShippingZone(fd); }} className="space-y-4">
              {[
                { name: "city", label: "City", placeholder: "Hyderabad" },
                { name: "state", label: "State", placeholder: "Telangana" },
                { name: "charge", label: "Shipping Charge (₹)", placeholder: "49" },
              ].map(({ name, label, placeholder }) => (
                <div key={name} className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-brand-navy/40">{label}</label>
                  <input
                    name={name}
                    placeholder={placeholder}
                    type={name === "charge" ? "number" : "text"}
                    min={name === "charge" ? "0" : undefined}
                    required={name !== "charge"}
                    className="w-full bg-brand-background border border-brand-navy/8 px-3 py-2.5 text-xs text-brand-navy outline-none focus:border-secondary transition-all"
                  />
                </div>
              ))}
              <button type="submit" className="w-full bg-brand-navy text-white py-3 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-secondary hover:text-brand-navy transition-all mt-2">
                Add Zone
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
