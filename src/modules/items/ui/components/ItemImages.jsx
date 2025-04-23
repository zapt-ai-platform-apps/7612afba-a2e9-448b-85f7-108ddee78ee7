import React from 'react';

export function ItemImages({ images }) {
  return (
    <div className="card overflow-hidden">
      <div className="aspect-w-16 aspect-h-9 bg-gray-200">
        <img 
          src={images[0]} 
          alt="Item primary"
          className="w-full object-contain h-64"
        />
      </div>
      
      {images.length > 1 && (
        <div className="card-body pt-4">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <div 
                key={index}
                className="w-24 h-24 flex-shrink-0 border border-gray-200 rounded overflow-hidden"
              >
                <img 
                  src={image} 
                  alt={`Item ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ItemImages;