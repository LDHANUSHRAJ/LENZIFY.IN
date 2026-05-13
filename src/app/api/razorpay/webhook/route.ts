import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { sendEmail, getOrderConfirmationHtml } from "@/lib/mail";

/**
 * Razorpay Webhook Handler
 * Receives server-side payment events (payment.captured, payment.failed, refund.created)
 * and updates order status accordingly.
 *
 * Set this webhook URL in your Razorpay Dashboard:
 *   https://yourdomain.com/api/razorpay/webhook
 *
 * IMPORTANT: Set RAZORPAY_WEBHOOK_SECRET in your environment variables
 */
export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("[WEBHOOK] RAZORPAY_WEBHOOK_SECRET not configured");
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("[WEBHOOK] Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);
    const eventType = event.event;

    // Use service role for direct DB updates (bypasses RLS)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    console.log(`[WEBHOOK] Received event: ${eventType}`);

    switch (eventType) {
      case "payment.captured": {
        const paymentId = event.payload.payment.entity.id;
        const orderId = event.payload.payment.entity.notes?.order_id;

        if (orderId) {
          await supabase
            .from("orders")
            .update({ payment_status: "paid", updated_at: new Date().toISOString() })
            .eq("id", orderId);

          await supabase
            .from("payments")
            .update({ status: "Success" })
            .eq("transaction_id", paymentId);

          // --- EMAIL NOTIFICATION LOGIC ---
          try {
            // 1. Fetch full order details including items and products
            const { data: order, error: orderError } = await supabase
              .from("orders")
              .select(`
                *,
                order_items (
                  *,
                  products (*)
                ),
                profiles (*)
              `)
              .eq("id", orderId)
              .single();

            if (order && !orderError) {
              // 2. Fetch user email from auth (since profiles might not have it)
              const { data: userData, error: userError } = await supabase.auth.admin.getUserById(order.user_id);
              const customerEmail = userData?.user?.email;
              const customerName = order.profiles?.name || "Customer";

              if (customerEmail) {
                console.log(`[WEBHOOK] Sending confirmation email to ${customerEmail}`);
                
                // Send to Customer
                await sendEmail({
                  to: customerEmail,
                  subject: `Order Confirmed - Lenzify #${orderId.slice(0, 8)}`,
                  html: getOrderConfirmationHtml(order, customerName),
                });

                // Send to Admin (lenzify.in@gmail.com)
                await sendEmail({
                  to: process.env.SMTP_USER || "lenzify.in@gmail.com",
                  subject: `New Order Received - #${orderId.slice(0, 8)}`,
                  html: `<h3>New Order Received</h3><p>Order ID: ${orderId}</p><p>Customer: ${customerName} (${customerEmail})</p><p>Total: ₹${order.total}</p>`,
                });
              }
            }
          } catch (mailError) {
            console.error("[WEBHOOK] Failed to send notification emails:", mailError);
          }
          // --- END EMAIL NOTIFICATION LOGIC ---
        }
        break;
      }

      case "payment.failed": {
        const paymentId = event.payload.payment.entity.id;

        await supabase
          .from("payments")
          .update({ status: "Failed" })
          .eq("transaction_id", paymentId);
        break;
      }

      case "refund.created": {
        const refund = event.payload.refund.entity;
        const paymentId = refund.payment_id;

        // Find the order via payment record
        const { data: payment } = await supabase
          .from("payments")
          .select("order_id")
          .eq("transaction_id", paymentId)
          .single();

        if (payment?.order_id) {
          await supabase
            .from("orders")
            .update({
              payment_status: "refunded",
              status: "cancelled",
              updated_at: new Date().toISOString(),
            })
            .eq("id", payment.order_id);
        }
        break;
      }

      default:
        console.log(`[WEBHOOK] Unhandled event type: ${eventType}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("[WEBHOOK] Error:", error.message);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
