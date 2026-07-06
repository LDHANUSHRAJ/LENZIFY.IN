"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Download } from "lucide-react";

interface InvoiceOrder {
  id: string;
  created_at: string;
  total_price: number;
  payment_method: string;
  payment_status: string;
  order_items: {
    quantity: number;
    price: number;
    products?: { name?: string; brand?: string } | null;
  }[];
  addresses?: {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    phone?: string;
  } | null;
}

interface InvoiceCustomer {
  name: string;
  email: string;
  phone?: string;
}

export default function InvoiceDownloadButton({
  order,
  customer,
  className,
}: {
  order: InvoiceOrder;
  customer: InvoiceCustomer;
  className?: string;
}) {
  const handleDownload = () => {
    const doc = new jsPDF();
    const orderRef = order.id.slice(0, 12).toUpperCase();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(3, 23, 61);
    doc.text("LENZIFY", 14, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Tax Invoice", 14, 27);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Invoice #: ${orderRef}`, 140, 20);
    doc.text(
      `Date: ${new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`,
      140,
      26
    );

    const addr = order.addresses;
    doc.setFont("helvetica", "bold");
    doc.text("Billed To", 14, 40);
    doc.setFont("helvetica", "normal");
    doc.text(customer.name || addr?.name || "Customer", 14, 46);
    if (customer.email) doc.text(customer.email, 14, 51);
    if (customer.phone || addr?.phone) doc.text(customer.phone || addr?.phone || "", 14, 56);

    if (addr) {
      doc.setFont("helvetica", "bold");
      doc.text("Shipping Address", 105, 40);
      doc.setFont("helvetica", "normal");
      doc.text(addr.address || "", 105, 46, { maxWidth: 90 });
      doc.text(`${addr.city || ""}, ${addr.state || ""} - ${addr.pincode || ""}`, 105, 56);
    }

    const columns = ["Item", "Brand", "Qty", "Unit Price", "Total"];
    const rows = order.order_items.map((item) => [
      item.products?.name || "Item",
      item.products?.brand || "-",
      String(item.quantity),
      `Rs. ${Number(item.price).toLocaleString("en-IN")}`,
      `Rs. ${(Number(item.price) * item.quantity).toLocaleString("en-IN")}`,
    ]);

    autoTable(doc, {
      startY: 68,
      head: [columns],
      body: rows,
      theme: "grid",
      headStyles: { fillColor: [3, 23, 61], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      alternateRowStyles: { fillColor: [248, 249, 252] },
    });

    const finalY = (doc as any).lastAutoTable?.finalY || 100;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(`Total Paid: Rs. ${Number(order.total_price).toLocaleString("en-IN")}`, 140, finalY + 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Payment Method: ${order.payment_method === "cod" ? "Cash on Delivery" : "Online Payment"}`, 14, finalY + 12);
    doc.text(`Payment Status: ${order.payment_status.toUpperCase()}`, 14, finalY + 18);

    doc.setFontSize(8);
    doc.text("Thank you for shopping with Lenzify.", 14, finalY + 30);

    doc.save(`Lenzify_Invoice_${orderRef}.pdf`);
  };

  return (
    <button
      onClick={handleDownload}
      className={
        className ||
        "flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#ECECEC] text-[#666666] text-sm font-semibold hover:border-[#004AAD] hover:text-[#004AAD] transition-colors"
      }
    >
      <Download size={14} />
      Download Invoice
    </button>
  );
}
