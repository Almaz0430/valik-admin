/**
 * Компонент подсказки
 */
import React, { useRef, useEffect, useState } from 'react';

interface TooltipProps {
  id: string;
  text: string;
  isVisible: boolean;
  onClose: () => void;
}

const Tooltip: React.FC<TooltipProps> = ({ id, text, isVisible, onClose }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  
  // Обновляем позицию при изменении видимости или прокрутке
  useEffect(() => {
    const updatePosition = () => {
      if (isVisible) {
        const element = document.getElementById(`tooltip-trigger-${id}`);
        if (element && tooltipRef.current) {
          const rect = element.getBoundingClientRect();
          
          // Позиционируем подсказку под кнопкой
          setPosition({
            top: rect.bottom + 5,
            left: rect.left
          });
          
          // Проверяем, не выходит ли подсказка за пределы экрана по горизонтали
          const tooltipRect = tooltipRef.current.getBoundingClientRect();
          if (rect.left + tooltipRect.width > window.innerWidth) {
            // Если выходит, выравниваем по правому краю кнопки
            setPosition(prev => ({
              ...prev,
              left: rect.right - tooltipRect.width
            }));
          }
        }
      }
    };
    
    // Вызываем сразу и при прокрутке
    updatePosition();
    
    // Добавляем обработчики для закрытия подсказки
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    const handleScroll = () => {
      updatePosition(); // Обновляем позицию при прокрутке
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', updatePosition);
    
    // Очищаем обработчики при размонтировании
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isVisible, id, onClose]);
  
  if (!isVisible) return null;
  
  return (
    <div 
      ref={tooltipRef}
      className="fixed z-50 bg-gray-800 text-white p-3 rounded-lg shadow-lg text-sm max-w-xs"
      style={{ 
        top: `${position.top}px`, 
        left: `${position.left}px` 
      }}
    >
      {text}
      <button 
        className="absolute top-1 right-1 text-gray-300 hover:text-white"
        onClick={onClose}
      >
        ×
      </button>
    </div>
  );
};

export default Tooltip; 