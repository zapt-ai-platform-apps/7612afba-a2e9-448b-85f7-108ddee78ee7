import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaHome, 
  FaBoxOpen, 
  FaHeart, 
  FaStore, 
  FaChartBar, 
  FaFileAlt,
  FaCog,
  FaShieldAlt
} from 'react-icons/fa';
import { useAuth } from '@/modules/auth/hooks/useAuth';

export default function Sidebar() {
  const { user } = useAuth();
  
  // Check if user has admin role (basic implementation)
  const isAdmin = user?.email?.includes('admin');
  
  const navItems = [
    { to: "/dashboard", icon: <FaHome />, text: "Dashboard" },
    { to: "/collections", icon: <FaBoxOpen />, text: "My Collections" },
    { to: "/wishlist", icon: <FaHeart />, text: "Wishlist" },
    { to: "/marketplace", icon: <FaStore />, text: "Marketplace" },
    { to: "/reports", icon: <FaFileAlt />, text: "Reports" },
    { to: "/settings", icon: <FaCog />, text: "Settings" },
  ];
  
  if (isAdmin) {
    navItems.push({ to: "/admin", icon: <FaShieldAlt />, text: "Admin" });
  }
  
  return (
    <aside className="w-64 bg-gray-800 text-white hidden md:block overflow-y-auto">
      <div className="p-4">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">
            Welcome{user?.email ? `, ${user.email.split('@')[0]}` : ''}
          </h2>
          <p className="text-gray-400 text-sm">Manage your collectibles</p>
        </div>
        
        <nav>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => 
                    `flex items-center px-4 py-3 text-sm rounded-lg transition ${
                      isActive 
                        ? 'bg-indigo-700 text-white' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`
                  }
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.text}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      <div className="absolute bottom-0 w-64 p-4 bg-gray-800 border-t border-gray-700">
        <div className="flex items-center">
          <a
            href="https://www.zapt.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="zapt-badge"
          >
            Made on ZAPT
          </a>
        </div>
      </div>
    </aside>
  );
}