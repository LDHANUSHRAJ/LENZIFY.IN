import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from '@/lib/supabase/server';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { amount, currency = "INR", items, address } = await req.json();

    const options = {
      amount: Math.round(amount * 100), // amount in the smallest currency unit
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Optional: Store the draft order in Supabase
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase.from('orders').insert({
        user_id: user.id,
        order_id: order.id,
        amount: amount,
        currency,
        status: 'pending',
        address,
        items
      });
      if (error) console.error("Error creating draft order:", error);
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Order error:", error);
    return NextResponse.json({ error: "Order failed" }, { status: 500 });
  }
}
