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
} from "recharts";

interface ChartsProps {
  data: {
    date: string;
    revenue: number;
    orders: number;
  }[];
}

const tooltipStyle = {
  contentStyle: {
    backgroundColor: "#ffffff",
    border: "1px solid #ECEFF5",
    borderRadius: "10px",
    fontSize: "12px",
    color: "#111111",
    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
  },
  itemStyle: { color: "#333333" },
  labelStyle: { color: "#888888", fontWeight: 600, fontSize: 11 },
};

const axisProps = {
  axisLine: false,
  tickLine: false,
  tick: { fontSize: 10, fill: "#AAAAAA" },
};

export default function DashboardCharts({ data }: ChartsProps) {
  const totalRevenue = data.reduce((acc, d) => acc + d.revenue, 0);
  const totalOrders = data.reduce((acc, d) => acc + d.orders, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue Chart */}
      <div className="bg-white border border-[#ECEFF5] rounded-2xl p-6">
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="text-xs text-[#AAAAAA] font-medium mb-1">Revenue — last 7 days</p>
            <p className="text-2xl font-bold text-[#111111]">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#004AAD" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#004AAD" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
              <XAxis dataKey="date" {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip {...tooltipStyle} />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue (₹)"
                stroke="#004AAD"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#revGrad)"
                dot={false}
                activeDot={{ r: 4, fill: "#004AAD" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Orders Chart */}
      <div className="bg-white border border-[#ECEFF5] rounded-2xl p-6">
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="text-xs text-[#AAAAAA] font-medium mb-1">Orders — last 7 days</p>
            <p className="text-2xl font-bold text-[#111111]">{totalOrders}</p>
          </div>
        </div>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
              <XAxis dataKey="date" {...axisProps} />
              <YAxis {...axisProps} allowDecimals={false} />
              <Tooltip {...tooltipStyle} />
              <Bar
                dataKey="orders"
                name="Orders"
                fill="#EEF2FF"
                stroke="#004AAD"
                strokeWidth={1}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
