import { createClient } from "@/lib/supabase/server";
import { 
  Bell, 
  ShoppingCart, 
  AlertTriangle, 
  Star, 
  ArrowLeftRight, 
  UserPlus,
  CheckCircle2,
  Clock,
  Trash2,
  Filter
} from "lucide-react";
import { markNotificationRead } from "@/lib/db/admin_actions";
import { cn } from "@/lib/utils";

export default async function AdminNotificationsPage() {
  const supabase = await createClient();


  // Load notifications (joining with potential admin info)
  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false });

  const getIcon = (type: string) => {
    switch (type) {
      case 'New Order': return <ShoppingCart size={16} className="text-secondary" />;
      case 'Low Stock': return <AlertTriangle size={16} className="text-red-500" />;
      case 'New Review': return <Star size={16} className="text-yellow-500" />;
      case 'Return Request': return <ArrowLeftRight size={16} className="text-blue-500" />;
      case 'New Customer': return <UserPlus size={16} className="text-emerald-500" />;
      default: return <Bell size={16} className="text-brand-navy/30" />;
    }
  };

  return (
    <div className="space-y-12">
      <header className="flex items-center justify-between border-b border-brand-navy/5 pb-10">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary italic mb-2">Protocol Alerts</p>
          <h1 className="text-4xl font-serif italic text-brand-navy tracking-tight uppercase">Intelligence <span className="text-secondary">Hub</span></h1>
          <p className="text-[9px] uppercase font-bold tracking-[0.3em] text-brand-text-muted mt-3 italic">Active Interrupts: {notifications?.filter(n => !n.read).length || 0}</p>
        </div>
      </header>

      <div className="max-w-4xl space-y-4">
        {notifications?.map((notif) => (
          <div 
            key={notif.id} 
            className={cn(
              "p-8 border transition-all duration-500 relative group",
              notif.read ? "bg-white border-brand-navy/5 opacity-60" : "bg-white border-secondary/20 shadow-lg ring-1 ring-secondary/5"
            )}
          >
             {!notif.read && <div className="absolute top-0 left-0 w-1 h-full bg-secondary shadow-[0_0_10px_rgba(var(--brand-gold-rgb),0.5)]"></div>}
             
             <div className="flex gap-8">
                <div className="w-12 h-12 bg-brand-background border border-brand-navy/5 flex items-center justify-center p-2">
                   {getIcon(notif.type)}
                </div>
                <div className="flex-1 space-y-2">
                   <div className="flex justify-between items-start">
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-navy italic">{notif.type}</p>
                      <span className="text-[8px] font-bold uppercase tracking-widest text-brand-navy/20">{new Date(notif.created_at).toLocaleString()}</span>
                   </div>
                   <p className="text-xs font-serif italic text-brand-navy leading-relaxed">{notif.message}</p>
                   
                   <div className="pt-6 flex items-center justify-between">
                      {!notif.read ? (
                        <form action={async () => {
                            "use server";
                            await markNotificationRead(notif.id);
                        }}>
                           <button className="text-[9px] font-bold uppercase tracking-widest text-secondary hover:text-brand-navy transition-all flex items-center gap-2 italic">
                              <CheckCircle2 size={12} /> Acknowledge Alert
                           </button>
                        </form>
                      ) : (
                        <span className="text-[9px] font-bold uppercase tracking-widest text-brand-navy/20 flex items-center gap-2 italic">
                           <Clock size={12} /> Resolved
                        </span>
                      )}
                      
                      <button className="text-brand-navy/10 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                         <Trash2 size={14} />
                      </button>
                   </div>
                </div>
             </div>
          </div>
        ))}

        {(!notifications || notifications.length === 0) && (
          <div className="py-32 text-center bg-white border border-brand-navy/5 relative overflow-hidden">
             <Bell size={64} className="mx-auto text-brand-navy/[0.05] mb-8" />
             <h3 className="text-2xl font-serif italic text-brand-navy tracking-widest">Aether Quiet</h3>
             <p className="text-[10px] text-brand-navy/20 uppercase tracking-[0.4em] font-bold mt-4">No critical interrupts detected at this timestamp</p>
          </div>
        )}
      </div>
    </div>
  );
}
