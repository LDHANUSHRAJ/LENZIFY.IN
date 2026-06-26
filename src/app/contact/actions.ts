"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactMessage(data: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) {
  if (!data.name || !data.email || !data.message) {
    return { error: "Name, email, and message are required." };
  }

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#333">
      <div style="background:#03173D;padding:24px;text-align:center;border-radius:12px 12px 0 0">
        <h1 style="color:#fff;margin:0;font-size:24px;font-style:italic">LENZIFY</h1>
        <p style="color:#fff;opacity:0.7;margin:4px 0 0;font-size:13px">New Contact Form Submission</p>
      </div>
      <div style="background:#fff;padding:32px;border:1px solid #eee;border-top:none;border-radius:0 0 12px 12px">
        <table style="width:100%;border-collapse:collapse">
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-weight:600;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;width:120px">Name</td>
            <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#111">${data.name}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-weight:600;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:0.05em">Email</td>
            <td style="padding:10px 0;border-bottom:1px solid #f0f0f0"><a href="mailto:${data.email}" style="color:#004AAD">${data.email}</a></td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-weight:600;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:0.05em">Phone</td>
            <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#111">${data.phone || "—"}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-weight:600;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:0.05em">Subject</td>
            <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#111">${data.subject}</td>
          </tr>
          <tr>
            <td style="padding:14px 0;vertical-align:top;font-weight:600;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:0.05em">Message</td>
            <td style="padding:14px 0;color:#111;white-space:pre-wrap;line-height:1.6">${data.message}</td>
          </tr>
        </table>
        <div style="margin-top:24px;padding:16px;background:#f9f9f9;border-radius:8px;font-size:12px;color:#999;text-align:center">
          Sent from lenzify.in contact form · ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
        </div>
      </div>
    </div>
  `;

  try {
    const { error } = await resend.emails.send({
      from: "Lenzify Contact <onboarding@resend.dev>",
      to: process.env.CONTACT_RECIPIENT || "virtuosodhanush@gmail.com",
      replyTo: data.email,
      subject: `[Contact] ${data.subject} — ${data.name}`,
      html,
    });

    if (error) {
      console.error("[CONTACT] Resend error:", JSON.stringify(error));
      return { error: "Failed to send message. Please try again or call us directly." };
    }

    return { success: true };
  } catch (err: any) {
    console.error("[CONTACT] Unexpected error:", err.message);
    return { error: "Failed to send message. Please try again or call us directly." };
  }
}
