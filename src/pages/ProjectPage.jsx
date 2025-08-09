import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FaList } from "react-icons/fa";
import { FiGrid } from "react-icons/fi";
import { FaCirclePlus } from "react-icons/fa6";
import ProjectCard from "../components/ProjectCard";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { IoCloudUploadOutline } from "react-icons/io5";
import { useMutation } from "@tanstack/react-query";
import { 
  createProject, 
  editProject, 
  editProjectBasic, 
  editProjectSettings, 
  getAllProjects, 
  getMyUser, 
  stepProject,
  getSharedProjects,
  getProjectsOverview,
  startProject,
  endProject,
  getAssignedProjectsToMe,
  getProjectsAssignedByMe,
  assignProject,
  unassignProject,
  shareProject
} from "../api/projectApi";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";

import { EditorState, convertToRaw, ContentState, convertFromHTML } from "draft-js";
import draftToHtml from "draftjs-to-html";
import useUserStore from "../store/userStore";
import { PiCodesandboxLogo } from "react-icons/pi";
import { MdEdit } from "react-icons/md";
import Fetcher from "../library/Fetcher";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: 350, sm: "70%", md: "70%" },
  height: "90%",
  overflow: "auto",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 2,
};

const style2 = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: 350, sm: "40%", md: "40%" },
  height: "auto",
  overflow: "auto",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 2,
};

function ProjectPage() {
  const [gridView, setGridView] = useState(true);
  const [listView, setListView] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setModalTab(1); // Always show first tab
    setEditMode(false); // Not editing by default
    setEditingProjectId(null);
    resetFields(); // Clear form fields
    setOpen(true);
  };

  const handleClose = () => {
    resetFields();
    setEditMode(false);
    setEditingProjectId(null);
    setModalTab(1);
    setOpen(false);
  };

  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [uploadedFile, setUploadedFile] = useState(null);
  const [activeTab, setActiveTab] = useState("All");
  const [innerActiveTab, setInnerActiveTab] = useState("me");

  // New states for form fields
  const [projectName, setProjectName] = useState("");
  const [problemName, setProblemName] = useState("");
  const [solutionName, setSolutionName] = useState("");
  const [solutionFunctionName, setSolutionFunctionName] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [modalTab, setModalTab] = useState(1);
  const [projectData, setProjectData] = useState();

  // Step 2 states
  const [startDate, setStartDate] = useState("");
  const [finishDate, setFinishDate] = useState("");
  const [breakDate, setBreakDate] = useState("");
  const [beepAudio, setBeepAudio] = useState(null);
  const [beepAtBreak, setBeepAtBreak] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [stepsPerHour, setStepsPerHour] = useState(""); // empty string, not 1
  const [firstStepData, setFirstStepData] = useState("");
  const [status, setStatus] = useState("");

  //Edit project states
  const [editMode, setEditMode] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  
  // Format toggle state
  const [useJsonFormat, setUseJsonFormat] = useState(false);
  const [useStepConfigJsonFormat, setUseStepConfigJsonFormat] = useState(false);


  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const userId = useUserStore((state) => state.userData?.user?.id);

  // console.log(userId, "User ID");

  const changeToGrid = () => {
    setGridView(true);
    setListView(false);
  };

  const changeToList = () => {
    setGridView(false);
    setListView(true);
  };

  ///////// Get ALL Projects Start //////////////////////
  // Mutation
  const getAllProjectsMutation = useMutation(getAllProjects, {
    onSuccess: (data) => {
      // toast.success("Project Created Successfully!");
      console.log("All Project Data Success Response:", data);
      const fullProjects = data?.data?.data?.projects.map((project) => ({
        ...project,
        fullImageUrl: project.imageUrl ? `https://feedbackwork.net/feedbackapi/${project.imageUrl}` : null,
      }));

      setProjectData(fullProjects);
      // handleClose(); // Close and reset
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to create project");
      console.error("API Error:", error);
    },
  });

  useEffect(() => {
    getAllProjectsMutation.mutate();
    getMyUsersMutation.mutate();
  }, []);



  //// Get Shared Poject ////

  const [sharedByMe, setSharedByMe] = useState();
  const [sharedWithMe, setSharedWithMe] = useState();
  const [userList, setUserList] = useState();

  const getSharedProject = () => {
    // Get projects shared by me (projects I own that are shared with others)
    getProjectsOverview()
      .then((res) => {
        console.log(res, "projects overview");
        // Filter projects that have sharedWithUsers (projects I shared)
        const sharedByMeProjects = res?.data?.data?.items?.filter(item => 
          item.sharedWithUsers && item.sharedWithUsers.length > 0
        ) || [];
        setSharedByMe(sharedByMeProjects);
        console.log("All overview items:", res?.data?.data?.items);
        console.log("Shared by me projects:", sharedByMeProjects);
        console.log("Filtered items with sharedWithUsersssss:", res?.data?.data?.items?.filter(item => item.sharedWithUsers));
      })
      .catch((err) => {
        console.error("Failed to fetch projects overview", err);
      });

    // Get projects shared with me (projects others shared with me)
    getSharedProjects()
      .then((res) => {
        console.log(res, "shared projects");
        // Transform the data to match the expected structure
        const sharedWithMeProjects = res?.data?.data?.sharedProjects?.map(item => ({
          ...item.project,
          sharedBy: item.sharedBy
        })) || [];
        setSharedWithMe(sharedWithMeProjects);
        console.log("Shared with me projects:", sharedWithMeProjects);
      })
      .catch((err) => {
        console.error("Failed to fetch shared projects", err);
      });
  }

  ///////// Get ALL Projects End //////////////////////

  /////////////////////// First Step Logic //////////////////////////////

  const handleSwitchTabs = (e) => {
    setActiveTab(e.target.name);
    if (e.target.name == "Shared") {
      console.log("Switching to Shared tab, fetching shared projects...");
      getSharedProject()
    }
  };

  const handleInnerSwitchTabs = (e) => {
    setInnerActiveTab(e.target.name);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png"];
      const allowedExtensions = [".jpg", ".jpeg", ".png"];
      const fileName = file.name.toLowerCase();
      const hasAllowedExtension = allowedExtensions.some((ext) => fileName.endsWith(ext));
      if (!allowedTypes.includes(file.type) || !hasAllowedExtension) {
        toast.error("Only JPG and PNG files are allowed!");
        setUploadedFile(null);
        event.target.value = ""; // Reset the input
        return;
      }
      setUploadedFile(file);
      console.log("Uploaded file:", file);
    }
  };

  const resetFields = () => {
    setProjectName("");
    setProblemName("");
    setSolutionName("");
    setSolutionFunctionName("");
    setYoutubeLink("");
    setUploadedFile(null);
    setEditorState(EditorState.createEmpty());

    setStartDate("");
    setFinishDate("");
    setBreakDate("");
    setUploadedFile(null);
    setBeepAudio(null);
    setPopupText("");
    setUseJsonFormat(false); // Reset format toggle
    setUseStepConfigJsonFormat(false); // Reset stepConfig format toggle
  };

  // Mutation
  const createProjectMutation = useMutation(createProject, {
    onSuccess: async (data) => {
      toast.success(data?.data?.data?.message || "Project Created Successfully!");
      console.log("API Success Response:", data);
      
      // Get the created project data
      const projectData = data?.data?.data?.project;
      setFirstStepData(projectData);
      getAllProjectsMutation.mutate();
      setModalTab(2);
      

    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to create project");
      console.error("API Error:", error);
    },
  });

  /////Edit Project Mutation/////
  const editProjectBasicMutation = useMutation(editProjectBasic, {
    onSuccess: async (data) => {
      toast.success(data?.data?.data?.message || "Project basic info updated successfully!");
      getAllProjectsMutation.mutate();
      setModalTab(2); // Move to Step 2
      

    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update project basic info.");
    },
  });

  const editProjectSettingsMutation = useMutation(editProjectSettings, {
    onSuccess: async (data) => {
      toast.success(data?.data?.data?.message || "Project settings updated successfully!");
      setOpen(false); // Close modal
      getAllProjectsMutation.mutate(); // Refresh project list
      

    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update project settings.");
    },
  });

   const getMyUsersMutation = useMutation(getMyUser, {
    onSuccess: (data) => {
      setUserList(data?.data?.data?.userConnections)
      console.log("API Success Response:", data);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to create project");
      console.error("API Error:", error);
    },
  });


  console.log('user', userList)

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔴 Validation
    if (!projectName.trim()) {
      toast.error("Project Name is required!");
      return; // ❗️ Stop here - Do NOT continue to API
    }
    if (!problemName.trim()) {
      toast.error("Problem Name is required!");
      return; // ❗️ Stop here - Do NOT continue to API
    }
    if (!solutionName.trim()) {
      toast.error("Solution Name is required!");
      return; // ❗️ Stop here - Do NOT continue to API
    }

    // Check if we have a file upload or want to use JSON format
    if (uploadedFile || !useJsonFormat) {
      // Use FormData for file uploads or when JSON format is not selected
    const formData = new FormData();
    formData.append("name", projectName);
    formData.append("problem", problemName);
    formData.append("solution", solutionName);
    formData.append("solutionFunction", solutionFunctionName);
    formData.append("youtubeLink", youtubeLink);
    formData.append("userId", userId);
    formData.append("description", draftToHtml(convertToRaw(editorState.getCurrentContent())));
    if (uploadedFile) {
      formData.append("imageUrl", uploadedFile);
    }

    if (editMode) {
      // UPDATE PROJECT (STEP 1)
      editProjectBasicMutation.mutate({
        id: editingProjectId,
        formData,
      });
    } else {
      // CREATE PROJECT
      createProjectMutation.mutate(formData);
      }
    } else {
      // Use JSON format (your specified structure) when JSON format is selected and no file upload
      const projectData = {
        name: projectName,
        problem: problemName,
        solution: solutionName,
        solutionFunction: solutionFunctionName,
        description: draftToHtml(convertToRaw(editorState.getCurrentContent())),
        youtubeLink: youtubeLink,
        status: "In Progress"
        // Note: userId is not included in JSON format as per your specification
      };

      if (editMode) {
        // UPDATE PROJECT (STEP 1) - still use FormData for consistency
        const formData = new FormData();
        formData.append("name", projectName);
        formData.append("problem", problemName);
        formData.append("solution", solutionName);
        formData.append("solutionFunction", solutionFunctionName);
        formData.append("youtubeLink", youtubeLink);
        formData.append("userId", userId);
        formData.append("description", draftToHtml(convertToRaw(editorState.getCurrentContent())));

        editProjectBasicMutation.mutate({
          id: editingProjectId,
          formData,
        });
      } else {
        // CREATE PROJECT with JSON format
        createProjectMutation.mutate(projectData);
      }
    }
  };

  /////////////////////Step 2 logic here//////////////////////
  const handleBeepFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBeepAudio(file);
    }
  };

  // Mutation for second step
  const secondStepMutation = useMutation(stepProject, {
    onSuccess: (data) => {
      toast.success(data?.data?.data?.message || "Project Settings Saved!");
      console.log("Project Settings Response:", data);
      // Tab close ya move to next step
      getAllProjectsMutation.mutate();
      setOpen(false); // Close modal
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to save settings");
    },
  });

  // Submit handler
  const handleSecondStepSubmit = (e) => {
    e.preventDefault();

    const toISOString = (value) => {
      return value ? new Date(value).toISOString() : null;
    };

    // Check if we want to use JSON format for stepConfig
    if (useStepConfigJsonFormat && !beepAudio) {
      // Use JSON format (your specified structure) when no file upload
      const stepConfigData = {
        projectId: editingProjectId || firstStepData?.id,
        startTime: toISOString(startDate),
        endTime: toISOString(finishDate),
        stepsPerHour: stepsPerHour,
        breakTime: toISOString(breakDate),
        beepAudio: "https://example.com/beep.mp3", // Default URL for JSON format
        popupText: popupText
      };

      if (editMode) {
        // For edit mode, still use FormData for consistency
    const formData = new FormData();
        formData.append("projectId", editingProjectId || firstStepData?.id); // Use projectId as specified
    formData.append("startTime", toISOString(startDate));
    formData.append("endTime", toISOString(finishDate));
    formData.append("breakTime", toISOString(breakDate));
    formData.append("beepAtBreakTime", beepAtBreak);
        formData.append("stepsPerHour", stepsPerHour);
        formData.append("popupText", popupText);

        if (beepAudio) {
          formData.append("beepAudio", beepAudio);
        }

        editProjectSettingsMutation.mutate({
          id: editingProjectId,
          formData,
        });
      } else {
        // CREATE STEP CONFIG with JSON format
        secondStepMutation.mutate(stepConfigData);
      }
    } else {
      // Use FormData for file uploads or when JSON format is not selected
      const formData = new FormData();
      formData.append("projectId", editingProjectId || firstStepData?.id); // Use projectId as specified
      formData.append("startTime", toISOString(startDate));
      formData.append("endTime", toISOString(finishDate));
      formData.append("breakTime", toISOString(breakDate));
      formData.append("beepAtBreakTime", beepAtBreak);
      formData.append("stepsPerHour", stepsPerHour);
    formData.append("popupText", popupText);

    if (beepAudio) {
      formData.append("beepAudio", beepAudio);
    }

    if (editMode) {
      editProjectSettingsMutation.mutate({
        id: editingProjectId,
        formData,
      });
    } else {
      secondStepMutation.mutate(formData);
      }
    }
  };

  //Edit project login Start///////
  const handleEditProject = async (projectData) => {
    setEditMode(true);
    setEditingProjectId(projectData.id);

    // Prefill Step 1
    setProjectName(projectData.name || "");
    setProblemName(projectData.problem || "");
    setSolutionName(projectData.solution || "");
    setSolutionFunctionName(projectData.solutionFunction || "");
    setYoutubeLink(projectData.youtubeLink || "");
    setStatus(projectData.status || "");

    const contentState = ContentState.createFromBlockArray(convertFromHTML(projectData.description || ""));
    setEditorState(EditorState.createWithContent(contentState));

    // Image load
    if (projectData.fullImageUrl) {
      try {
        const response = await fetch(projectData.fullImageUrl);
        const blob = await response.blob();
        const file = new File([blob], "project-image.jpeg", {
          type: blob.type,
        });
        setUploadedFile(file);
      } catch (error) {
        setUploadedFile(null);
      }
    } else {
      setUploadedFile(null);
    }

    // Prefill Step 2 (NEW PART)
    if (projectData.stepConfig) {
      const config = projectData.stepConfig;

      setStartDate(config.startTime ? new Date(config.startTime).toISOString().slice(0, 16) : "");
      setFinishDate(config.endTime ? new Date(config.endTime).toISOString().slice(0, 16) : "");
      setBreakDate(config.breakTime ? new Date(config.breakTime).toISOString().slice(0, 16) : "");
      setBeepAtBreak(config.beepAtBreakTime || false);
      setPopupText(config.popupText || "");

      if (config.beepAudio) {
        try {
          const beepUrl = `https://feedback.work.net/feedbackapi/${config.beepAudio}`;
          const res = await fetch(beepUrl);
          const blob = await res.blob();
          const file = new File([blob], "beep-audio.mp3", { type: blob.type });
          setBeepAudio(file);
        } catch (err) {
          setBeepAudio(null);
        }
      }
    } else {
      setStartDate("");
      setFinishDate("");
      setBreakDate("");
      setBeepAtBreak(false);
      setPopupText("");
      setBeepAudio(null);
    }

    setModalTab(1);
    setOpen(true);
  };

  /////Edit project logic end/////

  // Padding helper
  const pad = (n) => n.toString().padStart(2, "0");

  // Today's datetime for min attributes
  const now = new Date();
  const minDateTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;

  // Calculate min finish datetime (1 hour after start)
  const getMinFinishDateTime = (startDate) => {
    if (!startDate) return minDateTime;
    const start = new Date(startDate);
    start.setHours(start.getHours() + 1);
    return `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}T${pad(start.getHours())}:${pad(start.getMinutes())}`;
  };

  const getBreakMinDateTime = (startDate) => {
    if (!startDate) return "";
    // Add 1 minute to ensure strictly after start time
    const start = new Date(startDate);
    start.setMinutes(start.getMinutes() + 1);
    const pad = (n) => n.toString().padStart(2, "0");
    return `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}T${pad(start.getHours())}:${pad(start.getMinutes())}`;
  };

  const getBreakMaxDateTime = (finishDate) => {
    if (!finishDate) return "";
    // Subtract 1 minute to ensure strictly before finish time
    const finish = new Date(finishDate);
    finish.setMinutes(finish.getMinutes() - 1);
    const pad = (n) => n.toString().padStart(2, "0");
    return `${finish.getFullYear()}-${pad(finish.getMonth() + 1)}-${pad(finish.getDate())}T${pad(finish.getHours())}:${pad(finish.getMinutes())}`;
  };

  // Handler for finish date change
  const handleFinishDateChange = (e) => {
    const value = e.target.value;
    if (!startDate) {
      setFinishDate(value);
      return;
    }
    const minFinish = new Date(getMinFinishDateTime(startDate));
    const selectedFinish = new Date(value);
    if (selectedFinish < minFinish) {
      toast.error("Finish time must be at least 1 hour after start time.");
      setFinishDate("");
      return;
    }
    setFinishDate(value);
  };

  // Handler for break date change
  const handleBreakDateChange = (e) => {
    const value = e.target.value;
    if (!startDate) {
      setBreakDate(value);
      return;
    }
    const minBreak = new Date(getBreakMinDateTime(startDate));
    const maxBreak = new Date(getBreakMaxDateTime(finishDate));
    const selectedBreak = new Date(value);
    if (selectedBreak < minBreak) {
      toast.error("Break time must be at least 1 minute after start time.");
      setBreakDate("");
      return;
    }
    if (selectedBreak > maxBreak) {
      toast.error("Break time must be at most 1 minute before finish time.");
      setBreakDate("");
      return;
    }
    setBreakDate(value);
  };

  // Test Supabase connection


  return (
    <section className="main_wrapper">
      {/* ---------- Top Content ---------- */}
      <div className="container-fluid ps-5 pe-5">
        <div className="row">
          <div className="col-lg-12">
            <div className="heading_wrapper d-flex align-items-center justify-content-between mt-4 mb-4">
              <h1>Projects</h1>
              <div className="d-flex align-items-center gap-2">

              <div className="viewbtns">
                <Button className={`viewBtn1 ${listView ? "viewActiveBtn" : ""}`} onClick={changeToList}>
                  <FaList className={`viewBtn1 ${listView ? "listViewActive" : "listView"}`} />
                </Button>
                <Button className={`viewBtn2 ${gridView ? "viewActiveBtn" : ""}`} onClick={changeToGrid}>
                  <FiGrid className={`viewBtn1 ${gridView ? "listViewActive" : "listView"}`} />
                </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- Create Project Button ---------- */}
        <div className="row">
          <div className="col-lg-12">
            <button className="createProject">
              <div onClick={handleOpen}>
                <FaCirclePlus className="add-project" />
                <p>Create Project</p>
              </div>
            </button>
          </div>
        </div>

        {/* ---------- Tabs ---------- */}
        <div className="connection-btn-wrap d-flex mb-3">
          {["All", "Shared"].map((tab) => (
            <Button
              key={tab}
              sx={{
                textTransform: "none",
                bgcolor: activeTab === tab ? "#EBF5FF" : "white",
                color: activeTab === tab ? "#0064D1" : "black",
                fontWeight: "bold",
              }}
              className="me-2"
              name={tab}
              onClick={handleSwitchTabs}
            >
              {tab}
            </Button>
          ))}
        </div>

        {/* ---------- Content Cards ---------- */}
        {activeTab === "All" && (
          <div className="row">
            {!projectData || projectData.length === 0 ? (
              <div className="col-lg-12 text-center py-5">
                <div style={{ fontSize: "64px", color: "#ccc" }}>
                  <PiCodesandboxLogo />
                </div>
                <h4>No Projects Found</h4>
                <p>Click on "Create Project" to add your first project.</p>
              </div>
            ) : (
              projectData.map((item, index) => (
                <div className={gridView ? "col-lg-4" : "col-lg-12"} key={index}>
                  <ProjectCard userData={userList} projectData={item} index={index} onEdit={handleEditProject} onDeleted={() => getAllProjectsMutation.mutate()} />
                </div>
              ))
            )}
          </div>
        )}
        {activeTab === "Shared" && (
          <>
            <div className="connection-btn-wrap d-flex mb-3">
              {["me", "by"].map((tab) => (
                <Button
                  key={tab}
                  sx={{
                    textTransform: "none",
                    bgcolor: innerActiveTab === tab ? "#EBF5FF" : "white",
                    color: innerActiveTab === tab ? "#0064D1" : "black",
                    fontWeight: "bold",
                  }}
                  className="me-2"
                  name={tab}
                  onClick={handleInnerSwitchTabs}
                >
                  {tab === "me" ? "Shared with me" : "Shared by me"}
                </Button>
              ))}


            </div>

            <div className="row">
              {
                innerActiveTab === "me" ? (
                  // "Shared with me" tab - projects others shared with me
                  sharedWithMe && sharedWithMe?.length > 0 ? (
                    sharedWithMe.map((item, index) => (
                    <div className={gridView ? "col-lg-4" : "col-lg-12"} key={index}>
                      <ProjectCard 
                        userData={userList} 
                        projectData={item} 
                        sharedBy={item.sharedBy}
                        index={index} 
                        onEdit={handleEditProject} 
                        onDeleted={() => getAllProjectsMutation.mutate()} 
                      />
                    </div>
                  ))
                ) : (
                    <div className="col-lg-12 text-center py-5">
                      <div style={{ fontSize: "64px", color: "#ccc" }}>
                        <PiCodesandboxLogo />
                    </div>
                      <h4>No Shared Projects Found</h4>
                      <p>No projects have been shared with you yet.</p>
                    </div>
                  )
                ) : (
                  // "Shared by me" tab - projects I shared with others
                  sharedByMe && sharedByMe?.length > 0 ? (
                    sharedByMe.map((item, index) => (
                      <div className={gridView ? "col-lg-4" : "col-lg-12"} key={index}>
                        <ProjectCard 
                          userData={userList} 
                          projectData={item.project} 
                          sharedWithUsers={item.sharedWithUsers}
                          index={index} 
                          onEdit={handleEditProject} 
                          onDeleted={() => getAllProjectsMutation.mutate()} 
                        />
                      </div>
                    ))
                  ) : (
              <div className="col-lg-12 text-center py-5">
                <div style={{ fontSize: "64px", color: "#ccc" }}>
                  <PiCodesandboxLogo />
                </div>
                      <h4>No Shared Projects Found</h4>
                      <p>You haven't shared any projects yet.</p>
              </div>
                  )
                )
              }
            </div>
          </>
        )}
      </div>

      {/* ---------- Create Project Modal ---------- */}
      <Modal
        open={open}
        onClose={(event, reason) => {
          if (reason !== "backdropClick") {
            handleClose();
          }
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          {modalTab == 1 && (
            <Box sx={style}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>{editMode ? "Edit Project" : "Create Project"}</h3>

                {editMode && (
                  <button variant="outlined" size="small" onClick={() => setModalTab(2)} className="transparent-btn">
                    <MdEdit />
                  </button>
                )}
              </div>
              <form onSubmit={handleSubmit} className="mb-4 authForm">
                <div className="d-flex flex-column-responsive">
                  {/* Project Name */}
                  <div className="form-group mb-3 w-50 pe-md-3">
                    <label className="auth-label">Project Name*</label>
                    <div className="authInputWrap d-flex align-items-center ps-3">
                      <input
                        type="text"
                        className="form-control auth-input"
                        placeholder="Type here"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Problem Name */}
                  <div className="form-group mb-3 w-50 ps-md-3">
                    <label className="auth-label">Problem Name*</label>
                    <div className="authInputWrap d-flex align-items-center ps-3">
                      <input
                        type="text"
                        className="form-control auth-input"
                        placeholder="Type here"
                        value={problemName}
                        onChange={(e) => setProblemName(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-column-responsive">
                  {/* Solution Name */}
                  <div className="form-group mb-3 w-50 pe-md-3">
                    <label className="auth-label">Solution Name*</label>
                    <div className="authInputWrap d-flex align-items-center ps-3">
                      <input
                        type="text"
                        className="form-control auth-input"
                        placeholder="Type here"
                        value={solutionName}
                        onChange={(e) => setSolutionName(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Solution Function Name */}
                  <div className="form-group mb-3 w-50 ps-md-3">
                    <label className="auth-label">Solution Function Name</label>
                    <div className="authInputWrap d-flex align-items-center ps-3">
                      <input
                        type="text"
                        className="form-control auth-input"
                        placeholder="Type here"
                        value={solutionFunctionName}
                        onChange={(e) => setSolutionFunctionName(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Youtube Link */}
                <div className="form-group mb-3 w-100">
                  <label className="auth-label">Youtube Link</label>
                  <div className="authInputWrap d-flex align-items-center ps-3">
                    <input
                      type="text"
                      className="form-control auth-input"
                      placeholder="Insert link"
                      value={youtubeLink}
                      onChange={(e) => setYoutubeLink(e.target.value)}
                    />
                  </div>
                </div>

                {/* Project Description */}
                <div className="form-group mb-3 w-100">
                  <label className="auth-label">Project Description</label>
                  <Editor
                    editorState={editorState}
                    onEditorStateChange={onEditorStateChange}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                  />
                </div>

                {/* Upload Image */}
                <div className="form-group mb-3 w-100">
                  <div className="w-100">
                    <h5>Add Image</h5>
                    {uploadedFile ? (
                      <div style={{ position: "relative", display: "inline-block" }}>
                        <img
                          src={URL.createObjectURL(uploadedFile)}
                          alt="Uploaded preview"
                          style={{
                            maxWidth: "300px",
                            maxHeight: "200px",
                            borderRadius: "8px",
                            border: "2px solid #ddd"
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setUploadedFile(null)}
                          style={{
                            position: "absolute",
                            top: "-8px",
                            right: "-8px",
                            background: "#dc3545",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "24px",
                            height: "24px",
                            fontSize: "14px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                          }}
                          title="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div onClick={() => document.getElementById("file-input").click()} style={{ cursor: "pointer" }}>
                        <Button
                          style={{
                            background: "none",
                            border: "none",
                            padding: 0,
                          }}
                          className="status-upload-bg"
                        >
                          <IoCloudUploadOutline className="status-uploadIcon" />
                          <p className="status-upload-text">Upload file here</p>
                          <p className="status-upload-options">(Only .jpg, .jpeg, .png files will be accepted)</p>
                        </Button>
                        <p className="status-no-upload text-center">no files uploaded yet</p>
                      </div>
                    )}
                    <input
                      id="file-input"
                      type="file"
                      style={{ display: "none" }}
                      accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                      onChange={handleFileUpload}
                    />
                  </div>
                </div>



                {/* Buttons */}
                <div className="d-flex justify-content-between status-btn-bar mt-5 mb-5">
                  <div className="backbtn">
                    <Button onClick={handleClose} style={{ marginRight: "8px" }}>
                      Cancel
                    </Button>
                  </div>
                  <div className="nextbtn">
                    <Button type="submit" disabled={createProjectMutation.isLoading}>
                      {createProjectMutation.isLoading ? <CircularProgress size={20} style={{ color: "#fff" }} /> : "Create Project"}
                    </Button>
                  </div>
                </div>
              </form>
            </Box>
          )}

          {modalTab == 2 && (
            <Box sx={style2}>
              <form onSubmit={handleSecondStepSubmit}>
                <h3 className="mb-4">Project Settings</h3>
                {/* Start/Finish Dates */}
                <div className="d-flex flex-column-responsive">
                  <div className="form-group mb-3 w-50 pe-md-3">
                    <label className="auth-label">Start Time/Date</label>
                    <div className="authInputWrap d-flex align-items-center ps-3">
                      <input
                        type="datetime-local"
                        className="form-control auth-input"
                        value={startDate}
                        min={minDateTime}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-group mb-3 w-50 ps-md-3">
                    <label className="auth-label">Finish Time/Date</label>
                    <div className="authInputWrap d-flex align-items-center ps-3">
                      <input
                        type="datetime-local"
                        className="form-control auth-input"
                        value={finishDate}
                        min={getMinFinishDateTime(startDate)}
                        onChange={handleFinishDateChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Break Date */}
                <div className="form-group mb-3 w-100">
                  <label className="auth-label">Break Time/Date</label>
                  <div className="authInputWrap d-flex align-items-center ps-3">
                    <input
                      type="datetime-local"
                      className="form-control auth-input"
                      value={breakDate}
                      min={getBreakMinDateTime(startDate)}
                      max={getBreakMaxDateTime(finishDate)}
                      onChange={handleBreakDateChange}
                    />
                  </div>
                </div>

                {/* Upload Beep Audio */}
                <div className="form-group mb-3 w-100">
                  <label className="auth-label">Load Beep Audio</label>
                  <div className="authInputWrap d-flex align-items-center ps-3">
                    <input type="file" className="form-control auth-input" accept=".mp3,audio/mp3" onChange={handleBeepFileUpload} />
                  </div>
                </div>

                {/* Beep At Break Time */}
                <div className="form-group mb-3 w-100 d-flex align-items-center">
                  <input type="checkbox" className="form-check-input me-2" checked={beepAtBreak} onChange={() => setBeepAtBreak(!beepAtBreak)} />
                  <label className="auth-label mb-0">Beep at Break Time</label>
                </div>

                {/* Number of Steps */}
                <div className="form-group mb-3 w-100">
                  <label className="auth-label">Number of Steps (per hour)</label>
                  <div className="authInputWrap d-flex align-items-center ps-3">
                    <input
                      type="number"
                      className="form-control auth-input"
                      min={1}
                      max={50}
                      placeholder="Enter steps per hour"
                      value={stepsPerHour}
                      onChange={(e) => {
                        const val = e.target.value;
                        // Allow empty string for clearing
                        if (val === "") {
                          setStepsPerHour("");
                          return;
                        }
                        // Only allow numbers between 1 and 50
                        const num = Number(val);
                        if (num >= 1 && num <= 50) {
                          setStepsPerHour(num);
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Popup Text */}
                <div className="form-group mb-3 w-100">
                  <label className="auth-label">Popup Text</label>
                  <div className="authInputWrap d-flex align-items-center ps-3">
                    <input
                      type="text"
                      className="form-control auth-input"
                      placeholder="Type here"
                      value={popupText}
                      onChange={(e) => setPopupText(e.target.value)}
                    />
                  </div>
                </div>



                {/* Buttons */}
                <div className="d-flex justify-content-between status-btn-bar mt-5 mb-5">
                  <div className="backbtn">
                    <Button onClick={handleClose} style={{ marginRight: "8px" }}>
                      Cancel
                    </Button>
                  </div>
                  <div className="nextbtn">
                    <Button type="submit" disabled={secondStepMutation.isLoading}>
                      {secondStepMutation.isLoading ? <CircularProgress size={20} style={{ color: "#fff" }} /> : "Save Changes"}
                    </Button>
                  </div>
                </div>
              </form>
            </Box>
          )}
        </Box>
      </Modal>
    </section>
  );
}

export default ProjectPage;
