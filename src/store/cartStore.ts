import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/data/products';

interface CartItem extends Product {
    quantity: number;
}

interface CartStore {
    items: CartItem[];
    addItem: (product: Product) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, delta: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (product) => set((state) => {
                const existingItem = state.items.find(item => item.id === product.id);
                if (existingItem) {
                    return {
                        items: state.items.map(item =>
                            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                        )
                    };
                }
                return { items: [...state.items, { ...product, quantity: 1 }] };
            }),
            removeItem: (productId) => set((state) => ({
                items: state.items.filter(item => item.id !== productId)
            })),
            updateQuantity: (productId, delta) => set((state) => ({
                items: state.items.map(item =>
                    item.id === productId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
                )
            })),
            clearCart: () => set({ items: [] }),
            getTotalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
            getTotalPrice: () => get().items.reduce((acc, item) => acc + (item.price * item.quantity), 0),
        }),
        { name: 'lenzify-cart' }
    )
);
