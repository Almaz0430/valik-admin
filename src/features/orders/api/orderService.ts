import type { Order } from '../../../types/order';
import { api } from '../../../utils/axiosConfig';

class OrderService {
  async getOrders(): Promise<Order[]> {
    // Используем поставщицкий префикс, как и для товаров (`/suppliers/products`)
    const response = await api.get<Order[]>('/suppliers/orders');
    return response.data;
  }
}

const orderService = new OrderService();

export default orderService;
