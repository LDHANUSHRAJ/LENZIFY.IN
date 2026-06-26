"use client";

import { useState } from "react";
import { FileText, Plus, CheckCircle2, Clock, XCircle, Eye, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Prescription {
  id: string;
  status: string;
  created_at: string;
  right_eye: { sph?: string; cyl?: string; axis?: string; add?: string } | null;
  left_eye: { sph?: string; cyl?: string; axis?: string; add?: string } | null;
  pd?: string;
  file_url?: string;
  order_id?: string;
}

const STATUS_CONFIG: Record<string, { label: string; icon: any; className: string }> = {
  approved: { label: "Approved", icon: CheckCircle2, className: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  pending:  { label: "Pending Review", icon: Clock, className: "text-amber-600 bg-amber-50 border-amber-200" },
  rejected: { label: "Rejected", icon: XCircle, className: "text-red-600 bg-red-50 border-red-200" },
};

function EyeCard({ label, data }: { label: string; data: any }) {
  return (
    <div className="bg-[#F8F9FC] rounded-xl p-4 border border-[#ECECEC]">
      <p className="text-[10px] font-bold uppercase tracking-widest text-[#004AAD] mb-3">{label}</p>
      <div className="grid grid-cols-2 gap-2">
        {["sph", "cyl", "axis", "add"].map(k => (
          <div key={k}>
            <p className="text-[9px] text-[#999] uppercase font-semibold">{k}</p>
            <p className="text-sm font-bold text-[#111111]">{data?.[k] || "—"}{k === "axis" && data?.[k] ? "°" : ""}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PrescriptionsClient({ prescriptions, userId }: { prescriptions: Prescription[]; userId: string }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const navItems = [
    { href: "/profile", label: "Profile" },
    { href: "/orders", label: "Orders" },
    { href: "/wishlist", label: "Wishlist" },
    { href: "/addresses", label: "Addresses" },
    { href: "/prescriptions", label: "Prescriptions", active: true },
    { href: "/settings", label: "Settings" },
  ];

  return (
    <div className="bg-[#F8F9FC] min-h-screen pt-20 md:pt-28 pb-16">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#004AAD] mb-2">Account</p>
          <h1 className="text-4xl font-[var(--font-hero)] italic text-[#111111]">My Prescriptions</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-3xl border border-[#ECECEC] p-6 sticky top-24">
              <nav className="space-y-1">
                {navItems.map(({ href, label, active }) => (
                  <Link key={href} href={href} className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                    active ? "bg-[#F0F4FF] text-[#03173D] font-semibold" : "text-[#666666] hover:bg-[#F8F9FC] hover:text-[#111111]"
                  )}>
                    {label}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 space-y-4">
            {/* Info banner */}
            <div className="bg-[#EEF4FF] border border-[#C7D8FF] rounded-2xl p-4 text-sm text-[#004AAD]">
              Prescriptions are linked to your orders automatically. To add a new prescription, place an order with a frame and add it during checkout.
            </div>

            {prescriptions.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#ECECEC] p-16 text-center">
                <FileText size={40} className="mx-auto text-[#CCCCCC] mb-4" />
                <p className="text-[#666666] font-semibold">No prescriptions yet</p>
                <p className="text-[#999999] text-sm mt-1">Your prescriptions will appear here after you place an order with a frame.</p>
                <Link href="/spectacles" className="inline-block mt-6 bg-[#03173D] text-white rounded-full px-6 py-3 text-sm font-semibold hover:bg-[#004AAD] transition-all">
                  Browse Frames
                </Link>
              </div>
            ) : (
              prescriptions.map((rx) => {
                const cfg = STATUS_CONFIG[rx.status] ?? STATUS_CONFIG.pending;
                const StatusIcon = cfg.icon;
                const isOpen = expanded === rx.id;

                return (
                  <div key={rx.id} className="bg-white rounded-3xl border border-[#ECECEC] shadow-[0_4px_16px_rgba(0,0,0,0.04)] overflow-hidden">
                    <div
                      className="p-6 flex items-center justify-between cursor-pointer hover:bg-[#F8F9FC] transition-all"
                      onClick={() => setExpanded(isOpen ? null : rx.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#F0F4FF] rounded-xl flex items-center justify-center">
                          <FileText size={18} className="text-[#004AAD]" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#111111] text-sm">
                            Prescription — {new Date(rx.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                          {rx.order_id && (
                            <p className="text-[#999999] text-xs mt-0.5">Order #{rx.order_id.slice(0, 8)}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={cn("flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border", cfg.className)}>
                          <StatusIcon size={12} />
                          {cfg.label}
                        </span>
                        <Eye size={16} className={cn("text-[#CCCCCC] transition-transform", isOpen && "rotate-180")} />
                      </div>
                    </div>

                    {isOpen && (
                      <div className="border-t border-[#ECECEC] p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <EyeCard label="Right Eye (OD)" data={rx.right_eye} />
                          <EyeCard label="Left Eye (OS)" data={rx.left_eye} />
                        </div>
                        {rx.pd && (
                          <div className="bg-[#FFF8E8] border border-[#F5D87A] rounded-xl p-4 flex items-center justify-between">
                            <p className="text-sm font-semibold text-[#8B6914]">Pupillary Distance (PD)</p>
                            <p className="text-lg font-bold text-[#8B6914]">{rx.pd} mm</p>
                          </div>
                        )}
                        {rx.file_url && (
                          <a href={rx.file_url} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-[#004AAD] hover:underline">
                            <FileText size={14} />
                            View uploaded prescription file
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
