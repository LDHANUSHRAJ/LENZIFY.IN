import { createClient } from "@/lib/supabase/server";
import { 
  Package, 
  MapPin, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Truck,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  User,
  Settings,
  XCircle,
  RefreshCcw
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default async function CustomerDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return <div className="py-20 text-center uppercase tracking-widest text-brand-navy/30">Unauthorized Access Protocol</div>;

  // Fetch complete order history for the user
  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*, products(*, product_images(*)))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="bg-surface text-brand-navy min-h-screen pt-24 font-sans">
      <main className="max-w-7xl mx-auto px-8 md:px-12 py-20 pb-32 space-y-20">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-10 border-b border-brand-navy/5 pb-12">
           <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-secondary italic leading-none">Identity Profile v4.2</p>
              <h1 className="text-5xl md:text-7xl font-serif italic tracking-tight text-brand-navy uppercase leading-none pr-10">
                 {user.user_metadata?.name || "Anonymous Agent"}
              </h1>
              <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-brand-navy/30 italic">Linked Channel: {user.email}</p>
           </div>
           <div className="flex gap-4">
              <Link href="/profile/edit" className="p-6 bg-white border border-brand-navy/5 hover:border-secondary transition-all">
                 <Settings size={20} className="text-brand-navy/30" />
              </Link>
           </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
           {/* Sidebar: Profile Summary */}
           <div className="space-y-12">
              <section className="bg-white border border-brand-navy/5 p-10 shadow-sm relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-1000">
                    <CheckCircle2 size={48} />
                 </div>
                 <div className="space-y-6">
                    <h3 className="text-lg font-serif italic text-brand-navy font-black tracking-tight uppercase">Vision Summary</h3>
                    <div className="space-y-4">
                       <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-brand-navy/30">
                          <span>Archive Count</span>
                          <span className="text-brand-navy font-black italic">{orders?.length || 0} Acquisitions</span>
                       </div>
                       <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-brand-navy/30">
                          <span>Elite Status</span>
                          <span className="text-secondary font-black italic">Platinum Nexus</span>
                       </div>
                    </div>
                 </div>
              </section>

              <section className="bg-brand-navy text-white p-10 shadow-2xl relative">
                  <div className="space-y-6">
                    <h3 className="text-lg font-serif italic text-secondary font-black tracking-tight uppercase">Clinical Records</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 leading-relaxed italic">
                      Your high-precision visionary data is encrypted and stored in our secure clinical vault.
                    </p>
                    <button className="w-full py-4 border border-white/10 text-[9px] font-black uppercase tracking-widest hover:border-secondary hover:text-secondary transition-all">View Health Matrix</button>
                  </div>
              </section>
           </div>

           {/* Main Content: Order History */}
           <div className="lg:col-span-2 space-y-12">
              <div className="flex justify-between items-baseline border-b border-brand-navy/5 pb-8">
                 <h2 className="text-3xl font-serif italic text-brand-navy uppercase">Acquisition <span className="text-secondary">Logs</span></h2>
                 <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-brand-navy/20">Archived Transactions</p>
              </div>

              <div className="space-y-8">
                 {orders?.map((order) => (
                    <div key={order.id} className="bg-white border border-brand-navy/5 overflow-hidden group hover:border-secondary/20 transition-all duration-700">
                       <div className="p-10 space-y-8">
                          <header className="flex justify-between items-start">
                             <div className="space-y-2">
                                <p className="text-[9px] font-black uppercase tracking-widest text-brand-navy/20">Protocol #{order.id.slice(0, 8)}</p>
                                <p className="text-xs font-bold text-brand-navy uppercase tracking-widest italic">{new Date(order.created_at).toLocaleDateString()}</p>
                             </div>
                             <div className={cn(
                                "text-[9px] font-black uppercase tracking-widest px-4 py-2 border italic",
                                order.status === 'delivered' ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/20" : 
                                order.status === 'shipped' ? "bg-blue-500/5 text-blue-500 border-blue-500/20" :
                                "bg-brand-navy/5 text-brand-navy/30 border-brand-navy/5"
                             )}>
                                {order.status}
                             </div>
                          </header>

                          <div className="space-y-6">
                             {order.order_items.map((item: any) => (
                                <div key={item.id} className="flex gap-6 items-center">
                                   <div className="w-16 h-16 bg-brand-background border border-brand-navy/5 p-2 overflow-hidden flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-700">
                                      <img src={item.products?.product_images?.[0]?.image_url || "/placeholder.jpg"} className="w-full h-full object-contain mix-blend-multiply" />
                                   </div>
                                   <div className="flex-1 space-y-1 pr-6">
                                      <p className="text-[10px] font-black uppercase tracking-widest text-brand-navy">{item.products?.name}</p>
                                      <p className="text-[9px] font-bold text-brand-navy/30 uppercase tracking-widest italic">Unit Quantity: {item.quantity}</p>
                                   </div>
                                   <p className="text-sm font-serif italic text-brand-navy font-black tracking-tight">₹{item.price.toLocaleString()}</p>
                                </div>
                             ))}
                          </div>

                          <footer className="pt-8 border-t border-brand-navy/5 flex justify-between items-center">
                             <div className="flex gap-6">
                                <button className="text-[9px] font-black uppercase tracking-widest text-brand-navy/30 hover:text-brand-navy transition-all flex items-center gap-2 italic">
                                   <RefreshCcw size={12} /> Request Return
                                </button>
                                <button className="text-[9px] font-black uppercase tracking-widest text-brand-navy/30 hover:text-brand-navy transition-all flex items-center gap-2 italic">
                                   <ExternalLink size={12} /> Download Report
                                </button>
                             </div>
                             <p className="text-xl font-serif italic text-brand-navy font-black pr-2">₹{order.total_price.toLocaleString()}</p>
                          </footer>
                       </div>
                    </div>
                 ))}

                 {(!orders || orders.length === 0) && (
                    <div className="py-32 text-center bg-brand-background/30 border border-dashed border-brand-navy/10 rounded-xl">
                       <Package size={64} className="mx-auto text-brand-navy/10 mb-8" />
                       <h3 className="text-xl font-serif italic text-brand-navy/40 uppercase tracking-widest leading-none">Vault Empty</h3>
                       <p className="text-[9px] font-black uppercase tracking-[0.4em] text-brand-navy/20 mt-4 leading-none">No transactions registered in this identity profile.</p>
                       <Link href="/products" className="inline-block mt-12 text-[10px] font-black uppercase tracking-[0.4em] border-b-2 border-secondary pb-1 hover:text-secondary transition-all">Initiate Acquisition</Link>
                    </div>
                 )}
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
