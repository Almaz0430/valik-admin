/**
 * Компонент последних действий
 */
import React from 'react';
import { ClockIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

interface Activity {
  id: number;
  action: string;
  product: string;
  time: string;
}

interface RecentActivitiesProps {
  activities: Activity[];
  onShowTooltip?: (id: string) => void;
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ onShowTooltip }) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Последние действия</h2>
        <div className="relative">
          <button
            id={`tooltip-trigger-activities`}
            className="inline-flex items-center text-slate-400 hover:text-slate-600 transition-colors"
            onClick={() => onShowTooltip?.('activities')}
          >
            <QuestionMarkCircleIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
      <div className="bg-white shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] ring-1 ring-slate-200/50 rounded-2xl overflow-hidden">
        <div className="p-6">
          {/* Временно показываем сообщение об отсутствии действий независимо от данных */}
          <div className="py-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-50 text-slate-400 mb-4 ring-1 ring-slate-100 shadow-sm">
              <ClockIcon className="h-8 w-8" />
            </div>
            <p className="text-lg font-semibold text-slate-800">Нет последних действий</p>
            <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">История действий появится здесь после выполнения операций с товарами или заказами</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecentActivities; 