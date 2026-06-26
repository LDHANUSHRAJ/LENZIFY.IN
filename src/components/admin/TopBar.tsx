"use client";

import { Search, Bell, Settings, Command, Plus, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function TopBar() {
  const { user } = useAuth();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const supabase = createClient();

    const fetchUnread = async () => {
      const { count } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("read", false);
      setUnreadCount(count || 0);
    };

    fetchUnread();

    const channel = supabase
      .channel("admin_notifs_count")
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications" }, fetchUnread)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/admin/products?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  };

  return (
    <header className="h-14 bg-white border-b border-[#ECEFF5] flex items-center gap-4 px-6 sticky top-0 z-40 flex-shrink-0">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex-1 max-w-sm">
        <div
          className={cn(
            "flex items-center gap-2.5 bg-[#F4F6F8] border rounded-lg px-3 py-2 transition-all duration-200",
            focused
              ? "border-[#004AAD] ring-2 ring-[#004AAD]/10 bg-white"
              : "border-[#ECEFF5]"
          )}
        >
          <Search size={14} className="text-[#BBBBBB] flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, orders, customers..."
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="bg-transparent text-sm text-[#111111] placeholder:text-[#CCCCCC] focus:outline-none w-full"
            suppressHydrationWarning
          />
          <div className="flex items-center gap-0.5 flex-shrink-0 opacity-50">
            <Command size={10} className="text-[#999999]" />
            <span className="text-[10px] text-[#999999] font-semibold">K</span>
          </div>
        </div>
      </form>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right Actions */}
      <div className="flex items-center gap-1">
        <Link
          href="/admin/products/new"
          className="flex items-center gap-1.5 bg-[#004AAD] text-white text-xs font-semibold px-3.5 py-2 rounded-lg hover:bg-[#003d99] transition-colors mr-2"
        >
          <Plus size={13} strokeWidth={2.5} />
          Add Product
        </Link>

        <Link
          href="/admin/notifications"
          className="relative p-2 rounded-lg text-[#888888] hover:bg-[#F4F6F8] hover:text-[#111111] transition-colors"
          title="Notifications"
        >
          <Bell size={17} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-[8px] h-2 flex items-center justify-center rounded-full bg-red-500 border-2 border-white text-[7px] font-bold text-white px-0.5">
              {unreadCount > 9 ? "9+" : unreadCount > 1 ? unreadCount : ""}
            </span>
          )}
        </Link>

        <Link
          href="/admin/settings"
          className="p-2 rounded-lg text-[#888888] hover:bg-[#F4F6F8] hover:text-[#111111] transition-colors"
          title="Settings"
        >
          <Settings size={17} />
        </Link>

        {/* Profile */}
        <div className="flex items-center gap-2 pl-3 ml-1 border-l border-[#ECEFF5] cursor-pointer group">
          <div className="w-7 h-7 rounded-full bg-[#004AAD] flex items-center justify-center flex-shrink-0">
            <span className="text-[10px] font-bold text-white">
              {(user?.user_metadata?.name || user?.email || "A")[0].toUpperCase()}
            </span>
          </div>
          <span className="text-sm font-medium text-[#111111] group-hover:text-[#004AAD] transition-colors hidden md:block">
            {user?.user_metadata?.name || "Admin"}
          </span>
          <ChevronDown size={13} className="text-[#AAAAAA] hidden md:block" />
        </div>
      </div>
    </header>
  );
}
