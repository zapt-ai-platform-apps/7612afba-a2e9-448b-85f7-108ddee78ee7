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
  
  // Using refs instead of state to avoid re-render cycles
  const hasRecordedLoginRef = useRef(false);
  const hasSessionRef = useRef(false);
  const initialCheckDoneRef = useRef(false);
  
  // Use this function to update session so we also update our ref
  const updateSession = useCallback((newSession) => {
    setSession(newSession);
    hasSessionRef.current = newSession !== null;
  }, []);
  
  // Fetch user profile
  const fetchUserProfile = useCallback(async () => {
    if (!hasSessionRef.current) return;
    
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
  }, []); // No dependencies to avoid re-creation
  
  // Setup auth state change listener
  useEffect(() => {
    console.log('Setting up auth listener');
    
    const checkSession = async () => {
      try {
        // Safety check: make sure supabase is available
        if (!supabase || !supabase.auth) {
          console.error('Supabase client not properly initialized');
          setError('Authentication service unavailable');
          setLoading(false);
          initialCheckDoneRef.current = true;
          return;
        }
        
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          setError('Failed to retrieve authentication session');
          setLoading(false);
          initialCheckDoneRef.current = true;
          return;
        }
        
        console.log('Session check completed', { hasSession: !!data.session });
        
        // Set initial session
        updateSession(data.session);
        if (data.session) {
          setUser(data.session.user);
          hasSessionRef.current = true;
          
          // Try to record login only once
          if (data.session?.user?.email && !hasRecordedLoginRef.current) {
            try {
              const appEnv = import.meta.env.VITE_PUBLIC_APP_ENV || 'development';
              await recordLogin(data.session.user.email, appEnv);
              hasRecordedLoginRef.current = true;
              console.log('Login recorded successfully');
            } catch (loginErr) {
              console.error('Failed to record login:', loginErr);
              Sentry.captureException(loginErr);
              // Mark as recorded anyway to prevent retries
              hasRecordedLoginRef.current = true;
            }
          }
        }
        
        // Fetch user profile if we have a session
        if (data.session) {
          await fetchUserProfile();
        }
      } catch (error) {
        console.error('Error checking session:', error);
        Sentry.captureException(error, {
          extra: { context: 'useAuth.checkSession' }
        });
        setError('Authentication error occurred');
      } finally {
        // Always set loading to false and mark initial check as done
        setLoading(false);
        initialCheckDoneRef.current = true;
      }
    };
    
    checkSession();
    
    // Set up the auth listener
    let authListener = null;
    
    const setupAuthListener = () => {
      // Safety check: make sure supabase is available
      if (!supabase || !supabase.auth) {
        console.error('Cannot set up auth listener - Supabase client not properly initialized');
        return;
      }
      
      try {
        console.log('Setting up auth state change listener');
        const { data: listener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          console.log('Auth event:', event, 'Has session:', hasSessionRef.current);
          
          // For SIGNED_IN, only update session if we don't have one
          if (event === 'SIGNED_IN') {
            if (!hasSessionRef.current) {
              updateSession(newSession);
              setUser(newSession?.user || null);
              if (newSession?.user?.email && !hasRecordedLoginRef.current) {
                try {
                  const appEnv = import.meta.env.VITE_PUBLIC_APP_ENV || 'development';
                  await recordLogin(newSession.user.email, appEnv);
                  hasRecordedLoginRef.current = true;
                  eventBus.publish(events.USER_SIGNED_IN, { user: newSession.user });
                } catch (err) {
                  console.error('Failed to record login:', err);
                  Sentry.captureException(err);
                  // Mark as recorded anyway to prevent retries
                  hasRecordedLoginRef.current = true;
                }
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
            hasRecordedLoginRef.current = false;
            eventBus.publish(events.USER_SIGNED_OUT, {});
          }
        });
        authListener = listener;
      } catch (err) {
        console.error('Error setting up auth listener:', err);
        Sentry.captureException(err, {
          extra: { context: 'useAuth.setupAuthListener' }
        });
      }
    };
    
    // Start setting up the listener immediately to catch any auth events
    setupAuthListener();
    
    return () => {
      if (authListener && authListener.subscription) {
        console.log('Unsubscribing from auth listener');
        authListener.subscription.unsubscribe();
      }
    };
  }, [updateSession, fetchUserProfile]);
  
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
      // Safety check: make sure supabase is available
      if (!supabase || !supabase.auth) {
        throw new Error('Supabase client not properly initialized');
      }
      
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