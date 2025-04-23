import { api } from '@/modules/core/utils/api';
import * as Sentry from '@sentry/browser';

/**
 * Collections API client
 */
export const collectionsApi = {
  /**
   * Get all collections for the current user
   * @returns {Promise<Object>} The response data
   */
  getCollections: async () => {
    try {
      return await api.get('/api/collections');
    } catch (error) {
      console.error('Error fetching collections:', error);
      Sentry.captureException(error);
      throw error;
    }
  },
  
  /**
   * Get a specific collection by ID
   * @param {string} collectionId - The collection ID
   * @returns {Promise<Object>} The response data
   */
  getCollection: async (collectionId) => {
    try {
      return await api.get(`/api/collections/${collectionId}`);
    } catch (error) {
      console.error(`Error fetching collection ${collectionId}:`, error);
      Sentry.captureException(error, {
        extra: { collectionId }
      });
      throw error;
    }
  },
  
  /**
   * Create a new collection
   * @param {Object} collectionData - The collection data
   * @returns {Promise<Object>} The response data
   */
  createCollection: async (collectionData) => {
    try {
      return await api.post('/api/collections', collectionData);
    } catch (error) {
      console.error('Error creating collection:', error);
      Sentry.captureException(error, {
        extra: { collectionData }
      });
      throw error;
    }
  },
  
  /**
   * Update an existing collection
   * @param {string} collectionId - The collection ID
   * @param {Object} collectionData - The updated collection data
   * @returns {Promise<Object>} The response data
   */
  updateCollection: async (collectionId, collectionData) => {
    try {
      return await api.put(`/api/collections/${collectionId}`, collectionData);
    } catch (error) {
      console.error(`Error updating collection ${collectionId}:`, error);
      Sentry.captureException(error, {
        extra: { collectionId, collectionData }
      });
      throw error;
    }
  },
  
  /**
   * Delete a collection
   * @param {string} collectionId - The collection ID
   * @returns {Promise<Object>} The response data
   */
  deleteCollection: async (collectionId) => {
    try {
      return await api.delete(`/api/collections/${collectionId}`);
    } catch (error) {
      console.error(`Error deleting collection ${collectionId}:`, error);
      Sentry.captureException(error, {
        extra: { collectionId }
      });
      throw error;
    }
  },
  
  /**
   * Get collection types
   * @returns {Promise<Object>} The response data
   */
  getCollectionTypes: async () => {
    try {
      return await api.get('/api/collections/types');
    } catch (error) {
      console.error('Error fetching collection types:', error);
      Sentry.captureException(error);
      throw error;
    }
  },
  
  /**
   * Generate a report for a collection
   * @param {Object} reportData - The report configuration
   * @returns {Promise<Object>} The generated report
   */
  generateReport: async (reportData) => {
    try {
      console.log('Sending report generation request with data:', reportData);
      const response = await api.post('/api/generateReport', reportData);
      console.log('Report generation response:', response);
      return response;
    } catch (error) {
      console.error('Error generating report:', error);
      Sentry.captureException(error, {
        extra: { reportData }
      });
      throw error;
    }
  },
  
  /**
   * Import collection data
   * @param {Object} importData - The data to import
   * @returns {Promise<Object>} The response data
   */
  importCollection: async (importData) => {
    try {
      return await api.post('/api/collections/import', importData);
    } catch (error) {
      console.error('Error importing collection data:', error);
      Sentry.captureException(error);
      throw error;
    }
  },
  
  /**
   * Export collection data
   * @param {string} collectionId - The collection ID
   * @param {string} format - Export format (json, csv)
   * @returns {Promise<Object>} The exported data
   */
  exportCollection: async (collectionId, format = 'json') => {
    try {
      return await api.get(`/api/collections/${collectionId}/export?format=${format}`);
    } catch (error) {
      console.error(`Error exporting collection ${collectionId}:`, error);
      Sentry.captureException(error, {
        extra: { collectionId, format }
      });
      throw error;
    }
  }
};