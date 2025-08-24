import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { IoIosClose } from "react-icons/io";
import { FaLinkedin, FaTwitter, FaGlobe } from "react-icons/fa";
import { getUserProfile, sendConnectionRequest, respondToConnectionRequest, deleteConnection } from "../../api/networkApi";
import useUserStore from "../../store/userStore";
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

const UserProfileModal = ({ open, onClose, userId, onApiResponse }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null); // 'connected', 'requested', 'received', 'not_connected'
  const [loadingAction, setLoadingAction] = useState(false);

  const { userData: currentUser } = useUserStore();

  useEffect(() => {
    if (open && userId) {
      fetchUserProfile();
    }
  }, [open, userId]);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await getUserProfile(userId);
      const profileData = response?.data?.data;
      setUserData(profileData);
      
      // Determine connection status from profile data
      if (profileData?.isConnected) {
        setConnectionStatus('connected');
      } else if (profileData?.requestSent) {
        setConnectionStatus('requested');
      } else if (profileData?.requestReceived) {
        setConnectionStatus('received');
      } else {
        setConnectionStatus('not_connected');
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      toast.error("Failed to load user profile");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "";
    const parts = name.trim().split(" ").filter(Boolean);
    const first = parts[0]?.[0] || "";
    const second = parts[1]?.[0] || "";
    return (first + second).toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleConnect = async () => {
    if (!currentUser?.user?.id || !userId) return;
    
    setLoadingAction(true);
    try {
      const response = await sendConnectionRequest({
        requesterId: currentUser.user.id,
        receiverId: userId,
        connectAs: "Friend" // Default connection type
      });
      toast.success("Connection request sent successfully!");
      setConnectionStatus('requested');
      
      // Trigger parent data refresh
      if (onApiResponse) {
        onApiResponse(response, "connection_request_sent");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send connection request");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleAcceptRequest = async () => {
    if (!userData?.connectionRequestId) return;
    
    setLoadingAction(true);
    try {
      const response = await respondToConnectionRequest(userData.connectionRequestId, "accept");
      toast.success("Connection request accepted!");
      setConnectionStatus('connected');
      
      // Trigger parent data refresh
      if (onApiResponse) {
        onApiResponse(response, "connection_accepted");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to accept request");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDeclineRequest = async () => {
    if (!userData?.connectionRequestId) return;
    
    setLoadingAction(true);
    try {
      const response = await respondToConnectionRequest(userData.connectionRequestId, "reject");
      toast.success("Connection request declined");
      setConnectionStatus('not_connected');
      
      // Trigger parent data refresh
      if (onApiResponse) {
        onApiResponse(response, "connection_rejected");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to decline request");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDisconnect = async () => {
    if (!userData?.connectionId) return;
    
    setLoadingAction(true);
    try {
      const response = await deleteConnection(userData.connectionId);
      toast.success("Connection removed successfully");
      setConnectionStatus('not_connected');
      
      // Trigger parent data refresh
      if (onApiResponse) {
        onApiResponse(response, "connection_deleted");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to remove connection");
    } finally {
      setLoadingAction(false);
    }
  };

  const renderConnectionButton = () => {
    if (loadingAction) {
      return (
        <div className="text-center">
          <CircularProgress size={20} />
        </div>
      );
    }

    switch (connectionStatus) {
      case 'connected':
        return (
          <div className="d-flex gap-2">
            <button className="btn btn-success" disabled>
              Connected
            </button>
            <button className="btn btn-outline-danger" onClick={handleDisconnect}>
              Disconnect
            </button>
          </div>
        );
      case 'requested':
        return (
          <button className="btn btn-warning" disabled>
            Request Sent
          </button>
        );
      case 'received':
        return (
          <div className="d-flex gap-2">
            <button className="btn btn-success" onClick={handleAcceptRequest}>
              Accept
            </button>
            <button className="btn btn-outline-secondary" onClick={handleDeclineRequest}>
              Decline
            </button>
          </div>
        );
      case 'not_connected':
      default:
        return (
          <button className="btn btn-primary" onClick={handleConnect}>
            Connect
          </button>
        );
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
            <CircularProgress />
          </div>
        ) : userData ? (
          <div>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
              <h3 className="mb-0">User Profile</h3>
              <button
                onClick={onClose}
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
                {userData.image ? (
                  <img
                    src={userData.image?.startsWith("http") ? userData.image : `https://feedbackwork.net/feedbackapi/${userData.image}`}
                    alt={`${userData.firstname} ${userData.lastname}`}
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
                    {getInitials(`${userData.firstname || ""} ${userData.lastname || ""}`)}
                  </div>
                )}
                <h4 className="mb-1">
                  {userData.firstname} {userData.lastname}
                </h4>
                {userData.role && (
                  <span className="badge bg-primary me-2">{userData.role.name}</span>
                )}
                {userData.expertise && (
                  <span className="badge bg-secondary">{userData.expertise}</span>
                )}
              </div>

              {/* Connection Action Button */}
              <div className="text-center mb-4">
                {renderConnectionButton()}
              </div>

              {/* Basic Information */}
              <div className="mb-4">
                <h5 className="mb-3">Basic Information</h5>
                <div className="row">
                  {userData.title && (
                    <div className="col-md-6 mb-3">
                      <strong>Title:</strong>
                      <p className="text-muted mb-0">{userData.title}</p>
                    </div>
                  )}
                  {userData.location && (
                    <div className="col-md-6 mb-3">
                      <strong>Location:</strong>
                      <p className="text-muted mb-0">{userData.location}</p>
                    </div>
                  )}
                  {userData.company && (
                    <div className="col-md-6 mb-3">
                      <strong>Company:</strong>
                      <p className="text-muted mb-0">{userData.company}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Bio/Description */}
              {userData.bio && (
                <div className="mb-4">
                  <h5 className="mb-3">About</h5>
                  <p className="text-muted">{userData.bio}</p>
                </div>
              )}

              {/* Social Links */}
              {(userData.linkedin || userData.twitter || userData.website) && (
                <div className="mb-4">
                  <h5 className="mb-3">Social Links</h5>
                  <div className="d-flex gap-3">
                    {userData.linkedin && (
                      <a
                        href={userData.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary btn-sm"
                      >
                        <FaLinkedin className="me-2" />
                        LinkedIn
                      </a>
                    )}
                    {userData.twitter && (
                      <a
                        href={userData.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-info btn-sm"
                      >
                        <FaTwitter className="me-2" />
                        Twitter
                      </a>
                    )}
                    {userData.website && (
                      <a
                        href={userData.website}
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
                      <h4 className="text-primary mb-1">{userData.totalConnections || 0}</h4>
                      <small className="text-muted">Connections</small>
                    </div>
                  </div>
                  <div className="col-md-4 text-center mb-3">
                    <div className="border rounded p-3">
                      <h4 className="text-success mb-1">{userData.totalFeedback || 0}</h4>
                      <small className="text-muted">Feedback Given</small>
                    </div>
                  </div>
                  <div className="col-md-4 text-center mb-3">
                    <div className="border rounded p-3">
                      <h4 className="text-info mb-1">{userData.totalProjects || 0}</h4>
                      <small className="text-muted">Projects</small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              {userData.createdAt && (
                <div className="mb-4">
                  <h5 className="mb-3">Member Since</h5>
                  <p className="text-muted">{formatDate(userData.createdAt)}</p>
                </div>
              )}

              {/* Skills/Expertise */}
              {userData.skills && userData.skills.length > 0 && (
                <div className="mb-4">
                  <h5 className="mb-3">Skills</h5>
                  <div className="d-flex flex-wrap gap-2">
                    {userData.skills.map((skill, index) => (
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
  );
};

export default UserProfileModal; 