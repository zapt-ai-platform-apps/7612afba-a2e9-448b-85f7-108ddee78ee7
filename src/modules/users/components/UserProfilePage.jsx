import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { fetchUserProfile, updateUserProfile } from '@/modules/users/api';
import * as Sentry from '@sentry/browser';

function UserProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    city: '',
    country: '',
    socialMedia: {
      twitter: '',
      instagram: '',
      facebook: ''
    },
    forumHandles: {
      reddit: '',
      discord: ''
    }
  });

  useEffect(() => {
    async function loadUserProfile() {
      try {
        setLoading(true);
        const profileData = await fetchUserProfile();
        setProfile(profileData);
        
        // Initialize form with profile data
        setFormData({
          firstName: profileData.firstName || '',
          lastName: profileData.lastName || '',
          city: profileData.city || '',
          country: profileData.country || '',
          socialMedia: profileData.socialMedia || {
            twitter: '',
            instagram: '',
            facebook: ''
          },
          forumHandles: profileData.forumHandles || {
            reddit: '',
            discord: ''
          }
        });
      } catch (error) {
        console.error('Failed to load user profile:', error);
        Sentry.captureException(error);
        toast.error('Failed to load your profile. Please try again later.');
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
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSocialMediaChange = (platform, value) => {
    setFormData({
      ...formData,
      socialMedia: {
        ...formData.socialMedia,
        [platform]: value
      }
    });
  };

  const handleForumHandleChange = (platform, value) => {
    setFormData({
      ...formData,
      forumHandles: {
        ...formData.forumHandles,
        [platform]: value
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const updatedProfile = await updateUserProfile(formData);
      setProfile(updatedProfile);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      Sentry.captureException(error);
      toast.error('Failed to update your profile. Please try again.');
    } finally {
      setUpdating(false);
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
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Your Profile</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 box-border text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 box-border text-gray-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 box-border text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 box-border text-gray-900"
              />
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Social Media</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                <input
                  type="text"
                  value={formData.socialMedia.twitter}
                  onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 box-border text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                <input
                  type="text"
                  value={formData.socialMedia.instagram}
                  onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 box-border text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                <input
                  type="text"
                  value={formData.socialMedia.facebook}
                  onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 box-border text-gray-900"
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Forum Handles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reddit</label>
                <input
                  type="text"
                  value={formData.forumHandles.reddit}
                  onChange={(e) => handleForumHandleChange('reddit', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 box-border text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discord</label>
                <input
                  type="text"
                  value={formData.forumHandles.discord}
                  onChange={(e) => handleForumHandleChange('discord', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 box-border text-gray-900"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={updating}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer disabled:opacity-70"
            >
              {updating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Account Information</h2>
        <div className="flex flex-col space-y-3">
          <div>
            <span className="text-sm font-medium text-gray-500">Email:</span>
            <p className="text-gray-800">{user?.email}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Account created:</span>
            <p className="text-gray-800">
              {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <a href="https://www.zapt.ai" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-indigo-600">
          Made on ZAPT
        </a>
      </div>
    </div>
  );
}

export default UserProfilePage;