import { supabase } from '@/supabaseClient';
import * as Sentry from '@sentry/browser';

/**
 * Makes an authenticated API request to the backend
 * @param {string} url - The API endpoint URL
 * @param {Object} options - Request options
 * @param {string} options.method - The HTTP method (GET, POST, etc.)
 * @param {Object} options.body - The request body (for POST, PUT, etc.)
 * @param {Object} options.headers - Additional headers to include
 * @returns {Promise<Object>} - The response data
 */
export async function apiRequest(url, options = {}) {
  try {
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Failed to get session:', sessionError);
      throw new Error('Authentication failed: Unable to get session');
    }
    
    if (!session || !session.access_token) {
      console.error('No valid session or access token available');
      throw new Error('Authentication failed: No valid session');
    }
    
    // Log token format for debugging (partially hidden for security)
    const tokenParts = session.access_token.split('.');
    console.log(`API Request to ${url} with token format: ${tokenParts.length} parts`);
    
    // Prepare headers with authentication
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
      ...options.headers,
    };
    
    // Prepare request
    const requestOptions = {
      method: options.method || 'GET',
      headers,
      ...options,
    };
    
    // Add body if needed
    if (options.body && (requestOptions.method !== 'GET')) {
      requestOptions.body = JSON.stringify(options.body);
    }
    
    console.log(`Making ${requestOptions.method} request to ${url}`);
    const response = await fetch(url, requestOptions);
    
    // Check if response is ok
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API request failed (${response.status}):`, errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    
    // Parse response
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request error:', error);
    Sentry.captureException(error, {
      extra: {
        url,
        method: options.method || 'GET',
      },
    });
    throw error;
  }
}

/**
 * Makes a GET request to the API
 * @param {string} url - The API endpoint URL
 * @returns {Promise<Object>} - The response data
 */
export function get(url) {
  return apiRequest(url);
}

/**
 * Makes a POST request to the API
 * @param {string} url - The API endpoint URL
 * @param {Object} data - The request body
 * @returns {Promise<Object>} - The response data
 */
export function post(url, data) {
  return apiRequest(url, {
    method: 'POST',
    body: data,
  });
}

/**
 * Makes a PUT request to the API
 * @param {string} url - The API endpoint URL
 * @param {Object} data - The request body
 * @returns {Promise<Object>} - The response data
 */
export function put(url, data) {
  return apiRequest(url, {
    method: 'PUT',
    body: data,
  });
}

/**
 * Makes a PATCH request to the API
 * @param {string} url - The API endpoint URL
 * @param {Object} data - The request body
 * @returns {Promise<Object>} - The response data
 */
export function patch(url, data) {
  return apiRequest(url, {
    method: 'PATCH',
    body: data,
  });
}

/**
 * Makes a DELETE request to the API
 * @param {string} url - The API endpoint URL
 * @returns {Promise<Object>} - The response data
 */
export function del(url) {
  return apiRequest(url, {
    method: 'DELETE',
  });
}