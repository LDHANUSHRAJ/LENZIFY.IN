"use client";

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  Cell
} from "recharts";

interface ChartsProps {
  data: {
    date: string;
    revenue: number;
    orders: number;
  }[];
}

export default function DashboardCharts({ data }: ChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Revenue Area Chart */}
      <div className="bg-white border border-brand-navy/5 p-10 shadow-sm relative overflow-hidden group">
        <div className="flex items-center justify-between mb-10 border-b border-brand-navy/5 pb-6">
          <div className="space-y-1">
            <h2 className="text-xl font-serif italic text-brand-navy uppercase tracking-tight">Revenue <span className="text-secondary">Nexus</span></h2>
            <p className="text-[9px] font-bold uppercase tracking-widest text-brand-text-muted italic">7-Day Economic Calibration</p>
          </div>
          <div className="text-right">
             <p className="text-sm font-bold text-brand-navy">₹{data.reduce((acc, curr) => acc + curr.revenue, 0).toLocaleString()}</p>
             <p className="text-[8px] uppercase tracking-widest text-secondary font-black">Total Period Yield</p>
          </div>
        </div>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#775a19" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#775a19" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(28, 27, 27, 0.05)" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 9, fontWeight: 700, fill: "rgba(28, 27, 27, 0.3)" }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 9, fontWeight: 700, fill: "rgba(28, 27, 27, 0.3)" }} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#000000", 
                  border: "none", 
                  borderRadius: "0px",
                  fontSize: "10px",
                  fontWeight: "bold",
                  color: "#ffffff"
                }}
                itemStyle={{ color: "#e9c176" }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#775a19" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Orders Bar Chart */}
      <div className="bg-[#000000] text-white p-10 shadow-xl relative overflow-hidden group">
        <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-6">
          <div className="space-y-1">
            <h2 className="text-xl font-serif italic text-secondary uppercase tracking-tight">Order <span className="text-white">Lifecycle</span></h2>
            <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 italic">Volumetric Transaction Analysis</p>
          </div>
          <div className="text-right">
             <p className="text-sm font-bold text-white">{data.reduce((acc, curr) => acc + curr.orders, 0)}</p>
             <p className="text-[8px] uppercase tracking-widest text-secondary font-black">Total Protocols</p>
          </div>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.05)" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 9, fontWeight: 700, fill: "rgba(255, 255, 255, 0.2)" }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 9, fontWeight: 700, fill: "rgba(255, 255, 255, 0.2)" }} 
              />
              <Tooltip 
                cursor={{ fill: "rgba(255, 255, 255, 0.03)" }}
                contentStyle={{ 
                  backgroundColor: "#ffffff", 
                  border: "none", 
                  borderRadius: "0px",
                  fontSize: "10px",
                  fontWeight: "bold",
                  color: "#000000"
                }}
              />
              <Bar dataKey="orders" fill="#775a19" radius={[2, 2, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === data.length - 1 ? "#ffffff" : "#775a19"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
