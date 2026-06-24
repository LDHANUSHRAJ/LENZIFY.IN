import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { cn } from "@/lib/utils";
import { Home, Calendar, Clock, User, Phone, Mail, MapPin, StickyNote } from "lucide-react";

async function updateBookingStatus(id: string, status: string, admin_notes: string) {
  "use server";
  const supabase = await createAdminClient();
  await supabase
    .from("try_at_home_bookings")
    .update({ status, admin_notes, updated_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath("/admin/try-at-home");
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700",
  confirmed: "bg-blue-50 text-blue-700",
  completed: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
};

export default async function AdminTryAtHomePage() {
  const supabase = await createAdminClient();
  const { data: bookings } = await supabase
    .from("try_at_home_bookings")
    .select("*")
    .order("created_at", { ascending: false });

  const all = bookings ?? [];
  const pending = all.filter((b) => b.status === "pending").length;
  const confirmed = all.filter((b) => b.status === "confirmed").length;
  const completed = all.filter((b) => b.status === "completed").length;

  return (
    <div className="min-h-screen bg-brand-surface pt-12 pb-24 font-sans text-brand-navy">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Home size={28} strokeWidth={1.5} className="text-brand-gold" />
              <h1 className="text-4xl md:text-6xl font-serif italic tracking-tight leading-none">
                Try-at-Home <span className="text-secondary">Bookings</span>
              </h1>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-navy/40 italic">
              Home Visit Deployment Management
            </p>
          </div>
          <div className="flex gap-4 flex-wrap">
            {[
              { label: "Pending", value: pending, color: "text-yellow-600" },
              { label: "Confirmed", value: confirmed, color: "text-blue-600" },
              { label: "Completed", value: completed, color: "text-green-600" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white border border-brand-navy/5 p-6 shadow-sm">
                <p className="text-[9px] font-black uppercase tracking-widest text-brand-navy/30 mb-1">{label}</p>
                <p className={cn("text-2xl font-serif italic leading-none", color)}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        {all.length === 0 ? (
          <div className="bg-white border border-brand-navy/5 p-16 text-center">
            <Home size={40} className="mx-auto text-brand-navy/10 mb-6" strokeWidth={1} />
            <p className="text-[10px] font-black uppercase tracking-widest text-brand-navy/30">No bookings yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {all.map((booking) => (
              <div
                key={booking.id}
                className="bg-white border border-brand-navy/5 overflow-hidden shadow-sm hover:shadow-xl transition-all"
              >
                <div className="p-8 flex flex-col lg:flex-row gap-10">
                  {/* Left: Status & Controls */}
                  <div className="lg:w-60 shrink-0 space-y-6">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black uppercase tracking-widest text-brand-navy/30">Booking ID</p>
                      <p className="text-[11px] font-mono font-black uppercase">#{booking.id.slice(0, 8)}</p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[9px] font-black uppercase tracking-widest text-brand-navy/30">Status</p>
                      <span className={cn("inline-flex items-center gap-2 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest", STATUS_COLORS[booking.status] ?? "bg-slate-50 text-slate-600")}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                        {booking.status}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[9px] font-black uppercase tracking-widest text-brand-navy/30">Frame Pref.</p>
                      <p className="text-sm font-bold">{booking.frame_preference ?? "—"}</p>
                    </div>

                    <div className="pt-4 border-t border-brand-navy/5 space-y-3">
                      <p className="text-[9px] font-black uppercase tracking-widest text-brand-navy/30 italic">Update Status</p>
                      <form
                        action={async (formData: FormData) => {
                          "use server";
                          const status = formData.get("status") as string;
                          const notes = formData.get("admin_notes") as string;
                          await updateBookingStatus(booking.id, status, notes);
                        }}
                        className="space-y-3"
                      >
                        <select
                          name="status"
                          defaultValue={booking.status}
                          className="w-full border border-brand-navy/10 text-[10px] font-black uppercase tracking-widest py-2.5 px-3 bg-white focus:outline-none focus:border-brand-navy transition-all"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <textarea
                          name="admin_notes"
                          defaultValue={booking.admin_notes ?? ""}
                          placeholder="Admin notes..."
                          rows={2}
                          className="w-full border border-brand-navy/10 text-xs py-2 px-3 bg-white focus:outline-none focus:border-brand-navy transition-all resize-none text-brand-navy"
                        />
                        <button
                          type="submit"
                          className="w-full bg-brand-navy text-white text-[9px] font-black uppercase tracking-widest py-3 hover:bg-secondary hover:text-brand-navy transition-all"
                        >
                          Update
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Right: Details */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Contact */}
                    <div className="space-y-4">
                      <p className="text-[9px] font-black uppercase tracking-widest text-brand-navy/30 border-b border-brand-navy/5 pb-2">Contact</p>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <User size={14} className="text-brand-navy/30 shrink-0" />
                          <p className="text-sm font-bold">{booking.name}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail size={14} className="text-brand-navy/30 shrink-0" />
                          <p className="text-sm text-brand-navy/70">{booking.email}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone size={14} className="text-brand-navy/30 shrink-0" />
                          <p className="text-sm text-brand-navy/70">{booking.phone}</p>
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-4">
                      <p className="text-[9px] font-black uppercase tracking-widest text-brand-navy/30 border-b border-brand-navy/5 pb-2">Address</p>
                      <div className="flex items-start gap-3">
                        <MapPin size={14} className="text-brand-navy/30 shrink-0 mt-0.5" />
                        <p className="text-sm text-brand-navy/70">
                          {booking.address}, {booking.city} — {booking.pincode}
                        </p>
                      </div>
                    </div>

                    {/* Schedule */}
                    <div className="space-y-4">
                      <p className="text-[9px] font-black uppercase tracking-widest text-brand-navy/30 border-b border-brand-navy/5 pb-2">Schedule</p>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Calendar size={14} className="text-brand-navy/30 shrink-0" />
                          <p className="text-sm font-bold">{booking.preferred_date}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock size={14} className="text-brand-navy/30 shrink-0" />
                          <p className="text-sm text-brand-navy/70">{booking.preferred_time}</p>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    {booking.notes && (
                      <div className="space-y-4">
                        <p className="text-[9px] font-black uppercase tracking-widest text-brand-navy/30 border-b border-brand-navy/5 pb-2">Customer Notes</p>
                        <div className="flex items-start gap-3">
                          <StickyNote size={14} className="text-brand-navy/30 shrink-0 mt-0.5" />
                          <p className="text-sm text-brand-navy/70">{booking.notes}</p>
                        </div>
                      </div>
                    )}

                    {/* Booked On */}
                    <div className="md:col-span-2 pt-4 border-t border-brand-navy/5">
                      <p className="text-[9px] font-black uppercase tracking-widest text-brand-navy/20">
                        Booked on {new Date(booking.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
