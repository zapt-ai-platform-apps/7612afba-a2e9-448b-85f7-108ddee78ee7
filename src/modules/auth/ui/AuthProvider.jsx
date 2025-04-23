import React, { useState, useEffect, useRef } from 'react';
import { supabase, recordLogin } from '@/supabaseClient';
import { AuthContext } from '../internal/context';
import { eventBus } from '@/modules/core/utils/eventBus';
import { toast } from 'react-hot-toast';
import * as Sentry from '@sentry/browser';

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasRecordedLogin, setHasRecordedLogin] = useState(false);
  const hasSessionRef = useRef(false);
  
  // Use this function to update session so we also update our ref
  const updateSession = (newSession) => {
    setSession(newSession);
    hasSessionRef.current = newSession !== null;
    
    // Update user whenever session changes
    setUser(newSession?.user || null);
  };
  
  useEffect(() => {
    // Check active session on initial mount
    const checkSession = async () => {
      try {
        console.log('Checking initial session');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking session:', error);
          Sentry.captureException(error);
          throw error;
        }
        
        // Set initial session
        updateSession(data.session);
        
        if (data.session) {
          console.log('Initial session found');
          hasSessionRef.current = true;
        } else {
          console.log('No initial session found');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Session check failed:', error);
        Sentry.captureException(error);
        setLoading(false);
      }
    };
    
    checkSession();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('Auth event:', event, 'Has session:', hasSessionRef.current);
      
      // For SIGNED_IN, only update session if we don't have one
      if (event === 'SIGNED_IN') {
        if (!hasSessionRef.current) {
          console.log('SIGNED_IN event: updating session');
          updateSession(newSession);
          if (newSession?.user?.email) {
            eventBus.publish('auth:signedIn', { user: newSession.user });
            setHasRecordedLogin(false);
          }
        } else {
          console.log('Already have session, ignoring SIGNED_IN event');
        }
      }
      // For TOKEN_REFRESHED, always update the session
      else if (event === 'TOKEN_REFRESHED') {
        console.log('TOKEN_REFRESHED event: updating session');
        updateSession(newSession);
      }
      // For SIGNED_OUT, clear the session
      else if (event === 'SIGNED_OUT') {
        console.log('SIGNED_OUT event: clearing session');
        updateSession(null);
        eventBus.publish('auth:signedOut', {});
        setHasRecordedLogin(false);
        toast.success('You have been signed out');
      }
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []); // No dependencies to prevent re-creating the listener
  
  // Use a separate useEffect to record login
  useEffect(() => {
    const recordUserLogin = async () => {
      if (session?.user?.email && !hasRecordedLogin) {
        try {
          console.log('Recording login for:', session.user.email);
          await recordLogin(session.user.email, import.meta.env.VITE_PUBLIC_APP_ENV);
          setHasRecordedLogin(true);
        } catch (error) {
          console.error('Failed to record login:', error);
          Sentry.captureException(error);
        }
      }
    };
    
    recordUserLogin();
  }, [session, hasRecordedLogin]);
  
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      Sentry.captureException(error);
      throw error;
    }
  };
  
  // Provide the auth context to children components
  return (
    <AuthContext.Provider value={{
      session,
      user,
      loading,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}