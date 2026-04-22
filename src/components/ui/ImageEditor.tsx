/**
 * Компонент для редактирования изображений товаров
 * Использует react-image-crop для обрезки изображений
 */
import React, { useState, useRef, useCallback } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { 
  XMarkIcon, 
  CheckIcon,
  ArrowPathIcon,
  ScissorsIcon
} from '@heroicons/react/24/outline';

// Определяем типы локально, так как они не экспортируются из библиотеки
interface Crop {
  unit: '%' | 'px';
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PixelCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageEditorProps {
  imageUrl: string;
  onSave: (editedFile: File) => void;
  onCancel: () => void;
  fileName: string;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ 
  imageUrl, 
  onSave, 
  onCancel, 
  fileName 
}) => {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 90,
    height: 90,
    x: 5,
    y: 5
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onImageLoad = useCallback(() => {
    // Устанавливаем начальную область обрезки
    setCrop({
      unit: '%',
      width: 90,
      height: 90,
      x: 5,
      y: 5
    });
  }, []);

  // Функция для создания canvas с обрезанным изображением
  const getCroppedImg = useCallback(async (): Promise<File | null> => {
    const image = imgRef.current;
    const canvas = canvasRef.current;
    
    if (!image || !canvas) {
      console.error('Image or canvas ref is null');
      return null;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Could not get canvas context');
      return null;
    }

    // Если нет completedCrop, используем всё изображение
    const cropToUse = completedCrop && completedCrop.width > 0 && completedCrop.height > 0
      ? completedCrop
      : {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height
        };

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Устанавливаем размеры canvas
    const outputWidth = Math.floor(cropToUse.width * scaleX);
    const outputHeight = Math.floor(cropToUse.height * scaleY);
    
    canvas.width = outputWidth;
    canvas.height = outputHeight;

    ctx.imageSmoothingQuality = 'high';

    // Применяем поворот если есть
    if (rotation !== 0) {
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
    }

    try {
      ctx.drawImage(
        image,
        Math.floor(cropToUse.x * scaleX),
        Math.floor(cropToUse.y * scaleY),
        outputWidth,
        outputHeight,
        0,
        0,
        outputWidth,
        outputHeight
      );

      if (rotation !== 0) {
        ctx.restore();
      }

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], fileName, { type: 'image/jpeg' });
            resolve(file);
          } else {
            console.error('Canvas toBlob returned null');
            resolve(null);
          }
        }, 'image/jpeg', 0.9);
      });
    } catch (error) {
      console.error('Error drawing image to canvas:', error);
      if (rotation !== 0) {
        ctx.restore();
      }
      return null;
    }
  }, [completedCrop, rotation, fileName]);

  const handleSave = async () => {
    const croppedFile = await getCroppedImg();
    if (croppedFile) {
      onSave(croppedFile);
    } else {
      // Если не удалось создать файл, показываем ошибку
      alert('Ошибка при сохранении изображения. Попробуйте снова.');
    }
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleReset = () => {
    setCrop({
      unit: '%',
      width: 90,
      height: 90,
      x: 5,
      y: 5
    });
    setRotation(0);
    setScale(1);
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-3 sm:p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div className="bg-white rounded-xl sm:rounded-lg w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-auto shadow-2xl">
        {/* Заголовок */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-100">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
            <ScissorsIcon className="h-5 w-5 mr-2 flex-shrink-0" />
            <span className="hidden sm:inline">Редактирование изображения</span>
            <span className="sm:hidden">Кроп</span>
          </h3>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4">
          {/* Панель инструментов */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 rounded-lg">
            <button
              type="button"
              onClick={handleRotate}
              className="flex items-center px-3 py-2 text-xs sm:text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex-shrink-0"
            >
              <ArrowPathIcon className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Повернуть</span>
              <span className="sm:hidden">↻</span>
            </button>
            
            <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
              <label className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">Масштаб:</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-16 sm:w-24 flex-shrink-0"
              />
              <span className="text-xs sm:text-sm text-gray-600 w-10 text-right">{Math.round(scale * 100)}%</span>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="flex items-center px-3 py-2 text-xs sm:text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex-shrink-0"
            >
              <span className="hidden sm:inline">Сбросить</span>
              <span className="sm:hidden">⟲</span>
            </button>
          </div>

          {/* Область редактирования */}
          <div className="flex justify-center overflow-hidden rounded-lg bg-gray-50 p-2">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={undefined}
              minWidth={30}
              minHeight={30}
            >
              <img
                ref={imgRef}
                src={imageUrl}
                alt="Редактируемое изображение"
                onLoad={onImageLoad}
                className="max-w-full h-auto"
                style={{
                  transform: `rotate(${rotation}deg) scale(${scale})`,
                  maxHeight: 'min(400px, 50vh)'
                }}
              />
            </ReactCrop>
          </div>

          {/* Скрытый canvas для обработки */}
          <canvas
            ref={canvasRef}
            style={{ display: 'none' }}
          />

          {/* Кнопки действий */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 flex items-center justify-center px-4 py-2.5 sm:py-3 rounded-xl text-sm font-semibold text-white bg-orange-600 shadow-[0_2px_8px_-2px_rgba(249,115,22,0.4)] hover:bg-orange-700 transition-all active:scale-[0.98]"
            >
              <CheckIcon className="h-4 w-4 mr-1.5" />
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
