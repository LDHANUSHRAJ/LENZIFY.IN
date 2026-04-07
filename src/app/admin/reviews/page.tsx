import { createClient } from "@/lib/supabase/server";
import { MessageSquare, Star, MessageCircle, CheckCircle, Trash2, XCircle, Search } from "lucide-react";
import { updateReviewStatus, deleteReview } from "./actions";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params?.q || "";
  const supabase = await createClient();

  const { data: reviews, error } = await supabase
    .from("reviews")
    .select("*, users(name, email), products(name, primary_image:product_images(image_url))")
    .order("created_at", { ascending: false });

  // For product images array, taking the first one
  const mappedReviews = reviews?.map(r => ({
    ...r,
    product_image: r.products?.primary_image?.[0]?.image_url || null
  })) || [];

  const filteredReviews = query ? mappedReviews.filter(r => 
    r.review.toLowerCase().includes(query.toLowerCase()) || 
    r.users?.name?.toLowerCase().includes(query.toLowerCase())
  ) : mappedReviews;

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-brand-navy/5">
        <div>
           <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary italic mb-2">Public Sentiment</p>
          <h1 className="text-4xl font-serif italic text-brand-navy tracking-tight uppercase">Reviews <span className="text-secondary">Matrix</span></h1>
          <div className="flex gap-4 mt-4">
             <span className="text-[9px] uppercase font-bold tracking-[0.3em] bg-brand-background text-brand-navy/60 px-3 py-1">Pending: {mappedReviews.filter(r => r.status === 'pending').length}</span>
             <span className="text-[9px] uppercase font-bold tracking-[0.3em] bg-emerald-50 text-emerald-600 px-3 py-1">Approved: {mappedReviews.filter(r => r.status === 'approved').length}</span>
          </div>
        </div>
      </header>

      {/* Control Bar */}
      <div className="bg-white border border-brand-navy/5 p-8 shadow-sm">
        <form className="relative w-full lg:w-[500px] group">
          <Search size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-navy/30 group-focus-within:text-secondary transition-colors" />
          <input 
            name="q"
            defaultValue={query}
            placeholder="SEARCH FEEDBACK OR AUTHOR..."
            className="w-full bg-brand-background border border-brand-navy/5 pl-16 pr-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] outline-none focus:border-secondary transition-all"
          />
        </form>
      </div>

      <div className="space-y-6">
         {filteredReviews.map((r) => (
            <div key={r.id} className="bg-white border border-brand-navy/5 shadow-sm p-8 flex flex-col lg:flex-row gap-8 group hover:border-secondary transition-all">
               {/* Product Ref */}
               <div className="w-full lg:w-48 shrink-0 flex items-center gap-4">
                  <div className="w-16 h-16 bg-brand-background border border-brand-navy/5 shrink-0 relative">
                     {r.product_image ? (
                        <Image src={r.product_image} alt="Product" fill className="object-cover" />
                     ) : (
                        <Star size={16} className="text-brand-navy/20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                     )}
                  </div>
                  <div>
                     <p className="text-[9px] font-bold uppercase tracking-widest text-brand-navy/40 mb-1">Target Node</p>
                     <p className="text-[10px] font-serif font-bold text-brand-navy line-clamp-2 leading-relaxed">{r.products?.name}</p>
                  </div>
               </div>

               {/* Review Payload */}
               <div className="flex-1 py-4 lg:py-0 lg:px-8 border-y lg:border-y-0 lg:border-x border-brand-navy/5">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <p className="text-[12px] font-bold uppercase tracking-widest text-brand-navy mb-1">{r.users?.name || "Anonymous Author"}</p>
                        <p className="text-[9px] font-mono text-brand-navy/40 uppercase">{new Date(r.created_at).toLocaleString()}</p>
                     </div>
                     <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                           <Star key={s} size={14} className={s <= r.rating ? "fill-secondary text-secondary" : "fill-brand-background text-brand-navy/10"} />
                        ))}
                     </div>
                  </div>
                  <p className="text-sm font-serif italic leading-relaxed text-brand-navy/80">"{r.review}"</p>
               </div>

               {/* Authorization Controls */}
               <div className="lg:w-48 shrink-0 flex flex-col justify-center gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-brand-navy/5">
                  <div className="flex items-center gap-2 mb-2">
                     <span className={cn(
                        "text-[8px] font-black uppercase tracking-[0.2em] px-2 py-1",
                        r.status === 'approved' ? "bg-emerald-50 text-emerald-600" : "bg-brand-background text-brand-navy/60"
                     )}>
                        STATUS: {r.status}
                     </span>
                  </div>
                  <div className="flex gap-2">
                     {r.status === 'pending' ? (
                       <>
                         <form action={async () => { "use server"; await updateReviewStatus(r.id, 'approved'); }} className="flex-1">
                            <button className="w-full py-3 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white border border-emerald-100 text-[9px] font-bold uppercase tracking-widest transition-all">APPROVE</button>
                         </form>
                         <form action={async () => { "use server"; await deleteReview(r.id); }} className="flex-1">
                            <button className="w-full py-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-100 text-[9px] font-bold uppercase tracking-widest transition-all">REJECT</button>
                         </form>
                       </>
                     ) : (
                       <form action={async () => { "use server"; await updateReviewStatus(r.id, 'pending'); }} className="w-full">
                          <button className="w-full py-3 bg-brand-background text-brand-navy/60 hover:bg-brand-navy hover:text-white border border-brand-navy/10 text-[9px] font-bold uppercase tracking-widest transition-all">REVOKE</button>
                       </form>
                     )}
                  </div>
               </div>
            </div>
         ))}
         
         {filteredReviews.length === 0 && (
            <div className="py-32 text-center bg-white border border-brand-navy/5 shadow-sm">
               <MessageSquare size={48} className="mx-auto text-brand-navy/[0.05] mb-6" />
               <h3 className="text-xl font-serif italic text-brand-navy uppercase tracking-widest">No Sentiments Detected</h3>
            </div>
         )}
      </div>
    </div>
  );
}
