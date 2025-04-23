import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout
import MainLayout from '@/modules/core/components/layout/MainLayout';

// Auth components
import { LoginPage, ProtectedRoute } from '@/modules/auth';

// Public pages
import LandingPage from '@/modules/core/components/LandingPage';

// Dashboard and main features
import Dashboard from '@/modules/dashboard/components/Dashboard';
import { CollectionsList, CollectionDetails } from '@/modules/collections';
import { ItemDetails, AddItemForm, EditItemForm } from '@/modules/items';
import WishlistPage from '@/modules/wishlist/components/WishlistPage';
import MarketplacePage from '@/modules/marketplace/components/MarketplacePage';
import UserProfilePage from '@/modules/users/components/UserProfilePage';
import ReportsPage from '@/modules/reports/components/ReportsPage';
import MessagesPage from '@/modules/messages/components/MessagesPage.jsx';
import NotificationsPage from '@/modules/notifications/components/NotificationsPage';
import AdminDashboard from '@/modules/admin/components/AdminDashboard';
import UserSettings from '@/modules/users/components/UserSettings';
import ChatWidget from '@/modules/messages/components/ChatWidget';
import { useAuth } from '@/modules/auth/hooks/useAuth';

export default function App() {
  const { user, loading, error } = useAuth();
  
  // Check if critical environment variables are missing
  const missingEnvVars = [];
  if (!import.meta.env.VITE_PUBLIC_APP_ID) missingEnvVars.push('VITE_PUBLIC_APP_ID');
  if (!import.meta.env.VITE_PUBLIC_APP_ENV) missingEnvVars.push('VITE_PUBLIC_APP_ENV');
  if (!import.meta.env.VITE_PUBLIC_SENTRY_DSN) missingEnvVars.push('VITE_PUBLIC_SENTRY_DSN');
  
  if (missingEnvVars.length > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col p-6">
        <div className="text-red-600 font-bold text-xl mb-4">Configuration Error</div>
        <div className="mb-4">Missing required environment variables:</div>
        <ul className="list-disc pl-6 mb-4">
          {missingEnvVars.map(envVar => (
            <li key={envVar} className="font-mono">{envVar}</li>
          ))}
        </ul>
        <div>Please check your <span className="font-mono">.env</span> file and make sure all required variables are set.</div>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-gray-600">Authenticating...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col p-6">
        <div className="text-red-600 font-bold text-xl mb-4">Authentication Error</div>
        <div className="mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
        
        {/* Protected routes */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/collections" element={<CollectionsList />} />
          <Route path="/collections/:collectionId" element={<CollectionDetails />} />
          <Route path="/items/:itemId" element={<ItemDetails />} />
          <Route path="/collections/:collectionId/add-item" element={<AddItemForm />} />
          <Route path="/items/:itemId/edit" element={<EditItemForm />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/settings" element={<UserSettings />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          
          {/* Admin route */}
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {user && <ChatWidget />}
    </div>
  );
}