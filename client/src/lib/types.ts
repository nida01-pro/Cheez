import { Product, Category, Order } from "@shared/schema";

export interface CartItem {
  id: number;
  quantity: number;
  product: Product;
}

export interface DeliveryInfo {
  name: string;
  phone: string;
  address: string;
  instructions?: string;
}

export interface AuthUser {
  id: number;
  username: string;
  isAdmin: boolean;
}

export type OrderStatus = "pending" | "packing" | "out_for_delivery" | "delivered" | "cancelled";

export type PaymentMethod = "cash_on_delivery" | "jazzcash" | "easypaisa";

export interface OrderWithItems extends Order {
  items: {
    product: Product;
    quantity: number;
    subtotal: number;
  }[];
  total: number;
}
