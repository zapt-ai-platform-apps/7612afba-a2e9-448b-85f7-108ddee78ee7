import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, updateUserProfile } from '../api';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { toast } from 'react-hot-toast';
import * as Sentry from '@sentry/browser';
import { FaFacebookF, FaTwitter, FaInstagram, FaReddit } from 'react-icons/fa';

export default function UserProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    city: '',
    country: '',
    socialMedia: { facebook: '', twitter: '', instagram: '', reddit: '' },
    forumHandles: { mtg: '', pokemon: '', boardgames: '', stamps: '', coins: '' }
  });

  useEffect(() => {
    async function loadUserProfile() {
      try {
        setLoading(true);
        const userData = await getCurrentUser();
        setProfile(userData);
        
        // Initialize form with user data
        setFormData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          city: userData.city || '',
          country: userData.country || '',
          socialMedia: {
            facebook: userData.socialMedia?.facebook || '',
            twitter: userData.socialMedia?.twitter || '',
            instagram: userData.socialMedia?.instagram || '',
            reddit: userData.socialMedia?.reddit || ''
          },
          forumHandles: {
            mtg: userData.forumHandles?.mtg || '',
            pokemon: userData.forumHandles?.pokemon || '',
            boardgames: userData.forumHandles?.boardgames || '',
            stamps: userData.forumHandles?.stamps || '',
            coins: userData.forumHandles?.coins || ''
          }
        });
      } catch (error) {
        console.error('Failed to load user profile:', error);
        Sentry.captureException(error, {
          extra: { context: 'Loading user profile' }
        });
        toast.error('Failed to load your profile. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialMediaChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }));
  };

  const handleForumHandleChange = (forum, value) => {
    setFormData(prev => ({
      ...prev,
      forumHandles: {
        ...prev.forumHandles,
        [forum]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setUpdating(true);
      const updatedProfile = await updateUserProfile(formData);
      setProfile(updatedProfile);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      Sentry.captureException(error, {
        extra: { context: 'Updating user profile', formData }
      });
      toast.error('Failed to update your profile. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-gray-200 mb-6 rounded"></div>
          <div className="h-40 bg-gray-200 mb-6 rounded"></div>
          <div className="h-60 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900">Profile not found</h1>
          <p className="mt-2 text-gray-600">
            We couldn't load your profile information.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 cursor-pointer"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-gray-800">
      <h1 className="text-2xl font-bold mb-6">User Profile</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Account Information</h2>
        <div className="flex flex-col md:flex-row md:items-center mb-4">
          <div className="md:w-1/3 font-medium">Email:</div>
          <div className="md:w-2/3">{profile.email}</div>
        </div>
        <div className="flex flex-col md:flex-row md:items-center mb-4">
          <div className="md:w-1/3 font-medium">Member since:</div>
          <div className="md:w-2/3">{new Date(profile.createdAt).toLocaleDateString()}</div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="firstName">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 box-border"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="lastName">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 box-border"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="city">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 box-border"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="country">
                Country
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 box-border"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Social Media</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center">
              <div className="mr-3 text-blue-600">
                <FaFacebookF size={20} />
              </div>
              <input
                type="text"
                placeholder="Facebook username"
                value={formData.socialMedia.facebook}
                onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 box-border"
              />
            </div>
            
            <div className="flex items-center">
              <div className="mr-3 text-blue-400">
                <FaTwitter size={20} />
              </div>
              <input
                type="text"
                placeholder="Twitter handle"
                value={formData.socialMedia.twitter}
                onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 box-border"
              />
            </div>
            
            <div className="flex items-center">
              <div className="mr-3 text-pink-600">
                <FaInstagram size={20} />
              </div>
              <input
                type="text"
                placeholder="Instagram username"
                value={formData.socialMedia.instagram}
                onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 box-border"
              />
            </div>
            
            <div className="flex items-center">
              <div className="mr-3 text-orange-600">
                <FaReddit size={20} />
              </div>
              <input
                type="text"
                placeholder="Reddit username"
                value={formData.socialMedia.reddit}
                onChange={(e) => handleSocialMediaChange('reddit', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 box-border"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Collector Forum Handles</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                MTG Community
              </label>
              <input
                type="text"
                placeholder="Your handle"
                value={formData.forumHandles.mtg}
                onChange={(e) => handleForumHandleChange('mtg', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 box-border"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Pokemon Community
              </label>
              <input
                type="text"
                placeholder="Your handle"
                value={formData.forumHandles.pokemon}
                onChange={(e) => handleForumHandleChange('pokemon', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 box-border"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Board Games
              </label>
              <input
                type="text"
                placeholder="Your handle"
                value={formData.forumHandles.boardgames}
                onChange={(e) => handleForumHandleChange('boardgames', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 box-border"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Stamp Collectors
              </label>
              <input
                type="text"
                placeholder="Your handle"
                value={formData.forumHandles.stamps}
                onChange={(e) => handleForumHandleChange('stamps', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 box-border"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Coin Collectors
              </label>
              <input
                type="text"
                placeholder="Your handle"
                value={formData.forumHandles.coins}
                onChange={(e) => handleForumHandleChange('coins', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 box-border"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={updating}
            className={`px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 cursor-pointer ${
              updating ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {updating ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>
          <a href="https://www.zapt.ai" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">
            Made on ZAPT
          </a>
        </p>
      </div>
    </div>
  );
}