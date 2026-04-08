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

      <form action={async (formData) => { "use server"; await updateProduct(product.id, formData); }} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
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
                {/* Deployment sectors moved below */}
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

             {/* Deployment Sectors */}
             <div className="pt-6 border-t border-brand-navy/5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-navy mb-6 block">Deployment Sectors</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {[
                     { label: "1. Gender", name: "gender", options: ["Men", "Women", "Unisex", "Kids"], selected: product.gender?.split(", ") || [] },
                     { label: "2. Product Type", name: "product_type", options: ["Eyeglasses", "Sunglasses", "Computer Glasses", "Reading Glasses", "Contact Lenses", "Accessories"], selected: product.specifications?.product_type || [] },
                     { label: "3. Collection / Display Section", name: "collection", options: ["New Arrivals", "Trending", "Best Sellers", "Premium Collection", "Budget Collection", "Featured"], selected: product.specifications?.collection || [] },
                     { label: "4. Usage Type", name: "usage_type", options: ["Daily Wear", "Office Wear", "Gaming / Blue Light", "Driving", "Sports", "Fashion"], selected: product.specifications?.usage_type || [] },
                     { label: "5. Frame Style", name: "frame_style", options: ["Full Rim", "Half Rim", "Rimless", "Transparent", "Thick Frame", "Thin Frame"], selected: product.frame_type?.split(", ") || [] },
                     { label: "6. Material", name: "material", options: ["Metal", "Acetate", "TR90", "Titanium", "Plastic"], selected: product.material?.split(", ") || [] }
                   ].map((sector) => (
                     <div key={sector.name} className="space-y-3">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-brand-text-muted italic">{sector.label}</label>
                        <div className="grid grid-cols-2 gap-2">
                           {sector.options.map((opt) => (
                              <label key={opt} className="flex items-center gap-2 p-2 border border-brand-navy/5 hover:border-secondary/50 transition-all cursor-pointer bg-brand-background/50 group/check">
                                 <input 
                                    type="checkbox" 
                                    name={sector.name} 
                                    value={opt} 
                                    defaultChecked={sector.selected.includes(opt)}
                                    className="accent-secondary" 
                                 />
                                 <span className="text-[9px] font-bold uppercase tracking-wider text-brand-navy/70 group-hover/check:text-brand-navy">{opt}</span>
                              </label>
                           ))}
                        </div>
                     </div>
                   ))}
                </div>
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
                  { label: "Unit Geometry", name: "shape", options: ["Round", "Square", "Aviator", "Rectangular", "Cat-Eye"] },
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
                <div className="space-y-4">
                   <label className="text-[9px] font-bold uppercase tracking-widest text-brand-text-muted italic">Primary Model Image</label>
                   {primaryImage && (
                     <div className="relative group/img w-full aspect-video bg-brand-background border border-brand-navy/5 overflow-hidden">
                        <img src={primaryImage} alt="Primary" className="w-full h-full object-contain p-4" />
                        <div className="absolute inset-0 bg-brand-navy/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                           <span className="text-[8px] font-bold text-white uppercase tracking-widest">Currently Active</span>
                        </div>
                     </div>
                   )}
                   <input 
                      type="file"
                      name="primary_image_file" 
                      accept="image/*"
                      className="w-full bg-brand-background border border-brand-navy/10 px-4 py-3 text-[10px] font-medium tracking-wider outline-none focus:border-secondary transition-all file:mr-4 file:py-2 file:px-4 file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-brand-navy file:text-white cursor-pointer" 
                   />
                   <p className="text-[7px] text-brand-navy/30 uppercase font-bold italic">Leave empty to retain current primary image</p>
                </div>
                <div className="space-y-4 pt-4 border-t border-brand-navy/5">
                   <label className="text-[9px] font-bold uppercase tracking-widest text-brand-text-muted italic">Additional Buffers (Current: {additionalImages ? additionalImages.split(',').length : 0})</label>
                   <input 
                      type="file"
                      name="additional_images_files" 
                      accept="image/*"
                      multiple
                      className="w-full bg-brand-background border border-brand-navy/10 px-4 py-3 text-[10px] font-medium tracking-wider outline-none focus:border-secondary transition-all file:mr-4 file:py-2 file:px-4 file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-brand-navy file:text-white cursor-pointer" 
                   />
                   <p className="text-[7px] text-brand-navy/30 uppercase font-bold italic">Uploading new files will APPEND to the existing additional images</p>
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
