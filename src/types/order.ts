export type OrderStatus = 'received' | 'paid' | 'preparing' | 'sent';

export interface Order {
    id: string;
    customer_email: string;
    customer_name: string;
    customer_phone?: string;
    customer_address?: string;
    notes?: string;
    payment_method?: string;
    total: number;
    status: OrderStatus;
    created_at: string;
    updated_at: string;
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    product_name: string;
    quantity: number;
    price: number;
}

export interface OrderWithItems extends Order {
    items: OrderItem[];
}
