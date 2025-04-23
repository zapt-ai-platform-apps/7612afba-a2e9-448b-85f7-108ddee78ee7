import { supabase, recordLogin } from '@/supabaseClient';
import { api } from '@/modules/core/utils/api';
import * as Sentry from '@sentry/browser';

/**
 * Sign in with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} - Authentication result
 */
export async function signInWithPassword(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Record login for analytics
    if (data?.user?.email) {
      try {
        await recordLogin(data.user.email, import.meta.env.VITE_PUBLIC_APP_ENV);
      } catch (e) {
        console.error('Failed to record login:', e);
      }
    }

    return { data, error: null };
  } catch (error) {
    console.error('Sign in error:', error);
    Sentry.captureException(error, {
      extra: { context: 'signInWithPassword', email }
    });
    return { data: null, error };
  }
}

/**
 * Sign in with magic link
 * @param {string} email - User email
 * @returns {Promise<Object>} - Magic link result
 */
export async function signInWithMagicLink(email) {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Magic link error:', error);
    Sentry.captureException(error, {
      extra: { context: 'signInWithMagicLink', email }
    });
    return { data: null, error };
  }
}

/**
 * Sign in with a social provider
 * @param {string} provider - The provider (google, facebook, etc.)
 * @returns {Promise<Object>} - Social sign in result
 */
export async function signInWithSocialProvider(provider) {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error(`Sign in with ${provider} error:`, error);
    Sentry.captureException(error, {
      extra: { context: 'signInWithSocialProvider', provider }
    });
    return { data: null, error };
  }
}

/**
 * Sign out the current user
 * @returns {Promise<Object>} - Sign out result
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Sign out error:', error);
    Sentry.captureException(error, {
      extra: { context: 'signOut' }
    });
    return { error };
  }
}

/**
 * Get the current user's profile
 * @returns {Promise<Object>} - User profile
 */
export async function getUserProfile() {
  try {
    const userData = await api.get('/api/user');
    return { data: userData, error: null };
  } catch (error) {
    console.error('Get user profile error:', error);
    
    // Create a more user-friendly error
    let friendlyError = error;
    if (error.message && error.message.includes('User not found')) {
      // If this happens, it likely means the user record hasn't been created yet
      friendlyError = new Error('Your profile is being set up. Please try again in a moment.');
    }
    
    Sentry.captureException(error, {
      extra: { context: 'getUserProfile' }
    });
    return { data: null, error: friendlyError };
  }
}

/**
 * Update the current user's profile
 * @param {Object} profileData - User profile data to update
 * @returns {Promise<Object>} - Updated user profile
 */
export async function updateUserProfile(profileData) {
  try {
    const updatedData = await api.patch('/api/user', profileData);
    return { data: updatedData, error: null };
  } catch (error) {
    console.error('Update user profile error:', error);
    Sentry.captureException(error, {
      extra: { context: 'updateUserProfile', profileData }
    });
    return { data: null, error };
  }
}