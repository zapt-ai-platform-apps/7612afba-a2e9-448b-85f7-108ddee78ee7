import React from 'react';

export function ItemPurchaseDetails({ item }) {
  return (
    <div className="card mt-6">
      <div className="card-header">
        Purchase Details
      </div>
      <div className="card-body">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Purchase Date</p>
            <p className="font-medium text-gray-900">
              {item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString() : 'Not specified'}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Purchase Location</p>
            <p className="font-medium text-gray-900">{item.purchasePlace || 'Not specified'}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Condition</p>
            <p className="font-medium text-gray-900">{item.condition || 'Not specified'}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Added to Collection</p>
            <p className="font-medium text-gray-900">{new Date(item.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemPurchaseDetails;