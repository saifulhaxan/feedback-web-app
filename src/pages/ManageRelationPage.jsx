import React, { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Box, Button, Modal, Avatar, Badge } from "@mui/material";
import { MdAddCircle, MdModeEdit } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa6";
import { MdOutlineExpandMore } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import Children1 from "../assets/images/children1.png";
import Children2 from "../assets/images/children2.png";
import Parent1 from "../assets/images/parent1.png";
import { 
  getAllChildren, 
  createChild, 
  editChild,
  sendChildOtp, 
  verifyChildEmail,
  getAllSecondaryParents,
  removeSecondaryParent,
  getChildLinkRequests,
  respondToSecondaryParentRequest,
  cancelSecondaryParentRequest
} from "../api/childApi";
import { toast } from "react-toastify";
import useUserStore from "../store/userStore";
import useChildStore from "../store/useUserStore";
import { ROLES } from "../utils/rolePermissions";


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

export default function ManageRelationPage() {
  const location = useLocation();
  // Get current user data and role for role-based restrictions
  const { userData } = useUserStore();
  const currentUserRole = userData?.user?.role?.name;
  const isParent = currentUserRole === ROLES.PARENT;
  const isChild = currentUserRole === ROLES.CHILD;
  
  // Debug logging for role-based restrictions
  console.log('Manage Relation Page - User Role:', currentUserRole, 'Is Parent:', isParent, 'Is Child:', isChild);
  
  const [activeTab, setActiveTab] = useState(() => {
    // Child users start with "My Parents" tab
    if (currentUserRole === ROLES.CHILD) {
      return "My Parents";
    }
    // Other roles start with "Parents" tab
    return "Parents";
  });
  const [activeRequestTab, setActiveRequestTab] = useState("Received");
  const [open, setOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingChild, setEditingChild] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [editFormErrors, setEditFormErrors] = useState({});

  const setUser = useUserStore((state) => state.setUser);
  const setChildUser = useChildStore((state) => state.setUser);





  const navigate = useNavigate();

  const initialFormData = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    ageRange: "",
    grade: "",
    image: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [editFormData, setEditFormData] = useState(initialFormData);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [otpData, setOtpData] = useState({
    childId: '',
    email: ''
  })

  const [innerTab, setInnerTab] = useState("MY");

  const handleOpen = () => setOpen(true);
  const handleEditOpen = (child) => {
    setEditingChild(child);
    setEditFormData({
      firstname: child.firstname || "",
      lastname: child.lastname || "",
      email: child.email || "",
      password: "",
      confirmPassword: "",
      ageRange: child.ageRange || "",
      grade: child.grade || "",
      image: child.image || "",
    });
    setEditImagePreview(child.image ? `https://feedbackwork.net/feedbackapi/${child.image.replace(/^\/+/, "")}` : null);
    setEditModalOpen(true);
  };
  const handleEditClose = () => {
    setEditModalOpen(false);
    setEditingChild(null);
    setEditFormData(initialFormData);
    setEditImagePreview(null);
    setEditFormErrors({});
  };

  const [myChildrenArr, setChildArr] = useState();
  const [myParentArr, setParentArr] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);

  const fetchChild = () => {
    // setIsRequestsLoading(true);
    getAllChildren()
      .then((res) => {
        console.log(res, "children data");
        setChildArr(res?.data?.data);
      })
      .catch((err) => {
        console.error("Failed to fetch children", err);
      })
      .finally(() => {
        // setIsRequestsLoading(false);
      });
  };

  const fetchParents = () => {
    getAllSecondaryParents()
      .then((res) => {
        console.log(res, "parents data");
        setParentArr(res?.data?.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch parents", err);
      });
  };

  const fetchRequests = async (sent = false) => {
    setIsLoadingRequests(true);
    try {
      const response = await getChildLinkRequests(sent);
      const requests = response?.data?.data || [];
      
      if (sent) {
        setSentRequests(requests);
      } else {
        setReceivedRequests(requests);
      }
    } catch (error) {
      console.error("Failed to fetch requests", error);
      toast.error("Failed to fetch requests");
    } finally {
      setIsLoadingRequests(false);
    }
  };

  const handleRemoveParent = async (parentId) => {
    if (window.confirm("Are you sure you want to remove this parent?")) {
      try {
        const { data } = await removeSecondaryParent(parentId);
        toast.success(data?.data?.data?.message || "Parent removed successfully!");
        // Refresh all data as relationships have changed
        fetchParents();
        fetchChild();
        fetchRequests(false);
        fetchRequests(true);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to remove parent");
      }
    }
  };

  const handleRequestAction = async (requestId, action) => {
    try {
      if (action === 'cancel') {
        await cancelSecondaryParentRequest(requestId);
        toast.success("Request cancelled successfully!");
      } else {
        await respondToSecondaryParentRequest(requestId, action);
        toast.success(`Request ${action === 'accept' ? 'accepted' : 'rejected'} successfully!`);
      }
      
      // Refresh both received and sent requests
      fetchRequests(false);
      fetchRequests(true);
      
      // Also refresh children and parents data as relationships may have changed
      fetchChild();
      if (isParent) {
        fetchParents();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || `Failed to ${action} request`);
    }
  };

  const handleSendChildVerification = async (childId, email) => {
    try {
      await sendChildOtp({ childId, email });
      toast.success("Verification OTP sent successfully!");
      // Navigate to verify OTP screen
      navigate("/verify-otp-data", { 
        state: { 
          childId, 
          email 
        } 
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send verification OTP");
    }
  };

  // Function to refresh all data after verification
  const refreshAllData = () => {
    fetchChild();
    if (isParent) {
      fetchParents();
    }
    fetchRequests(false);
    fetchRequests(true);
  };


  useEffect(() => {
    // Check URL parameters for tab selection
    const urlParams = new URLSearchParams(location.search);
    const tabParam = urlParams.get('tab');
    
    if (tabParam === 'children') {
      setActiveTab("Children");
    }
    
    fetchChild();
    // Only fetch parents data if user is a parent
    if (isParent) {
      fetchParents();
    }
    fetchRequests(false); // Fetch received requests
    fetchRequests(true);  // Fetch sent requests
  }, [isParent, location.search])

  // Refresh data when active tab changes
  useEffect(() => {
    if (activeTab === "Parents" && isParent) {
      fetchParents();
    } else if (activeTab === "Children") {
      fetchChild();
            } else if (activeTab === "Request") {
      fetchRequests(false); // Fetch received requests
      fetchRequests(true);  // Fetch sent requests
    }
  }, [activeTab, isParent])

  // Refresh data when inner tab changes
  useEffect(() => {
    if (activeTab === "Children") {
      fetchChild();
    }
  }, [innerTab])

  // Refresh data when request tab changes
  useEffect(() => {
    if (activeTab === "Request") {
      fetchRequests(false); // Fetch received requests
      fetchRequests(true);  // Fetch sent requests
    }
  }, [activeRequestTab])

  const handleClose = () => {
    setFormData(initialFormData);
    setImagePreview(null);
    setFormErrors({});
    setOpen(false);
  };

  const allRelations = [
    { id: 1, image: Parent1, relationName: "Greg Anthony", relation: "Parent" },
    { id: 2, image: Children1, relationName: "Mike Henry", relation: "Children" },
    { id: 3, image: Children2, relationName: "Janet Rose", relation: "Children" },
  ];

  // const myChildrenArr = [
  //   { id: 1, image: Children1, relationName: "Mike Henry", relation: "Children" },
  //   { id: 2, image: Children2, relationName: "Janet Rose", relation: "Children" },
  // ];

  // Removed hardcoded myParentArr - now using state variable

  const filterCategories = ["0-5", "5-17", "17-23"];
  const gradeCategory = ["1st Grade", "2nd Grade", "3rd Grade", "4rth Grade", "5th Grade", "6th Grade"];

  const toggleExpand = () => setIsExpanded((prev) => !prev);
  const handleSwitchTabs = (tabNameOrEvent) => {
    // Handle both direct tab name and event object
    const newTab = typeof tabNameOrEvent === 'string' 
      ? tabNameOrEvent 
      : tabNameOrEvent.target?.name || tabNameOrEvent;
    
    console.log('Switching to tab:', newTab); // Debug log
    
    // Clear existing data before switching tabs to prevent stale data
    setChildArr([]);
    setParentArr([]);
    setSentRequests([]);
    setReceivedRequests([]);
    
    // Set the new active tab
    setActiveTab(newTab);
    
    // Force immediate data refresh for the new tab
    setTimeout(() => {
      if (newTab === "Parents" && isParent) {
        fetchParents();
      } else if (newTab === "Children") {
        fetchChild();
      } else if (newTab === "Request") {
        fetchRequests(false); // Fetch received requests
        fetchRequests(true);  // Fetch sent requests
      }
    }, 100); // Small delay to ensure state is updated
  };

  // Handler for inner tab switching (MY/Linked)
  const handleSwitchInnerTabs = (newInnerTab) => {
    setInnerTab(newInnerTab);
    
    // Clear and refresh children data when switching inner tabs
    setChildArr([]);
    setTimeout(() => {
      fetchChild();
    }, 100);
  };

  // Handler for request tab switching (Received/Sent)
  const handleSwitchRequestTabs = (newRequestTab) => {
    setActiveRequestTab(newRequestTab);
    
    // Clear and refresh request data when switching request tabs
    setSentRequests([]);
    setReceivedRequests([]);
    setTimeout(() => {
      fetchRequests(false); // Fetch received requests
      fetchRequests(true);  // Fetch sent requests
    }, 100);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    console.log('data', formData)
  };

  const handleEditChange = (e) => {
    const { id, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [id]: value }));
  };

  const toggleFilter = (value) => {
    setFormData((prev) => ({
      ...prev,
      ageRange: prev.ageRange === value ? "" : value,
    }));
  };

  const toggleGrade = (value) => {
    setFormData((prev) => ({
      ...prev,
      grade: prev.grade === value ? "" : value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setFormData((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleEditImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setEditImagePreview(reader.result);
      setEditFormData((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };





  const sendOtpData = async () => {
    try {
      const { data } = await sendChildOtp(otpData);
      toast.success(data?.data?.data?.message || "OTP sent successfully!");


    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send OTP");
    }
  }


  const handleSuccess = (response) => {
    const { id, email } = response.data.data;
    useUserStore.getState().setUser({
      childId: id,
      email: email,
    });
    // Navigate to next screen
    navigate("/verify-otp-data");
  };

  const handleSubmit = async () => {
    const errors = {};

    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (!formData.ageRange) errors.ageRange = "Age range is required";
    if (!formData.grade) errors.grade = "Grade is required";
    if (!formData.password) errors.password = "Password is required";
    if (!formData.confirmPassword) errors.confirmPassword = "Please re-enter password";
    if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = "Passwords do not match";
    // Image is optional - removed validation

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      console.log("✅ Validated Form Data", formData);

      // Remove image and confirmPassword before sending
      const { image, confirmPassword, ...cleanedData } = formData;

      try {
        const resp = await createChild(cleanedData);
        const payload = resp?.data;

        if (!payload?.status) {
          toast.error(payload?.message || "Failed to create child");
          return;
        }

        const createdChild = payload?.data;

        // Send OTP immediately after successful creation
        try {
          console.log("🚀 Sending OTP for child:", createdChild?.id, createdChild?.email);
          const otpResult = await sendChildOtp({ childId: createdChild?.id, email: createdChild?.email });
          console.log("✅ OTP sent successfully, result:", otpResult);
          
          // Show success toast
          toast.success("Child created successfully! OTP sent for verification.");
          
          // Save child data to child store (not user store)
          setChildUser({
            childId: createdChild?.id,
            email: createdChild?.email,
          });

          // Close modal and refresh data
          handleClose();
          fetchChild();
          
          // Navigate immediately
          console.log("✅ Navigating to verification screen");
          console.log("✅ Navigation state:", { 
            childId: createdChild?.id, 
            email: createdChild?.email 
          });
          
          // Use window.location as fallback if navigate doesn't work
          try {
            navigate("/verify-otp-data", { 
              state: { 
                childId: createdChild?.id, 
                email: createdChild?.email 
              } 
            });
          } catch (navError) {
            console.error("❌ Navigation error:", navError);
            window.location.href = "/verify-otp-data";
          }
        } catch (otpErr) {
          console.error("❌ OTP Error:", otpErr);
          console.error("❌ OTP Error Response:", otpErr?.response);
          console.error("❌ OTP Error Message:", otpErr?.message);
          toast.error(otpErr?.response?.data?.message || "Failed to send OTP");
          return;
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to create child");
      }
    }
  };

  const handleEditSubmit = async () => {
    const errors = {};

    // if (!editFormData.firstame.trim()) errors.firstname = "First name is required";
    // if (!editFormData.lastname.trim()) errors.lastname = "Last name is required";

    if (!editFormData.ageRange) errors.ageRange = "Age range is required";
    if (!editFormData.grade) errors.grade = "Grade is required";

    setEditFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      console.log("✅ Validated Edit Form Data", editFormData);
      console.log("🔧 Editing Child ID:", editingChild.id);

      // Remove image, confirmPassword, and email before sending
      const { image, confirmPassword, email, ...cleanedData } = editFormData;
      console.log("📤 Sending cleaned data to API:", cleanedData);

      try {
        console.log("🚀 Making PUT request to edit child...");
        const resp = await editChild(editingChild.id, cleanedData);
        console.log("✅ Edit API Response:", resp);
        
        const payload = resp?.data;
        console.log("📋 Response payload:", payload);

        if (!payload?.status) {
          console.error("❌ API returned false status:", payload);
          toast.error(payload?.message || "Failed to update child");
          return;
        }

        toast.success(payload?.data?.data?.message || "Child updated successfully!");
        handleEditClose();
        // Refresh children list immediately
        fetchChild();
      } catch (error) {
        console.error("❌ Edit child API error:", error);
        console.error("❌ Error response:", error?.response);
        console.error("❌ Error message:", error?.message);
        
        if (error?.response?.status === 401) {
          toast.error("Authentication failed. Please login again.");
        } else if (error?.response?.status === 403) {
          toast.error("You don't have permission to perform this action.");
        } else if (error?.response?.status === 404) {
          toast.error("Child not found. Please refresh the page.");
        } else if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else if (error?.message) {
          toast.error(`Request failed: ${error.message}`);
        } else {
          toast.error("Failed to update child. Please try again.");
        }
      }
    }
  };






  // Removed OTP side-effect; handled inline after creation to avoid duplicate toasts

  // Role-based tab filtering
  const availableTabs = useMemo(() => {
    if (isChild) {
      // CHILD role: only show "Parent" tab (no inner tabs)
      return ["Parent"];
    } else if (isParent) {
      // PARENT role: show "Parents", "Children", and "Request" with inner tabs
      return ["Parents", "Children", "Request"];
    } else {
      // Regular/Teacher/Manager: show "Children" and "Request" without inner tabs
      return ["Children", "Request"];
    }
  }, [isChild, isParent]);

  // Ensure active tab is valid for current user role
  useEffect(() => {
    if (!availableTabs.includes(activeTab)) {
      if (isChild) {
        setActiveTab("Parent"); // Default to Parent tab for children
      } else if (isParent) {
        setActiveTab("Parents"); // Default to Parents tab for parents
      } else {
        setActiveTab("Children"); // Default to Children tab for others
      }
    }
  }, [availableTabs, activeTab, isChild, isParent]);

  // Force "Received" tab for non-parent roles in Request tab
  useEffect(() => {
    if (activeTab === "Request" && !isParent && activeRequestTab !== "Received") {
      setActiveRequestTab("Received");
    }
  }, [activeTab, isParent, activeRequestTab]);

console.log('myChildrenArr', myParentArr)


  return (
    <section className="main_wrapper pb-5">
      <div className="container-fluid ps-5 pe-5">
        <div className="row py-3">
          <div className="received-feedback-breadcrums d-flex mt-3">
            <p className="mb-0 me-2 text-primary fw-500">MY PROFILE</p>
            <p className="mb-0 me-2 fw-500">\</p>
            <p className="mb-0 me-2 text-primary fw-500">EDIT PROFILE</p>
            <p className="mb-0 me-2">\</p>
            <p className="mb-0 fw-500">MY CHILDREN</p>
          </div>
        </div>

        <div className="connection-btns-line d-flex align-items-center justify-content-between mt-4 mb-4">
          <div>
            <div className="connection-btn-wrap d-flex">
              {availableTabs.map((tab) => (
                <Button
                  key={tab}
                  sx={{
                    textTransform: "none",
                    bgcolor: activeTab === tab ? "#EBF5FF" : "white",
                    color: activeTab === tab ? "#0064D1" : "black",
                    fontWeight: "bold",
                  }}
                  className="me-2"
                  onClick={() => handleSwitchTabs(tab)}
                >
                  {tab}
                </Button>
              ))}
            </div>
            {!isParent && (
              <p className="text-muted mb-0 mt-2" style={{ fontSize: '14px' }}>
                As a child account, you can only manage your children and requests.
              </p>
            )}
          </div>
        </div>

        {(activeTab === "Parent" || activeTab === "Parents") && (
          <div className="relation-card-wrap">
            {/* Add Parent Card - only for PARENT role */}
            {isParent && (
              <div className="group-card-wrapper pt-4 pb-4 mb-3 text-center d-flex align-items-center justify-content-center">
                <div className="group-card">
                  <div className="image-wrapper">
                    <div className="group-description-wrap cursor-pointer" onClick={() => navigate("/add-parent")}>
                      <MdAddCircle className="text-primary add-relation-icon" />
                      <p className="mb-0 fw-500 text-primary">Add Parent</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {myParentArr.map((card) => (
              <div key={`${card.parent?.id}-${card.relationshipType?.id}`} className="group-card-wrapper pt-4 pb-4 mb-3 text-center">
                <div className="group-card">
                  <div className="image-wrapper">
                    <div className="image-wrap mb-2">
                      {card?.image ? (
                        <img
                          src={`https://feedbackwork.net/feedbackapi/${card.image.replace(/^\/+/, "")}`}
                          alt={`${card?.firstname || ''} ${card?.lastname || ''}`.trim()}
                        />
                      ) : (
                        <div className="avatar-circle">
                          <span className="avatar-text">{(card.parent?.firstName?.charAt(0) || 'U').toUpperCase()}</span>
                        </div>
                      )}
                    </div>
                    <div className="group-description-wrap">
                      <h6 className="mb-1 fw-bold">{`${card?.firstname || ''} ${card?.lastname || ''}`.trim()}</h6>
                      <p className="mb-0 fw-500">{card.email}</p>
                      {card.sameResidence && (
                        <p className="mb-0 small text-success">Same residence</p>
                      )}
                      <div className="mt-2">
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleRemoveParent(card?.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Children" && (
          <>
            {/* Show inner tabs only for PARENT role */}
            {isParent && (
              <div className="mb-3 d-flex gap-3">
                <button
                  className={`btn p-2 py-1 ${innerTab === "MY" ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={() => handleSwitchInnerTabs("MY")}
                >
                  MY
                </button>
                <button
                  className={`btn p-2 py-1 ${innerTab === "Linked" ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={() => handleSwitchInnerTabs("Linked")}
                >
                  Linked
                </button>
              </div>
            )}
            <div className="relation-card-wrap">
              {/* Add Children Card - only for PARENT role */}
              {isParent && (
                <div className="group-card-wrapper pt-4 pb-4 mb-3 text-center d-flex align-items-center justify-content-center">
                  <div className="group-card">
                    <div className="image-wrapper">
                      <div className="group-description-wrap cursor-pointer" onClick={handleOpen}>
                        <MdAddCircle className="text-primary add-relation-icon" />
                        <p className="mb-0 fw-500 text-primary">Add Children</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Children Cards */}
              {innerTab === "MY" ? (
                // MY tab - show primary children directly
                myChildrenArr?.primaryChildren?.map(card => (
                  <div key={card.id} className="group-card-wrapper pt-4 pb-4 mb-3 text-center">
                    <div className="group-card">
                      <div className="image-wrapper">
                        <div className="image-wrap mb-2">
                          {card.image ? (
                            <img 
                              src={`https://feedbackwork.net/feedbackapi/${card.image.replace(/^\/+/, "")}`}
                              alt={card.firstname + ' ' + card.lastname} 
                            />
                          ) : (
                            <div className="avatar-circle">
                              <span className="avatar-text">
                                {(card.firstname?.charAt(0) || 'U').toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="group-description-wrap">
                          <h6 className="mb-1 fw-bold">{card.firstname + ' ' + card.lastname}</h6>
                          <p className="mb-0 fw-500">Grade: {card.grade}</p>
                          <p className="mb-0 fw-500">Age: {card.ageRange}</p>
                          <div className="mt-2 d-flex gap-2 justify-content-center align-items-center">
                            {!card.isVerified && (
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => handleSendChildVerification(card.id, card.email)}
                              >
                                Send Verification
                              </button>
                            )}
                            {card.isVerified && (
                              <span className="badge bg-success">Verified</span>
                            )}
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => handleEditOpen(card)}
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // Linked tab - show secondary children in tree structure
                myChildrenArr?.secondaryChildren?.map((parentGroup, parentIndex) => (
                  <div key={parentIndex} className="group-card-wrapper pt-4 pb-4 mb-3">
                    <div className="group-card">
                      {/* Primary Parent */}
                      <div className="image-wrapper mb-3">
                        <div className="image-wrap mb-2">
                          {parentGroup.primaryParent?.image ? (
                            <img 
                              src={`https://feedbackwork.net/feedbackapi/${parentGroup.primaryParent.image.replace(/^\/+/, "")}`}
                              alt={parentGroup.primaryParent.firstname + ' ' + parentGroup.primaryParent.lastname} 
                            />
                          ) : (
                            <div className="avatar-circle">
                              <span className="avatar-text">
                                {(parentGroup.primaryParent?.firstname?.charAt(0) || 'U').toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="group-description-wrap text-center">
                          <h6 className="mb-1 fw-bold">{parentGroup.primaryParent?.firstname + ' ' + parentGroup.primaryParent?.lastname}</h6>
                          <p className="mb-0 fw-500">Primary Parent</p>
                          <p className="mb-0 fw-500">{parentGroup.primaryParent?.title}</p>
                        </div>
                      </div>
                      
                      {/* Children under this parent */}
                      <div className="children-section p-3">
                        <h6 className="mb-2 text-muted">Childrens:</h6>
                        {parentGroup.children?.map(child => (
                          <div key={child.id} className="child-item mb-2 p-2 border rounded">
                            <div className="d-flex align-items-center">
                              <div className="me-3">
                                {child.image ? (
                                  <img 
                                    src={`https://feedbackwork.net/feedbackapi/${child.image.replace(/^\/+/, "")}`}
                                    alt={child.firstname + ' ' + child.lastname}
                                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                                  />
                                ) : (
                                  <div style={{ 
                                    width: '40px', 
                                    height: '40px', 
                                    borderRadius: '50%', 
                                    backgroundColor: '#0064D1',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '14px',
                                    fontWeight: 'bold'
                                  }}>
                                    {(child.firstname?.charAt(0) || 'U').toUpperCase()}
                                  </div>
                                )}
                              </div>
                              <div className="flex-grow-1">
                                <h6 className="mb-0 fw-bold">{child.firstname + ' ' + child.lastname}</h6>
                                <p className="mb-0 small text-muted">Grade: {child.grade} | Age: {child.ageRange}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {activeTab === "Request" && (
          <>
            {/* Show inner tabs only for PARENT role */}
            {isParent ? (
              <div className="mb-3 d-flex gap-3">
                <button
                  className={`btn p-2 py-1 ${activeRequestTab === "Received" ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={() => handleSwitchRequestTabs("Received")}
                >
                  Received
                </button>
                <button
                  className={`btn p-2 py-1 ${activeRequestTab === "Sent" ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={() => handleSwitchRequestTabs("Sent")}
                >
                  Sent
                </button>
              </div>
            ) : (
              // For non-parent roles, force "Received" tab and show info
              <div className="mb-3">
                <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                  You can only view received requests.
                </p>
              </div>
            )}
            <div className="relation-card-wrap">
              {isLoadingRequests ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : activeRequestTab === "Received" ? (
                receivedRequests.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted">No received requests</p>
                  </div>
                ) : (
                  receivedRequests.map((request) => (
                    <div key={request.id} className="group-card-wrapper pt-4 pb-4 mb-3 text-center">
                      <div className="group-card">
                        <div className="image-wrapper">
                          <div className="image-wrap mb-2">
                            {request.requester?.image ? (
                              <img 
                                src={`https://feedbackwork.net/feedbackapi/${request.requester.image.replace(/^\/+/, "")}`}
                                alt={request.requester.firstname + ' ' + request.requester.lastname} 
                              />
                            ) : (
                              <div className="avatar-circle">
                                <span className="avatar-text">
                                  {(request.requester?.firstname?.charAt(0) || 'U').toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="group-description-wrap">
                            <h6 className="mb-1 fw-bold">
                              {request.requester?.firstname + ' ' + (request.requester?.lastname || '')}
                            </h6>
                            <p className="mb-0 fw-500">Parent Request</p>
                            <p className="mb-2 text-muted small">
                              Status: {request.status}
                            </p>
                            <div className="mt-2">
                              <button
                                className="btn btn-sm btn-success me-2"
                                onClick={() => handleRequestAction(request.id, 'accept')}
                              >
                                Accept
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleRequestAction(request.id, 'reject')}
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )
              ) : (
                sentRequests.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted">No sent requests</p>
                  </div>
                ) : (
                  sentRequests.map((request) => (
                    <div key={request.id} className="group-card-wrapper pt-4 pb-4 mb-3 text-center">
                      <div className="group-card">
                        <div className="image-wrapper">
                          <div className="image-wrap mb-2">
                            {request.receiver?.image ? (
                              <img 
                                src={`https://feedbackwork.net/feedbackapi/${request.receiver.image.replace(/^\/+/, "")}`}
                                alt={request.receiver.firstname + ' ' + request.receiver.lastname} 
                              />
                            ) : (
                              <div className="avatar-circle">
                                <span className="avatar-text">
                                  {(request.receiver?.firstname?.charAt(0) || 'U').toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="group-description-wrap">
                            <h6 className="mb-1 fw-bold">
                              {request.receiver?.firstname + ' ' + (request.receiver?.lastname || '')}
                            </h6>
                            <p className="mb-0 fw-500">Request Sent</p>
                            <p className="mb-2 text-muted small">
                              Status: {request.status}
                            </p>
                            <div className="mt-2">
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleRequestAction(request.id, 'cancel')}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          </>
        )}

      </div>

      {/* Modal for Add Child */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <h3 className="mb-4">Add Child</h3>

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

          <div className="row">
            <div className="col-lg-6">
              <div className="form-group mb-3">
                <label className="auth-label">First Name</label>
                <div className="authInputWrap d-flex align-items-center">
                  <input
                    id="firstName"
                    type="text"
                    className="form-control auth-input"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                {formErrors.firstName && <small className="text-danger">{formErrors.firstName}</small>}
              </div>

              <div className="form-group mb-3">
                <label className="auth-label">Age Range</label>
                <ul className="list-unstyled add-child-list">
                  {filterCategories.map((item) => (
                    <li
                      key={item}
                      className={`filter-item d-flex justify-content-between align-items-center p-2 rounded cursor-pointer fw-bold ${formData.ageRange === item ? "text-primary" : ""
                        }`}
                      onClick={() => toggleFilter(item)}
                    >
                      <span>{item}</span>
                      {formData.ageRange === item && <FaCheck className="text-primary" />}
                    </li>
                  ))}
                </ul>
                {formErrors.ageRange && <small className="text-danger">{formErrors.ageRange}</small>}
              </div>

              <div className="form-group mb-3">
                <label className="auth-label">Email</label>
                <div className="authInputWrap d-flex align-items-center">
                  <input
                    id="email"
                    type="email"
                    className="form-control auth-input"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                {formErrors.email && <small className="text-danger">{formErrors.email}</small>}
              </div>
            </div>

            <div className="col-lg-6">
              <div className="form-group mb-3">
                <label className="auth-label">Last Name</label>
                <div className="authInputWrap d-flex align-items-center">
                  <input
                    id="lastName"
                    type="text"
                    className="form-control auth-input"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>

                {formErrors.lastName && <small className="text-danger">{formErrors.lastName}</small>}
              </div>

              <div className="form-group mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <label className="auth-label">Grade</label>
                  <label className="text-primary mb-0 cursor-pointer" onClick={toggleExpand}>
                    {isExpanded ? "View Less Grades" : "View More Grades"} <MdOutlineExpandMore />
                  </label>
                </div>
                <ul className="list-unstyled add-child-list">
                  {gradeCategory.slice(0, isExpanded ? gradeCategory.length : 3).map((item) => (
                    <li
                      key={item}
                      className={`filter-item d-flex justify-content-between align-items-center p-2 rounded cursor-pointer fw-bold ${formData.grade === item ? "text-primary" : ""
                        }`}
                      onClick={() => toggleGrade(item)}
                    >
                      <span>{item}</span>
                      {formData.grade === item && <FaCheck className="text-primary" />}
                    </li>
                  ))}
                </ul>
                {formErrors.grade && <small className="text-danger">{formErrors.grade}</small>}
              </div>

              <div className="form-group mb-3">
                <label className="auth-label">Password</label>
                <div className="authInputWrap d-flex align-items-center position-relative">
                  <input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    className="form-control auth-input" 
                    value={formData.password} 
                    onChange={handleChange} 
                  />
                  <button
                    type="button"
                    className="btn btn-link position-absolute end-0 me-3"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ zIndex: 10 }}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {formErrors.password && <small className="text-danger">{formErrors.password}</small>}
              </div>

              <div className="form-group mb-3">
                <label className="auth-label">Re-enter Password</label>
                <div className="authInputWrap d-flex align-items-center position-relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    className="form-control auth-input"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="btn btn-link position-absolute end-0 me-3"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ zIndex: 10 }}
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {formErrors.confirmPassword && <small className="text-danger">{formErrors.confirmPassword}</small>}
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between mt-5 mb-5">
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit}>Save</Button>
          </div>
        </Box>
      </Modal>

      {/* Edit Child Modal */}
      <Modal open={editModalOpen} onClose={handleEditClose}>
        <Box sx={style}>
          <h3 className="mb-4">Edit Child</h3>

          <div className="form-group mb-4 text-center">
            <label htmlFor="edit-image-upload" className="cursor-pointer">
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={<MdModeEdit className="profile-edit" />}
              >
                <Avatar src={editImagePreview} sx={{ width: 90, height: 90 }} />
              </Badge>
            </label>
            <input type="file" id="edit-image-upload" accept="image/*" onChange={handleEditImageUpload} style={{ display: "none" }} />
          </div>

          <div className="row">
            <div className="col-lg-6">
              <div className="form-group mb-3">
                <label className="auth-label">First Name</label>
                <div className="authInputWrap d-flex align-items-center">
                  <input
                    id="firstName"
                    type="text"
                    className="form-control auth-input"
                    placeholder="First name"
                    value={editFormData.firstname}
                    onChange={handleEditChange}
                  />
                </div>
                {editFormErrors.firstName && <small className="text-danger">{editFormErrors.firstName}</small>}
              </div>

              <div className="form-group mb-3">
                <label className="auth-label">Age Range</label>
                <ul className="list-unstyled add-child-list">
                  {filterCategories.map((item) => (
                    <li
                      key={item}
                      className={`filter-item d-flex justify-content-between align-items-center p-2 rounded cursor-pointer fw-bold ${editFormData.ageRange === item ? "text-primary" : ""
                        }`}
                      onClick={() => setEditFormData(prev => ({ ...prev, ageRange: prev.ageRange === item ? "" : item }))}
                    >
                      <span>{item}</span>
                      {editFormData.ageRange === item && <FaCheck className="text-primary" />}
                    </li>
                  ))}
                </ul>
                {editFormErrors.ageRange && <small className="text-danger">{editFormErrors.ageRange}</small>}
              </div>

              <div className="form-group mb-3">
                <label className="auth-label">
                  Email {editingChild?.isVerified ? "(Verified - Read-only)" : "(Editable)"}
                </label>
                <div className="authInputWrap d-flex align-items-center">
                  <input
                    id="email"
                    type="email"
                    className="form-control auth-input"
                    placeholder="Enter email"
                    value={editFormData.email}
                    onChange={handleEditChange}
                    readOnly={editingChild?.isVerified}
                    style={{ 
                      backgroundColor: editingChild?.isVerified ? '#f8f9fa' : 'white',
                      cursor: editingChild?.isVerified ? 'not-allowed' : 'text'
                    }}
                  />
                </div>
                <small className="text-muted">Email cannot be changed</small>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="form-group mb-3">
                <label className="auth-label">Last Name</label>
                <div className="authInputWrap d-flex align-items-center">
                  <input
                    id="lastname"
                    type="text"
                    className="form-control auth-input"
                    placeholder="Last name"
                    value={editFormData.lastname}
                    onChange={handleEditChange}
                  />
                </div>
                {editFormErrors.lastname && <small className="text-danger">{editFormErrors.lastname}</small>}
              </div>

              <div className="form-group mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <label className="auth-label">Grade</label>
                  <label className="text-primary mb-0 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                    {isExpanded ? "View Less Grades" : "View More Grades"} <MdOutlineExpandMore />
                  </label>
                </div>
                <ul className="list-unstyled add-child-list">
                  {gradeCategory.slice(0, isExpanded ? gradeCategory.length : 3).map((item) => (
                    <li
                      key={item}
                      className={`filter-item d-flex justify-content-between align-items-center p-2 rounded cursor-pointer fw-bold ${editFormData.grade === item ? "text-primary" : ""
                        }`}
                      onClick={() => setEditFormData(prev => ({ ...prev, grade: prev.grade === item ? "" : item }))}
                    >
                      <span>{item}</span>
                      {editFormData.grade === item && <FaCheck className="text-primary" />}
                    </li>
                  ))}
                </ul>
                {editFormErrors.grade && <small className="text-danger">{editFormErrors.grade}</small>}
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between mt-5 mb-5">
            <Button onClick={handleEditClose}>Cancel</Button>
            <Button onClick={handleEditSubmit}>Update Child</Button>
          </div>
        </Box>
      </Modal>
    </section>
  );
}
