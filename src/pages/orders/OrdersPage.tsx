/**
 * Страница управления заказами
 */
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { orderService, useOrders } from '../../features/orders';
import productService from '../../features/products/api/productService';
import {
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  FunnelIcon,
  CalendarDaysIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import type { Order } from '../../types/order';
import type { Product } from '../../types/product';

interface OrderEditItem {
  id?: number;
  productId: number;
  quantity: number;
  price: string;
}

interface OrderEditForm {
  paymentType: number;
  paymentStatus: number;
  orderStatus: number;
  deliveryDate: string;
  address: string;
  additionalInfo: string;
  discountPercent: string;
  items: OrderEditItem[];
}

const paymentTypeOptions = [
  { value: 1, label: 'При получении' },
  { value: 2, label: 'Банковский перевод' },
  { value: 3, label: 'Консигнация' },
];
const paymentStatusOptions = [
  { value: 1, label: 'Ожидает оплату' },
  { value: 2, label: 'Оплачено' },
];
const orderStatusOptions = [
  { value: 1, label: 'Создан' },
  { value: 2, label: 'Заказ принят' },
  { value: 3, label: 'Готов к отправке' },
  { value: 4, label: 'В доставке' },
  { value: 5, label: 'Доставлен' },
  { value: 6, label: 'Завершен' },
  { value: 7, label: 'Отменен' },
  { value: 8, label: 'Возврат' },
];

const toDateInputValue = (value?: string | null) => value?.slice(0, 10) ?? '';
const formatMoney = (value: number | string) => Number(value).toLocaleString('ru-RU');

const createEditForm = (order: Order): OrderEditForm => ({
  paymentType: order.paymentType,
  paymentStatus: order.paymentStatus,
  orderStatus: order.orderStatus,
  deliveryDate: toDateInputValue(order.deliveryDate),
  address: order.address ?? '',
  additionalInfo: order.additionalInfo ?? '',
  discountPercent: order.discountPercent ?? '',
  items: order.products.map((product) => ({
    id: product.id,
    productId: product.product_id,
    quantity: product.quantity,
    price: product.price,
  })),
});

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFilter = searchParams.get('status');
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [isDetailsLoading, setIsDetailsLoading] = React.useState(false);
  const [detailsError, setDetailsError] = React.useState<string | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editForm, setEditForm] = React.useState<OrderEditForm | null>(null);
  const [vendorProducts, setVendorProducts] = React.useState<Product[]>([]);
  const [isProductsLoading, setIsProductsLoading] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const {
    orders,
    total,
    isFilterExpanded,
    setIsFilterExpanded,
    searchTerm,
    setSearchTerm,
  } = useOrders();

  const filteredOrdersByStatus = React.useMemo(() => {
    switch (statusFilter) {
      case 'new':
        return orders.filter((order) => order.orderStatus === 1);
      case 'processing':
        return orders.filter((order) => [2, 3, 4].includes(order.orderStatus));
      case 'completed':
        return orders.filter((order) => [5, 6].includes(order.orderStatus));
      default:
        return orders;
    }
  }, [orders, statusFilter]);

  const statusFilterLabel = React.useMemo(() => {
    switch (statusFilter) {
      case 'new':
        return 'Новые заказы';
      case 'processing':
        return 'В обработке';
      case 'completed':
        return 'Завершенные';
      default:
        return null;
    }
  }, [statusFilter]);

  // Функция для отображения статуса заказа
  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-yellow-100 text-yellow-800';
      case 'ready_to_ship':
        return 'bg-purple-100 text-purple-800';
      case 'in_delivery':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'return':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleOpenOrderDetails = async (order: Order) => {
    navigate(`/dashboard/orders/${order.id}`);
    return;

    setSelectedOrder(order);
    setEditForm(createEditForm(order));
    setIsEditing(false);
    setDetailsError(null);
    setIsDetailsLoading(true);

    try {
      const orderDetails = await orderService.getOrder(order.id);
      setSelectedOrder(orderDetails);
      setEditForm(createEditForm(orderDetails));
    } catch (error) {
      console.error('Ошибка при загрузке деталей заказа:', error);
      setDetailsError('Не удалось загрузить детали заказа. Показаны данные из списка.');
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const handleCloseOrderDetails = () => {
    setSelectedOrder(null);
    setEditForm(null);
    setIsEditing(false);
    setDetailsError(null);
  };

  const loadVendorProducts = async () => {
    if (vendorProducts.length > 0 || isProductsLoading) return;

    const vendorId = Number(localStorage.getItem('vendorId'));
    if (!vendorId) {
      setDetailsError('Не найден ID поставщика для загрузки товаров.');
      return;
    }

    setIsProductsLoading(true);
    try {
      const products = await productService.getVendorProducts(vendorId);
      setVendorProducts(products);
    } catch (error) {
      console.error('Ошибка при загрузке товаров поставщика:', error);
      setDetailsError('Не удалось загрузить товары поставщика.');
    } finally {
      setIsProductsLoading(false);
    }
  };

  const handleStartEditing = async () => {
    if (selectedOrder) {
      setEditForm(createEditForm(selectedOrder));
    }
    setIsEditing(true);
    await loadVendorProducts();
  };

  const updateEditItem = (index: number, patch: Partial<OrderEditItem>) => {
    setEditForm((current) => {
      if (!current) return current;

      const items = current.items.map((item, itemIndex) => {
        if (itemIndex !== index) return item;
        const nextItem = { ...item, ...patch };
        if (patch.productId !== undefined) {
          const product = vendorProducts.find((candidate) => candidate.id === patch.productId);
          if (product) {
            nextItem.price = String(product.price);
          }
        }
        return nextItem;
      });

      return { ...current, items };
    });
  };

  const addEditItem = () => {
    const firstProduct = vendorProducts[0];
    setEditForm((current) => {
      if (!current) return current;
      return {
        ...current,
        items: [
          ...current.items,
          {
            productId: firstProduct?.id ?? 0,
            quantity: 1,
            price: String(firstProduct?.price ?? '0'),
          },
        ],
      };
    });
  };

  const removeEditItem = (index: number) => {
    setEditForm((current) => {
      if (!current) return current;
      return {
        ...current,
        items: current.items.filter((_, itemIndex) => itemIndex !== index),
      };
    });
  };

  const handleSaveOrder = async () => {
    if (!selectedOrder || !editForm) return;

    const validItems = editForm.items.filter((item) => item.productId && item.quantity > 0);
    if (validItems.length === 0) {
      setDetailsError('Добавьте хотя бы один товар в заказ.');
      return;
    }

    setIsSaving(true);
    setDetailsError(null);

    try {
      const updatedOrder = await orderService.updateOrder(selectedOrder.id, {
        sell_product: validItems.map((item) => ({
          id: item.id,
          product_id: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        payment_type: editForm.paymentType,
        payment_status: editForm.paymentStatus,
        order_status: editForm.orderStatus,
        delevery_date: editForm.deliveryDate || null,
        address: editForm.address,
        additional_info: editForm.additionalInfo || null,
        discount_percent: editForm.discountPercent ? Number(editForm.discountPercent) : null,
      });

      setSelectedOrder(updatedOrder);
      setEditForm(createEditForm(updatedOrder));
      setIsEditing(false);
    } catch (error) {
      console.error('Ошибка при сохранении заказа:', error);
      setDetailsError(error instanceof Error ? error.message : 'Не удалось сохранить заказ.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6 pb-16 lg:pb-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Управление заказами</h1>
            <p className="mt-2 text-sm text-slate-500 font-medium">Всего заказов: {total}</p>
          </div>
        </div>

        {statusFilterLabel && (
          <div className="flex flex-col gap-3 rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-orange-800">
              Фильтр: {statusFilterLabel} · найдено {filteredOrdersByStatus.length}
            </p>
            <button
              type="button"
              onClick={() => setSearchParams({})}
              className="text-left text-sm font-semibold text-orange-700 hover:text-orange-900"
            >
              Показать все
            </button>
          </div>
        )}

        {/* Фильтры заказов - новый дизайн */}
        <div className="mb-6 space-y-4">
          {/* Основная строка поиска */}
          <div className="flex flex-col md:flex-row gap-3">
            <form onSubmit={(e) => e.preventDefault()} className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Поиск по номеру заказа или клиенту..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 pr-4 py-3 bg-white border-slate-200 shadow-sm rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all hover:border-slate-300"
              />
              <button type="button" className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 hover:text-orange-500 transition-colors pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </button>
            </form>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                className={`flex items-center justify-center gap-2 px-5 py-3 bg-white border-slate-200 shadow-sm rounded-xl transition-all hover:border-slate-300 font-medium whitespace-nowrap ${isFilterExpanded
                  ? 'text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500'
                  : 'text-slate-700'
                  }`}
              >
                <AdjustmentsHorizontalIcon className="h-5 w-5" />
                <span>Фильтры</span>
                <ChevronDownIcon className={`h-4 w-4 transition-transform ${isFilterExpanded ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Расширенные фильтры */}
          {isFilterExpanded && (
            <div className="p-5 bg-white shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] ring-1 ring-slate-200/50 rounded-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Статус заказа</label>
                  <div className="flex flex-wrap gap-2">
                    <button className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-sm font-semibold hover:bg-blue-200 transition-colors">
                      Новый
                    </button>
                    <button className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors px-4">
                      В обработке
                    </button>
                    <button className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors px-4">
                      Отправлен
                    </button>
                    <button className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors px-4">
                      Доставлен
                    </button>
                    <button className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors px-4">
                      Завершен
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Период</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CalendarDaysIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    <select className="block w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all appearance-none text-slate-700 font-medium">
                      <option value="all">Все время</option>
                      <option value="today">Сегодня</option>
                      <option value="yesterday">Вчера</option>
                      <option value="week">За неделю</option>
                      <option value="month">За месяц</option>
                      <option value="quarter">За квартал</option>
                      <option value="year">За год</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <ChevronDownIcon className="h-5 w-5 text-slate-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Сумма заказа</label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        placeholder="От"
                        className="block w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-700"
                      />
                    </div>
                    <span className="text-slate-400 font-medium">—</span>
                    <div className="relative flex-1">
                      <input
                        type="number"
                        placeholder="До"
                        className="block w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-700"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button className="text-slate-500 hover:text-slate-800 flex items-center gap-1.5 text-sm font-medium transition-colors">
                  <XMarkIcon className="h-4 w-4" />
                  Сбросить
                </button>
                <button
                  onClick={() => setIsFilterExpanded(false)}
                  className="bg-orange-600 text-white px-5 py-2.5 rounded-xl shadow-[0_2px_8px_-2px_rgba(249,115,22,0.4)] hover:bg-orange-700 transition-all flex items-center gap-2 text-sm font-medium active:scale-[0.98]"
                >
                  <FunnelIcon className="h-4 w-4" />
                  <span>Применить</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Таблица заказов */}
        <div className="mt-6">
          {filteredOrdersByStatus.length > 0 ? (
            <>
              <div className="space-y-3 md:hidden">
                {filteredOrdersByStatus.map((order) => {
                  const statusClasses = getStatusClasses(order.status);
                  return (
                    <article
                      key={order.id}
                      className="rounded-2xl bg-white p-4 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] ring-1 ring-slate-200/70"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-500">Заказ #{order.number}</p>
                          <h2 className="mt-1 truncate text-base font-bold text-slate-900">{order.customer}</h2>
                          {order.phone && <p className="mt-1 text-sm text-slate-500">{order.phone}</p>}
                        </div>
                        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses}`}>
                          {order.statusLabel}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-xl bg-slate-50 p-3">
                          <p className="text-xs font-medium text-slate-400">Дата</p>
                          <p className="mt-1 font-semibold text-slate-800">
                            {new Date(order.date).toLocaleDateString('ru-RU')}
                          </p>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-3">
                          <p className="text-xs font-medium text-slate-400">Оплата</p>
                          <p className="mt-1 font-semibold text-slate-800">{order.paymentStatusLabel}</p>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-3">
                          <p className="text-xs font-medium text-slate-400">Товары</p>
                          <p className="mt-1 font-semibold text-slate-800">{order.productsCount} поз.</p>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-3">
                          <p className="text-xs font-medium text-slate-400">Сумма</p>
                          <p className="mt-1 font-semibold text-slate-900">{order.total.toLocaleString()} ₸</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenOrderDetails(order)}
                        className="mt-4 w-full rounded-xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-700 active:scale-[0.98]"
                      >
                        Подробнее
                      </button>
                    </article>
                  );
                })}
              </div>

              <div className="hidden overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] ring-1 ring-slate-200/50 md:block">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      № заказа
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Клиент
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Дата
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Статус
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Сумма
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrdersByStatus.map((order) => {
                    const statusClasses = getStatusClasses(order.status);
                    return (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order.number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="font-medium text-gray-900">{order.customer}</div>
                          {order.phone && <div className="text-xs text-gray-500">{order.phone}</div>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.date).toLocaleDateString('ru-RU')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses}`}>
                            {order.statusLabel}
                          </span>
                          <div className="mt-1 text-xs text-gray-500">{order.paymentStatusLabel}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.total.toLocaleString()} ₸
                          <div className="text-xs text-gray-500">
                            {order.productsCount} поз.
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            type="button"
                            onClick={() => handleOpenOrderDetails(order)}
                            className="text-orange-600 hover:text-orange-900 mr-4"
                          >
                            Подробнее
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            Печать
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Пагинация */}
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-center justify-between">
                  <div className="text-sm text-gray-700 mb-4 sm:mb-0">
                    Показано <span className="font-medium">0-0</span> из <span className="font-medium">0</span> заказов
                  </div>
                  <div className="flex space-x-1">
                    <button disabled className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-400 bg-gray-100 cursor-not-allowed">
                      Назад
                    </button>
                    <button className="px-3 py-1 border border-orange-500 rounded-md text-sm font-medium text-white bg-orange-500 hover:bg-orange-600">
                      1
                    </button>
                    <button disabled className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-400 bg-gray-100 cursor-not-allowed">
                      Далее
                    </button>
                  </div>
                </div>
              </div>
              </div>
            </>
          ) : (
            <div className="py-20 px-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 text-orange-500 mb-6">
                <svg className="h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-xl text-gray-800 font-medium mb-2">Заказов пока нет</p>
              <p className="text-gray-500 text-base max-w-md mx-auto">Здесь будут отображаться заказы, когда они появятся в системе</p>
            </div>
          )}
        </div>

        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <button
              type="button"
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={handleCloseOrderDetails}
              aria-label="Закрыть детали заказа"
            />

            <div className="relative z-[110] flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] ring-1 ring-slate-200">
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
                <div>
                  <p className="text-sm font-medium text-slate-500">Заказ #{selectedOrder.number}</p>
                  <h2 className="mt-1 text-2xl font-bold text-slate-900">{selectedOrder.customer}</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {new Date(selectedOrder.date).toLocaleString('ru-RU')}
                  </p>
                  {isDetailsLoading && (
                    <p className="mt-2 text-sm font-medium text-orange-600">Загружаем детали заказа...</p>
                  )}
                  {detailsError && (
                    <p className="mt-2 text-sm font-medium text-red-600">{detailsError}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setEditForm(createEditForm(selectedOrder));
                        }}
                        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                        disabled={isSaving}
                      >
                        Отмена
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveOrder}
                        className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-700 disabled:opacity-60"
                        disabled={isSaving}
                      >
                        {isSaving ? 'Сохраняем...' : 'Сохранить'}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={handleStartEditing}
                      className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-700"
                      disabled={isDetailsLoading}
                    >
                      Изменить
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleCloseOrderDetails}
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Закрыть"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto px-6 py-5">
                {isEditing && editForm ? (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <label className="block">
                        <span className="text-sm font-medium text-slate-700">Тип оплаты</span>
                        <select
                          value={editForm.paymentType}
                          onChange={(event) => setEditForm({ ...editForm, paymentType: Number(event.target.value) })}
                          className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                        >
                          {paymentTypeOptions.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </label>

                      <label className="block">
                        <span className="text-sm font-medium text-slate-700">Статус оплаты</span>
                        <select
                          value={editForm.paymentStatus}
                          onChange={(event) => setEditForm({ ...editForm, paymentStatus: Number(event.target.value) })}
                          className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                        >
                          {paymentStatusOptions.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </label>

                      <label className="block">
                        <span className="text-sm font-medium text-slate-700">Статус заказа</span>
                        <select
                          value={editForm.orderStatus}
                          onChange={(event) => setEditForm({ ...editForm, orderStatus: Number(event.target.value) })}
                          className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                        >
                          {orderStatusOptions.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <label className="block">
                        <span className="text-sm font-medium text-slate-700">Дата доставки</span>
                        <input
                          type="date"
                          value={editForm.deliveryDate}
                          onChange={(event) => setEditForm({ ...editForm, deliveryDate: event.target.value })}
                          className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                        />
                      </label>

                      <label className="block md:col-span-2">
                        <span className="text-sm font-medium text-slate-700">Адрес</span>
                        <input
                          value={editForm.address}
                          onChange={(event) => setEditForm({ ...editForm, address: event.target.value })}
                          className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_180px]">
                      <label className="block">
                        <span className="text-sm font-medium text-slate-700">Дополнительная информация</span>
                        <textarea
                          value={editForm.additionalInfo}
                          onChange={(event) => setEditForm({ ...editForm, additionalInfo: event.target.value })}
                          className="mt-2 block min-h-24 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                        />
                      </label>

                      <label className="block">
                        <span className="text-sm font-medium text-slate-700">Скидка, %</span>
                        <input
                          type="number"
                          min="0"
                          value={editForm.discountPercent}
                          onChange={(event) => setEditForm({ ...editForm, discountPercent: event.target.value })}
                          className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                        />
                      </label>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
                        <h3 className="text-sm font-semibold text-slate-900">Товары в заказе</h3>
                        <button
                          type="button"
                          onClick={addEditItem}
                          className="text-sm font-medium text-orange-600 hover:text-orange-800 disabled:text-slate-400"
                          disabled={isProductsLoading || vendorProducts.length === 0}
                        >
                          {isProductsLoading ? 'Загружаем товары...' : 'Добавить товар'}
                        </button>
                      </div>
                      <div className="divide-y divide-slate-100">
                        {editForm.items.map((item, index) => {
                          const unitPrice = Number(item.price) || 0;
                          const rowTotal = unitPrice * item.quantity;

                          return (
                          <div key={`${item.id ?? 'new'}-${index}`} className="grid grid-cols-1 gap-3 px-4 py-4 md:grid-cols-[1fr_110px_130px_130px_auto]">
                            <select
                              value={item.productId}
                              onChange={(event) => updateEditItem(index, { productId: Number(event.target.value) })}
                              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                            >
                              <option value={0}>Выберите товар</option>
                              {vendorProducts.map((product) => (
                                <option key={product.id} value={product.id}>
                                  {product.name}
                                </option>
                              ))}
                            </select>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(event) => updateEditItem(index, { quantity: Number(event.target.value) })}
                              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                            />
                            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500">
                              {formatMoney(unitPrice)} ₸/шт
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-900">
                              {formatMoney(rowTotal)} ₸
                            </div>
                            <button
                              type="button"
                              onClick={() => removeEditItem(index)}
                              className="rounded-xl px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:text-slate-400"
                              disabled={editForm.items.length === 1}
                            >
                              Удалить
                            </button>
                          </div>
                        )})}
                      </div>
                      <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-4 py-3">
                        <div className="text-right">
                          <p className="text-xs font-semibold uppercase text-slate-400">Итого по товарам</p>
                          <p className="text-lg font-bold text-slate-900">
                            {formatMoney(editForm.items.reduce((sum, item) => sum + (Number(item.price) || 0) * item.quantity, 0))} ₸
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 p-4">
                    <p className="text-xs font-semibold uppercase text-slate-400">Контакты</p>
                    <p className="mt-2 text-sm font-medium text-slate-900">{selectedOrder.customer}</p>
                    <p className="mt-1 text-sm text-slate-600">{selectedOrder.phone || 'Телефон не указан'}</p>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-4">
                    <p className="text-xs font-semibold uppercase text-slate-400">Доставка</p>
                    <p className="mt-2 text-sm font-medium text-slate-900">
                      {selectedOrder.deliveryStatusLabel || 'Статус не указан'}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {selectedOrder.deliveryDate
                        ? new Date(selectedOrder.deliveryDate).toLocaleDateString('ru-RU')
                        : 'Дата не указана'}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-4">
                    <p className="text-xs font-semibold uppercase text-slate-400">Оплата</p>
                    <p className="mt-2 text-sm font-medium text-slate-900">{selectedOrder.paymentTypeLabel}</p>
                    <p className="mt-1 text-sm text-slate-600">{selectedOrder.paymentStatusLabel}</p>
                    <p className="mt-1 text-sm text-slate-600">{selectedOrder.statusLabel}</p>
                  </div>
                </div>

                {selectedOrder.vendorName && (
                  <div className="mt-4 rounded-xl border border-slate-200 p-4">
                    <p className="text-xs font-semibold uppercase text-slate-400">Поставщик</p>
                    <p className="mt-2 text-sm font-medium text-slate-900">{selectedOrder.vendorName}</p>
                  </div>
                )}

                <div className="mt-4 rounded-xl border border-slate-200 p-4">
                  <p className="text-xs font-semibold uppercase text-slate-400">Адрес</p>
                  <p className="mt-2 text-sm text-slate-700">{selectedOrder.address || 'Адрес не указан'}</p>
                  {selectedOrder.additionalInfo && (
                    <p className="mt-2 text-sm text-slate-500">{selectedOrder.additionalInfo}</p>
                  )}
                </div>

                {(selectedOrder.expeditorName || selectedOrder.expeditorPhone || selectedOrder.finalDeliveryPrice) && (
                  <div className="mt-4 rounded-xl border border-slate-200 p-4">
                    <p className="text-xs font-semibold uppercase text-slate-400">Экспедитор</p>
                    <p className="mt-2 text-sm font-medium text-slate-900">
                      {selectedOrder.expeditorName || 'Не назначен'}
                    </p>
                    {selectedOrder.expeditorPhone && (
                      <p className="mt-1 text-sm text-slate-600">{selectedOrder.expeditorPhone}</p>
                    )}
                    {selectedOrder.finalDeliveryPrice && (
                      <p className="mt-1 text-sm text-slate-600">
                        Стоимость доставки: {Number(selectedOrder.finalDeliveryPrice).toLocaleString()} ₸
                      </p>
                    )}
                  </div>
                )}

                <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
                  <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                    <h3 className="text-sm font-semibold text-slate-900">Товары в заказе</h3>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {selectedOrder.products.map((product) => (
                      <div key={product.id} className="grid grid-cols-[56px_1fr] gap-4 px-4 py-4 md:grid-cols-[64px_1fr_auto]">
                        <img
                          src={product.product_image || '/logo.svg'}
                          alt={product.product_name}
                          className="h-14 w-14 rounded-lg object-cover ring-1 ring-slate-200 md:h-16 md:w-16"
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900">{product.product_name}</p>
                          <p className="mt-1 text-sm text-slate-500">
                            Кол-во: {product.quantity} · Цена: {Number(product.price).toLocaleString()} ₸
                          </p>
                          {product.product_article && (
                            <p className="mt-1 text-xs text-slate-400">Артикул: {product.product_article}</p>
                          )}
                        </div>
                        <div className="col-span-2 text-left md:col-span-1 md:text-right">
                          <p className="text-sm font-semibold text-slate-900">
                            {Number(product.sell_amount_price).toLocaleString()} ₸
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex justify-end border-t border-slate-100 pt-5">
                  <div className="min-w-64 space-y-2 text-right">
                    <div className="flex justify-between gap-8 text-sm text-slate-500">
                      <span>Сумма магазина</span>
                        <span>{formatMoney(selectedOrder.shopTotal)} ₸</span>
                    </div>
                    <div className="flex justify-between gap-8 text-sm text-slate-500">
                      <span>Комиссия</span>
                      <span>{formatMoney(selectedOrder.commissionTotal)} ₸</span>
                    </div>
                    {selectedOrder.discountPercent && (
                      <div className="flex justify-between gap-8 text-sm text-slate-500">
                        <span>Скидка</span>
                        <span>{selectedOrder.discountPercent}%</span>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-slate-500">Итого</p>
                      <p className="text-2xl font-bold text-slate-900">
                        {formatMoney(selectedOrder.total)} ₸
                      </p>
                    </div>
                  </div>
                </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default OrdersPage; 
