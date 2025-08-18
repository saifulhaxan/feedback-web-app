import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { IoIosClose } from "react-icons/io";
import { FaLinkedin, FaTwitter, FaGlobe } from "react-icons/fa";
import { getUserProfile } from "../api/networkApi";
import { toast } from "react-toastify";

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

const SharedUsersDisplay = ({ sharedUsers = [], maxDisplay = 5, displayStyle = "horizontal" }) => {
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [userProfileModal, setUserProfileModal] = useState({ open: false, userId: null, userData: null });
  const [loading, setLoading] = useState(false);

  const displayUsers = sharedUsers.slice(0, maxDisplay);
  const hasMoreUsers = sharedUsers.length > maxDisplay;
  const remainingCount = sharedUsers.length - maxDisplay;

  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "";
    const parts = name.trim().split(" ").filter(Boolean);
    const first = parts[0]?.[0] || "";
    const second = parts[1]?.[0] || "";
    return (first + second).toUpperCase();
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

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      {displayStyle === "centered" ? (
        // Centered style - similar to "Shared with me" tab
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          {displayUsers.map((user, index) => (
            <div
              key={user.id}
              className="d-flex flex-column align-items-center"
              style={{ cursor: "pointer" }}
              onClick={() => handleUserClick(user.id)}
              title={`View ${user.firstname} ${user.lastname}'s profile`}
            >
              {user.image ? (
                <img
                  src={user.image?.startsWith("http") ? user.image : `https://feedbackwork.net/feedbackapi/${user.image}`}
                  alt={`${user.firstname} ${user.lastname}`}
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
                  {getInitials(`${user.firstname || ""} ${user.lastname || ""}`)}
                </div>
              )}
              <span style={{ 
                fontSize: "18px", 
                fontWeight: "bold", 
                color: "#333",
                textAlign: "center"
              }}>
                {user.firstname} {user.lastname}
              </span>
            </div>
          ))}
          
          {/* Show remaining count if there are more users */}
          {hasMoreUsers && (
            <div className="mt-3">
              <span style={{ 
                fontSize: "16px", 
                color: "#666",
                fontStyle: "italic"
              }}>
                +{remainingCount} more users
              </span>
            </div>
          )}
        </div>
      ) : (
        // Horizontal style - original style
        <div className="d-flex align-items-center">
          {/* Display users */}
          {displayUsers.map((user, index) => (
            <div
              key={user.id}
              className=""
              style={{ cursor: "pointer" }}
              onClick={() => handleUserClick(user.id)}
              title={`${user.firstname} ${user.lastname}`}
            >
              {user.image ? (
                <img
                  src={user.image?.startsWith("http") ? user.image : `https://feedbackwork.net/feedbackapi/${user.image}`}
                  alt={`${user.firstname} ${user.lastname}`}
                  className="rounded-circle"
                  style={{ 
                    width: "42px", 
                    height: "42px", 
                    objectFit: "cover",
                    border: "2px solid #fff",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                  }}
                />
              ) : (
                <div
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                  style={{ 
                    width: "42px", 
                    height: "42px", 
                    fontWeight: "bold",
                    fontSize: "14px",
                    border: "2px solid #fff",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                  }}
                >
                  {getInitials(`${user.firstname || ""} ${user.lastname || ""}`)}
                </div>
              )}
            </div>
          ))}

          {/* Plus button for more users */}
          {hasMoreUsers && (
            <div
              className="rounded-circle bg-light text-dark d-flex align-items-center justify-content-center me-2"
              style={{ 
                width: "32px", 
                height: "32px", 
                fontWeight: "bold",
                fontSize: "12px",
                cursor: "pointer",
                border: "2px solid #fff",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}
              onClick={() => setShowAllUsers(true)}
              title={`+${remainingCount} more`}
            >
              +{remainingCount}
            </div>
          )}
        </div>
      )}

      {/* All Users Modal */}
      {showAllUsers && (
        <Modal open={showAllUsers} onClose={() => setShowAllUsers(false)}>
          <Box sx={style}>
            <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
              <h3 className="mb-0">Shared Users ({sharedUsers.length})</h3>
              <button
                onClick={() => setShowAllUsers(false)}
                className="btn btn-link p-0"
                style={{ fontSize: "1.5rem", color: "#666" }}
              >
                <IoIosClose />
              </button>
            </div>

            <div className="p-4" style={{ maxHeight: "70vh", overflowY: "auto" }}>
              <div className="row">
                {sharedUsers.map((user) => (
                  <div key={user.id} className="col-md-6 mb-3">
                    <div 
                      className="d-flex align-items-center p-3 border rounded"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleUserClick(user.id)}
                    >
                      {user.image ? (
                        <img
                          src={user.image?.startsWith("http") ? user.image : `https://feedbackwork.net/feedbackapi/${user.image}`}
                          alt={`${user.firstname} ${user.lastname}`}
                          className="rounded-circle me-3"
                          style={{ width: "48px", height: "48px", objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                          style={{ width: "48px", height: "48px", fontWeight: "bold", fontSize: "18px" }}
                        >
                          {getInitials(`${user.firstname || ""} ${user.lastname || ""}`)}
                        </div>
                      )}
                      <div>
                        <div className="fw-semibold">
                          {user.firstname} {user.lastname}
                        </div>
                        <div className="text-muted small">{user.email}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Box>
        </Modal>
      )}

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
                      {getInitials(`${userProfileModal.userData.firstname || ""} ${userProfileModal.userData.lastname || ""}`)}
                    </div>
                  )}
                  <h4 className="mb-1">
                    {userProfileModal.userData.firstname} {userProfileModal.userData.lastname}
                  </h4>
                                     <p className="text-muted mb-2">{userProfileModal.userData.email}</p>
                   <div className="d-flex gap-2 justify-content-center">
                     {userProfileModal.userData.expertise && (
                       <span className="badge bg-primary">{userProfileModal.userData.expertise}</span>
                     )}
                     {userProfileModal.userData.title && (
                       <span className="badge bg-secondary">{userProfileModal.userData.title}</span>
                     )}
                   </div>
                </div>

                {/* Contact Information */}
                <div className="mb-4">
                  <h5 className="mb-3">Contact Information</h5>
                  <div className="row">
                                         <div className="col-md-6 mb-3">
                       <strong>Email:</strong>
                       <p className="text-muted mb-0">{userProfileModal.userData.email}</p>
                     </div>
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
                     <div className="col-md-6 text-center mb-3">
                       <div className="border rounded p-3">
                         <h4 className="text-success mb-1">{userProfileModal.userData.totalFeedbackProvided || 0}</h4>
                         <small className="text-muted">Feedback Provided</small>
                       </div>
                     </div>
                     <div className="col-md-6 text-center mb-3">
                       <div className="border rounded p-3">
                         <h4 className="text-info mb-1">{userProfileModal.userData.totalFeedbackReceived || 0}</h4>
                         <small className="text-muted">Feedback Received</small>
                       </div>
                     </div>
                   </div>
                 </div>

                {/* Additional Information */}
                {userProfileModal.userData.createdAt && (
                  <div className="mb-4">
                    <h5 className="mb-3">Member Since</h5>
                    <p className="text-muted">{formatDate(userProfileModal.userData.createdAt)}</p>
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

export default SharedUsersDisplay; 