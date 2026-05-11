import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Eyewear — Browse All Products",
  description:
    "Explore our complete collection of eyeglasses, sunglasses, contact lenses, computer glasses, and accessories. Filter by brand, gender, price, and more.",
  openGraph: {
    title: "Shop Eyewear — LENZIFY",
    description: "Explore premium eyewear — eyeglasses, sunglasses, contact lenses & more.",
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
