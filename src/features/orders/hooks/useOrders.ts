import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Order } from '../../../types/order';
import orderService from '../api/orderService';

export const useOrders = () => {
  const [isFilterExpanded, setIsFilterExpanded] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { data, isLoading, error, refetch } = useQuery<Order[], Error>({
    queryKey: ['orders'],
    queryFn: () => orderService.getOrders(),
  });
  const orders = useMemo(() => data ?? [], [data]);

  const filteredOrders = useMemo(() => {
    if (!searchTerm.trim()) return orders;

    const term = searchTerm.toLowerCase();

    return orders.filter((order) => {
      const values = [
        order.number,
        order.customer,
        order.phone,
        order.address,
        order.statusLabel,
        order.paymentStatusLabel,
      ];

      return values.some((value) => value?.toLowerCase().includes(term));
    });
  }, [orders, searchTerm]);

  const total = orders.length;
  const errorMessage: string | null = error ? error.message : null;

  return {
    orders: filteredOrders,
    total,
    isLoading,
    error: errorMessage,
    isFilterExpanded,
    setIsFilterExpanded,
    searchTerm,
    setSearchTerm,
    refetch,
  };
};
