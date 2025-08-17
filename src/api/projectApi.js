import Fetcher from "../library/Fetcher";

export const createProject = async (data) => {
  if (data instanceof FormData) {
    return Fetcher.post("user/projects", data);
  } else {
    const payload = {
      name: data.name,
      problem: data.problem,
      solution: data.solution,
      solutionFunction: data.solutionFunction,
      description: data.description,
      imageUrl: data.imageUrl,
      youtubeLink: data.youtubeLink,
      status: data.status || "In Progress",
    };
    return Fetcher.post("user/projects", payload);
  }
};

export const stepProject = async (data) => {
  if (data instanceof FormData) {
    return Fetcher.post("user/stepConfig", data);
  } else {
    const payload = {
      projectId: data.projectId,
      startTime: data.startTime,
      endTime: data.endTime,
      stepsPerHour: data.stepsPerHour, // Already a string from the component
      breakTime: data.breakTime,
      beepAudio: data.beepAudio,
      popupText: data.popupText,
    };
    return Fetcher.post("user/stepConfig", payload);
  }
};

// New function for conditional step config API calls
export const createOrUpdateStepConfig = async (data, isCongfig = false) => {
  if (data instanceof FormData) {
    // If isCongfig is true, use PUT method (update existing)
    if (isCongfig) {
      const projectId = data.get('projectId');
      return Fetcher.put(`user/stepConfig/${projectId}`, data);
    } else {
      // If isCongfig is false, use POST method (create new)
      return Fetcher.post("user/stepConfig", data);
    }
  } else {
    const payload = {
      projectId: data.projectId,
      startTime: data.startTime,
      endTime: data.endTime,
      stepsPerHour: data.stepsPerHour, // Already a string from the component
      breakTime: data.breakTime,
      beepAudio: data.beepAudio,
      popupText: data.popupText,
    };
    
    // If isCongfig is true, use PUT method (update existing)
    if (isCongfig) {
      return Fetcher.put(`user/stepConfig/${data.projectId}`, payload);
    } else {
      // If isCongfig is false, use POST method (create new)
      return Fetcher.post("user/stepConfig", payload);
    }
  }
};

export const getAllProjects = async (data) => {
  return Fetcher.get("user/projects/?skip=0&take=20", data);
};

export const deleteProject = async (data) => {
  return Fetcher.delete(`user/projects/${data.id}`, data);
};

export const editProject = async ({ id, formData }) => {
  return Fetcher.put(`user/projects/${id}`, formData);
};

export const editProjectBasic = async ({ id, formData }) => {
  return Fetcher.put(`user/projects/${id}`, formData);
};

export const editProjectSettings = async ({ id, formData }) => {
  if (formData instanceof FormData) {
    return Fetcher.put(`user/stepConfig/${id}`, formData);
  } else {
    // Handle JSON data
    const payload = {
      projectId: formData.projectId,
      startTime: formData.startTime,
      endTime: formData.endTime,
      stepsPerHour: formData.stepsPerHour, // Already a string from the component
      breakTime: formData.breakTime,
      beepAudio: formData.beepAudio,
      popupText: formData.popupText,
    };
    return Fetcher.put(`user/stepConfig/${id}`, payload);
  }
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

// Progress Detail / Controls
export const getProjectProgressDetail = async (projectId) => {
  return Fetcher.get(`user/projects/${projectId}/progress`);
};

export const resumeProjectProgress = async (projectId) => {
  return Fetcher.post(`user/projects/${projectId}/resume`);
};

export const pauseProjectProgress = async (projectId) => {
  return Fetcher.post(`user/projects/${projectId}/pause`);
};

export const updateProjectProgress = async (projectId, progress) => {
  return Fetcher.put(`user/projects/${projectId}/progress`, { progress });
};

export default {
  createProject,
  stepProject,
  createOrUpdateStepConfig,
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
  deleteStepConfig,
  getProjectProgressDetail,
  resumeProjectProgress,
  pauseProjectProgress,
  updateProjectProgress,
}
