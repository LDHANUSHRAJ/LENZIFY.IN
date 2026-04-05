export interface Product {
    id: string;
    name: string;
    brand: string;
    price: number;
    originalPrice?: number;
    category: "spectacles" | "sunglasses" | "lenses" | "contact-lenses" | "accessories";
    image: string;
    description: string;
    rating: number;
    reviews: number;
    colors?: string[];
    features?: string[];
    isNew?: boolean;
}

export const products: Product[] = [
    {
        id: "spec-01",
        name: "Aero Stealth Blue",
        brand: "Lenzify Elite",
        price: 4999,
        originalPrice: 6999,
        category: "spectacles",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCPJOFZOe3u0TQLIlFjJS59aDoiG9Z_j1KG7zZWvtJ6SRbyGHrdgaZtXs_ipzi61i8zoEczz4l3tDilIC557iERv3uoWcbBIrWoiUZtHTM4I4wAWU_2EF6luh1xx82lWeis7MDW-nkmQ2rUHRWfKoyQdSPym8MTXVhobxt-VWYBjEKQmMFS5Rjm9S8BwEfX17u15c43k4-YGqjFn1btVVNwwoH1XShyPqQLelcmQ0RGk_WRHpVRICKumJNkMrReUJDf3unNmIwaOL8",
        description: "Precision-engineered aerospace-grade titanium frames featuring advanced anti-reflective blue-cut optics.",
        rating: 4.8,
        reviews: 124,
        colors: ["#0B1C2D", "#123A63", "#C9D6E8"],
        features: ["Titanium Body", "Blue-Cut Lenses", "Scratch Resistant"],
        isNew: true
    },
    {
        id: "spec-02",
        name: "Carbon Onyx",
        brand: "Lenzify Pro",
        price: 3500,
        category: "spectacles",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA57Msf_SWudMTbYaZWXNU35tFeZ_lMgK9uV7VOHhQqopfRwq0jgqisoZd4HgJssWmDqcMpVFrp-xqxfVupJP6OEmInkUC5IlYFY62wX373LQc7wNewDbTLMLBXLFvDrjXfaiFg_yur3r1vFrntUmTIW8Ern8sRNQG_HxnW2JfDCF78SRPFMzZQDnXa2y_EHAjlKwg5qHqyzuNwLnIFS3GyiUQHhxDOylzJXdLV6k3UWwicPGt-mE0J4IJ2DtEL6C2gaso650MqUyY",
        description: "Matte-finish aerospace carbon fiber frames, hand-engineered for extreme durability and ultra-minimalist style.",
        rating: 4.7,
        reviews: 89,
        colors: ["#000000", "#1F5A99"],
        features: ["Carbon Fiber", "Flexible Hinges", "HD Vision"]
    },
    {
        id: "sun-01",
        name: "Noir Aviator X",
        brand: "Lenzify Luxe",
        price: 7500,
        originalPrice: 9999,
        category: "sunglasses",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCh1Hk7QSY1WnDJ1zc1ZTo2ex_AxvD0Aa3SX6lKiO1MzqDAa2MLLaRoW1PikSfQV9pW-QAU8HO-sCJ1s2goKmSlfB0_fiJ3ifvUbMKRN22TRTgTr7ueAS6Xz8OYEYHhgd2V8ozY2bEn52Bh1tvdwae1S9ShFhJN7lXpppCIlV50aiNSJYRjsnwjqhO3QKx1iLj4RB_5vxbFRU4p4D9SV-Ds3nAChxq-k_wucxgzacGTYwndeB1idue7BHcgbvP5y67CH_iVMX0iC84",
        description: "Polarized midnight black aviators featuring hand-polished gold accents and maximum-spectrum UV protection.",
        rating: 4.9,
        reviews: 245,
        features: ["Polarized Lenses", "UV400 Protection", "Gold Plated Details"]
    },
    {
        id: "sun-02",
        name: "Prism Flare",
        brand: "Lenzify Sport",
        price: 5200,
        category: "sunglasses",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuApQwkt-_DK_EaIU-yQv-pbgpHLltlKQpkfyvkwwZyWMaKwNSCRZfjASuO0pH7XC7-kDIsjx6fEEEnCN4xjihYhc1p5H6aW0c_LMTFEXHQdMFg3pLMTh7ixA9QgQEpb5SqEnti_sLrf2ZsiFojH3R2ueuL403sWmoYNdmoOE382ekENSuDifWNqDfZ9iLAHSOyB73-smYkv1tLFXbkU33FZiLWmsyNd6k0j3P_jA9CYI6rk_b3GCAs9KHhO1Hh-LBH0IG82v_GylhY",
        description: "Wraparound sports sunglasses with high-contrast amber lenses for peak visual performance.",
        rating: 4.6,
        reviews: 67,
        features: ["Hydrophobic Coating", "Impact Resistant", "Non-slip Pads"]
    },
    {
        id: "lens-01",
        name: "Neural Clarity HD",
        brand: "AcuView",
        price: 1200,
        category: "lenses",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD47CclQ5KjyqEzUHC5xbDMqWc3vQ7wFScfHNyazUJazIXMt-4tFZWcf6GsLBdKAEa32aP7PycoAfGICWk576Vo426J3mO8KTqiEzdWwMnLIeZoJf_VG65t2JPYfxghtS22Xf2ONrIdF7FoUkv0gMVdfG1NURSsrdbGzUKXOmpybzLDxXwg2ZBqIGyuJ6o_ThLzt4KuwqmwXeZtllr0As-TvcmmL6RH6tafhHfz2v0Ia213SG-xNBYHBTPwtSxL8j7LpOGofNTJQMM",
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
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBPfiZ7Fa-dRXkhRrkOnrPABL-vOvUxT4j09uA4dDObbjCHoSZO5rzKiOJZhHvZ-NBiBYfLrMmRdzIaXjTxrTtnXQEMdxIpsaOWdLEIzabJbkhXFx4VfyOElz8-pK7AruLrVMOo7zw4seLIzRjWeD-mlp8PLQbkIWSiTrPwEcxjgOU4BWbr-m9yESFySl3sxgBeZ1jWjC1iWHsKkkzX4gnuzATtbxCdKxwQuKSpL0V_B4MzWANdMmrO_Y4lmK6MeRVsUB2B0gza804",
        description: "Oxygen-rich daily disposable contact lenses with moisture-lock technology for sensitive eyes.",
        rating: 4.6,
        reviews: 156,
        features: ["98% Oxygen Transmissibility", "12-hour Hydration", "Soft Edge Design"]
    },
    {
        id: "acc-01",
        name: "Lenzify Titan Case",
        brand: "Lenzify",
        price: 1500,
        category: "accessories",
        image: "/luxury_eyewear_case_editorial_1775378570621.png",
        description: "Hard-shell editorial protective case with hand-stitched leather texture and premium micro-fiber lining.",
        rating: 4.8,
        reviews: 45,
        features: ["Impact Resistance", "Waterproof", "Lightweight"]
    }
];
