import { GroceryItem } from './grocery-item.model';

export interface Order {
  id: number;
  orderNumber: string;
  orderDate: string;
  estimatedDelivery: string;
  totalAmount: number;
  status: OrderStatus;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  customerEmail?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  shippingMethod?: string;
  shippingFee?: number;
  orderItems: OrderItem[];
}

export interface OrderItem {
  id: number;
  groceryItem: GroceryItem;
  quantity: number;
  price: number;
  totalPrice: number;
}

export enum OrderStatus {
  PLACED = 'PLACED',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface CustomerDetails {
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  customerEmail?: string;
  paymentMethod?: string;
  shippingMethod?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  savePaymentInfo?: boolean;
}
