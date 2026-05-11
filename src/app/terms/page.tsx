import PolicyPage from "@/components/layout/PolicyPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read the Lenzify Terms of Service covering purchases, returns, prescriptions, and platform usage.",
};

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
          Lenzify specializes in custom-manufactured optical products. By providing a prescription, you 
          warrant that the information is accurate and has been provided by a licensed medical professional 
          within the last 24 months.
        </p>
        <h3>Lens Replacement Service Terms</h3>
        <p>
          When using the Lens Replacement Service, you acknowledge that Lenzify&apos;s responsibility begins 
          once the frames are collected by our logistics partner. We are not responsible for frames that 
          are in an advanced state of degradation or structural fragility. In the rare event that a frame 
          is damaged during the optical injection process, our liability is limited to the current market 
          value of the frame or a replacement of equal aesthetic value.
        </p>
      </section>

      <hr />

      <section>
        <h2>Pricing & Payments</h2>
        <p>
          All prices displayed on the platform are in Indian Rupees (INR) and include applicable taxes 
          unless stated otherwise. We reserve the right to modify prices without prior notice. Payment 
          is processed securely via Razorpay. We accept UPI, Net Banking, Credit/Debit cards, and 
          Cash on Delivery.
        </p>
      </section>

      <hr />

      <section>
        <h2>Cancellation & Refund Policy</h2>
        <ul>
          <li><strong>Cancellation:</strong> Orders can be cancelled within 2 hours of placement if they haven&apos;t entered manufacturing.</li>
          <li><strong>Custom Lenses:</strong> Custom-ground prescription lenses are non-refundable once manufacturing begins.</li>
          <li><strong>Returns:</strong> Non-prescription items may be returned within 14 days in original condition for a full refund.</li>
          <li><strong>Refund Timeline:</strong> Refunds are processed within 7-10 business days to the original payment method.</li>
          <li><strong>Damaged Products:</strong> Report within 48 hours of delivery with photographs for a free replacement.</li>
        </ul>
      </section>

      <hr />

      <section>
        <h2>Warranty</h2>
        <p>
          All frames purchased from Lenzify carry a 1-year warranty against manufacturing defects. 
          This warranty does not cover damage from misuse, accidents, or normal wear and tear. 
          Prescription lenses carry a 6-month warranty against coating defects.
        </p>
      </section>

      <hr />

      <section>
        <h2>User Conduct</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the platform for any unlawful purpose</li>
          <li>Attempt to reverse-engineer or exploit our systems</li>
          <li>Submit false prescriptions or personal information</li>
          <li>Engage in abusive behavior towards our staff</li>
          <li>Resell products purchased through the platform without authorization</li>
        </ul>
      </section>

      <hr />

      <section>
        <h2>Intellectual Property</h2>
        <p>
          All content on the Lenzify platform, including the &quot;Visionary Editorial&quot; aesthetic, photography, 
          and code, is the property of Lenzify and is protected by intellectual property laws.
        </p>
      </section>

      <hr />

      <section>
        <h2>Limitation of Liability</h2>
        <p>
          Lenzify shall not be liable for any indirect, incidental, special, or consequential damages 
          arising from the use of our services. Our total liability shall not exceed the amount paid 
          by you for the specific product or service giving rise to the claim.
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
        <p className="text-xs text-on-surface/30 mt-4">
          <em>Last updated: May 2026</em>
        </p>
      </section>
    </PolicyPage>
  );
}
