import { motion } from "framer-motion";

export default function CareGuidePage() {
  const sections = [
    {
      title: "The Art of Maintenance",
      content: "High-fashion editorial eyewear is an investment in your visual identity. Proper maintenance ensures that your frames remain as striking and clear as the day they left our atelier.",
      items: null,
      label: "Overview",
    },
    {
      title: "Daily Cleaning Protocol",
      content: "Lenses are highly technical surface layers. To maintain their clarity:",
      items: [
        { label: "Use the Microfiber", desc: "Only clean your lenses with the Lenzify microfiber cloth provided." },
        { label: "Avoid Clothing", desc: "Never use shirts, napkins, or paper towels, as these fibers can cause microscopic scratches that accumulate over time." },
        { label: "Rinse First", desc: "If there is visible dust or grit, rinse the frames under lukewarm water before wiping to prevent dragging particles across the lens surface." },
      ],
      label: "Daily Care",
    },
    {
      title: "Storage & Handling",
      content: null,
      items: [
        { label: "Two Hands", desc: "Always use both hands to put on or remove your glasses. This prevents the hinges from stretching and ensures the frames remain perfectly aligned." },
        { label: "Hard Case", desc: "When not in use, always store your eyewear in its hard case. \"Face-up\" is the golden rule to prevent lens contact with hard surfaces." },
        { label: "Regular Adjustments", desc: "Screws may loosen naturally with wear. We recommend a professional adjustment at an optical shop every 6 months." },
      ],
      label: "Storage",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#03173D] via-[#004AAD] to-[#009DFF] pt-40 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="space-y-5">
            <p className="text-white/70 text-xs font-semibold uppercase tracking-widest">Care Guide</p>
            <h1 className="font-[var(--font-hero)] italic text-white text-5xl md:text-8xl leading-none">
              Optical Care Guide
            </h1>
            <p className="text-white/70 text-base leading-relaxed max-w-lg">
              Everything you need to know to keep your Lenzify eyewear performing and looking its best.
            </p>
          </div>
        </div>
      </section>

      {/* Material Cards */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-12 space-y-3">
            <p className="text-[#004AAD] text-xs font-semibold uppercase tracking-widest">Material Care</p>
            <h2 className="font-[var(--font-hero)] italic text-[#111111] text-4xl md:text-5xl">Know Your Frames</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-0">
            {[
              {
                title: "Acetate Frames",
                desc: "Our hand-polished acetates are natural materials. Avoid leaving them in high-heat environments (such as a car dashboard), as extreme heat can warp the frame architecture or affect the optical alignment.",
              },
              {
                title: "Metal Frames",
                desc: "Wipe down metal temples after wear to remove skin oils and moisture, preserving the plating and preventing oxidation of the nose pads.",
              },
            ].map((mat, i) => (
              <div key={i} className="bg-white border border-[#ECECEC] rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(0,0,0,0.12)] transition-all duration-300 p-8">
                <p className="text-[#004AAD] text-xs font-semibold uppercase tracking-widest mb-3">Material Care</p>
                <h3 className="text-2xl font-serif italic text-[#111111] mb-4">{mat.title}</h3>
                <p className="text-[#666666] text-sm leading-relaxed">{mat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Care Sections */}
      <section className="py-20 md:py-28 bg-[#F8F9FC]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-6">
          {sections.map((section, si) => (
            <div
              key={si}
              className="bg-white border border-[#ECECEC] rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] p-10"
            >
              <p className="text-[#004AAD] text-xs font-semibold uppercase tracking-widest mb-3">
                {section.label}
              </p>
              <h2 className="text-3xl font-serif italic text-[#111111] mb-5">{section.title}</h2>
              {section.content && (
                <p className="text-[#666666] text-sm leading-relaxed mb-6">{section.content}</p>
              )}
              {section.items && (
                <ul className="space-y-5">
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
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
