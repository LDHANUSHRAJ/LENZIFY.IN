import { createClient } from "@/lib/supabase/server";
import { User, Shield, Key, History, Mail, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return <div className="py-20 text-center uppercase tracking-widest text-brand-navy/30">Unauthorized Access Protocol</div>;

  const metadata = user.user_metadata || {};
  const joinDate = new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-surface text-brand-navy min-h-screen pt-24 font-sans">
      <main className="max-w-7xl mx-auto px-8 md:px-12 py-20 pb-32">
        <div className="flex flex-col lg:flex-row gap-20 items-start">
          {/* Left: Identity Visualization */}
          <div className="w-full lg:w-1/3 space-y-10">
            <div className="bg-white border border-brand-navy/5 p-12 shadow-sm text-center space-y-8 relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-1 bg-secondary shadow-[0_0_15px_rgba(var(--brand-gold-rgb),0.3)]"></div>
               <div className="w-32 h-32 rounded-full border border-brand-navy/5 bg-brand-background mx-auto flex items-center justify-center relative overflow-hidden">
                  {metadata.avatar_url ? (
                    <img src={metadata.avatar_url} alt={metadata.name} className="w-full h-full object-cover" />
                  ) : (
                    <UserCircle size={80} className="text-brand-navy/10" />
                  )}
               </div>
               <div className="space-y-4">
                  <h2 className="text-3xl font-serif italic text-brand-navy font-black uppercase tracking-tight">{metadata.name || "Anonymous"}</h2>
                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-navy/30 italic">Active Since {joinDate}</p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-brand-navy text-white p-6 space-y-2 border border-brand-navy border-b-secondary border-b-2">
                  <p className="text-[8px] font-black uppercase tracking-widest text-white/30">Auth Status</p>
                  <p className="text-[10px] font-bold uppercase whitespace-nowrap">Verified Protocol</p>
               </div>
               <div className="bg-white border border-brand-navy/5 p-6 space-y-2">
                  <p className="text-[8px] font-black uppercase tracking-widest text-brand-navy/30">Access Level</p>
                  <p className="text-[10px] font-bold uppercase text-secondary">Base Identity</p>
               </div>
            </div>
          </div>

          {/* Right: Data Matrix */}
          <div className="flex-1 space-y-16">
            <div className="space-y-4 pb-8 border-b border-brand-navy/5">
                <h1 className="text-5xl font-serif italic text-brand-navy uppercase leading-none">Identity <span className="text-secondary">Matrix</span></h1>
                <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-brand-navy/30 italic">Registry Entry v.4.0.01</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               {/* Contact Block */}
               <section className="space-y-8 bg-white border border-brand-navy/5 p-10">
                  <div className="flex items-center gap-4 text-brand-navy">
                     <Mail size={18} className="text-secondary" />
                     <h3 className="text-xs font-black uppercase tracking-widest">Communication Channel</h3>
                  </div>
                  <div className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-brand-navy/30">Primary Logic Address</label>
                        <p className="text-sm font-serif italic font-black text-brand-navy lowercase">{user.email}</p>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-brand-navy/30">Verified Status</label>
                        <div className="flex items-center gap-2">
                           <Shield size={10} className="text-emerald-500" />
                           <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Encrypted & Validated</span>
                        </div>
                     </div>
                  </div>
               </section>

               {/* Meta Block */}
               <section className="space-y-8 bg-white border border-brand-navy/5 p-10">
                  <div className="flex items-center gap-4 text-brand-navy">
                     <User size={18} className="text-secondary" />
                     <h3 className="text-xs font-black uppercase tracking-widest">Attribute Metadata</h3>
                  </div>
                  <div className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-brand-navy/30">Display Identification</label>
                        <p className="text-sm font-serif italic font-black text-brand-navy uppercase">{metadata.name || 'Anonymous'}</p>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-brand-navy/30">Archive Hash</label>
                        <p className="text-[9px] font-mono text-brand-navy/40 truncate">{user.id}</p>
                     </div>
                  </div>
               </section>
            </div>

            {/* Security Section */}
            <section className="bg-brand-background border border-brand-navy/5 p-12 relative group">
                <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                   <div className="space-y-4">
                      <div className="flex items-center gap-4">
                         <Key size={20} className="text-secondary" />
                         <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-brand-navy">Security Protocol Layer</h3>
                      </div>
                      <p className="text-xs font-serif italic text-brand-navy/40 max-w-md">Update your synchronization parameters or reset your authentication matrix for maximum channel security.</p>
                   </div>
                   <button className="px-10 py-5 bg-brand-navy text-white text-[9px] font-black uppercase tracking-widest hover:bg-secondary transition-all shadow-xl active:scale-95">Update Security Key</button>
                </div>
            </section>

            {/* Recent History Prompt */}
            <section className="pt-8 border-t border-brand-navy/5 flex flex-col md:flex-row justify-between items-center gap-8">
               <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-white border border-brand-navy/5 flex items-center justify-center text-secondary shadow-sm">
                     <History size={20} />
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-black uppercase tracking-widest text-brand-navy">Last Synchronization</p>
                     <p className="text-[8px] font-bold text-brand-navy/30 uppercase tracking-[0.3em] italic">Archive Checked 2 minutes ago</p>
                  </div>
               </div>
               <div className="flex gap-4">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span className="text-[9px] font-black uppercase tracking-widest text-brand-navy/20">System Nominal // All Channels Active</span>
               </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
