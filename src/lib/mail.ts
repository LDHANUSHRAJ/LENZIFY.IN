import nodemailer from "nodemailer";

/**
 * Mail Utility for Lenzify
 * Uses SMTP (Gmail recommended with App Password)
 */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER || "lenzify.in@gmail.com",
    pass: process.env.SMTP_PASSWORD, // Use an App Password from Google
  },
});

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: `"Lenzify" <${process.env.SMTP_USER || "lenzify.in@gmail.com"}>`,
      to,
      subject,
      html,
    });
    console.log("[MAIL] Message sent: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("[MAIL] Error sending email:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Order Confirmation Template
 */
export function getOrderConfirmationHtml(order: any, customerName: string) {
  const itemsHtml = order.order_items
    ?.map(
      (item: any) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.products?.name} x ${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price}</td>
    </tr>
  `
    )
    .join("");

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h1 style="color: #000; border-bottom: 2px solid #000; padding-bottom: 10px;">Order Confirmed!</h1>
      <p>Hi ${customerName},</p>
      <p>Thank you for shopping with Lenzify. Your order has been placed successfully and is being processed.</p>
      
      <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Order Summary</h3>
        <p><strong>Order ID:</strong> ${order.id}</p>
        <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleDateString()}</p>
        
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 10px; border-bottom: 2px solid #eee;">Item</th>
              <th style="text-align: right; padding: 10px; border-bottom: 2px solid #eee;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td style="padding: 10px; font-weight: bold;">Total</td>
              <td style="padding: 10px; font-weight: bold; text-align: right;">₹${order.total}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <p>We'll notify you once your order is shipped.</p>
      <p>Best regards,<br>Team Lenzify</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 40px 0 20px;">
      <p style="font-size: 12px; color: #999; text-align: center;">
        Lenzify.in | The Future of Vision<br>
        This is an automated message, please do not reply.
      </p>
    </div>
  `;
}
