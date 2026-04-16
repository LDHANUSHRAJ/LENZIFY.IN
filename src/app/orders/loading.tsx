export default function OrdersLoading() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center pt-32 pb-24 font-sans">
      <div className="w-16 h-16 border-4 border-brand-navy/10 border-t-secondary rounded-full animate-spin mb-8"></div>
      <h2 className="text-2xl font-serif italic text-brand-navy mb-2">Decrypting Archive...</h2>
      <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-brand-navy/30 italic">Establishing secure connection to logistics network</p>
    </div>
  );
}
