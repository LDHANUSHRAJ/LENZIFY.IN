"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-8 text-center">
      <div className="space-y-8 max-w-md">
        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.6em] text-secondary italic">
            System Interruption
          </p>
          <h1 className="text-5xl font-serif italic tracking-tight text-primary leading-none">
            Something went <span className="text-secondary">wrong</span>
          </h1>
          <p className="text-sm text-on-surface/50 leading-relaxed">
            We encountered an unexpected error. Please try again or contact our support team if the issue persists.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-8 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-secondary hover:text-primary transition-all"
          >
            Try Again
          </button>
          <a
            href="/"
            className="px-8 py-4 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] hover:bg-primary/5 transition-all"
          >
            Return Home
          </a>
        </div>
      </div>
    </div>
  );
}
