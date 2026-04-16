import PolicyPage from "@/components/layout/PolicyPage";

export default function PrivacyPage() {
  return (
    <PolicyPage 
      title="Privacy Policy" 
      subtitle="Data Integrity Protocol"
    >
      <section>
        <h2>Introduction</h2>
        <p>
          At Lenzify ("we", "our", "us"), we are committed to protecting your privacy and security. 
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
          <li><strong>Technical Data:</strong> IP address, browser type, and usage patterns to optimize your experience.</li>
        </ul>
      </section>

      <hr />

      <section>
        <h2>Usage of Information</h2>
        <p>
          Your information is used to process orders, manage your account, and provide customer support. 
          For our <strong>Lens Replacement Service</strong>, we share your pickup address with our logistics partners 
          to facilitate frame extraction.
        </p>
      </section>

      <hr />

      <section>
        <h2>Your Rights</h2>
        <p>
          You have the right to access, correct, or delete your personal data at any time through your 
          account dashboard or by contacting our concierge at <strong>lenzify.in@gmail.com</strong>.
        </p>
      </section>
    </PolicyPage>
  );
}
