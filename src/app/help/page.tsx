import type { Metadata } from "next";
import Link from "next/link";
import { HelpCircle, Mail, Phone, MessageSquare, ArrowRight, Search, ShieldCheck, Truck, RotateCcw, Eye } from "lucide-react";

export const metadata: Metadata = {
  title: "Help Center",
  description: "Get help with your Lenzify orders, prescriptions, shipping, returns, and more. Browse FAQs or contact our support team.",
};

const helpTopics = [
  {
    icon: Truck,
    title: "Shipping & Delivery",
    description: "Track orders, delivery timelines, and shipping policies",
    href: "/shipping",
  },
  {
    icon: RotateCcw,
    title: "Returns & Refunds",
    description: "Return process, refund timelines, and exchange policies",
    href: "/shipping",
  },
  {
    icon: Eye,
    title: "Prescriptions",
    description: "How to upload prescriptions and understand lens powers",
    href: "/faq",
  },
  {
    icon: ShieldCheck,
    title: "Warranty",
    description: "Frame and lens warranty coverage and claim process",
    href: "/warranty",
  },
];

const commonQuestions = [
  { q: "How do I track my order?", a: "Log in to your account, go to 'My Orders', and click on the order to see tracking details." },
  { q: "Can I change my prescription after ordering?", a: "Contact us within 2 hours of placing your order and we'll update the prescription at no extra cost." },
  { q: "What payment methods do you accept?", a: "We accept UPI, Net Banking, Credit/Debit cards via Razorpay, and Cash on Delivery." },
  { q: "How long does delivery take?", a: "Standard delivery takes 5-7 business days. Prescription eyewear may take 7-10 business days due to lens grinding." },
  { q: "Do you offer free shipping?", a: "Yes, we offer complimentary shipping on all orders across India." },
  { q: "How do I replace my lenses?", a: "Visit our Replace Lenses page, follow the 6-step wizard, and we'll handle the rest with doorstep pickup." },
];

export default function HelpPage() {
  return (
    <div className="bg-surface min-h-screen pt-32 pb-32">
      <main className="max-w-screen-xl mx-auto px-6 md:px-12 space-y-20">
        {/* Header */}
        <header className="text-center space-y-6 max-w-2xl mx-auto">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-secondary italic">
            Support Center
          </p>
          <h1 className="text-5xl md:text-7xl font-serif italic tracking-tight text-primary leading-none">
            How can we <span className="text-secondary">help?</span>
          </h1>
          <p className="text-on-surface/50 text-lg leading-relaxed">
            Find answers to common questions or get in touch with our team.
          </p>
        </header>

        {/* Help Topics Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {helpTopics.map((topic) => (
            <Link
              key={topic.title}
              href={topic.href}
              className="group bg-white border border-outline/10 p-8 space-y-4 hover:border-secondary/30 hover:shadow-lg transition-all duration-500"
            >
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center group-hover:bg-secondary group-hover:scale-110 transition-all">
                <topic.icon size={20} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-primary">
                {topic.title}
              </h3>
              <p className="text-xs text-on-surface/50 leading-relaxed">
                {topic.description}
              </p>
              <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                Learn More <ArrowRight size={12} />
              </div>
            </Link>
          ))}
        </section>

        {/* FAQ Section */}
        <section className="space-y-10">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-serif italic text-primary tracking-tight">
              Frequently Asked <span className="text-secondary">Questions</span>
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface/30">
              Quick answers to common queries
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-6">
            {commonQuestions.map((item, i) => (
              <details
                key={i}
                className="group bg-white border border-outline/10 hover:border-secondary/20 transition-colors"
              >
                <summary className="p-6 cursor-pointer flex items-center justify-between text-sm font-bold text-primary uppercase tracking-wide list-none">
                  <span>{item.q}</span>
                  <HelpCircle size={16} className="text-on-surface/20 group-open:text-secondary transition-colors shrink-0 ml-4" />
                </summary>
                <div className="px-6 pb-6 text-sm text-on-surface/60 leading-relaxed border-t border-outline/5 pt-4">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="bg-primary text-white p-12 md:p-16 text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full -mr-32 -mt-32 blur-[100px]" />
          <div className="relative z-10 space-y-6 max-w-lg mx-auto">
            <h3 className="text-3xl font-serif italic tracking-tight">
              Still need help?
            </h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Our support team is available Monday to Saturday, 10 AM to 7 PM IST.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="flex items-center justify-center gap-3 px-8 py-4 bg-secondary text-primary text-[10px] font-black uppercase tracking-[0.3em] hover:opacity-90 transition-opacity"
              >
                <Mail size={14} /> Contact Us
              </Link>
              <a
                href="mailto:lenzify.in@gmail.com"
                className="flex items-center justify-center gap-3 px-8 py-4 border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-colors"
              >
                <MessageSquare size={14} /> Email Support
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
