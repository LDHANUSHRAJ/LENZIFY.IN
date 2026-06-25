import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how Lenzify collects, uses, and protects your personal data including prescription information.",
};

const sections = [
  {
    label: "Introduction",
    title: "Introduction",
    content: "At Lenzify (\"we\", \"our\", \"us\"), we are committed to protecting your privacy and security. This Privacy Policy explains how we collect, use, and safeguard your personal information when you visit our platform and use our services.",
    items: null,
    note: null,
  },
  {
    label: "Data Collection",
    title: "Data We Collect",
    content: null,
    items: [
      { label: "Personal Identification", desc: "Name, email address, phone number, and shipping address." },
      { label: "Medical Data", desc: "Optical prescriptions and measurements (PD) necessary for manufacturing custom lenses." },
      { label: "Transactional Data", desc: "Payment details (processed through secure third-party gateways) and order history." },
      { label: "Technical Data", desc: "IP address, browser type, device information, and usage patterns to optimize your experience." },
    ],
    note: null,
  },
  {
    label: "Usage",
    title: "Usage of Information",
    content: "Your information is used to:",
    items: [
      { label: "", desc: "Process and fulfill your orders, including custom lens manufacturing" },
      { label: "", desc: "Manage your account and provide customer support" },
      { label: "", desc: "Send order updates and delivery notifications" },
      { label: "", desc: "Improve our products and services" },
      { label: "", desc: "Prevent fraud and ensure platform security" },
      { label: "", desc: "Comply with legal obligations" },
    ],
    note: "For our Lens Replacement Service, we share your pickup address with our logistics partners to facilitate frame collection and delivery.",
  },
  {
    label: "Third Parties",
    title: "Third-Party Sharing",
    content: "We share your data only with:",
    items: [
      { label: "Razorpay", desc: "For secure payment processing. We never store your card details." },
      { label: "Logistics Partners", desc: "Shipping address and phone for delivery coordination." },
      { label: "Supabase", desc: "Cloud database hosting (data encrypted at rest and in transit)." },
    ],
    note: "We do not sell, rent, or trade your personal information to third parties for marketing purposes.",
  },
  {
    label: "Cookies",
    title: "Cookies",
    content: "We use essential cookies for authentication and cart functionality. Optional analytics cookies (Google Analytics) are used to understand usage patterns. You can manage cookie preferences through your browser settings or our cookie consent banner.",
    items: null,
    note: null,
  },
  {
    label: "Retention",
    title: "Data Retention",
    content: "We retain your personal data for as long as your account is active or as needed to provide services. Order and prescription records are kept for 3 years for warranty and legal purposes. You can request deletion of your account and associated data at any time.",
    items: null,
    note: null,
  },
  {
    label: "Security",
    title: "Data Security",
    content: "We implement industry-standard security measures including SSL/TLS encryption, secure authentication via Supabase Auth, and PCI-DSS compliant payment processing via Razorpay. Access to personal data is restricted to authorized personnel only.",
    items: null,
    note: null,
  },
  {
    label: "Children",
    title: "Children's Privacy",
    content: "Our services are not directed to individuals under the age of 13. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal data, we will take steps to delete such information.",
    items: null,
    note: null,
  },
  {
    label: "Your Rights",
    title: "Your Rights",
    content: "You have the right to:",
    items: [
      { label: "", desc: "Access your personal data" },
      { label: "", desc: "Correct inaccurate information" },
      { label: "", desc: "Request deletion of your data" },
      { label: "", desc: "Object to data processing" },
      { label: "", desc: "Data portability (export your data)" },
      { label: "", desc: "Withdraw consent at any time" },
    ],
    note: "Exercise these rights through your account dashboard or by contacting our team at lenzify.in@gmail.com. Last updated: May 2026.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#03173D] via-[#004AAD] to-[#009DFF] pt-40 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-5">
          <p className="text-white/70 text-xs font-semibold uppercase tracking-widest">Legal</p>
          <h1 className="font-[var(--font-hero)] italic text-white text-5xl md:text-8xl leading-none">
            Privacy Policy
          </h1>
          <p className="text-white/70 text-base leading-relaxed max-w-lg">
            Your data is handled with the same precision and care we apply to every lens we craft.
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
              {section.note && (
                <p className="text-[#AAAAAA] text-xs leading-relaxed pt-4 border-t border-[#ECECEC] italic">{section.note}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
