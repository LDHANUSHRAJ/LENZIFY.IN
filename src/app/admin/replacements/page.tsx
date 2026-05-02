import { getReplacementOrders, updateReplacementOrderStatus, getCoatings } from "../../replace-lenses/actions";
import { Truck, Eye, Package, CheckCircle2, AlertCircle, Clock, MapPin, Phone, User, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function AdminReplacementsPage() {
  const [orders, allCoatings] = await Promise.all([
    getReplacementOrders(),
    getCoatings()
  ]);

  return (
    <div className="min-h-screen bg-brand-surface pt-12 pb-24 font-sans text-brand-navy">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-serif italic tracking-tight leading-none">
                    Lens Replacement <span className="text-secondary">Orders</span>
                </h1>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-navy/40 italic">Logistics & Laboratory Management Portal</p>
            </div>
            <div className="flex gap-4">
                <div className="bg-white border border-brand-navy/5 p-6 shadow-sm">
                    <p className="text-[9px] font-black uppercase tracking-widest text-brand-navy/30 mb-1">Total Active Orders</p>
                    <p className="text-2xl font-serif italic leading-none">{orders.length}</p>
                </div>
            </div>
        </div>

        <div className="space-y-6">
            {orders.map((order) => (
                <div key={order.id} className="bg-white border border-brand-navy/5 overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                    <div className="p-8 flex flex-col lg:flex-row gap-12">
                        
                        {/* Status Bar */}
                        <div className="lg:w-64 space-y-6 shrink-0">
                            <div className="space-y-1">
                                <p className="text-[9px] font-black uppercase tracking-widest text-brand-navy/30">Protocol ID</p>
                                <p className="text-[11px] font-mono font-black uppercase">#{order.id.slice(0,8)}</p>
                            </div>
                            
                            <div className="space-y-4">
                                <p className="text-[9px] font-black uppercase tracking-widest text-brand-navy/30">Status Phase</p>
                                <div className={cn(
                                    "inline-flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest",
                                    order.status === "Delivered" ? "bg-green-50 text-green-700" : "bg-secondary/10 text-brand-navy"
                                )}>
                                    <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></div>
                                    {order.status}
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-brand-navy/5">
                                <p className="text-[9px] font-black uppercase tracking-widest text-brand-navy/30 italic">Transition Phase</p>
                                <form action={async (formData) => {
                                    "use server";
                                    const status = formData.get("status") as string;
                                    const notes = formData.get("notes") as string;
                                    const deliveryPerson = formData.get("delivery_person") as string;
                                    await updateReplacementOrderStatus(order.id, status, notes, deliveryPerson);
                                }} className="space-y-4">
                                    <select 
                                        name="status" 
                                        defaultValue={order.status}
                                        className="w-full bg-brand-surface border-none px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-brand-navy outline-none focus:ring-1 focus:ring-secondary"
                                    >
                                        <option>Order Placed</option>
                                        <option>Pickup Scheduled</option>
                                        <option>Picked Up</option>
                                        <option>Processing</option>
                                        <option>Ready</option>
                                        <option>Out for Delivery</option>
                                        <option>Delivered</option>
                                    </select>
                                    
                                    <div className="space-y-2">
                                        <label className="text-[8px] font-black uppercase text-brand-navy/30">Assigned Logistics</label>
                                        <input 
                                            name="delivery_person"
                                            placeholder="Assign personnel..."
                                            defaultValue={order.delivery_person}
                                            className="w-full bg-brand-surface border-none px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-brand-navy outline-none focus:ring-1 focus:ring-secondary"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[8px] font-black uppercase text-brand-navy/30">Laboratory Notes</label>
                                        <textarea 
                                            name="notes"
                                            rows={2}
                                            defaultValue={order.admin_notes}
                                            placeholder="Add internal notes..."
                                            className="w-full bg-brand-surface border-none px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-brand-navy outline-none focus:ring-1 focus:ring-secondary resize-none"
                                        />
                                    </div>

                                    <button type="submit" className="w-full bg-brand-navy text-white text-[9px] font-black uppercase tracking-widest py-3 hover:bg-secondary transition-all">Update Phase</button>
                                </form>
                            </div>
                        </div>

                        {/* Order Details */}
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-12">
                            
                            {/* Customer & Frame */}
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-navy/30 flex items-center gap-2">
                                        <User size={12} /> Custodian
                                    </h4>
                                    <div className="space-y-1">
                                        <p className="text-[12px] font-black uppercase tracking-widest">{order.pickup_address.name}</p>
                                        <p className="text-[11px] font-bold text-brand-navy/60">{order.pickup_address.phone}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-navy/30 flex items-center gap-2">
                                        <Package size={12} /> Frame Asset
                                    </h4>
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <p className="text-[12px] font-black uppercase tracking-widest">{order.frame_type}</p>
                                            <p className="text-[11px] font-bold text-brand-navy/40 italic">{order.frame_condition}</p>
                                        </div>
                                        
                                        {/* Frame Evidence */}
                                        {order.frame_images && order.frame_images.length > 0 && (
                                            <div className="grid grid-cols-4 gap-2">
                                                {order.frame_images.map((img: string, i: number) => (
                                                    <a key={i} href={img} target="_blank" rel="noreferrer" className="aspect-square border border-brand-navy/5 overflow-hidden hover:border-secondary transition-all">
                                                        <img src={img} alt={`Frame ${i}`} className="w-full h-full object-cover" />
                                                    </a>
                                                ))}
                                            </div>
                                        )}

                                        {/* Prescription Evidence */}
                                        {order.prescription_url && (
                                            <div className="space-y-2 pt-4 border-t border-brand-navy/5">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-brand-navy/30">Prescription Script</p>
                                                <a href={order.prescription_url} target="_blank" rel="noreferrer" className="block p-2 bg-brand-surface border border-brand-navy/5 hover:border-secondary transition-all">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-white border border-brand-navy/5 p-1">
                                                            <img src={order.prescription_url} alt="Prescription" className="w-full h-full object-cover" />
                                                        </div>
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-secondary">View Full Script</span>
                                                    </div>
                                                </a>
                                            </div>
                                        )}

                                        {/* Manual Prescription Display */}
                                        {order.prescription_type === 'manual' && order.prescription_data && (
                                            <div className="space-y-2 pt-4 border-t border-brand-navy/5">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-brand-navy/30 italic">Manual Entry Script</p>
                                                <div className="grid grid-cols-4 gap-2 bg-brand-surface p-3 text-[10px] font-bold">
                                                    <div className="text-[8px] opacity-40">EYE</div>
                                                    <div className="text-[8px] opacity-40">SPH</div>
                                                    <div className="text-[8px] opacity-40">CYL</div>
                                                    <div className="text-[8px] opacity-40">AXIS</div>
                                                    <div>OD</div>
                                                    <div>{order.prescription_data.od_sph}</div>
                                                    <div>{order.prescription_data.od_cyl}</div>
                                                    <div>{order.prescription_data.od_axis}</div>
                                                    <div>OS</div>
                                                    <div>{order.prescription_data.os_sph}</div>
                                                    <div>{order.prescription_data.os_cyl}</div>
                                                    <div>{order.prescription_data.os_axis}</div>
                                                </div>
                                                <p className="text-[9px] font-black uppercase text-secondary">PD: {order.prescription_data.pd}mm</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Logistics & Route */}
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary flex items-center gap-2 italic">
                                        <MapPin size={12} /> Retrieval (A)
                                    </h4>
                                    <div className="space-y-2 p-4 bg-brand-surface border border-brand-navy/5">
                                        <p className="text-[11px] font-black uppercase tracking-widest">{order.pickup_address.name}</p>
                                        <p className="text-[10px] font-bold text-brand-navy/60 leading-relaxed uppercase tracking-wider">
                                            {order.pickup_address.address}, {order.pickup_address.city}, {order.pickup_address.pincode}
                                        </p>
                                        <p className="text-[9px] font-black text-secondary">{order.pickup_date} | {order.pickup_time_slot}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary flex items-center gap-2 italic">
                                        <Truck size={12} /> Deployment (B)
                                    </h4>
                                    <div className={cn(
                                        "space-y-2 p-4 border",
                                        order.is_delivery_different ? "bg-white border-secondary/20 shadow-sm" : "bg-brand-surface/50 border-brand-navy/5 opacity-60"
                                    )}>
                                        <p className="text-[11px] font-black uppercase tracking-widest">
                                            {order.is_delivery_different ? order.delivery_address.name : "Same as Retrieval"}
                                        </p>
                                        <p className="text-[10px] font-bold text-brand-navy/60 leading-relaxed uppercase tracking-wider">
                                            {order.is_delivery_different 
                                                ? `${order.delivery_address.address}, ${order.delivery_address.city}, ${order.delivery_address.pincode}`
                                                : "Mirror pickup coordinates"}
                                        </p>
                                        <p className="text-[9px] font-black text-secondary">Target: {order.delivery_date || "TBD"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Optics & Financials */}
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-navy/30 flex items-center gap-2">
                                        <Eye size={12} /> Optic Matrix
                                    </h4>
                                    <div className="space-y-2">
                                        <p className="text-[11px] font-black uppercase tracking-widest text-brand-navy">{order.lenses?.name}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {order.coating_ids?.map((id: string) => {
                                                const coating = allCoatings.find(c => c.id === id);
                                                return coating ? (
                                                    <span key={id} className="text-[8px] font-black uppercase tracking-widest text-secondary bg-secondary/5 px-2 py-0.5 border border-secondary/10">
                                                        {coating.name}
                                                    </span>
                                                ) : null;
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4 bg-brand-surface p-6 border border-brand-navy/5">
                                    <h4 className="text-[9px] font-black uppercase tracking-widest text-brand-navy/20">Authorized Settlement</h4>
                                    <p className="text-3xl font-serif italic text-brand-navy">₹{Number(order.total_price).toLocaleString()}</p>
                                    
                                    <div className="space-y-2 pt-4 border-t border-brand-navy/5">
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
                                            {order.payment_method === "cod" ? "Physical Settlement" : "Digital Settlement"}
                                            {order.payment_status === 'paid' && <CheckCircle2 size={10} className="text-emerald-500" />}
                                        </p>
                                        <p className={cn(
                                            "text-[8px] font-black uppercase tracking-tighter",
                                            order.payment_status === 'paid' ? "text-emerald-600" : "text-brand-navy/30"
                                        )}>
                                            Status: {order.payment_status?.toUpperCase()}
                                        </p>
                                        {order.razorpay_payment_id && (
                                            <p className="text-[8px] font-mono font-bold text-brand-navy/40 break-all">
                                                TXN: {order.razorpay_payment_id}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            ))}

            {orders.length === 0 && (
                <div className="py-32 text-center bg-white border border-brand-navy/5">
                    <AlertCircle size={48} className="mx-auto text-brand-navy/10 mb-6" />
                    <h3 className="text-xl font-serif italic text-brand-navy">No Active Protocols</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-brand-navy/30 mt-2">Laboratory is currently in standby mode.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
