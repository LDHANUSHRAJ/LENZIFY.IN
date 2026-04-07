import { createProduct } from "../actions";
import { 
  Package, 
  Tag, 
  Layers, 
  Info, 
  Camera, 
  Maximize2, 
  Cpu, 
  Zap, 
  ChevronRight,
  Save,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function NewProductPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select("*");

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 border-b border-brand-navy/5 pb-10">
        <div className="space-y-2">
           <Link href="/admin/products" className="text-[9px] font-bold uppercase tracking-[0.4em] text-secondary flex items-center gap-2 hover:translate-x-1 transition-transform mb-4">
              <ArrowLeft size={10} />
              Return to Catalog
           </Link>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary italic">Step 02: Resource Allocation</p>
          <h1 className="text-4xl md:text-5xl font-serif italic text-brand-navy tracking-tight">Deploy <span className="text-secondary">Model</span></h1>
        </div>
      </header>

      <form action={async (formData) => { "use server"; await createProduct(formData); }} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Core Data */}
        <div className="lg:col-span-8 space-y-12">
          {/* General Information */}
          <section className="bg-white border border-brand-navy/5 p-8 lg:p-12 space-y-10 shadow-sm relative overflow-hidden">
             <div className="flex items-center gap-4 mb-2">
                <Info size={16} className="text-secondary" />
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-navy">General Manifest</h3>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 group">
                   <label className="text-[9px] font-bold uppercase tracking-widest text-brand-text-muted transition-colors group-focus-within:text-secondary italic">Model Designation</label>
                   <input 
                     name="name" 
                     required 
                     placeholder="e.g. AERO STEALTH BLUE" 
                     className="w-full bg-brand-background border border-brand-navy/10 px-6 py-4 text-[11px] font-medium tracking-wider outline-none focus:border-secondary transition-all" 
                   />
                </div>
                <div className="space-y-2 group">
                   <label className="text-[9px] font-bold uppercase tracking-widest text-brand-text-muted transition-colors group-focus-within:text-secondary italic">Brand Authority</label>
                   <input 
                     name="brand" 
                     required 
                     placeholder="e.g. RAY-BAN LUX" 
                     className="w-full bg-brand-background border border-brand-navy/10 px-6 py-4 text-[11px] font-medium tracking-wider outline-none focus:border-secondary transition-all" 
                   />
                </div>
                <div className="space-y-2 group">
                   <label className="text-[9px] font-bold uppercase tracking-widest text-brand-text-muted transition-colors group-focus-within:text-secondary italic">Unit SKU (Unique)</label>
                   <input 
                     name="sku" 
                     required 
                     placeholder="LZ-AERO-001" 
                     className="w-full bg-brand-background border border-brand-navy/10 px-6 py-4 text-[11px] font-medium tracking-wider outline-none focus:border-secondary transition-all uppercase" 
                   />
                </div>
                <div className="space-y-2 group">
                   <label className="text-[9px] font-bold uppercase tracking-widest text-brand-text-muted transition-colors group-focus-within:text-secondary italic">Deployment Sector</label>
                   <select 
                     name="category_id" 
                     required 
                     className="w-full bg-brand-background border border-brand-navy/10 px-6 py-4 text-[11px] font-bold tracking-widest uppercase outline-none focus:border-secondary transition-all cursor-pointer appearance-none"
                   >
                     <option value="">Select Sector...</option>
                     {categories?.map((cat) => (
                       <option key={cat.id} value={cat.id}>{cat.name}</option>
                     ))}
                   </select>
                </div>
             </div>

             <div className="space-y-2 group">
                <label className="text-[9px] font-bold uppercase tracking-widest text-brand-text-muted transition-colors group-focus-within:text-secondary italic">Tactical Brief (Description)</label>
                <textarea 
                  name="description" 
                  rows={4} 
                  required 
                  placeholder="Provide detailed model specifications..." 
                  className="w-full bg-brand-background border border-brand-navy/10 px-6 py-4 text-[11px] font-medium tracking-wider outline-none focus:border-secondary transition-all resize-none" 
                />
             </div>
          </section>

          {/* Pricing & Stock */}
          <section className="bg-white border border-brand-navy/5 p-8 lg:p-12 space-y-10 shadow-sm relative overflow-hidden">
             <div className="flex items-center gap-4 mb-2">
                <Tag size={16} className="text-secondary" />
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-navy">Economic Protocols</h3>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2 group">
                   <label className="text-[9px] font-bold uppercase tracking-widest text-brand-text-muted italic">Base Value (₹)</label>
                   <input 
                     name="price" 
                     type="number" 
                     step="0.01" 
                     required 
                     className="w-full bg-brand-background border border-brand-navy/10 px-6 py-4 text-[11px] font-bold tracking-wider outline-none focus:border-secondary transition-all" 
                   />
                </div>
                <div className="space-y-2 group">
                   <label className="text-[9px] font-bold uppercase tracking-widest text-brand-text-muted italic">Incentive Price (₹)</label>
                   <input 
                     name="offer_price" 
                     type="number" 
                     step="0.01" 
                     className="w-full bg-brand-background border border-brand-navy/10 px-6 py-4 text-[11px] font-bold tracking-wider outline-none focus:border-secondary transition-all" 
                   />
                </div>
                <div className="space-y-2 group">
                   <label className="text-[9px] font-bold uppercase tracking-widest text-brand-text-muted italic">Inventory Buffer</label>
                   <input 
                     name="stock" 
                     type="number" 
                     defaultValue="0" 
                     required 
                     className="w-full bg-brand-background border border-brand-navy/10 px-6 py-4 text-[11px] font-bold tracking-wider outline-none focus:border-secondary transition-all" 
                   />
                </div>
             </div>
          </section>

          {/* Optical Matrix (Specifications) */}
          <section className="bg-white border border-brand-navy/5 p-8 lg:p-12 space-y-10 shadow-sm relative overflow-hidden">
             <div className="flex items-center gap-4 mb-2">
                <Maximize2 size={16} className="text-secondary" />
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-navy">Optical Matrix (Specs & Variants)</h3>
             </div>
             
             <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center md:text-left mb-8">
                {[
                  { label: "Frame Protocol", name: "frame_type", options: ["Full-Rim", "Half-Rim", "Rimless"] },
                  { label: "Unit Geometry", name: "shape", options: ["Round", "Square", "Aviator", "Rectangular", "Cat-Eye"] },
                  { label: "Material Composition", name: "material", options: ["Metal", "Plastic", "Titanium", "Carbon-Fiber"] },
                  { label: "Gender Designation", name: "gender", options: ["Men", "Women", "Unisex", "Kids"] },
                  { label: "Chroma Profile", name: "color", options: ["Black", "Gold", "Silver", "Tortoise", "Crystal"] },
                  { label: "Scale Factor", name: "size", options: ["Small", "Medium", "Large"] },
                ].map((spec) => (
                  <div key={spec.name} className="space-y-2 group">
                     <label className="text-[9px] font-bold uppercase tracking-widest text-brand-text-muted italic">{spec.label}</label>
                     <select 
                       name={spec.name} 
                       className="w-full bg-brand-background border border-brand-navy/10 px-4 py-3 text-[10px] font-bold tracking-widest uppercase outline-none focus:border-secondary transition-all cursor-pointer"
                     >
                       <option value="">N/A</option>
                       {spec.options.map(opt => <option key={opt} value={opt.toLowerCase()}>{opt}</option>)}
                     </select>
                  </div>
                ))}
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-brand-navy/5">
                <div className="space-y-2 group">
                   <label className="text-[9px] font-bold uppercase tracking-widest text-brand-text-muted transition-colors group-focus-within:text-secondary italic">
                     Technical Specifications (JSON Array or Object)
                   </label>
                   <textarea 
                     name="specifications"
                     defaultValue="{}"
                     rows={4} 
                     className="w-full bg-brand-background border border-brand-navy/10 px-6 py-4 text-[10px] font-mono tracking-wider outline-none focus:border-secondary transition-all resize-none"
                   />
                </div>
                <div className="space-y-2 group">
                   <label className="text-[9px] font-bold uppercase tracking-widest text-brand-text-muted transition-colors group-focus-within:text-secondary italic">
                     Variants Matrix (JSON Array)
                   </label>
                   <textarea 
                     name="variants"
                     defaultValue="[]"
                     rows={4} 
                     className="w-full bg-brand-background border border-brand-navy/10 px-6 py-4 text-[10px] font-mono tracking-wider outline-none focus:border-secondary transition-all resize-none"
                   />
                </div>
             </div>
          </section>
        </div>

        {/* Right Column: Imagery & Options */}
        <div className="lg:col-span-4 space-y-12">
          {/* Lens Options */}
          <section className="bg-[#000000] text-white p-8 lg:p-10 space-y-8 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 blur-3xl group-hover:bg-secondary/10 transition-all duration-1000"></div>
             <div className="space-y-2 border-b border-white/5 pb-6">
                <div className="flex items-center gap-4 mb-1">
                   <Cpu size={16} className="text-secondary" />
                   <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">Neural Lens Modules</h3>
                </div>
                <p className="text-[8px] text-white/30 uppercase tracking-widest font-bold italic">Select available technology packages</p>
             </div>
             
             <div className="space-y-4">
                {[
                  { label: "Single Vision Pro", name: "has_single_vision" },
                  { label: "Bifocal Matrix", name: "has_bifocal" },
                  { label: "Progressive HD", name: "has_progressive" },
                  { label: "Blue Cut Shield", name: "has_blue_cut" },
                  { label: "Zero Power Lens", name: "has_zero_power" },
                ].map((opt) => (
                  <label key={opt.name} className="flex items-center justify-between p-4 border border-white/5 bg-white/5 hover:bg-white/10 transition-all cursor-pointer group/opt">
                     <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 group-hover/opt:text-white">{opt.label}</span>
                     <input type="checkbox" name={opt.name} value="true" className="w-4 h-4 accent-secondary bg-black" defaultChecked />
                  </label>
                ))}
                <label className="flex items-center justify-between p-4 border border-secondary/20 bg-secondary/5 hover:bg-secondary/10 transition-all cursor-pointer group/opt mt-6">
                     <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Mark as Featured Model</span>
                     <input type="checkbox" name="is_featured" value="true" className="w-4 h-4 accent-secondary bg-black" />
                </label>
             </div>
          </section>

          {/* Visual Assets */}
          <section className="bg-white border border-brand-navy/5 p-8 lg:p-10 space-y-8 shadow-sm">
             <div className="flex items-center gap-4 mb-2">
                <Camera size={16} className="text-secondary" />
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-navy">Visual Interface</h3>
             </div>
             
             <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[9px] font-bold uppercase tracking-widest text-brand-text-muted italic">Primary Model Image (URL)</label>
                   <input 
                     name="primary_image" 
                     required 
                     placeholder="https://..." 
                     className="w-full bg-brand-background border border-brand-navy/10 px-4 py-3 text-[10px] font-medium tracking-wider outline-none focus:border-secondary transition-all" 
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[9px] font-bold uppercase tracking-widest text-brand-text-muted italic">Additional Images (Comma Separated URLs)</label>
                   <textarea 
                     name="additional_images"
                     rows={3}
                     placeholder="https://img1..., https://img2..."
                     className="w-full bg-brand-background border border-brand-navy/10 px-4 py-3 text-[10px] font-mono tracking-wider outline-none focus:border-secondary transition-all resize-none"
                   />
                </div>
                <div className="space-y-2 p-4 border border-brand-navy/10 bg-brand-background">
                   <label className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-brand-navy italic">
                     <Zap size={10} className="text-secondary" /> 360° Sequence Data (JSON Array of URLs)
                   </label>
                   <textarea 
                     name="images_360"
                     defaultValue="[]"
                     rows={3}
                     className="w-full bg-transparent border-t border-brand-navy/10 mt-3 pt-3 text-[10px] font-mono tracking-wider outline-none resize-none"
                   />
                </div>
             </div>
          </section>

          {/* Finalize Deployment */}
          <div className="pt-8">
             <button type="submit" className="w-full bg-brand-navy text-white text-[10px] font-bold uppercase tracking-[0.4em] py-6 shadow-xl hover:bg-secondary transition-all duration-700 flex items-center justify-center gap-4 active:scale-95">
                <Save size={18} />
                AUTHORIZE DEPLOYMENT
             </button>
             <p className="text-center text-[7px] text-brand-navy/20 uppercase font-bold tracking-widest mt-6 italic">Protocol v4.0.2 - Authorized Personnel Only</p>
          </div>
        </div>
      </form>
    </div>
  );
}
