import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CloudArrowUpIcon,
    DocumentTextIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    XCircleIcon,
    ArrowLeftIcon
} from '@heroicons/react/24/outline';
import productService from '../../features/products/api/productService';
import type { ImportProductsResponse } from '../../types/product';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { toast } from 'react-hot-toast';

const ImportProductsPage: React.FC = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [importResult, setImportResult] = useState<ImportProductsResponse | null>(null);

    useEffect(() => {
        document.title = 'Импорт товаров | Valik.kz';
        return () => {
            document.title = 'Valik.kz';
        };
    }, []);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const validateAndSetFile = (selectedFile: File) => {
        // Проверка типа файла (CSV)
        if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
            toast.error('Пожалуйста, выберите файл в формате CSV');
            return;
        }

        // Проверка размера (5MB)
        if (selectedFile.size > 5 * 1024 * 1024) {
            toast.error('Размер файла не должен превышать 5MB');
            return;
        }

        setFile(selectedFile);
        setImportResult(null);
    };

    const handleImport = async () => {
        if (!file) return;

        setIsLoading(true);
        try {
            const result = await productService.importProducts(file);
            setImportResult(result);

            if (result.status === 'success') {
                toast.success(result.message);
            } else if (result.status === 'partial') {
                toast('Импорт завершен с ошибками', { icon: '⚠️' });
            } else {
                toast.error(result.message || 'Ошибка импорта');
            }
        } catch (error) {
            console.error(error);
            toast.error(error instanceof Error ? error.message : 'Произошла ошибка при импорте');
            setImportResult({
                message: 'Ошибка при отправке файла',
                status: 'failed',
                error: error instanceof Error ? error.message : 'Неизвестная ошибка'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFile(null);
        setImportResult(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <Layout>
            <div className="space-y-6 pb-16 lg:pb-0">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-gray-900">Импорт товаров</h1>
                        <p className="text-sm text-gray-600">
                            Загрузите CSV, чтобы массово обновить каталог. Поддерживаем файлы до 5MB, кодировка UTF-8.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                                CSV с разделителем ; или ,
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                                Обязательные поля: Название, Артикул, Бренд, Категория, Цена
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Button
                            variant="custom"
                            className="bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                            leftIcon={<ArrowLeftIcon className="h-5 w-5" />}
                            onClick={() => navigate('/dashboard/products')}
                        >
                            К списку товаров
                        </Button>
                        {importResult && (
                            <Button
                                variant="custom"
                                className="bg-gray-900 text-white hover:bg-gray-800"
                                onClick={resetForm}
                            >
                                Новый импорт
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Левая колонка - Загрузка файла */}
                    <div className="xl:col-span-2 space-y-6">
                        <Card
                            title={importResult ? 'Результаты импорта' : 'Загрузите CSV файл'}
                            subtitle={
                                importResult
                                    ? 'Проверьте итог загрузки и исправьте ошибки, если они есть.'
                                    : 'Перетащите файл или выберите его вручную. Поддерживаются CSV до 5MB.'
                            }
                            className="shadow-sm"
                            headerClassName="bg-gray-50"
                        >
                            {!importResult ? (
                                <div className="space-y-6">
                                    <div
                                        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer
                    ${isDragging ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-400'}
                    ${file ? 'bg-gray-50' : 'bg-white'}
                  `}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            accept=".csv"
                                            className="hidden"
                                        />

                                        {file ? (
                                            <div className="flex flex-col items-center">
                                                <DocumentTextIcon className="h-16 w-16 text-green-500 mb-4" />
                                                <p className="text-lg font-medium text-gray-900">{file.name}</p>
                                                <p className="text-sm text-gray-500 mt-1">{(file.size / 1024).toFixed(2)} KB</p>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        resetForm();
                                                    }}
                                                    className="mt-4 text-sm text-red-500 hover:text-red-700 font-medium"
                                                >
                                                    Удалить файл
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <CloudArrowUpIcon className="h-16 w-16 text-gray-400 mb-4" />
                                                <p className="text-lg font-medium text-gray-900">Перетащите CSV файл сюда</p>
                                                <p className="text-sm text-gray-500 mt-2">или нажмите для выбора файла</p>
                                                <p className="text-xs text-gray-400 mt-4">Максимальный размер: 5MB</p>
                                            </>
                                        )}
                                    </div>

                                    <div className="flex flex-col sm:flex-row justify-between gap-3 sm:items-center">
                                        <p className="text-sm text-gray-500">
                                            После загрузки система проверит каждую строку и покажет детали.
                                        </p>
                                        <Button
                                            onClick={handleImport}
                                            disabled={!file || isLoading}
                                            isLoading={isLoading}
                                            className="w-full sm:w-auto"
                                        >
                                            {isLoading ? 'Обработка...' : 'Импортировать товары'}
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Результат импорта */}
                                    <div className={`p-6 rounded-xl border ${importResult.status === 'success' ? 'bg-green-50 border-green-200' :
                                        importResult.status === 'partial' ? 'bg-yellow-50 border-yellow-200' :
                                            'bg-red-50 border-red-200'
                                        }`}>
                                        <div className="flex items-start">
                                            {importResult.status === 'success' && <CheckCircleIcon className="h-8 w-8 text-green-500 mt-1 mr-4" />}
                                            {importResult.status === 'partial' && <ExclamationTriangleIcon className="h-8 w-8 text-yellow-500 mt-1 mr-4" />}
                                            {importResult.status === 'failed' && <XCircleIcon className="h-8 w-8 text-red-500 mt-1 mr-4" />}

                                            <div>
                                                <h3 className={`text-lg font-bold ${importResult.status === 'success' ? 'text-green-800' :
                                                    importResult.status === 'partial' ? 'text-yellow-800' :
                                                        'text-red-800'
                                                    }`}>
                                                    {importResult.message}
                                                </h3>

                                                {importResult.status !== 'failed' && (
                                                    <div className="mt-2 text-sm grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        <p>Всего строк: <span className="font-medium">{importResult.total_rows}</span></p>
                                                        <p>Обработано: <span className="font-medium">{importResult.processed_rows}</span></p>
                                                        <p>Создано товаров: <span className="font-medium">{importResult.created_products}</span></p>
                                                        {importResult.failed_rows! > 0 && (
                                                            <p className="text-red-600">Ошибок: <span className="font-medium">{importResult.failed_rows}</span></p>
                                                        )}
                                                    </div>
                                                )}

                                                {importResult.error && (
                                                    <p className="mt-2 text-red-700 text-sm">{importResult.error}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Таблица ошибок */}
                                    {importResult.errors && importResult.errors.length > 0 && (
                                        <div className="mt-6">
                                            <h4 className="text-lg font-medium text-gray-900 mb-4">Детали ошибок</h4>
                                            <div className="overflow-x-auto border rounded-lg">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Строка</th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Артикул</th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Товар</th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ошибки</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {importResult.errors.map((err, idx) => {
                                                            const rowErrors = Array.isArray(err.errors) ? err.errors : [];
                                                            return (
                                                                <tr key={idx}>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{err.row}</td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{err.article || '-'}</td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{err.title || '-'}</td>
                                                                    <td className="px-6 py-4 text-sm text-red-600">
                                                                        <ul className="list-disc pl-4">
                                                                            {rowErrors.length > 0 ? (
                                                                                rowErrors.map((e, i) => (
                                                                                    <li key={i}>{e}</li>
                                                                                ))
                                                                            ) : (
                                                                                <li className="text-gray-500">Нет деталей ошибки</li>
                                                                            )}
                                                                        </ul>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex flex-col sm:flex-row justify-end gap-3 sm:items-center">
                                        <Button
                                            variant="custom"
                                            className="bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                                            onClick={resetForm}
                                        >
                                            Загрузить другой файл
                                        </Button>
                                        {importResult.status === 'success' && (
                                            <Button onClick={() => navigate('/dashboard/products')}>
                                                Перейти к товарам
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* Правая колонка - Инструкция */}
                    <div className="space-y-6">
                        <Card title="Требования к файлу" className="shadow-sm" headerClassName="bg-gray-50">
                            <div className="prose prose-sm text-gray-500">
                                <p>Файл должен быть в формате <strong>CSV</strong> (разделитель - запятая или точка с запятой).</p>

                                <h4 className="text-gray-900 font-medium mt-4 mb-2">Обязательные поля:</h4>
                                <ul className="list-disc pl-4 space-y-1">
                                    <li>Наименование</li>
                                    <li>Артикул</li>
                                    <li>Бренд</li>
                                    <li>Категория</li>
                                    <li>Цена</li>
                                </ul>

                                <h4 className="text-gray-900 font-medium mt-4 mb-2">Опциональные поля:</h4>
                                <ul className="list-disc pl-4 space-y-1">
                                    <li>№ (игнорируется)</li>
                                    <li>Вес_кг</li>
                                    <li>Ширина</li>
                                    <li>Высота</li>
                                    <li>Описание</li>
                                </ul>

                                <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Пример структуры:</h4>
                                    <pre className="text-xs overflow-x-auto">
                                        №,Наименование,Артикул,Вес_кг,Ширина,Высота,Бренд,Категория,Описание,Цена
                                        1,Товар 1,12345,1.5,10,20,Бренд,Категория,Описание товара,1000
                                    </pre>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ImportProductsPage;
