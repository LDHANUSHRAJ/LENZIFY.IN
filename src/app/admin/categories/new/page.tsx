import { createCategory } from "../actions";
import { 
  Layers, 
  Tag, 
  Info, 
  Camera, 
  Save,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function NewCategoryPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select("id, name").eq("is_active", true);

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 border-b border-brand-navy/5 pb-10">
        <div className="space-y-2">
           <Link href="/admin/categories" className="text-[9px] font-bold uppercase tracking-[0.4em] text-secondary flex items-center gap-2 hover:translate-x-1 transition-transform mb-4">
              <ArrowLeft size={10} />
              Return to Sectors
           </Link>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary italic">Step 02: Sector Initialization</p>
          <h1 className="text-4xl md:text-5xl font-serif italic text-brand-navy tracking-tight">Allocate <span className="text-secondary">Sector</span></h1>
        </div>
      </header>

      <form action={async (formData) => { "use server"; await createCategory(formData); }} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          {/* General Information */}
          <section className="bg-white border border-brand-navy/5 p-8 lg:p-12 space-y-10 shadow-sm relative overflow-hidden">
             <div className="flex items-center gap-4 mb-2">
                <Info size={16} className="text-secondary" />
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-navy">Core Identification</h3>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 group">
                   <label className="text-[9px] font-bold uppercase tracking-widest text-brand-text-muted transition-colors group-focus-within:text-secondary italic">Sector Name</label>
                   <input 
                     name="name" 
                     required 
                     placeholder="e.g. Eyeglasses" 
                     className="w-full bg-brand-background border border-brand-navy/10 px-6 py-4 text-[11px] font-medium tracking-wider outline-none focus:border-secondary transition-all" 
                   />
                </div>
                <div className="space-y-2 group">
                   <label className="text-[9px] font-bold uppercase tracking-widest text-brand-text-muted transition-colors group-focus-within:text-secondary italic">URL Slug</label>
                   <input 
                     name="slug" 
                     required 
                     placeholder="eyeglasses" 
                     className="w-full bg-brand-background border border-brand-navy/10 px-6 py-4 text-[11px] font-medium tracking-wider outline-none focus:border-secondary transition-all lowercase" 
                   />
                </div>
             </div>
          </section>

          {/* Hierarchy */}
          <section className="bg-white border border-brand-navy/5 p-8 lg:p-12 space-y-10 shadow-sm relative overflow-hidden">
             <div className="flex items-center gap-4 mb-2">
                <Layers size={16} className="text-secondary" />
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-navy">Structural Hierarchy</h3>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 group">
                   <label className="text-[9px] font-bold uppercase tracking-widest text-brand-text-muted transition-colors group-focus-within:text-secondary italic">Parent Node (Optional)</label>
                   <select 
                     name="parent_id" 
                     className="w-full bg-brand-background border border-brand-navy/10 px-6 py-4 text-[11px] font-bold tracking-widest uppercase outline-none focus:border-secondary transition-all cursor-pointer appearance-none"
                   >
                     <option value="">Top-Level Sector</option>
                     {categories?.map((cat) => (
                       <option key={cat.id} value={cat.id}>{cat.name}</option>
                     ))}
                   </select>
                </div>
                <div className="space-y-2 group">
                   <label className="text-[9px] font-bold uppercase tracking-widest text-brand-text-muted transition-colors group-focus-within:text-secondary italic">Priority Sequence (Sort Order)</label>
                   <input 
                     type="number"
                     name="sort_order" 
                     defaultValue="0"
                     className="w-full bg-brand-background border border-brand-navy/10 px-6 py-4 text-[11px] font-medium tracking-wider outline-none focus:border-secondary transition-all" 
                   />
                </div>
             </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-12">
          {/* Status Matrix */}
          <section className="bg-brand-navy text-white p-8 lg:p-10 space-y-8 shadow-xl">
             <div className="space-y-2 border-b border-white/5 pb-6">
                <div className="flex items-center gap-4 mb-1">
                   <Tag size={16} className="text-secondary" />
                   <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">System Status</h3>
                </div>
             </div>
             <div className="space-y-4">
                <label className="flex items-center justify-between p-4 border border-white/5 bg-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                   <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Node Active</span>
                   <input type="checkbox" name="is_active" value="true" defaultChecked className="w-4 h-4 accent-secondary" />
                </label>
                <label className="flex items-center justify-between p-4 border border-white/5 bg-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                   <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Featured Designation</span>
                   <input type="checkbox" name="is_featured" value="true" className="w-4 h-4 accent-secondary" />
                </label>
             </div>
          </section>

          {/* Visual Interface */}
          <section className="bg-white border border-brand-navy/5 p-8 lg:p-10 space-y-8 shadow-sm">
             <div className="flex items-center gap-4 mb-2">
                <Camera size={16} className="text-secondary" />
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-navy">Visual Asset</h3>
             </div>
             <div className="space-y-4">
                <div className="space-y-2">
                   <label className="text-[9px] font-bold uppercase tracking-widest text-brand-text-muted italic">Sector Cover Image (URL)</label>
                   <input 
                     name="image_url" 
                     placeholder="https://..." 
                     className="w-full bg-brand-background border border-brand-navy/10 px-4 py-3 text-[10px] font-medium tracking-wider outline-none focus:border-secondary transition-all" 
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
          </div>
        </div>
      </form>
    </div>
  );
}
