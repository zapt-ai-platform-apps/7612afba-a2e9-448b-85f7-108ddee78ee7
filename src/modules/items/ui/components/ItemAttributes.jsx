import React from 'react';

export function ItemAttributes({ attributes }) {
  return (
    <div className="card mt-6">
      <div className="card-header">
        Item Attributes
      </div>
      <div className="card-body">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(attributes).map(([key, value]) => (
            <div key={key}>
              <p className="text-sm text-gray-500">{key.replace('_', ' ')}</p>
              <p className="font-medium text-gray-900">{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ItemAttributes;