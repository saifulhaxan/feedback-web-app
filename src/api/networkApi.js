import Fetcher from "../library/Fetcher";

// Get All Connections
export const getAllConnections = async (projectId, query, skip = 0, take = 20) => {
  const params = new URLSearchParams();
  if (projectId) {
    params.append('projectId', projectId);
  }
  if (query) {
    params.append('q', query);
  }
  params.append('skip', skip);
  params.append('take', take);
  const queryString = params.toString();
  return Fetcher.get(`user/network/connections?${queryString}`);
};

// Get Pending Connection Requests
export const getPendingConnectionRequests = async (skip = 0, take = 20, query) => {
  const params = new URLSearchParams({ skip: String(skip), take: String(take) });
  if (query) params.append('q', query);
  return Fetcher.get(`user/network/connections/requests?${params.toString()}`);
};

// Get Sent Connection Requests
export const getSentConnectionRequests = async (skip = 0, take = 20, query) => {
  const params = new URLSearchParams({ skip: String(skip), take: String(take) });
  if (query) params.append('q', query);
  return Fetcher.get(`user/network/connections/requests/sent?${params.toString()}`);
};

// Send Connection Request
export const sendConnectionRequest = async (data) => {
  console.log("🔍 Debug - API received data:", data);
  
  // The backend requires requesterId, so we need to include it
  const payload = {
    requesterId: data.requesterId,
    receiverId: data.receiverId,
    connectAs: data.connectAs
  };
  
  // Add optional customDescription if provided
  if (data.customDescription) {
    payload.customDescription = data.customDescription;
  }
  
  console.log("🔍 Debug - API sending payload:", payload);
  
  return Fetcher.post("user/network/connections/request", payload);
};

// Respond to Connection Request
export const respondToConnectionRequest = async (requestId, action) => {
  return Fetcher.post(`user/network/connections/respond/${requestId}`, { action });
};

// Cancel Sent Connection Request
export const cancelConnectionRequest = async (requestId) => {
  return Fetcher.delete(`user/network/connections/request/${requestId}`);
};

// Delete Connection
export const deleteConnection = async (connectionId) => {
  return Fetcher.delete(`user/network/connections/${connectionId}`);
};

// Get User Profile
export const getUserProfile = async (userId) => {
  return Fetcher.get(`user/network/user-profile/${userId}`);
};

// Get Connection Options
export const getConnectionOptions = async () => {
  return Fetcher.get("user/network/connectas-options");
};

// Search Users
export const searchUsers = async (query) => {
  return Fetcher.get(`user/network/search?q=${encodeURIComponent(query)}`);
};

export default {
  getAllConnections,
  getPendingConnectionRequests,
  getSentConnectionRequests,
  sendConnectionRequest,
  respondToConnectionRequest,
  cancelConnectionRequest,
  deleteConnection,
  getUserProfile,
  getConnectionOptions,
  searchUsers
}; 