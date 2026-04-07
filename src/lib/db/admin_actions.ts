"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * 📦 INVENTORY LOGGING & MANUAL CORRECTION
 * Records every stock change into the inventory_logs audit trail.
 */
export async function updateInventoryAudit(
  productId: string, 
  changeAmount: number, 
  reason: string, 
  adminId: string
) {
  const supabase = await createClient();

  // 1. Log the change
  const { error: logError } = await supabase.from("inventory_logs").insert({
    product_id: productId,
    change_amount: changeAmount,
    reason,
    admin_id: adminId
  });

  if (logError) return { error: logError.message };

  // 2. Update actual product stock
  const { error: updateError } = await supabase.rpc('increment_stock', {
    p_id: productId,
    p_amount: changeAmount
  });

  if (updateError) return { error: updateError.message };

  revalidatePath("/admin/products");
  revalidatePath("/admin/inventory");
  return { success: true };
}

/**
 * 👁️ CLINICAL PRESCRIPTION VERIFICATION
 * Standardized approval/rejection and clinical notes attachment.
 */
export async function updatePrescriptionStatus(
  id: string, 
  status: 'pending' | 'approved' | 'rejected', 
  adminNotes?: string
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("prescriptions")
    .update({ 
      status, 
      admin_notes: adminNotes,
      updated_at: new Date().toISOString()
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/prescriptions");
  return { success: true };
}

/**
 * 👤 CUSTOMER IDENTITY MANAGEMENT
 * Protocol for blocking/unblocking accounts for security or policy violations.
 */
export async function toggleCustomerAccess(id: string, isBlocked: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("users")
    .update({ is_blocked: isBlocked })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/customers");
  return { success: true };
}

/**
 * 🎯 COUPON ORCHESTRATION
 * Enable/Disable protocol for promotional matrix coordination.
 */
export async function toggleCouponStatus(id: number, isEnabled: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("coupons")
    .update({ is_enabled: isEnabled })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/coupons");
  return { success: true };
}

/**
 * ⭐ REVIEW MODERATION Hub
 * Administrative tools to moderate storefront engagement.
 */
export async function moderateReview(
  id: number, 
  action: 'approve' | 'hide' | 'pin' | 'unpin',
  reply?: string
) {
  const supabase = await createClient();
  let updateData: any = {};

  if (action === 'approve') updateData.status = 'approved';
  if (action === 'hide') updateData.is_hidden = true;
  if (action === 'pin') updateData.is_pinned = true;
  if (action === 'unpin') updateData.is_pinned = false;
  if (reply) updateData.admin_reply = reply;

  const { error } = await supabase
    .from("reviews")
    .update(updateData)
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/reviews");
  return { success: true };
}

/**
 * 🎨 HOMEPAGE CONFIG SYNC
 * Orchestrating section logic and banners.
 */
export async function updateHomepageSection(key: string, content: any, isActive: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("homepage_config")
    .upsert({ 
      section_key: key, 
      content, 
      is_active: isActive,
      updated_at: new Date().toISOString()
    })
    .eq("section_key", key);

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/homepage");
  return { success: true };
}

/**
 * 📊 DASHBOARD ANALYTICS ORCHESTRATION
 * Aggregates site-wide metrics for tactical administrative overview.
 */
export async function getDashboardStats() {
  const supabase = await createClient();

  // 1. Total Sales (Revenue)
  const { data: salesData } = await supabase
    .from("orders")
    .select("total_price")
    .eq("payment_status", "paid");
  
  const totalSales = salesData?.reduce((acc, curr) => acc + Number(curr.total_price), 0) || 0;

  // 2. Total Orders (Volume)
  const { count: totalOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true });

  // 3. Total Customers (Identity Count)
  const { count: totalCustomers } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("role", "customer");

  // 4. Low Stock Alerts (Critical Inventory)
  const { data: lowStockProducts, count: lowStockCount } = await supabase
    .from("products")
    .select("id, name, stock, brand", { count: "exact" })
    .lte("stock", 5)
    .limit(5);

  // 5. Abandoned Carts (Identity Count)
  // Proxy: Unique users with items in cart
  const { data: cartUsers } = await supabase
    .from("cart")
    .select("user_id");
  const uniqueCartUsers = new Set(cartUsers?.map(c => c.user_id)).size;

  // 6. Recent Orders (Tactical Feed)
  const { data: recentOrders } = await supabase
    .from("orders")
    .select("*, users(name)")
    .order("created_at", { ascending: false })
    .limit(5);

  // 7. Top Selling Products
  const { data: topSellingData } = await supabase
    .from("order_items")
    .select("product_id, quantity, products(name, brand)")
    .limit(10);
  
  const productSales: any = {};
  topSellingData?.forEach(item => {
    const id = item.product_id;
    if (!productSales[id]) {
      productSales[id] = { 
        name: (item.products as any)?.name, 
        brand: (item.products as any)?.brand, 
        sales: 0 
      };
    }
    productSales[id].sales += item.quantity;
  });
  
  const topProducts = Object.values(productSales)
    .sort((a: any, b: any) => b.sales - a.sales)
    .slice(0, 5);

  // 8. Revenue & Order Trends (Last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const { data: trendOrders } = await supabase
    .from("orders")
    .select("created_at, total_price, payment_status")
    .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

  const chartData = last7Days.map(date => {
    const dayOrders = trendOrders?.filter(o => o.created_at.startsWith(date)) || [];
    const revenue = dayOrders
      .filter(o => o.payment_status === 'paid')
      .reduce((acc, curr) => acc + Number(curr.total_price), 0);
    
    return {
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      revenue,
      orders: dayOrders.length
    };
  });

  return {
    totalSales,
    totalOrders: totalOrders || 0,
    totalCustomers: totalCustomers || 0,
    lowStockCount: lowStockCount || 0,
    abandonedCarts: uniqueCartUsers || 0,
    lowStockProducts: lowStockProducts || [],
    recentOrders: recentOrders || [],
    topProducts,
    chartData
  };
}

/**
 * 🔔 SYSTEM PROTOCOL NOTIFICATIONS
 * Marks system alerts as acknowledged by admin.
 */
export async function markNotificationRead(id: number) {
  const supabase = await createClient();
  const { error } = await supabase.from("notifications").update({ read: true }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/notifications");
  return { success: true };
}
