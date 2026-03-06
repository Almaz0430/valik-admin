import type { Order } from '../../../types/order';
import { api } from '../../../utils/axiosConfig';

class OrderService {
  async getOrders(): Promise<Order[]> {
    const vendorId = localStorage.getItem('vendorId');
    if (!vendorId) {
      console.warn('Vendor ID not found for orders fetching');
      return [];
    }
    const response = await api.get<Order[]>(`/sell/orders/vendor/${vendorId}/`);
    return response.data;
  }
}

const orderService = new OrderService();

export default orderService;
