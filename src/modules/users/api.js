import { authenticatedFetch } from '@/modules/core/utils/api';

/**
 * Fetches the user profile from the API
 * @returns {Promise<Object>} The user profile data
 */
export async function fetchUserProfile() {
  return authenticatedFetch('/api/user');
}

/**
 * Updates the user profile
 * @param {Object} profileData - The profile data to update
 * @returns {Promise<Object>} The updated user profile
 */
export async function updateUserProfile(profileData) {
  return authenticatedFetch('/api/user', {
    method: 'PATCH',
    body: JSON.stringify(profileData),
  });
}