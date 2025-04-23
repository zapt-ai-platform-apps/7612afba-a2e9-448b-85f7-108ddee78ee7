import { supabase } from '@/supabaseClient';
import * as Sentry from '@sentry/browser';

/**
 * Make an authenticated API request ensuring the token is properly formatted
 * @param {string} url - The API endpoint
 * @param {Object} options - Fetch options (method, body, etc.)
 * @returns {Promise<Response>} - The fetch response
 */
export async function authenticatedRequest(url, options = {}) {
  try {
    console.log(`Making authenticated request to: ${url}`);
    
    // Get current session
    const { data, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      throw new Error(`Failed to get session: ${sessionError.message}`);
    }
    
    if (!data?.session?.access_token) {
      console.error('No active session found when attempting API request');
      throw new Error('No active session or access token found');
    }
    
    // Create headers with authentication
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${data.session.access_token}`,
      ...options.headers
    };
    
    console.log('Request headers set with Authorization token');
    
    // Make the request with authenticated headers
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    // Handle non-2xx responses
    if (!response.ok) {
      const errorText = await response.text();
      let errorJSON;
      
      try {
        errorJSON = JSON.parse(errorText);
      } catch (e) {
        // If not JSON, use text as is
      }
      
      const errorMessage = errorJSON?.error || errorText || `Request failed with status ${response.status}`;
      console.error(`API error (${response.status}):`, errorMessage);
      
      const error = new Error(errorMessage);
      error.status = response.status;
      error.response = response;
      throw error;
    }
    
    return response;
  } catch (error) {
    // Log the error with Sentry
    Sentry.captureException(error, {
      extra: {
        url,
        method: options.method || 'GET',
        requestBody: options.body ? JSON.parse(options.body) : undefined
      }
    });
    
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * Wrapper for common request methods
 */
export const api = {
  /**
   * Make a GET request
   * @param {string} url - The API endpoint
   * @param {Object} options - Additional fetch options
   * @returns {Promise<any>} - The parsed JSON response
   */
  async get(url, options = {}) {
    const response = await authenticatedRequest(url, {
      method: 'GET',
      ...options
    });
    return response.json();
  },
  
  /**
   * Make a POST request
   * @param {string} url - The API endpoint
   * @param {Object} data - The data to send
   * @param {Object} options - Additional fetch options
   * @returns {Promise<any>} - The parsed JSON response
   */
  async post(url, data, options = {}) {
    const response = await authenticatedRequest(url, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    });
    return response.json();
  },
  
  /**
   * Make a PUT request
   * @param {string} url - The API endpoint
   * @param {Object} data - The data to send
   * @param {Object} options - Additional fetch options
   * @returns {Promise<any>} - The parsed JSON response
   */
  async put(url, data, options = {}) {
    const response = await authenticatedRequest(url, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options
    });
    return response.json();
  },
  
  /**
   * Make a PATCH request
   * @param {string} url - The API endpoint
   * @param {Object} data - The data to send
   * @param {Object} options - Additional fetch options
   * @returns {Promise<any>} - The parsed JSON response
   */
  async patch(url, data, options = {}) {
    const response = await authenticatedRequest(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
      ...options
    });
    return response.json();
  },
  
  /**
   * Make a DELETE request
   * @param {string} url - The API endpoint
   * @param {Object} options - Additional fetch options
   * @returns {Promise<any>} - The parsed JSON response
   */
  async delete(url, options = {}) {
    const response = await authenticatedRequest(url, {
      method: 'DELETE',
      ...options
    });
    return response.json();
  }
};