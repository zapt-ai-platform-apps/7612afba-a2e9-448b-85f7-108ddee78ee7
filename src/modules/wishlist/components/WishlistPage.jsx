import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaSearch, FaSort, FaTrash, FaBell, FaBellSlash } from 'react-icons/fa';
import * as Sentry from '@sentry/browser';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import AddWishlistItemForm from './AddWishlistItemForm';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name'); // name, dateAdded, matches
  const [sortDirection, setSortDirection] = useState('asc'); // asc, desc
  
  useEffect(() => {
    const fetchWishlistItems = async () => {
      try {
        setLoading(true);
        
        // This would be replaced with an API call
        setTimeout(() => {
          const mockWishlistItems = [
            { 
              id: '1', 
              name: '1967 Corvette Stingray', 
              description: 'Scale model of a 1967 Corvette Stingray, preferably in red',
              type: { id: 1, name: 'Model Cars' },
              attributes: { make: 'Chevrolet', model: 'Corvette', year: 1967, scale: '1:18' },
              maxPrice: 150,
              createdAt: new Date(2023, 5, 10).toISOString(),
              matchCount: 3,
              notificationsEnabled: true
            },
            { 
              id: '2', 
              name: 'Charizard Holo 1st Edition', 
              description: 'Base set Charizard Holo 1st Edition card, PSA 8 or higher',
              type: { id: 2, name: 'Pokemon Cards' },
              attributes: { 
                card_name: 'Charizard', 
                set_name: 'Base Set', 
                card_number: '4/102', 
                rarity: 'Holo Rare',
                graded: true,
                grade: 'PSA 8+'
              },
              maxPrice: 10000,
              createdAt: new Date(2023, 4, 22).toISOString(),
              matchCount: 1,
              notificationsEnabled: true
            },
            { 
              id: '3', 
              name: 'LEGO Star Wars Millennium Falcon UCS', 
              description: 'Ultimate Collector Series Millennium Falcon (75192)',
              type: { id: 3, name: 'LEGO Sets' },
              attributes: { 
                set_number: '75192', 
                name: 'Millennium Falcon', 
                theme: 'Star Wars', 
                piece_count: 7541,
                year: 2017,
                minifigures: true
              },
              maxPrice: 900,
              createdAt: new Date(2023, 5, 5).toISOString(),
              matchCount: 2,
              notificationsEnabled: true
            },
            { 
              id: '4', 
              name: '1955 Double Die Lincoln Cent', 
              description: 'Looking for a 1955 Double Die Lincoln Cent in good condition',
              type: { id: 4, name: 'Coins' },
              attributes: { 
                country: 'USA', 
                denomination: 'One Cent', 
                year: 1955, 
                error_type: 'Double Die Obverse',
                grade: 'XF or better'
              },
              maxPrice: 2000,
              createdAt: new Date(2023, 3, 15).toISOString(),
              matchCount: 0,
              notificationsEnabled: true
            }
          ];
          
          setWishlistItems(mockWishlistItems);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching wishlist items:', error);
        Sentry.captureException(error);
        setLoading(false);
      }
    };
    
    fetchWishlistItems();
  }, [user]);
  
  const filteredItems = wishlistItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'name') {
      return sortDirection === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    } else if (sortBy === 'dateAdded') {
      return sortDirection === 'asc' 
        ? new Date(a.createdAt) - new Date(b.createdAt) 
        : new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === 'matches') {
      return sortDirection === 'asc' 
        ? a.matchCount - b.matchCount 
        : b.matchCount - a.matchCount;
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
  
  const handleDeleteItem = (id) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
    toast.success('Item removed from wishlist');
  };
  
  const toggleNotifications = (id) => {
    setWishlistItems(wishlistItems.map(item => 
      item.id === id 
        ? { ...item, notificationsEnabled: !item.notificationsEnabled } 
        : item
    ));
    
    const item = wishlistItems.find(item => item.id === id);
    if (item) {
      if (item.notificationsEnabled) {
        toast.success('Notifications disabled for this item');
      } else {
        toast.success('Notifications enabled for this item');
      }
    }
  };
  
  const handleSendNotifications = (item) => {
    // This would be an API call in a real app
    toast.success(`Notifications sent to ${item.matchCount} users with matching items`);
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
          <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600">
            {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} in your wishlist
          </p>
        </div>
        
        <button 
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary flex items-center cursor-pointer"
        >
          <FaPlus className="mr-2" />
          Add to Wishlist
        </button>
      </header>
      
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Add to Wishlist</h2>
              <AddWishlistItemForm 
                onClose={() => setShowAddForm(false)} 
                onSuccess={(newItem) => {
                  setWishlistItems([...wishlistItems, newItem]);
                  setShowAddForm(false);
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
            className="form-input pl-10 box-border"
            placeholder="Search wishlist..."
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
              <option value="dateAdded">Date Added</option>
              <option value="matches">Matches</option>
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
      
      {/* Wishlist Items */}
      {sortedItems.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
          {searchQuery ? (
            <p className="text-gray-600">Try adjusting your search query or add new items to your wishlist.</p>
          ) : (
            <p className="text-gray-600">Start by adding items you're looking for.</p>
          )}
          <button 
            onClick={() => setShowAddForm(true)}
            className="mt-4 btn btn-primary inline-flex items-center cursor-pointer"
          >
            <FaPlus className="mr-2" />
            Add to Wishlist
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedItems.map(item => (
            <div key={item.id} className="card hover-card">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
                    <div className="flex items-center mb-2">
                      <span className="badge badge-blue mr-2">{item.type.name}</span>
                      <span className="badge badge-green">${item.maxPrice.toLocaleString()} max</span>
                    </div>
                    <p className="text-gray-600 mb-3">{item.description}</p>
                    
                    {/* Attributes */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {Object.entries(item.attributes).map(([key, value]) => (
                        <div key={key} className="text-sm">
                          <span className="text-gray-500">{key.replace('_', ' ')}:</span> {value.toString()}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <button 
                      onClick={() => toggleNotifications(item.id)}
                      className={`p-2 rounded-full ${
                        item.notificationsEnabled 
                          ? 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200' 
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      } cursor-pointer`}
                      title={item.notificationsEnabled ? 'Disable notifications' : 'Enable notifications'}
                    >
                      {item.notificationsEnabled ? <FaBell /> : <FaBellSlash />}
                    </button>
                    
                    <button 
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 cursor-pointer"
                      title="Remove from wishlist"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                  <div>
                    {item.matchCount > 0 ? (
                      <div className="text-green-600 font-medium">
                        {item.matchCount} matching item{item.matchCount !== 1 ? 's' : ''} found!
                      </div>
                    ) : (
                      <div className="text-gray-500">No matches found yet</div>
                    )}
                  </div>
                  
                  <div>
                    {item.matchCount > 0 && (
                      <button 
                        onClick={() => handleSendNotifications(item)}
                        className="btn btn-primary btn-sm cursor-pointer"
                      >
                        Send Interest Notification
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}