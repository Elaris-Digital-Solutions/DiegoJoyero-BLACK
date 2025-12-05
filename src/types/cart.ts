export interface CartItem {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    stock?: number;
    status?: string;
}

export interface CartState {
    items: CartItem[];
    isOpen: boolean;
}

export interface CartContextType extends CartState {
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    toggleCart: (isOpen?: boolean) => void;
    clearCart: () => void;
    cartCount: number;
    subtotal: number;
}
