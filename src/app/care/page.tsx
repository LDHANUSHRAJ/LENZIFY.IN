import PolicyPage from "@/components/layout/PolicyPage";

export default function CareGuidePage() {
  return (
    <PolicyPage 
      title="Optical Care Guide" 
      subtitle="Preserving the Visionary"
    >
      <section>
        <h2>The Art of Maintenance</h2>
        <p>
          High-fashion editorial eyewear is an investment in your visual identity. Proper maintenance 
          ensures that your frames remain as striking and clear as the day they left our atelier.
        </p>
      </section>

      <hr />

      <section>
        <h2>Daily Cleaning Protocol</h2>
        <p>
          Lenses are highly technical surface layers. To maintain their clarity:
        </p>
        <ul>
          <li><strong>Use the Microfiber:</strong> Only clean your lenses with the Lenzify microfiber cloth provided.</li>
          <li><strong>Avoid Clothing:</strong> Never use shirts, napkins, or paper towels, as these fibers can cause microscopic scratches that accumulate over time.</li>
          <li><strong>Rinse First:</strong> If there is visible dust or grit, rinse the frames under lukewarm water before wiping to prevent dragging particles across the lens surface.</li>
        </ul>
      </section>

      <hr />

      <section>
        <h2>Material Preservation</h2>
        <h3>Acetate Frames</h3>
        <p>
          Our hand-polished acetates are natural materials. Avoid leaving them in high-heat environments 
          (such as a car dashboard), as extreme heat can warp the frame architecture or affect the 
          optical alignment.
        </p>
        <h3>Metal Frames</h3>
        <p>
          Wipe down metal temples after wear to remove skin oils and moisture, preserving the plating 
          and prevent oxidation of the nose pads.
        </p>
      </section>

      <hr />

      <section>
        <h2>Storage & Handling</h2>
        <ul>
          <li><strong>Two Hands:</strong> Always use both hands to put on or remove your glasses. This prevents the hinges from stretching and ensures the frames remain perfectly aligned.</li>
          <li><strong>Hard Case:</strong> When not in use, always store your eyewear in its hard case. "Face-up" is the golden rule to prevent lens contact with hard surfaces.</li>
          <li><strong>Regular Adjustments:</strong> Screws may loosen naturally with wear. We recommend a professional adjustment at an optical shop every 6 months.</li>
        </ul>
      </section>
    </PolicyPage>
  );
}
