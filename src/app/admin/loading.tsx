export default function AdminLoading() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center min-h-[500px]">
      <div className="w-16 h-16 border-4 border-brand-navy/10 border-t-secondary rounded-full animate-spin mb-4"></div>
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-navy/30 animate-pulse italic">
        Loading Command Data...
      </p>
    </div>
  );
}
