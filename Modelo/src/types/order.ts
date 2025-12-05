import type { CartItem } from '../contexts/CartContext';

export interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  reference?: string;
}

export type PaymentMethod = 'transfer' | 'yape';

export interface OrderSummary {
  id: string;
  createdAt: string;
  customer: CustomerDetails;
  paymentMethod: PaymentMethod;
  items: CartItem[];
  subtotal: number;
  total: number;
}
