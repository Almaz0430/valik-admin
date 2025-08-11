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
    
    if (!image || !canvas || !completedCrop) {
      return null;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return null;
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    ctx.imageSmoothingQuality = 'high';

    // Применяем поворот если есть
    if (rotation !== 0) {
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
    }

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
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
          resolve(null);
        }
      }, 'image/jpeg', 0.9);
    });
  }, [completedCrop, rotation, fileName]);

  const handleSave = async () => {
    const croppedFile = await getCroppedImg();
    if (croppedFile) {
      onSave(croppedFile);
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
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-auto">
        {/* Заголовок */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            <ScissorsIcon className="h-5 w-5 inline mr-2" />
            Редактирование изображения
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Панель инструментов */}
        <div className="flex flex-wrap gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
          <button
            onClick={handleRotate}
            className="flex items-center px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <ArrowPathIcon className="h-4 w-4 mr-1" />
            Повернуть
          </button>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Масштаб:</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="w-20"
            />
            <span className="text-sm text-gray-600">{Math.round(scale * 100)}%</span>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Сбросить
          </button>
        </div>

        {/* Область редактирования */}
        <div className="mb-4 flex justify-center">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={undefined}
            minWidth={50}
            minHeight={50}
          >
            <img
              ref={imgRef}
              src={imageUrl}
              alt="Редактируемое изображение"
              onLoad={onImageLoad}
              style={{
                transform: `rotate(${rotation}deg) scale(${scale})`,
                maxWidth: '600px',
                maxHeight: '400px'
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
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700"
          >
            <CheckIcon className="h-4 w-4 mr-1" />
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
