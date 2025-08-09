import { createUserProfile } from "../api/profileApi";

/**
 * Create profile in one operation
 * @param {Object} profileData - Profile data
 * @param {string} profileData.title - User title
 * @param {string} profileData.expertise - User expertise
 * @param {string} profileData.roleId - Role ID
 * @param {string} [profileData.username] - Optional username
 * @returns {Promise} Profile creation result
 */
export const createProfile = async (profileData) => {
  try {
    // Create profile
    const profileResponse = await createUserProfile(profileData);
    
    return {
      profile: profileResponse,
      success: true
    };
  } catch (error) {
    console.error('Failed to create profile:', error);
    throw error;
  }
};

export default {
  createProfile
}; 