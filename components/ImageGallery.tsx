import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  altText: string;
  onClose: () => void;
}

export default function ImageGallery({ images, altText, onClose }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'Escape') onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-95 z-[9999] flex items-center justify-center"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors z-10"
        aria-label="Close gallery"
      >
        <X className="w-8 h-8" />
      </button>

      {/* Image Counter */}
      <div className="absolute top-6 left-6 text-white text-lg font-medium">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Main Image */}
      <div
        className="relative max-w-7xl max-h-[90vh] w-full px-20"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={images[currentIndex]}
          alt={`${altText} - Image ${currentIndex + 1}`}
          className="w-full h-full object-contain rounded-lg"
        />

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all backdrop-blur-sm"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all backdrop-blur-sm"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-black bg-opacity-50 p-3 rounded-lg backdrop-blur-sm">
          {images.map((image, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              className={`w-16 h-16 rounded overflow-hidden transition-all ${
                idx === currentIndex
                  ? 'ring-2 ring-white scale-110'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={image}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Thumbnail Grid Component
interface ImageThumbnailGridProps {
  images: string[];
  altText: string;
  onImageClick: (index: number) => void;
}

export function ImageThumbnailGrid({ images, altText, onImageClick }: ImageThumbnailGridProps) {
  if (images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div
        className="w-full h-64 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => onImageClick(0)}
      >
        <img src={images[0]} alt={altText} className="w-full h-full object-cover" />
      </div>
    );
  }

  if (images.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-2 h-64">
        {images.map((image, idx) => (
          <div
            key={idx}
            className="rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => onImageClick(idx)}
          >
            <img src={image} alt={`${altText} ${idx + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    );
  }

  if (images.length === 3) {
    return (
      <div className="grid grid-cols-2 gap-2 h-64">
        <div
          className="rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => onImageClick(0)}
        >
          <img src={images[0]} alt={`${altText} 1`} className="w-full h-full object-cover" />
        </div>
        <div className="grid grid-rows-2 gap-2">
          {images.slice(1).map((image, idx) => (
            <div
              key={idx}
              className="rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => onImageClick(idx + 1)}
            >
              <img src={image} alt={`${altText} ${idx + 2}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 4+ images
  return (
    <div className="grid grid-cols-2 gap-2 h-64">
      <div
        className="rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => onImageClick(0)}
      >
        <img src={images[0]} alt={`${altText} 1`} className="w-full h-full object-cover" />
      </div>
      <div className="grid grid-rows-2 gap-2">
        {images.slice(1, 3).map((image, idx) => (
          <div
            key={idx}
            className="rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => onImageClick(idx + 1)}
          >
            <img src={image} alt={`${altText} ${idx + 2}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
      {images.length > 4 && (
        <div
          className="col-span-2 h-20 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity relative"
          onClick={() => onImageClick(3)}
        >
          <img src={images[3]} alt={`${altText} 4`} className="w-full h-full object-cover" />
          {images.length > 4 && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-white text-2xl font-bold">
              +{images.length - 4} more
            </div>
          )}
        </div>
      )}
    </div>
  );
}
