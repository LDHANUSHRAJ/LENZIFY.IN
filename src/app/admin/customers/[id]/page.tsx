import { createClient } from "@/lib/supabase/server";
import { User, Mail, Phone, Calendar, MapPin, Package, AlertTriangle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CustomerProfilePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: user, error } = await supabase
    .from("users")
    .select("*, addresses(*), orders(*)")
    .eq("id", id)
    .single();

  if (error || !user) notFound();

  const totalSpent = user.orders?.reduce((sum: number, o: any) => sum + Number(o.total_price || 0), 0) || 0;
  // Sort orders by latest
  const orders = user.orders?.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) || [];

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-brand-navy/5">
        <div className="flex gap-8 items-end">
           <div className="w-24 h-24 bg-brand-background border border-brand-navy/5 flex items-center justify-center shrink-0 shadow-sm relative">
              <User size={32} className="text-secondary" />
              {user.is_blocked && (
                 <div className="absolute -bottom-2 -right-2 bg-red-500 text-white p-1 rounded-full border border-white">
                    <AlertTriangle size={12} />
                 </div>
              )}
           </div>
           <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary flex items-center gap-2 italic mb-2">
                 Profile Diagnostics
              </p>
              <h1 className="text-4xl font-serif italic text-brand-navy tracking-tight">{user.name || "UNNAMED ENTITY"}</h1>
              <div className="flex gap-4 mt-3">
                 <span className="text-[9px] uppercase font-bold tracking-[0.3em] bg-brand-background text-brand-navy/60 px-3 py-1 border border-brand-navy/5">ID: {user.id.split('-')[0]}</span>
                 <span className="text-[9px] uppercase font-bold tracking-[0.3em] bg-green-50 text-green-600 px-3 py-1 flex items-center gap-1 border border-green-100"><ShieldCheck size={10}/> {user.role || "Customer"}</span>
              </div>
           </div>
        </div>
        <div className="text-right">
           <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-brand-navy/30 italic">Lifetime Capital</p>
           <p className="text-3xl font-serif text-secondary mt-1 tracking-tighter">₹{totalSpent.toLocaleString()}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-4 space-y-8">
            <section className="bg-white border border-brand-navy/5 p-8 shadow-sm">
               <h3 className="text-[9px] font-bold text-brand-navy/30 uppercase tracking-[0.3em] border-b border-brand-navy/5 pb-4 mb-6">Contact Matrix</h3>
               <div className="space-y-4">
                  <div className="flex items-center gap-4 text-brand-navy">
                     <Mail size={16} className="text-secondary opacity-50" />
                     <span className="text-[11px] font-bold uppercase tracking-wider">{user.email || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-4 text-brand-navy">
                     <Phone size={16} className="text-secondary opacity-50" />
                     <span className="text-[11px] font-bold uppercase tracking-wider">{user.phone || "No Relay Registered"}</span>
                  </div>
                  <div className="flex items-center gap-4 text-brand-navy">
                     <Calendar size={16} className="text-secondary opacity-50" />
                     <span className="text-[11px] font-bold uppercase tracking-wider">Joined: {new Date(user.created_at).toLocaleDateString()}</span>
                  </div>
               </div>
            </section>

            <section className="bg-white border border-brand-navy/5 p-8 shadow-sm">
               <h3 className="text-[9px] font-bold text-brand-navy/30 uppercase tracking-[0.3em] border-b border-brand-navy/5 pb-4 mb-6 flex items-center gap-2">
                  <MapPin size={12}/> Physical Trajectories ({user.addresses?.length || 0})
               </h3>
               <div className="space-y-4">
                  {user.addresses?.length === 0 && (
                     <p className="text-[10px] uppercase font-bold tracking-widest text-brand-navy/30 italic">No nodes established.</p>
                  )}
                  {user.addresses?.map((addr: any) => (
                     <div key={addr.id} className="p-4 bg-brand-background border border-brand-navy/5 hover:border-secondary/20 transition-colors cursor-default">
                        <p className="text-[11px] font-bold uppercase text-brand-navy tracking-wider mb-2">{addr.name} — {addr.phone}</p>
                        <p className="text-[10px] font-mono text-brand-navy/60 leading-relaxed uppercase">{addr.address}, {addr.city}</p>
                        <p className="text-[10px] font-mono text-brand-navy/60 line-clamp-1 uppercase mt-1">{addr.state} - {addr.pincode}</p>
                     </div>
                  ))}
               </div>
            </section>
         </div>

         <div className="lg:col-span-8 space-y-8">
            <section className="bg-white border border-brand-navy/5 p-8 shadow-sm">
               <h3 className="text-[9px] font-bold text-brand-navy/30 uppercase tracking-[0.3em] border-b border-brand-navy/5 pb-4 mb-6 flex items-center gap-2">
                  <Package size={14}/> Operational History ({orders.length})
               </h3>
               <div className="space-y-4">
                  {orders.length === 0 && (
                     <div className="py-20 text-center relative overflow-hidden bg-brand-background">
                        <Package size={32} className="mx-auto text-brand-navy/10 mb-4" />
                        <h3 className="text-xl font-serif italic text-brand-navy uppercase tracking-widest relative">No Transactions</h3>
                     </div>
                  )}
                  {orders.map((order: any) => (
                     <div key={order.id} className="flex justify-between items-center p-6 bg-brand-background border border-brand-navy/5 group hover:border-secondary transition-colors">
                        <div>
                           <p className="text-[11px] font-bold uppercase tracking-wider text-brand-navy mb-1">TX: {order.id.split('-')[0]}</p>
                           <p className="text-[9px] font-mono uppercase tracking-widest text-brand-navy/40">Registered: {new Date(order.created_at).toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-sm font-serif italic text-secondary font-bold mb-1">₹{order.total_price.toLocaleString()}</p>
                           <span className={cn(
                              "text-[8px] font-black uppercase tracking-widest px-2 py-1",
                              order.status === 'delivered' ? "bg-emerald-50 text-emerald-600" :
                              order.status === 'confirmed' ? "bg-blue-50 text-blue-600" :
                              "bg-amber-50 text-amber-600"
                           )}>{order.status}</span>
                        </div>
                     </div>
                  ))}
               </div>
            </section>
         </div>
      </div>
    </div>
  );
}
