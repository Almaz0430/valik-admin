/**
 * Компонент с содержимым страницы руководства по сайту
 */
import React, { useState } from 'react';
import { 
  ShoppingCartIcon, 
  CubeIcon, 
  ChevronRightIcon,
  ChevronDownIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

interface GuideSection {
  id: string;
  title: string;
  icon: React.FC<React.ComponentProps<'svg'>>;
  content: string[];
  subsections?: {
    id: string;
    title: string;
    content: string[];
  }[];
}

const GuidePageContent: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>('products');
  const [expandedSubsection, setExpandedSubsection] = useState<string | null>(null);

  // Данные разделов руководства
  const guideSections: GuideSection[] = [
    {
      id: 'products',
      title: 'Управление товарами',
      icon: CubeIcon,
      content: [
        'Раздел "Товары" позволяет управлять каталогом товаров вашего магазина.',
        'Здесь вы можете добавлять новые товары, редактировать существующие, устанавливать цены, загружать изображения и управлять наличием товаров.',
        'Используйте фильтры и поиск для быстрого доступа к нужным товарам.'
      ],
      subsections: [
        {
          id: 'products-add',
          title: 'Добавление нового товара',
          content: [
            'Для добавления нового товара нажмите кнопку "Добавить товар" в верхней части страницы управления товарами.',
            'Заполните все обязательные поля формы: название, описание, цена, категория и т.д.',
            'Загрузите изображения товара, используя блок загрузки изображений.',
            'После заполнения всех необходимых полей нажмите кнопку "Сохранить", чтобы добавить товар в каталог.'
          ]
        },
        {
          id: 'products-edit',
          title: 'Редактирование товара',
          content: [
            'Для редактирования товара найдите его в списке и нажмите на кнопку редактирования (значок карандаша).',
            'Внесите необходимые изменения в форму редактирования товара.',
            'Нажмите кнопку "Сохранить", чтобы применить изменения.',
            'Вы можете изменить статус товара, используя соответствующее поле в форме редактирования.'
          ]
        },
        {
          id: 'products-delete',
          title: 'Удаление товара',
          content: [
            'Для удаления товара найдите его в списке и нажмите на кнопку удаления (значок корзины).',
            'Подтвердите удаление в диалоговом окне.',
            'Обратите внимание, что удаление товара является необратимым действием.',
            'Если вы хотите временно скрыть товар, но не удалять его, рекомендуется изменить его статус на "Неактивный".'
          ]
        }
      ]
    },
    {
      id: 'orders',
      title: 'Управление заказами',
      icon: ShoppingCartIcon,
      content: [
        'Раздел "Заказы" позволяет отслеживать и управлять заказами клиентов.',
        'Здесь вы можете просматривать детали заказов, изменять их статус, добавлять комментарии и печатать документы.',
        'Используйте фильтры для поиска заказов по различным параметрам: номеру, статусу, дате и сумме.'
      ],
      subsections: [
        {
          id: 'orders-status',
          title: 'Статусы заказов',
          content: [
            'Каждый заказ имеет статус, который отражает его текущее состояние в процессе обработки:',
            '"Новый" — заказ только что создан и ожидает обработки.',
            '"В обработке" — заказ принят и находится в процессе комплектации.',
            '"Отправлен" — заказ передан в службу доставки.',
            '"Доставлен" — заказ доставлен клиенту.',
            '"Завершен" — заказ полностью обработан и закрыт.'
          ]
        },
        {
          id: 'orders-details',
          title: 'Просмотр деталей заказа',
          content: [
            'Для просмотра подробной информации о заказе нажмите на кнопку "Подробнее" в строке соответствующего заказа.',
            'На странице деталей заказа вы можете увидеть информацию о клиенте, список товаров, стоимость доставки и общую сумму заказа.',
            'Здесь же вы можете изменить статус заказа, добавить комментарий или распечатать документы.'
          ]
        },
        {
          id: 'orders-print',
          title: 'Печать документов',
          content: [
            'Для печати документов по заказу нажмите на кнопку "Печать" в строке соответствующего заказа или на странице деталей заказа.',
            'Выберите тип документа для печати: счет, накладную или акт приема-передачи.',
            'Документ будет сформирован в формате PDF и открыт в новой вкладке браузера, откуда его можно распечатать или сохранить.'
          ]
        }
      ]
    }
  ];

  // Обработчики для раскрытия/скрытия разделов
  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
    setExpandedSubsection(null);
  };

  const toggleSubsection = (subsectionId: string) => {
    setExpandedSubsection(expandedSubsection === subsectionId ? null : subsectionId);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Заголовок страницы */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4">
          <QuestionMarkCircleIcon className="h-10 w-10 text-orange-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Руководство по товарам и заказам</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          В этом руководстве вы найдете подробную информацию о том, как создавать и управлять товарами, 
          а также отслеживать и обрабатывать заказы в административной панели.
        </p>
      </div>

      {/* Содержание */}
      <div className="space-y-6">
        {guideSections.map((section) => {
          const isExpanded = expandedSection === section.id;
          const Icon = section.icon;
          
          return (
            <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Заголовок раздела */}
              <button 
                className={`w-full flex items-center justify-between p-4 text-left focus:outline-none ${
                  isExpanded ? 'bg-orange-50' : 'bg-white hover:bg-gray-50'
                }`}
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center">
                  <div className={`p-2 rounded-full ${isExpanded ? 'bg-orange-100' : 'bg-gray-100'}`}>
                    <Icon className={`h-6 w-6 ${isExpanded ? 'text-orange-600' : 'text-gray-600'}`} />
                  </div>
                  <h2 className="ml-3 text-xl font-medium text-gray-900">{section.title}</h2>
                </div>
                {isExpanded ? (
                  <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronRightIcon className="h-5 w-5 text-gray-500" />
                )}
              </button>
              
              {/* Содержимое раздела */}
              {isExpanded && (
                <div className="px-4 pb-4">
                  <div className="p-4 bg-gray-50 rounded-lg mb-4">
                    {section.content.map((paragraph, idx) => (
                      <p key={idx} className="text-gray-700 mb-2 last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  
                  {/* Подразделы */}
                  {section.subsections && section.subsections.length > 0 && (
                    <div className="space-y-3 mt-4">
                      {section.subsections.map((subsection) => {
                        const isSubExpanded = expandedSubsection === subsection.id;
                        
                        return (
                          <div key={subsection.id} className="border border-gray-200 rounded-lg overflow-hidden">
                            <button 
                              className={`w-full flex items-center justify-between p-3 text-left focus:outline-none ${
                                isSubExpanded ? 'bg-orange-50' : 'bg-white hover:bg-gray-50'
                              }`}
                              onClick={() => toggleSubsection(subsection.id)}
                            >
                              <h3 className="text-lg font-medium text-gray-900">{subsection.title}</h3>
                              {isSubExpanded ? (
                                <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                              ) : (
                                <ChevronRightIcon className="h-4 w-4 text-gray-500" />
                              )}
                            </button>
                            
                            {isSubExpanded && (
                              <div className="p-3 bg-white">
                                {subsection.content.map((paragraph, idx) => (
                                  <p key={idx} className="text-gray-700 mb-2 last:mb-0">
                                    {paragraph}
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GuidePageContent; 