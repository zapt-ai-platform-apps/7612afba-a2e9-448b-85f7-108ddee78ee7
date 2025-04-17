import React, { useState, useEffect } from 'react';
import { FaSave, FaUpload, FaKey, FaBell, FaShieldAlt, FaCreditCard, FaTimes } from 'react-icons/fa';
import * as Sentry from '@sentry/browser';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import toast from 'react-hot-toast';

export default function UserSettings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    location: '',
    profilePicture: null
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
        
        // In a real app, this would be an API call
        // Simulating API call with timeout
        setTimeout(() => {
          // Mock user data
          const mockUserData = {
            firstName: 'John',
            lastName: 'Collector',
            location: 'San Francisco, CA',
            profilePicture: null,
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
            location: mockUserData.location,
            profilePicture: mockUserData.profilePicture
          });
          
          setNotificationSettings(mockUserData.notifications);
          setPrivacySettings(mockUserData.privacy);
          setLoading(false);
        }, 1000);
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
      
      // In a real app, this would be an API call to save the profile
      // Simulating API call with timeout
      setTimeout(() => {
        toast.success('Profile updated successfully');
        setSaving(false);
      }, 1000);
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
      } transition-colors rounded-lg mb-2`}
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
                  
                  <div className="form-control mb-6">
                    <label htmlFor="location" className="form-label">Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={profileForm.location}
                      onChange={handleProfileChange}
                      placeholder="City, State"
                      className="form-input box-border"
                    />
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