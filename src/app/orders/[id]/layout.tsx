import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Tracking",
  description: "Track the status and delivery timeline of your Lenzify order with live updates.",
};

export default function OrderTrackingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
