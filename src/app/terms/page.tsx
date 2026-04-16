import PolicyPage from "@/components/layout/PolicyPage";

export default function TermsPage() {
  return (
    <PolicyPage 
      title="Terms of Service" 
      subtitle="Usage Governance"
    >
      <section>
        <h2>Agreement to Terms</h2>
        <p>
          By accessing or using the Lenzify platform, you agree to be bound by these Terms of Service. 
          If you do not agree with any part of these terms, you must discontinue use of our services.
        </p>
      </section>

      <hr />

      <section>
        <h2>Purchase & Customization</h2>
        <p>
          Lenzify specialized in custom-manufactured optical products. By providing a prescription, you 
          warrant that the information is accurate and has been provided by a licensed medical professional 
          within the last 24 months.
        </p>
        <h3>Lens Replacement Service Terms</h3>
        <p>
          When using the Lens Replacement Service, you acknowledge that Lenzify's responsibility begins 
          once the frames are collected by our logistics partner. We are not responsible for frames that 
          are in an advanced state of degradation or structural fragility. In the rare event that a frame 
          is damaged during the optical injection process, our liability is limited to the current market 
          value of the frame or a replacement of equal aesthetic value.
        </p>
      </section>

      <hr />

      <section>
        <h2>Intellectual Property</h2>
        <p>
          All content on the Lenzify platform, including the "Visionary Editorial" aesthetic, photography, 
          and code, is the property of Lenzify and is protected by intellectual property laws.
        </p>
      </section>

      <hr />

      <section>
        <h2>Governing Law</h2>
        <p>
          These terms are governed by the laws of India. Any disputes arising from the use of our 
          services shall be subject to the exclusive jurisdiction of the courts in Bangalore.
        </p>
        <p>
          For any clarifications, reach out to <strong>lenzify.in@gmail.com</strong>.
        </p>
      </section>
    </PolicyPage>
  );
}
