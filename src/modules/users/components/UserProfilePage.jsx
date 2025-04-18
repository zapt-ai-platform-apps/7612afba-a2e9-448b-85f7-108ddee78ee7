import React, { useState, useEffect } from 'react';
import { FaEdit, FaEnvelope, FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import * as Sentry from '@sentry/browser';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import toast from 'react-hot-toast';

export default function UserProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [collections, setCollections] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [transactions, setTransactions] = useState([]);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would be an API call
        // Simulating API call with timeout
        setTimeout(() => {
          // Mock profile data
          const mockProfile = {
            id: user.id,
            email: user.email,
            firstName: 'John',
            lastName: 'Collector',
            location: 'San Francisco, CA',
            profilePicture: null,
            averageRating: 4.8,
            ratingCount: 15,
            totalCollections: 5,
            totalItems: 145,
            memberSince: new Date(2022, 0, 15).toISOString()
          };
          
          // Mock collections data
          const mockCollections = [
            { id: '1', name: 'Model Cars', itemCount: 12, totalValue: 1575.00, coverImage: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17a6e06bd75%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A15pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17a6e06bd75%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22107.1875%22%20y%3D%22107.0%22%3EModel Cars%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E' },
            { id: '2', name: 'Pokemon Cards', itemCount: 78, totalValue: 12460.00, coverImage: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17a6e06bd75%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A15pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17a6e06bd75%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22107.1875%22%20y%3D%22107.0%22%3EPokemon Cards%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E' },
            { id: '3', name: 'LEGO Sets', itemCount: 8, totalValue: 3250.00, coverImage: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17a6e06bd75%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A15pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17a6e06bd75%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22107.1875%22%20y%3D%22107.0%22%3ELEGO Sets%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E' }
          ];
          
          // Mock feedback
          const mockFeedback = [
            { id: '1', fromUser: { name: 'Alice Smith' }, rating: 5, comment: 'Great collector, fast payment and excellent communication!', createdAt: new Date(2023, 4, 15).toISOString() },
            { id: '2', fromUser: { name: 'Bob Johnson' }, rating: 5, comment: 'Smooth transaction, item was exactly as described.', createdAt: new Date(2023, 3, 22).toISOString() },
            { id: '3', fromUser: { name: 'Carol Williams' }, rating: 4, comment: 'Good experience overall, would trade with again.', createdAt: new Date(2023, 2, 10).toISOString() }
          ];
          
          // Mock transactions
          const mockTransactions = [
            { id: '1', type: 'purchase', item: { name: 'Charizard Holo 1st Edition' }, otherParty: { name: 'PokeMaster' }, amount: 8500.00, status: 'completed', createdAt: new Date(2023, 5, 10).toISOString() },
            { id: '2', type: 'sale', item: { name: '1965 Shelby Cobra 427 S/C' }, otherParty: { name: 'CarCollector42' }, amount: 175.00, status: 'completed', createdAt: new Date(2023, 4, 5).toISOString() },
            { id: '3', type: 'purchase', item: { name: 'LEGO Star Wars Millennium Falcon UCS' }, otherParty: { name: 'BrickFanatic' }, amount: 899.99, status: 'pending', createdAt: new Date(2023, 5, 25).toISOString() }
          ];
          
          setProfile(mockProfile);
          setCollections(mockCollections);
          setFeedback(mockFeedback);
          setTransactions(mockTransactions);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching user data:', error);
        Sentry.captureException(error);
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user]);
  
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile not found</h2>
        <p className="text-gray-600 mb-4">We couldn't load your profile data. Please try again later.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="card">
        <div className="card-body">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center text-white text-3xl">
              {profile.firstName?.charAt(0) || profile.email.charAt(0).toUpperCase()}
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div className="text-center md:text-left">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {profile.firstName && profile.lastName
                      ? `${profile.firstName} ${profile.lastName}`
                      : profile.email.split('@')[0]}
                  </h1>
                  
                  <div className="flex flex-col md:flex-row gap-2 md:gap-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center justify-center md:justify-start">
                      <FaEnvelope className="mr-1 text-gray-400" />
                      <span>{profile.email}</span>
                    </div>
                    
                    {profile.location && (
                      <div className="flex items-center justify-center md:justify-start">
                        <FaMapMarkerAlt className="mr-1 text-gray-400" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0">
                  <a
                    href="/settings"
                    className="btn btn-outline inline-flex items-center cursor-pointer"
                  >
                    <FaEdit className="mr-2" />
                    Edit Profile
                  </a>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">{profile.totalCollections}</div>
                  <div className="text-sm text-gray-600">Collections</div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">{profile.totalItems}</div>
                  <div className="text-sm text-gray-600">Items</div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900 mr-1">{profile.averageRating.toFixed(1)}</span>
                    <FaStar className="text-yellow-500" />
                  </div>
                  <div className="text-sm text-gray-600">{profile.ratingCount} Ratings</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* User Collections */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Collections</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map(collection => (
            <a 
              key={collection.id}
              href={`/collections/${collection.id}`}
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
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">{collection.itemCount} items</div>
                  <div className="font-medium text-gray-900">${parseFloat(collection.totalValue).toLocaleString()}</div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
      
      {/* Recent Transactions */}
      {transactions.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Transactions</h2>
          
          <div className="card">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Other Party</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map(transaction => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.type === 'purchase' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {transaction.type === 'purchase' ? 'Purchase' : 'Sale'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {transaction.item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.otherParty.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${transaction.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {/* Feedback and Ratings */}
      {feedback.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Feedback and Ratings</h2>
          
          <div className="space-y-4">
            {feedback.map(item => (
              <div key={item.id} className="card">
                <div className="card-body">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center">
                      <div className="mr-2">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-700">
                          {item.fromUser.name.charAt(0)}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{item.fromUser.name}</div>
                        <div className="text-sm text-gray-600">{new Date(item.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="text-yellow-500 flex">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={i < item.rating ? 'text-yellow-500' : 'text-gray-300'} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700">{item.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}