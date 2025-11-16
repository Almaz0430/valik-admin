/**
 * Типы для заказов
 */

export enum OrderStatus {
  NEW = 'new',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
}

export interface Order {
  id: number;
  number: string;
  customer: string;
  date: string;
  status: OrderStatus;
  total: number;
}

