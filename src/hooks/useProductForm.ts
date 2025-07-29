import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import productService from '../services/productService';
import type { Product } from '../types/product';

// Определяем тип для опций react-select
export interface SelectOption {
  value: number;
  label: string;
}

// Определяем тип для аргументов хука (пока не используется, но пригодится для редактирования)
interface UseProductFormArgs {
  productId?: number;
  isEditMode?: boolean;
}

/**
 * Кастомный хук для управления логикой формы создания/редактирования товара.
 * Инкапсулирует состояние формы, валидацию, загрузку данных и отправку на сервер.
 */
export const useProductForm = ({ productId, isEditMode = false }: UseProductFormArgs = {}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    brand_id: null as number | null,
    unit_id: null as number | null,
    category_id: null as number | null,
    price: 0,
    article: 0,
    length: undefined as number | undefined,
    width: undefined as number | undefined,
    height: undefined as number | undefined,
    weight: undefined as number | undefined,
    images: [] as File[]
  });

  // Состояния для данных селектов
  const [brands, setBrands] = useState<SelectOption[]>([]);
  const [categories, setCategories] = useState<SelectOption[]>([]);
  const [units, setUnits] = useState<SelectOption[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Состояния для выбранных опций react-select
  const [selectedBrand, setSelectedBrand] = useState<SelectOption | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<SelectOption | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<SelectOption | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  // Загрузка данных для селектов и данных товара для редактирования
  useEffect(() => {
    const fetchSelectData = async () => {
      try {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.submit;
          return newErrors;
        });
        setIsDataLoading(true);

        // Параллельно загружаем справочники
        const [brandsData, categoriesData, unitsData] = await Promise.all([
          productService.getBrands(),
          productService.getCategories(),
          productService.getUnits()
        ]);

        const brandsOptions = brandsData.map(brand => ({ value: brand.id, label: brand.title }));
        const categoriesOptions = categoriesData.map(category => ({ value: category.id, label: category.title }));
        const unitsOptions = unitsData.map(unit => ({ value: unit.id, label: unit.title }));

        setBrands(brandsOptions);
        setCategories(categoriesOptions);
        setUnits(unitsOptions);

        // Если режим редактирования, загружаем данные товара
        if (isEditMode && productId) {
          const productData = await productService.getProduct(productId);
          setFormData({
            title: productData.title,
            description: productData.description || '',
            brand_id: productData.brand.id,
            unit_id: productData.unit.id,
            category_id: productData.category.id,
            price: productData.price,
            article: productData.article || 0,
            length: productData.length,
            width: productData.width,
            height: productData.height,
            weight: productData.weight,
            images: [] // Изображения загружаются отдельно
          });
          
          // Устанавливаем выбранные значения для селектов
          setSelectedBrand(brandsOptions.find(b => b.value === productData.brand.id) || null);
          setSelectedCategory(categoriesOptions.find(c => c.value === productData.category.id) || null);
          setSelectedUnit(unitsOptions.find(u => u.value === productData.unit.id) || null);
          
          if (productData.photos) {
            setPreviewImages(productData.photos.map(p => p.link));
          }
        }

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки данных для формы';
        setErrors(prev => ({ ...prev, submit: errorMessage }));
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchSelectData();
  }, [productId, isEditMode]);
  
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (field: string, selectedOption: SelectOption | null) => {
    handleChange(field, selectedOption ? selectedOption.value : null);

    if (field === 'brand_id') {
      setSelectedBrand(selectedOption);
    } else if (field === 'unit_id') {
      setSelectedUnit(selectedOption);
    } else if (field === 'category_id') {
      setSelectedCategory(selectedOption);
    }
  };
  
  const handleNumberChange = (field: string, value: string) => {
    if (value === '') {
      handleChange(field, undefined);
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        handleChange(field, numValue);
      }
    }
  };
  
  const handlePriceChange = (value: string) => {
    const sanitized = value.replace(/[^\d.]/g, '');
    
    if (sanitized === '') {
      handleChange('price', 0);
    } else {
      const numValue = parseFloat(sanitized);
      if (!isNaN(numValue) && numValue >= 0) {
        handleChange('price', numValue);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newFiles]
      }));
      
      setPreviewImages(prev => [...prev, ...newPreviews]);

      if (errors.images) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.images;
          return newErrors;
        });
      }
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      return { ...prev, images: newImages };
    });
    
    URL.revokeObjectURL(previewImages[index]);
    
    setPreviewImages(prev => {
      const newPreviews = [...prev];
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  useEffect(() => {
    return () => {
      previewImages.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewImages]);
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Введите название';
    if (!formData.description.trim()) newErrors.description = 'Введите описание';
    if (!formData.brand_id) newErrors.brand_id = 'Выберите бренд';
    if (!formData.category_id) newErrors.category_id = 'Выберите категорию';
    if (!formData.unit_id) newErrors.unit_id = 'Выберите единицу измерения';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Укажите цену';
    // В режиме создания изображения обязательны, в режиме редактирования - нет
    if (!isEditMode && (!formData.images || formData.images.length === 0)) {
      newErrors.images = 'Загрузите хотя бы одно изображение товара';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    const toastId = toast.loading(isEditMode ? 'Обновление товара...' : 'Создание товара...');
    
    try {
      const formDataToSend = new FormData();
      
      // Обязательно проверяем на null, т.к. начальное состояние - null
      if (formData.brand_id === null || formData.unit_id === null || formData.category_id === null) {
        throw new Error("Бренд, категория и ед. измерения должны быть выбраны");
      }

      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price.toString());
      formDataToSend.append('brand_id', formData.brand_id.toString());
      formDataToSend.append('unit_id', formData.unit_id.toString());
      formDataToSend.append('category_id', formData.category_id.toString());
      
      if (formData.article) formDataToSend.append('article', formData.article.toString());
      if (formData.length !== undefined) formDataToSend.append('length', formData.length.toString());
      if (formData.width !== undefined) formDataToSend.append('width', formData.width.toString());
      if (formData.height !== undefined) formDataToSend.append('height', formData.height.toString());
      if (formData.weight !== undefined) formDataToSend.append('weight', formData.weight.toString());
      
      formData.images.forEach(image => {
        formDataToSend.append('files', image);
      });
      
      if (isEditMode && productId) {
        await productService.updateProductWithImages(productId, formDataToSend);
        toast.success('Товар успешно обновлен!', { id: toastId });

        // Через 1.5 секунды можно сделать редирект или обновить данные
        setTimeout(() => navigate('/dashboard/products'), 1500);

      } else {
        await productService.createProductWithImages(formDataToSend);
        toast.success('Товар успешно создан!', { id: toastId });

        // Перенаправляем на список товаров после успеха
        setTimeout(() => navigate('/dashboard/products'), 1500);
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Произошла неизвестная ошибка';
      toast.error(errorMessage, { id: toastId });
      setErrors(prev => ({...prev, submit: errorMessage})); // можно оставить для отображения под формой
    } finally {
      setIsLoading(false);
    }
  };

  return {
    navigate,
    formData,
    isLoading,
    isDataLoading,
    errors,
    // success больше не нужен
    brands,
    categories,
    units,
    selectedBrand,
    selectedCategory,
    selectedUnit,
    previewImages,
    fileInputRef,
    handleSelectChange,
    handleChange,
    handleNumberChange,
    handlePriceChange,
    handleFileChange,
    removeImage,
    handleSubmit,
  };
}; 