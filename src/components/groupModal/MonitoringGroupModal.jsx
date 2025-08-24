import React, { useState, useEffect } from "react";
import { Avatar, Box, Button, Modal } from "@mui/material";
import { IoIosSearch } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
import Fetcher from "../../library/Fetcher";
import { toast } from "react-toastify";
import useUserStore from "../../store/userStore";
import { MdModeEdit } from "react-icons/md";
import { Badge } from "react-bootstrap";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70%",
  height: "90%",
  overflow: "auto",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 2,
};

const getInitials = (firstname = "", lastname = "") => {
  const first = firstname?.charAt(0)?.toUpperCase() || "";
  const last = lastname?.charAt(0)?.toUpperCase() || "";
  return first + last;
};

export default function MonitoringGroupModal({ open, onClose, onGroupCreated }) {
  const [nextStep, setNextStep] = useState(true);
  const [projectFilters, setProjectFilters] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [imageData, setImageData] = useState();
  const [imagePreview, setImagePreview] = useState(null);

  const userData = useUserStore((state) => state.userData);

  useEffect(() => {
    if (open) {
      fetchProjects();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      setNextStep(true);
    }
  }, [open]);

  const fetchProjects = async () => {
    try {
      setLoadingProjects(true);
      const data = await Fetcher.get("/user/projects/shared?excludeMonitoringGroupProjects=true");
      // Extract projects from sharedProjects array
      const projects = data.data?.data?.sharedProjects?.map(item => item.project) || [];
      setProjects(projects);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch projects.");
    } finally {
      setLoadingProjects(false);
    }
  };

  const toggleProjectFilter = (filter) => {
    setProjectFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]));
  };

  const handleModalClose = () => {
    setProjectFilters([]);
    setGroupName("");
    setGroupDescription("");
    setNextStep(true);
    setImageData(null);
    setImagePreview(null);
    onClose();
  };

  const handleSteps = async () => {
    if (!nextStep) {
      if (!projectFilters || projectFilters.length === 0) {
        toast.error("Please select at least one project for the monitor group.");
        return;
      }

      try {
        setLoading(true);

        const formData = new FormData();

        formData.append("name", groupName);
        formData.append("createdById", userData?.user?.id);
        formData.append("description", groupDescription);
        formData.append("groupType", "MONITORING");
        // Monitoring groups should always include monitoringMode: "shared"
        formData.append("monitoringMode", "shared");

        if (imageData) {
          formData.append("image", imageData);
        }

        formData.append("projectIds", JSON.stringify(projectFilters));

        const data = await Fetcher.post("/user/network/groups", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        toast.success(data?.data?.data?.message || "Monitor group created successfully!");
        if (onGroupCreated) {
          onGroupCreated();
        }
        handleModalClose();
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to create monitor group.");
      } finally {
        setLoading(false);
      }
    } else {
      if (!groupName.trim()) {
        toast.error("Please enter a group name.");
        return;
      }

      setNextStep(false);
    }
  };

  const handleCancelBtn = () => {
    if (nextStep === false) {
      setNextStep(true);
    } else {
      handleModalClose();
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageData(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Modal open={open} onClose={nextStep ? () => { } : onClose}>
      <Box sx={style}>
        {nextStep === false ? (
          <>
            <h3 className="mb-4">Select Projects</h3>
            <div className="connection-search d-flex align-items-center me-3 w-50">
              <IoIosSearch className="connection-search-icon" />
              <input type="text" placeholder="Search" />
            </div>

            <ul className="list-unstyled feedback-privacy-list">
              {loadingProjects ? (
                <p>Loading projects...</p>
              ) : projects.length === 0 ? (
                <p>No available projects found.</p>
              ) : (
                projects.map((project, index) => (
                  <li
                    key={project?.id}
                    className="filter-item d-flex justify-content-between align-items-center p-2 rounded cursor-pointer fw-bold text-primary"
                    onClick={() => toggleProjectFilter(project?.id)}
                  >
                    <div className="d-flex align-items-center">
                      <div
                        className="me-2 d-flex align-items-center justify-content-center rounded-circle bg-primary text-white"
                        style={{ width: 40, height: 40, fontWeight: "bold" }}
                      >
                        P
                      </div>
                      <span>
                        {project?.name}
                      </span>
                    </div>
                    {projectFilters.includes(project?.id) && <FaCheck className="text-primary" />}
                  </li>
                ))
              )}
            </ul>
          </>
        ) : (
          <>
            <h3 className="mb-4">New Monitoring Group</h3>

            <div className="form-group mb-4 text-center">
              <label htmlFor="image-upload" className="cursor-pointer">
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  badgeContent={<MdModeEdit className="profile-edit" />}
                >
                  <Avatar src={imagePreview} sx={{ width: 90, height: 90 }} />
                </Badge>
              </label>
              <input type="file" id="image-upload" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="groupName" className="auth-label">
                Group Name
              </label>
              <div className="authInputWrap d-flex align-items-center ps-3">
                <input
                  type="text"
                  className="form-control auth-input"
                  id="groupName"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Group name"
                />
              </div>
            </div>

            <div className="form-group mb-3">
              <label htmlFor="groupDescription" className="auth-label">
                Group Description
              </label>
              <div className="authInputWrap d-flex align-items-center ps-3">
                <input
                  type="text"
                  className="form-control auth-input"
                  id="groupDescription"
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  placeholder="Group Description"
                />
              </div>
            </div>

            <div className="alert alert-info">
              <strong>Monitoring Group:</strong> This group will be used to monitor project progress across multiple users.
            </div>
          </>
        )}

        <div className="d-flex justify-content-between status-btn-bar mt-5 mb-5">
          <Button onClick={handleCancelBtn}>{nextStep === false ? "Back" : "Cancel"}</Button>
          <Button onClick={handleSteps} disabled={loading}>
            {loading ? "Processing..." : nextStep === false ? 
              "Create Monitor Group" : 
              "Next"}
          </Button>
        </div>
      </Box>
    </Modal>
  );
}
