import React, { useEffect, useState } from "react";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import { MdEdit, MdDelete, MdShare } from "react-icons/md";
import { IoIosClose } from "react-icons/io";
import { FaLinkedin, FaTwitter, FaGlobe } from "react-icons/fa";
import { Button, Card, Collapse, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { deleteProject, startProject } from "../api/projectApi";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import SearchProjectShareModal from "./projectModal/SearchProjectShareModal";
import SharedUsersDisplay from "./SharedUsersDisplay";
import { getUserProfile } from "../api/networkApi";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "600px",
  maxHeight: "90vh",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 0,
  overflow: "hidden",
};

const ProjectCard = ({ projectData, index, onEdit, onDeleted, userData, sharedWithUsers, sharedBy }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isProgressExpanded, setIsProgressExpanded] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [userProfileModal, setUserProfileModal] = useState({ open: false, userId: null, userData: null });
  const [loading, setLoading] = useState(false);
  console.log('projectData', sharedWithUsers);

  const navigate = useNavigate();

  const toggleExpand = () => setIsExpanded(!isExpanded);
  const toggleProgressExpand = () => setIsProgressExpanded(!isProgressExpanded);

  const handleShareClick = () => {
    setShareModalOpen(true);
  };

  const handleShareModalClose = () => {
    setShareModalOpen(false);
  };

  const handleStart = async () => {
    const id = projectData?.project?.id || projectData?.id;
    const alreadyStarted = projectData?.project?.isStarted ?? projectData?.isStarted;
    try {
      setLoading(true);
      if (!alreadyStarted) {
        await startProject(id);
        toast.success("Project started successfully");
      }
      navigate(`/solution-function?projectId=${id}`);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to start project");
    } finally {
      setLoading(false);
    }
  };

  const handleShareSuccess = () => {
    // Refresh the project list if needed
    if (onDeleted) {
      onDeleted();
    }
  };

  const handleUserClick = async (userId) => {
    setLoading(true);
    setUserProfileModal({ open: true, userId, userData: null });
    
    try {
      const response = await getUserProfile(userId);
      setUserProfileModal({ open: true, userId, userData: response?.data?.data });
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      toast.error("Failed to load user profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setUserProfileModal({ open: false, userId: null, userData: null });
  };

  // Delete Mutation
  const deleteProjectMutation = useMutation(deleteProject, {
    onSuccess: (data) => {
      toast.success(data?.data?.data?.message || "Project Deleted Successfully!");
      console.log("API Success Response:", data);

      // 👇 Call parent refresh function
      if (onDeleted) {
        onDeleted();
      }

      // Close the modal
      setDeleteModalOpen(false);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
      console.error("API Error:", error);
    },
  });



  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteProjectMutation.mutate(projectData);
    // console.log(projectData.id);
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${day}/${month}/${year}, ${hours}:${minutes} ${ampm}`;
  };

  const handleEditClick = () => {
    onEdit(projectData);
  };

  const isValidYoutubeUrl = (url) => {
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    return pattern.test(url);
  };

  // Safety check for undefined projectData
  if (!projectData) {
    return null;
  }

  return (
    <>
      <Card className="mb-3">
        <Card.Body className="projectCard-body">
          <div
            className="d-flex justify-content-between align-items-center projectCard-heading px-2 py-2"
            onClick={toggleExpand}
            style={{ cursor: "pointer" }}
          >
            <div className="projectCard-head">
              <h5 className="mb-0">{projectData.name || projectData?.project?.name}</h5>
              <p className="mb-0">{formatDateTime(projectData.createdAt || projectData?.project?.createdAt)}</p>
            </div>
            <div>{isExpanded ? <AiOutlineUp /> : <AiOutlineDown />}</div>
          </div>

          <div className="px-2 py-2 pc-first-expand">
            {/* Shared Users Display */}
            {sharedWithUsers && sharedWithUsers.length > 0 && (
              <div style={{ marginBottom: "15px" }}>
                {/* <h6 style={{ fontSize: "14px", marginBottom: "8px", color: "#666" }}>Shared With:</h6> */}
                <SharedUsersDisplay sharedUsers={sharedWithUsers} maxDisplay={5} />
              </div>
            )}

            {/* Shared By User Display */}
            {sharedBy && (
              <div style={{ marginBottom: "20px", textAlign: "center" }}>
                
                <div 
                  className="d-flex flex-column align-items-center"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleUserClick(sharedBy.id)}
                  title={`View ${sharedBy.firstname} ${sharedBy.lastname}'s profile`}
                >
                  {sharedBy.image ? (
                    <img
                      src={sharedBy.image?.startsWith("http") ? sharedBy.image : `https://feedbackwork.net/feedbackapi/${sharedBy.image}`}
                      alt={`${sharedBy.firstname} ${sharedBy.lastname}`}
                      className="rounded-circle mb-2"
                      style={{ 
                        width: "80px", 
                        height: "80px", 
                        objectFit: "cover",
                        border: "3px solid #fff",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.15)"
                      }}
                    />
                  ) : (
                    <div
                      className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mb-2"
                      style={{ 
                        width: "80px", 
                        height: "80px", 
                        fontWeight: "bold",
                        fontSize: "32px",
                        border: "3px solid #fff",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.15)"
                      }}
                    >
                      {`${sharedBy.firstname?.charAt(0) || ""}${sharedBy.lastname?.charAt(0) || ""}`.toUpperCase()}
                    </div>
                  )}
                  <span style={{ 
                    fontSize: "18px", 
                    fontWeight: "bold", 
                    color: "#333",
                    textAlign: "center"
                  }}>
                    {sharedBy.firstname} {sharedBy.lastname}
                  </span>
                </div>
              </div>
            )}

            <p className="mb-1">
              Problem: <span className="pc-danger">{projectData.problem || projectData?.project?.problem}</span>
            </p>
            <p className="mb-1">
              Solution:{" "}
              <span className="pc-success">{projectData.solution || projectData?.project?.solution}</span>
            </p>
            <p className="mb-1">
              Solution Function:{" "}
              <span className="pc-success">{projectData.solutionFunction || projectData?.project?.solutionFunction}</span>
            </p>

            <Collapse in={isExpanded}>
              <div>
                <p className="mb-1">
                  Start Date:{" "}
                  <span className="pc-grey">
                    {formatDateTime(projectData?.stepConfig?.startTime || projectData?.project?.stepConfig?.startTime)}
                  </span>
                </p>
                <p className="mb-1">
                  End Date:{" "}
                  <span className="pc-grey">
                    {formatDateTime(projectData?.stepConfig?.endTime || projectData?.project?.stepConfig?.endTime)}
                  </span>
                </p>

                <p className="mb-1">
                  Total Feedback Requested: <span className="pc-info">10</span>
                </p>
                <p className="mb-1">
                  Total Feedback Received: <span className="pc-info">10</span>
                </p>
                <p className="mb-1">
                  Total Feedback Applied: <span className="pc-info">10</span>
                </p>

                {(projectData?.fullImageUrl || projectData?.project?.fullImageUrl) && (
                  <div style={{ marginTop: "10px" }}>
                    <h6>Project Image</h6>
                    <img
                      src={projectData.fullImageUrl || projectData?.project?.fullImageUrl}
                      alt="Project"
                      style={{
                        width: "100%",
                        maxHeight: "200px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        marginBottom: "10px",
                      }}
                    />
                  </div>
                )}

                {/* ✅ Youtube Video Embed */}
                {projectData && (projectData.youtubeLink || projectData.project?.youtubeLink) &&
                  isValidYoutubeUrl(projectData.youtubeLink || projectData.project?.youtubeLink) && (
                    <div style={{ marginTop: "10px" }}>
                      <h6>Youtube Link:</h6>
                      <iframe
                        width="100%"
                        height="250"
                        src={(projectData.youtubeLink || projectData.project?.youtubeLink).replace(
                          "watch?v=",
                          "embed/"
                        )}
                        title="Youtube video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}
                {projectData && (projectData.youtubeLink || projectData.project?.youtubeLink) &&
                  !isValidYoutubeUrl(projectData.youtubeLink || projectData.project?.youtubeLink) && (
                    <>
                      <h6>Youtube Link:</h6>
                      <p style={{ color: "red", marginTop: "10px" }}>
                        Invalid YouTube Link
                      </p>
                    </>
                  )}

                {projectData && (projectData.description || projectData.project?.description) && (
                  <div style={{ marginTop: "10px" }}>
                    <h6>Description:</h6>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: projectData.description || projectData.project?.description,
                      }}
                      style={{
                        background: "#f9f9f9",
                        padding: "10px",
                        borderRadius: "8px",
                      }}
                    ></div>
                  </div>
                )}
              </div>
            </Collapse>

            <p className="mb-3">
              Status: <span className="pc-info">{projectData?.status || projectData?.project?.status}</span>
            </p>

            <Button
              variant="primary"
              className="mb-2 pc-feedback-btn"
              onClick={() => navigate("/request-feedback")}
            >
              Request Feedback
            </Button>
          </div>

          <Collapse in={isExpanded}>
            <div>
              <div className="d-flex justify-content-between align-items-center pc-share-row px-2 py-2">
                <div className="d-flex gap-2 align-items-center">
                  <button className="transparent-btn" onClick={handleEditClick}>
                    <MdEdit
                      style={{ cursor: "pointer", marginRight: "10px" }}
                    />
                  </button>
                  <button
                    className="transparent-btn"
                    onClick={handleDeleteClick}
                  >
                    <MdDelete
                      style={{ cursor: "pointer", marginRight: "10px" }}
                    />
                  </button>
                  <button
                    className="transparent-btn"
                    onClick={handleShareClick}
                    >
                    <MdShare style={{ cursor: "pointer" }} />
                  </button>
                </div>
                <Button
                  variant="primary"
                  onClick={handleStart}
                  disabled={loading}
                >
                  Start
                </Button>
              </div>

              <div>
                <div
                  className="d-flex justify-content-between align-items-center px-2 py-2 pc-second-expand"
                  onClick={toggleProgressExpand}
                  style={{ cursor: "pointer" }}
                >
                  <h6>Check Progress</h6>
                  {isProgressExpanded ? <AiOutlineUp /> : <AiOutlineDown />}
                </div>

                <Collapse in={isProgressExpanded}>
                  <div className="px-2 py-2">
                    <p>Progress details go here...</p>
                  </div>
                </Collapse>
              </div>
            </div>
          </Collapse>
        </Card.Body>
      </Card>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this project?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            disabled={deleteProjectMutation.isLoading}
          >
            {deleteProjectMutation.isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Project Share Modal */}
      <SearchProjectShareModal
        open={shareModalOpen}
        onClose={handleShareModalClose}
        projectId={projectData?.id || projectData?.project?.id}
        onApiResponse={handleShareSuccess}
      />

      {/* User Profile Modal */}
      <Modal open={userProfileModal.open} onClose={handleCloseModal}>
        <Box sx={style}>
          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
              <CircularProgress />
            </div>
          ) : userProfileModal.userData ? (
            <div>
              {/* Header */}
              <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
                <h3 className="mb-0">User Profile</h3>
                <button
                  onClick={handleCloseModal}
                  className="btn btn-link p-0"
                  style={{ fontSize: "1.5rem", color: "#666" }}
                >
                  <IoIosClose />
                </button>
              </div>

              {/* Profile Content */}
              <div className="p-4" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                {/* Profile Image and Basic Info */}
                <div className="text-center mb-4">
                  {userProfileModal.userData.image ? (
                    <img
                      src={userProfileModal.userData.image?.startsWith("http") ? userProfileModal.userData.image : `https://feedbackwork.net/feedbackapi/${userProfileModal.userData.image}`}
                      alt={`${userProfileModal.userData.firstname} ${userProfileModal.userData.lastname}`}
                      className="rounded-circle mb-3"
                      style={{ width: "120px", height: "120px", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mb-3 mx-auto"
                      style={{
                        width: "120px",
                        height: "120px",
                        fontWeight: "bold",
                        fontSize: "3rem",
                      }}
                    >
                      {`${userProfileModal.userData.firstname?.charAt(0) || ""}${userProfileModal.userData.lastname?.charAt(0) || ""}`.toUpperCase()}
                    </div>
                  )}
                  <h4 className="mb-1">
                    {userProfileModal.userData.firstname} {userProfileModal.userData.lastname}
                  </h4>
                  <p className="text-muted mb-2">{userProfileModal.userData.email}</p>
                  {userProfileModal.userData.role && (
                    <span className="badge bg-primary me-2">{userProfileModal.userData.role.name}</span>
                  )}
                  {userProfileModal.userData.expertise && (
                    <span className="badge bg-secondary">{userProfileModal.userData.expertise}</span>
                  )}
                </div>

                {/* Contact Information */}
                <div className="mb-4">
                  <h5 className="mb-3">Contact Information</h5>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <strong>Email:</strong>
                      <p className="text-muted mb-0">{userProfileModal.userData.email}</p>
                    </div>
                    {userProfileModal.userData.phone && (
                      <div className="col-md-6 mb-3">
                        <strong>Phone:</strong>
                        <p className="text-muted mb-0">{userProfileModal.userData.phone}</p>
                      </div>
                    )}
                    {userProfileModal.userData.location && (
                      <div className="col-md-6 mb-3">
                        <strong>Location:</strong>
                        <p className="text-muted mb-0">{userProfileModal.userData.location}</p>
                      </div>
                    )}
                    {userProfileModal.userData.company && (
                      <div className="col-md-6 mb-3">
                        <strong>Company:</strong>
                        <p className="text-muted mb-0">{userProfileModal.userData.company}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bio/Description */}
                {userProfileModal.userData.bio && (
                  <div className="mb-4">
                    <h5 className="mb-3">About</h5>
                    <p className="text-muted">{userProfileModal.userData.bio}</p>
                  </div>
                )}

                {/* Social Links */}
                {(userProfileModal.userData.linkedin || userProfileModal.userData.twitter || userProfileModal.userData.website) && (
                  <div className="mb-4">
                    <h5 className="mb-3">Social Links</h5>
                    <div className="d-flex gap-3">
                      {userProfileModal.userData.linkedin && (
                        <a
                          href={userProfileModal.userData.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-primary btn-sm"
                        >
                          <FaLinkedin className="me-2" />
                          LinkedIn
                        </a>
                      )}
                      {userProfileModal.userData.twitter && (
                        <a
                          href={userProfileModal.userData.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-info btn-sm"
                        >
                          <FaTwitter className="me-2" />
                          Twitter
                        </a>
                      )}
                      {userProfileModal.userData.website && (
                        <a
                          href={userProfileModal.userData.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-secondary btn-sm"
                        >
                          <FaGlobe className="me-2" />
                          Website
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Statistics */}
                <div className="mb-4">
                  <h5 className="mb-3">Statistics</h5>
                  <div className="row">
                    <div className="col-md-4 text-center mb-3">
                      <div className="border rounded p-3">
                        <h4 className="text-primary mb-1">{userProfileModal.userData.totalConnections || 0}</h4>
                        <small className="text-muted">Connections</small>
                      </div>
                    </div>
                    <div className="col-md-4 text-center mb-3">
                      <div className="border rounded p-3">
                        <h4 className="text-success mb-1">{userProfileModal.userData.totalFeedback || 0}</h4>
                        <small className="text-muted">Feedback Given</small>
                      </div>
                    </div>
                    <div className="col-md-4 text-center mb-3">
                      <div className="border rounded p-3">
                        <h4 className="text-info mb-1">{userProfileModal.userData.totalProjects || 0}</h4>
                        <small className="text-muted">Projects</small>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                {userProfileModal.userData.createdAt && (
                  <div className="mb-4">
                    <h5 className="mb-3">Member Since</h5>
                    <p className="text-muted">{new Date(userProfileModal.userData.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}</p>
                  </div>
                )}

                {/* Skills/Expertise */}
                {userProfileModal.userData.skills && userProfileModal.userData.skills.length > 0 && (
                  <div className="mb-4">
                    <h5 className="mb-3">Skills</h5>
                    <div className="d-flex flex-wrap gap-2">
                      {userProfileModal.userData.skills.map((skill, index) => (
                        <span key={index} className="badge bg-light text-dark">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
              <p className="text-muted">No user data available</p>
            </div>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default ProjectCard;
