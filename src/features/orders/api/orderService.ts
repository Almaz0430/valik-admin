import { OrderStatus } from '../../../types/order';
import type { Order, VendorOrderApi, VendorOrdersResponse, VendorOrderUpdatePayload } from '../../../types/order';
import { api } from '../../../utils/axiosConfig';

const mapOrderStatus = (status: number): OrderStatus => {
  switch (status) {
    case 1:
      return OrderStatus.NEW;
    case 2:
      return OrderStatus.ACCEPTED;
    case 3:
      return OrderStatus.READY_TO_SHIP;
    case 4:
      return OrderStatus.IN_DELIVERY;
    case 5:
      return OrderStatus.DELIVERED;
    case 6:
      return OrderStatus.COMPLETED;
    case 7:
      return OrderStatus.CANCELLED;
    case 8:
      return OrderStatus.RETURN;
    default:
      return OrderStatus.NEW;
  }
};

const mapVendorOrder = (order: VendorOrderApi): Order => {
  const products = order.sell_product ?? [];

  return {
    id: order.id,
    number: String(order.id),
    customer: order.buyer_name,
    phone: order.buyer_phone,
    date: order.created_at,
    status: mapOrderStatus(order.order_status),
    paymentType: order.payment_type,
    paymentStatus: order.payment_status,
    orderStatus: order.order_status,
    statusLabel: order.order_status_display,
    paymentTypeLabel: order.payment_type_display,
    paymentStatusLabel: order.payment_status_display,
    vendorName: order.vendor?.name,
    address: order.address,
    total: Number(order.total_amount),
    shopTotal: Number(order.total_amount_shop),
    commissionTotal: Number(order.total_amount_commission),
    discountPercent: order.discount_percent,
    productsCount: products.length,
    products,
    deliveryDate: order.delevery_date,
    deliveryStatusLabel: order.delivery?.status_display,
    expeditorName: order.delivery?.expeditor_name,
    expeditorPhone: order.delivery?.expeditor_phone,
    finalDeliveryPrice: order.delivery?.final_price,
    additionalInfo: order.additional_info,
  };
};

class OrderService {
  async getOrders(): Promise<Order[]> {
    const vendorId = localStorage.getItem('vendorId');
    if (!vendorId) {
      console.warn('Vendor ID not found for orders fetching');
      return [];
    }
    const response = await api.get<VendorOrdersResponse>(`/sell/orders/vendor/${vendorId}/`);
    return response.data.results.map(mapVendorOrder);
  }

  async getOrder(id: number): Promise<Order> {
    const response = await api.get<VendorOrderApi>(`/sell/orders/${id}/`);
    return mapVendorOrder(response.data);
  }

  async updateOrder(id: number, data: VendorOrderUpdatePayload): Promise<Order> {
    await api.put<VendorOrderApi>(`/sell/order/update/${id}/`, data);
    return this.getOrder(id);
  }
}

const orderService = new OrderService();

export default orderService;
