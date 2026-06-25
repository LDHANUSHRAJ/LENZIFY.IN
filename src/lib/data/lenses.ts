export const LENS_CONTENT: Record<string, {
  name: string;
  headline: string;
  description: string;
  what_it_is: string;
  use_cases: string[];
  ideal_for: string[];
  features: string[];
  feature_details: { title: string; detail: string }[];
}> = {
  "single-vision": {
    name: "Single Vision",
    headline: "One prescription. Edge-to-edge clarity.",
    description: "Single vision lenses carry a single corrective power across the entire lens surface — correcting one distance, whether near, intermediate, or far.",
    what_it_is: "A lens with one uniform optical power throughout its entire surface, designed to correct a single focal distance. The most common lens prescribed worldwide.",
    use_cases: [
      "Distance glasses for driving or watching TV",
      "Reading glasses for close-up work",
      "Computer glasses for intermediate distance",
      "Children's prescription eyewear",
      "Sports and safety eyewear"
    ],
    ideal_for: [
      "Children and teenagers",
      "Adults who need correction for one distance only",
      "Anyone with myopia (nearsightedness) or hyperopia (farsightedness)",
      "Astigmatism correction"
    ],
    features: [
      "Edge-to-Edge Clarity",
      "Signature Scratch Resistance",
      "Hydrophobic Nanostructure",
      "Clinical Grade Precision"
    ],
    feature_details: [
      { title: "Edge-to-Edge Clarity", detail: "Consistent optical power across the full lens surface with zero zone distortion." },
      { title: "Scratch Resistance", detail: "Factory-applied hard coat protects against everyday surface scratches." },
      { title: "Hydrophobic Layer", detail: "Water, dust, and smudges bead off for easier cleaning and lasting cleanliness." },
      { title: "Precision Ground", detail: "CNC surfaced to exact prescription tolerances for accurate, comfortable correction." }
    ]
  },

  "progressive": {
    name: "Progressive",
    headline: "All distances. One seamless lens.",
    description: "Progressive lenses provide a gradual shift in power from top to bottom — distance at the top, intermediate in the middle, near at the bottom — with no visible dividing line.",
    what_it_is: "A multifocal lens that incorporates three vision zones (distance, intermediate, and near) in a single lens with a smooth, invisible power gradient. Designed to eliminate the need for multiple pairs of glasses.",
    use_cases: [
      "Reading and distance in one pair",
      "Office work — switching between screen and across the room",
      "Driving and then checking your phone",
      "Daily all-purpose wear for adults with presbyopia",
      "Replacing the need for separate reading glasses"
    ],
    ideal_for: [
      "Adults 40 and older experiencing presbyopia",
      "Anyone who currently uses two pairs of glasses",
      "People who want a modern, line-free look",
      "Active lifestyles that require constant distance changes"
    ],
    features: [
      "Seamless Multifocal Design",
      "Wide Vision Corridors",
      "Reduced Peripheral Distortion",
      "Precision Digitally Surfaced"
    ],
    feature_details: [
      { title: "Seamless Multifocal Design", detail: "Three zones — distance, intermediate, near — blend invisibly with no visible dividing line." },
      { title: "Wide Vision Corridors", detail: "Generously wide reading and intermediate zones for comfortable extended use." },
      { title: "Reduced Peripheral Distortion", detail: "Advanced digital surfacing minimises the soft-blur zones at the lens edges." },
      { title: "Digitally Surfaced", detail: "Custom ground per prescription for optimal clarity across all three zones." }
    ]
  },

  "bifocal": {
    name: "Bifocal",
    headline: "Two zones. Defined and dependable.",
    description: "Bifocal lenses feature two clearly defined optical zones — the upper portion for distance vision and a lower segment for near vision — separated by a visible line.",
    what_it_is: "A multifocal lens with two separate prescription powers separated by a visible flat-top or round segment. The upper zone corrects distance vision; the lower segment corrects near vision.",
    use_cases: [
      "Reading and driving in a single pair",
      "Anyone transitioning from single vision to multifocal",
      "Professional and trade environments requiring clear distance and close reading",
      "Patients who prefer defined, predictable focal zones"
    ],
    ideal_for: [
      "Adults 40+ with presbyopia",
      "People who find progressive lenses difficult to adapt to",
      "Those who prefer the traditional, reliable bifocal design",
      "Patients with a history of bifocal wear"
    ],
    features: [
      "Defined Distance and Near Zones",
      "Stable Reading Segment",
      "High-Luster Surface Finish",
      "Traditional Multifocal Reliability"
    ],
    feature_details: [
      { title: "Defined Segments", detail: "Clear visible boundary between distance and reading zones for instant zone identification." },
      { title: "Stable Reading Power", detail: "The lower segment provides consistent, unwavering near-vision correction." },
      { title: "High-Luster Finish", detail: "Polished surface for maximum light transmittance and optical clarity." },
      { title: "Proven Design", detail: "Classic bifocal geometry trusted by optometrists and patients for decades." }
    ]
  },

  "zero-power": {
    name: "Zero Power",
    headline: "No prescription. Full protection.",
    description: "Zero power lenses have no corrective power (0.00 diopters) and are designed for people with perfect vision who want the benefits of coatings, protection, or the aesthetic of glasses.",
    what_it_is: "Flat, optically neutral lenses (no refractive power) that sit in frames purely for protection, style, or coating benefits such as blue light filtering, UV blocking, or anti-reflective properties — without altering vision.",
    use_cases: [
      "Screen protection for people who don't need prescription correction",
      "Fashion eyewear with UV and blue light defence",
      "Eye protection in dusty or hazardous environments",
      "Anti-glare driving glasses without prescription",
      "Style eyewear for the fashion-conscious"
    ],
    ideal_for: [
      "People with 20/20 vision",
      "Anyone who wants protective eyewear without a prescription",
      "Screen-heavy users who don't require vision correction",
      "Fashion and lifestyle use cases"
    ],
    features: [
      "Zero Diopter — No Distortion",
      "Premium Anti-Reflective Layer",
      "Dust and Water Repellent",
      "Compatible with All Frame Styles"
    ],
    feature_details: [
      { title: "Zero Diopter", detail: "No prescription power whatsoever — vision remains natural and undistorted." },
      { title: "Anti-Reflective Coating", detail: "Eliminates reflections for comfortable screen use and clear aesthetics." },
      { title: "Water and Dust Repellent", detail: "Hydrophobic outer coat keeps lenses clean and smudge-free." },
      { title: "Universal Fit", detail: "Cut to fit any frame shape from round and rectangular to geometric styles." }
    ]
  },

  "anti-fog": {
    name: "Anti-Fog Coating",
    headline: "Clear vision through every temperature.",
    description: "Anti-fog coating is a hydrophilic surface treatment that absorbs moisture instead of allowing it to condense into fog droplets, keeping lenses clear through sudden temperature changes.",
    what_it_is: "A surface coating that prevents condensation (fogging) by spreading moisture evenly across the lens as a transparent film rather than allowing it to form light-scattering droplets. Applied to one or both lens surfaces.",
    use_cases: [
      "Moving between cold outdoors and warm indoors",
      "Wearing glasses with a face mask (prevents mask-breath fogging)",
      "Kitchen environments with steam and heat",
      "Sports and physical activity where perspiration causes fogging",
      "Healthcare settings requiring clear vision at all times"
    ],
    ideal_for: [
      "Healthcare and frontline workers who wear masks",
      "Cooks and kitchen professionals",
      "Cyclists, runners, and gym users",
      "People living in cold or highly variable climates",
      "Anyone frustrated by constant lens fogging"
    ],
    features: [
      "Hydrophilic Surface Technology",
      "Instant Fog Dissipation",
      "Active-Lifestyle Ready",
      "Long-Lasting Treatment"
    ],
    feature_details: [
      { title: "Hydrophilic Surface", detail: "Attracts and spreads moisture into an invisible film rather than droplets that scatter light." },
      { title: "Instant Dissipation", detail: "Clears within seconds of exposure — no waiting, no wiping." },
      { title: "Activity Ready", detail: "Performs under exertion, sweat, and rapid temperature transitions." },
      { title: "Durable Treatment", detail: "Long-lasting anti-fog properties that withstand daily cleaning and wear." }
    ]
  },

  "anti-reflective": {
    name: "Anti-Reflective Coating",
    headline: "Zero glare. Maximum light.",
    description: "Anti-reflective coating is a multi-layer optical treatment that drastically reduces the amount of light reflected off the lens surface, increasing transmission to nearly 99% and virtually eliminating visible reflections.",
    what_it_is: "A thin multi-layer coating — typically titanium dioxide and silicon dioxide alternating layers — applied to the lens surface to cancel out reflected light through destructive interference. Makes lenses nearly invisible and dramatically improves visual comfort.",
    use_cases: [
      "Night driving to reduce headlight and streetlight glare",
      "Office and screen work to eliminate reflection from monitors",
      "Photography — prevents the white-glare reflection visible in photos",
      "Social situations where invisible-looking lenses are preferred",
      "Reducing eye fatigue caused by artificial lighting"
    ],
    ideal_for: [
      "Night drivers and commuters",
      "Office workers and computer users",
      "Anyone bothered by reflections on their lenses in photos",
      "People who experience headaches or fatigue from screen glare",
      "Patients with light sensitivity"
    ],
    features: [
      "Multi-Layer Glare Reduction",
      "99% Light Transmittance",
      "Improved Night Vision",
      "Near-Invisible Lens Appearance"
    ],
    feature_details: [
      { title: "Multi-Layer Coating", detail: "Multiple thin-film layers cancel reflected light through destructive wave interference." },
      { title: "99% Transmission", detail: "Nearly all light passes through the lens to your eye — nothing is lost to glare." },
      { title: "Night Vision", detail: "Dramatically reduces halos and starbursts around light sources at night." },
      { title: "Invisible Lens Look", detail: "Reflections are eliminated so people see your eyes — not a glare on your lens." }
    ]
  },

  "blue-light": {
    name: "Blue Light Protection",
    headline: "Shield your eyes from digital screens.",
    description: "Blue light protection lenses filter or block high-energy visible (HEV) blue light in the 400–450nm range emitted by digital screens, LED lighting, and other artificial light sources.",
    what_it_is: "A coating or built-in lens material that selectively filters high-energy blue-violet light (approximately 400–450nm) to reduce its intensity reaching the eye. These wavelengths are associated with digital eye strain and potential disruption to sleep cycles.",
    use_cases: [
      "All-day computer, laptop, and monitor work",
      "Prolonged smartphone and tablet use",
      "Gaming sessions lasting multiple hours",
      "Evening screen use before bedtime",
      "LED-lit office environments"
    ],
    ideal_for: [
      "Remote workers and office professionals (6+ hours of screen time daily)",
      "Gamers and content creators",
      "Students with heavy device use",
      "Anyone who experiences eye strain, headaches, or poor sleep linked to screen time",
      "Available with or without prescription"
    ],
    features: [
      "HEV Blue-Cut Technology",
      "Reduced Digital Eye Strain",
      "Sleep-Cycle Protection",
      "Crystal-Clear Transmittance"
    ],
    feature_details: [
      { title: "HEV Blue-Cut", detail: "Selectively filters 400–450nm wavelengths — the most energetic and potentially harmful blue light range." },
      { title: "Reduced Eye Strain", detail: "Lessens fatigue, dryness, and headaches from prolonged screen exposure." },
      { title: "Sleep Protection", detail: "Reducing evening blue light exposure helps maintain natural melatonin production for better sleep." },
      { title: "Clear Optics", detail: "Minimal colour shift — lenses remain optically clear, not yellow or amber-tinted." }
    ]
  },

  "photochromic": {
    name: "Photochromic",
    headline: "Adapts with your environment automatically.",
    description: "Photochromic lenses contain light-reactive molecules that darken automatically when exposed to UV light outdoors and return to clear when back indoors — functioning as both everyday glasses and sunglasses in one.",
    what_it_is: "Lenses embedded with photochromic compounds (such as silver halide or organic dye molecules) that undergo a reversible chemical reaction when activated by ultraviolet radiation, causing the lens to darken. The effect is fully reversible when UV exposure ends.",
    use_cases: [
      "Daily wear that transitions between indoor and outdoor environments",
      "Replacing separate prescription sunglasses",
      "Driving (note: effectiveness varies inside vehicles with UV-blocking windscreens)",
      "Outdoor sports and activities",
      "Travel across varying light conditions"
    ],
    ideal_for: [
      "People who frequently move between indoors and outdoors",
      "Those who want one pair of glasses instead of two",
      "Patients sensitive to bright light (photophobia)",
      "Outdoor workers and commuters",
      "Available in prescription and zero power"
    ],
    features: [
      "Automatic UV-Reactive Darkening",
      "Full UVA & UVB Protection",
      "Fast Transition Speed",
      "Outdoor Glare Reduction"
    ],
    feature_details: [
      { title: "UV-Reactive", detail: "Darkens within 30–60 seconds in bright sunlight; returns to clear in 2–5 minutes indoors." },
      { title: "UV Protection", detail: "Provides 100% UVA and UVB protection at all times, even in the clear state." },
      { title: "Transition Speed", detail: "Modern photochromic molecules activate and deactivate faster than older generations." },
      { title: "Glare Control", detail: "In the darkened outdoor state, reduces squinting and glare-related strain." }
    ]
  },

  "scratch-resistant": {
    name: "Scratch Resistant",
    headline: "Lenses that stay clear as the day you got them.",
    description: "Scratch-resistant coating is a factory-applied hardening treatment that significantly increases the surface hardness of optical lenses, protecting them from everyday scratches caused by handling, cleaning, and dust.",
    what_it_is: "A thin, hard lacquer or silicon-based coating bonded to the lens surface during manufacturing. It increases scratch resistance by raising surface hardness — while the coating does not make lenses scratch-proof, it significantly extends lens life and preserves optical clarity.",
    use_cases: [
      "Daily wear lenses exposed to regular handling",
      "Children's eyewear subject to rough use",
      "Lenses cleaned frequently with fabric or tissue",
      "Work environments with airborne particles or dust",
      "Active lifestyles with higher risk of minor impacts"
    ],
    ideal_for: [
      "Children and active teenagers",
      "People who frequently take their glasses on and off",
      "Those who clean their lenses multiple times per day",
      "Workplace safety glasses",
      "Anyone who wants to extend the lifespan of their lenses"
    ],
    features: [
      "Thermally Cured Hard Coat",
      "Impact-Resistance Boost",
      "Daily Durability Guard",
      "Crystal-Clear Integrity"
    ],
    feature_details: [
      { title: "Hard Coat", detail: "Thermally or UV-cured lacquer that bonds to the lens surface for durable scratch defence." },
      { title: "Impact Resistance", detail: "Adds a degree of protection against minor knocks and surface impacts." },
      { title: "Daily Protection", detail: "Designed to withstand repeated cleaning, handling, and storage without surface degradation." },
      { title: "Optical Integrity", detail: "Coating is optically neutral — no impact on visual clarity, colour, or prescription accuracy." }
    ]
  },

  "uv-protection": {
    name: "UV Protection",
    headline: "100% UV block. Total ocular defence.",
    description: "UV protection lenses incorporate built-in or coated barriers that block 100% of UVA and UVB ultraviolet radiation from passing through to the eye, safeguarding long-term ocular health.",
    what_it_is: "A UV-blocking property either built into the lens material itself (as an additive) or applied as a coating. Absorbs or reflects ultraviolet radiation in the UVA (315–400nm) and UVB (280–315nm) wavelength range before it reaches the eye.",
    use_cases: [
      "Outdoor daily wear in sunny conditions",
      "Sports and beach activities",
      "High-altitude environments with stronger UV exposure",
      "Driving (UVA passes through standard car glass)",
      "Recommended for all prescription lenses as a baseline"
    ],
    ideal_for: [
      "Everyone — eye care professionals recommend UV400 protection in all lenses",
      "Outdoor workers and athletes",
      "People in high-UV regions or who spend extended time outdoors",
      "Patients at higher risk of cataracts or macular degeneration",
      "Children, whose crystalline lenses are more UV-transparent than adults"
    ],
    features: [
      "Full UVA & UVB Block (UV400)",
      "Colour-Neutral Optics",
      "Ocular Health Preservation",
      "High-Energy Light Filter"
    ],
    feature_details: [
      { title: "UV400 Block", detail: "Blocks 100% of ultraviolet radiation up to 400nm — full UVA and UVB spectrum." },
      { title: "Colour Neutral", detail: "UV protection does not alter the colour of what you see — optics remain perfectly neutral." },
      { title: "Long-Term Health", detail: "Reduces cumulative UV exposure linked to cataracts, pterygium, and macular degeneration." },
      { title: "HEV Filter", detail: "Also attenuates some high-energy visible light for additional eye comfort." }
    ]
  },

  "water-repellent": {
    name: "Water Repellent",
    headline: "Stays clean. Stays clear.",
    description: "Water-repellent coating is a nanoscale hydrophobic treatment that causes water, oil, fingerprints, and dust to bead up and slide off the lens surface instead of spreading across it.",
    what_it_is: "A fluorinated polymer or silicone-based nanoscale coating applied as the outermost layer on a lens. It dramatically lowers surface energy, causing liquids to form tight beads and roll away rather than wetting the surface.",
    use_cases: [
      "Outdoor use in rain, mist, or humid conditions",
      "Active sports where sweat contacts the lens surface",
      "Everyday reduction of smudging from fingerprints and skin oils",
      "Environments with dust or fine particle exposure",
      "Food or lab environments where splashes are common"
    ],
    ideal_for: [
      "Cyclists, runners, and outdoor athletes",
      "Anyone in wet or tropical climates",
      "People who clean their glasses frequently due to oily skin",
      "Travellers exposed to varying weather conditions",
      "Those who want lenses that stay cleaner for longer"
    ],
    features: [
      "Nanoscale Hydrophobic Layer",
      "Easy-Clean Technology",
      "Smudge and Oil Resistance",
      "Dust Repellent Surface"
    ],
    feature_details: [
      { title: "Hydrophobic Nano-Coat", detail: "Fluorinated molecules create an ultra-low surface energy that repels water on contact." },
      { title: "Easy Clean", detail: "Water, oils, and fingerprints wipe off in one pass with less effort." },
      { title: "Oil Resistance", detail: "Skin oils and cosmetics are repelled, significantly reducing smudging frequency." },
      { title: "Dust Repellent", detail: "Anti-static properties reduce dust attraction so lenses stay cleaner between cleans." }
    ]
  }
};
