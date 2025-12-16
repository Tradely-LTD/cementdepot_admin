import { ORDER_STATUS } from '@/utils/constants';

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  buyer?: {
    id: string;
    fullName: string;
    email: string;
  };
  depot?: {
    id: string;
    name: string;
  };
  deliveryType: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product?: {
    id: string;
    name: string;
    brand?: {
      name: string;
    };
  };
}

export interface OrderStats {
  total: number;
  pending: number;
  payment_pending?: number;
  payment_confirmed?: number;
  confirmed: number;
  assigned?: number;
  ready_for_dispatch?: number;
  dispatched?: number;
  out_for_delivery?: number;
  delivered: number;
  collected?: number;
  cancelled: number;
  failed?: number;
  processing?: number; // Legacy status
  in_transit?: number; // Legacy status
  totalRevenue: number;
  byStatus?: Array<{
    status: string;
    count: number;
  }>;
  byDeliveryType?: Array<{
    deliveryType: string;
    count: number;
  }>;
}
