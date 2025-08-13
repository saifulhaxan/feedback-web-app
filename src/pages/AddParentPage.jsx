import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import { IoCloudUploadOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { IoFilter } from "react-icons/io5";
import SocialMedia from "../assets/images/social-media.png";
import Automotive from "../assets/images/automotive.png";
import Accounting from "../assets/images/accounting.png";
import Education from "../assets/images/education.png";
import Arts from "../assets/images/arts.png";
import Analytics from "../assets/images/analytics.png";
import Engineer from "../assets/images/engineer.png";
import Software from "../assets/images/software.png";
import Business from "../assets/images/business.png";
import Sales from "../assets/images/sales.png";
import Legal from "../assets/images/legal.png";
import Writing from "../assets/images/writing.png";
import User1 from "../assets/images/user1.png";
import User2 from "../assets/images/user2.png";
import User3 from "../assets/images/user3.png";
import User4 from "../assets/images/user4.png";
import User5 from "../assets/images/user5.png";
import User6 from "../assets/images/user6.png";
import NetworkProfile from "../assets/images/network-profile.png";
import { useState, useEffect } from "react";
import { FaCheck } from "react-icons/fa";
import { Switch } from "@mui/material";
import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { addSecondaryParent, getAllChildren } from "../api/childApi";
import useUserStore from "../store/userStore";
import { toast } from "react-toastify";
import Fetcher from "../library/Fetcher";

const steps = [
  "Select Parent",
  "Relationship with Children",
  "Select Residence",
];

export default function AddParentPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [userFilters, setUserFilters] = useState([]);
  const [selectedResidence, setSelectedResidence] = useState(false);
  const [customRelationship, setCustomRelationship] = useState("");
  const [parentData, setParentData] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    // Validate current step before proceeding
    if (!isStepValid(activeStep)) {
      return;
    }

    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  // Function to validate if current step is complete
  const isStepValid = (step) => {
    switch (step) {
      case 0: // Select Parent
        return userFilters && userFilters.length > 0;
      case 1: // Relationship with Children
        if (!selectedFilters || selectedFilters.length === 0) {
          return false;
        }
        // If "OTHER" is selected, check if custom relationship is provided
        const selectedRelationshipType = filterUserList?.relationshipTypes?.find(item => 
          item.id === (Array.isArray(selectedFilters) ? selectedFilters[0] : selectedFilters)
        );
        if (selectedRelationshipType?.name === "OTHER" && !customRelationship.trim()) {
          return false;
        }
        return true;
      case 2: // Select Residence
        return selectedResidence !== undefined && selectedResidence !== null;
      default:
        return true;
    }
  };

  // Function to get validation message for current step
  const getValidationMessage = (step) => {
    switch (step) {
      case 0:
        return "Please select a parent to continue";
      case 1:
        if (!selectedFilters || selectedFilters.length === 0) {
          return "Please select a relationship type to continue";
        }
        const selectedRelationshipType = filterUserList?.relationshipTypes?.find(item => 
          item.id === (Array.isArray(selectedFilters) ? selectedFilters[0] : selectedFilters)
        );
        if (selectedRelationshipType?.name === "OTHER" && !customRelationship.trim()) {
          return "Please specify the custom relationship type to continue";
        }
        return "";
      case 2:
        return "Please select a residence option to continue";
      default:
        return "";
    }
  };

  // Function to get step status for visual feedback
  const getStepStatus = (step) => {
    if (step < activeStep) {
      return "completed";
    } else if (step === activeStep) {
      return isStepValid(step) ? "valid" : "invalid";
    } else {
      return "pending";
    }
  };

  const handleBack = () => {
    if (activeStep === 0) {
      navigate("/status");
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  //   const handleReset = () => {
  //     setActiveStep(0);
  //     setUploadedFile(null); // Reset the uploaded file when resetting the steps
  //   };


  const { userData } = useUserStore();
  const userID = userData?.user?.id;


  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Check authentication
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("Please login to continue");
        navigate("/login");
        return;
      }

      // Validate required fields
      if (!userFilters || userFilters.length === 0) {
        toast.error("Please select a parent to add");
        return;
      }

      if (!selectedFilters || selectedFilters.length === 0) {
        toast.error("Please select a relationship type");
        return;
      }

      // Check if "OTHER" is selected but no custom relationship provided
      const selectedRelationshipType = filterUserList?.relationshipTypes?.find(item => 
        item.id === (Array.isArray(selectedFilters) ? selectedFilters[0] : selectedFilters)
      );
      
      if (selectedRelationshipType?.name === "OTHER" && !customRelationship.trim()) {
        toast.error("Please specify the custom relationship type");
        return;
      }

      // Note: This API is for adding secondary parent to existing children
      // The backend will handle the validation of whether user has children

      const formattedData = {
        receiverId: Array.isArray(userFilters) ? userFilters[0] : userFilters,
        relationshipTypeId: Array.isArray(selectedFilters) ? selectedFilters[0] : selectedFilters,
        sameResidence: selectedResidence,
      };

      // Add customRelationship if provided
      if (customRelationship.trim()) {
        formattedData.customRelationship = customRelationship.trim();
      }

      // Validate data structure for link-request API
      console.log("📋 Link-request data validation:");
      console.log("- receiverId (secondary parent):", formattedData.receiverId);
      console.log("- relationshipTypeId:", formattedData.relationshipTypeId);
      console.log("- sameResidence:", formattedData.sameResidence);
      console.log("- customRelationship:", formattedData.customRelationship);

      if (!formattedData.receiverId || !formattedData.relationshipTypeId) {
        toast.error("Please select both a parent and relationship type.");
        return;
      }

      console.log("📤 Sending data to API:", formattedData);
      
      // Make the API call directly here instead of using useEffect
      const response = await addSecondaryParent(formattedData);
      console.log("✅ Link-request API Success:", response.data);
      toast.success(response?.data?.data?.data?.message || "Secondary parent link request sent successfully!");
      navigate("/manage-relation");
      
    } catch (error) {
      if (error?.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else if (error?.response?.status === 403) {
        toast.error("You don't have permission to perform this action.");
      } else if (error?.response?.status === 404) {
        // Check if user has children first
        toast.error("You need to create at least one child before adding a secondary parent. Please create a child first.");
      } else if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error?.message) {
        toast.error(`Request failed: ${error.message}`);
      } else {
        toast.error("Failed to add secondary parent. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  // Removed useEffect that was causing timing issues
  // API call is now made directly in handleSubmit




  const residenceArr = [
    {
      id: 1,
      options: ["Same Residence", "Separate Residence"],
    },
  ];

  // Function to toggle a single filter
  const toggleResidence = (option) => {
    const isSame = option.toLowerCase() === "same residence";
    setSelectedResidence(isSame);
  };



  // Function to toggle a single filter
  const toggleFilter = (filter) => {
    setSelectedFilters((prev) => {
      // If the clicked filter is already selected, deselect it (set to empty array)
      if (prev.includes(filter)) {
        return [];
      }
      // Otherwise, set the new filter as the selected one (replace the array with the new filter)
      return [filter];
    });
  };

  const [isRequestsLoading, setIsRequestsLoading] = useState(false);
  const [filterUserList, setUserList] = useState();


  const fetchRequests = () => {
    setIsRequestsLoading(true);
    Fetcher.get("/user/child/relationship-types")
      .then((res) => {
        console.log(res, "requests");
        setUserList(res?.data?.data);
      })
      .catch((err) => {
        console.error("Failed to fetch requests", err);
      })
      .finally(() => {
        setIsRequestsLoading(false);
      });
  };


  React.useEffect(() => {
    fetchRequests()
  }, [])

  // Check if user has children before allowing to add parent
  React.useEffect(() => {
    const checkUserChildren = async () => {
      try {
        const response = await getAllChildren();
        const children = response?.data?.data;
        
        if (!children?.primaryChildren || children.primaryChildren.length === 0) {
          toast.error("You need to create at least one child before adding a secondary parent. Please go to the Children tab and create a child first.");
          navigate("/manage-relation");
        }
      } catch (error) {
        console.error("Failed to check user children:", error);
        toast.error("Failed to verify if you have children. Please try again.");
        navigate("/manage-relation");
      }
    };

    checkUserChildren();
  }, [navigate]);

  // Debug function to test API connectivity
  const testApiConnection = async () => {
    try {
      console.log("🧪 Testing API connection...");
      const response = await Fetcher.get("user/child/relationship-types");
      console.log("✅ API connection successful:", response.status);
      return true;
    } catch (error) {
      console.error("❌ API connection failed:", error);
      return false;
    }
  };

  // Test API connection on component mount
  React.useEffect(() => {
    testApiConnection();
  }, []);
  // const filterUserList = [
  //   {
  //     id: 1,
  //     options: [
  //       {
  //         img: User1,
  //         name: "Leio McLaren",
  //       },
  //       {
  //         img: User2,
  //         name: "Janet Rose",
  //       },
  //       {
  //         img: User3,
  //         name: "Frank Flores",
  //       },
  //       {
  //         img: User4,
  //         name: "Levi Meir Clancy",
  //       },
  //       {
  //         img: User5,
  //         name: "Jane Andrews",
  //       },
  //       {
  //         img: User6,
  //         name: "John Thompson",
  //       },
  //     ],
  //   },
  // ];

  // Function to toggle a single filter
  const toggleUserFilter = (filter) => {
    setUserFilters((prev) => {
      // If the clicked filter is already selected, deselect it (set to empty array)
      if (prev.includes(filter)) {
        return [];
      }
      // Otherwise, set the new filter as the selected one (replace the array with the new filter)
      return [filter];
    });
  };

  return (
    <>
      <section className="main_wrapper">
        <div className="container-fluid ps-5 pe-5">
          <div className="row">
            <div className="col-lg-12">
              <div className="heading_wrapper d-flex align-items-center justify-content-between mt-4 mb-4">
                <h1>Add Parent</h1>
              </div>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-lg-12 request-feedback-stepper">
              <Stepper
                activeStep={activeStep}
                style={{ justifyContent: "flex-start" }} // Align steps to the left
              >
                {steps.map((label, index) => {
                  const stepProps = {};
                  const labelProps = {};
                  if (isStepSkipped(index)) {
                    stepProps.completed = false;
                  }
                  // Mark step as completed if it's behind the current step and was valid
                  if (index < activeStep) {
                    stepProps.completed = true;
                  }
                  return (
                    <Step key={label} {...stepProps}>
                      <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div>
                <div>
                  {/* Step 1 Content */}
                  {activeStep === 0 && (
                    <div className="row mt-5">
                      <div className="col-12 mb-3">
                        <div className={`alert ${isStepValid(0) ? 'alert-success' : 'alert-warning'} d-flex align-items-center`}>
                          <span className="me-2">
                            {isStepValid(0) ? '✓' : '⚠'}
                          </span>
                          {isStepValid(0) ? 'Step 1 Complete: Parent selected' : 'Step 1 Required: Please select a parent'}
                        </div>
                      </div>
                      <div className="connection-btns-line d-flex align-items-center justify-content-between mt-4 mb-3">
                        <div className="connection-btn-wrap d-flex"></div>

                        <div className="connection-search-wrap d-flex align-items-center">
                          <div className="connection-search d-flex align-items-center me-3">
                            <IoIosSearch className="connection-search-icon" />
                            <input type="text" placeholder="Search" />
                          </div>
                          <div className="filter-icon-wrap">
                            <IoFilter className="filter-icon-btn text-primary" />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-12">
                        {filterUserList?.userConnections?.map((item, index) => (
                          <div key={index} className="mb-5">
                            <ul className="list-unstyled feedback-privacy-list">
                              <li
                                key={index}
                                className="filter-item d-flex justify-content-between align-items-center p-2 rounded cursor-pointer fw-bold text-primary"
                                onClick={() => toggleUserFilter(item?.connectionUser?.id)}
                              >
                                <div className="d-flex gap-3 align-items-center">
                                  <img
                                    src={`https://feedbackwork.net/feedbackapi/${item?.connectionUser?.image}`}
                                    alt=""
                                    className="rounded-circle"
                                    style={{ width: 60, height: 60, objectFit: "cover", margin: "0 auto" }}
                                  />
                                  <span>{item?.connectionUser?.firstname + ' ' + item?.connectionUser?.lastname}</span>
                                </div>
                                {userFilters?.includes(item?.connectionUser?.id) && (
                                  <FaCheck className="text-primary" />
                                )}
                              </li>
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 2 Content */}
                  {activeStep === 1 && (
                    <div className="row mt-5">
                      <div className="col-12 mb-3">
                        <div className={`alert ${isStepValid(1) ? 'alert-success' : 'alert-warning'} d-flex align-items-center`}>
                          <span className="me-2">
                            {isStepValid(1) ? '✓' : '⚠'}
                          </span>
                          {isStepValid(1) ? 'Step 2 Complete: Relationship type selected' : 'Step 2 Required: Please select a relationship type'}
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <ul className="list-unstyled">
                          {[...filterUserList?.relationshipTypes]
                            .sort((a, b) => (a.name === "OTHER" ? 1 : b.name === "OTHER" ? -1 : 0))
                            .map((item, index) => (
                              <div key={index} className="mb-5">
                                <ul className="list-unstyled feedback-privacy-list">
                                  <li
                                    className="filter-item d-flex justify-content-between align-items-center p-2 rounded cursor-pointer fw-bold text-primary"
                                    onClick={() => toggleFilter(item?.id)}
                                  >
                                    <span>{item?.name}</span>
                                    {selectedFilters.includes(item?.id) && (
                                      <FaCheck className="text-primary" />
                                    )}
                                  </li>
                                </ul>
                              </div>
                            ))}

                        </ul>
                        
                        {/* Custom Relationship Input - Show when "OTHER" is selected */}
                        {selectedFilters.length > 0 && 
                         filterUserList?.relationshipTypes?.find(item => 
                           item.id === selectedFilters[0] && item.name === "OTHER"
                         ) && (
                          <div className="mt-4">
                            <div className="form-group">
                              <label className="form-label fw-bold text-primary mb-2">
                                Specify Custom Relationship
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Enter custom relationship type..."
                                value={customRelationship}
                                onChange={(e) => setCustomRelationship(e.target.value)}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 3 Content */}
                  {activeStep === 2 && (
                    <div className="row mt-5">
                      <div className="col-12 mb-3">
                        <div className={`alert ${isStepValid(2) ? 'alert-success' : 'alert-warning'} d-flex align-items-center`}>
                          <span className="me-2">
                            {isStepValid(2) ? '✓' : '⚠'}
                          </span>
                          {isStepValid(2) ? 'Step 3 Complete: Residence option selected' : 'Step 3 Required: Please select a residence option'}
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <ul className="list-unstyled">
                          {residenceArr.map(({ options, id }) => (
                            <div key={id} className="mb-5">
                              <ul className="list-unstyled feedback-privacy-list">
                                {options.map((option) => {
                                  const isSame = option.toLowerCase() === "same residence";
                                  const isSelected = selectedResidence === isSame;

                                  return (
                                    <li
                                      key={option}
                                      className="filter-item d-flex justify-content-between align-items-center p-2 rounded cursor-pointer fw-bold text-primary"
                                      onClick={() => toggleResidence(option)}
                                    >
                                      <span>{option}</span>
                                      {isSelected && <FaCheck className="text-primary" />}
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          ))}

                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="d-flex justify-content-between status-btn-bar mt-5 mb-5">
                    <div className="backbtn">
                      <Button
                        color="inherit"
                        onClick={handleBack}
                        style={{ marginRight: "8px" }}
                      >
                        {activeStep === 0 ? "Cancel" : "Previous"}
                      </Button>
                    </div>

                    <div className="nextbtn">
                      {activeStep === steps.length - 1 ? (
                        <Button 
                          onClick={handleSubmit} 
                          disabled={isSubmitting}
                          variant="contained"
                          color="primary"
                        >
                          {isSubmitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Sending Request...
                            </>
                          ) : (
                            "Send Request"
                          )}
                        </Button>
                      ) : (
                        <div>
                          <Button 
                            onClick={handleNext}
                            disabled={!isStepValid(activeStep)}
                            variant="contained"
                            color="primary"
                          >
                            Next
                          </Button>
                          {!isStepValid(activeStep) && (
                            <div className="text-danger mt-2 small">
                              {getValidationMessage(activeStep)}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
