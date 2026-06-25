export default function WarrantyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#03173D] via-[#004AAD] to-[#009DFF] pt-40 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-5">
          <p className="text-white/70 text-xs font-semibold uppercase tracking-widest">Our Promise</p>
          <h1 className="font-[var(--font-hero)] italic text-white text-5xl md:text-8xl leading-none">
            Warranty & Guarantee
          </h1>
          <p className="text-white/70 text-base leading-relaxed max-w-lg">
            We stand behind every frame and every lens. Our guarantees reflect our commitment to optical excellence.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 md:py-28 bg-[#F8F9FC]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-6">

          {/* Frame Integrity */}
          <div className="bg-white border border-[#ECECEC] rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] p-10 space-y-5">
            <p className="text-[#004AAD] text-xs font-semibold uppercase tracking-widest">Frame Protection</p>
            <h2 className="text-3xl font-serif italic text-[#111111]">Frame Integrity Warranty</h2>
            <p className="text-[#666666] text-sm leading-relaxed">
              Every frame purchased from Lenzify is protected by our <strong className="text-[#111111]">3-Month Manufacturing Warranty</strong>. This covers any structural defects, material failure, or manufacturing inconsistencies that occur under normal usage.
            </p>
            <p className="text-[#666666] text-sm leading-relaxed">
              If your frame develops a structural fault, we will repair or replace it at no cost to you.
            </p>
          </div>

          {/* Optical Clarity */}
          <div className="bg-white border border-[#ECECEC] rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] p-10 space-y-5">
            <p className="text-[#004AAD] text-xs font-semibold uppercase tracking-widest">Lens Protection</p>
            <h2 className="text-3xl font-serif italic text-[#111111]">Optical Clarity Guarantee</h2>
            <p className="text-[#666666] text-sm leading-relaxed">
              We guarantee that your lenses will be manufactured exactly to the prescription provided in your order.
            </p>
            <div className="border-t border-[#ECECEC] pt-5">
              <h3 className="text-xl font-serif italic text-[#111111] mb-3">Coating Durability</h3>
              <p className="text-[#666666] text-sm leading-relaxed">
                Premium coatings (Anti-Glare, Blue-Cut, and Scratch-Resistant) are warranted against peeling or crazing for a period of 3 months from the date of purchase.
              </p>
            </div>
          </div>

          {/* Not Covered */}
          <div className="bg-white border border-[#ECECEC] rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] p-10 space-y-5">
            <p className="text-[#004AAD] text-xs font-semibold uppercase tracking-widest">Exclusions</p>
            <h2 className="text-3xl font-serif italic text-[#111111]">What&apos;s Not Covered</h2>
            <p className="text-[#666666] text-sm leading-relaxed">While we stand behind our craftsmanship, our warranty does not cover:</p>
            <ul className="space-y-3">
              {[
                "Accidental damage (dropped frames, crush damage, or impacts).",
                "Scratches caused by improper cleaning methods (using paper towels, clothing, or harsh chemicals).",
                "Theft or loss.",
                "Unauthorized repairs or modifications.",
              ].map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-[#CCCCCC] mt-2 shrink-0" />
                  <span className="text-[#666666] text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Filing a Claim */}
          <div className="bg-white border border-[#ECECEC] rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] p-10 space-y-5">
            <p className="text-[#004AAD] text-xs font-semibold uppercase tracking-widest">Claims Process</p>
            <h2 className="text-3xl font-serif italic text-[#111111]">How to File a Claim</h2>
            <p className="text-[#666666] text-sm leading-relaxed">
              To initiate a warranty claim, please email our support team at{" "}
              <a href="mailto:lenzify.in@gmail.com" className="text-[#004AAD] hover:underline">lenzify.in@gmail.com</a>{" "}
              with your order number and clear images of the defect. Our technical team will review the claim within 48 hours.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
