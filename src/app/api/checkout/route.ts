import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: Request) {
  try {
    const { amount, currency = "INR" } = await req.json();

    // Initialize inside the handler to ensure fresh environment variables
    const razorpay = new Razorpay({
      key_id: (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "").trim(),
      key_secret: (process.env.RAZORPAY_KEY_SECRET || "").trim(),
    });

    console.log("Order Protocol Initiation:", { 
      amount, 
      id_prefix: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.substring(0, 8),
      id_present: !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
      secret_present: !!process.env.RAZORPAY_KEY_SECRET 
    });

    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay credentials missing from server environment.");
    }

    const options = {
      amount: Math.round(amount * 100),
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json(order);
  } catch (error: any) {
    console.error("RAZORPAY_CRITICAL_FAILURE:", error);
    return NextResponse.json({ 
      error: "Order creation failed", 
      details: error.description || error.message || (typeof error === 'object' ? JSON.stringify(error) : String(error)),
      code: error.code || "UNKNOWN_INTERNAL_CODE"
    }, { status: 500 });
  }
}
