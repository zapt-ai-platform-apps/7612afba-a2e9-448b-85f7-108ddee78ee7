import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { FaBoxOpen, FaHeart, FaExchangeAlt, FaChartBar, FaUserFriends } from 'react-icons/fa';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-gradient-to-b from-indigo-600 to-indigo-800 text-white">
        <nav className="container-app py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img
              src="https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=40&height=40"
              alt="Click & Collectible"
              className="h-10 w-10 mr-2"
            />
            <span className="font-bold text-lg">Click & Collectible</span>
          </div>
          
          <div>
            {user ? (
              <Link 
                to="/dashboard" 
                className="btn bg-white text-indigo-600 hover:bg-gray-100"
              >
                Dashboard
              </Link>
            ) : (
              <Link 
                to="/login" 
                className="btn bg-white text-indigo-600 hover:bg-gray-100"
              >
                Sign In
              </Link>
            )}
          </div>
        </nav>
        
        <div className="container-app py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Manage & Trade Your Collectibles
            </h1>
            <p className="text-xl mb-8 text-indigo-100">
              From Pokemon cards to vintage coins, model cars to LEGO sets. 
              Track, organize, and connect with other collectors in one place.
            </p>
            <div className="flex flex-wrap gap-4">
              {user ? (
                <Link 
                  to="/dashboard" 
                  className="btn bg-white text-indigo-600 hover:bg-gray-100 text-lg px-8 py-3"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <Link 
                  to="/login" 
                  className="btn bg-white text-indigo-600 hover:bg-gray-100 text-lg px-8 py-3"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container-app">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need for Your Collection
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Click & Collectible helps you manage your collectibles and connect with other collectors
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FaBoxOpen className="text-indigo-600" size={24} />}
              title="Organize Collections"
              description="Keep track of all your collectibles with customizable templates for any type of collection."
            />
            
            <FeatureCard
              icon={<FaHeart className="text-indigo-600" size={24} />}
              title="Wishlist & Notifications"
              description="Add items to your wishlist and get notified when they become available from other collectors."
            />
            
            <FeatureCard
              icon={<FaExchangeAlt className="text-indigo-600" size={24} />}
              title="Buy & Sell"
              description="Safely trade with other collectors through our secure messaging and payment system."
            />
            
            <FeatureCard
              icon={<FaChartBar className="text-indigo-600" size={24} />}
              title="Value Tracking"
              description="Keep track of your collection's value over time and generate reports for insurance."
            />
            
            <FeatureCard
              icon={<FaUserFriends className="text-indigo-600" size={24} />}
              title="Community Feedback"
              description="Build your reputation with ratings and reviews from other collectors."
            />
            
            <FeatureCard
              icon={<img src="https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=24&height=24" alt="Icon" className="w-6 h-6" />}
              title="Collection Templates"
              description="Specialized templates for trading cards, coins, stamps, model cars, LEGO sets, and more."
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-indigo-50">
        <div className="container-app">
          <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Organize Your Collection?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join thousands of collectors who use Click & Collectible to manage and trade their items.
            </p>
            {user ? (
              <Link 
                to="/dashboard" 
                className="btn btn-primary text-lg px-8 py-3"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link 
                to="/login" 
                className="btn btn-primary text-lg px-8 py-3"
              >
                Create Free Account
              </Link>
            )}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container-app">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center mb-4">
                <img
                  src="https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=32&height=32"
                  alt="Click & Collectible"
                  className="h-8 w-8 mr-2"
                />
                <span className="font-bold text-lg">Click & Collectible</span>
              </div>
              <p className="text-gray-400 max-w-md">
                The ultimate platform for collectors to manage, value, and trade their collectibles.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 md:gap-16">
              <div>
                <h3 className="text-lg font-semibold mb-4">Features</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Collections</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Wishlist</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Marketplace</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Reports</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              © {new Date().getFullYear()} Click & Collectible. All rights reserved.
            </p>
            
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
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}