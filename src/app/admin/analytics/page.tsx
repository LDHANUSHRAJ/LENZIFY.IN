import { createAdminClient } from "@/lib/supabase/server";
import AnalyticsDashboard from "./AnalyticsDashboard";

export const revalidate = 300;

export default async function AdminAnalyticsPage() {
  const supabase = await createAdminClient();

  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
  twelveMonthsAgo.setDate(1);
  twelveMonthsAgo.setHours(0, 0, 0, 0);

  const [ordersRes, productsRes, usersRes, orderItemsRes, categoriesRes] = await Promise.all([
    supabase
      .from("orders")
      .select("id, total_price, status, payment_method, payment_status, created_at")
      .gte("created_at", twelveMonthsAgo.toISOString()),
    supabase.from("products").select("id, name, brand, stock, product_type").limit(200),
    supabase
      .from("users")
      .select("id, created_at")
      .eq("role", "customer")
      .gte("created_at", twelveMonthsAgo.toISOString()),
    supabase
      .from("order_items")
      .select("product_id, quantity, price, products(name, brand, product_type, categories(name))")
      .limit(500),
    supabase.from("categories").select("id, name"),
  ]);

  const orders = ordersRes.data ?? [];
  const allProducts = productsRes.data ?? [];
  const newUsers = usersRes.data ?? [];
  const orderItems = orderItemsRes.data ?? [];

  // Monthly revenue — last 12 months
  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (11 - i));
    return {
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" }),
    };
  });

  const monthlyRevenue = months.map(({ key, label }) => {
    const monthOrders = orders.filter(
      (o) => o.created_at?.startsWith(key) && o.payment_status === "paid"
    );
    const revenue = monthOrders.reduce((s, o) => s + Number(o.total_price), 0);
    const count = orders.filter((o) => o.created_at?.startsWith(key)).length;
    return { month: label, revenue, orders: count };
  });

  // Order status breakdown
  const statusMap: Record<string, number> = {};
  orders.forEach((o) => {
    statusMap[o.status] = (statusMap[o.status] || 0) + 1;
  });
  const ordersByStatus = Object.entries(statusMap).map(([status, count]) => ({ status, count }));

  // Payment method breakdown
  const paymentMap: Record<string, number> = {};
  orders.forEach((o) => {
    const method = o.payment_method === "cod" ? "Cash on Delivery" : "Online (Razorpay)";
    paymentMap[method] = (paymentMap[method] || 0) + 1;
  });
  const ordersByPayment = Object.entries(paymentMap).map(([method, count]) => ({ method, count }));

  // Top 8 products by revenue
  const productRevMap: Record<string, { name: string; brand: string; revenue: number; units: number }> = {};
  orderItems.forEach((item: any) => {
    if (!item.product_id) return;
    if (!productRevMap[item.product_id]) {
      productRevMap[item.product_id] = {
        name: item.products?.name || "Unknown",
        brand: item.products?.brand || "",
        revenue: 0,
        units: 0,
      };
    }
    productRevMap[item.product_id].revenue += Number(item.price) * Number(item.quantity);
    productRevMap[item.product_id].units += Number(item.quantity);
  });
  const topProducts = Object.values(productRevMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8);

  // Customer growth by month
  const customerGrowth = months.map(({ key, label }) => ({
    month: label,
    newCustomers: newUsers.filter((u) => u.created_at?.startsWith(key)).length,
  }));

  // Average order value
  const paidOrders = orders.filter((o) => o.payment_status === "paid");
  const avgOrderValue =
    paidOrders.length > 0
      ? Math.round(paidOrders.reduce((s, o) => s + Number(o.total_price), 0) / paidOrders.length)
      : 0;

  // Total revenue
  const totalRevenue = paidOrders.reduce((s, o) => s + Number(o.total_price), 0);

  // Conversion rate proxy: paid / total
  const conversionRate =
    orders.length > 0 ? Math.round((paidOrders.length / orders.length) * 100) : 0;

  return (
    <AnalyticsDashboard
      monthlyRevenue={monthlyRevenue}
      ordersByStatus={ordersByStatus}
      ordersByPayment={ordersByPayment}
      topProducts={topProducts}
      customerGrowth={customerGrowth}
      summary={{
        totalRevenue,
        totalOrders: orders.length,
        avgOrderValue,
        conversionRate,
      }}
    />
  );
}
