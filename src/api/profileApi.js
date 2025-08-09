import Fetcher from "../library/Fetcher";

/**
 * Create a user profile with the exact API structure
 * @param {Object} profileData - Profile data object
 * @param {string} profileData.title - User's title (e.g., "Dr", "Mr", "Ms")
 * @param {string} profileData.expertise - User's expertise area
 * @param {string} profileData.roleId - Role ID from the roles API
 * @param {string} [profileData.username] - Optional username
 * @returns {Promise} API response
 */
export const createUserProfile = async (profileData) => {
  // Validate required fields
  const { title, expertise, roleId, username } = profileData;
  
  if (!title || !expertise || !roleId) {
    throw new Error("Title, expertise, and roleId are required");
  }

  // Create the exact payload structure as specified
  const payload = {
    title,
    expertise,
    roleId,
    username: username || ""
  };

  try {
    // Create profile via API
    const profileResponse = await Fetcher.post("user/auth/create-profile", payload);
    return profileResponse;
  } catch (error) {
    console.error('Profile creation failed:', error);
    throw error;
  }
};

/**
 * Example usage function that demonstrates how to create a profile
 * with the exact structure you specified
 */
export const createProfileExample = async () => {
  const profileData = {
    title: "Dr",
    expertise: "hey2",
    roleId: "2",
    username: "hey2 parent"
  };

  try {
    const response = await createUserProfile(profileData);
    console.log("Profile created successfully:", response);
    return response;
  } catch (error) {
    console.error("Failed to create profile:", error);
    throw error;
  }
};

export default {
  createUserProfile,
  createProfileExample
}; 