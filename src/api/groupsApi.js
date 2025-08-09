import Fetcher from "../library/Fetcher";

// Create Group (Normal or Monitoring)
export const createGroup = async (data) => {
  return Fetcher.post("user/network/groups", data);
};

// Get All Groups
export const getAllGroups = async (type = "normal") => {
  return Fetcher.get(`user/network/groups?type=${type}`);
};

// Get Group Detail by ID
export const getGroupById = async (groupId) => {
  return Fetcher.get(`user/network/groups/${groupId}`);
};

// Search Public Groups
export const searchPublicGroups = async (query) => {
  return Fetcher.get(`user/network/public-groups/search?q=${query}`);
};

// Join Public Group
export const joinPublicGroup = async (groupId) => {
  return Fetcher.post(`user/network/public-groups/${groupId}/join`);
};

// Add Member to Group
export const addMemberToGroup = async (data) => {
  return Fetcher.post("user/network/groups/member", data);
};

// Accept/Reject Group Invitation
export const respondToGroupInvitation = async (data) => {
  return Fetcher.post("user/network/groups/member/respond", data);
};

// Cancel Group Invites
export const cancelGroupInvite = async (data) => {
  return Fetcher.delete("user/network/groups/member/invite", data);
};

// Get All Pending Group Invitations
export const getPendingGroupInvitations = async () => {
  return Fetcher.get("user/network/groups/member/pending");
};

// Get All Sent Group Invitations
export const getSentGroupInvitations = async () => {
  return Fetcher.get("user/network/groups/member/sent");
};

// Update Group
export const updateGroup = async (groupId, data) => {
  return Fetcher.patch(`user/network/groups/${groupId}`, data);
};

// Remove Member from Group
export const removeMemberFromGroup = async (data) => {
  return Fetcher.post("user/network/groups/member/remove", data);
};

// Leave Group
export const leaveGroup = async (data) => {
  return Fetcher.post("user/network/groups/leave", data);
};

// Delete Group
export const deleteGroup = async (groupId) => {
  return Fetcher.delete(`user/network/groups/${groupId}`);
};

export default {
  createGroup,
  getAllGroups,
  getGroupById,
  searchPublicGroups,
  joinPublicGroup,
  addMemberToGroup,
  respondToGroupInvitation,
  cancelGroupInvite,
  getPendingGroupInvitations,
  getSentGroupInvitations,
  updateGroup,
  removeMemberFromGroup,
  leaveGroup,
  deleteGroup
}; 