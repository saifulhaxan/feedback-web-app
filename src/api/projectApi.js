import Fetcher from "../library/Fetcher";

export const createProject = async (data) => {
  // Handle both FormData and JSON data
  if (data instanceof FormData) {
    // Current implementation - FormData with file upload
  return Fetcher.post("user/projects", data);
  } else {
    // JSON structure as specified
    const payload = {
      name: data.name,
      problem: data.problem,
      solution: data.solution,
      solutionFunction: data.solutionFunction,
      description: data.description,
      imageUrl: data.imageUrl,
      youtubeLink: data.youtubeLink,
      status: data.status || "In Progress"
    };
    
    return Fetcher.post("user/projects", payload);
  }
};

export const stepProject = async (data) => {
  // Handle both FormData and JSON data
  if (data instanceof FormData) {
    // Current implementation - FormData with file upload
  return Fetcher.post("user/stepConfig", data);
  } else {
    // JSON structure as specified - use exact key names
    const payload = {
      projectId: data.projectId, // Use projectId as specified
      startTime: data.startTime,
      endTime: data.endTime,
      stepsPerHour: data.stepsPerHour,
      breakTime: data.breakTime,
      beepAudio: data.beepAudio,
      popupText: data.popupText
    };
    
    return Fetcher.post("user/stepConfig", payload);
  }
};

export const getAllProjects = async (data) => {
  return Fetcher.get("user/projects/?skip=0&take=20", data);
};

export const deleteProject = async (data) => {
  return Fetcher.delete(`user/projects/${data.id}`, data);
};

export const editProject = async ({ id, formData }) => {
  // console.log(id, formData, "This is project id and formData");

  return Fetcher.put(`user/projects/${id}`, formData);
};

export const editProjectBasic = async ({ id, formData }) => {
  return Fetcher.put(`user/projects/${id}`, formData);
};

export const editProjectSettings = async ({ id, formData }) => {
  return Fetcher.put(`user/stepConfig/${id}`, formData);
};


// Get relationship types (for child management)
export const getMyUser = async (data) => {
  return Fetcher.get("user/child/relationship-types", data);
};

// Project Sharing APIs
export const shareProject = async (data) => {
  return Fetcher.post("user/projects/share", data);
};

export const getSharedProjects = async () => {
  return Fetcher.get("user/projects/shared");
};

export const getProjectsOverview = async () => {
  return Fetcher.get("user/projects/overview");
};

// Project Lifecycle APIs
export const startProject = async (projectId) => {
  return Fetcher.post(`user/projects/${projectId}/start`);
};

export const endProject = async (uuid) => {
  return Fetcher.post("user/projects/end", { uuid });
};

// Project Assignment APIs
export const getAssignedProjectsToMe = async () => {
  return Fetcher.get("user/projects/assigned-to-me");
};

export const getProjectsAssignedByMe = async () => {
  return Fetcher.get("user/projects/assigned-by-me");
};

export const assignProject = async (projectId, assignedToId) => {
  return Fetcher.post(`user/projects/${projectId}/assign`, { assignedToId });
};

export const unassignProject = async (projectId, assignedToId) => {
  return Fetcher.delete(`user/projects/${projectId}/unassign`, { assignedToId });
};

// Step Config Management APIs
export const getStepConfigById = async (configId) => {
  return Fetcher.get(`user/stepConfig/${configId}`);
};

export const deleteStepConfig = async (configId) => {
  return Fetcher.delete(`user/stepConfig/${configId}`);
};




export default {
  createProject,
  stepProject,
  getAllProjects,
  deleteProject,
  editProject,
  editProjectBasic,
  editProjectSettings,
  getMyUser,
  shareProject,
  getSharedProjects,
  getProjectsOverview,
  startProject,
  endProject,
  getAssignedProjectsToMe,
  getProjectsAssignedByMe,
  assignProject,
  unassignProject,
  getStepConfigById,
  deleteStepConfig
};
