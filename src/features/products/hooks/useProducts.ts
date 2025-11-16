import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Product, ProductQueryParams } from '../../../types/product';
import productService from '../api/productService';

interface UseProductsOptions {
  initialParams?: ProductQueryParams;
}

export const useProducts = ({ initialParams }: UseProductsOptions = {}) => {
  const [queryParams, setQueryParams] = useState<ProductQueryParams>(
    initialParams || { page: 1, limit: 10 }
  );
  const [searchTerm, setSearchTerm] = useState<string>('');

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['products', queryParams, searchTerm],
    queryFn: async () =>
      productService.getProducts({
        ...queryParams,
        search: searchTerm || undefined,
      }),
  });

  const products: Product[] = data?.products ?? [];
  const total: number = data?.total ?? 0;
  const errorMessage: string | null = error ? error.message : null;

  const handlePageChange = (page: number) => {
    setQueryParams((prev) => ({ ...prev, page }));
  };

  const resetToFirstPage = () => {
    setQueryParams((prev) => ({ ...prev, page: 1 }));
  };

  return {
    products,
    total,
    isLoading,
    error: errorMessage,
    queryParams,
    searchTerm,
    setSearchTerm,
    setQueryParams,
    handlePageChange,
    resetToFirstPage,
    refetch,
  };
};
