import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout
import MainLayout from '@/modules/core/components/layout/MainLayout';

// Auth components
import LoginPage from '@/modules/auth/components/LoginPage';
import ProtectedRoute from '@/modules/auth/components/ProtectedRoute';

// Public pages
import LandingPage from '@/modules/core/components/LandingPage';

// Dashboard and main features
import Dashboard from '@/modules/dashboard/components/Dashboard';
import CollectionsList from '@/modules/collections/components/CollectionsList';
import CollectionDetails from '@/modules/collections/components/CollectionDetails';
import ItemDetails from '@/modules/items/components/ItemDetails';
import AddItemForm from '@/modules/items/components/AddItemForm';
import EditItemForm from '@/modules/items/components/EditItemForm';
import WishlistPage from '@/modules/wishlist/components/WishlistPage';
import MarketplacePage from '@/modules/marketplace/components/MarketplacePage';
import UserProfilePage from '@/modules/users/components/UserProfilePage';
import ReportsPage from '@/modules/reports/components/ReportsPage';
import MessagesPage from '@/modules/messages/components/MessagesPage';
import NotificationsPage from '@/modules/notifications/components/NotificationsPage';
import AdminDashboard from '@/modules/admin/components/AdminDashboard';
import UserSettings from '@/modules/users/components/UserSettings';
import ChatWidget from '@/modules/messages/components/ChatWidget';
import { useAuth } from '@/modules/auth/hooks/useAuth';

export default function App() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
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