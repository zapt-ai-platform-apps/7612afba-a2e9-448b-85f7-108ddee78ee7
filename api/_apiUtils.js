import { initializeZapt } from '@zapt/zapt-js';
import * as Sentry from '@sentry/node';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

Sentry.init({
  dsn: process.env.VITE_PUBLIC_SENTRY_DSN,
  environment: process.env.VITE_PUBLIC_APP_ENV,
  initialScope: {
    tags: {
      type: 'backend',
      projectId: process.env.VITE_PUBLIC_APP_ID
    }
  }
});

const { supabase } = initializeZapt(process.env.VITE_PUBLIC_APP_ID);

/**
 * Authenticates a user based on the Authorization header
 * @param {Object} req - The request object
 * @returns {Promise<Object>} - The authenticated user
 * @throws {Error} - If authentication fails
 */
export async function authenticateUser(req) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      throw new Error('Missing Authorization header');
    }
    
    // Log auth header format (safely)
    console.log('Auth header format:', 
      authHeader.startsWith('Bearer ') ? 'Bearer [token]' : authHeader.substring(0, 15) + '...');
    
    // Check for Bearer prefix
    if (!authHeader.startsWith('Bearer ')) {
      throw new Error('Authorization header must start with Bearer');
    }
    
    const token = authHeader.split(' ')[1];
    
    // Add token validation checks
    if (!token) {
      throw new Error('Token is missing from Authorization header');
    }
    
    // Check token format (JWT has 3 parts separated by dots)
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error(`Malformed token: expected 3 parts but got ${parts.length}`);
    }
    
    console.log('Calling supabase.auth.getUser with token');
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error) {
      console.error('Authentication error:', error);
      throw new Error(`Invalid token: ${error.message}`);
    }
    
    if (!data || !data.user) {
      throw new Error('User not found in response');
    }
    
    return data.user;
  } catch (error) {
    console.error('Authentication failed:', error);
    Sentry.captureException(error, {
      extra: {
        path: req.url,
        method: req.method,
        headers: {
          ...req.headers,
          authorization: req.headers.authorization ? 
            `${req.headers.authorization.substring(0, 15)}...` : 'none'
        }
      }
    });
    throw error;
  }
}

/**
 * Creates a database client
 * @returns {Object} - The database client
 * @throws {Error} - If database connection fails
 */
export function createDbClient() {
  try {
    const dbUrl = process.env.COCKROACH_DB_URL;
    
    if (!dbUrl) {
      throw new Error('Missing COCKROACH_DB_URL environment variable');
    }
    
    const client = postgres(dbUrl);
    const db = drizzle(client);
    
    return { client, db };
  } catch (error) {
    console.error('Database connection failed:', error);
    Sentry.captureException(error);
    throw error;
  }
}

/**
 * Responds with an error
 * @param {Object} res - The response object
 * @param {number} statusCode - The HTTP status code
 * @param {string} message - The error message
 */
export function sendError(res, statusCode, message) {
  return res.status(statusCode).json({ error: message });
}

/**
 * Handles async route handlers and catches exceptions
 * @param {Function} handler - The async route handler
 * @returns {Function} - The wrapped route handler
 */
export function asyncHandler(handler) {
  return async (req, res) => {
    try {
      return await handler(req, res);
    } catch (error) {
      console.error('API Error:', error);
      Sentry.captureException(error, {
        extra: { 
          path: req.url,
          method: req.method,
          query: req.query,
          body: req.body
        }
      });
      
      // Determine appropriate status code
      let statusCode = 500;
      if (error.message === 'Missing Authorization header' || 
          error.message === 'Invalid token' || 
          error.message.includes('Malformed token') ||
          error.message.startsWith('Authorization header must')) {
        statusCode = 401;
      } else if (error.message === 'User not found' || error.message === 'Resource not found') {
        statusCode = 404;
      } else if (error.message.includes('Permission denied')) {
        statusCode = 403;
      }
      
      return sendError(res, statusCode, error.message);
    }
  };
}