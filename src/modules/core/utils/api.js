import { supabase } from '@/supabaseClient';
import * as Sentry from '@sentry/browser';

/**
 * Makes an authenticated request to the API
 * @param {string} url - The API endpoint URL
 * @param {Object} options - Request options (method, body, etc.)
 * @returns {Promise<Object>} - The response data
 * @throws {Error} - If the request fails
 */
export async function authenticatedFetch(url, options = {}) {
  try {
    // Get the current session
    const { data, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      throw new Error(`Failed to get session: ${sessionError.message}`);
    }
    
    const session = data?.session;
    
    if (!session || !session.access_token) {
      throw new Error('No active session or access token');
    }
    
    // Add the Authorization header
    const headers = {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    // Make the request
    console.log(`Making ${options.method || 'GET'} request to ${url}`);
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    // Handle the response
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || `Request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }
    
    return response.json();
  } catch (error) {
    console.error('API request failed:', error);
    
    Sentry.captureException(error, {
      extra: {
        url,
        method: options.method || 'GET',
        requestBody: options.body ? JSON.stringify(options.body).substring(0, 200) : undefined
      },
    });
    
    throw error;
  }
}