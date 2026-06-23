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

    console.log("[VERIFY] Incoming:", { razorpay_order_id, razorpay_payment_id, razorpay_signature });

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", key_secret)
      .update(body.toString())
      .digest("hex");

    console.log("[VERIFY] Signatures:", { expected: expectedSignature, received: razorpay_signature });

    const isVerified = expectedSignature === razorpay_signature;

    if (!isVerified) {
      console.error("[VERIFY] Signature mismatch!");
      return NextResponse.json({ verified: false }, { status: 400 });
    }

    console.log("[VERIFY] Success");
    return NextResponse.json({ verified: true }, { status: 200 });
  } catch (error: any) {
    console.error("[VERIFY] Error:", error.message);
    return NextResponse.json(
      { error: "Verification failed", details: error.message },
      { status: 500 }
    );
  }
}
