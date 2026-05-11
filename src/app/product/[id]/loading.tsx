export default function Loading() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-8">
      <div className="relative">
        <div className="w-16 h-16 border-2 border-brand-navy/5 rounded-full" />
        <div className="w-16 h-16 border-2 border-t-secondary rounded-full animate-spin absolute inset-0" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-navy/20 animate-pulse italic">
        Loading Product Details...
      </p>
    </div>
  );
}
