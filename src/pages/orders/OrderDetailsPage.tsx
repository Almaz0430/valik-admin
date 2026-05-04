import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { orderService } from '../../features/orders';
import productService from '../../features/products/api/productService';
import type { Order, VendorOrderUpdatePayload } from '../../types/order';
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

const formatMoney = (value: number | string) => Number(value || 0).toLocaleString('ru-RU');
const toDateInputValue = (value?: string | null) => value?.slice(0, 10) ?? '';

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

const OrderDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = React.useState<Order | null>(null);
  const [form, setForm] = React.useState<OrderEditForm | null>(null);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadData = async () => {
      const orderId = Number(id);
      if (!orderId) {
        setError('Некорректный ID заказа.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const orderDetails = await orderService.getOrder(orderId);
        setOrder(orderDetails);
        setForm(createEditForm(orderDetails));

        const vendorId = Number(localStorage.getItem('vendorId'));
        if (vendorId) {
          const vendorProducts = await productService.getVendorProducts(vendorId);
          setProducts(vendorProducts);
        }
      } catch (loadError) {
        console.error('Ошибка при загрузке заказа:', loadError);
        setError(loadError instanceof Error ? loadError.message : 'Не удалось загрузить заказ.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  const updateItem = (index: number, patch: Partial<OrderEditItem>) => {
    setForm((current) => {
      if (!current) return current;

      return {
        ...current,
        items: current.items.map((item, itemIndex) => {
          if (itemIndex !== index) return item;

          const nextItem = { ...item, ...patch };
          if (patch.productId !== undefined) {
            const product = products.find((candidate) => candidate.id === patch.productId);
            if (product) {
              nextItem.price = String(product.price);
            }
          }
          return nextItem;
        }),
      };
    });
  };

  const addItem = () => {
    const firstProduct = products[0];
    setForm((current) => {
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

  const removeItem = (index: number) => {
    setForm((current) => {
      if (!current) return current;
      return {
        ...current,
        items: current.items.filter((_, itemIndex) => itemIndex !== index),
      };
    });
  };

  const productsTotal = React.useMemo(() => {
    if (!form) return 0;
    return form.items.reduce((sum, item) => sum + (Number(item.price) || 0) * item.quantity, 0);
  }, [form]);

  const handleSave = async () => {
    if (!order || !form) return;

    const validItems = form.items.filter((item) => item.productId && item.quantity > 0);
    if (validItems.length === 0) {
      setError('Добавьте хотя бы один товар в заказ.');
      return;
    }

    const payload: VendorOrderUpdatePayload = {
      sell_product: validItems.map((item) => ({
        id: item.id,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      payment_type: form.paymentType,
      payment_status: form.paymentStatus,
      order_status: form.orderStatus,
      delevery_date: form.deliveryDate || null,
      address: form.address,
      additional_info: form.additionalInfo || null,
      discount_percent: form.discountPercent ? Number(form.discountPercent) : null,
    };

    setIsSaving(true);
    setError(null);

    try {
      const updatedOrder = await orderService.updateOrder(order.id, payload);
      setOrder(updatedOrder);
      setForm(createEditForm(updatedOrder));
    } catch (saveError) {
      console.error('Ошибка при сохранении заказа:', saveError);
      setError(saveError instanceof Error ? saveError.message : 'Не удалось сохранить заказ.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-orange-500" />
        </div>
      </Layout>
    );
  }

  if (!order || !form) {
    return (
      <Layout>
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-red-700">
          {error || 'Заказ не найден.'}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-5 sm:space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate('/dashboard/orders')}
              className="mb-4 text-sm font-medium text-slate-500 transition-colors hover:text-orange-600"
            >
              Назад к заказам
            </button>
            <p className="text-sm font-medium text-slate-500">Заказ #{order.number}</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">{order.customer}</h1>
            <p className="mt-2 text-sm text-slate-500">
              {new Date(order.date).toLocaleString('ru-RU')} · {order.phone || 'Телефон не указан'}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
            <button
              type="button"
              onClick={() => setForm(createEditForm(order))}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 sm:px-5"
              disabled={isSaving}
            >
              Сбросить
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="rounded-xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-700 disabled:opacity-60 sm:px-6"
              disabled={isSaving}
            >
              {isSaving ? 'Сохраняем...' : 'Сохранить'}
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Тип оплаты</span>
              <select
                value={form.paymentType}
                onChange={(event) => setForm({ ...form, paymentType: Number(event.target.value) })}
                className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              >
                {paymentTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Статус оплаты</span>
              <select
                value={form.paymentStatus}
                onChange={(event) => setForm({ ...form, paymentStatus: Number(event.target.value) })}
                className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              >
                {paymentStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Статус заказа</span>
              <select
                value={form.orderStatus}
                onChange={(event) => setForm({ ...form, orderStatus: Number(event.target.value) })}
                className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              >
                {orderStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[220px_1fr_180px]">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Дата доставки</span>
              <input
                type="date"
                value={form.deliveryDate}
                onChange={(event) => setForm({ ...form, deliveryDate: event.target.value })}
                className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Адрес</span>
              <input
                value={form.address}
                onChange={(event) => setForm({ ...form, address: event.target.value })}
                className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Скидка, %</span>
              <input
                type="number"
                min="0"
                value={form.discountPercent}
                onChange={(event) => setForm({ ...form, discountPercent: event.target.value })}
                className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              />
            </label>
          </div>

          <label className="mt-5 block">
            <span className="text-sm font-semibold text-slate-700">Дополнительная информация</span>
            <textarea
              value={form.additionalInfo}
              onChange={(event) => setForm({ ...form, additionalInfo: event.target.value })}
              className="mt-2 block min-h-28 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
            />
          </label>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Товары в заказе</h2>
              <p className="mt-1 text-sm text-slate-500">Цена берется из карточки товара, итог считается от количества.</p>
            </div>
            <button
              type="button"
              onClick={addItem}
              className="rounded-xl border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-orange-600 transition-colors hover:bg-orange-50 disabled:text-slate-400"
              disabled={products.length === 0}
            >
              Добавить товар
            </button>
          </div>

          <div className="space-y-3 p-4 md:hidden">
            {form.items.map((item, index) => {
              const unitPrice = Number(item.price) || 0;
              const rowTotal = unitPrice * item.quantity;

              return (
                <article key={`${item.id ?? 'new-mobile'}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <label className="block">
                    <span className="text-xs font-semibold uppercase text-slate-400">Товар</span>
                    <select
                      value={item.productId}
                      onChange={(event) => updateItem(index, { productId: Number(event.target.value) })}
                      className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                    >
                      <option value={0}>Выберите товар</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>{product.name}</option>
                      ))}
                    </select>
                  </label>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <label className="block">
                      <span className="text-xs font-semibold uppercase text-slate-400">Кол-во</span>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(event) => updateItem(index, { quantity: Number(event.target.value) })}
                        className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                      />
                    </label>
                    <div>
                      <span className="text-xs font-semibold uppercase text-slate-400">Цена</span>
                      <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                        {formatMoney(unitPrice)} ₸/шт
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3">
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-400">Сумма</p>
                      <p className="mt-1 text-lg font-bold text-slate-900">{formatMoney(rowTotal)} ₸</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="rounded-xl px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:text-slate-400"
                      disabled={form.items.length === 1}
                    >
                      Удалить
                    </button>
                  </div>
                </article>
              );
            })}

            <div className="rounded-2xl bg-slate-50 p-4 text-right">
              <p className="text-xs font-semibold uppercase text-slate-400">Итого по товарам</p>
              <p className="text-2xl font-bold text-slate-900">{formatMoney(productsTotal)} ₸</p>
            </div>
          </div>

          <div className="hidden overflow-x-auto md:block">
            <div className="min-w-[980px]">
              <div className="grid grid-cols-[minmax(320px,1fr)_120px_150px_160px_120px] gap-4 border-b border-slate-200 px-5 py-3 text-xs font-semibold uppercase text-slate-400">
                <span>Товар</span>
                <span>Количество</span>
                <span>Цена</span>
                <span>Сумма</span>
                <span className="text-right">Действие</span>
              </div>
              <div className="divide-y divide-slate-100">
                {form.items.map((item, index) => {
                  const unitPrice = Number(item.price) || 0;
                  const rowTotal = unitPrice * item.quantity;

                  return (
                    <div key={`${item.id ?? 'new'}-${index}`} className="grid grid-cols-[minmax(320px,1fr)_120px_150px_160px_120px] gap-4 px-5 py-4">
                      <select
                        value={item.productId}
                        onChange={(event) => updateItem(index, { productId: Number(event.target.value) })}
                        className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                      >
                        <option value={0}>Выберите товар</option>
                        {products.map((product) => (
                          <option key={product.id} value={product.id}>{product.name}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(event) => updateItem(index, { quantity: Number(event.target.value) })}
                        className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                      />
                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                        {formatMoney(unitPrice)} ₸/шт
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900">
                        {formatMoney(rowTotal)} ₸
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="rounded-xl px-4 py-3 text-right text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:text-slate-400"
                        disabled={form.items.length === 1}
                      >
                        Удалить
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-5 py-4">
                <div className="text-right">
                  <p className="text-xs font-semibold uppercase text-slate-400">Итого по товарам</p>
                  <p className="text-2xl font-bold text-slate-900">{formatMoney(productsTotal)} ₸</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default OrderDetailsPage;
