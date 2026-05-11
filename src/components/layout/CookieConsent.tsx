"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("lenzify-cookie-consent");
    if (!consent) {
      // Show after a short delay for better UX
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("lenzify-cookie-consent", "accepted");
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem("lenzify-cookie-consent", "declined");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[200] p-4 animate-in slide-in-from-bottom duration-500">
      <div className="max-w-screen-lg mx-auto bg-[#0F1115] text-white p-6 md:p-8 rounded-xl shadow-2xl border border-white/5 flex flex-col md:flex-row gap-6 items-center">
        <div className="flex-1 space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-secondary">
            Cookie Notice
          </p>
          <p className="text-xs text-white/60 leading-relaxed">
            We use cookies to enhance your browsing experience, remember your preferences, 
            and analyze site traffic. By clicking &quot;Accept&quot;, you consent to our use of cookies. 
            See our{" "}
            <a href="/privacy" className="text-secondary underline underline-offset-4">
              Privacy Policy
            </a>{" "}
            for details.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={handleDecline}
            className="px-6 py-3 border border-white/10 text-white text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all rounded-lg"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-6 py-3 bg-secondary text-[#0F1115] text-[9px] font-black uppercase tracking-widest hover:opacity-90 transition-all rounded-lg"
          >
            Accept All
          </button>
        </div>
        <button
          onClick={handleDecline}
          className="absolute top-3 right-3 md:hidden text-white/30 hover:text-white"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
