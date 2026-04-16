import PolicyPage from "@/components/layout/PolicyPage";

export default function WarrantyPage() {
  return (
    <PolicyPage 
      title="Warranty & Guarantee" 
      subtitle="Commitment to Longevity"
    >
      <section>
        <h2>Frame Integrity Warranty</h2>
        <p>
          Every frame purchased from Lenzify is protected by our <strong>3-Month Manufacturing Warranty</strong>. 
          This covers any structural defects, material failure, or manufacturing inconsistencies that occur under normal usage.
        </p>
        <p>
          If your frame develops a structural fault, we will repair or replace it at no cost to you.
        </p>
      </section>

      <hr />

      <section>
        <h2>Optical Clarity Guarantee</h2>
        <p>
          We guarantee that your lenses will be manufactured exactly to the prescription provided in your order.
        </p>
        <h3>Coating Durability</h3>
        <p>
          Premium coatings (Anti-Glare, Blue-Cut, and Scratch-Resistant) are warranted against peeling or crazing for a period of 3 months from the date of purchase.
        </p>
      </section>

      <hr />

      <section>
        <h2>What's Not Covered</h2>
        <p>
          While we stand behind our craftsmanship, our warranty does not cover:
        </p>
        <ul>
          <li>Accidental damage (dropped frames, crush damage, or impacts).</li>
          <li>Scratches caused by improper cleaning methods (using paper towels, clothing, or harsh chemicals).</li>
          <li>Theft or loss.</li>
          <li>Unauthorized repairs or modifications.</li>
        </ul>
      </section>

      <hr />

      <section>
        <h2>How to File a Claim</h2>
        <p>
          To initiate a warranty claim, please email our support concierge at <strong>lenzify.in@gmail.com</strong> 
          with your order number and high-resolution images of the defect. Our technical team will review the claim 
          within 48 hours.
        </p>
      </section>
    </PolicyPage>
  );
}
