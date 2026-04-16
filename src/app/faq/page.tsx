import PolicyPage from "@/components/layout/PolicyPage";

export default function FAQPage() {
  const faqs = [
    {
      category: "Lens Replacement Service",
      questions: [
        {
          q: "How does the 'Pick up & Fix' service work?",
          a: "Once you place a lens replacement order, we schedule a secure pickup of your existing frames from your doorstep. We take them to our lab, fit them with new precision lenses, and deliver them back to you. It's the ultimate rejuvenation for your favorite frames."
        },
        {
          q: "Can you replace lenses in any frame?",
          a: "Yes, our master opticians can fit new lenses into almost any frame, including those purchased from other retailers, as long as the frame is in stable structural condition."
        }
      ]
    },
    {
      category: "Orders & Prescriptions",
      questions: [
        {
          q: "How do I provide my prescription?",
          a: "You can manually enter your prescription values during the checkout process or upload a photo/PDF of your medical script. If you're unsure, you can also email it to us after placing the order."
        },
        {
          q: "What is PD (Pupillary Distance) and why do I need it?",
          a: "PD is the distance between your pupils in millimeters. It ensures the optical center of the lenses is aligned perfectly with your eyes for maximum clarity and comfort."
        }
      ]
    },
    {
      category: "Shipping & Returns",
      questions: [
        {
          q: "How long does delivery take?",
          a: "Standard orders typically take 3-7 business days. Lens replacement orders may take 5-10 business days as they involve a pickup, laboratory processing, and return delivery cycle."
        },
        {
          q: "What is your return policy?",
          a: "We offer a 14-day return window for frames. Custom-made prescription lenses are subject to a laboratory fee as they are uniquely manufactured for your eyes."
        }
      ]
    }
  ];

  return (
    <PolicyPage 
      title="Common Inquiries" 
      subtitle="The Knowledge Base"
    >
      <div className="space-y-16">
        {faqs.map((section) => (
          <section key={section.category}>
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-primary mb-10 pb-4 border-b border-outline/10">
              {section.category}
            </h2>
            <div className="space-y-10">
              {section.questions.map((item, i) => (
                <div key={i} className="group">
                  <h3 className="text-xl font-serif italic text-primary mb-4 group-hover:text-secondary transition-colors">
                    {item.q}
                  </h3>
                  <p className="text-on-surface-variant leading-relaxed">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      
      <hr />
      
      <div className="text-center py-12">
        <p className="text-xs font-bold uppercase tracking-widest text-on-surface/40 mb-6">Still need assistance?</p>
        <a 
          href="mailto:lenzify.in@gmail.com" 
          className="inline-block border-b border-primary text-xs font-black uppercase tracking-widest hover:text-secondary hover:border-secondary transition-all"
        >
          Contact Our Concierge
        </a>
      </div>
    </PolicyPage>
  );
}
