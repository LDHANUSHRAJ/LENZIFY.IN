import { createClient } from "@/lib/supabase/server";
import { 
  Package, 
  User, 
  MapPin, 
  CreditCard, 
  Truck, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ChevronLeft,
  FileText,
  Eye,
  Download,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { updateOrderStatus } from "@/lib/db/order_actions";
import { cn } from "@/lib/utils";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch Order with Joins
  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      *,
      users(name, email, phone),
      addresses(*),
      order_items(
        *,
        products(name, brand, product_images(*)),
        lenses(name)
      ),
      prescriptions(*)
    `)
    .eq("id", id)
    .single();

  if (error || !order) {
    return (
      <div className="py-20 text-center">
        <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
        <h1 className="text-2xl font-serif italic text-brand-navy">Protocol Not Found</h1>
        <p className="text-[10px] text-brand-navy/30 uppercase tracking-widest mt-4">The requested transaction does not exist in the vault.</p>
        <Link href="/admin/orders" className="inline-block mt-8 text-[10px] font-bold uppercase tracking-widest border-b border-brand-navy pb-1">Return to Matrix</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <header className="flex items-center justify-between border-b border-brand-navy/5 pb-10">
        <div className="flex items-center gap-8">
          <Link href="/admin/orders" className="p-4 bg-brand-background border border-brand-navy/5 hover:bg-brand-navy hover:text-white transition-all">
            <ChevronLeft size={20} />
          </Link>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary italic mb-2">Order Identification</p>
            <h1 className="text-4xl font-serif italic text-brand-navy tracking-tight uppercase">Protocol <span className="text-secondary">#{id.slice(0, 8)}</span></h1>
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
                Print Protocol
              </button>
              
              {order.payment_status === 'paid' && (
                <form action={async () => {
                   "use server";
                   const { refundOrder } = await import("@/app/admin/orders/actions");
                   await refundOrder(id);
                }}>
                  <button type="submit" className="p-4 bg-red-50 border border-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                    <AlertCircle size={16} />
                    Issue Refund
                  </button>
                </form>
              )}
           </div>

           <form action={async (formData) => {
               "use server";
               const status = formData.get("status") as string;
               const payment_status = formData.get("payment_status") as string;
               const tracking_id = formData.get("tracking_id") as string;
               const courier = formData.get("courier") as string;
               const { updateOrderStatus } = await import("@/app/admin/orders/actions");
               await updateOrderStatus(id, status, payment_status, tracking_id, courier);
           }} className="flex flex-wrap items-center gap-4 bg-white border border-brand-navy/10 p-4 shadow-sm">
               <div className="flex flex-col gap-1">
                 <label className="text-[8px] font-black uppercase tracking-widest text-brand-navy/30">Order Status</label>
                 <select name="status" defaultValue={order.status} className="bg-transparent text-[10px] font-bold uppercase tracking-widest outline-none border-b border-brand-navy/5 pb-1">
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                 </select>
               </div>
               
               <div className="flex flex-col gap-1">
                 <label className="text-[8px] font-black uppercase tracking-widest text-brand-navy/30">Payment Matrix</label>
                 <select name="payment_status" defaultValue={order.payment_status} className="bg-transparent text-[10px] font-bold uppercase tracking-widest outline-none border-b border-brand-navy/5 pb-1">
                    <option value="pending">Unpaid</option>
                    <option value="paid">Paid</option>
                    <option value="refunded">Refunded</option>
                 </select>
               </div>

               <div className="flex flex-col gap-1">
                 <label className="text-[8px] font-black uppercase tracking-widest text-brand-navy/30">Logistics ID</label>
                 <input name="tracking_id" defaultValue={order.tracking_id} placeholder="Tracking ID..." className="bg-transparent text-[10px] font-bold uppercase tracking-widest outline-none border-b border-brand-navy/5 pb-1 w-32" />
               </div>

               <div className="flex flex-col gap-1">
                 <label className="text-[8px] font-black uppercase tracking-widest text-brand-navy/30">Courier Node</label>
                 <input name="courier" defaultValue={order.courier_partner} placeholder="Partner Name..." className="bg-transparent text-[10px] font-bold uppercase tracking-widest outline-none border-b border-brand-navy/5 pb-1 w-32" />
               </div>

               <button type="submit" className="bg-brand-navy text-white text-[10px] font-bold px-8 py-4 uppercase tracking-widest hover:bg-secondary transition-all shadow-lg ml-4">Commit Protocol</button>
           </form>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-12">
           {/* Items Section */}
           <section className="bg-white border border-brand-navy/5 shadow-sm p-10">
              <div className="flex items-center gap-3 mb-10 border-b border-brand-navy/5 pb-6">
                 <Package size={18} className="text-secondary" />
                 <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-brand-navy italic">Items Composition</h2>
              </div>
              <div className="space-y-8">
                 {order.order_items.map((item: any) => (
                    <div key={item.id} className="flex gap-8 group">
                       <div className="w-24 h-24 bg-brand-background border border-brand-navy/5 p-2 overflow-hidden">
                          <img 
                            src={item.products.product_images?.[0]?.image_url || "/placeholder.jpg"} 
                            alt={item.products.name}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                          />
                       </div>
                       <div className="flex-1 space-y-4">
                          <div className="flex justify-between items-start">
                             <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-navy/30 mb-1">{item.products.brand}</p>
                                <h3 className="text-lg font-serif italic text-brand-navy font-black tracking-tight">{item.products.name}</h3>
                             </div>
                             <p className="text-sm font-serif italic text-secondary font-black italic">₹{item.price.toLocaleString()}</p>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4 border-t border-brand-navy/[0.03]">
                             <div>
                                <p className="text-[9px] uppercase font-bold text-brand-navy/30 tracking-widest mb-1">Optical Type</p>
                                <p className="text-[10px] font-bold text-brand-navy/60 uppercase">{item.lenses?.name || item.lens_type || 'Frame Only'}</p>
                             </div>
                             <div>
                                <p className="text-[9px] uppercase font-bold text-brand-navy/30 tracking-widest mb-1">Power Matrix</p>
                                <p className="text-[10px] font-bold text-brand-navy/60 uppercase">
                                  {item.prescription_json ? 
                                    `L: ${item.prescription_json.os_sph || '0.00'} | R: ${item.prescription_json.od_sph || '0.00'}` : 
                                    `L: ${item.power_left || 'PL'} | R: ${item.power_right || 'PL'}`}
                                </p>
                             </div>
                             <div>
                                <p className="text-[9px] uppercase font-bold text-brand-navy/30 tracking-widest mb-1">Quantity</p>
                                <p className="text-[10px] font-bold text-brand-navy/60 uppercase">Unit: {item.quantity}</p>
                             </div>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </section>

           {/* Prescription Data */}
           {order.prescriptions?.[0] && (
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
                     <div className="space-y-6">
                        <div className="bg-white/5 p-6 border border-white/10">
                           <p className="text-[9px] uppercase font-bold text-secondary tracking-widest mb-3">Power Details</p>
                           <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                              Left: {order.prescriptions[0].left_eye || 'Standard'}<br/>
                              Right: {order.prescriptions[0].right_eye || 'Standard'}<br/>
                              PD: {order.prescriptions[0].pd || 'Global Standard'}
                           </p>
                        </div>
                        {order.prescriptions[0].file_url && (
                          <a 
                            href={order.prescriptions[0].file_url} 
                            target="_blank"
                            className="flex items-center gap-4 bg-secondary text-brand-navy p-5 text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all font-black"
                          >
                             <Download size={14} /> Download Clinical Report
                          </a>
                        )}
                     </div>
                     <div className="aspect-[3/4] bg-white/5 border border-white/10 p-4 relative group">
                        {order.prescriptions[0].file_url ? (
                          <img src={order.prescriptions[0].file_url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-white/20">
                             <AlertCircle size={48} className="mb-4 opacity-10" />
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
                 <div className="pt-6 border-t border-brand-navy/[0.03]">
                    <p className="text-[9px] uppercase font-bold text-brand-navy/30 tracking-widest mb-2">Communication Hub</p>
                    <p className="text-[10px] font-bold text-brand-navy/60 italic">{order.users?.phone || 'Encrypted'}</p>
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
                 <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-brand-navy italic">Logistics Path</h2>
              </div>
              <div className="space-y-6">
                 <p className="text-[11px] font-bold uppercase tracking-widest text-brand-navy/70 leading-relaxed italic">
                    {order.addresses?.address}, <br/>
                    {order.addresses?.city}, {order.addresses?.state} <br/>
                    {order.addresses?.pincode}
                 </p>
                 <div className="pt-6 border-t border-brand-navy/[0.03]">
                    <p className="text-[9px] uppercase font-bold text-brand-navy/30 tracking-widest mb-2">Carrier Partner</p>
                    <p className="text-[10px] font-bold text-brand-navy uppercase tracking-widest leading-tight">{order.courier_partner || 'Assigning Carrier...'}</p>
                 </div>
                 {order.tracking_id && (
                    <div className="mt-4 p-4 bg-brand-background border border-brand-navy/5 font-mono text-[10px] font-bold text-brand-navy break-all italic">
                       TRANSIT_ID: {order.tracking_id}
                    </div>
                 )}
              </div>
            </section>

           {/* Payment Status */}
           <section className="bg-brand-background border border-brand-navy/5 p-10">
              <div className="flex items-center gap-3 mb-8 border-b border-brand-navy/5 pb-6">
                 <CreditCard size={18} className="text-secondary" />
                 <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-brand-navy italic">Financial Audit</h2>
              </div>
              <div className="space-y-4">
                 <div className="flex justify-between items-center bg-white p-5 border border-brand-navy/5">
                    <p className="text-[9px] uppercase font-black tracking-widest text-brand-navy/40 italic">Economic State</p>
                    <span className={cn(
                       "text-[9px] uppercase font-black italic tracking-widest",
                       order.payment_status === 'paid' ? "text-secondary" : "text-brand-navy/30"
                    )}>{order.payment_status}</span>
                 </div>
                 <p className="text-[8px] uppercase font-bold text-brand-navy/20 tracking-[0.2em] px-1 italic">Authorized via System Protocol</p>
              </div>
           </section>
        </div>
      </div>
    </div>
  );
}
