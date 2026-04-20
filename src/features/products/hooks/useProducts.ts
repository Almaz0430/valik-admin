import { useState, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Product, ProductQueryParams } from '../../../types/product';
import productService from '../api/productService';
import { AuthContext } from '../../../contexts/AuthContextBase';

interface UseProductsOptions {
  initialParams?: ProductQueryParams;
}

export const useProducts = ({ initialParams }: UseProductsOptions = {}) => {
  const auth = useContext(AuthContext);
  const [queryParams, setQueryParams] = useState<ProductQueryParams>(
    initialParams || { page: 1, limit: 10 }
  );
  const [searchTerm, setSearchTerm] = useState<string>('');

  const vendorId = auth?.supplier?.id ? Number(auth.supplier.id) : null;

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['products', vendorId, searchTerm],
    queryFn: async () => {
      if (!vendorId) throw new Error('Не авторизован');
      const products = await productService.getVendorProducts(vendorId);
      // Фильтрация по поисковому запросу на клиенте
      const filtered = searchTerm
        ? products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
        : products;
      return { products: filtered, total: filtered.length };
    },
    enabled: !!vendorId,
  });

  const allProducts: Product[] = data?.products ?? [];
  const total: number = data?.total ?? 0;
  const errorMessage: string | null = error ? (error as Error).message : null;

  const handlePageChange = (page: number) => {
    setQueryParams(prev => ({
      ...prev,
      page,
    }));
  };

  const resetToFirstPage = () => {
    setQueryParams(prev => ({
      ...prev,
      page: 1,
    }));
  };

  const page = queryParams.page ?? 1;
  const limit = queryParams.limit ?? 10;
  const startIndex = (page - 1) * limit;
  const products = allProducts.slice(startIndex, startIndex + limit);

  return {
    products,
    total,
    isLoading,
    error: errorMessage,
    queryParams,
    searchTerm,
    setSearchTerm,
    handlePageChange,
    resetToFirstPage,
    refetch,
  };
};
