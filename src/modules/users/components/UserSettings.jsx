import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { fetchUserProfile, updateUserProfile } from '@/modules/users/api';
import * as Sentry from '@sentry/browser';

function UserSettings() {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userSettings, setUserSettings] = useState({
    emailNotifications: true,
    marketplaceAlerts: true,
    wishlistAlerts: true,
    collectionUpdates: true,
    defaultCurrency: 'USD',
    language: 'en'
  });

  useEffect(() => {
    async function loadUserSettings() {
      try {
        setLoading(true);
        const profile = await fetchUserProfile();
        
        if (profile.settings) {
          setUserSettings({
            ...userSettings,
            ...profile.settings
          });
        }
      } catch (error) {
        console.error('Failed to load user settings:', error);
        Sentry.captureException(error);
        toast.error('Failed to load your settings. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      loadUserSettings();
    }
  }, [user]);

  const handleToggle = (setting) => {
    setUserSettings({
      ...userSettings,
      [setting]: !userSettings[setting]
    });
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setUserSettings({
      ...userSettings,
      [name]: value
    });
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      await updateUserProfile({ settings: userSettings });
      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      Sentry.captureException(error);
      toast.error('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
      Sentry.captureException(error);
      toast.error('Failed to log out. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Account Settings</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Notification Preferences</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium text-gray-700">Email Notifications</h3>
              <p className="text-sm text-gray-500">Receive emails about your account and activity</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={userSettings.emailNotifications}
                onChange={() => handleToggle('emailNotifications')}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium text-gray-700">Marketplace Alerts</h3>
              <p className="text-sm text-gray-500">Get notified about new listings that match your interests</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={userSettings.marketplaceAlerts}
                onChange={() => handleToggle('marketplaceAlerts')}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium text-gray-700">Wishlist Alerts</h3>
              <p className="text-sm text-gray-500">Receive updates when items on your wishlist become available</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={userSettings.wishlistAlerts}
                onChange={() => handleToggle('wishlistAlerts')}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium text-gray-700">Collection Updates</h3>
              <p className="text-sm text-gray-500">Get notified about price changes and market trends for your collection</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={userSettings.collectionUpdates}
                onChange={() => handleToggle('collectionUpdates')}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Display Preferences</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Default Currency</label>
            <select
              name="defaultCurrency"
              value={userSettings.defaultCurrency}
              onChange={handleSelectChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 box-border text-gray-900"
            >
              <option value="USD">US Dollar (USD)</option>
              <option value="EUR">Euro (EUR)</option>
              <option value="GBP">British Pound (GBP)</option>
              <option value="JPY">Japanese Yen (JPY)</option>
              <option value="CAD">Canadian Dollar (CAD)</option>
              <option value="AUD">Australian Dollar (AUD)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <select
              name="language"
              value={userSettings.language}
              onChange={handleSelectChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 box-border text-gray-900"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
              <option value="ja">Japanese</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Account</h2>
        
        <div className="flex flex-col space-y-2">
          <div>
            <span className="text-sm font-medium text-gray-500">Email:</span>
            <p className="text-gray-800">{user?.email}</p>
          </div>
        </div>
        
        <div className="mt-6 flex flex-col space-y-4">
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </div>
      
      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={handleSaveSettings}
          disabled={saving}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer disabled:opacity-70"
        >
          {saving ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : 'Save All Settings'}
        </button>
      </div>
      
      <div className="mt-6 text-center">
        <a href="https://www.zapt.ai" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-indigo-600">
          Made on ZAPT
        </a>
      </div>
    </div>
  );
}

export default UserSettings;