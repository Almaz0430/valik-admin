/**
 * Компонент для загрузки изображений с возможностью предпросмотра и редактирования
 */
import React, { useState } from 'react';
import { PhotoIcon, XMarkIcon, PencilIcon } from '@heroicons/react/24/outline';
import ImageEditor from './ImageEditor';

interface FileUploaderProps {
  fileInputRef: React.RefObject<HTMLInputElement>;
  previewImages: string[];
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onEditImage?: (index: number, editedFile: File) => void;
  onPasteFiles?: (files: File[]) => void;
  error?: string;
  multiple?: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  fileInputRef,
  previewImages,
  onFileChange,
  onRemoveImage,
  onEditImage,
  onPasteFiles,
  error,
  multiple = true,
}) => {
  const [editingImage, setEditingImage] = useState<{
    index: number;
    url: string;
    fileName: string;
  } | null>(null);

  const handleEditImage = (index: number) => {
    const imageUrl = previewImages[index];
    const fileName = `image_${index + 1}.jpg`;
    setEditingImage({ index, url: imageUrl, fileName });
  };

  const handleSaveEditedImage = (editedFile: File) => {
    if (editingImage && onEditImage) {
      onEditImage(editingImage.index, editedFile);
    }
    setEditingImage(null);
  };

  const handleCancelEdit = () => {
    setEditingImage(null);
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    if (!onPasteFiles) return;

    const items = event.clipboardData?.items;
    if (!items) return;

    const files: File[] = [];

    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          files.push(file);
        }
      }
    }

    if (files.length > 0) {
      event.preventDefault();
      onPasteFiles(files);
    }
  };

  return (
    <div className="space-y-2" onPaste={handlePaste}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {previewImages.map((preview, index) => (
          <div key={index} className="relative aspect-square group">
            <img
              src={preview}
              alt={`Предпросмотр ${index + 1}`}
              className="w-full h-full object-cover rounded-lg border border-gray-200"
            />
            
            {/* Кнопки управления изображением */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex space-x-2">
                {onEditImage && (
                  <button
                    type="button"
                    onClick={() => handleEditImage(index)}
                    className="bg-blue-500 text-white rounded-full p-2 shadow-lg hover:bg-blue-600 transition-colors"
                    title="Редактировать изображение"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onRemoveImage(index)}
                  className="bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600 transition-colors"
                  title="Удалить изображение"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
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
          Вы можете загрузить несколько изображений в формате JPG, PNG, WebP. Наведите на изображение для редактирования.
        </p>
      )}

      {/* Модальное окно редактора изображений */}
      {editingImage && (
        <ImageEditor
          imageUrl={editingImage.url}
          fileName={editingImage.fileName}
          onSave={handleSaveEditedImage}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
};

export default FileUploader; 
