import { createClient } from "@/lib/supabase/server";
import { Shield, ShieldAlert, ShieldCheck, UserPlus, Trash2 } from "lucide-react";
import { createStaffMember, deleteStaffMember } from "./actions";

export default async function AdminStaffPage() {
  const supabase = await createClient();
  const { data: staff, error } = await supabase.from("admins").select("*").order("role");

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-brand-navy/5">
        <div>
           <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary italic mb-2">Protocol Command</p>
          <h1 className="text-4xl font-serif italic text-brand-navy tracking-tight uppercase">Admin <span className="text-secondary">Matrix</span></h1>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 border-t pt-10 border-brand-navy/5">
        
        {/* ADD STAFF FORM */}
        <div className="xl:col-span-4 max-w-sm w-full space-y-8 sticky top-10 self-start">
          <section className="bg-brand-navy p-8 lg:p-10 text-white shadow-xl">
             <div className="flex items-center gap-4 border-b border-white/10 pb-6 mb-8">
                <UserPlus size={16} className="text-secondary" />
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">Authorize Personnel</h3>
             </div>
             
             <form action={async (formData) => { "use server"; await createStaffMember(formData); }} className="space-y-8">
                <div className="space-y-2 group">
                   <label className="text-[9px] font-bold uppercase tracking-widest text-white/50 italic">Full Directive Alias</label>
                   <input required name="name" placeholder="John Doe" className="w-full bg-white/5 border border-white/10 px-4 py-3 text-[11px] font-bold tracking-widest outline-none focus:border-secondary transition-all placeholder:text-white/20" />
                </div>
                
                <div className="space-y-2 group">
                   <label className="text-[9px] font-bold uppercase tracking-widest text-white/50 italic">Communication Vector</label>
                   <input required name="email" type="email" placeholder="john@lenzify.in" className="w-full bg-white/5 border border-white/10 px-4 py-3 text-[11px] font-bold tracking-widest outline-none focus:border-secondary transition-all placeholder:text-white/20 lowercase" />
                </div>

                <div className="space-y-2 group">
                   <label className="text-[9px] font-bold uppercase tracking-widest text-white/50 italic">Clearance Level</label>
                   <select required name="role" className="w-full bg-brand-navy border border-white/10 px-4 py-3 text-[11px] font-bold tracking-widest outline-none focus:border-secondary transition-all appearance-none cursor-pointer text-white">
                      <option value="super admin">Super Admin (Omega Clearance)</option>
                      <option value="manager">Manager (Alpha Clearance)</option>
                      <option value="staff">Staff (Beta Clearance)</option>
                   </select>
                </div>

                <div className="pt-4">
                   <button type="submit" className="w-full bg-secondary text-brand-navy hover:bg-white text-[10px] font-bold uppercase tracking-[0.4em] py-5 shadow-xl transition-all duration-500">
                      Grant Access
                   </button>
                </div>
             </form>
          </section>
        </div>

        {/* STAFF DIRECTORY */}
        <div className="xl:col-span-8 flex flex-col gap-6">
           {staff?.map((s) => (
             <div key={s.id} className="bg-white border border-brand-navy/5 shadow-sm p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 group hover:border-secondary transition-all">
                <div className="flex items-center gap-6 w-full md:w-auto">
                   <div className="w-16 h-16 bg-brand-background flex items-center justify-center border border-brand-navy/5 shrink-0">
                      {s.role === 'super admin' ? <ShieldAlert size={20} className="text-secondary" /> : 
                       s.role === 'manager' ? <ShieldCheck size={20} className="text-brand-navy/40" /> : 
                       <Shield size={20} className="text-brand-navy/20" />}
                   </div>
                   <div>
                      <h3 className="text-xl font-serif font-black tracking-tight text-brand-navy">{s.name}</h3>
                      <p className="text-[10px] text-brand-navy/40 uppercase font-black tracking-widest mt-1 mb-2">{s.email}</p>
                      <span className="inline-block text-[8px] bg-brand-background text-brand-navy px-3 py-1 uppercase tracking-widest font-black border border-brand-navy/10">{s.role}</span>
                   </div>
                </div>

                <div className="shrink-0">
                   <form action={async () => { "use server"; await deleteStaffMember(s.id); }}>
                      <button className="p-4 bg-brand-background hover:bg-red-50 border border-transparent hover:border-red-100 text-brand-navy/30 hover:text-red-500 transition-all shadow-sm">
                         <Trash2 size={16} />
                      </button>
                   </form>
                </div>
             </div>
           ))}
           
           {staff?.length === 0 && (
             <div className="py-32 text-center bg-white border border-brand-navy/5 shadow-sm">
                 <Shield size={48} className="mx-auto text-brand-navy/[0.05] mb-6" />
                 <h3 className="text-xl font-serif italic text-brand-navy uppercase tracking-widest">No Authorized Personnel</h3>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
