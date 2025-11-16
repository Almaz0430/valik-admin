import type { Order } from '../../../types/order';
import { api } from '../../../utils/axiosConfig';

class OrderService {
  async getOrders(): Promise<Order[]> {
    const response = await api.get<Order[]>('/orders');
    return response.data;
  }
}

const orderService = new OrderService();

export default orderService;

