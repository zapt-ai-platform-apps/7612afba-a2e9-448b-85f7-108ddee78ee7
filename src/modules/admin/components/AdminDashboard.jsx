import React, { useState, useEffect } from 'react';
import { FaUsers, FaBoxOpen, FaShoppingCart, FaChartLine, FaUser, FaFlag, FaFileAlt, FaAd } from 'react-icons/fa';
import * as Sentry from '@sentry/browser';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: 0,
    collections: 0,
    items: 0,
    transactions: 0,
    revenue: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [reportedContent, setReportedContent] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Check if user is admin
  useEffect(() => {
    if (user && !user.email?.includes('admin')) {
      toast.error('You do not have permission to access this page');
      // In a real app, we would redirect to dashboard
    }
  }, [user]);
  
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        
        // This would be replaced with actual API calls
        // Simulating API call
        setTimeout(() => {
          setStats({
            users: 245,
            collections: 872,
            items: 12436,
            transactions: 126,
            revenue: 5489.75
          });
          
          setRecentUsers([
            { id: '1', email: 'user1@example.com', name: 'John Smith', joined: new Date(2023, 5, 20).toISOString(), collections: 5, items: 42 },
            { id: '2', email: 'user2@example.com', name: 'Alice Johnson', joined: new Date(2023, 5, 18).toISOString(), collections: 3, items: 27 },
            { id: '3', email: 'user3@example.com', name: 'Robert Davis', joined: new Date(2023, 5, 15).toISOString(), collections: 2, items: 18 },
            { id: '4', email: 'user4@example.com', name: 'Emily Wilson', joined: new Date(2023, 5, 12).toISOString(), collections: 4, items: 53 },
            { id: '5', email: 'user5@example.com', name: 'Michael Brown', joined: new Date(2023, 5, 10).toISOString(), collections: 1, items: 8 }
          ]);
          
          setReportedContent([
            { id: '1', type: 'item', name: 'Fake Pokemon Card', reportedBy: 'user2@example.com', reason: 'Counterfeit item', date: new Date(2023, 5, 19).toISOString() },
            { id: '2', type: 'user', name: 'scammer123', reportedBy: 'user4@example.com', reason: 'Suspicious behavior', date: new Date(2023, 5, 17).toISOString() },
            { id: '3', type: 'message', name: 'Inappropriate message', reportedBy: 'user1@example.com', reason: 'Harassment', date: new Date(2023, 5, 15).toISOString() }
          ]);
          
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching admin data:', error);
        Sentry.captureException(error);
        setLoading(false);
      }
    };
    
    fetchAdminData();
  }, []);
  
  const handleApproveContent = (id) => {
    setReportedContent(reportedContent.filter(item => item.id !== id));
    toast.success('Content approved and report dismissed');
  };
  
  const handleRemoveContent = (id) => {
    setReportedContent(reportedContent.filter(item => item.id !== id));
    toast.success('Content removed successfully');
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
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">
          Manage users, content, and site settings
        </p>
      </header>
      
      {/* Admin Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } cursor-pointer`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } cursor-pointer`}
          >
            User Management
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'content'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } cursor-pointer`}
          >
            Content Moderation
          </button>
          <button
            onClick={() => setActiveTab('ads')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'ads'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } cursor-pointer`}
          >
            Advertising
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'reports'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } cursor-pointer`}
          >
            Reports
          </button>
        </nav>
      </div>
      
      {/* Dashboard Stats */}
      {activeTab === 'overview' && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Platform Statistics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              icon={<FaUsers size={20} />}
              title="Total Users"
              value={stats.users.toLocaleString()}
              color="bg-blue-100 text-blue-600"
            />
            
            <StatCard 
              icon={<FaBoxOpen size={20} />}
              title="Collections"
              value={stats.collections.toLocaleString()}
              color="bg-indigo-100 text-indigo-600"
            />
            
            <StatCard 
              icon={<FaBoxOpen size={20} />}
              title="Items"
              value={stats.items.toLocaleString()}
              color="bg-purple-100 text-purple-600"
            />
            
            <StatCard 
              icon={<FaShoppingCart size={20} />}
              title="Transactions"
              value={stats.transactions.toLocaleString()}
              color="bg-green-100 text-green-600"
              subtitle={`$${stats.revenue.toLocaleString()} revenue`}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Users */}
            <div className="card">
              <div className="card-header flex justify-between items-center">
                <h3>Recent Users</h3>
                <button className="text-indigo-600 text-sm hover:text-indigo-800 cursor-pointer">
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collections</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentUsers.map(user => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                              {user.name.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.joined).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.collections}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.items}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Reported Content */}
            <div className="card">
              <div className="card-header flex justify-between items-center">
                <h3>Reported Content</h3>
                <button className="text-indigo-600 text-sm hover:text-indigo-800 cursor-pointer">
                  View All
                </button>
              </div>
              <div className="card-body">
                {reportedContent.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No reported content to review</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reportedContent.map(item => (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between">
                          <div>
                            <div className="flex items-center">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                item.type === 'item' ? 'bg-blue-100 text-blue-800' :
                                item.type === 'user' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {item.type}
                              </span>
                              <h4 className="text-sm font-medium text-gray-900 ml-2">{item.name}</h4>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              Reported by: {item.reportedBy} • {new Date(item.date).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-800 mt-2">
                              <span className="font-medium">Reason:</span> {item.reason}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleApproveContent(item.id)}
                              className="text-green-600 hover:text-green-800 cursor-pointer"
                              title="Approve content"
                            >
                              <FaFlag />
                            </button>
                            <button 
                              onClick={() => handleRemoveContent(item.id)}
                              className="text-red-600 hover:text-red-800 cursor-pointer"
                              title="Remove content"
                            >
                              <FaFlag />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* User Management */}
      {activeTab === 'users' && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">User Management</h2>
          <div className="card">
            <div className="card-body">
              <p className="text-center py-4 text-gray-500">
                User management tools would be available here, including user search, role management, and account actions.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Content Moderation */}
      {activeTab === 'content' && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Content Moderation</h2>
          <div className="card">
            <div className="card-body">
              <p className="text-center py-4 text-gray-500">
                Content moderation tools would be available here, including reported content review,
                content filtering settings, and moderation logs.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Advertising */}
      {activeTab === 'ads' && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Advertising Management</h2>
          <div className="card">
            <div className="card-body">
              <p className="text-center py-4 text-gray-500">
                Advertising management tools would be available here, including ad campaign creation,
                performance metrics, and ad approval workflows.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Reports */}
      {activeTab === 'reports' && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Platform Reports</h2>
          <div className="card">
            <div className="card-body">
              <p className="text-center py-4 text-gray-500">
                Platform reporting tools would be available here, including user growth metrics,
                transaction volume, revenue reports, and collection statistics.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, title, value, subtitle, color }) {
  return (
    <div className="card hover-card">
      <div className="card-body flex items-start">
        <div className={`rounded-lg p-3 ${color} mr-4`}>
          {icon}
        </div>
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}