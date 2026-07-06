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
