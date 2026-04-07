import { createClient } from "@/lib/supabase/server";
import { 
  CheckCircle2, 
  Package, 
  ArrowRight, 
  ChevronRight, 
  ShoppingBag,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function OrderSuccessPage({ searchParams }: { searchParams: Promise<{ id: string }> }) {
  const { id } = await searchParams;
  const supabase = await createClient();

  // Fetch Order details for summary
  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*, products(*, product_images(*)))")
    .eq("id", id)
    .single();

  return (
    <div className="bg-surface text-brand-navy min-h-screen pt-24 font-sans">
      <main className="max-w-4xl mx-auto px-8 py-20 text-center space-y-12">
        <motion_div_wrap initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-8">
           <div className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-[0_0_50px_rgba(16,185,129,0.4)]">
              <CheckCircle2 size={48} />
           </div>
           <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500 italic">Protocol Finalized</p>
              <h1 className="text-6xl font-serif italic tracking-tight text-brand-navy uppercase">Vision <span className="text-secondary">Acquired</span></h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-navy/30">Protocol ID: #{id?.slice(0, 8)}</p>
           </div>
        </motion_div_wrap>

        <section className="bg-white border border-brand-navy/5 p-12 shadow-2xl space-y-10 text-left">
           <div className="flex justify-between items-center border-b border-brand-navy/5 pb-8">
              <h2 className="text-xl font-serif italic text-brand-navy">Archival Summary</h2>
              <Link href="/dashboard/orders" className="text-[10px] font-black uppercase tracking-widest text-secondary hover:text-brand-navy transition-all flex items-center gap-2 italic">
                 Track Dispatch <ExternalLink size={12} />
              </Link>
           </div>
           
           <div className="space-y-8">
              {order?.order_items.map((item: any) => (
                <div key={item.id} className="flex gap-8 group">
                   <div className="w-20 h-20 bg-brand-background border border-brand-navy/5 p-3 overflow-hidden flex items-center justify-center grayscale group-hover:grayscale-0 transition-all">
                      <img 
                        src={item.products?.product_images?.[0]?.image_url || "/placeholder.jpg"} 
                        alt={item.products?.name} 
                        className="w-full h-full object-contain mix-blend-multiply" 
                      />
                   </div>
                   <div className="flex-1 space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40 italic">{item.products?.brand}</p>
                      <h3 className="text-sm font-serif italic text-brand-navy font-black tracking-tight">{item.products?.name}</h3>
                      <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-brand-navy/20">
                         <span>Units: {item.quantity}</span>
                         <span>₹{item.price.toLocaleString()}</span>
                      </div>
                   </div>
                </div>
              ))}
           </div>

           <div className="pt-10 border-t border-brand-navy/10 flex justify-between items-baseline">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-navy/20">Protocol Value</span>
              <span className="text-4xl font-serif italic text-brand-navy font-black">₹{order?.total_price.toLocaleString()}</span>
           </div>
        </section>

        <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
           <Link href="/products" className="px-16 py-6 bg-brand-navy text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-secondary transition-all duration-700 flex items-center justify-center gap-4">
              Explore Archive
              <ShoppingBag size={14} />
           </Link>
           <Link href="/" className="px-16 py-6 border border-brand-navy/10 text-[10px] font-black uppercase tracking-[0.4em] hover:border-brand-navy transition-all flex items-center justify-center gap-4">
              Return to Nexus
           </Link>
        </div>

        <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-brand-navy/10 italic">
          A confirmation report has been dispatched to your encrypted communication hub.
        </p>
      </main>
    </div>
  );
}

// Simple wrapper since Framer Motion was giving issues in RSC directly
function motion_div_wrap({ children, initial, animate, className }: any) {
  return (
    <div className={className}>
       {children}
    </div>
  );
}
