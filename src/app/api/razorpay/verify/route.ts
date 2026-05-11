import { NextResponse } from "next/server";
import crypto from "crypto";

/**
 * Razorpay Payment Signature Verification
 * Called after client-side payment to verify the signature before confirming the order.
 * This prevents forged payment callbacks.
 */
export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing required payment parameters" },
        { status: 400 }
      );
    }

    const key_secret = (process.env.RAZORPAY_KEY_SECRET || "").trim();

    if (!key_secret) {
      console.error("[VERIFY] RAZORPAY_KEY_SECRET not configured");
      return NextResponse.json(
        { error: "Payment verification unavailable" },
        { status: 500 }
      );
    }

    // Generate expected signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", key_secret)
      .update(body)
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      console.error("[VERIFY] Payment signature mismatch!", {
        razorpay_order_id,
        razorpay_payment_id,
      });
      return NextResponse.json(
        { verified: false, error: "Payment verification failed. Signature mismatch." },
        { status: 400 }
      );
    }

    return NextResponse.json({ verified: true });
  } catch (error: any) {
    console.error("[VERIFY] Error:", error.message);
    return NextResponse.json(
      { error: "Verification failed", details: error.message },
      { status: 500 }
    );
  }
}
