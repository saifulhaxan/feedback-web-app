import Fetcher from "../library/Fetcher";

// Get Monitoring Group Progress Overview
export const getMonitoringGroupProgress = async (groupId) => {
  return Fetcher.get(`user/monitoring/groups/${groupId}/progress`);
};

// Get All Projects Progress in a Monitoring Group
export const getGroupProjectsProgress = async (groupId) => {
  return Fetcher.get(`user/monitoring/groups/${groupId}/projects/progress`);
};

// Get Member Progress in a Monitoring Group
export const getGroupMembersProgress = async (groupId) => {
  return Fetcher.get(`user/monitoring/groups/${groupId}/members/progress`);
};

// Get Real-time Progress Updates
export const getGroupProgressUpdates = async (groupId, lastUpdateTime) => {
  return Fetcher.get(`user/monitoring/groups/${groupId}/updates?since=${lastUpdateTime}`);
};

// Get Group Analytics and Reports
export const getGroupAnalytics = async (groupId, dateRange) => {
  return Fetcher.get(`user/monitoring/groups/${groupId}/analytics?startDate=${dateRange.start}&endDate=${dateRange.end}`);
};

// Get Project Performance Metrics
export const getProjectPerformanceMetrics = async (groupId, projectId) => {
  return Fetcher.get(`user/monitoring/groups/${groupId}/projects/${projectId}/metrics`);
};

// Get Member Performance Metrics
export const getMemberPerformanceMetrics = async (groupId, memberId) => {
  return Fetcher.get(`user/monitoring/groups/${groupId}/members/${memberId}/metrics`);
};

// Send Monitoring Alerts
export const sendMonitoringAlert = async (groupId, alertData) => {
  return Fetcher.post(`user/monitoring/groups/${groupId}/alerts`, alertData);
};

// Get Monitoring Alerts History
export const getMonitoringAlerts = async (groupId) => {
  return Fetcher.get(`user/monitoring/groups/${groupId}/alerts`);
};

// Update Group Monitoring Settings
export const updateGroupMonitoringSettings = async (groupId, settings) => {
  return Fetcher.put(`user/monitoring/groups/${groupId}/settings`, settings);
};

// Get Group Monitoring Settings
export const getGroupMonitoringSettings = async (groupId) => {
  return Fetcher.get(`user/monitoring/groups/${groupId}/settings`);
};

// Export Group Progress Report
export const exportGroupProgressReport = async (groupId, format = 'pdf') => {
  return Fetcher.get(`user/monitoring/groups/${groupId}/export?format=${format}`, {
    responseType: 'blob'
  });
};

// Get Group Progress Timeline
export const getGroupProgressTimeline = async (groupId) => {
  return Fetcher.get(`user/monitoring/groups/${groupId}/timeline`);
};

// Get Group Performance Summary
export const getGroupPerformanceSummary = async (groupId) => {
  return Fetcher.get(`user/monitoring/groups/${groupId}/performance-summary`);
};

export default {
  getMonitoringGroupProgress,
  getGroupProjectsProgress,
  getGroupMembersProgress,
  getGroupProgressUpdates,
  getGroupAnalytics,
  getProjectPerformanceMetrics,
  getMemberPerformanceMetrics,
  sendMonitoringAlert,
  getMonitoringAlerts,
  updateGroupMonitoringSettings,
  getGroupMonitoringSettings,
  exportGroupProgressReport,
  getGroupProgressTimeline,
  getGroupPerformanceSummary
};

