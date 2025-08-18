import React, { useState, useEffect } from "react";
import { Avatar, Box, Button, Modal, Switch } from "@mui/material";
import { IoIosSearch } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
import Fetcher from "../../library/Fetcher";
import { toast } from "react-toastify";
import useUserStore from "../../store/userStore";
import { MdModeEdit } from "react-icons/md";
import { Badge } from "react-bootstrap";
import { hasPermission } from "../../utils/rolePermissions";

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

const label = { inputProps: { "aria-label": "Switch demo" } };

const getInitials = (firstname = "", lastname = "") => {
  const first = firstname?.charAt(0)?.toUpperCase() || "";
  const last = lastname?.charAt(0)?.toUpperCase() || "";
  return first + last;
};

export default function GroupModal({ open, onClose, onGroupCreated }) {
  const [nextStep, setNextStep] = useState(true);
  const [userFilters, setUserFilters] = useState([]);
  const [projectFilters, setProjectFilters] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [connections, setConnections] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loadingConnections, setLoadingConnections] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [createdGroupData, setCreatedGroupData] = useState();
  const [imageData, setImageData] = useState();
  const [imagePreview, setImagePreview] = useState(null);
  const [groupType, setGroupType] = useState("NORMAL");

  const userData = useUserStore((state) => state.userData);
  const userRole = userData?.user?.role?.name;
  const canCreateMonitoringGroup = hasPermission(userRole, 'CREATE_MONITORING_GROUP');

  useEffect(() => {
    if (open) {
      if (groupType === "MONITORING") {
        fetchProjects();
      } else {
        fetchConnections();
      }
    }
  }, [open, groupType]);

  useEffect(() => {
    if (open) {
      setNextStep(true);
    }
  }, [open]);

  const fetchConnections = async () => {
    try {
      setLoadingConnections(true);
      const data = await Fetcher.get("/user/network/connections?status=ACCEPTED");
      setConnections(data.data?.data?.connections || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch connections.");
    } finally {
      setLoadingConnections(false);
    }
  };

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

  const toggleUserFilter = (filter) => {
    setUserFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]));
  };

  const toggleProjectFilter = (filter) => {
    setProjectFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]));
  };

  const handleModalClose = () => {
    setUserFilters([]);
    setProjectFilters([]);
    setGroupName("");
    setGroupDescription("");
    setIsPrivate(false);
    setNextStep(true);
    onClose();
  };

  const handleSteps = async () => {
    if (!nextStep) {
      if (groupType === "MONITORING") {
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
          formData.append("groupType", groupType);
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

          setCreatedGroupData(data?.data?.data);
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
        if (!userFilters || userFilters.length === 0) {
          toast.error("Please select at least one member for the group.");
          return;
        }

        try {
          setLoading(true);

          const formData = new FormData();

          formData.append("name", groupName);
          formData.append("isPrivate", isPrivate);
          formData.append("createdById", userData?.user?.id);
          formData.append("description", groupDescription);
          formData.append("groupType", groupType);

          if (imageData) {
            formData.append("image", imageData);
          }

          formData.append("memberIds", JSON.stringify(userFilters));

          const data = await Fetcher.post("/user/network/groups", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          setCreatedGroupData(data?.data?.data);
          toast.success(data?.data?.data?.message || "Group created successfully!");
          if (onGroupCreated) {
            onGroupCreated();
          }
          handleModalClose();
        } catch (error) {
          toast.error(error?.response?.data?.message || "Failed to create group.");
        } finally {
          setLoading(false);
        }
      }
    } else {
      if (!groupName.trim()) {
        toast.error("Please enter a group name.");
        return;
      }

      // Description is now optional - no validation needed

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

  const [formErrors, setFormErrors] = useState({});

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
            <h3 className="mb-4">
              {groupType === "MONITORING" ? "Select Projects" : "Add Members"}
            </h3>
            <div className="connection-search d-flex align-items-center me-3 w-50">
              <IoIosSearch className="connection-search-icon" />
              <input type="text" placeholder="Search" />
            </div>

            <ul className="list-unstyled feedback-privacy-list">
              {groupType === "MONITORING" ? (
                loadingProjects ? (
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
                )
              ) : (
                loadingConnections ? (
                  <p>Loading connections...</p>
                ) : connections.length === 0 ? (
                  <p>No connections found.</p>
                ) : (
                  connections.map((item, index) => (
                    <li
                      key={item?.user?.id}
                      className="filter-item d-flex justify-content-between align-items-center p-2 rounded cursor-pointer fw-bold text-primary"
                      onClick={() => toggleUserFilter(item?.user?.id)}
                    >
                      <div className="d-flex align-items-center">
                        {item?.user?.image ? (
                          <img
                            src={`https://feedbackwork.net/feedbackapi/${item?.user?.image}`}
                            alt="Profile"
                            className="me-2 rounded-circle"
                            style={{ width: 40, height: 40, objectFit: "cover" }}
                          />
                        ) : (
                          <div
                            className="me-2 d-flex align-items-center justify-content-center rounded-circle bg-secondary text-white"
                            style={{ width: 40, height: 40, fontWeight: "bold" }}
                          >
                            {getInitials(item?.user?.firstname, item?.user?.lastname)}
                          </div>
                        )}
                        <span>
                          {item?.user?.firstname} {item?.user?.lastname}
                        </span>
                      </div>
                      {userFilters.includes(item?.user?.id) && <FaCheck className="text-primary" />}
                    </li>
                  ))
                )
              )}
            </ul>
          </>
        ) : (
          <>
            <h3 className="mb-4">New Group</h3>

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
              {formErrors.image && <small className="text-danger">{formErrors.image}</small>}
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
            <div className="form-group mb-3">
              <label className="form-label fw-bold mb-2">Group Type:</label>
              <div className="d-flex gap-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="groupType"
                    value="NORMAL"
                    id="groupTypeNormal"
                    checked={groupType === "NORMAL"}
                    onChange={(e) => setGroupType(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="groupTypeNormal">
                    Normal
                  </label>
                </div>
                {canCreateMonitoringGroup && (
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="groupType"
                      value="MONITORING"
                      id="groupTypeMonitor"
                      checked={groupType === "MONITORING"}
                      onChange={(e) => setGroupType(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="groupTypeMonitor">
                      Monitor
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="auth-label">Select Group Privacy</label>
              <div className="form-group d-flex align-items-center justify-content-between group-switch-class">
                <label className="auth-label">Public Group</label>
                <Switch 
                  {...label} 
                  checked={isPrivate} 
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  disabled={groupType === "MONITORING"}
                />
                {groupType === "MONITORING" && (
                  <small className="text-muted">Monitor groups are always public</small>
                )}
              </div>
            </div>
          </>
        )}

        <div className="d-flex justify-content-between status-btn-bar mt-5 mb-5">
          <Button onClick={handleCancelBtn}>{nextStep === false ? "Back" : "Cancel"}</Button>
          <Button onClick={handleSteps} disabled={loading}>
            {loading ? "Processing..." : nextStep === false ? 
              (groupType === "MONITORING" ? "Create Monitor Group" : "Submit") : 
              "Next"}
          </Button>
        </div>
      </Box>
    </Modal>
  );
}
