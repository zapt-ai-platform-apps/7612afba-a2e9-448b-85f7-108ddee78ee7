import React from 'react';

export function ItemValueInfo({ item }) {
  return (
    <div className="card">
      <div className="card-header">
        Value Information
      </div>
      <div className="card-body">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Purchase Price</p>
            <p className="text-xl font-semibold text-gray-900">${item.purchasePrice?.toFixed(2)}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Current Value</p>
            <p className="text-xl font-semibold text-green-600">${item.currentValue?.toFixed(2)}</p>
            
            {item.purchasePrice && item.currentValue && (
              <div className="text-sm mt-1">
                {item.currentValue > item.purchasePrice ? (
                  <span className="text-green-600">
                    ↑ ${(item.currentValue - item.purchasePrice).toFixed(2)} ({((item.currentValue / item.purchasePrice - 1) * 100).toFixed(1)}%)
                  </span>
                ) : item.currentValue < item.purchasePrice ? (
                  <span className="text-red-600">
                    ↓ ${(item.purchasePrice - item.currentValue).toFixed(2)} ({((1 - item.currentValue / item.purchasePrice) * 100).toFixed(1)}%)
                  </span>
                ) : (
                  <span className="text-gray-500">No change</span>
                )}
              </div>
            )}
          </div>
          
          {item.forSale && (
            <div>
              <p className="text-sm text-gray-500">Asking Price</p>
              <p className="text-xl font-semibold text-blue-600">${item.askingPrice?.toFixed(2)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ItemValueInfo;