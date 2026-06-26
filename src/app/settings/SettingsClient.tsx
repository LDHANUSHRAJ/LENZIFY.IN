"use client";

import { useState } from "react";
import { User, Bell, Shield, Save, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
  userId: string;
  email: string;
  currentName: string;
  currentPhone: string;
}

export default function SettingsClient({ userId, email, currentName, currentPhone }: Props) {
  const [name, setName] = useState(currentName);
  const [phone, setPhone] = useState(currentPhone);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const navItems = [
    { href: "/profile", label: "Profile" },
    { href: "/orders", label: "Orders" },
    { href: "/wishlist", label: "Wishlist" },
    { href: "/addresses", label: "Addresses" },
    { href: "/prescriptions", label: "Prescriptions" },
    { href: "/settings", label: "Settings", active: true },
  ];

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      data: { name: name.trim(), phone: phone.trim() },
    });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    setSaved(true);
    toast.success("Profile updated.");
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-[#F8F9FC] min-h-screen pt-20 md:pt-28 pb-16">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#004AAD] mb-2">Account</p>
          <h1 className="text-4xl font-[var(--font-hero)] italic text-[#111111]">Settings</h1>
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
          <div className="flex-1 space-y-6">
            {/* Profile Settings */}
            <div className="bg-white rounded-3xl border border-[#ECECEC] shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-[#F0F4FF] rounded-xl flex items-center justify-center">
                  <User size={16} className="text-[#004AAD]" />
                </div>
                <h2 className="text-sm font-semibold uppercase tracking-widest text-[#004AAD]">Profile Information</h2>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-[#004AAD] mb-2">Display Name</label>
                    <input
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full bg-[#F8F9FC] border border-[#E8EAF2] rounded-xl px-4 py-3 text-[#111111] text-sm outline-none focus:border-[#004AAD] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-[#004AAD] mb-2">Phone Number</label>
                    <input
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-[#F8F9FC] border border-[#E8EAF2] rounded-xl px-4 py-3 text-[#111111] text-sm outline-none focus:border-[#004AAD] transition-all"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-widest text-[#004AAD] mb-2">Email Address</label>
                    <div className="bg-[#F0F0F0] border border-[#E8EAF2] rounded-xl px-4 py-3 text-[#999999] text-sm cursor-not-allowed">
                      {email}
                      <span className="ml-2 text-[10px] font-semibold text-emerald-600">Verified</span>
                    </div>
                    <p className="text-xs text-[#999] mt-1">Email cannot be changed. Contact support if needed.</p>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 bg-[#03173D] text-white rounded-full px-8 py-3 font-semibold text-sm hover:bg-[#004AAD] transition-all disabled:opacity-50"
                  >
                    {saved ? <><Check size={16} /> Saved</> : saving ? "Saving..." : <><Save size={16} /> Save Changes</>}
                  </button>
                </div>
              </form>
            </div>

            {/* Security */}
            <div className="bg-white rounded-3xl border border-[#ECECEC] shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-[#F0F4FF] rounded-xl flex items-center justify-center">
                  <Shield size={16} className="text-[#004AAD]" />
                </div>
                <h2 className="text-sm font-semibold uppercase tracking-widest text-[#004AAD]">Security</h2>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-[#F8F9FC] rounded-2xl border border-[#ECECEC]">
                <div>
                  <p className="font-semibold text-[#111111] text-sm">Password</p>
                  <p className="text-[#666666] text-xs mt-0.5">Change your account password.</p>
                </div>
                <Link
                  href="/auth/forgot-password"
                  className="border border-[#03173D] text-[#03173D] rounded-full px-6 py-2.5 text-sm font-semibold hover:bg-[#03173D] hover:text-white transition-all whitespace-nowrap"
                >
                  Change Password
                </Link>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-3xl border border-[#ECECEC] shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-[#F0F4FF] rounded-xl flex items-center justify-center">
                  <Bell size={16} className="text-[#004AAD]" />
                </div>
                <h2 className="text-sm font-semibold uppercase tracking-widest text-[#004AAD]">Notifications</h2>
              </div>

              <div className="space-y-4">
                {[
                  { label: "Order Updates", desc: "Shipping, delivery, and status changes", checked: true },
                  { label: "Offers & Promotions", desc: "Exclusive deals and discount codes", checked: true },
                ].map(({ label, desc, checked }) => (
                  <div key={label} className="flex items-center justify-between p-5 bg-[#F8F9FC] rounded-2xl border border-[#ECECEC]">
                    <div>
                      <p className="font-semibold text-[#111111] text-sm">{label}</p>
                      <p className="text-[#666666] text-xs mt-0.5">{desc}</p>
                    </div>
                    <div className={cn(
                      "w-10 h-6 rounded-full relative cursor-default transition-colors",
                      checked ? "bg-[#004AAD]" : "bg-[#CCCCCC]"
                    )}>
                      <span className={cn(
                        "absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all",
                        checked ? "left-5" : "left-1"
                      )} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
