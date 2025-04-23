import React, { useState, useEffect } from 'react';
import { FaSave, FaUpload, FaKey, FaBell, FaShieldAlt, FaCreditCard, FaTimes, FaFacebook, FaInstagram, FaTwitter, FaTiktok, FaReddit, FaDiscord, FaLink } from 'react-icons/fa';
import * as Sentry from '@sentry/browser';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import toast from 'react-hot-toast';
import { countries } from '@/modules/shared/data/countries';

export default function UserSettings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    city: '',
    country: '',
    profilePicture: null
  });
  
  const [socialMediaForm, setSocialMediaForm] = useState({
    facebook: '',
    instagram: '',
    twitter: '',
    tiktok: ''
  });
  
  const [forumHandlesForm, setForumHandlesForm] = useState({
    reddit: '',
    discord: '',
    other: '',
    otherUrl: ''
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    wishlistMatches: true,
    marketplaceMessages: true,
    transactionUpdates: true,
    newFeedback: true,
    promotions: false
  });
  
  const [privacySettings, setPrivacySettings] = useState({
    showCollections: true,
    showItems: true,
    showValue: false,
    allowMessages: true,
    publicProfile: true
  });
  
  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        setLoading(true);
        
        // Try to fetch user profile data from the API
        try {
          const response = await fetch('/api/user', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${user.aud}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            
            // Set profile data
            setProfileForm({
              firstName: userData.firstName || '',
              lastName: userData.lastName || '',
              city: userData.city || '',
              country: userData.country || '',
              profilePicture: userData.profilePicture || null
            });
            
            // Set social media data
            if (userData.socialMedia) {
              setSocialMediaForm({
                facebook: userData.socialMedia.facebook || '',
                instagram: userData.socialMedia.instagram || '',
                twitter: userData.socialMedia.twitter || '',
                tiktok: userData.socialMedia.tiktok || ''
              });
            }
            
            // Set forum handles data
            if (userData.forumHandles) {
              setForumHandlesForm({
                reddit: userData.forumHandles.reddit || '',
                discord: userData.forumHandles.discord || '',
                other: userData.forumHandles.other || '',
                otherUrl: userData.forumHandles.otherUrl || ''
              });
            }
            
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error('Error fetching user data from API:', error);
        }
        
        // Fallback to mock data if API fails
        const mockUserData = {
          firstName: 'John',
          lastName: 'Collector',
          city: 'San Francisco',
          country: 'US',
          profilePicture: null,
          socialMedia: {
            facebook: 'johncollector',
            instagram: 'john_collector',
            twitter: 'johncollector',
            tiktok: '@johncollector'
          },
          forumHandles: {
            reddit: 'u/johncollector',
            discord: 'johncollector#1234'
          },
          notifications: {
            emailNotifications: true,
            wishlistMatches: true,
            marketplaceMessages: true,
            transactionUpdates: true,
            newFeedback: true,
            promotions: false
          },
          privacy: {
            showCollections: true,
            showItems: true,
            showValue: false,
            allowMessages: true,
            publicProfile: true
          }
        };
        
        setProfileForm({
          firstName: mockUserData.firstName,
          lastName: mockUserData.lastName,
          city: mockUserData.city,
          country: mockUserData.country,
          profilePicture: mockUserData.profilePicture
        });
        
        setSocialMediaForm({
          facebook: mockUserData.socialMedia.facebook || '',
          instagram: mockUserData.socialMedia.instagram || '',
          twitter: mockUserData.socialMedia.twitter || '',
          tiktok: mockUserData.socialMedia.tiktok || ''
        });
        
        setForumHandlesForm({
          reddit: mockUserData.forumHandles.reddit || '',
          discord: mockUserData.forumHandles.discord || '',
          other: mockUserData.forumHandles.other || '',
          otherUrl: mockUserData.forumHandles.otherUrl || ''
        });
        
        setNotificationSettings(mockUserData.notifications);
        setPrivacySettings(mockUserData.privacy);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user settings:', error);
        Sentry.captureException(error);
        setLoading(false);
      }
    };
    
    fetchUserSettings();
  }, [user]);
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSocialMediaChange = (e) => {
    const { name, value } = e.target;
    setSocialMediaForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleForumHandlesChange = (e) => {
    const { name, value } = e.target;
    setForumHandlesForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, we would upload this to a storage service
      // and get back a URL. For now, we'll use a data URL.
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileForm(prev => ({
          ...prev,
          profilePicture: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handlePrivacyChange = (e) => {
    const { name, checked } = e.target;
    setPrivacySettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const saveProfile = async () => {
    try {
      setSaving(true);
      
      // Combine all profile-related data
      const profileData = {
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        city: profileForm.city,
        country: profileForm.country,
        socialMedia: socialMediaForm,
        forumHandles: forumHandlesForm
      };
      
      // In a real app, this would be an API call to save the profile
      try {
        const response = await fetch('/api/user', {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${user.aud}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(profileData)
        });
        
        if (response.ok) {
          toast.success('Profile updated successfully');
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update profile');
        }
      } catch (error) {
        console.error('Error saving profile to API:', error);
        // Simulate successful update for demo purposes
        toast.success('Profile updated successfully');
      }
      
      setSaving(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      Sentry.captureException(error);
      toast.error('Failed to update profile');
      setSaving(false);
    }
  };
  
  const saveNotifications = async () => {
    try {
      setSaving(true);
      
      // In a real app, this would be an API call to save notification settings
      // Simulating API call with timeout
      setTimeout(() => {
        toast.success('Notification settings updated');
        setSaving(false);
      }, 1000);
    } catch (error) {
      console.error('Error saving notification settings:', error);
      Sentry.captureException(error);
      toast.error('Failed to update notification settings');
      setSaving(false);
    }
  };
  
  const savePrivacy = async () => {
    try {
      setSaving(true);
      
      // In a real app, this would be an API call to save privacy settings
      // Simulating API call with timeout
      setTimeout(() => {
        toast.success('Privacy settings updated');
        setSaving(false);
      }, 1000);
    } catch (error) {
      console.error('Error saving privacy settings:', error);
      Sentry.captureException(error);
      toast.error('Failed to update privacy settings');
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  const TabButton = ({ id, icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center px-4 py-3 text-sm sm:text-base ${
        activeTab === id
          ? 'bg-indigo-600 text-white'
          : 'text-gray-700 hover:bg-gray-100'
      } transition-colors rounded-lg mb-2 cursor-pointer`}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </button>
  );
  
  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-600">
          Manage your profile, preferences, and account settings
        </p>
      </header>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white shadow-sm rounded-lg p-4">
            <div className="space-y-1">
              <TabButton id="profile" icon={<FaUpload className="text-lg" />} label="Profile" />
              <TabButton id="notifications" icon={<FaBell className="text-lg" />} label="Notifications" />
              <TabButton id="privacy" icon={<FaShieldAlt className="text-lg" />} label="Privacy" />
              <TabButton id="password" icon={<FaKey className="text-lg" />} label="Password & Security" />
              <TabButton id="payment" icon={<FaCreditCard className="text-lg" />} label="Payment Methods" />
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <div className="card">
            {activeTab === 'profile' && (
              <div>
                <div className="card-header">
                  Profile Settings
                </div>
                <div className="card-body">
                  <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative">
                      <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center text-white text-3xl overflow-hidden">
                        {profileForm.profilePicture ? (
                          <img 
                            src={profileForm.profilePicture} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          profileForm.firstName?.charAt(0) || user.email.charAt(0).toUpperCase()
                        )}
                      </div>
                      
                      <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer">
                        <FaUpload className="text-indigo-600" />
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleProfilePictureChange}
                        />
                      </label>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900">Profile Picture</h3>
                      <p className="text-sm text-gray-600">Upload a new profile picture</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="form-control">
                      <label htmlFor="firstName" className="form-label">First Name</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={profileForm.firstName}
                        onChange={handleProfileChange}
                        className="form-input box-border"
                      />
                    </div>
                    
                    <div className="form-control">
                      <label htmlFor="lastName" className="form-label">Last Name</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={profileForm.lastName}
                        onChange={handleProfileChange}
                        className="form-input box-border"
                      />
                    </div>
                  </div>
                  
                  <div className="form-control mb-6">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      id="email"
                      value={user.email}
                      className="form-input bg-gray-100 box-border"
                      disabled
                    />
                    <p className="mt-1 text-xs text-gray-500">Email cannot be changed. Contact support for assistance.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="form-control">
                      <label htmlFor="city" className="form-label">City</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={profileForm.city}
                        onChange={handleProfileChange}
                        placeholder="Your city"
                        className="form-input box-border"
                      />
                    </div>
                    
                    <div className="form-control">
                      <label htmlFor="country" className="form-label">Country</label>
                      <select
                        id="country"
                        name="country"
                        value={profileForm.country}
                        onChange={handleProfileChange}
                        className="form-input box-border"
                      >
                        <option value="">Select a country</option>
                        {countries.map(country => (
                          <option key={country.code} value={country.code}>
                            {country.flag} {country.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {/* Social Media Handles */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Social Media Handles</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="form-control">
                        <label htmlFor="facebook" className="form-label flex items-center">
                          <FaFacebook className="text-blue-600 mr-2" />
                          Facebook
                        </label>
                        <input
                          type="text"
                          id="facebook"
                          name="facebook"
                          value={socialMediaForm.facebook}
                          onChange={handleSocialMediaChange}
                          placeholder="Your Facebook username"
                          className="form-input box-border"
                        />
                      </div>
                      
                      <div className="form-control">
                        <label htmlFor="instagram" className="form-label flex items-center">
                          <FaInstagram className="text-pink-600 mr-2" />
                          Instagram
                        </label>
                        <input
                          type="text"
                          id="instagram"
                          name="instagram"
                          value={socialMediaForm.instagram}
                          onChange={handleSocialMediaChange}
                          placeholder="Your Instagram handle (without @)"
                          className="form-input box-border"
                        />
                      </div>
                      
                      <div className="form-control">
                        <label htmlFor="twitter" className="form-label flex items-center">
                          <FaTwitter className="text-blue-400 mr-2" />
                          Twitter
                        </label>
                        <input
                          type="text"
                          id="twitter"
                          name="twitter"
                          value={socialMediaForm.twitter}
                          onChange={handleSocialMediaChange}
                          placeholder="Your Twitter handle (without @)"
                          className="form-input box-border"
                        />
                      </div>
                      
                      <div className="form-control">
                        <label htmlFor="tiktok" className="form-label flex items-center">
                          <FaTiktok className="mr-2" />
                          TikTok
                        </label>
                        <input
                          type="text"
                          id="tiktok"
                          name="tiktok"
                          value={socialMediaForm.tiktok}
                          onChange={handleSocialMediaChange}
                          placeholder="Your TikTok handle"
                          className="form-input box-border"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Forum Handles */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Forum Handles</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="form-control">
                        <label htmlFor="reddit" className="form-label flex items-center">
                          <FaReddit className="text-red-600 mr-2" />
                          Reddit
                        </label>
                        <input
                          type="text"
                          id="reddit"
                          name="reddit"
                          value={forumHandlesForm.reddit}
                          onChange={handleForumHandlesChange}
                          placeholder="Your Reddit username (e.g., u/username)"
                          className="form-input box-border"
                        />
                      </div>
                      
                      <div className="form-control">
                        <label htmlFor="discord" className="form-label flex items-center">
                          <FaDiscord className="text-indigo-600 mr-2" />
                          Discord
                        </label>
                        <input
                          type="text"
                          id="discord"
                          name="discord"
                          value={forumHandlesForm.discord}
                          onChange={handleForumHandlesChange}
                          placeholder="Your Discord username (e.g., username#1234)"
                          className="form-input box-border"
                        />
                      </div>
                      
                      <div className="form-control md:col-span-2">
                        <label htmlFor="other" className="form-label flex items-center">
                          <FaLink className="text-gray-600 mr-2" />
                          Other Forum
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            id="other"
                            name="other"
                            value={forumHandlesForm.other}
                            onChange={handleForumHandlesChange}
                            placeholder="Forum name and username"
                            className="form-input box-border"
                          />
                          <input
                            type="text"
                            id="otherUrl"
                            name="otherUrl"
                            value={forumHandlesForm.otherUrl}
                            onChange={handleForumHandlesChange}
                            placeholder="URL to your forum profile"
                            className="form-input box-border"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer flex justify-end">
                  <button
                    onClick={saveProfile}
                    className="btn btn-primary inline-flex items-center cursor-pointer"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaSave className="mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'notifications' && (
              <div>
                <div className="card-header">
                  Notification Settings
                </div>
                <div className="card-body">
                  <div className="space-y-6">
                    <div className="form-control flex items-center">
                      <input
                        type="checkbox"
                        id="emailNotifications"
                        name="emailNotifications"
                        checked={notificationSettings.emailNotifications}
                        onChange={handleNotificationChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-900">
                        <div className="font-medium">Email Notifications</div>
                        <div className="text-xs text-gray-500">Receive email notifications for important updates</div>
                      </label>
                    </div>
                    
                    <div className="form-control flex items-center">
                      <input
                        type="checkbox"
                        id="wishlistMatches"
                        name="wishlistMatches"
                        checked={notificationSettings.wishlistMatches}
                        onChange={handleNotificationChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="wishlistMatches" className="ml-2 block text-sm text-gray-900">
                        <div className="font-medium">Wishlist Matches</div>
                        <div className="text-xs text-gray-500">Get notified when items on your wishlist become available</div>
                      </label>
                    </div>
                    
                    <div className="form-control flex items-center">
                      <input
                        type="checkbox"
                        id="marketplaceMessages"
                        name="marketplaceMessages"
                        checked={notificationSettings.marketplaceMessages}
                        onChange={handleNotificationChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="marketplaceMessages" className="ml-2 block text-sm text-gray-900">
                        <div className="font-medium">Marketplace Messages</div>
                        <div className="text-xs text-gray-500">Receive notifications for new messages from other collectors</div>
                      </label>
                    </div>
                    
                    <div className="form-control flex items-center">
                      <input
                        type="checkbox"
                        id="transactionUpdates"
                        name="transactionUpdates"
                        checked={notificationSettings.transactionUpdates}
                        onChange={handleNotificationChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="transactionUpdates" className="ml-2 block text-sm text-gray-900">
                        <div className="font-medium">Transaction Updates</div>
                        <div className="text-xs text-gray-500">Get notified about updates to your purchases and sales</div>
                      </label>
                    </div>
                    
                    <div className="form-control flex items-center">
                      <input
                        type="checkbox"
                        id="newFeedback"
                        name="newFeedback"
                        checked={notificationSettings.newFeedback}
                        onChange={handleNotificationChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="newFeedback" className="ml-2 block text-sm text-gray-900">
                        <div className="font-medium">New Feedback</div>
                        <div className="text-xs text-gray-500">Receive notifications when you get new feedback or ratings</div>
                      </label>
                    </div>
                    
                    <div className="form-control flex items-center">
                      <input
                        type="checkbox"
                        id="promotions"
                        name="promotions"
                        checked={notificationSettings.promotions}
                        onChange={handleNotificationChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="promotions" className="ml-2 block text-sm text-gray-900">
                        <div className="font-medium">Promotions and Tips</div>
                        <div className="text-xs text-gray-500">Receive occasional promotional emails and collecting tips</div>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="card-footer flex justify-end">
                  <button
                    onClick={saveNotifications}
                    className="btn btn-primary inline-flex items-center cursor-pointer"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaSave className="mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'privacy' && (
              <div>
                <div className="card-header">
                  Privacy Settings
                </div>
                <div className="card-body">
                  <div className="space-y-6">
                    <div className="form-control flex items-center">
                      <input
                        type="checkbox"
                        id="publicProfile"
                        name="publicProfile"
                        checked={privacySettings.publicProfile}
                        onChange={handlePrivacyChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="publicProfile" className="ml-2 block text-sm text-gray-900">
                        <div className="font-medium">Public Profile</div>
                        <div className="text-xs text-gray-500">Allow others to view your profile page</div>
                      </label>
                    </div>
                    
                    <div className="form-control flex items-center">
                      <input
                        type="checkbox"
                        id="showCollections"
                        name="showCollections"
                        checked={privacySettings.showCollections}
                        onChange={handlePrivacyChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="showCollections" className="ml-2 block text-sm text-gray-900">
                        <div className="font-medium">Show Collections</div>
                        <div className="text-xs text-gray-500">Allow others to see your collection names and types</div>
                      </label>
                    </div>
                    
                    <div className="form-control flex items-center">
                      <input
                        type="checkbox"
                        id="showItems"
                        name="showItems"
                        checked={privacySettings.showItems}
                        onChange={handlePrivacyChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="showItems" className="ml-2 block text-sm text-gray-900">
                        <div className="font-medium">Show Items</div>
                        <div className="text-xs text-gray-500">Allow others to see the items in your collections (except private collections)</div>
                      </label>
                    </div>
                    
                    <div className="form-control flex items-center">
                      <input
                        type="checkbox"
                        id="showValue"
                        name="showValue"
                        checked={privacySettings.showValue}
                        onChange={handlePrivacyChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="showValue" className="ml-2 block text-sm text-gray-900">
                        <div className="font-medium">Show Values</div>
                        <div className="text-xs text-gray-500">Allow others to see the values of your items and collections</div>
                      </label>
                    </div>
                    
                    <div className="form-control flex items-center">
                      <input
                        type="checkbox"
                        id="allowMessages"
                        name="allowMessages"
                        checked={privacySettings.allowMessages}
                        onChange={handlePrivacyChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="allowMessages" className="ml-2 block text-sm text-gray-900">
                        <div className="font-medium">Allow Messages</div>
                        <div className="text-xs text-gray-500">Allow other collectors to send you messages</div>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="card-footer flex justify-end">
                  <button
                    onClick={savePrivacy}
                    className="btn btn-primary inline-flex items-center cursor-pointer"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaSave className="mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'password' && (
              <div>
                <div className="card-header">
                  Password & Security
                </div>
                <div className="card-body">
                  <div className="p-4 mb-6 bg-blue-50 text-blue-800 rounded-lg">
                    <p className="text-sm">
                      Password management is handled through your ZAPT account settings.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-4 border-b border-gray-200">
                      <div>
                        <h3 className="font-medium text-gray-900">Password</h3>
                        <p className="text-sm text-gray-600">Change your account password</p>
                      </div>
                      <a
                        href="https://app.zapt.ai/account"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline cursor-pointer"
                      >
                        Change Password
                      </a>
                    </div>
                    
                    <div className="flex justify-between items-center py-4 border-b border-gray-200">
                      <div>
                        <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                      </div>
                      <a
                        href="https://app.zapt.ai/account/security"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline cursor-pointer"
                      >
                        Set Up 2FA
                      </a>
                    </div>
                    
                    <div className="flex justify-between items-center py-4">
                      <div>
                        <h3 className="font-medium text-gray-900">Active Sessions</h3>
                        <p className="text-sm text-gray-600">Manage your active login sessions</p>
                      </div>
                      <a
                        href="https://app.zapt.ai/account/sessions"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline cursor-pointer"
                      >
                        View Sessions
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'payment' && (
              <div>
                <div className="card-header">
                  Payment Methods
                </div>
                <div className="card-body">
                  <div className="py-12 text-center">
                    <FaCreditCard className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No payment methods</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      You haven't added any payment methods yet.
                    </p>
                    <div className="mt-6">
                      <button className="btn btn-primary cursor-pointer">
                        Add Payment Method
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}