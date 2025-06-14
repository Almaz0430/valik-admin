/**
 * Компонент справки для дашборда
 */
import React from 'react';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

interface HelpSectionProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onOpenGuide?: () => void;
}

const HelpSection: React.FC<HelpSectionProps> = ({
  title = 'Нужна помощь?',
  description = 'Мы подготовили для вас руководство по работе с системой управления товарами. Узнайте, как добавлять товары, управлять заказами и настраивать свой профиль.',
  buttonText = 'Открыть руководство',
  onOpenGuide
}) => {
  return (
    <section className="bg-orange-50 border border-orange-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-start">
        <div className="flex-shrink-0 bg-orange-100 rounded-full p-3">
          <QuestionMarkCircleIcon className="h-8 w-8 text-orange-600" />
        </div>
        <div className="ml-5">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <p className="mt-2 text-base text-gray-600">
            {description}
          </p>
          <div className="mt-4">
            <button 
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              onClick={onOpenGuide}
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HelpSection; 