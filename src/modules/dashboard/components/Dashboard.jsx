import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { FaBoxOpen, FaHeart, FaStore, FaFileAlt, FaPlus } from 'react-icons/fa';
import * as Sentry from '@sentry/browser';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    collections: 0,
    items: 0,
    wishlistItems: 0,
    matchesFound: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [recentItems, setRecentItems] = useState([]);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        // This would be replaced with actual API calls
        
        // Simulate API call
        setTimeout(() => {
          setStats({
            collections: 5,
            items: 37,
            wishlistItems: 12,
            matchesFound: 3
          });
          
          setRecentItems([
            { id: 1, name: '1967 Chevrolet Camaro SS', category: 'Model Cars', image: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17a6e06bd75%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A15pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17a6e06bd75%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22107.1875%22%20y%3D%22107.0%22%3EModel Car%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E', value: '126.50' },
            { id: 2, name: 'Charizard Holo 1st Edition', category: 'Pokemon Cards', image: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17a6e06bd75%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A15pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17a6e06bd75%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22107.1875%22%20y%3D%22107.0%22%3EPokemon Card%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E', value: '5000.00' },
            { id: 3, name: 'Star Wars LEGO Millennium Falcon', category: 'LEGO Sets', image: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17a6e06bd75%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A15pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17a6e06bd75%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22107.1875%22%20y%3D%22107.0%22%3ELEGO Set%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E', value: '850.00' },
            { id: 4, name: '1955 Double Die Lincoln Cent', category: 'Coins', image: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17a6e06bd75%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A15pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17a6e06bd75%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22107.1875%22%20y%3D%22107.0%22%3ECoin%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E', value: '1800.00' }
          ]);
          
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        Sentry.captureException(error);
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user]);
  
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {user?.email?.split('@')[0] || 'Collector'}
        </p>
      </header>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={<FaBoxOpen size={24} />}
          title="Collections"
          value={stats.collections}
          color="bg-indigo-100 text-indigo-600"
          link="/collections"
        />
        
        <StatCard 
          icon={<FaBoxOpen size={24} />}
          title="Items"
          value={stats.items}
          color="bg-blue-100 text-blue-600"
          link="/collections"
        />
        
        <StatCard 
          icon={<FaHeart size={24} />}
          title="Wishlist Items"
          value={stats.wishlistItems}
          color="bg-pink-100 text-pink-600"
          link="/wishlist"
        />
        
        <StatCard 
          icon={<FaStore size={24} />}
          title="Matches Found"
          value={stats.matchesFound}
          color="bg-green-100 text-green-600"
          link="/marketplace"
        />
      </div>
      
      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard 
            icon={<FaPlus size={20} />}
            title="Add Collection"
            description="Create a new collection for your items"
            link="/collections"
            color="bg-indigo-600"
          />
          
          <QuickActionCard 
            icon={<FaPlus size={20} />}
            title="Add to Wishlist"
            description="Add new items to your wishlist"
            link="/wishlist"
            color="bg-pink-600"
          />
          
          <QuickActionCard 
            icon={<FaStore size={20} />}
            title="Marketplace"
            description="Browse items from other collectors"
            link="/marketplace"
            color="bg-green-600"
          />
          
          <QuickActionCard 
            icon={<FaFileAlt size={20} />}
            title="Generate Report"
            description="Create reports for insurance or selling"
            link="/reports"
            color="bg-blue-600"
          />
        </div>
      </div>
      
      {/* Recent Items */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Items</h2>
          <Link to="/collections" className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">
            View All Items
          </Link>
        </div>
        
        <div className="grid-items">
          {recentItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color, link }) {
  return (
    <Link to={link} className="card hover-card">
      <div className="card-body flex items-center">
        <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center mr-4`}>
          {icon}
        </div>
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </Link>
  );
}

function QuickActionCard({ icon, title, description, link, color }) {
  return (
    <Link to={link} className="card hover-card">
      <div className="card-body">
        <div className={`w-10 h-10 rounded-full ${color} text-white flex items-center justify-center mb-3`}>
          {icon}
        </div>
        <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </Link>
  );
}

function ItemCard({ item }) {
  return (
    <Link to={`/items/${item.id}`} className="card hover-card">
      <div className="aspect-w-4 aspect-h-3">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-48 object-cover object-center"
        />
      </div>
      <div className="card-body">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-900">{item.name}</h3>
            <p className="text-sm text-gray-600">{item.category}</p>
          </div>
          <span className="badge badge-blue">${item.value}</span>
        </div>
      </div>
    </Link>
  );
}