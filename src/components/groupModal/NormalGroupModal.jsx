import React, { useState, useEffect } from "react";
import { Avatar, Box, Button, Modal, Switch } from "@mui/material";
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

const label = { inputProps: { "aria-label": "Switch demo" } };

const getInitials = (firstname = "", lastname = "") => {
  const first = firstname?.charAt(0)?.toUpperCase() || "";
  const last = lastname?.charAt(0)?.toUpperCase() || "";
  return first + last;
};

export default function NormalGroupModal({ open, onClose, onGroupCreated, editMode = false, groupData = null }) {
  const [nextStep, setNextStep] = useState(true);
  const [userFilters, setUserFilters] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [connections, setConnections] = useState([]);
  const [loadingConnections, setLoadingConnections] = useState(false);
  const [imageData, setImageData] = useState();
  const [imagePreview, setImagePreview] = useState(null);
  const [excludeGroupId, setExcludeGroupId] = useState(null);

  const userData = useUserStore((state) => state.userData);

  useEffect(() => {
    if (open) {
      fetchConnections();
      
      // If editing, populate form with existing data
      if (editMode && groupData) {
        setGroupName(groupData.name || "");
        setGroupDescription(groupData.description || "");
        setIsPrivate(groupData.isPrivate || false);
        setImagePreview(groupData.imageUrl ? `https://feedbackwork.net/feedbackapi/${groupData.imageUrl}` : null);
        setExcludeGroupId(groupData.id);
      } else {
        // Reset form for new group
        setGroupName("");
        setGroupDescription("");
        setIsPrivate(false);
        setImagePreview(null);
        setImageData(null);
        setUserFilters([]);
        setExcludeGroupId(null);
      }
    }
  }, [open, editMode, groupData]);

  useEffect(() => {
    if (open) {
      setNextStep(true);
    }
  }, [open]);

  const fetchConnections = async () => {
    try {
      setLoadingConnections(true);
      const queryParams = excludeGroupId ? `?excludeGroupId=${excludeGroupId}` : '';
      const data = await Fetcher.get(`/user/network/connections${queryParams}`);
      setConnections(data.data?.data?.connections || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch connections.");
    } finally {
      setLoadingConnections(false);
    }
  };

  const toggleUserFilter = (filter) => {
    setUserFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]));
  };

  const handleModalClose = () => {
    setUserFilters([]);
    setGroupName("");
    setGroupDescription("");
    setIsPrivate(false);
    setNextStep(true);
    setImageData(null);
    setImagePreview(null);
    setExcludeGroupId(null);
    onClose();
  };

  const handleSteps = async () => {
    // If in edit mode, directly submit the form (skip member selection)
    if (editMode) {
      if (!groupName.trim()) {
        toast.error("Please enter a group name.");
        return;
      }

      try {
        setLoading(true);

        let data;
        
        // Always use FormData for PATCH requests to handle optional image
        const formData = new FormData();
        formData.append("name", groupName);
        formData.append("description", groupDescription);
        formData.append("isPrivate", isPrivate);
        
        // Only append image if it's available/selected
        if (imageData) {
          formData.append("image", imageData);
        }

        // Update existing group
        data = await Fetcher.patch(`/user/network/groups/${groupData.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success(data?.data?.data?.message || "Group updated successfully!");

        if (onGroupCreated) {
          onGroupCreated();
        }
        handleModalClose();
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to update group.");
      } finally {
        setLoading(false);
      }
      return;
    }

    // For create mode, handle the step flow
    if (!nextStep) {
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
        formData.append("groupType", "NORMAL");

        if (imageData) {
          formData.append("image", imageData);
        }

        formData.append("memberIds", JSON.stringify(userFilters));

        // Create new group
        const data = await Fetcher.post("/user/network/groups", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
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
            <h3 className="mb-4">Add Members</h3>
            <div className="connection-search d-flex align-items-center me-3 w-50">
              <IoIosSearch className="connection-search-icon" />
              <input type="text" placeholder="Search" />
            </div>

            <ul className="list-unstyled feedback-privacy-list">
              {loadingConnections ? (
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
              )}
            </ul>
          </>
        ) : (
          <>
            <h3 className="mb-4">{editMode ? "Edit Group" : "New Group"}</h3>

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

            <div>
              <label className="auth-label">Select Group Privacy</label>
              <div className="form-group d-flex align-items-center justify-content-between group-switch-class">
                <label className="auth-label">Public Group</label>
                <Switch 
                  {...label} 
                  checked={isPrivate} 
                  onChange={(e) => setIsPrivate(e.target.checked)}
                />
              </div>
            </div>
          </>
        )}

        <div className="d-flex justify-content-between status-btn-bar mt-5 mb-5">
          <Button onClick={handleCancelBtn}>{nextStep === false ? "Back" : "Cancel"}</Button>
          <Button onClick={handleSteps} disabled={loading}>
            {loading ? "Processing..." : editMode ? "Update Group" : nextStep === false ? "Submit" : "Next"}
          </Button>
        </div>
      </Box>
    </Modal>
  );
}
