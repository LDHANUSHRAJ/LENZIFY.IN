import { createClient } from "@/lib/supabase/server";
import { 
  Package, User, MapPin, Truck, Calendar, Clock, ChevronLeft, FileText, AlertTriangle, CheckCircle2, ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function AdminReplacementDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: order, error } = await supabase
    .from("lens_replacement_orders")
    .select(`
      *,
      users(name, email, phone),
      addresses(*),
      lenses(*),
      orders(payment_method, status),
      order_tracking(*)
    `)
    .eq("id", id)
    .single();

  if (error || !order) {
    return (
      <div className="py-20 text-center">
        <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
        <h1 className="text-2xl font-serif italic text-brand-navy">Service Protocol Not Found</h1>
        <p className="text-[10px] text-brand-navy/30 uppercase tracking-widest mt-4">The requested replacement module does not exist in the vault.</p>
        <Link href="/admin/replacements" className="inline-block mt-8 text-[10px] font-bold uppercase tracking-widest border-b border-brand-navy pb-1">Return to Matrix</Link>
      </div>
    );
  }

  const { data: lensAddons } = await supabase.from("lens_addons").select("*").in("id", order.add_ons || []);

  const prescription = order.prescription_json as any || {};

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <header className="flex items-center justify-between border-b border-brand-navy/5 pb-10">
        <div className="flex items-center gap-8">
          <Link href="/admin/replacements" className="p-4 bg-brand-background border border-brand-navy/5 hover:bg-brand-navy hover:text-white transition-all">
            <ChevronLeft size={20} />
          </Link>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary italic mb-2">Replacement Protocol</p>
            <h1 className="text-4xl font-serif italic text-brand-navy tracking-tight uppercase">Module <span className="text-secondary">#{id.slice(0, 8)}</span></h1>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
           {/* Primary Actions */}
           <div className="flex gap-2">
              <button 
                onClick={() => window.print()}
                className="p-4 bg-white border border-brand-navy/10 text-brand-navy hover:bg-brand-navy hover:text-white transition-all shadow-sm flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
              >
                <FileText size={16} className="text-secondary" />
                Print Manifest
              </button>
           </div>

           <form action={async (formData) => {
               "use server";
               const status = formData.get("status") as string;
               const tracking_id = formData.get("tracking_id") as string;
               const courier = formData.get("courier") as string;
               const { updateReplacementStatus } = await import("@/app/admin/replacements/actions");
               await updateReplacementStatus(id, status, { tracking_id, courier_name: courier });
           }} className="flex flex-wrap items-center gap-4 bg-white border border-brand-navy/10 p-4 shadow-sm">
               <div className="flex flex-col gap-1">
                 <label className="text-[8px] font-black uppercase tracking-widest text-brand-navy/30">Service Phase</label>
                 <select name="status" defaultValue={order.status} className="bg-transparent text-[10px] font-bold uppercase tracking-widest outline-none border-b border-brand-navy/5 pb-1">
                    <option value="pending">Pending Setup</option>
                    <option value="pickup_scheduled">Pickup Scheduled</option>
                    <option value="processing">In Lab</option>
                    <option value="shipped">Dispatched Frame</option>
                    <option value="delivered">Delivered</option>
                 </select>
               </div>
               
               <div className="flex flex-col gap-1">
                 <label className="text-[8px] font-black uppercase tracking-widest text-brand-navy/30">Logistics ID</label>
                 <input name="tracking_id" defaultValue={order.order_tracking?.[0]?.tracking_id || ''} placeholder="Tracking ID..." className="bg-transparent text-[10px] font-bold uppercase tracking-widest outline-none border-b border-brand-navy/5 pb-1 w-32" />
               </div>

               <div className="flex flex-col gap-1">
                 <label className="text-[8px] font-black uppercase tracking-widest text-brand-navy/30">Courier Node</label>
                 <input name="courier" defaultValue={order.order_tracking?.[0]?.courier_name || ''} placeholder="Partner Name..." className="bg-transparent text-[10px] font-bold uppercase tracking-widest outline-none border-b border-brand-navy/5 pb-1 w-32" />
               </div>

               <button type="submit" className="bg-brand-navy text-white text-[10px] font-bold px-8 py-4 uppercase tracking-widest hover:bg-secondary transition-all shadow-lg ml-4">Commit Phase</button>
           </form>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-12">
           {/* Required Services */}
           <section className="bg-white border border-brand-navy/5 shadow-sm p-10">
              <div className="flex items-center gap-3 mb-10 border-b border-brand-navy/5 pb-6">
                 <Package size={18} className="text-secondary" />
                 <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-brand-navy italic">Optical Assembly</h2>
              </div>
              <div className="space-y-8">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4 border-t border-brand-navy/[0.03]">
                     <div>
                        <p className="text-[9px] uppercase font-bold text-brand-navy/30 tracking-widest mb-1">Incoming Frame</p>
                        <p className="text-[10px] font-bold text-brand-navy/60 uppercase">{order.frame_type}</p>
                        <p className="text-[8px] text-brand-navy/40 font-bold tracking-widest uppercase mt-1">Condition: {order.frame_condition}</p>
                     </div>
                     <div>
                        <p className="text-[9px] uppercase font-bold text-brand-navy/30 tracking-widest mb-1">Target Engine (Lens)</p>
                        <p className="text-[10px] font-bold text-brand-navy/60 uppercase">{order.lenses?.name || 'Standard Single Vision'}</p>
                        <p className="text-[8px] text-brand-navy/40 font-bold tracking-widest uppercase mt-1">Base Price: ₹{order.lenses?.price || 0}</p>
                     </div>
                  </div>

                  {lensAddons && lensAddons.length > 0 && (
                     <div className="pt-6 border-t border-brand-navy/[0.03]">
                        <p className="text-[9px] uppercase font-bold text-brand-navy/30 tracking-widest mb-4">Required Enhancements (Add-ons)</p>
                        <div className="flex flex-wrap gap-4">
                           {lensAddons.map((addon: any) => (
                              <div key={addon.id} className="flex items-center gap-2 bg-brand-background border border-brand-navy/5 p-3 rounded-sm text-[10px] uppercase font-black">
                                 <ShieldCheck size={14} className="text-secondary" />
                                 {addon.name} <span className="opacity-40 italic ml-2">₹{addon.price}</span>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}
              </div>
           </section>

           {/* Prescription Data */}
           {prescription && Object.keys(prescription).length > 0 && (
             <section className="bg-brand-navy text-white p-10 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-150 transition-transform duration-1000">
                   <FileText size={120} />
                </div>
                <div className="relative">
                  <div className="flex items-center gap-3 mb-10 border-b border-white/10 pb-6">
                     <FileText size={18} className="text-secondary" />
                     <h2 className="text-sm font-bold uppercase tracking-[0.3em] italic">Clinical Metadata</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                     <div className="bg-white/5 p-6 border border-white/10 space-y-4">
                         <div className="flex justify-between items-center bg-black/10 p-3">
                            <span className="text-[8px] tracking-widest uppercase font-bold text-secondary">Right (OD)</span>
                            <span className="text-[10px] tracking-tight font-mono font-black border-l border-white/5 pl-2">{prescription.od_sph || '0.00'} / {prescription.od_cyl || '0.00'} × {prescription.od_axis || '0'}</span>
                         </div>
                         <div className="flex justify-between items-center bg-black/10 p-3">
                            <span className="text-[8px] tracking-widest uppercase font-bold text-secondary">Left (OS)</span>
                            <span className="text-[10px] tracking-tight font-mono font-black border-l border-white/5 pl-2">{prescription.os_sph || '0.00'} / {prescription.os_cyl || '0.00'} × {prescription.os_axis || '0'}</span>
                         </div>
                         <div className="flex justify-between items-center bg-black/10 p-3">
                            <span className="text-[8px] tracking-widest uppercase font-bold text-white/50">PD</span>
                            <span className="text-[10px] tracking-tight font-mono font-black border-l border-white/5 pl-2">{prescription.pd || '62'}</span>
                         </div>
                     </div>

                     <div className="aspect-[3/4] bg-white/5 border border-white/10 p-4 relative group">
                        {order.prescription_file_url ? (
                          <img src={order.prescription_file_url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-white/20">
                             <AlertTriangle size={48} className="mb-4 opacity-10" />
                             <p className="text-[8px] uppercase font-bold tracking-widest italic">Visual Data Not Uploaded</p>
                          </div>
                        )}
                     </div>
                  </div>
                </div>
             </section>
           )}
        </div>

        {/* Sidebar Data */}
        <div className="space-y-12">
           {/* Client Analytics */}
           <section className="bg-white border border-brand-navy/5 shadow-sm p-10">
              <div className="flex items-center gap-3 mb-8 border-b border-brand-navy/5 pb-6">
                 <User size={18} className="text-secondary" />
                 <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-brand-navy italic">Client Matrix</h2>
              </div>
              <div className="space-y-6">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-brand-navy text-white flex items-center justify-center font-black italic">{order.users?.name?.[0]}</div>
                    <div>
                       <p className="text-sm font-serif italic text-brand-navy font-black tracking-tight">{order.users?.name}</p>
                       <p className="text-[9px] text-brand-navy/40 font-bold uppercase tracking-widest mt-1">{order.users?.email}</p>
                    </div>
                 </div>
              </div>
           </section>

           {/* Delivery Coordinates */}
            <section className="bg-white border border-brand-navy/5 shadow-sm p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                  <Truck size={48} />
              </div>
              <div className="flex items-center gap-3 mb-8 border-b border-brand-navy/5 pb-6">
                 <MapPin size={18} className="text-secondary" />
                 <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-brand-navy italic">Extraction Point</h2>
              </div>
              <div className="space-y-6">
                 <div className="bg-brand-background border border-brand-navy/5 p-4 space-y-4">
                    <div className="flex items-center gap-2">
                       <Calendar size={12} className="text-brand-navy/40" />
                       <span className="text-[10px] uppercase font-bold tracking-widest">{order.pickup_date || 'TBD'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <Clock size={12} className="text-brand-navy/40" />
                       <span className="text-[10px] uppercase font-bold tracking-widest">{order.pickup_slot || 'TBD'}</span>
                    </div>
                 </div>
                 
                 <p className="text-[11px] font-bold uppercase tracking-widest text-brand-navy/70 leading-relaxed italic border-t border-brand-navy/[0.05] pt-6">
                    {order.addresses?.address}, <br/>
                    {order.addresses?.city}, {order.addresses?.state} <br/>
                    {order.addresses?.pincode}
                 </p>
                 
              </div>
            </section>
        </div>
      </div>
    </div>
  );
}
