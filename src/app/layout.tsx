import type { Metadata } from "next";
import { Inter, Noto_Serif } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import SmoothScroll from "@/components/lenis/SmoothScroll";
import { cn } from "@/lib/utils";
import ConditionalWrapper from "@/components/layout/ConditionalWrapper";
import DynamicThemeProvider from "@/components/layout/DynamicThemeProvider";

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-body',
  weight: ['300', '400', '500', '600']
});

const interLabel = Inter({ 
  subsets: ['latin'], 
  variable: '--font-label',
  weight: ['300', '400', '500', '600']
});

const notoSerif = Noto_Serif({ 
  subsets: ['latin'], 
  variable: '--font-headline',
  weight: ['400', '700'],
  style: ['normal', 'italic']
});

export const metadata: Metadata = {
  title: "LENZIFY | The Visionary Editorial",
  description: "Excellence in every frame. Redefining vision through the lens of high-fashion editorial.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(inter.variable, interLabel.variable, notoSerif.variable)} suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-surface text-on-surface font-body selection:bg-secondary-fixed selection:text-on-secondary-fixed antialiased">
        <Toaster position="bottom-right" toastOptions={{
          style: {
            background: '#ffffff',
            color: '#1c1b1b',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }
        }} />
        <ConditionalWrapper>
          <DynamicThemeProvider>
             {children}
          </DynamicThemeProvider>
        </ConditionalWrapper>
      </body>
    </html>
  );
}
