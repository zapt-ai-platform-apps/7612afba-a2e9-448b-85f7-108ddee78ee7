import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaArrowLeft, FaTag } from 'react-icons/fa';
import * as Sentry from '@sentry/browser';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import toast from 'react-hot-toast';

export default function ItemDetails() {
  const { itemId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would be an API call to fetch the item details
        // Simulating API call with timeout
        setTimeout(() => {
          // Mock item data based on the itemId
          const mockItem = {
            id: itemId,
            name: '1967 Chevrolet Camaro SS',
            description: 'Die-cast model of 1967 Chevrolet Camaro SS in mint condition with original packaging.',
            collectionId: '1',
            collectionName: 'Model Cars Collection',
            purchasePrice: 89.99,
            currentValue: 126.50,
            purchaseDate: new Date(2022, 5, 15).toISOString(),
            purchasePlace: 'Vintage Die-cast Convention',
            condition: 'Excellent',
            attributes: { 
              make: 'Chevrolet', 
              model: 'Camaro SS', 
              year: 1967, 
              scale: '1:18',
              color: 'Red',
              manufacturer: 'GMP',
              box_condition: 'Good',
              limited_edition: true,
              series: 'Muscle Car Classics'
            },
            images: [
              'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17a6e06bd75%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A15pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17a6e06bd75%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22107.1875%22%20y%3D%22107.0%22%3ECamaro Image 1%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
              'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17a6e06bd75%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A15pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17a6e06bd75%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22107.1875%22%20y%3D%22107.0%22%3ECamaro Image 2%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
              'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17a6e06bd75%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A15pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17a6e06bd75%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22107.1875%22%20y%3D%22107.0%22%3ECamaro Image 3%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E'
            ],
            forSale: false,
            askingPrice: null,
            createdAt: new Date(2022, 5, 15).toISOString(),
            updatedAt: new Date(2022, 5, 15).toISOString()
          };
          
          setItem(mockItem);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching item details:', error);
        Sentry.captureException(error);
        setLoading(false);
      }
    };
    
    fetchItemDetails();
  }, [itemId]);
  
  const handleDeleteItem = async () => {
    try {
      // In a real app, this would be an API call to delete the item
      // Simulating API call with timeout
      setTimeout(() => {
        toast.success('Item deleted successfully');
        navigate(`/collections/${item.collectionId}`);
      }, 1000);
    } catch (error) {
      console.error('Error deleting item:', error);
      Sentry.captureException(error);
      toast.error('Failed to delete item');
    }
  };
  
  const handleToggleForSale = async () => {
    try {
      // In a real app, this would be an API call to update the item
      setItem(prev => ({
        ...prev,
        forSale: !prev.forSale,
        askingPrice: !prev.forSale ? prev.currentValue : null
      }));
      
      toast.success(item.forSale ? 'Item removed from marketplace' : 'Item listed for sale');
    } catch (error) {
      console.error('Error updating item:', error);
      Sentry.captureException(error);
      toast.error('Failed to update item');
    }
  };
  
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!item) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Item not found</h2>
        <p className="text-gray-600 mb-4">The item you're looking for doesn't exist or you don't have permission to view it.</p>
        <Link to="/collections" className="btn btn-primary cursor-pointer">
          <FaArrowLeft className="mr-2" />
          Back to Collections
        </Link>
      </div>
    );
  }
  
  return (
    <div>
      {/* Item Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6 gap-4">
        <div className="flex items-start">
          <Link to={`/collections/${item.collectionId}`} className="mr-4 text-gray-500 hover:text-gray-700">
            <FaArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{item.name}</h1>
            <div className="flex items-center mt-1 mb-2">
              <Link to={`/collections/${item.collectionId}`} className="badge badge-blue mr-2">
                {item.collectionName}
              </Link>
              {item.forSale && (
                <span className="badge badge-green">For Sale: ${item.askingPrice}</span>
              )}
            </div>
            <p className="text-gray-600">{item.description}</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Link 
            to={`/items/${itemId}/edit`}
            className="btn btn-outline flex items-center cursor-pointer"
          >
            <FaEdit className="mr-2" />
            Edit
          </Link>
          
          <button 
            onClick={handleToggleForSale}
            className={`btn ${item.forSale ? 'btn-outline' : 'btn-secondary'} flex items-center cursor-pointer`}
          >
            {item.forSale ? (
              <>
                <FaTag className="mr-2" />
                Remove Listing
              </>
            ) : (
              <>
                <FaTag className="mr-2" />
                Sell Item
              </>
            )}
          </button>
          
          <button 
            onClick={() => setShowDeleteModal(true)}
            className="btn btn-outline flex items-center cursor-pointer"
          >
            <FaTrash className="mr-2 text-red-600" />
            Delete
          </button>
        </div>
      </div>
      
      {/* Item Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Item Images */}
        <div className="md:col-span-2">
          <div className="card overflow-hidden">
            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
              <img 
                src={item.images[0]} 
                alt={item.name}
                className="w-full object-contain h-64"
              />
            </div>
            
            {item.images.length > 1 && (
              <div className="card-body pt-4">
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {item.images.map((image, index) => (
                    <div 
                      key={index}
                      className="w-24 h-24 flex-shrink-0 border border-gray-200 rounded overflow-hidden"
                    >
                      <img 
                        src={image} 
                        alt={`${item.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Item Attributes */}
          <div className="card mt-6">
            <div className="card-header">
              Item Attributes
            </div>
            <div className="card-body">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(item.attributes).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-sm text-gray-500">{key.replace('_', ' ')}</p>
                    <p className="font-medium text-gray-900">{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Item Details Sidebar */}
        <div className="space-y-6">
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
          
          <div className="card">
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
        </div>
      </div>
      
      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Confirm Deletion</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{item.name}"? This action cannot be undone.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="btn btn-outline cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteItem}
                  className="btn btn-danger cursor-pointer"
                >
                  Delete Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}