import Image from "next/image";
import Link from "next/link";
import { Zap, Truck, RotateCcw, Clock } from "lucide-react";

export default function TryAtHome() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#03173D] via-[#004AAD] to-[#009DFF] pt-28 md:pt-40 pb-14 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-6 flex items-center gap-2">
              <Clock size={14} />
              Coming Soon
            </p>
            <h1 className="font-[var(--font-hero)] italic text-white text-5xl md:text-7xl leading-none mb-6">
              Try Before <br />You Buy.
            </h1>
            <p className="text-white/70 text-base leading-relaxed mb-10 max-w-lg">
              We&apos;re putting the finishing touches on our at-home try-on experience —
              150+ frames and a certified optometrist, delivered to your door. Launching soon.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="bg-white text-[#03173D] px-8 py-4 rounded-full font-semibold hover:bg-[#F8F9FC] transition-all text-center"
              >
                Shop Eyewear Instead
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/5] bg-white/10 rounded-3xl overflow-hidden">
            <Image src="/images/hero/hero4.jpg" alt="Try at home eyewear session" fill className="object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#03173D]/60 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-sm rounded-2xl p-6">
              <Zap size={20} className="text-[#004AAD] mb-2" />
              <h3 className="text-[#111111] text-lg font-semibold mb-1">150+ Frames Available</h3>
              <p className="text-[#666666] text-xs">Certified Optometrist in every session.</p>
            </div>
          </div>
        </div>
      </section>

      {/* What to expect */}
      <section className="py-12 md:py-20 bg-[#F8F9FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-14">
            <p className="text-[#004AAD] text-xs font-semibold uppercase tracking-widest mb-3">What to Expect</p>
            <h2 className="font-[var(--font-hero)] italic text-[#111111] text-4xl md:text-6xl leading-tight">How It Will Work</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Zap, step: "01", title: "Book Your Slot", desc: "Select your preferred date and time via our booking portal." },
              { icon: Truck, step: "02", title: "Expert Arrives", desc: "Our certified optician arrives with 150+ curated frames and examination equipment." },
              { icon: RotateCcw, step: "03", title: "Try & Decide", desc: "Take your time, get a checkup, and purchase what feels perfect. Zero pressure." },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white border border-[#ECECEC] rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] p-10 text-center"
              >
                <div className="w-12 h-12 bg-[#03173D] text-white rounded-full flex items-center justify-center mx-auto mb-6 font-bold text-sm">
                  {item.step}
                </div>
                <h4 className="text-xl font-serif italic text-[#111111] mb-4">{item.title}</h4>
                <p className="text-[#666666] text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notify banner */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-12 text-center">
          <h2 className="font-[var(--font-hero)] italic text-[#111111] text-3xl md:text-5xl leading-tight mb-4">
            Not ready to wait?
          </h2>
          <p className="text-[#666666] text-sm md:text-base mb-8 max-w-xl mx-auto">
            Browse our full collection online and get expert help via our contact page in the meantime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-[#03173D] text-white px-8 py-4 rounded-full font-semibold hover:bg-gradient-to-r hover:from-[#03173D] hover:to-[#004AAD] transition-all"
            >
              Browse Products
            </Link>
            <Link
              href="/contact"
              className="border border-[#E8EAF2] text-[#111111] px-8 py-4 rounded-full font-semibold hover:border-[#004AAD] hover:text-[#004AAD] transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
