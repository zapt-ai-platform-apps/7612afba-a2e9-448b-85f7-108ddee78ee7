import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase, recordLogin } from '@/supabaseClient';
import { eventBus } from '@/modules/core/utils/eventBus';
import { events } from '../utils/events';
import * as Sentry from '@sentry/browser';
import * as authServices from '../internal/services';

export function useAuth() {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasRecordedLogin, setHasRecordedLogin] = useState(false);
  const hasSessionRef = useRef(false);
  
  // Use this function to update session so we also update our ref
  const updateSession = useCallback((newSession) => {
    setSession(newSession);
    hasSessionRef.current = newSession !== null;
  }, []);
  
  // Fetch user profile
  const fetchUserProfile = useCallback(async () => {
    if (!session) return;
    
    try {
      setError(null);
      const { data, error } = await authServices.getUserProfile();
      
      if (error) {
        console.warn('Error fetching user profile:', error);
        // Don't set an error state here, just log it
        // The user might not have a profile yet which is fine
      }
      
      if (data) {
        setProfile(data);
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      Sentry.captureException(err, {
        extra: { context: 'useAuth.fetchUserProfile' }
      });
      // Don't set error state here either
    }
  }, [session]);
  
  // Setup auth state change listener
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        // Set initial session
        updateSession(data.session);
        if (data.session) {
          setUser(data.session.user);
          hasSessionRef.current = true;
        }
        
        // Fetch user profile if we have a session
        if (data.session) {
          await fetchUserProfile();
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error checking session:', error);
        Sentry.captureException(error, {
          extra: { context: 'useAuth.checkSession' }
        });
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
          updateSession(newSession);
          setUser(newSession?.user || null);
          if (newSession?.user?.email) {
            eventBus.publish(events.USER_SIGNED_IN, { user: newSession.user });
            setHasRecordedLogin(false);
          }
          
          // Fetch user profile after sign in
          await fetchUserProfile();
        } else {
          console.log('Already have session, ignoring SIGNED_IN event');
        }
      }
      // For TOKEN_REFRESHED, always update the session
      else if (event === 'TOKEN_REFRESHED') {
        updateSession(newSession);
        setUser(newSession?.user || null);
      }
      // For SIGNED_OUT, clear the session
      else if (event === 'SIGNED_OUT') {
        updateSession(null);
        setUser(null);
        setProfile(null);
        eventBus.publish(events.USER_SIGNED_OUT, {});
        setHasRecordedLogin(false);
      }
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [updateSession, fetchUserProfile]);
  
  // Record login when session changes
  useEffect(() => {
    if (session?.user?.email && !hasRecordedLogin) {
      recordLogin(session.user.email, import.meta.env.VITE_PUBLIC_APP_ENV)
        .then(() => setHasRecordedLogin(true))
        .catch((error) => {
          console.error('Failed to record login:', error);
          Sentry.captureException(error, {
            extra: { context: 'useAuth.recordLogin' }
          });
        });
    }
  }, [session, hasRecordedLogin]);
  
  // Update user profile
  const updateProfile = useCallback(async (profileData) => {
    try {
      setError(null);
      const { data, error } = await authServices.updateUserProfile(profileData);
      
      if (error) throw error;
      
      setProfile(data);
      return { data, error: null };
    } catch (err) {
      console.error('Failed to update profile:', err);
      Sentry.captureException(err, {
        extra: { context: 'useAuth.updateProfile', profileData }
      });
      setError(err.message);
      return { data: null, error: err };
    }
  }, []);
  
  // Sign out
  const signOut = useCallback(async () => {
    try {
      setError(null);
      const { error } = await authServices.signOut();
      if (error) throw error;
    } catch (err) {
      console.error('Error signing out:', err);
      Sentry.captureException(err, {
        extra: { context: 'useAuth.signOut' }
      });
      setError(err.message);
    }
  }, []);
  
  return {
    session,
    user,
    profile,
    loading,
    error,
    setError,
    signOut,
    updateProfile,
    refreshProfile: fetchUserProfile,
  };
}

export default useAuth;