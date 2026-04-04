"use client";

import { useState } from "react";
import { products, Product } from "@/data/products";
import { Search, Plus, Filter, MoreVertical, Edit, Trash2, ExternalLink, Package } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display uppercase tracking-widest text-brand-navy mb-2">Inventory Catalog</h1>
          <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-brand-text-muted">Total Units: {products.length}</p>
        </div>
        <button className="bg-brand-navy text-white px-8 py-4 text-xs font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-brand-gold hover:text-white transition-all shadow-lg group">
          <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
          Deploy New Model
        </button>
      </header>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white border border-brand-navy/5 p-6 shadow-sm">
        <div className="relative w-full md:w-96 group">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-muted group-focus-within:text-brand-gold transition-colors" />
          <input 
            type="text" 
            placeholder="Search catalog matrix..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-brand-background border border-brand-navy/5 pl-12 pr-4 py-4 text-xs font-bold uppercase tracking-widest outline-none focus:border-brand-gold transition-colors"
          />
        </div>
        
        <div className="flex items-center gap-6 w-full md:w-auto">
          <div className="relative group flex-1 md:flex-none">
             <Filter size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-navy/40" />
             <select 
               value={filterCategory}
               onChange={(e) => setFilterCategory(e.target.value)}
               className="appearance-none bg-brand-background border border-brand-navy/10 pl-10 pr-12 py-4 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-brand-gold cursor-pointer"
             >
               <option value="all">All Sectors</option>
               <option value="spectacles">Spectacles</option>
               <option value="lenses">Lenses</option>
               <option value="contact-lenses">Contact Lenses</option>
             </select>
          </div>
        </div>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="bg-white border border-brand-navy/5 p-4 flex flex-col md:flex-row items-center gap-8 group hover:border-brand-gold transition-all duration-500"
            >
              <div className="relative w-24 h-24 bg-brand-background border border-brand-navy/5 overflow-hidden shrink-0">
                <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>

              <div className="flex-1 flex flex-col md:flex-row items-center justify-between w-full gap-8">
                <div className="text-center md:text-left">
                  <p className="text-[9px] text-brand-gold uppercase tracking-[0.3em] font-bold mb-1">{p.brand} &bull; {p.category}</p>
                  <h3 className="text-lg font-display text-brand-navy uppercase tracking-widest">{p.name}</h3>
                  <p className="text-[10px] text-brand-text-muted font-medium uppercase tracking-widest mt-1">ID: {p.id}</p>
                </div>

                <div className="flex items-center gap-12">
                   <div className="text-center md:text-right">
                      <p className="text-[9px] uppercase font-bold tracking-widest text-brand-text-muted mb-1">Status</p>
                      <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 border border-green-600/20 bg-green-50 text-green-600">In Stock</span>
                   </div>
                   <div className="text-center md:text-right">
                      <p className="text-[9px] uppercase font-bold tracking-widest text-brand-text-muted mb-1">Value</p>
                      <p className="text-lg font-bold text-brand-navy">₹{p.price.toLocaleString()}</p>
                   </div>
                   <div className="flex items-center gap-4 border-l border-brand-navy/10 pl-8">
                      <button className="p-3 text-brand-text-muted hover:text-brand-navy transition-colors bg-brand-background hover:bg-white border border-transparent hover:border-brand-navy/5"><Edit size={16} /></button>
                      <button className="p-3 text-brand-text-muted hover:text-red-500 transition-colors bg-brand-background hover:bg-red-50 border border-transparent hover:border-red-100"><Trash2 size={16} /></button>
                      <button className="p-3 text-brand-text-muted hover:text-brand-gold transition-colors"><MoreVertical size={16} /></button>
                   </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredProducts.length === 0 && (
          <div className="py-24 text-center bg-white border border-brand-navy/5">
             <Package size={48} className="mx-auto text-brand-navy/10 mb-6" />
             <h3 className="text-2xl font-display text-brand-navy uppercase tracking-widest">Model Not Found</h3>
             <p className="text-xs text-brand-text-muted uppercase tracking-widest mt-2">Adjust your parameters</p>
          </div>
        )}
      </div>
    </div>
  );
}
