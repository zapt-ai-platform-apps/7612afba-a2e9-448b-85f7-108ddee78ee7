import { supabase, recordLogin } from '@/supabaseClient';
import { eventBus } from '@/modules/core/utils/eventBus';
import { events } from '../events';
import { validateUser, validateSession } from '../validators';
import * as Sentry from '@sentry/browser';

export const getSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    
    if (data.session) {
      return validateSession(data.session, {
        actionName: 'getSession',
        location: 'auth/internal/services.js',
        direction: 'outgoing',
        moduleFrom: 'auth',
        moduleTo: 'client'
      });
    }
    
    return null;
  } catch (error) {
    console.error('Error getting session:', error);
    Sentry.captureException(error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    eventBus.publish(events.USER_SIGNED_OUT, {});
  } catch (error) {
    console.error('Error signing out:', error);
    Sentry.captureException(error);
    throw error;
  }
};

export const recordUserLogin = async (email, appEnv) => {
  if (!email) {
    throw new Error('Email is required for recordLogin');
  }
  
  try {
    await recordLogin(email, appEnv);
    console.log('Login recorded for:', email);
  } catch (error) {
    console.error('Failed to record login:', error);
    Sentry.captureException(error);
    throw error;
  }
};