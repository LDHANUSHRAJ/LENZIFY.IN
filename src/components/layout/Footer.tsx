"use client";

import Link from "next/link";
import { useState } from "react";
import { subscribeNewsletter } from "@/lib/db/utils_actions";
import toast from "react-hot-toast";

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setSubscribing(true);
    const result = await subscribeNewsletter(newsletterEmail);
    setSubscribing(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Successfully subscribed! Welcome to our circle.");
      setNewsletterEmail("");
    }
  };

  const shopLinks = [
    { name: "Men's Eyewear", href: "/products?gender=men" },
    { name: "Women's Eyewear", href: "/products?gender=women" },
    { name: "New Arrivals", href: "/products?sort=newest" },
    { name: "Accessories", href: "/products?category=accessories" },
  ];

  const supportLinks = [
    { name: "Shipping & Returns", href: "/shipping" },
    { name: "Warranty", href: "/warranty" },
    { name: "Care Guide", href: "/care" },
    { name: "FAQ", href: "/faq" },
    { name: "Help Center", href: "/help" },
  ];

  return (
    <footer className="bg-[#fcf9f8] border-t border-[#000000]/10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 px-6 md:px-12 lg:px-24 py-12 md:py-20 max-w-screen-2xl mx-auto">
        {/* Column 1: Brand */}
        <div>
          <div className="text-xl font-serif italic text-[#000000] mb-8 tracking-tighter">LENZIFY</div>
          <p className="text-sm text-stone-600 leading-relaxed mb-6">
            Redefining vision through the lens of high-fashion editorial. Excellence in every frame.
          </p>
          <div className="flex gap-6 items-center">
            <a 
              href="https://www.instagram.com/lenzify.in?igsh=ZXhrOHJtNzF5bHlr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-2"
            >
              <span className="material-symbols-outlined text-stone-600 group-hover:text-secondary transition-colors" data-icon="public">public</span>
              <span className="text-[8px] font-black uppercase tracking-widest text-stone-400 group-hover:text-secondary">Instagram</span>
            </a>
            <a 
              href="mailto:lenzify.in@gmail.com"
              className="group flex flex-col items-center gap-2"
            >
              <span className="material-symbols-outlined text-stone-600 group-hover:text-secondary transition-colors" data-icon="mail">mail</span>
              <span className="text-[8px] font-black uppercase tracking-widest text-stone-400 group-hover:text-secondary">Email Us</span>
            </a>
          </div>
        </div>

        {/* Column 2: Shop */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-8">Shop</h4>
          <ul className="space-y-4 text-sm">
            {shopLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="text-stone-600 hover:underline transition-all duration-300">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Support */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-8">Support</h4>
          <ul className="space-y-4 text-sm">
            {supportLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="text-stone-600 hover:underline transition-all duration-300">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Newsletter */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-8">Newsletter</h4>
          <p className="text-xs text-stone-600 mb-6">Join our visionary circle for early access to collections.</p>
          <form onSubmit={handleNewsletterSubmit} className="flex border-b border-black/20 pb-2">
            <input 
              className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-stone-400" 
              placeholder="Your email" 
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              suppressHydrationWarning
            />
            <button 
              type="submit"
              disabled={subscribing}
              className="material-symbols-outlined text-primary hover:text-secondary transition-colors disabled:opacity-50" 
              data-icon="arrow_forward"
              suppressHydrationWarning
            >
              arrow_forward
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="px-6 md:px-24 py-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-widest text-stone-400 font-bold">
        <div>© 2026 LENZIFY. THE VISIONARY EDITORIAL.</div>
        <div className="flex gap-8">
          <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
