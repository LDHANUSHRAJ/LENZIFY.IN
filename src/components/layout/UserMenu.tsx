"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { logout } from "@/app/auth/actions";

interface UserMenuProps {
  user: any;
}

export default function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const name = user.user_metadata?.name || user.email?.split("@")[0] || "User";
  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const isAdmin = user.email === "lenzify.in@gmail.com";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 group focus:outline-none"
      >
        <div className="flex flex-col items-end hidden sm:flex">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary group-hover:text-secondary transition-colors">
            {name}
          </span>
          <span className="text-[8px] font-bold uppercase tracking-widest text-on-surface/40 italic">
            Joined Member
          </span>
        </div>
        
        <div className={cn(
          "w-10 h-10 rounded-full border border-outline/10 flex items-center justify-center bg-surface-container-low transition-all duration-500 overflow-hidden relative",
          isOpen ? "ring-2 ring-secondary/30 ring-offset-2" : "group-hover:border-secondary/50"
        )}>
          {user.user_metadata?.avatar_url ? (
            <img src={user.user_metadata.avatar_url} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs font-serif italic text-primary">{initials}</span>
          )}
          <div className="absolute inset-0 bg-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 mt-6 w-72 bg-white editorial-shadow border border-outline/5 z-[100] rounded-sm overflow-hidden"
          >
            {/* Header */}
            <div className="p-8 bg-surface-container-lowest border-b border-outline/5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-outline/10 flex items-center justify-center bg-white">
                    <span className="text-sm font-serif italic text-primary">{initials}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-black uppercase tracking-widest text-primary">{name}</span>
                    <span className="text-[10px] text-on-surface/40 italic truncate max-w-[160px]">{user.email}</span>
                </div>
              </div>
              {isAdmin && (
                <div className="px-3 py-1 bg-secondary/10 border border-secondary/20 inline-block">
                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-secondary">Administrative Identity</span>
                </div>
              )}
            </div>

            {/* Links */}
            <div className="p-2">
              {!isAdmin ? (
                <>
                  <MenuItem href="/dashboard" icon="dashboard" label="Account Overview" />
                  <MenuItem href="/profile" icon="person" label="Identity Details" />
                  <MenuItem href="/orders" icon="shopping_bag" label="Purchase History" />
                </>
              ) : (
                <MenuItem href="/admin/dashboard" icon="admin_panel_settings" label="System Matrix" />
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-surface-container-lowest border-t border-outline/5">
              <form action={logout}>
                <button
                  type="submit"
                  className="w-full py-4 flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.4em] text-secondary hover:bg-secondary/5 transition-all group"
                >
                  <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">logout</span>
                  Terminate Session
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuItem({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <Link 
      href={href}
      className="flex items-center gap-4 px-6 py-4 hover:bg-surface-container-low transition-colors group"
    >
      <span className="material-symbols-outlined text-lg text-on-surface/40 group-hover:text-primary transition-colors">{icon}</span>
      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-on-surface/60 group-hover:text-primary transition-colors">{label}</span>
    </Link>
  );
}
