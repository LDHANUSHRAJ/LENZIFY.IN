import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";
import SmoothScroll from "@/components/lenis/SmoothScroll";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const cormorant = Cormorant_Garamond({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-display'
});

export const metadata: Metadata = {
  title: "LENZIFY | Luxury Optical & Premium Eyewear",
  description: "Experience the zenith of optical craftsmanship. Shop premium spectacles, sunglasses, and contact lenses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(inter.variable, cormorant.variable)}>
      <body className="font-sans bg-brand-background text-brand-text-primary antialiased selection:bg-brand-gold selection:text-white">
        <Toaster position="bottom-right" toastOptions={{
          style: {
            background: '#ffffff',
            color: '#0f0d3d',
            border: '1px solid #e2e8f0',
            borderRadius: '0px',
          }
        }} />
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
