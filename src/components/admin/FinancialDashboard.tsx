"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from "recharts";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Calendar, 
  ArrowUpRight,
  Download,
  Filter,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { exportTransactionMatrix } from "@/app/admin/reports/data_actions";

const COLORS = ["#D4AF37", "#1A1A1A", "#4A4A4A", "#8A8A8A"];

export default function FinancialDashboard({ 
  summary, 
  revenueStream, 
  sectorDistribution 
}: { 
  summary: any, 
  revenueStream: any[], 
  sectorDistribution: any[] 
}) {

  const handleExport = async () => {
    const csv = await exportTransactionMatrix();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `lenzify_transaction_matrix_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-brand-navy/5 pb-10">
        <div className="space-y-2">
           <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary italic">System Intelligence</p>
          <h1 className="text-4xl md:text-5xl font-serif italic text-brand-navy tracking-tight uppercase">Analytical <span className="text-secondary">Summary</span></h1>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={handleExport}
             className="px-8 py-4 bg-white border border-brand-navy/10 text-[10px] font-bold uppercase tracking-widest text-brand-navy flex items-center gap-4 hover:border-secondary transition-all shadow-sm active:scale-95"
           >
              <Download size={16} className="text-secondary" />
              Export Protocol Data
           </button>
        </div>
      </header>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
         {[
           { label: "Total Revenue", value: `₹${summary.totalRevenue.toLocaleString()}`, trend: "+14.2% (Est)", icon: DollarSign },
           { label: "Conversion rate", value: `${summary.conversionRate}%`, trend: "+1.8%", icon: TrendingUp },
           { label: "Order Volume", value: summary.orderVolume.toString(), trend: "+5.1%", icon: ShoppingCart },
           { label: "Customer Acquisition", value: summary.customerCount.toString(), trend: "+8.4%", icon: Users },
         ].map((stat, i) => (
           <div key={i} className="bg-white border border-brand-navy/5 p-8 space-y-6 group hover:border-secondary transition-all">
              <div className="flex justify-between items-start">
                 <div className="w-10 h-10 bg-brand-background flex items-center justify-center text-brand-navy group-hover:bg-brand-navy group-hover:text-white transition-all">
                    <stat.icon size={18} />
                 </div>
                 <div className="flex items-center gap-1 text-[10px] font-bold text-secondary italic">
                    <ArrowUpRight size={14} />
                    {stat.trend}
                 </div>
              </div>
              <div>
                 <p className="text-[9px] text-brand-navy/30 uppercase font-black tracking-widest mb-1 italic">{stat.label}</p>
                 <h3 className="text-2xl font-serif font-black italic text-brand-navy">{stat.value}</h3>
              </div>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
         {/* Main Revenue Chart */}
         <div className="lg:col-span-8 bg-white border border-brand-navy/5 p-10 lg:p-14 space-y-12 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/[0.01] -mr-32 -mt-32 rounded-full blur-3xl"></div>
            
            <div className="flex justify-between items-end border-b border-brand-navy/5 pb-8 relative">
               <div className="space-y-1">
                  <h2 className="text-2xl font-serif italic text-brand-navy">Revenue Stream</h2>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-brand-text-muted">7-Day Transaction Matrix</p>
               </div>
            </div>

            <div className="h-[400px] w-full mt-10">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueStream} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                     <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                     <XAxis 
                       dataKey="name" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fontSize: 10, fill: '#888', fontWeight: 'bold' }} 
                       dy={10}
                     />
                     <YAxis 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fontSize: 10, fill: '#888', fontWeight: 'bold' }} 
                       tickFormatter={(value) => `₹${value >= 1000 ? value/1000 + 'k' : value}`}
                     />
                     <Tooltip 
                       contentStyle={{ backgroundColor: '#000', border: 'none', color: '#fff' }}
                       itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                       labelStyle={{ display: 'none' }}
                     />
                     <Area 
                       type="monotone" 
                       dataKey="value" 
                       stroke="#D4AF37" 
                       strokeWidth={3} 
                       fillOpacity={1} 
                       fill="url(#colorValue)" 
                       animationDuration={2000}
                     />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Sector Distribution */}
         <div className="lg:col-span-4 bg-[#000000] text-white p-10 lg:p-14 space-y-12 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/10 blur-[100px] group-hover:bg-secondary/20 transition-all duration-1000"></div>
            
            <div className="space-y-4">
               <h2 className="text-2xl font-serif italic text-secondary uppercase tracking-tight">Sector <br/>Performance</h2>
               <div className="h-px w-12 bg-secondary"></div>
            </div>

            <div className="h-[300px] w-full flex items-center justify-center">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie
                        data={sectorDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                     >
                        {sectorDistribution.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                     </Pie>
                     <Tooltip />
                  </PieChart>
               </ResponsiveContainer>
            </div>

            <div className="space-y-4">
               {sectorDistribution.map((item, i) => (
                 <div key={i} className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                       <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                       <span className="text-white/60">{item.name}</span>
                    </div>
                    <span className="text-white italic">{item.value}%</span>
                 </div>
               ))}
               {sectorDistribution.length === 0 && (
                 <p className="text-[10px] text-white/20 uppercase tracking-widest text-center italic py-20">Analyzing Sector Data...</p>
               )}
            </div>
         </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
         <div className="bg-white border border-brand-navy/5 p-10 space-y-8 shadow-sm">
            <div className="flex items-center justify-between">
               <h3 className="text-xl font-serif italic text-brand-navy">Engagement Matrix</h3>
               <Zap size={16} className="text-secondary" />
            </div>
            <div className="space-y-6">
               {[
                 { label: "Abandoned Cart Rate", value: "24.2% (Mock)", color: "bg-red-500" },
                 { label: "Repeat Purchase Rate", value: "18.5% (Mock)", color: "bg-secondary" },
                 { label: "Average Session Value", value: "12m 45s (Mock)", color: "bg-brand-navy" },
               ].map((item, i) => (
                 <div key={i} className="space-y-3">
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                       <span className="text-brand-navy/40">{item.label}</span>
                       <span className="text-brand-navy italic">{item.value}</span>
                    </div>
                    <div className="h-1 bg-brand-background w-full">
                       <div 
                         className={cn("h-full transition-all duration-1000 ease-out", item.color)} 
                         style={{ width: item.value.includes('%') ? item.value : '100%' }}
                       />
                    </div>
                 </div>
               ))}
            </div>
         </div>
         
         <div className="bg-white border border-brand-navy/5 p-10 space-y-8 shadow-sm border-t-4 border-t-secondary">
            <h3 className="text-xl font-serif italic text-brand-navy leading-tight">Insight <br/>Directives</h3>
            <p className="text-[10px] text-brand-text-muted leading-relaxed uppercase tracking-[0.2em] font-bold italic">Algorithm suggests targeting categories with low sector distribution using seasonalクーポン protocols to lift acquisition by 8.4%.</p>
            <button className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary hover:text-brand-navy transition-all flex items-center gap-3 group">
              INITIATE CAMPAIGN
              <ArrowUpRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
         </div>
      </div>
    </div>
  );
}
