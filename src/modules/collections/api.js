import { api } from '@/modules/core/utils/api';

export const collectionsApi = {
  async getCollections() {
    return api.get('/api/collections');
  },
  
  async getCollection(collectionId) {
    return api.get(`/api/collections/${collectionId}`);
  },
  
  async createCollection(collectionData) {
    return api.post('/api/collections', collectionData);
  },
  
  async updateCollection(collectionId, collectionData) {
    return api.patch(`/api/collections/${collectionId}`, collectionData);
  },
  
  async deleteCollection(collectionId) {
    return api.delete(`/api/collections/${collectionId}`);
  },
  
  async getCollectionTypes() {
    return api.get('/api/collection-types');
  },
  
  async generateReport(reportData) {
    return api.post('/api/generateReport', reportData);
  },
  
  async exportCollection(collectionId, format = 'json') {
    return api.get(`/api/collections/importExport?collectionId=${collectionId}&format=${format}`);
  },
  
  async importCollection(collectionId, items) {
    return api.post('/api/collections/importExport', { collectionId, items });
  }
};