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
        <h2 className="text-2xl font-bold text-gray-900">Последние действия</h2>
        <div className="relative">
          <button 
            id={`tooltip-trigger-activities`}
            className="inline-flex items-center text-gray-500 hover:text-gray-700"
            onClick={() => onShowTooltip?.('activities')}
          >
            <QuestionMarkCircleIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="p-6">
          {/* Временно показываем сообщение об отсутствии действий независимо от данных */}
          <div className="py-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
              <ClockIcon className="h-8 w-8" />
            </div>
            <p className="text-lg font-medium text-gray-800">Нет последних действий</p>
            <p className="mt-2 text-sm text-gray-500">История действий появится здесь после выполнения операций</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecentActivities; 