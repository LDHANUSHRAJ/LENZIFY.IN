import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Orders",
  description: "View your order history, track shipments, and manage your Lenzify purchases.",
};

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
