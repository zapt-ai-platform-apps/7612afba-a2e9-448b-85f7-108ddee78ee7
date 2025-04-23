import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiRequest, get, post, put, patch, del } from './api';
import { supabase } from '@/supabaseClient';
import * as Sentry from '@sentry/browser';

// Mock dependencies
vi.mock('@/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn()
    }
  }
}));

vi.mock('@sentry/browser', () => ({
  captureException: vi.fn()
}));

describe('API utilities', () => {
  // Mock fetch
  const mockFetch = vi.fn();
  global.fetch = mockFetch;

  // Setup mock responses
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Mock successful auth response
    supabase.auth.getSession.mockResolvedValue({
      data: {
        session: {
          access_token: 'header.payload.signature'
        }
      },
      error: null
    });
    
    // Mock successful API response
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { id: 1 } }),
      text: async () => '{"success":true}'
    });
  });

  describe('apiRequest', () => {
    it('should make a request with the correct authorization header', async () => {
      await apiRequest('/api/test');
      
      expect(mockFetch).toHaveBeenCalledWith('/api/test', expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Bearer header.payload.signature'
        })
      }));
    });
    
    it('should throw an error when session is not available', async () => {
      supabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null
      });
      
      await expect(apiRequest('/api/test')).rejects.toThrow('Authentication failed');
    });
    
    it('should throw an error when session is invalid', async () => {
      supabase.auth.getSession.mockResolvedValue({
        data: { session: {} },  // Missing access_token
        error: null
      });
      
      await expect(apiRequest('/api/test')).rejects.toThrow('Authentication failed');
    });
    
    it('should throw an error when fetch fails', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
        text: async () => 'Unauthorized'
      });
      
      await expect(apiRequest('/api/test')).rejects.toThrow('API request failed with status 401');
      expect(Sentry.captureException).toHaveBeenCalled();
    });
  });

  describe('HTTP method wrappers', () => {
    it('should make GET request', async () => {
      await get('/api/test');
      
      expect(mockFetch).toHaveBeenCalledWith('/api/test', expect.objectContaining({
        method: 'GET'
      }));
    });
    
    it('should make POST request with body', async () => {
      const data = { name: 'Test' };
      await post('/api/test', data);
      
      expect(mockFetch).toHaveBeenCalledWith('/api/test', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(data)
      }));
    });
    
    it('should make PUT request with body', async () => {
      const data = { name: 'Test' };
      await put('/api/test', data);
      
      expect(mockFetch).toHaveBeenCalledWith('/api/test', expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify(data)
      }));
    });
    
    it('should make PATCH request with body', async () => {
      const data = { name: 'Test' };
      await patch('/api/test', data);
      
      expect(mockFetch).toHaveBeenCalledWith('/api/test', expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify(data)
      }));
    });
    
    it('should make DELETE request', async () => {
      await del('/api/test');
      
      expect(mockFetch).toHaveBeenCalledWith('/api/test', expect.objectContaining({
        method: 'DELETE'
      }));
    });
  });
});