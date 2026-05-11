"use client";

import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
      <div className="space-y-4">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-red-400 italic">
          System Error
        </p>
        <h2 className="text-3xl font-serif italic text-brand-navy tracking-tight">
          Something went wrong
        </h2>
        <p className="text-xs text-brand-navy/40 max-w-sm">
          An error occurred in the admin panel. This has been logged for review.
        </p>
      </div>
      <button
        onClick={reset}
        className="px-8 py-4 bg-brand-navy text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-secondary hover:text-brand-navy transition-all"
      >
        Try Again
      </button>
    </div>
  );
}
