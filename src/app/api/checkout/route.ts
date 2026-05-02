import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: Request) {
  try {
    const { amount, currency = "INR" } = await req.json();

    const key_id = (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "").trim();
    const key_secret = (process.env.RAZORPAY_KEY_SECRET || "").trim();

    console.log("[RAZORPAY] Initializing with:", { 
      key_id_prefix: key_id.substring(0, 12) + "...",
      key_id_length: key_id.length,
      secret_length: key_secret.length,
      amount,
      currency
    });

    if (!key_id || !key_secret) {
      console.error("[RAZORPAY] Missing credentials!");
      return NextResponse.json({ 
        error: "Razorpay credentials missing from server environment." 
      }, { status: 500 });
    }

    const razorpay = new Razorpay({ key_id, key_secret });

    const options = {
      amount: Math.round(amount * 100),
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    console.log("[RAZORPAY] Creating order with options:", options);
    const order = await razorpay.orders.create(options);
    console.log("[RAZORPAY] Order created successfully:", order.id);
    return NextResponse.json(order);
  } catch (error: any) {
    console.error("[RAZORPAY] FULL ERROR:", JSON.stringify(error, null, 2));
    console.error("[RAZORPAY] Error message:", error?.message);
    console.error("[RAZORPAY] Error statusCode:", error?.statusCode);
    console.error("[RAZORPAY] Error description:", error?.error?.description);
    
    const message = error?.error?.description || error?.description || error?.message || "Unknown error";
    return NextResponse.json({ 
      error: "Order creation failed", 
      details: message,
      code: error?.error?.code || error?.code || "UNKNOWN"
    }, { status: 500 });
  }
}
