"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Package, X, CheckCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/AuthProvider";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type Notification = {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
  metadata?: { order_id?: string; status?: string };
};

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unread = notifications.filter((n) => !n.read).length;

  const fetchNotifications = async () => {
    if (!user) return;
    const supabase = createClient();
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(12);
    if (data) setNotifications(data as Notification[]);
  };

  useEffect(() => {
    if (!user) return;
    fetchNotifications();

    const supabase = createClient();
    const channel = supabase
      .channel(`notifs_${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        () => fetchNotifications()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAllRead = async () => {
    if (!user) return;
    const supabase = createClient();
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id)
      .eq("read", false);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markOneRead = async (id: string) => {
    const supabase = createClient();
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleOpen = () => {
    setOpen((v) => !v);
  };

  if (!user) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={handleOpen}
        className="relative p-1 transition-transform hover:scale-110"
        title="Notifications"
      >
        <span className="material-symbols-outlined text-2xl text-[#111111] hover:text-[#004AAD] transition-colors">
          notifications
        </span>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#004AAD] text-[8px] font-bold text-white shadow-sm">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-3 w-80 bg-white border border-[#E8EAF2] rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#F0F2F8]">
              <div className="flex items-center gap-2">
                <Bell size={14} className="text-[#004AAD]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#111111]">
                  Notifications
                </span>
                {unread > 0 && (
                  <span className="text-[10px] bg-[#004AAD] text-white font-bold px-1.5 py-0.5 rounded-full">
                    {unread} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unread > 0 && (
                  <button
                    onClick={markAllRead}
                    className="p-1.5 rounded-lg hover:bg-[#F4F6F8] text-[#888888] hover:text-[#004AAD] transition-colors"
                    title="Mark all as read"
                  >
                    <CheckCheck size={14} />
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-[#F4F6F8] text-[#888888] transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-[400px] overflow-y-auto divide-y divide-[#F5F5F5]">
              {notifications.length === 0 ? (
                <div className="py-12 text-center">
                  <Bell size={32} className="mx-auto text-[#DDDDDD] mb-3" />
                  <p className="text-sm text-[#AAAAAA]">No notifications yet</p>
                </div>
              ) : (
                notifications.map((n) => {
                  const orderId = n.metadata?.order_id;
                  const content = (
                    <div
                      className={cn(
                        "flex gap-3 px-4 py-3 transition-colors",
                        !n.read
                          ? "bg-[#F0F5FF] hover:bg-[#E8F0FF]"
                          : "hover:bg-[#F8F9FC]"
                      )}
                      onClick={() => !n.read && markOneRead(n.id)}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                        !n.read ? "bg-[#004AAD]" : "bg-[#EFEFEF]"
                      )}>
                        <Package size={14} className={!n.read ? "text-white" : "text-[#AAAAAA]"} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-xs font-semibold truncate",
                          !n.read ? "text-[#004AAD]" : "text-[#111111]"
                        )}>
                          {n.title}
                        </p>
                        <p className="text-xs text-[#666666] mt-0.5 leading-relaxed line-clamp-2">
                          {n.message}
                        </p>
                        <p className="text-[10px] text-[#BBBBBB] mt-1">
                          {new Date(n.created_at).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short",
                          })}
                          {" · "}
                          {new Date(n.created_at).toLocaleTimeString("en-IN", {
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </p>
                      </div>
                      {!n.read && (
                        <div className="w-2 h-2 rounded-full bg-[#004AAD] flex-shrink-0 mt-2" />
                      )}
                    </div>
                  );

                  return orderId ? (
                    <Link
                      key={n.id}
                      href={`/orders/${orderId}`}
                      onClick={() => { setOpen(false); !n.read && markOneRead(n.id); }}
                      className="block cursor-pointer"
                    >
                      {content}
                    </Link>
                  ) : (
                    <div key={n.id} className="cursor-default">
                      {content}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-4 py-3 border-t border-[#F0F2F8] text-center">
                <Link
                  href="/orders"
                  onClick={() => setOpen(false)}
                  className="text-xs font-semibold text-[#004AAD] hover:underline"
                >
                  View all orders →
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
