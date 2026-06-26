"use client";

import {
  AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { TrendingUp, ShoppingCart, Users, BarChart3, CreditCard, Package } from "lucide-react";
import { cn } from "@/lib/utils";

const COLORS = ["#004AAD", "#009DFF", "#D4AF37", "#03173D", "#00C49F", "#FF6B6B", "#9B59B6", "#E67E22"];

const STATUS_LABELS: Record<string, string> = {
  delivered: "Delivered", shipped: "Shipped", confirmed: "Confirmed",
  pending: "Pending", cancelled: "Cancelled", returned: "Returned",
  refunded: "Refunded", packed: "Packed", out_for_delivery: "Out for Delivery",
};

const tooltipStyle = {
  contentStyle: { backgroundColor: "#fff", border: "1px solid #ECEFF5", borderRadius: 10, fontSize: 12, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" },
  itemStyle: { color: "#333" },
  labelStyle: { color: "#888", fontWeight: 600, fontSize: 11 },
};

const axisProps = { axisLine: false, tickLine: false, tick: { fontSize: 10, fill: "#AAAAAA" } };

function StatCard({ icon: Icon, label, value, sub, color }: { icon: any; label: string; value: string; sub?: string; color: string }) {
  return (
    <div className="bg-white border border-[#ECEFF5] rounded-2xl p-5 flex items-start gap-4">
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", color)}>
        <Icon size={18} strokeWidth={2} />
      </div>
      <div>
        <p className="text-xs text-[#AAAAAA] font-medium mb-1">{label}</p>
        <p className="text-xl font-bold text-[#111111]">{value}</p>
        {sub && <p className="text-[10px] text-[#AAAAAA] mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

interface Props {
  monthlyRevenue: { month: string; revenue: number; orders: number }[];
  ordersByStatus: { status: string; count: number }[];
  ordersByPayment: { method: string; count: number }[];
  topProducts: { name: string; brand: string; revenue: number; units: number }[];
  customerGrowth: { month: string; newCustomers: number }[];
  summary: { totalRevenue: number; totalOrders: number; avgOrderValue: number; conversionRate: number };
}

export default function AnalyticsDashboard({ monthlyRevenue, ordersByStatus, ordersByPayment, topProducts, customerGrowth, summary }: Props) {
  const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs text-[#AAAAAA] font-semibold uppercase tracking-widest mb-1">Analytics</p>
        <h1 className="text-2xl font-bold text-[#111111]">Business Analytics</h1>
        <p className="text-sm text-[#888888] mt-1">Last 12 months performance overview</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={TrendingUp} label="Total Revenue" value={fmt(summary.totalRevenue)} sub="Paid orders only" color="bg-blue-50 text-blue-600" />
        <StatCard icon={ShoppingCart} label="Total Orders" value={summary.totalOrders.toString()} sub="Last 12 months" color="bg-purple-50 text-purple-600" />
        <StatCard icon={CreditCard} label="Avg Order Value" value={fmt(summary.avgOrderValue)} sub="Per paid order" color="bg-emerald-50 text-emerald-600" />
        <StatCard icon={BarChart3} label="Payment Rate" value={`${summary.conversionRate}%`} sub="Paid / Total orders" color="bg-amber-50 text-amber-600" />
      </div>

      {/* Revenue Trend */}
      <div className="bg-white border border-[#ECEFF5] rounded-2xl p-6">
        <p className="text-xs text-[#AAAAAA] font-semibold uppercase tracking-widest mb-1">Monthly Revenue</p>
        <p className="text-lg font-bold text-[#111111] mb-5">Revenue & Orders — Last 12 Months</p>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyRevenue} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#004AAD" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#004AAD" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis {...axisProps} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip {...tooltipStyle} formatter={(v) => [`₹${Number(v).toLocaleString("en-IN")}`, "Revenue"]} />
              <Area type="monotone" dataKey="revenue" stroke="#004AAD" strokeWidth={2.5} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Orders & Customer Growth side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#ECEFF5] rounded-2xl p-6">
          <p className="text-xs text-[#AAAAAA] font-semibold uppercase tracking-widest mb-1">Orders</p>
          <p className="text-base font-bold text-[#111111] mb-5">Monthly Order Volume</p>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
                <XAxis dataKey="month" {...axisProps} />
                <YAxis {...axisProps} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="orders" fill="#009DFF" radius={[4, 4, 0, 0]} name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-[#ECEFF5] rounded-2xl p-6">
          <p className="text-xs text-[#AAAAAA] font-semibold uppercase tracking-widest mb-1">Customers</p>
          <p className="text-base font-bold text-[#111111] mb-5">New Customer Signups</p>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={customerGrowth} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="custGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
                <XAxis dataKey="month" {...axisProps} />
                <YAxis {...axisProps} />
                <Tooltip {...tooltipStyle} />
                <Area type="monotone" dataKey="newCustomers" stroke="#D4AF37" strokeWidth={2.5} fill="url(#custGrad)" name="New Customers" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Order Status + Payment Method */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#ECEFF5] rounded-2xl p-6">
          <p className="text-xs text-[#AAAAAA] font-semibold uppercase tracking-widest mb-1">Order Status</p>
          <p className="text-base font-bold text-[#111111] mb-5">Distribution by Status</p>
          {ordersByStatus.length === 0 ? (
            <p className="text-sm text-[#AAAAAA] py-16 text-center">No order data yet</p>
          ) : (
            <div className="flex items-center gap-6">
              <div className="h-[180px] w-[180px] flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={ordersByStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} innerRadius={45}>
                      {ordersByStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v, name) => [v, STATUS_LABELS[name as string] || name]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 flex-1">
                {ordersByStatus.map((item, i) => (
                  <div key={item.status} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-xs text-[#555]">{STATUS_LABELS[item.status] || item.status}</span>
                    </div>
                    <span className="text-xs font-bold text-[#111]">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white border border-[#ECEFF5] rounded-2xl p-6">
          <p className="text-xs text-[#AAAAAA] font-semibold uppercase tracking-widest mb-1">Payments</p>
          <p className="text-base font-bold text-[#111111] mb-5">Payment Method Split</p>
          {ordersByPayment.length === 0 ? (
            <p className="text-sm text-[#AAAAAA] py-16 text-center">No payment data yet</p>
          ) : (
            <div className="flex items-center gap-6">
              <div className="h-[180px] w-[180px] flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={ordersByPayment} dataKey="count" nameKey="method" cx="50%" cy="50%" outerRadius={80} innerRadius={45}>
                      {ordersByPayment.map((_, i) => <Cell key={i} fill={["#004AAD", "#D4AF37"][i % 2]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3 flex-1">
                {ordersByPayment.map((item, i) => (
                  <div key={item.method} className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: ["#004AAD", "#D4AF37"][i % 2] }} />
                        <span className="text-xs text-[#555]">{item.method}</span>
                      </div>
                      <span className="text-xs font-bold text-[#111]">{item.count}</span>
                    </div>
                    <div className="h-1.5 bg-[#F0F0F0] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.round((item.count / ordersByPayment.reduce((s, x) => s + x.count, 0)) * 100)}%`,
                          background: ["#004AAD", "#D4AF37"][i % 2],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white border border-[#ECEFF5] rounded-2xl p-6">
        <p className="text-xs text-[#AAAAAA] font-semibold uppercase tracking-widest mb-1">Products</p>
        <p className="text-base font-bold text-[#111111] mb-5">Top Products by Revenue</p>
        {topProducts.length === 0 ? (
          <p className="text-sm text-[#AAAAAA] py-8 text-center">No order data yet</p>
        ) : (
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} layout="vertical" margin={{ top: 0, right: 40, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" horizontal={false} />
                <XAxis type="number" {...axisProps} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11, fill: "#555" }} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle} formatter={(v) => [`₹${Number(v).toLocaleString("en-IN")}`, "Revenue"]} />
                <Bar dataKey="revenue" fill="#004AAD" radius={[0, 4, 4, 0]} name="Revenue">
                  {topProducts.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
