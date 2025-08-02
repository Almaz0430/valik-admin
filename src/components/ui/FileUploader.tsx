/**
 * Компонент для загрузки изображений с возможностью предпросмотра
 */
import React from 'react';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface FileUploaderProps {
  fileInputRef: React.RefObject<HTMLInputElement>;
  previewImages: string[];
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  error?: string;
  multiple?: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  fileInputRef,
  previewImages,
  onFileChange,
  onRemoveImage,
  error,
  multiple = true,
}) => {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {previewImages.map((preview, index) => (
          <div key={index} className="relative aspect-square">
            <img
              src={preview}
              alt={`Предпросмотр ${index + 1}`}
              className="w-full h-full object-cover rounded-lg border border-gray-200"
            />
            <button
              type="button"
              onClick={() => onRemoveImage(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition-colors"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-full min-h-[120px] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 transition-colors text-gray-500 hover:text-orange-600"
        >
          <PhotoIcon className="h-12 w-12" />
          <span className="mt-3 text-sm text-center font-medium">Добавить фото</span>
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        accept="image/*"
        multiple={multiple}
        className="hidden"
      />

      {error ? (
        <p className="text-xs text-red-500">{error}</p>
      ) : (
        <p className="text-xs text-gray-500">
          Вы можете загрузить несколько изображений в формате JPG, PNG, WebP.
        </p>
      )}
    </div>
  );
};

export default FileUploader; 