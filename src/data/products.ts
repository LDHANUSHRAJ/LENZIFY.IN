export interface Product {
    id: string;
    name: string;
    brand: string;
    price: number;
    originalPrice?: number;
    category: "spectacles" | "lenses" | "contact-lenses";
    image: string;
    description: string;
    rating: number;
    reviews: number;
    colors?: string[];
    features?: string[];
}

export const products: Product[] = [
    {
        id: "spec-01",
        name: "Aero Stealth Blue",
        brand: "Lenzify Elite",
        price: 4999,
        originalPrice: 6999,
        category: "spectacles",
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800",
        description: "Ultra-lightweight aerospace-grade titanium frames with anti-reflective blue-cut lenses.",
        rating: 4.8,
        reviews: 124,
        colors: ["#0B1C2D", "#123A63", "#C9D6E8"],
        features: ["Titanium Body", "Blue-Cut Lenses", "Scratch Resistant"]
    },
    {
        id: "spec-02",
        name: "Carbon Onyx",
        brand: "Lenzify Pro",
        price: 3500,
        category: "spectacles",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800",
        description: "Matte finish carbon fiber frames designed for durability and high-performance style.",
        rating: 4.7,
        reviews: 89,
        colors: ["#000000", "#1F5A99"],
        features: ["Carbon Fiber", "Flexible Hinges", "HD Vision"]
    },
    {
        id: "lens-01",
        name: "Neural Clarity HD",
        brand: "AcuView",
        price: 1200,
        category: "lenses",
        image: "https://images.unsplash.com/photo-1582142823910-bc8990666d6c?auto=format&fit=crop&q=80&w=800",
        description: "Next-generation multifocal lenses with adaptive focus technology for all-day comfort.",
        rating: 4.9,
        reviews: 210,
        features: ["Adaptive Focus", "UV Protection", "Anti-Smudge"]
    },
    {
        id: "cl-01",
        name: "AquaGlow Daily",
        brand: "HydroSoft",
        price: 2400,
        category: "contact-lenses",
        image: "https://images.unsplash.com/photo-1563991655280-cb95c90ca2fb?auto=format&fit=crop&q=80&w=800",
        description: "Oxygen-rich daily disposable contact lenses with moisture-lock technology for sensitive eyes.",
        rating: 4.6,
        reviews: 156,
        features: ["98% Oxygen Transmissibility", "12-hour Hydration", "Soft Edge Design"]
    }
];
