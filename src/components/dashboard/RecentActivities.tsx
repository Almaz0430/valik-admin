/**
 * Компонент последних действий
 */
import React from 'react';
import { ClockIcon, ArrowRightIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

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

const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities, onShowTooltip }) => {
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
          {activities.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Нет последних действий</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {activities.map((activity) => (
                <li key={activity.id} className="py-5 first:pt-0 last:pb-0">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-orange-100 rounded-full p-2">
                      <ClockIcon className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">{activity.action}</h3>
                        <p className="text-sm text-gray-500">{activity.time}</p>
                      </div>
                      <p className="mt-1 text-base text-gray-600">{activity.product}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="bg-gray-50 px-6 py-4">
          <button className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Показать все действия
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default RecentActivities; 