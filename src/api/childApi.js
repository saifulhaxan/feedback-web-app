import Fetcher from "../library/Fetcher";

// Create Child
export const createChild = async (data) => {
  return Fetcher.post("user/child", data);
};

// Edit Child
export const editChild = async (childId, data) => {
  return Fetcher.put(`user/child/${childId}`, data);
};

// Get All Children (Primary/Secondary)
export const getAllChildren = async () => {
  return Fetcher.get("user/child");
};

// Get Single Child by ID
export const getChildById = async (childId) => {
  return Fetcher.get(`user/child/${childId}`);
};

// Verify Child Email
export const verifyChildEmail = async (data) => {
  return Fetcher.post("user/child/verify-email", data);
};

// Send Child OTP
export const sendChildOtp = async (data) => {
  return Fetcher.post("user/child/send-otp", data);
};

// Add Secondary Parent
export const addSecondaryParent = async (data) => {
  try {
    console.log("🔗 Making link-request API call with data:", data);
    const response = await Fetcher.post("user/child/link-request", data);
    console.log("✅ Link-request API response:", response);
    return response;
  } catch (error) {
    console.error("❌ Link-request API error:", error);
    throw error;
  }
};

// Edit Secondary Parent
export const editSecondaryParent = async (childId, parentId, data) => {
  return Fetcher.patch(`user/child/${childId}/secondary-parent/${parentId}`, data);
};

// Respond to Secondary Parent Request
export const respondToSecondaryParentRequest = async (requestId, action) => {
  return Fetcher.post(`user/child/link-request/${requestId}/respond`, { action });
};

// Get Child Link Requests
export const getChildLinkRequests = async (sent = false) => {
  return Fetcher.get(`user/child/link-requests?sent=${sent}`);
};

// Get All Secondary Parents
export const getAllSecondaryParents = async () => {
  return Fetcher.get("user/child/secondary-parents");
};

// Get All Secondary Parents and Children
export const getSecondaryParentsAndChildren = async () => {
  return Fetcher.get("user/child/secondary-parents-and-children");
};

// Remove Secondary Parent
export const removeSecondaryParent = async (parentId) => {
  return Fetcher.delete(`user/child/secondary-parent/${parentId}`);
};

// Cancel Secondary Parent Request
export const cancelSecondaryParentRequest = async (requestId) => {
  return Fetcher.delete(`user/child/link-request/${requestId}`);
};

export default {
  createChild,
  editChild,
  getAllChildren,
  verifyChildEmail,
  sendChildOtp,
  addSecondaryParent,
  editSecondaryParent,
  respondToSecondaryParentRequest,
  getChildLinkRequests,
  getAllSecondaryParents,
  getSecondaryParentsAndChildren,
  removeSecondaryParent,
  cancelSecondaryParentRequest
}; 