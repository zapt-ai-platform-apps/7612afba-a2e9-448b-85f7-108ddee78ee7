import { get, patch } from '@/modules/core/utils/api';

/**
 * Fetches the current user's profile
 * @returns {Promise<Object>} The user profile data
 */
export async function getCurrentUser() {
  try {
    console.log('Fetching current user profile');
    return await get('/api/user');
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

/**
 * Updates the current user's profile
 * @param {Object} profileData - The profile data to update
 * @returns {Promise<Object>} The updated user profile
 */
export async function updateUserProfile(profileData) {
  try {
    console.log('Updating user profile with data:', profileData);
    return await patch('/api/user', profileData);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

/**
 * Fetches the current user's detailed profile with settings
 * @returns {Promise<Object>} The user profile data with settings
 */
export async function getUserProfile() {
  try {
    console.log('Fetching user profile with settings');
    return await get('/api/user');
  } catch (error) {
    console.error('Error fetching user profile with settings:', error);
    throw error;
  }
}

/**
 * API client for user-related operations
 */
export const usersApi = {
  getCurrentUser,
  updateUserProfile,
  getUserProfile
};