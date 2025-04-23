import { api } from '@/modules/core/utils/api';

export const usersApi = {
  async getUserProfile() {
    return api.get('/api/user');
  },
  
  async updateUserProfile(userData) {
    return api.patch('/api/user', userData);
  }
};