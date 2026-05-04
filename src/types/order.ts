/**
 * Типы для заказов
 */

export enum OrderStatus {
  NEW = 'new',
  ACCEPTED = 'accepted',
  READY_TO_SHIP = 'ready_to_ship',
  IN_DELIVERY = 'in_delivery',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RETURN = 'return',
}

export interface Order {
  id: number;
  number: string;
  customer: string;
  phone?: string | null;
  date: string;
  status: OrderStatus;
  paymentType: number;
  paymentStatus: number;
  orderStatus: number;
  statusLabel: string;
  paymentTypeLabel: string;
  paymentStatusLabel: string;
  vendorName?: string | null;
  address?: string | null;
  total: number;
  shopTotal: number;
  commissionTotal: number;
  discountPercent?: string | null;
  productsCount: number;
  products: VendorOrderProductApi[];
  deliveryDate?: string | null;
  deliveryStatusLabel?: string | null;
  expeditorName?: string | null;
  expeditorPhone?: string | null;
  finalDeliveryPrice?: string | null;
  additionalInfo?: string | null;
}

export interface VendorOrderProductApi {
  id: number;
  product_id: number;
  product_name: string;
  product_article: string | null;
  product_image: string | null;
  vendor_name: string;
  quantity: number;
  return_quantity: number;
  sell_quantity: number;
  price: string;
  purchase_amount_price: string;
  return_amount_price: string;
  sell_amount_price: string;
  is_manual_gift: boolean;
}

export interface VendorOrderApi {
  id: number;
  buyer_id: number;
  buyer_name: string;
  buyer_phone: string | null;
  vendor: {
    id: number;
    name: string;
    minimum_order_amount: string;
  };
  sell_product?: VendorOrderProductApi[];
  payment_type: number;
  payment_type_display: string;
  payment_status: number;
  payment_status_display: string;
  order_status: number;
  order_status_display: string;
  delevery_date: string | null;
  address: string | null;
  additional_info: string | null;
  total_amount: string;
  total_amount_shop: string;
  total_amount_commission: string;
  discount_percent: string | null;
  created_at: string;
  delivery: {
    status_display: string;
    expeditor_name: string | null;
    expeditor_phone: string | null;
    sender_price: string | null;
    expeditor_price: string | null;
    final_price: string | null;
    sender_comment: string | null;
    expeditor_comment: string | null;
  } | null;
}

export interface VendorOrdersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: VendorOrderApi[];
}

export interface VendorOrderProductUpdate {
  id?: number;
  product_id: number;
  quantity: number;
  price?: string;
}

export interface VendorOrderUpdatePayload {
  sell_product: VendorOrderProductUpdate[];
  payment_type: number;
  payment_status: number;
  order_status: number;
  delevery_date: string | null;
  address: string;
  additional_info: string | null;
  discount_percent: number | null;
}
