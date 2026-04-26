import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import productService from '../api/productService';
import type { SubCategory, Category } from '../api/productService';
import { AuthContext } from '../../../contexts/AuthContextBase';
import env from '../../../config/env';

// Тип для опций react-select
export interface SelectOption {
  value: number;
  label: string;
}

interface UseProductFormArgs {
  productId?: number;
  isEditMode?: boolean;
}

/**
 * Хук управления формой создания товара.
 */
export const useProductForm = ({ productId, isEditMode = false }: UseProductFormArgs = {}) => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const normalizeImageUrl = (image: string | null | undefined): string | null => {
    if (!image) {
      return null;
    }

    try {
      return new URL(image, env.API_URL).toString();
    } catch {
      return image;
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sub_category: null as number | null,
    brand: null as number | null,
    unit: null as number | null,
    article: '' as string | number,
    length: '' as string | number,
    width: '' as string | number,
    height: '' as string | number,
    weight: '' as string | number,
    price: '' as string | number,
  });

  // Данные для дропдаунов
  const [categories, setCategories] = useState<SelectOption[]>([]);
  const [subCategories, setSubCategories] = useState<SelectOption[]>([]);
  const [brands, setBrands] = useState<SelectOption[]>([]);
  const [units, setUnits] = useState<SelectOption[]>([]);
  const [allSubCategories, setAllSubCategories] = useState<SubCategory[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);

  // Выбранные значения для react-select
  const [selectedCategory, setSelectedCategory] = useState<SelectOption | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SelectOption | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<SelectOption | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<SelectOption | null>(null);

  // Изображение (одно — как в модели OPTProduct)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isImageEditorOpen, setIsImageEditorOpen] = useState(false);
  const [tempImageForEdit, setTempImageForEdit] = useState<string | null>(null);
  const [tempImageFileName, setTempImageFileName] = useState<string>('product-image.jpg');

  // Обработчик вставки изображения из буфера обмена
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          const blob = item.getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = () => {
              setTempImageForEdit(reader.result as string);
              setTempImageFileName(`pasted-image-${Date.now()}.png`);
              setIsImageEditorOpen(true);
            };
            reader.readAsDataURL(blob);
            toast.success('Изображение вставлено из буфера обмена');
          }
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  // Загрузка справочников
  useEffect(() => {
    const fetchData = async () => {
      setIsDataLoading(true);
      try {
        const [categoriesData, subCategoriesData, brandsData, unitsData] = await Promise.all([
          productService.getCategories(),
          productService.getSubCategories(),
          productService.getBrands(),
          productService.getUnits(),
        ]);

        setAllCategories(categoriesData);
        setAllSubCategories(subCategoriesData);

        const catOptions = categoriesData.map(c => ({ value: c.id, label: c.name }));
        setCategories(catOptions);

        // Все подкатегории в плоском списке
        const subOptions = subCategoriesData.map(sc => ({ value: sc.id, label: sc.name }));
        setSubCategories(subOptions);

        // Бренды и единицы измерения
        const brandOptions = brandsData.map(b => ({ value: b.id, label: b.name }));
        setBrands(brandOptions);

        const unitOptions = unitsData.map(u => ({ value: u.id, label: u.name }));
        setUnits(unitOptions);

        // Режим редактирования — загружаем данные товара
        if (isEditMode && productId) {
          const product = await productService.getProduct(productId);

          // Получаем ID бренда и единицы измерения
          const brandId = product.brand
            ? (typeof product.brand === 'object' ? product.brand.id : product.brand)
            : null;
          const unitId = product.unit
            ? (typeof product.unit === 'object' ? product.unit.id : product.unit)
            : null;

          setFormData({
            name: product.name,
            description: product.description || '',
            sub_category: typeof product.sub_category === 'object' && product.sub_category
              ? product.sub_category.id
              : product.sub_category,
            brand: brandId,
            unit: unitId,
            article: product.article || '',
            length: product.length || '',
            width: product.width || '',
            height: product.height || '',
            weight: product.weight || '',
            price: product.price || '',
          });

          // Устанавливаем выбранную подкатегорию
          const subCategoryId = typeof product.sub_category === 'object' && product.sub_category
            ? product.sub_category.id
            : product.sub_category;

          if (subCategoryId) {
            const subOpt = subOptions.find(s => s.value === subCategoryId) || null;
            setSelectedSubCategory(subOpt);

            // Устанавливаем родительскую категорию
            const sub = subCategoriesData.find(s => s.id === subCategoryId);
            if (sub) {
              const catOpt = catOptions.find(c => c.value === sub.category) || null;
              setSelectedCategory(catOpt);
            }
          }

          // Устанавливаем бренд
          if (brandId) {
            const brandOpt = brandOptions.find(b => b.value === brandId) || null;
            setSelectedBrand(brandOpt);
          }

          // Устанавливаем единицу измерения
          if (unitId) {
            const unitOpt = unitOptions.find(u => u.value === unitId) || null;
            setSelectedUnit(unitOpt);
          }

          if (product.image) {
            setImagePreview(normalizeImageUrl(product.image));
          }
        }
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Ошибка загрузки данных';
        setErrors(prev => ({ ...prev, submit: msg }));
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchData();
  }, [productId, isEditMode]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => { const e = { ...prev }; delete e[field]; return e; });
    }
  };

  // При выборе категории — фильтруем подкатегории
  const handleCategoryChange = (option: SelectOption | null) => {
    setSelectedCategory(option);
    setSelectedSubCategory(null);
    setFormData(prev => ({ ...prev, sub_category: null }));

    if (errors.category) {
      setErrors(prev => { const e = { ...prev }; delete e.category; return e; });
    }

    if (option) {
      const filtered = allSubCategories
        .filter(sc => sc.category === option.value)
        .map(sc => ({ value: sc.id, label: sc.name }));
      setSubCategories(filtered);
    } else {
      // Если категория не выбрана — показываем все
      setSubCategories(allSubCategories.map(sc => ({ value: sc.id, label: sc.name })));
    }
  };

  const handleSubCategoryChange = (option: SelectOption | null) => {
    setSelectedSubCategory(option);
    setFormData(prev => ({ ...prev, sub_category: option ? option.value : null }));
    if (errors.sub_category) {
      setErrors(prev => { const e = { ...prev }; delete e.sub_category; return e; });
    }
  };

  const handleBrandChange = (option: SelectOption | null) => {
    setSelectedBrand(option);
    setFormData(prev => ({ ...prev, brand: option ? option.value : null }));
  };

  const handleUnitChange = (option: SelectOption | null) => {
    setSelectedUnit(option);
    setFormData(prev => ({ ...prev, unit: option ? option.value : null }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setTempImageForEdit(reader.result as string);
        setTempImageFileName(file.name);
        setIsImageEditorOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageEditSave = (editedFile: File) => {
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(editedFile);
    setImagePreview(URL.createObjectURL(editedFile));
    setIsImageEditorOpen(false);
    setTempImageForEdit(null);
    if (errors.image) {
      setErrors(prev => { const e = { ...prev }; delete e.image; return e; });
    }
  };

  const handleImageEditCancel = () => {
    setIsImageEditorOpen(false);
    setTempImageForEdit(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = () => {
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Очистка blob URL при размонтировании
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Введите название товара';
    if (!selectedCategory) newErrors.category = 'Выберите категорию';
    // if (!formData.sub_category) newErrors.sub_category = 'Выберите подкатегорию';
    // Изображение не обязательно - можно добавить в любой момент
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;

    const vendorId = auth?.supplier?.id;
    if (!vendorId) {
      toast.error('Ошибка: не удалось получить ID поставщика. Войдите заново.');
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading(isEditMode ? 'Обновление товара...' : 'Создание товара...');

    try {
      const productData = {
        vendor: Number(vendorId),
        sub_category: formData.sub_category,
        brand: formData.brand,
        unit: formData.unit,
        name: formData.name,
        description: formData.description || undefined,
        image: imageFile || undefined,
        article: formData.article ? Number(formData.article) : null,
        length: formData.length ? Number(formData.length) : null,
        width: formData.width ? Number(formData.width) : null,
        height: formData.height ? Number(formData.height) : null,
        weight: formData.weight ? Number(formData.weight) : null,
        price: formData.price ? Number(formData.price) : undefined,
      };

      if (isEditMode && productId) {
        // Режим редактирования - обновляем существующий товар
        await productService.updateProduct(productId, productData);
        toast.success('Товар успешно обновлен!', { id: toastId });
      } else {
        // Режим создания - создаем новый товар
        await productService.createProduct(productData);
        toast.success('Товар успешно создан!', { id: toastId });
      }

      setTimeout(() => navigate('/dashboard/products'), 1500);

    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Произошла неизвестная ошибка';
      toast.error(msg, { id: toastId });
      setErrors(prev => ({ ...prev, submit: msg }));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    isDataLoading,
    errors,
    // Дропдауны
    categories,
    subCategories,
    brands,
    units,
    allCategories,
    // Выбранные значения
    selectedCategory,
    selectedSubCategory,
    selectedBrand,
    selectedUnit,
    // Изображение
    imageFile,
    imagePreview,
    fileInputRef,
    isImageEditorOpen,
    tempImageForEdit,
    tempImageFileName,
    // Обработчики
    handleChange,
    handleCategoryChange,
    handleSubCategoryChange,
    handleBrandChange,
    handleUnitChange,
    handleFileChange,
    handleImageEditSave,
    handleImageEditCancel,
    removeImage,
    handleSubmit,
  };
};
