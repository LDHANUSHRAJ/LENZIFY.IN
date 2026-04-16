import { createClient } from "@/lib/supabase/server";
import { Package, Truck, CheckCircle2, ChevronRight, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // Try to find in orders first
  const { data: standardOrder } = await supabase
    .from("orders")
    .select("*, order_items(*, products(*)), order_tracking(*)")
    .eq("id", id)
    .single();

  // If not, try lens_replacement_orders
  let order = standardOrder;
  let isReplacement = false;

  if (!order) {
     const { data: replacementOrder } = await supabase
       .from("lens_replacement_orders")
       .select("*, order_tracking(*)")
       .eq("id", id)
       .single();
     if(replacementOrder) {
        order = replacementOrder;
        isReplacement = true;
     }
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center font-sans">
        <div className="text-center space-y-6">
           <AlertCircle size={48} className="mx-auto text-brand-navy/20" />
           <h1 className="text-2xl font-serif italic text-brand-navy">Trace Hash Not Found</h1>
           <p className="text-[10px] uppercase font-bold tracking-widest text-brand-navy/40">The requested protocol identifier is invalid or encrypted.</p>
           <Link href="/orders" className="inline-block mt-8 text-[10px] font-bold uppercase tracking-widest border-b border-brand-navy pb-1">Return to Logs</Link>
        </div>
      </div>
    );
  }

  const steps = [
    { key: "pending", label: isReplacement ? "Setup Initiated" : "Order Placed", date: order.created_at },
    { key: "confirmed", label: isReplacement ? "Diagnostic Confirm" : "Confirmed", date: order.order_tracking?.find((t: any) => t.status === "confirmed")?.created_at },
    { key: "processing", label: "In Lab Processing", date: order.order_tracking?.find((t: any) => t.status === "processing")?.created_at },
    { key: "shipped", label: "Dispatched", date: order.order_tracking?.find((t: any) => t.status === "shipped")?.created_at },
    { key: "delivered", label: "Delivered", date: order.order_tracking?.find((t: any) => t.status === "delivered")?.created_at },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === order.status);
  const activeStep = currentStepIndex !== -1 ? currentStepIndex : 0;

  return (
    <div className="min-h-screen bg-surface pt-32 pb-24 font-sans text-brand-navy">
      <div className="max-w-4xl mx-auto px-6 space-y-16">
         {/* HEADER */}
         <div className="space-y-4 text-center">
            <h1 className="text-4xl md:text-6xl font-serif italic tracking-tight uppercase">Trace <span className="text-secondary">Matrix</span></h1>
            <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-brand-navy/40 italic">Live Tracking Protocol #{order.id.slice(0,8)}</p>
         </div>

         {/* TIMELINE */}
         <div className="bg-white border border-brand-navy/5 p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl mix-blend-multiply"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-12 md:gap-4">
               {steps.map((step, i) => {
                  const isCompleted = i <= activeStep;
                  const isCurrent = i === activeStep;
                  return (
                     <div key={step.key} className="flex-1 relative w-full md:w-auto">
                        {/* Connecting Line */}
                        {i < steps.length - 1 && (
                           <div className="hidden md:block absolute top-[15px] left-[50%] w-full h-[1px] bg-brand-navy/5">
                              <div className={cn("h-full bg-secondary transition-all duration-1000", isCompleted ? "w-full" : "w-0")} />
                           </div>
                        )}
                        
                        <div className="flex md:flex-col items-center gap-6 md:gap-4 position-relative z-10 text-left md:text-center">
                           <div className={cn(
                             "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500",
                             isCurrent ? "border-secondary bg-white text-secondary shadow-[0_0_20px_rgba(var(--brand-gold-rgb),0.3)] scale-125" : 
                             isCompleted ? "border-secondary bg-secondary text-white" : "border-brand-navy/10 bg-brand-background text-transparent"
                           )}>
                              {isCompleted && !isCurrent ? <CheckCircle2 size={14} /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                           </div>
                           
                           <div>
                              <p className={cn("text-[9px] font-black uppercase tracking-[0.2em] mb-1", isCompleted ? "text-brand-navy" : "text-brand-navy/30")}>
                                 {step.label}
                              </p>
                              {step.date && (
                                 <p className="text-[8px] font-bold uppercase tracking-widest text-brand-navy/40 italic">
                                    {new Date(step.date).toLocaleDateString()}
                                 </p>
                              )}
                           </div>
                        </div>
                     </div>
                  )
               })}
            </div>
         </div>

         {/* TRACKING DETAILS */}
         {order.order_tracking?.length > 0 && (
            <div className="bg-white border border-brand-navy/5 p-12">
               <h3 className="text-sm font-bold uppercase tracking-[0.3em] italic mb-8 border-b border-brand-navy/5 pb-4">Logistics Nodes</h3>
               <div className="space-y-6">
                  {order.order_tracking.map((track: any) => (
                     <div key={track.id} className="flex gap-6 items-start">
                        <div className="w-12 h-12 bg-brand-background flex items-center justify-center border border-brand-navy/5 text-secondary">
                           <Truck size={16} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-brand-navy mb-1">{track.checkpoint_location}</p>
                           <p className="text-[9px] font-bold text-brand-navy/40 uppercase tracking-widest italic">{new Date(track.created_at).toLocaleString()}</p>
                           {track.status_description && (
                              <p className="text-[11px] font-medium text-brand-navy/60 mt-2">{track.status_description}</p>
                           )}
                        </div>
                     </div>
                  ))}
               </div>
               
               <div className="mt-10 p-6 bg-brand-background border border-brand-navy/5 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                     <p className="text-[9px] font-black uppercase tracking-widest text-brand-navy/40 mb-1">Assigned Carrier</p>
                     <p className="text-[11px] font-bold text-brand-navy uppercase tracking-widest">{order.order_tracking[order.order_tracking.length - 1]?.courier_name || 'Standard Network'}</p>
                  </div>
                  <div className="text-right">
                     <p className="text-[9px] font-black uppercase tracking-widest text-brand-navy/40 mb-1">Transit ID</p>
                     <p className="text-[12px] font-mono font-black text-brand-navy tracking-tight">{order.order_tracking[order.order_tracking.length - 1]?.tracking_id || 'N/A'}</p>
                  </div>
               </div>
            </div>
         )}
         
         <div className="text-center">
            <Link href="/orders" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-navy/50 hover:text-brand-navy transition-colors">
               <ChevronRight size={14} className="rotate-180" /> Return to Archives
            </Link>
         </div>
      </div>
    </div>
  );
}
