import React from 'react';
import { AuthContext } from '../internal/context';
import { useAuthState } from '../internal/hooks';

export function AuthProvider({ children }) {
  const authState = useAuthState();
  
  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;