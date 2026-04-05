import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/data/products';

interface WishlistStore {
    items: Product[];
    addItem: (product: Product) => void;
    removeItem: (productId: string) => void;
    isInWishlist: (productId: string) => boolean;
    clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (product) => set((state) => {
                const exists = state.items.some(item => item.id === product.id);
                if (exists) return state;
                return { items: [...state.items, product] };
            }),
            removeItem: (productId) => set((state) => ({
                items: state.items.filter(item => item.id !== productId)
            })),
            isInWishlist: (productId) => get().items.some(item => item.id === productId),
            clearWishlist: () => set({ items: [] }),
        }),
        { name: 'lenzify-wishlist' }
    )
);
