"use client";

import { useState } from "react";
import { MapPin, Plus, Trash2, X, Home, Phone, User } from "lucide-react";
import { addAddress, deleteAddress } from "./actions";
import toast from "react-hot-toast";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export default function AddressesClient({ addresses: initial, userId }: { addresses: Address[]; userId: string }) {
  const [addresses, setAddresses] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const navItems = [
    { href: "/profile", label: "Profile" },
    { href: "/orders", label: "Orders" },
    { href: "/wishlist", label: "Wishlist" },
    { href: "/addresses", label: "Addresses", active: true },
    { href: "/prescriptions", label: "Prescriptions" },
    { href: "/settings", label: "Settings" },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const res = await addAddress(fd);
    setSubmitting(false);
    if (res.error) { toast.error(res.error); return; }
    toast.success("Address saved.");
    setShowForm(false);
    window.location.reload();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this address?")) return;
    const res = await deleteAddress(id);
    if (res.error) { toast.error(res.error); return; }
    setAddresses(prev => prev.filter(a => a.id !== id));
    toast.success("Address removed.");
  };

  return (
    <div className="bg-[#F8F9FC] min-h-screen pt-20 md:pt-28 pb-16">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#004AAD] mb-2">Account</p>
          <h1 className="text-4xl font-[var(--font-hero)] italic text-[#111111]">My Addresses</h1>
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
            {/* Add button */}
            <div className="flex justify-end">
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 bg-[#03173D] text-white rounded-full px-6 py-3 text-sm font-semibold hover:bg-[#004AAD] transition-all"
              >
                {showForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Add Address</>}
              </button>
            </div>

            {/* Add Form */}
            {showForm && (
              <div className="bg-white rounded-3xl border border-[#ECECEC] shadow-sm p-8">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-[#004AAD] mb-6">New Address</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: "name", label: "Full Name", placeholder: "Rahul Sharma", colSpan: false },
                    { name: "phone", label: "Phone Number", placeholder: "+91 98765 43210", colSpan: false },
                    { name: "address", label: "Street Address", placeholder: "123, MG Road, Apt 4B", colSpan: true },
                    { name: "city", label: "City", placeholder: "Bangalore", colSpan: false },
                    { name: "state", label: "State", placeholder: "Karnataka", colSpan: false },
                    { name: "pincode", label: "Pincode", placeholder: "560001", colSpan: false },
                  ].map(({ name, label, placeholder, colSpan }) => (
                    <div key={name} className={colSpan ? "md:col-span-2" : ""}>
                      <label className="block text-xs font-semibold uppercase tracking-widest text-[#004AAD] mb-2">{label}</label>
                      <input
                        name={name}
                        placeholder={placeholder}
                        required
                        className="w-full bg-[#F8F9FC] border border-[#E8EAF2] rounded-xl px-4 py-3 text-[#111111] text-sm outline-none focus:border-[#004AAD] transition-all"
                      />
                    </div>
                  ))}
                  <div className="md:col-span-2 flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="bg-[#03173D] text-white rounded-full px-8 py-3 font-semibold text-sm hover:bg-[#004AAD] transition-all disabled:opacity-50"
                    >
                      {submitting ? "Saving..." : "Save Address"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Address Cards */}
            {addresses.length === 0 && !showForm ? (
              <div className="bg-white rounded-3xl border border-[#ECECEC] p-16 text-center">
                <MapPin size={40} className="mx-auto text-[#CCCCCC] mb-4" />
                <p className="text-[#666666] font-semibold">No saved addresses</p>
                <p className="text-[#999999] text-sm mt-1">Add an address to speed up checkout.</p>
              </div>
            ) : (
              addresses.map((addr) => (
                <div key={addr.id} className="bg-white rounded-3xl border border-[#ECECEC] shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-6 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#F0F4FF] rounded-xl flex items-center justify-center flex-shrink-0">
                      <Home size={18} className="text-[#004AAD]" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <User size={13} className="text-[#999]" />
                        <p className="font-semibold text-[#111111] text-sm">{addr.name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={13} className="text-[#999]" />
                        <p className="text-[#666666] text-sm">{addr.phone}</p>
                      </div>
                      <p className="text-[#666666] text-sm mt-1">{addr.address}</p>
                      <p className="text-[#999999] text-xs">{addr.city}, {addr.state} — {addr.pincode}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="p-2 rounded-xl text-[#CCCCCC] hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
