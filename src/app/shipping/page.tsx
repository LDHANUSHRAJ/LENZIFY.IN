import PolicyPage from "@/components/layout/PolicyPage";

export default function ShippingPage() {
  return (
    <PolicyPage 
      title="Shipping & Returns" 
      subtitle="The Logistics of Excellence"
    >
      <section>
        <h2>The Delivery Protocol</h2>
        <p>
          At Lenzify, we believe the delivery of your visionary eyewear should be as precise as the frames themselves. 
          Each order is processed through our dedicated inspection facility, where master opticians verify the alignment, 
          lens clarity, and finish before safe containment in our signature eco-luxe packaging.
        </p>
        
        <h3>Global Insured Shipping</h3>
        <p>
          We partner with specialized logistics carriers to ensure your package is handled with care. 
          Standard delivery typically arrives within 3 to 7 business days, depending on your geographic coordinate. 
          All shipments are fully insured and trackable from our atelier to your door.
        </p>
      </section>

      <hr />

      <section>
        <h2>Lens Replacement Exchange</h2>
        <p>
          Our unique <strong>Lens Replacement Service</strong> is designed for those who have frames they love but vision that evolves. 
        </p>
        <p>
          When you initiate a Lens Replacement protocol:
        </p>
        <ul>
          <li><strong>Frame Extraction:</strong> We will schedule a secure pickup of your existing frames from your provided address.</li>
          <li><strong>Optical Injection:</strong> Once received, our lab extracts the old lenses and fits your frames with new, precision-calibrated optics.</li>
          <li><strong>Return Delivery:</strong> We deliver your renewed eyewear back to you, fully sanitized and adjusted.</li>
        </ul>
      </section>

      <hr />

      <section>
        <h2>Returns & Adjustments</h2>
        <p>
          We strive for absolute visual perfection. If for any reason your eyewear does not meet your expectations, we offer a 14-day return window.
        </p>
        <h3>Prescription Lens Returns</h3>
        <p>
          Since prescription lenses are custom-manufactured to your medical specifications, they are subject to a laboratory re-stocking fee if returned. 
          However, our <strong>Vision Integrity Guarantee</strong> covers any manufacturing defects or prescription mismatches identified within the first 30 days.
        </p>
        <h3>Frame Returns</h3>
        <p>
          Non-customized frames must be returned in their original, pristine condition with all archival packaging and documentation intact.
        </p>
      </section>
    </PolicyPage>
  );
}
