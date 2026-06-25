import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read the Lenzify Terms of Service covering purchases, returns, prescriptions, and platform usage.",
};

const sections = [
  {
    label: "Agreement",
    title: "Agreement to Terms",
    content: "By accessing or using the Lenzify platform, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must discontinue use of our services.",
    items: null,
    subsections: null,
  },
  {
    label: "Purchase",
    title: "Purchase & Customization",
    content: "Lenzify specializes in custom-manufactured optical products. By providing a prescription, you warrant that the information is accurate and has been provided by a licensed medical professional within the last 24 months.",
    items: null,
    subsections: [
      {
        title: "Lens Replacement Service Terms",
        content: "When using the Lens Replacement Service, you acknowledge that Lenzify's responsibility begins once the frames are collected by our logistics partner. We are not responsible for frames that are in an advanced state of degradation or structural fragility. In the rare event that a frame is damaged during the optical injection process, our liability is limited to the current market value of the frame or a replacement of equal aesthetic value.",
      },
    ],
  },
  {
    label: "Pricing",
    title: "Pricing & Payments",
    content: "All prices displayed on the platform are in Indian Rupees (INR) and include applicable taxes unless stated otherwise. We reserve the right to modify prices without prior notice. Payment is processed securely via Razorpay. We accept UPI, Net Banking, Credit/Debit cards, and Cash on Delivery.",
    items: null,
    subsections: null,
  },
  {
    label: "Cancellation",
    title: "Cancellation & Refund Policy",
    content: null,
    items: [
      { label: "Cancellation", desc: "Orders can be cancelled within 2 hours of placement if they haven't entered manufacturing." },
      { label: "Custom Lenses", desc: "Custom-ground prescription lenses are non-refundable once manufacturing begins." },
      { label: "Returns", desc: "Non-prescription items may be returned within 14 days in original condition for a full refund." },
      { label: "Refund Timeline", desc: "Refunds are processed within 7-10 business days to the original payment method." },
      { label: "Damaged Products", desc: "Report within 48 hours of delivery with photographs for a free replacement." },
    ],
    subsections: null,
  },
  {
    label: "Warranty",
    title: "Warranty",
    content: "All frames purchased from Lenzify carry a 1-year warranty against manufacturing defects. This warranty does not cover damage from misuse, accidents, or normal wear and tear. Prescription lenses carry a 6-month warranty against coating defects.",
    items: null,
    subsections: null,
  },
  {
    label: "Conduct",
    title: "User Conduct",
    content: "You agree not to:",
    items: [
      { label: "", desc: "Use the platform for any unlawful purpose" },
      { label: "", desc: "Attempt to reverse-engineer or exploit our systems" },
      { label: "", desc: "Submit false prescriptions or personal information" },
      { label: "", desc: "Engage in abusive behavior towards our staff" },
      { label: "", desc: "Resell products purchased through the platform without authorization" },
    ],
    subsections: null,
  },
  {
    label: "IP",
    title: "Intellectual Property",
    content: "All content on the Lenzify platform, including photography and code, is the property of Lenzify and is protected by intellectual property laws.",
    items: null,
    subsections: null,
  },
  {
    label: "Liability",
    title: "Limitation of Liability",
    content: "Lenzify shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our services. Our total liability shall not exceed the amount paid by you for the specific product or service giving rise to the claim.",
    items: null,
    subsections: null,
  },
  {
    label: "Law",
    title: "Governing Law",
    content: "These terms are governed by the laws of India. Any disputes arising from the use of our services shall be subject to the exclusive jurisdiction of the courts in Bangalore. For any clarifications, reach out to lenzify.in@gmail.com.",
    items: null,
    subsections: null,
    note: "Last updated: May 2026",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#03173D] via-[#004AAD] to-[#009DFF] pt-40 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-5">
          <p className="text-white/70 text-xs font-semibold uppercase tracking-widest">Legal</p>
          <h1 className="font-[var(--font-hero)] italic text-white text-5xl md:text-8xl leading-none">
            Terms of Service
          </h1>
          <p className="text-white/70 text-base leading-relaxed max-w-lg">
            Please read these terms carefully before using the Lenzify platform.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 md:py-28 bg-[#F8F9FC]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-4">
          {sections.map((section, si) => (
            <div key={si} className="bg-white border border-[#ECECEC] rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] p-10 space-y-5">
              <p className="text-[#004AAD] text-xs font-semibold uppercase tracking-widest">{section.label}</p>
              <h2 className="text-2xl font-serif italic text-[#111111]">{section.title}</h2>
              {section.content && (
                <p className="text-[#666666] text-sm leading-relaxed">{section.content}</p>
              )}
              {section.items && (
                <ul className="space-y-3">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex gap-4">
                      <div className="w-2 h-2 rounded-full bg-[#004AAD]/40 mt-2 shrink-0" />
                      <div>
                        {item.label && <span className="text-[#111111] font-semibold text-sm">{item.label}: </span>}
                        <span className="text-[#666666] text-sm leading-relaxed">{item.desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {section.subsections && (
                <div className="space-y-4 pt-4 border-t border-[#ECECEC]">
                  {section.subsections.map((sub, i) => (
                    <div key={i}>
                      <h3 className="text-lg font-serif italic text-[#111111] mb-2">{sub.title}</h3>
                      <p className="text-[#666666] text-sm leading-relaxed">{sub.content}</p>
                    </div>
                  ))}
                </div>
              )}
              {(section as any).note && (
                <p className="text-[#AAAAAA] text-xs italic pt-2 border-t border-[#ECECEC]">{(section as any).note}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
