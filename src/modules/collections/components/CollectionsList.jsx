import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaSort, FaSearch } from 'react-icons/fa';
import * as Sentry from '@sentry/browser';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import CreateCollectionForm from './CreateCollectionForm';

export default function CollectionsList() {
  const { user } = useAuth();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name'); // name, itemCount, recentlyUpdated
  const [sortDirection, setSortDirection] = useState('asc'); // asc, desc
  
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        
        // This would be an API call in the real app
        // Simulating API call with timeout
        setTimeout(() => {
          const mockCollections = [
            { 
              id: '1', 
              name: 'Model Cars', 
              typeId: 1,
              typeName: 'Model Cars',
              description: 'My collection of scale model cars',
              itemCount: 12,
              totalValue: '1575.00',
              coverImage: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17a6e06bd75%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A15pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17a6e06bd75%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22107.1875%22%20y%3D%22107.0%22%3EModel Cars%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
              updatedAt: new Date(2023, 4, 15).toISOString()
            },
            { 
              id: '2', 
              name: 'Pokemon Cards', 
              typeId: 2,
              typeName: 'Pokemon Cards',
              description: 'Pokemon trading card collection',
              itemCount: 78,
              totalValue: '12460.00',
              coverImage: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17a6e06bd75%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A15pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17a6e06bd75%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22107.1875%22%20y%3D%22107.0%22%3EPokemon Cards%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
              updatedAt: new Date(2023, 5, 2).toISOString()
            },
            { 
              id: '3', 
              name: 'LEGO Sets', 
              typeId: 3,
              typeName: 'LEGO Sets',
              description: 'Star Wars and Harry Potter LEGO sets',
              itemCount: 8,
              totalValue: '3250.00',
              coverImage: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17a6e06bd75%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A15pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17a6e06bd75%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22107.1875%22%20y%3D%22107.0%22%3ELEGO Sets%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
              updatedAt: new Date(2023, 4, 28).toISOString()
            },
            { 
              id: '4', 
              name: 'Rare Coins', 
              typeId: 4,
              typeName: 'Coins',
              description: 'Numismatic collection of rare and historical coins',
              itemCount: 42,
              totalValue: '8750.00',
              coverImage: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17a6e06bd75%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A15pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17a6e06bd75%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22107.1875%22%20y%3D%22107.0%22%3ECoins%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
              updatedAt: new Date(2023, 3, 10).toISOString()
            },
            { 
              id: '5', 
              name: 'Postage Stamps', 
              typeId: 5,
              typeName: 'Stamps',
              description: 'Collection of rare and historical stamps',
              itemCount: 156,
              totalValue: '4200.00',
              coverImage: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17a6e06bd75%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A15pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17a6e06bd75%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22107.1875%22%20y%3D%22107.0%22%3EStamps%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
              updatedAt: new Date(2023, 5, 8).toISOString()
            }
          ];
          
          setCollections(mockCollections);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching collections:', error);
        Sentry.captureException(error);
        setLoading(false);
      }
    };
    
    fetchCollections();
  }, [user]);
  
  const filteredCollections = collections.filter(collection => 
    collection.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    collection.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const sortedCollections = [...filteredCollections].sort((a, b) => {
    if (sortBy === 'name') {
      return sortDirection === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    } else if (sortBy === 'itemCount') {
      return sortDirection === 'asc' 
        ? a.itemCount - b.itemCount 
        : b.itemCount - a.itemCount;
    } else if (sortBy === 'value') {
      return sortDirection === 'asc' 
        ? parseFloat(a.totalValue) - parseFloat(b.totalValue) 
        : parseFloat(b.totalValue) - parseFloat(a.totalValue);
    } else if (sortBy === 'recentlyUpdated') {
      return sortDirection === 'asc' 
        ? new Date(a.updatedAt) - new Date(b.updatedAt) 
        : new Date(b.updatedAt) - new Date(a.updatedAt);
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
  
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div>
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Collections</h1>
          <p className="text-gray-600">
            {collections.length} collection{collections.length !== 1 ? 's' : ''} with {collections.reduce((sum, collection) => sum + collection.itemCount, 0)} items
          </p>
        </div>
        
        <button 
          onClick={() => setShowCreateForm(true)}
          className="btn btn-primary flex items-center cursor-pointer"
        >
          <FaPlus className="mr-2" />
          New Collection
        </button>
      </header>
      
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Create New Collection</h2>
              <CreateCollectionForm 
                onClose={() => setShowCreateForm(false)} 
                onSuccess={(newCollection) => {
                  setCollections([...collections, newCollection]);
                  setShowCreateForm(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Search and Sort Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-grow max-w-md">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            className="form-input pl-10"
            placeholder="Search collections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center">
          <span className="text-gray-600 mr-2">Sort by:</span>
          <div className="relative">
            <select
              className="form-input pr-10 appearance-none cursor-pointer"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="name">Name</option>
              <option value="itemCount">Item Count</option>
              <option value="value">Value</option>
              <option value="recentlyUpdated">Recently Updated</option>
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <FaSort className="text-gray-400" />
            </div>
          </div>
          
          <button
            className="ml-2 p-2 text-gray-500 hover:text-gray-700"
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
            title={sortDirection === 'asc' ? 'Sort Ascending' : 'Sort Descending'}
          >
            {sortDirection === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>
      
      {/* Collections Grid */}
      {sortedCollections.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No collections found</h3>
          {searchQuery ? (
            <p className="text-gray-600">Try adjusting your search query or create a new collection.</p>
          ) : (
            <p className="text-gray-600">Start by creating your first collection.</p>
          )}
          <button 
            onClick={() => setShowCreateForm(true)}
            className="mt-4 btn btn-primary inline-flex items-center cursor-pointer"
          >
            <FaPlus className="mr-2" />
            Create Collection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCollections.map(collection => (
            <Link 
              key={collection.id} 
              to={`/collections/${collection.id}`}
              className="card hover-card overflow-hidden"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                <img 
                  src={collection.coverImage} 
                  alt={collection.name}
                  className="w-full h-48 object-cover object-center"
                />
              </div>
              <div className="card-body">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{collection.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{collection.description}</p>
                <div className="flex justify-between items-center">
                  <span className="badge badge-blue">{collection.typeName}</span>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">{collection.itemCount} items</div>
                    <div className="font-medium text-gray-900">${parseFloat(collection.totalValue).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}