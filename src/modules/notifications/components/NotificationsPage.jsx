import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaCheck, 
  FaBell, 
  FaShoppingCart, 
  FaCommentAlt, 
  FaHeart, 
  FaStar, 
  FaExclamationCircle 
} from 'react-icons/fa';
import * as Sentry from '@sentry/browser';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingAllRead, setMarkingAllRead] = useState(false);
  
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would be an API call
        // Simulating API call with timeout
        setTimeout(() => {
          const mockNotifications = [
            { 
              id: '1', 
              type: 'wishlist_match', 
              content: 'A Charizard Holo 1st Edition matching your wishlist is now available',
              relatedId: 'item2',
              read: false,
              createdAt: new Date(2023, 5, 25, 10, 15).toISOString()
            },
            {
              id: '2',
              type: 'message',
              content: 'You have a new message from PokeMaster regarding Charizard Holo 1st Edition',
              relatedId: 'message7',
              read: false,
              createdAt: new Date(2023, 5, 24, 15, 30).toISOString()
            },
            {
              id: '3',
              type: 'transaction',
              content: 'Your purchase of LEGO Star Wars Millennium Falcon UCS is pending payment confirmation',
              relatedId: 'transaction3',
              read: false,
              createdAt: new Date(2023, 5, 24, 9, 45).toISOString()
            },
            {
              id: '4',
              type: 'sale',
              content: 'CarCollector42 has purchased your 1965 Shelby Cobra 427 S/C',
              relatedId: 'transaction2',
              read: true,
              createdAt: new Date(2023, 5, 23, 14, 20).toISOString()
            },
            {
              id: '5',
              type: 'feedback',
              content: 'Alice Smith left you a 5-star rating',
              relatedId: 'feedback1',
              read: true,
              createdAt: new Date(2023, 5, 22, 11, 10).toISOString()
            },
            {
              id: '6',
              type: 'alert',
              content: 'The value of your Charizard Holo 1st Edition has increased by 10%',
              relatedId: 'item2',
              read: true,
              createdAt: new Date(2023, 5, 20, 8, 30).toISOString()
            }
          ];
          
          setNotifications(mockNotifications);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        Sentry.captureException(error);
        setLoading(false);
      }
    };
    
    fetchNotifications();
  }, [user]);
  
  const handleMarkAsRead = async (id) => {
    try {
      // In a real app, this would be an API call
      // Simulating API call
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
      
      toast.success('Notification marked as read');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      Sentry.captureException(error);
      toast.error('Failed to mark as read');
    }
  };
  
  const handleMarkAllAsRead = async () => {
    try {
      setMarkingAllRead(true);
      
      // In a real app, this would be an API call
      // Simulating API call with timeout
      setTimeout(() => {
        setNotifications(prevNotifications => 
          prevNotifications.map(notification => ({ ...notification, read: true }))
        );
        
        toast.success('All notifications marked as read');
        setMarkingAllRead(false);
      }, 1000);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      Sentry.captureException(error);
      toast.error('Failed to mark all as read');
      setMarkingAllRead(false);
    }
  };
  
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'wishlist_match':
        return <FaHeart className="text-pink-500" />;
      case 'message':
        return <FaCommentAlt className="text-blue-500" />;
      case 'transaction':
        return <FaShoppingCart className="text-indigo-500" />;
      case 'sale':
        return <FaShoppingCart className="text-green-500" />;
      case 'feedback':
        return <FaStar className="text-yellow-500" />;
      case 'alert':
        return <FaExclamationCircle className="text-orange-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };
  
  const getNotificationLink = (notification) => {
    switch (notification.type) {
      case 'wishlist_match':
        return `/items/${notification.relatedId}`;
      case 'message':
        return `/messages?id=${notification.relatedId}`;
      case 'transaction':
      case 'sale':
        return `/profile?transaction=${notification.relatedId}`;
      case 'feedback':
        return `/profile?feedback=${notification.relatedId}`;
      case 'alert':
        return `/items/${notification.relatedId}`;
      default:
        return '#';
    }
  };
  
  const formatNotificationDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };
  
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  return (
    <div>
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="btn btn-outline inline-flex items-center cursor-pointer"
            disabled={markingAllRead}
          >
            {markingAllRead ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                Marking...
              </div>
            ) : (
              <>
                <FaCheck className="mr-2" />
                Mark All as Read
              </>
            )}
          </button>
        )}
      </header>
      
      {notifications.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <FaBell className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No notifications</h3>
          <p className="mt-1 text-sm text-gray-500">
            You don't have any notifications yet.
          </p>
        </div>
      ) : (
        <div className="card">
          <div className="divide-y divide-gray-200">
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`flex px-6 py-4 hover:bg-gray-50 ${!notification.read && 'bg-blue-50'}`}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1">
                  <Link
                    to={getNotificationLink(notification)}
                    className="block"
                  >
                    <p className="text-sm font-medium text-gray-900">{notification.content}</p>
                    <p className="text-sm text-gray-500 mt-1">{formatNotificationDate(notification.createdAt)}</p>
                  </Link>
                </div>
                
                {!notification.read && (
                  <div className="flex-shrink-0 self-center">
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="p-1 rounded-full text-blue-600 hover:bg-blue-100 cursor-pointer"
                      title="Mark as read"
                    >
                      <FaCheck size={16} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}