/**
 * Страница профиля поставщика
 */
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { authService } from '../../features/auth';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../contexts/AuthContextBase';
import type { City, Supplier, SupplierProfileUpdatePayload } from '../../types/auth';

interface ProfileFormState {
  iin: string;
  name: string;
  phone: string;
  iik: string;
  bik: string;
  bank_name: string;
  kbe: string;
  knp: string;
  city: string;
  address: string;
}

const getCityId = (supplier?: Supplier | null): string => {
  const city = supplier?.city;

  if (!city) return '';
  if (typeof city === 'object') return String(city.id);
  return String(city);
};

const createFormState = (supplier?: Supplier | null): ProfileFormState => ({
  iin: supplier?.iin ?? '',
  name: supplier?.name ?? '',
  phone: supplier?.phone ?? '',
  iik: supplier?.iik ?? '',
  bik: supplier?.bik ?? '',
  bank_name: supplier?.bank_name ?? '',
  kbe: supplier?.kbe ?? '',
  knp: supplier?.knp ?? '',
  city: getCityId(supplier),
  address: supplier?.address ?? '',
});

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { supplier } = useAuth();
  const [profile, setProfile] = useState<Supplier | null>(supplier ?? null);
  const [cities, setCities] = useState<City[]>([]);
  const [form, setForm] = useState<ProfileFormState>(() => createFormState(supplier));
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Профиль | Valik.kz';
  }, []);

  useEffect(() => {
    const loadProfileData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [currentSupplier, cityList] = await Promise.all([
          authService.getCurrentUser(),
          authService.getCities(),
        ]);

        const nextProfile = currentSupplier ?? supplier ?? null;
        setProfile(nextProfile);
        setForm(createFormState(nextProfile));
        setCities(cityList);
      } catch (loadError) {
        console.error('Ошибка при загрузке профиля:', loadError);
        setError(loadError instanceof Error ? loadError.message : 'Не удалось загрузить данные профиля');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [supplier]);

  const selectedCityName = useMemo(() => {
    const city = cities.find((item) => String(item.id) === form.city);
    return city?.name ?? 'Не выбран';
  }, [cities, form.city]);

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  const updateField = (field: keyof ProfileFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setSuccess(null);
  };

  const handleSave = async () => {
    const profileId = profile?.id ?? supplier?.id;

    if (!profileId) {
      setError('Не найден ID поставщика.');
      return;
    }

    if (!form.city) {
      setError('Выберите город.');
      return;
    }

    const payload: SupplierProfileUpdatePayload = {
      iin: form.iin,
      name: form.name,
      phone: form.phone,
      iik: form.iik,
      bik: form.bik,
      bank_name: form.bank_name,
      kbe: form.kbe,
      knp: form.knp,
      city: Number(form.city),
      address: form.address,
    };

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const updatedProfile = await authService.updateProfile(profileId, payload);
      setProfile(updatedProfile);
      setForm(createFormState(updatedProfile));
      localStorage.setItem('supplier', JSON.stringify(updatedProfile));
      setSuccess('Профиль сохранен.');
    } catch (saveError) {
      console.error('Ошибка при сохранении профиля:', saveError);
      setError(saveError instanceof Error ? saveError.message : 'Не удалось сохранить профиль');
    } finally {
      setIsSaving(false);
    }
  };

  const inputClassName = 'mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20';
  const labelClassName = 'block text-sm font-semibold text-slate-700';

  return (
    <Layout>
      <div className="space-y-6 pb-16 lg:pb-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Настройки профиля</h1>
            <p className="mt-2 text-sm text-slate-500 font-medium">
              Данные поставщика, реквизиты и город работы
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-orange-700 active:scale-[0.98] disabled:opacity-60"
          >
            {isSaving ? 'Сохраняем...' : 'Сохранить изменения'}
          </button>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-2xl border border-green-100 bg-green-50 p-4 text-sm font-medium text-green-700">
            {success}
          </div>
        )}

        <section className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] ring-1 ring-slate-200/50">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="text-lg font-semibold text-slate-900 tracking-tight">Аккаунт</h2>
            <p className="mt-1 text-sm text-slate-500">Email и технический ID не редактируются</p>
          </div>
          <div className="grid grid-cols-1 gap-5 px-6 py-5 md:grid-cols-3">
            <div>
              <p className="text-sm font-semibold text-slate-700">Email</p>
              <p className="mt-2 rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900">
                {profile?.email || supplier?.email || '—'}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">ID поставщика</p>
              <p className="mt-2 rounded-xl bg-slate-50 px-4 py-3 font-mono text-sm font-medium text-slate-900">
                {profile?.id ?? supplier?.id ?? '—'}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Город</p>
              <p className="mt-2 rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900">
                {selectedCityName}
              </p>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] ring-1 ring-slate-200/50">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="text-lg font-semibold text-slate-900 tracking-tight">Данные поставщика</h2>
            <p className="mt-1 text-sm text-slate-500">Информация для документов и связи</p>
          </div>

          {isLoading ? (
            <div className="flex min-h-64 items-center justify-center px-6 py-10">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-orange-500" />
            </div>
          ) : (
            <div className="space-y-6 px-6 py-6">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <label className={labelClassName}>
                  Название компании
                  <input
                    value={form.name}
                    onChange={(event) => updateField('name', event.target.value)}
                    className={inputClassName}
                  />
                </label>
                <label className={labelClassName}>
                  ИИН/БИН
                  <input
                    value={form.iin}
                    onChange={(event) => updateField('iin', event.target.value)}
                    className={inputClassName}
                  />
                </label>
                <label className={labelClassName}>
                  Телефон
                  <input
                    value={form.phone}
                    onChange={(event) => updateField('phone', event.target.value)}
                    className={inputClassName}
                  />
                </label>
                <label className={labelClassName}>
                  Город
                  <select
                    value={form.city}
                    onChange={(event) => updateField('city', event.target.value)}
                    className={inputClassName}
                  >
                    <option value="">Выберите город</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className={labelClassName}>
                Адрес
                <input
                  value={form.address}
                  onChange={(event) => updateField('address', event.target.value)}
                  className={inputClassName}
                />
              </label>
            </div>
          )}
        </section>

        <section className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] ring-1 ring-slate-200/50">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="text-lg font-semibold text-slate-900 tracking-tight">Банковские реквизиты</h2>
            <p className="mt-1 text-sm text-slate-500">ИИК, БИК, банк и платежные коды</p>
          </div>
          <div className="grid grid-cols-1 gap-5 px-6 py-6 md:grid-cols-2">
            <label className={labelClassName}>
              ИИК
              <input
                value={form.iik}
                onChange={(event) => updateField('iik', event.target.value)}
                className={inputClassName}
              />
            </label>
            <label className={labelClassName}>
              БИК
              <input
                value={form.bik}
                onChange={(event) => updateField('bik', event.target.value)}
                className={inputClassName}
              />
            </label>
            <label className={labelClassName}>
              Название банка
              <input
                value={form.bank_name}
                onChange={(event) => updateField('bank_name', event.target.value)}
                className={inputClassName}
              />
            </label>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <label className={labelClassName}>
                КБе
                <input
                  value={form.kbe}
                  onChange={(event) => updateField('kbe', event.target.value)}
                  className={inputClassName}
                />
              </label>
              <label className={labelClassName}>
                КНП
                <input
                  value={form.knp}
                  onChange={(event) => updateField('knp', event.target.value)}
                  className={inputClassName}
                />
              </label>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] ring-1 ring-slate-200/50">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="text-lg font-semibold text-slate-900 tracking-tight">Сессия и безопасность</h2>
            <p className="mt-1 text-sm text-slate-500">Управление текущей сессией</p>
          </div>
          <div className="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              Если вы пользуетесь общим устройством, не забывайте выходить из аккаунта после завершения работы.
            </p>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-xl bg-red-50 px-5 py-2.5 text-sm font-medium text-red-600 transition-all hover:bg-red-100 active:scale-[0.98]"
            >
              <ArrowRightOnRectangleIcon className="mr-2 h-5 w-5" />
              <span>Выйти из системы</span>
            </button>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default ProfilePage;
