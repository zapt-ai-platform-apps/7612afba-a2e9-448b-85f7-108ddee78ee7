import { useState, useEffect, useRef, useContext } from 'react';
import { supabase, recordLogin } from '@/supabaseClient';
import * as Sentry from '@sentry/browser';
import { eventBus } from '@/modules/core/utils/eventBus';
import { AuthContext } from '../context/AuthContext';

// Event names for authentication events
export const AUTH_EVENTS = {
  USER_SIGNED_IN: 'auth:user_signed_in',
  USER_SIGNED_OUT: 'auth:user_signed_out',
  SESSION_REFRESHED: 'auth:session_refreshed',
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useAuthProvider() {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasRecordedLogin, setHasRecordedLogin] = useState(false);
  const hasSessionRef = useRef(false);
  
  // Use this function to safely update session and user state
  const updateSession = (newSession) => {
    console.log('Updating session state:', newSession ? 'Session Present' : 'No Session');
    setSession(newSession);
    setUser(newSession?.user || null);
    hasSessionRef.current = newSession !== null;
  };
  
  useEffect(() => {
    // Check active session on initial mount
    const checkSession = async () => {
      try {
        console.log('Checking initial session');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking session:', error);
          Sentry.captureException(error, {
            extra: { context: 'Initial session check' }
          });
          throw error;
        }
        
        // Set initial session
        updateSession(data.session);
        if (data.session) {
          hasSessionRef.current = true;
          console.log('Initial session found');
        } else {
          console.log('No initial session found');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error in checkSession:', error);
        Sentry.captureException(error);
        setLoading(false);
      }
    };
    
    checkSession();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('Auth event:', event, 'Has session:', hasSessionRef.current);
      
      try {
        // For SIGNED_IN, only update session if we don't have one
        if (event === 'SIGNED_IN') {
          if (!hasSessionRef.current) {
            console.log('SIGNED_IN event - updating session');
            updateSession(newSession);
            if (newSession?.user?.email) {
              eventBus.publish(AUTH_EVENTS.USER_SIGNED_IN, { user: newSession.user });
              setHasRecordedLogin(false);
            }
          } else {
            console.log('Already have session, ignoring SIGNED_IN event');
          }
        }
        // For TOKEN_REFRESHED, always update the session
        else if (event === 'TOKEN_REFRESHED') {
          console.log('TOKEN_REFRESHED event - updating session');
          updateSession(newSession);
          eventBus.publish(AUTH_EVENTS.SESSION_REFRESHED, { session: newSession });
        }
        // For SIGNED_OUT, clear the session
        else if (event === 'SIGNED_OUT') {
          console.log('SIGNED_OUT event - clearing session');
          updateSession(null);
          eventBus.publish(AUTH_EVENTS.USER_SIGNED_OUT, {});
          setHasRecordedLogin(false);
        }
      } catch (error) {
        console.error('Error handling auth state change:', error);
        Sentry.captureException(error, {
          extra: { context: 'Auth state change handler', authEvent: event }
        });
      }
    });
    
    return () => {
      console.log('Cleaning up auth listener');
      authListener?.subscription?.unsubscribe();
    };
  }, []); // No dependencies to prevent re-creating the listener
  
  // Record login when session exists and hasn't been recorded yet
  useEffect(() => {
    if (session?.user?.email && !hasRecordedLogin) {
      console.log('Recording login for user:', session.user.email);
      try {
        recordLogin(session.user.email, import.meta.env.VITE_PUBLIC_APP_ENV);
        setHasRecordedLogin(true);
      } catch (error) {
        console.error('Failed to record login:', error);
        Sentry.captureException(error, {
          extra: { context: 'Record login' }
        });
      }
    }
  }, [session, hasRecordedLogin]);
  
  const signOut = async () => {
    try {
      console.log('Signing out user');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        Sentry.captureException(error, {
          extra: { context: 'Sign out' }
        });
        throw error;
      }
    } catch (error) {
      console.error('Error in signOut function:', error);
      Sentry.captureException(error);
      throw error;
    }
  };
  
  return {
    session,
    user,
    loading,
    signOut,
  };
}