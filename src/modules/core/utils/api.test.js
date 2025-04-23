import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api, authenticatedRequest } from './api';
import { supabase } from '@/supabaseClient';

// Mock supabase
vi.mock('@/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn()
    }
  },
  recordLogin: vi.fn()
}));

// Mock fetch
global.fetch = vi.fn();
global.console.error = vi.fn();
global.console.log = vi.fn();

// Mock Sentry
vi.mock('@sentry/browser', () => ({
  captureException: vi.fn()
}));

describe('API Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default successful response
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true })
    });
  });
  
  describe('authenticatedRequest', () => {
    it('should include Authorization header with correct token', async () => {
      // Mock session
      supabase.auth.getSession.mockResolvedValue({
        data: {
          session: {
            access_token: 'test-token'
          }
        },
        error: null
      });
      
      // Make request
      await authenticatedRequest('/api/test');
      
      // Assert correct Authorization header was set
      expect(global.fetch).toHaveBeenCalledWith('/api/test', expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Bearer test-token'
        })
      }));
    });
    
    it('should throw error when no session is available', async () => {
      // Mock no session
      supabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null
      });
      
      // Assert error is thrown
      await expect(authenticatedRequest('/api/test')).rejects.toThrow('No active session or access token found');
    });
    
    it('should throw error when session error occurs', async () => {
      // Mock session error
      supabase.auth.getSession.mockResolvedValue({
        data: null,
        error: new Error('Session retrieval failed')
      });
      
      // Assert error is thrown
      await expect(authenticatedRequest('/api/test')).rejects.toThrow('Failed to get session');
    });
    
    it('should handle API error responses correctly', async () => {
      // Mock session
      supabase.auth.getSession.mockResolvedValue({
        data: {
          session: {
            access_token: 'test-token'
          }
        },
        error: null
      });
      
      // Mock error response
      global.fetch.mockResolvedValue({
        ok: false,
        status: 401,
        text: async () => JSON.stringify({ error: 'Unauthorized' })
      });
      
      // Assert error is thrown with correct message
      await expect(authenticatedRequest('/api/test')).rejects.toThrow('Unauthorized');
    });
  });
  
  describe('api methods', () => {
    beforeEach(() => {
      // Mock successful session for all tests
      supabase.auth.getSession.mockResolvedValue({
        data: {
          session: {
            access_token: 'test-token'
          }
        },
        error: null
      });
    });
    
    it('should make GET request correctly', async () => {
      await api.get('/api/test');
      
      expect(global.fetch).toHaveBeenCalledWith('/api/test', expect.objectContaining({
        method: 'GET'
      }));
    });
    
    it('should make POST request with correct body', async () => {
      const testData = { name: 'Test' };
      await api.post('/api/test', testData);
      
      expect(global.fetch).toHaveBeenCalledWith('/api/test', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(testData)
      }));
    });
    
    it('should make PATCH request with correct body', async () => {
      const testData = { name: 'Updated Test' };
      await api.patch('/api/test/1', testData);
      
      expect(global.fetch).toHaveBeenCalledWith('/api/test/1', expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify(testData)
      }));
    });
    
    it('should make DELETE request correctly', async () => {
      await api.delete('/api/test/1');
      
      expect(global.fetch).toHaveBeenCalledWith('/api/test/1', expect.objectContaining({
        method: 'DELETE'
      }));
    });
  });
});