export default function ShippingPage() {
  const sections = [
    {
      label: "Delivery",
      title: "The Delivery Promise",
      content: "At Lenzify, we believe the delivery of your eyewear should be as precise as the frames themselves. Each order is processed through our dedicated inspection facility, where master opticians verify the alignment, lens clarity, and finish before safe packaging.",
      subsections: [
        {
          title: "Insured Shipping Across India",
          content: "We partner with specialized logistics carriers to ensure your package is handled with care. Standard delivery typically arrives within 3 to 7 business days, depending on your location. All shipments are fully insured and trackable from our workshop to your door.",
        },
      ],
      items: null,
    },
    {
      label: "Lens Replacement",
      title: "Lens Replacement Exchange",
      content: "Our unique Lens Replacement Service is designed for those who have frames they love but vision that evolves. When you initiate a Lens Replacement order:",
      subsections: [],
      items: [
        { label: "Frame Pickup", desc: "We schedule a secure pickup of your existing frames from your provided address." },
        { label: "Lens Fitting", desc: "Once received, our lab extracts the old lenses and fits your frames with new, precision-calibrated optics." },
        { label: "Return Delivery", desc: "We deliver your renewed eyewear back to you, fully sanitized and adjusted." },
      ],
    },
    {
      label: "Returns",
      title: "Returns & Adjustments",
      content: "We strive for absolute visual perfection. If for any reason your eyewear does not meet your expectations, we offer a 14-day return window.",
      subsections: [
        {
          title: "Prescription Lens Returns",
          content: "Since prescription lenses are custom-manufactured to your medical specifications, they are subject to a laboratory re-stocking fee if returned. However, our Vision Integrity Guarantee covers any manufacturing defects or prescription mismatches identified within the first 30 days.",
        },
        {
          title: "Frame Returns",
          content: "Non-customized frames must be returned in their original, pristine condition with all original packaging and documentation intact.",
        },
      ],
      items: null,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#03173D] via-[#004AAD] to-[#009DFF] pt-28 md:pt-40 pb-14 md:pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-5">
          <p className="text-white/70 text-xs font-semibold uppercase tracking-widest">Shipping & Logistics</p>
          <h1 className="font-[var(--font-hero)] italic text-white text-5xl md:text-8xl leading-none">
            Shipping & Returns
          </h1>
          <p className="text-white/70 text-base leading-relaxed max-w-lg">
            Every delivery is a promise — handled with the same precision that goes into crafting your eyewear.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 md:py-28 bg-[#F8F9FC]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-6">
          {sections.map((section, si) => (
            <div key={si} className="bg-white border border-[#ECECEC] rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] p-10 space-y-5">
              <p className="text-[#004AAD] text-xs font-semibold uppercase tracking-widest">{section.label}</p>
              <h2 className="text-3xl font-serif italic text-[#111111]">{section.title}</h2>
              {section.content && (
                <p className="text-[#666666] text-sm leading-relaxed">{section.content}</p>
              )}
              {section.items && (
                <ul className="space-y-4">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex gap-4">
                      <div className="w-2 h-2 rounded-full bg-[#004AAD] mt-2 shrink-0" />
                      <div>
                        <span className="text-[#111111] font-semibold text-sm">{item.label}: </span>
                        <span className="text-[#666666] text-sm leading-relaxed">{item.desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {section.subsections && section.subsections.length > 0 && (
                <div className="space-y-5 pt-4 border-t border-[#ECECEC]">
                  {section.subsections.map((sub, i) => (
                    <div key={i}>
                      <h3 className="text-xl font-serif italic text-[#111111] mb-3">{sub.title}</h3>
                      <p className="text-[#666666] text-sm leading-relaxed">{sub.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
