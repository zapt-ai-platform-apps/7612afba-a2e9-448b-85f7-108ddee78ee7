import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { FaBell, FaEnvelope, FaCog, FaSignOutAlt, FaUser } from 'react-icons/fa';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  
  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="container-app">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0 flex items-center">
              <img 
                src="https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=40&height=40" 
                alt="Click & Collectible"
                className="h-10 w-10 mr-2"
              />
              <span className="font-semibold text-lg text-gray-900">Click & Collectible</span>
            </Link>
          </div>
          
          <div className="flex items-center">
            <Link to="/notifications" className="p-2 text-gray-600 hover:text-gray-900 relative mr-2">
              <FaBell size={20} />
              <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                3
              </span>
            </Link>
            
            <Link to="/messages" className="p-2 text-gray-600 hover:text-gray-900 relative mr-4">
              <FaEnvelope size={20} />
              <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
            </Link>
            
            <div className="relative">
              <button
                className="flex items-center text-sm p-1 border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300 transition"
                onClick={toggleProfileDropdown}
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                  {user?.email?.charAt(0).toUpperCase() || <FaUser />}
                </div>
              </button>
              
              {profileDropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <div className="font-medium truncate">{user?.email}</div>
                  </div>
                  
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <FaUser className="mr-2" size={16} />
                    Your Profile
                  </Link>
                  
                  <Link 
                    to="/settings" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <FaCog className="mr-2" size={16} />
                    Settings
                  </Link>
                  
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      handleSignOut();
                    }}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center cursor-pointer"
                  >
                    <FaSignOutAlt className="mr-2" size={16} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}