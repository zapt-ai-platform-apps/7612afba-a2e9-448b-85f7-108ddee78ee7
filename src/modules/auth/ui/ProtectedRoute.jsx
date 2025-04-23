import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/modules/auth/hooks/useAuth';

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    // Return loading indicator while checking auth status
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!user) {
    // Redirect to login page if user is not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If user is authenticated, render the protected content
  return children;
}

export default ProtectedRoute;