import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Replace Lenses — Doorstep Service",
  description: "Replace your existing lenses with premium options. 6-step guided process with doorstep pickup, lab processing, and fast delivery by Lenzify.",
};

export default function ReplaceLensesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
