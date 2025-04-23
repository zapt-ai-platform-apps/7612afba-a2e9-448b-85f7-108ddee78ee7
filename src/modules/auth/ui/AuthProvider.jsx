import React from 'react';
import { AuthContext } from '../context/AuthContext';
import { useAuthProvider } from '../hooks/useAuth';

export function AuthProvider({ children }) {
  const auth = useAuthProvider();
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}