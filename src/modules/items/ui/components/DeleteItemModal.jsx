import React from 'react';

export function DeleteItemModal({ 
  isOpen,
  itemName,
  onCancel,
  onConfirm 
}) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Confirm Deletion</h2>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete "{itemName}"? This action cannot be undone.
          </p>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="btn btn-outline cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="btn btn-danger cursor-pointer"
            >
              Delete Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteItemModal;