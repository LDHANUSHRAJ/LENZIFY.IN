"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfileRedirect() {
    const router = useRouter();
    
    useEffect(() => {
        router.push("/dashboard");
    }, [router]);

    return (
        <div className="min-h-screen bg-brand-background flex items-center justify-center">
            <div className="animate-pulse font-display text-brand-navy uppercase tracking-[0.3em] text-xs">
                Redirecting to Account Terminal...
            </div>
        </div>
    );
}
