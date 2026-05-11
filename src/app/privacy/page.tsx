import PolicyPage from "@/components/layout/PolicyPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how Lenzify collects, uses, and protects your personal data including prescription information.",
};

export default function PrivacyPage() {
  return (
    <PolicyPage 
      title="Privacy Policy" 
      subtitle="Data Integrity Protocol"
    >
      <section>
        <h2>Introduction</h2>
        <p>
          At Lenzify (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;), we are committed to protecting your privacy and security. 
          This Privacy Policy explains how we collect, use, and safeguard your personal information 
          when you visit our platform and use our services.
        </p>
      </section>

      <hr />

      <section>
        <h2>Data We Collect</h2>
        <ul>
          <li><strong>Personal Identification:</strong> Name, email address, phone number, and shipping address.</li>
          <li><strong>Medical Data:</strong> Optical prescriptions and measurements (PD) necessary for manufacturing custom lenses.</li>
          <li><strong>Transactional Data:</strong> Payment details (processed through secure third-party gateways) and order history.</li>
          <li><strong>Technical Data:</strong> IP address, browser type, device information, and usage patterns to optimize your experience.</li>
        </ul>
      </section>

      <hr />

      <section>
        <h2>Usage of Information</h2>
        <p>Your information is used to:</p>
        <ul>
          <li>Process and fulfill your orders, including custom lens manufacturing</li>
          <li>Manage your account and provide customer support</li>
          <li>Send order updates and delivery notifications</li>
          <li>Improve our products and services</li>
          <li>Prevent fraud and ensure platform security</li>
          <li>Comply with legal obligations</li>
        </ul>
        <p>
          For our <strong>Lens Replacement Service</strong>, we share your pickup address with our logistics partners 
          to facilitate frame collection and delivery.
        </p>
      </section>

      <hr />

      <section>
        <h2>Third-Party Sharing</h2>
        <p>We share your data only with:</p>
        <ul>
          <li><strong>Razorpay:</strong> For secure payment processing. We never store your card details.</li>
          <li><strong>Logistics Partners:</strong> Shipping address and phone for delivery coordination.</li>
          <li><strong>Supabase:</strong> Cloud database hosting (data encrypted at rest and in transit).</li>
        </ul>
        <p>We do <strong>not</strong> sell, rent, or trade your personal information to third parties for marketing purposes.</p>
      </section>

      <hr />

      <section>
        <h2>Cookies</h2>
        <p>
          We use essential cookies for authentication and cart functionality. Optional analytics cookies 
          (Google Analytics) are used to understand usage patterns. You can manage cookie preferences 
          through your browser settings or our cookie consent banner.
        </p>
      </section>

      <hr />

      <section>
        <h2>Data Retention</h2>
        <p>
          We retain your personal data for as long as your account is active or as needed to provide services. 
          Order and prescription records are kept for 3 years for warranty and legal purposes. 
          You can request deletion of your account and associated data at any time.
        </p>
      </section>

      <hr />

      <section>
        <h2>Data Security</h2>
        <p>
          We implement industry-standard security measures including SSL/TLS encryption, secure authentication 
          via Supabase Auth, and PCI-DSS compliant payment processing via Razorpay. Access to personal data 
          is restricted to authorized personnel only.
        </p>
      </section>

      <hr />

      <section>
        <h2>Children&apos;s Privacy</h2>
        <p>
          Our services are not directed to individuals under the age of 13. We do not knowingly collect 
          personal information from children. If we become aware that a child has provided us with personal 
          data, we will take steps to delete such information.
        </p>
      </section>

      <hr />

      <section>
        <h2>Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Correct inaccurate information</li>
          <li>Request deletion of your data</li>
          <li>Object to data processing</li>
          <li>Data portability (export your data)</li>
          <li>Withdraw consent at any time</li>
        </ul>
        <p>
          Exercise these rights through your account dashboard or by contacting our team at{" "}
          <strong>lenzify.in@gmail.com</strong>.
        </p>
        <p className="text-xs text-on-surface/30 mt-4">
          <em>Last updated: May 2026</em>
        </p>
      </section>
    </PolicyPage>
  );
}
