import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaSort, FaFilter, FaShoppingCart } from 'react-icons/fa';
import * as Sentry from '@sentry/browser';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import toast from 'react-hot-toast';

export default function MarketplacePage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recentlyAdded'); // recentlyAdded, priceLow, priceHigh
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);
  const [collectionTypes, setCollectionTypes] = useState([]);
  
  useEffect(() => {
    const fetchMarketplaceItems = async () => {
      try {
        setLoading(true);
        
        // This would be an API call in a real app
        // Simulating API call with timeout
        setTimeout(() => {
          const mockTypes = [
            { id: 1, name: 'Model Cars' },
            { id: 2, name: 'Pokemon Cards' },
            { id: 3, name: 'LEGO Sets' },
            { id: 4, name: 'Coins' },
            { id: 5, name: 'Stamps' }
          ];
          
          setCollectionTypes(mockTypes);
          
          const mockItems = [
            { 
              id: '1', 
              name: '1967 Chevrolet Camaro SS', 
              description: 'Die-cast model in excellent condition',
              type: { id: 1, name: 'Model Cars' },
              sellerId: 'user1',
              sellerName: 'JohnCollector',
              sellerRating: 4.8,
              condition: 'Excellent',
              askingPrice: 126.50,
              images: ['data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17a6e06bd75%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A15pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17a6e06bd75%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22107.1875%22%20y%3D%22107.0%22%3ECamaro%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E'],
              attributes: { make: 'Chevrolet', model: 'Camaro SS', year: 1967, scale: '1:18' },
              listedDate: new Date(2023, 5, 15).toISOString()
            },
            { 
              id: '2', 
              name: 'Charizard Holo 1st Edition', 
              description: 'Base set Charizard, PSA 8 graded',
              type: { id: 2, name: 'Pokemon Cards' },
              sellerId: 'user2',
              sellerName: 'PokeMaster',
              sellerRating: 4.9,
              condition: 'Near Mint',
              askingPrice: 8500.00,
              images: ['data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17a6e06bd75%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A15pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17a6e06bd75%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22107.1875%22%20y%3D%22107.0%22%3ECharizard%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E'],
              attributes: { card_name: 'Charizard', set_name: 'Base Set', rarity: 'Holo Rare', grade: 'PSA 8' },
              listedDate: new Date(2023, 5, 20).toISOString()
            },
            { 
              id: '3', 
              name: 'LEGO Star Wars Millennium Falcon UCS', 
              description: 'Unopened box, UCS Millennium Falcon 75192',
              type: { id: 3, name: 'LEGO Sets' },
              sellerId: 'user3',
              sellerName: 'BrickFanatic',
              sellerRating: 4.7,
              condition: 'Mint',
              askingPrice: 899.99,
              images: ['data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17a6e06bd75%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A15pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17a6e06bd75%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22107.1875%22%20y%3D%22107.0%22%3EFalcon%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E'],
              attributes: { set_number: '75192', theme: 'Star Wars', piece_count: 7541 },
              listedDate: new Date(2023, 4, 10).toISOString()
            },
            { 
              id: '4', 
              name: '1955 Double Die Lincoln Cent', 
              description: 'Rare 1955 penny with double die error',
              type: { id: 4, name: 'Coins' },
              sellerId: 'user4',
              sellerName: 'CoinCollector',
              sellerRating: 4.9,
              condition: 'Good',
              askingPrice: 1895.00,
              images: ['data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17a6e06bd75%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A15pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17a6e06bd75%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22107.1875%22%20y%3D%22107.0%22%3ECoin%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E'],
              attributes: { country: 'USA', denomination: 'One Cent', year: 1955, error_type: 'Double Die Obverse' },
              listedDate: new Date(2023, 5, 25).toISOString()
            },
            { 
              id: '5', 
              name: 'Inverted Jenny Stamp', 
              description: 'Replica of the famous Inverted Jenny stamp error',
              type: { id: 5, name: 'Stamps' },
              sellerId: 'user5',
              sellerName: 'PhilatelySage',
              sellerRating: 4.6,
              condition: 'Excellent',
              askingPrice: 275.00,
              images: ['data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17a6e06bd75%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A15pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17a6e06bd75%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22107.1875%22%20y%3D%22107.0%22%3EStamp%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E'],
              attributes: { country: 'USA', year: 1918, denomination: '24 cents', errors: 'Inverted plane' },
              listedDate: new Date(2023, 5, 1).toISOString()
            },
          ];
          
          setItems(mockItems);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching marketplace items:', error);
        Sentry.captureException(error);
        setLoading(false);
      }
    };
    
    fetchMarketplaceItems();
  }, [user]);
  
  const filteredItems = items.filter(item => {
    // Text search
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Type filter
    const matchesType = selectedType === 'all' || item.type.id === parseInt(selectedType);
    
    // Condition filter
    const matchesCondition = selectedCondition === 'all' || item.condition === selectedCondition;
    
    // Price range
    const matchesPrice = 
      item.askingPrice >= priceRange[0] && 
      item.askingPrice <= priceRange[1];
    
    return matchesSearch && matchesType && matchesCondition && matchesPrice;
  });
  
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'recentlyAdded') {
      return new Date(b.listedDate) - new Date(a.listedDate);
    } else if (sortBy === 'priceLow') {
      return a.askingPrice - b.askingPrice;
    } else if (sortBy === 'priceHigh') {
      return b.askingPrice - a.askingPrice;
    }
    return 0;
  });
  
  const handlePriceRangeChange = (index, value) => {
    const newRange = [...priceRange];
    newRange[index] = Number(value);
    setPriceRange(newRange);
  };
  
  const handleContact = (item) => {
    toast.success(`Contact request sent to ${item.sellerName}`);
  };
  
  const handlePurchase = (item) => {
    toast.success(`Purchase request sent for ${item.name}`);
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
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
        <p className="text-gray-600">
          Browse and purchase items from other collectors
        </p>
      </header>
      
      {/* Search and Filter Controls */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="relative flex-grow max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              className="form-input pl-10 box-border"
              placeholder="Search marketplace..."
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
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recentlyAdded">Recently Added</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <FaSort className="text-gray-400" />
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-outline flex items-center cursor-pointer"
          >
            <FaFilter className="mr-2" />
            Filters
          </button>
        </div>
        
        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="form-label">Type</label>
                <select
                  className="form-input box-border"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  {collectionTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="form-label">Condition</label>
                <select
                  className="form-input box-border"
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                >
                  <option value="all">All Conditions</option>
                  <option value="Mint">Mint</option>
                  <option value="Near Mint">Near Mint</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>
              
              <div>
                <label className="form-label">Price Range</label>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                    <input
                      type="number"
                      className="form-input pl-7 box-border"
                      placeholder="Min"
                      min="0"
                      value={priceRange[0]}
                      onChange={(e) => handlePriceRangeChange(0, e.target.value)}
                    />
                  </div>
                  <span>to</span>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                    <input
                      type="number"
                      className="form-input pl-7 box-border"
                      placeholder="Max"
                      min={priceRange[0]}
                      value={priceRange[1]}
                      onChange={(e) => handlePriceRangeChange(1, e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Marketplace Items */}
      {sortedItems.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
          {searchQuery || selectedType !== 'all' || selectedCondition !== 'all' ? (
            <p className="text-gray-600">Try adjusting your search filters.</p>
          ) : (
            <p className="text-gray-600">There are no items currently for sale in the marketplace.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedItems.map(item => (
            <div key={item.id} className="card hover-card">
              <div className="h-48 bg-gray-200 relative">
                <img 
                  src={item.images[0]} 
                  alt={item.name}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  ${item.askingPrice.toLocaleString()}
                </div>
              </div>
              <div className="card-body">
                <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
                <div className="flex items-center mb-2">
                  <span className="badge badge-blue mr-2">{item.type.name}</span>
                  <span className="badge badge-gray">{item.condition}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                
                <div className="flex items-center mb-4">
                  <span className="text-sm text-gray-600 mr-2">Seller: {item.sellerName}</span>
                  <div className="flex items-center text-yellow-500">
                    <span className="text-sm text-gray-800 ml-1">{item.sellerRating}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 mb-4">
                  Listed {new Date(item.listedDate).toLocaleDateString()}
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleContact(item)}
                    className="btn btn-outline flex-1 text-sm py-1 cursor-pointer"
                  >
                    Contact Seller
                  </button>
                  <button 
                    onClick={() => handlePurchase(item)}
                    className="btn btn-primary flex-1 text-sm py-1 flex items-center justify-center cursor-pointer"
                  >
                    <FaShoppingCart className="mr-1" />
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}