/**
 * Компонент справки для дашборда
 */
import React from 'react';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

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
    <section className="bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-200/60 rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center">
        <div className="flex-shrink-0 bg-white rounded-2xl p-4 shadow-sm ring-1 ring-orange-200/50 mb-4 sm:mb-0">
          <QuestionMarkCircleIcon className="h-8 w-8 text-orange-600" />
        </div>
        <div className="sm:ml-6">
          <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
          <p className="mt-2 text-base text-slate-600 leading-relaxed max-w-3xl">
            {description}
          </p>
          <div className="mt-5">
            {onOpenGuide ? (
              <button
                className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-xl shadow-[0_2px_8px_-2px_rgba(249,115,22,0.4)] text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 active:scale-[0.98] transition-all"
                onClick={onOpenGuide}
              >
                {buttonText}
              </button>
            ) : (
              <Link
                to="/dashboard/guide"
                className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-xl shadow-[0_2px_8px_-2px_rgba(249,115,22,0.4)] text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 active:scale-[0.98] transition-all"
              >
                {buttonText}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HelpSection; 