import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaSort, FaSearch } from 'react-icons/fa';
import * as Sentry from '@sentry/browser';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import toast from 'react-hot-toast';

export default function CollectionDetails() {
  const { collectionId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [collection, setCollection] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name'); // name, value, dateAdded
  const [sortDirection, setSortDirection] = useState('asc'); // asc, desc
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  useEffect(() => {
    const fetchCollectionDetails = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would be an API call to fetch the collection details
        // Simulating API call with timeout
        setTimeout(() => {
          // Mock collection data based on the collectionId
          const mockCollection = {
            id: collectionId,
            name: 'Model Cars Collection',
            description: 'My collection of scale model cars from various manufacturers',
            typeId: 1,
            typeName: 'Model Cars',
            itemCount: 12,
            totalValue: '1575.00',
            coverImage: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17a6e06bd75%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A15pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17a6e06bd75%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22107.1875%22%20y%3D%22107.0%22%3EModel Cars%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
            isPrivate: false,
            createdAt: new Date(2023, 2, 15).toISOString(),
            updatedAt: new Date(2023, 5, 10).toISOString()
          };
          
          // Mock items in this collection
          const mockItems = [
            { 
              id: '1', 
              name: '1967 Chevrolet Camaro SS', 
              description: 'Die-cast model of 1967 Chevrolet Camaro SS', 
              purchasePrice: 89.99,
              currentValue: 126.50,
              condition: 'Excellent',
              attributes: { 
                make: 'Chevrolet', 
                model: 'Camaro SS', 
                year: 1967, 
                scale: '1:18',
                color: 'Red',
                manufacturer: 'GMP'
              },
              images: ['data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17a6e06bd75%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A15pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17a6e06bd75%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22107.1875%22%20y%3D%22107.0%22%3ECamaro%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E'],
              forSale: false,
              purchaseDate: new Date(2022, 5, 15).toISOString(),
              createdAt: new Date(2022, 5, 15).toISOString(),
              updatedAt: new Date(2022, 5, 15).toISOString()
            },
            { 
              id: '2', 
              name: '1965 Shelby Cobra 427 S/C', 
              description: 'Highly detailed replica of the classic Shelby Cobra', 
              purchasePrice: 135.00,
              currentValue: 175.00,
              condition: 'Mint',
              attributes: { 
                make: 'Shelby', 
                model: 'Cobra 427 S/C', 
                year: 1965, 
                scale: '1:18',
                color: 'Blue with white stripes',
                manufacturer: 'Exoto'
              },
              images: ['data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17a6e06bd75%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A15pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17a6e06bd75%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22107.1875%22%20y%3D%22107.0%22%3ECobra%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E'],
              forSale: true,
              askingPrice: 175.00,
              purchaseDate: new Date(2021, 10, 3).toISOString(),
              createdAt: new Date(2021, 10, 3).toISOString(),
              updatedAt: new Date(2023, 2, 15).toISOString()
            },
            { 
              id: '3', 
              name: '1957 Chevrolet Bel Air', 
              description: 'Classic 1957 Chevy Bel Air in turquoise and white', 
              purchasePrice: 45.99,
              currentValue: 62.75,
              condition: 'Good',
              attributes: { 
                make: 'Chevrolet', 
                model: 'Bel Air', 
                year: 1957, 
                scale: '1:24',
                color: 'Turquoise/White',
                manufacturer: 'Danbury Mint'
              },
              images: ['data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17a6e06bd75%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A15pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17a6e06bd75%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22107.1875%22%20y%3D%22107.0%22%3EBel Air%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E'],
              forSale: false,
              purchaseDate: new Date(2020, 7, 22).toISOString(),
              createdAt: new Date(2020, 7, 22).toISOString(),
              updatedAt: new Date(2020, 7, 22).toISOString()
            },
          ];
          
          setCollection(mockCollection);
          setItems(mockItems);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching collection details:', error);
        Sentry.captureException(error);
        setLoading(false);
      }
    };
    
    fetchCollectionDetails();
  }, [collectionId]);
  
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'name') {
      return sortDirection === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    } else if (sortBy === 'value') {
      return sortDirection === 'asc' 
        ? a.currentValue - b.currentValue 
        : b.currentValue - a.currentValue;
    } else if (sortBy === 'dateAdded') {
      return sortDirection === 'asc' 
        ? new Date(a.createdAt) - new Date(b.createdAt) 
        : new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });
  
  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortDirection('asc');
    }
  };
  
  const handleDeleteCollection = async () => {
    try {
      // In a real app, this would be an API call to delete the collection
      // Simulating API call with timeout
      setTimeout(() => {
        toast.success('Collection deleted successfully');
        navigate('/collections');
      }, 1000);
    } catch (error) {
      console.error('Error deleting collection:', error);
      Sentry.captureException(error);
      toast.error('Failed to delete collection');
    }
  };
  
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!collection) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Collection not found</h2>
        <p className="text-gray-600 mb-4">The collection you're looking for doesn't exist or you don't have permission to view it.</p>
        <Link to="/collections" className="btn btn-primary cursor-pointer">
          <FaArrowLeft className="mr-2" />
          Back to Collections
        </Link>
      </div>
    );
  }
  
  return (
    <div>
      {/* Collection Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start">
          <Link to="/collections" className="mr-4 text-gray-500 hover:text-gray-700">
            <FaArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{collection.name}</h1>
            <div className="flex items-center mt-1 mb-2">
              <span className="badge badge-blue mr-2">{collection.typeName}</span>
              {collection.isPrivate && (
                <span className="badge badge-gray">Private</span>
              )}
            </div>
            <p className="text-gray-600">{collection.description}</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Link 
            to={`/collections/${collectionId}/add-item`}
            className="btn btn-primary flex items-center cursor-pointer"
          >
            <FaPlus className="mr-2" />
            Add Item
          </Link>
          
          <div className="relative group">
            <button 
              className="btn btn-outline flex items-center cursor-pointer"
              onClick={() => setShowDeleteModal(true)}
            >
              <FaTrash className="mr-2 text-red-600" />
              Delete
            </button>
          </div>
        </div>
      </div>
      
      {/* Collection Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 card">
          <div className="card-body">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Collection Summary</h2>
              <p className="text-gray-600 mb-4">{collection.description}</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Items</p>
                  <p className="text-lg font-semibold text-gray-900">{collection.itemCount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Value</p>
                  <p className="text-lg font-semibold text-gray-900">${parseFloat(collection.totalValue).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(collection.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card overflow-hidden">
          <div className="aspect-w-16 aspect-h-9 bg-gray-200">
            <img 
              src={collection.coverImage} 
              alt={collection.name}
              className="w-full h-48 object-cover object-center"
            />
          </div>
          <div className="card-body">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">Cover Image</h3>
              <Link 
                to="#" 
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Change
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Items List */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Items in this Collection</h2>
          <Link 
            to={`/collections/${collectionId}/add-item`}
            className="text-indigo-600 hover:text-indigo-500 flex items-center"
          >
            <FaPlus className="mr-1" />
            Add Item
          </Link>
        </div>
        
        {/* Search and Sort Controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-grow max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              className="form-input pl-10 box-border"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">Sort by:</span>
            <div className="relative">
              <select
                className="form-input pr-10 appearance-none box-border cursor-pointer"
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <option value="name">Name</option>
                <option value="value">Value</option>
                <option value="dateAdded">Date Added</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <FaSort className="text-gray-400" />
              </div>
            </div>
            
            <button
              className="ml-2 p-2 text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
              title={sortDirection === 'asc' ? 'Sort Ascending' : 'Sort Descending'}
            >
              {sortDirection === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
        
        {/* Items Grid */}
        {sortedItems.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items in this collection yet</h3>
            {searchQuery ? (
              <p className="text-gray-600">Try adjusting your search query or add new items to your collection.</p>
            ) : (
              <p className="text-gray-600">Start by adding your first item to this collection.</p>
            )}
            <Link 
              to={`/collections/${collectionId}/add-item`}
              className="mt-4 btn btn-primary inline-flex items-center cursor-pointer"
            >
              <FaPlus className="mr-2" />
              Add Item
            </Link>
          </div>
        ) : (
          <div className="grid-items">
            {sortedItems.map(item => (
              <Link 
                key={item.id} 
                to={`/items/${item.id}`}
                className="card hover-card overflow-hidden"
              >
                <div className="h-48 bg-gray-200 relative">
                  <img 
                    src={item.images[0]} 
                    alt={item.name}
                    className="w-full h-full object-cover object-center"
                  />
                  {item.forSale && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      For Sale: ${item.askingPrice}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Value</span>
                    <span className="font-semibold text-gray-900">${item.currentValue.toFixed(2)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      
      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Confirm Deletion</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete the collection "{collection.name}"? This action cannot be undone and will delete all {collection.itemCount} items in this collection.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="btn btn-outline cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteCollection}
                  className="btn btn-danger cursor-pointer"
                >
                  Delete Collection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}