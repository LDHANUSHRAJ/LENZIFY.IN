import { createClient } from "@/lib/supabase/server";
import { Package, Clock, ShoppingBag, Truck, CheckCircle2, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return <div className="py-20 text-center uppercase tracking-widest text-brand-navy/30">Unauthorized Access Protocol</div>;

  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*, products(*, product_images(*)))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="bg-surface text-brand-navy min-h-screen pt-24 font-sans">
      <main className="max-w-7xl mx-auto px-8 md:px-12 py-20 pb-32 space-y-16">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-10 border-b border-brand-navy/5 pb-12">
            <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-serif italic tracking-tight text-brand-navy uppercase leading-none">Acquisition <span className="text-secondary">History</span></h1>
                <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-brand-navy/30 italic">Registry of all Visionary Deployments</p>
            </div>
            <Link href="/products" className="px-10 py-5 bg-brand-navy text-white text-[9px] font-black uppercase tracking-[0.4em] hover:bg-secondary transition-all shadow-xl">New Acquisition</Link>
        </header>

        <div className="space-y-12">
           {orders && orders.length > 0 ? (
             <div className="grid grid-cols-1 gap-10">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white border border-brand-navy/5 overflow-hidden group hover:border-secondary/20 transition-all duration-700">
                    <div className="p-10 lg:p-14 space-y-10">
                       <div className="flex flex-col md:flex-row justify-between gap-8 items-start md:items-center">
                          <div className="flex gap-12 items-center">
                             <div className="space-y-1">
                                <p className="text-[9px] font-black uppercase tracking-widest text-brand-navy/20">Protocol Hash</p>
                                <p className="text-xs font-black text-brand-navy uppercase tracking-widest italic">#{order.id.slice(0, 12)}</p>
                             </div>
                             <div className="space-y-1">
                                <p className="text-[9px] font-black uppercase tracking-widest text-brand-navy/20">Timestamp</p>
                                <p className="text-xs font-bold text-brand-navy uppercase tracking-widest italic">{new Date(order.created_at).toLocaleDateString()}</p>
                             </div>
                          </div>
                          
                          <div className={cn(
                            "flex items-center gap-3 px-6 py-3 border text-[9px] font-black uppercase tracking-[0.3em] italic",
                            order.status === 'delivered' ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/20" : 
                            "bg-brand-navy/5 text-brand-navy/30 border-brand-navy/5"
                          )}>
                             <span className={cn("w-1.5 h-1.5 rounded-full", order.status === 'delivered' ? "bg-emerald-500 animate-pulse" : "bg-brand-navy/20")}></span>
                             {order.status}
                          </div>
                       </div>

                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-4">
                          <div className="space-y-6">
                             {order.order_items.map((item: any) => (
                                <div key={item.id} className="flex gap-6 items-center">
                                   <div className="w-20 h-20 bg-brand-background border border-brand-navy/5 p-4 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-1000">
                                      <img src={item.products?.product_images?.[0]?.image_url || "/placeholder.jpg"} className="w-full h-full object-contain mix-blend-multiply" />
                                   </div>
                                   <div className="flex-1 space-y-1">
                                      <p className="text-xs font-black uppercase tracking-widest text-brand-navy">{item.products?.name}</p>
                                      <p className="text-[9px] font-bold text-secondary uppercase tracking-[0.2em] italic">Quantity: {item.quantity}</p>
                                   </div>
                                   <p className="text-sm font-serif italic text-brand-navy font-black tracking-tight">₹{item.price.toLocaleString()}</p>
                                </div>
                             ))}
                          </div>

                          <div className="bg-brand-background/50 border border-brand-navy/5 p-10 space-y-8 flex flex-col justify-center">
                             <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-brand-navy/30 italic">
                                <span>Logistic Routing</span>
                                <span className="text-brand-navy">{order.shipping_address || 'Archive Standard'}</span>
                             </div>
                             <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-brand-navy/30 italic">
                                <span>Financial Settlement</span>
                                <span className="text-brand-navy">{order.payment_method || 'Razorpay Protocol'}</span>
                             </div>
                             <div className="pt-6 border-t border-brand-navy/5 flex justify-between items-center">
                                <span className="text-sm font-serif italic text-brand-navy uppercase font-black">Total Acquisition Cost</span>
                                <span className="text-2xl font-serif italic text-brand-navy font-black">₹{order.total_price.toLocaleString()}</span>
                             </div>
                          </div>
                       </div>

                       <div className="flex justify-start gap-10 pt-4">
                          <button className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-secondary hover:text-brand-navy transition-all">
                             <Clock size={14} /> Track Timeline
                          </button>
                          <button className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-brand-navy/30 hover:text-brand-navy transition-all">
                             <RefreshCcw size={14} /> Request Support
                          </button>
                       </div>
                    </div>
                  </div>
                ))}
             </div>
           ) : (
             <div className="py-40 text-center space-y-12">
                <div className="w-32 h-32 bg-brand-background border border-brand-navy/5 rounded-full flex items-center justify-center mx-auto relative overflow-hidden group">
                   <Package size={48} className="text-brand-navy/10 relative z-10 group-hover:scale-125 transition-transform duration-1000" />
                   <div className="absolute inset-0 bg-secondary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
                </div>
                <div className="space-y-4">
                   <h3 className="text-2xl font-serif italic text-brand-navy/40 uppercase tracking-widest">Archive History Empty</h3>
                   <p className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-navy/20 italic">No acquisitions found in the persistent data matrix.</p>
                </div>
                <Link href="/products" className="inline-block border-b-2 border-secondary pb-1 text-[10px] font-black uppercase tracking-[0.5em] text-brand-navy hover:text-secondary transition-colors">Start Archive Acquisition</Link>
             </div>
           )}
        </div>
      </main>
    </div>
  );
}
