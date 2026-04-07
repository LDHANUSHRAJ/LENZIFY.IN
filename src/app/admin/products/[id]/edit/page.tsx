import { updateProduct } from "../../actions";
import { 
  Package, 
  Tag, 
  Info, 
  Camera, 
  Maximize2, 
  Cpu, 
  Save, 
  ArrowLeft,
  Eye,
  Trash2,
  Plus
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Fetch Product Data
  const { data: product, error } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .eq("id", id)
    .single();

  if (error || !product) notFound();

  // 2. Fetch Categories
  const { data: categories } = await supabase.from("categories").select("*");

  const primaryImage = product.product_images?.find((img: any) => img.is_primary)?.image_url || "";
  const additionalImages = product.product_images?.filter((img: any) => !img.is_primary).map((img: any) => img.image_url).join(", ");

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 border-b border-brand-navy/5 pb-10">
        <div className="space-y-2">
           <Link href="/admin/products" className="text-[9px] font-bold uppercase tracking-[0.4em] text-secondary flex items-center gap-2 hover:translate-x-1 transition-transform mb-4">
              <ArrowLeft size={10} />
              Return to Catalog
           </Link>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary italic">Step 02: Resource Calibration</p>
          <h1 className="text-4xl md:text-5xl font-serif italic text-brand-navy tracking-tight">Recalibrate <span className="text-secondary">Model</span></h1>
          <p className="text-[9px] text-brand-navy/30 uppercase font-bold tracking-[0.2em] mt-2 italic">Ref Node: {product.id}</p>
        </div>
        <div className="flex gap-4">
           <Link href={`/products/${product.id}`} target="_blank" className="px-8 py-4 bg-white border border-brand-navy/10 text-[9px] font-black uppercase tracking-widest text-brand-navy hover:bg-brand-background transition-all flex items-center gap-3">
              <Eye size={14} />
              Live Preview
           </Link>
        </div>
      </header>

      <form action={updateProduct.bind(null, product.id)} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
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
                   <label className="text-[9px] font-bold uppercase tracking-widest text-brand-text-muted italic">Model Designation</label>
                   <input 
                      name="name" 
                      defaultValue={product.name} 
                      required 
                      className="w-full bg-brand-background border border-brand-navy/10 px-6 py-4 text-[11px] font-medium tracking-wider outline-none focus:border-secondary transition-all" 
                   />
                </div>
                <div className="space-y-2 group">
                   <label className="text-[9px] font-bold uppercase tracking-widest text-brand-text-muted italic">Brand Authority</label>
                   <input 
                      name="brand" 
                      defaultValue={product.brand} 
                      required 
                      className="w-full bg-brand-background border border-brand-navy/10 px-6 py-4 text-[11px] font-medium tracking-wider outline-none focus:border-secondary transition-all" 
                   />
                </div>
                <div className="space-y-2 group">
                   <label className="text-[9px] font-bold uppercase tracking-widest text-brand-text-muted italic">Unit SKU (Unique)</label>
                   <input 
                      name="sku" 
                      defaultValue={product.sku} 
                      required 
                      className="w-full bg-brand-background border border-brand-navy/10 px-6 py-4 text-[11px] font-bold tracking-wider outline-none focus:border-secondary transition-all uppercase" 
                   />
                </div>
                <div className="space-y-2 group">
                   <label className="text-[9px] font-bold uppercase tracking-widest text-brand-text-muted italic">Deployment Sector</label>
                   <select 
                      name="category_id" 
                      defaultValue={product.category_id} 
                      required 
                      className="w-full bg-brand-background border border-brand-navy/10 px-6 py-4 text-[11px] font-bold tracking-widest uppercase outline-none focus:border-secondary transition-all cursor-pointer appearance-none"
                   >
                     {categories?.map((cat) => (
                       <option key={cat.id} value={cat.id}>{cat.name}</option>
                     ))}
                   </select>
                </div>
             </div>

             <div className="space-y-2 group">
                <label className="text-[9px] font-bold uppercase tracking-widest text-brand-text-muted italic">Tactical Brief (Description)</label>
                <textarea 
                   name="description" 
                   defaultValue={product.description} 
                   rows={4} 
                   required 
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
                      defaultValue={product.price}
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
                      defaultValue={product.offer_price || ""}
                      className="w-full bg-brand-background border border-brand-navy/10 px-6 py-4 text-[11px] font-bold tracking-wider outline-none focus:border-secondary transition-all" 
                   />
                </div>
                <div className="space-y-2 group">
                   <label className="text-[9px] font-bold uppercase tracking-widest text-brand-text-muted italic">Inventory Buffer</label>
                   <input 
                      name="stock" 
                      type="number" 
                      defaultValue={product.stock}
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
                        defaultValue={product[spec.name as keyof typeof product] || ""}
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
                     defaultValue={JSON.stringify(product.specifications || {})}
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
                     defaultValue={JSON.stringify(product.variants || [])}
                     rows={4} 
                     className="w-full bg-brand-background border border-brand-navy/10 px-6 py-4 text-[10px] font-mono tracking-wider outline-none focus:border-secondary transition-all resize-none"
                   />
                </div>
             </div>
          </section>

          {/* 360° Interaction Matrix */}
          <section className="bg-white border border-brand-navy/5 p-8 lg:p-12 space-y-10 shadow-sm">
             <div className="flex items-center justify-between mb-4 border-b border-brand-navy/5 pb-6">
                <div className="flex items-center gap-4">
                   <Package size={16} className="text-secondary" />
                   <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-navy">360° Sequence Matrix</h3>
                </div>
             </div>
             <div className="space-y-6">
                <p className="text-[9px] text-brand-navy/40 uppercase tracking-widest font-bold italic leading-relaxed">Input multiple view-angle URLs as a JSON array for interactive model rotation.</p>
                <textarea 
                   name="images_360" 
                   defaultValue={JSON.stringify(product.images_360 || [])}
                   rows={3} 
                   className="w-full bg-brand-background border border-brand-navy/10 px-6 py-4 text-[10px] font-mono tracking-wider outline-none focus:border-secondary transition-all" 
                   placeholder='["https://.../angle1.jpg", "https://.../angle2.jpg"]'
                />
             </div>
          </section>
        </div>

        {/* Right Column: Imagery & Options */}
        <div className="lg:col-span-4 space-y-12">
          {/* Status Matrix */}
          <section className="bg-brand-navy text-white p-8 lg:p-10 space-y-8 shadow-xl">
             <div className="space-y-2 border-b border-white/5 pb-6">
                <div className="flex items-center gap-4 mb-1">
                   <Package size={16} className="text-secondary" />
                   <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">System Status</h3>
                </div>
             </div>
             <div className="space-y-4">
                <label className="flex items-center justify-between p-4 border border-white/5 bg-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                   <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Product Active</span>
                   <input type="checkbox" name="is_enabled" value="true" defaultChecked={product.is_enabled} className="w-4 h-4 accent-secondary" />
                </label>
                <label className="flex items-center justify-between p-4 border border-white/5 bg-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                   <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Featured Model</span>
                   <input type="checkbox" name="is_featured" value="true" defaultChecked={product.is_featured} className="w-4 h-4 accent-secondary" />
                </label>
             </div>
          </section>

          {/* Visual Interface */}
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
                      defaultValue={primaryImage}
                      required 
                      className="w-full bg-brand-background border border-brand-navy/10 px-4 py-3 text-[10px] font-medium tracking-wider outline-none focus:border-secondary transition-all" 
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[9px] font-bold uppercase tracking-widest text-brand-text-muted italic">Additional Buffers (Comma separated URLs)</label>
                   <textarea 
                      name="additional_images" 
                      defaultValue={additionalImages}
                      rows={4}
                      className="w-full bg-brand-background border border-brand-navy/10 px-4 py-3 text-[10px] font-medium tracking-wider outline-none focus:border-secondary transition-all resize-none" 
                   />
                </div>
             </div>
          </section>

          {/* Lens Technology Packages */}
          <section className="bg-[#000000] text-white p-8 lg:p-10 space-y-8 relative overflow-hidden group">
             <div className="space-y-2 border-b border-white/5 pb-6">
                <div className="flex items-center gap-4 mb-1">
                   <Cpu size={16} className="text-secondary" />
                   <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">Neural Lens Modules</h3>
                </div>
             </div>
             <div className="space-y-4">
                {[
                  { label: "Single Vision Pro", name: "specifications.has_single_vision" },
                  { label: "Bifocal Matrix", name: "specifications.has_bifocal" },
                  { label: "Progressive HD", name: "specifications.has_progressive" },
                  { label: "Blue Cut Shield", name: "specifications.has_blue_cut" },
                  { label: "Zero Power Lens", name: "specifications.has_zero_power" },
                ].map((opt) => (
                  <label key={opt.name} className="flex items-center justify-between p-4 border border-white/5 bg-white/5 hover:bg-white/10 transition-all cursor-pointer group/opt">
                     <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 group-hover/opt:text-white">{opt.label}</span>
                     <input 
                        type="checkbox" 
                        name={opt.name} 
                        value="true" 
                        defaultChecked={product.specifications?.[opt.name.split('.')[1]]} 
                        className="w-4 h-4 accent-secondary bg-black" 
                     />
                  </label>
                ))}
             </div>
          </section>

          {/* Finalize Re-deployment */}
          <div className="pt-8">
             <button type="submit" className="w-full bg-brand-navy text-white text-[10px] font-bold uppercase tracking-[0.4em] py-6 shadow-xl hover:bg-secondary transition-all duration-700 flex items-center justify-center gap-4 active:scale-95">
                <Save size={18} />
                AUTHORIZE RE-DEPLOYMENT
             </button>
             <p className="text-center text-[7px] text-brand-navy/20 uppercase font-bold tracking-widest mt-6 italic">Protocol v4.0.2 - Tactical Calibration</p>
          </div>
        </div>
      </form>
    </div>
  );
}
