import React, { useState } from 'react';
import { FaTimes, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const ImageGallery = ({ images, onRemove, readOnly = false }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);

  if (!images || images.length === 0) {
    return null;
  }

  const openImageViewer = (index) => {
    setActiveIndex(index);
    setViewerOpen(true);
  };

  const closeImageViewer = () => {
    setViewerOpen(false);
  };

  const goToNext = (e) => {
    e.stopPropagation();
    setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevious = (e) => {
    e.stopPropagation();
    setActiveIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div 
            key={index} 
            className="relative rounded-lg overflow-hidden border border-gray-200 hover:border-indigo-500 transition"
          >
            <div 
              className="h-32 w-full cursor-pointer"
              onClick={() => openImageViewer(index)}
            >
              <img
                src={typeof image === 'string' ? image : image.preview || image.url}
                alt={`Image ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
            {!readOnly && onRemove && (
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
              >
                <FaTimes size={12} />
              </button>
            )}
          </div>
        ))}
      </div>

      {viewerOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={closeImageViewer}
        >
          <button
            className="absolute top-4 right-4 text-white p-2 hover:bg-gray-800 rounded-full"
            onClick={closeImageViewer}
          >
            <FaTimes size={24} />
          </button>
          
          <button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white p-2 hover:bg-gray-800 rounded-full"
            onClick={goToPrevious}
          >
            <FaArrowLeft size={24} />
          </button>
          
          <div className="max-h-90vh max-w-90vw">
            <img
              src={typeof images[activeIndex] === 'string' ? images[activeIndex] : images[activeIndex].preview || images[activeIndex].url}
              alt={`Full view ${activeIndex + 1}`}
              className="max-h-[90vh] max-w-[90vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white p-2 hover:bg-gray-800 rounded-full"
            onClick={goToNext}
          >
            <FaArrowRight size={24} />
          </button>
          
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white">
            {activeIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;