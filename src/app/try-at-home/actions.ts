"use server";

import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/mail";
import { rateLimitAction } from "@/lib/rateLimit";

export interface BookingData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  preferred_date: string;
  preferred_time: string;
  frame_preference: string;
  notes?: string;
}

export async function createTryAtHomeBooking(data: BookingData) {
  if (await rateLimitAction('try-at-home', 3)) {
    return { error: "Too many booking attempts. Please wait a minute." };
  }

  if (!data.name || !data.email || !data.phone || !data.address || !data.city || !data.pincode || !data.preferred_date || !data.preferred_time) {
    return { error: "All required fields must be filled." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: booking, error } = await supabase
    .from("try_at_home_bookings")
    .insert({
      user_id: user?.id ?? null,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      pincode: data.pincode,
      preferred_date: data.preferred_date,
      preferred_time: data.preferred_time,
      frame_preference: data.frame_preference,
      notes: data.notes,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[TRY-AT-HOME] Booking error:", error);
    return { error: "Failed to place booking. Please try again." };
  }

  // Notify admin
  try {
    await sendEmail({
      to: process.env.SMTP_USER || "lenzify.in@gmail.com",
      subject: `New Try-at-Home Booking - ${data.name}`,
      html: `
        <h2>New Try-at-Home Booking</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Address:</strong> ${data.address}, ${data.city} - ${data.pincode}</p>
        <p><strong>Preferred Date:</strong> ${data.preferred_date}</p>
        <p><strong>Time Slot:</strong> ${data.preferred_time}</p>
        <p><strong>Frame Preference:</strong> ${data.frame_preference}</p>
        ${data.notes ? `<p><strong>Notes:</strong> ${data.notes}</p>` : ""}
        <p><strong>Booking ID:</strong> ${booking.id}</p>
      `,
    });

    // Confirmation to customer
    await sendEmail({
      to: data.email,
      subject: "Try-at-Home Booking Confirmed - Lenzify",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h1 style="color: #0F172A; border-bottom: 2px solid #0F172A; padding-bottom: 10px;">Booking Confirmed!</h1>
          <p>Hi ${data.name},</p>
          <p>Your Try-at-Home session has been booked. Our concierge will arrive with 150+ frames at your location.</p>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Booking Details</h3>
            <p><strong>Date:</strong> ${data.preferred_date}</p>
            <p><strong>Time:</strong> ${data.preferred_time}</p>
            <p><strong>Address:</strong> ${data.address}, ${data.city}</p>
            <p><strong>Frame Preference:</strong> ${data.frame_preference}</p>
          </div>
          <p>We will call you 24 hours before to confirm the appointment.</p>
          <p>Best regards,<br>Team Lenzify</p>
        </div>
      `,
    });
  } catch (mailErr) {
    console.error("[TRY-AT-HOME] Email notification failed:", mailErr);
  }

  return { success: true, booking_id: booking.id };
}
