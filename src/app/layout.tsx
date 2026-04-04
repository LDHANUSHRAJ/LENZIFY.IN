import type { Metadata } from "next";
import { Outfit, Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";
import SmoothScroll from "@/components/lenis/SmoothScroll";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "LENZIFY | Luxury Optical & Eye Testing",
  description: "Futuristic, high-performance 3D parallax e-commerce for Spectacles, Lenses, and Contact Lenses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={`${outfit.className} bg-[#0B1C2D] text-white antialiased selection:bg-[#2F8CFF] selection:text-white`}>
        <Toaster position="bottom-right" />
        <SmoothScroll>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
