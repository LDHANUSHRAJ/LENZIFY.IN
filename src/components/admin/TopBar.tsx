"use client";

import { Search, Bell, User, Settings, Shield, Menu, Command, LayoutGrid, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function TopBar() {
  const [user, setUser] = useState<any>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase.auth]);

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-brand-navy/5 flex items-center justify-between px-10 sticky top-0 z-40 transition-all duration-500">
      {/* Global Command Center (Search) */}
      <div className={cn(
        "flex-1 max-w-2xl relative group transition-all duration-700",
        isSearchFocused ? "max-w-3xl" : "max-w-2xl"
      )}>
        <div className={cn(
          "flex items-center gap-4 bg-brand-background border rounded-2xl px-6 py-2.5 transition-all duration-500",
          isSearchFocused ? "border-secondary ring-4 ring-secondary/5 bg-white scale-[1.02] shadow-2xl" : "border-brand-navy/5"
        )}>
          <Search className={cn("transition-colors duration-500", isSearchFocused ? "text-secondary" : "text-brand-navy/30")} size={18} />
          <input 
            type="text" 
            placeholder="OPERATIONAL QUERY / SYSTEM COMMAND..."
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="w-full bg-transparent text-[10px] font-black tracking-[0.2em] uppercase focus:outline-none placeholder:text-brand-navy/20 text-brand-navy transition-all"
          />
          <div className="flex items-center gap-1.5 px-3 py-1 bg-brand-navy/5 rounded-lg border border-brand-navy/5">
             <Command size={10} className="text-brand-navy/40" />
             <span className="text-[8px] font-black text-brand-navy/40">K</span>
          </div>
        </div>
      </div>

      {/* Orchestration Matrix (Right Actions) */}
      <div className="flex items-center gap-10">
        {/* Rapid Actions */}
        <div className="flex items-center gap-6 pr-10 border-r border-brand-navy/5">
           <button className="p-2.5 text-brand-navy/30 hover:text-secondary hover:bg-secondary/5 rounded-xl transition-all duration-500 group relative">
             <LayoutGrid size={20} className="group-hover:rotate-90 transition-transform duration-700" />
           </button>
           
           <button className="p-2.5 text-brand-navy/30 hover:text-secondary hover:bg-secondary/5 rounded-xl transition-all duration-500 group relative">
              <Bell size={20} className="group-hover:animate-bounce" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
           </button>
           
           <button className="p-2.5 text-brand-navy/30 hover:text-secondary hover:bg-secondary/5 rounded-xl transition-all duration-500 group">
              <Settings size={20} className="group-hover:rotate-180 transition-transform duration-1000" />
           </button>
        </div>

        {/* Identity Signature */}
        <div className="flex items-center gap-5 group cursor-pointer">
           <div className="text-right flex flex-col justify-center">
              <p className="text-[10px] font-black text-brand-navy tracking-widest uppercase leading-none mb-1 group-hover:text-secondary transition-colors italic">
                {user?.user_metadata?.name || "Admin"}
              </p>
              <div className="flex items-center justify-end gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                 <p className="text-[7px] font-bold text-brand-navy/30 tracking-[0.3em] uppercase leading-none">Verified Superuser</p>
              </div>
           </div>
           <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-navy to-brand-navy/80 rounded-2xl flex items-center justify-center text-white ring-4 ring-secondary/5 shadow-2xl group-hover:scale-105 transition-transform duration-500 relative overflow-hidden">
                 <Shield size={22} className="relative z-10" />
                 <div className="absolute inset-0 bg-gradient-to-tr from-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-secondary rounded-lg border-2 border-white flex items-center justify-center shadow-lg group-hover:animate-pulse">
                 <Zap size={10} className="text-brand-navy" fill="currentColor" />
              </div>
           </div>
        </div>
      </div>
    </header>
  );
}
