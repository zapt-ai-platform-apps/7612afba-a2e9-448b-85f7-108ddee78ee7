import { api } from '@/modules/core/utils/api';

export const itemsApi = {
  async getItem(itemId) {
    return api.get(`/api/items/${itemId}`);
  },
  
  async getItemsByCollection(collectionId) {
    return api.get(`/api/collections/${collectionId}/items`);
  },
  
  async createItem(collectionId, itemData) {
    return api.post(`/api/collections/${collectionId}/items`, itemData);
  },
  
  async updateItem(itemId, itemData) {
    return api.patch(`/api/items/${itemId}`, itemData);
  },
  
  async deleteItem(itemId) {
    return api.delete(`/api/items/${itemId}`);
  },
  
  async uploadProofOfPurchase(itemId, files) {
    return api.post(`/api/uploadProofOfPurchase`, { itemId, files });
  },
  
  async searchImages(query) {
    return api.post(`/api/googleImageSearch`, { query });
  }
};