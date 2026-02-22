/**
 * Компонент таблицы для отображения данных
 */
import React from 'react';

export interface Column<T> {
  header: React.ReactNode;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  className?: string;
  rowClassName?: string | ((item: T) => string);
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyMessage = 'Нет данных для отображения',
  onRowClick,
  className = '',
  rowClassName = '',
}: TableProps<T>) {
  const renderCell = (column: Column<T>, item: T) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(item);
    }

    return item[column.accessor] as React.ReactNode;
  };

  const getRowClassName = (item: T) => {
    if (typeof rowClassName === 'function') {
      return rowClassName(item);
    }
    return rowClassName;
  };

  return (
    <div className="overflow-x-auto rounded-xl ring-1 ring-slate-200 shadow-sm">
      <table className={`min-w-full divide-y divide-slate-200 ${className}`}>
        <thead className="bg-slate-50/80 backdrop-blur-sm">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className={`px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider ${column.className || ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-100">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center">
                <div className="flex justify-center">
                  <svg className="animate-spin h-6 w-6 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-sm text-slate-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map(item => (
              <tr
                key={keyExtractor(item)}
                onClick={onRowClick ? () => onRowClick(item) : undefined}
                className={`transition-colors duration-150 ${onRowClick ? 'cursor-pointer hover:bg-slate-50' : 'hover:bg-slate-50/50'} ${getRowClassName(item)}`}
              >
                {columns.map((column, index) => (
                  <td key={index} className={`px-6 py-4 text-sm text-slate-700 ${column.className || ''}`}>
                    {renderCell(column, item)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table; 