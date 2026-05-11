import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-8 text-center">
      <div className="space-y-8 max-w-md">
        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.6em] text-secondary italic">
            Error 404
          </p>
          <h1 className="text-7xl font-serif italic tracking-tight text-primary leading-none">
            Page Not <span className="text-secondary">Found</span>
          </h1>
          <p className="text-sm text-on-surface/50 leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved. Let us help you find what you need.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/products"
            className="px-8 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-secondary hover:text-primary transition-all"
          >
            Browse Products
          </Link>
          <Link
            href="/"
            className="px-8 py-4 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] hover:bg-primary/5 transition-all"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
