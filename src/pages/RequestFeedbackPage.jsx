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
import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { Switch } from "@mui/material";
import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const steps = [
  "Select Feedback Category",
  "Select Privacy",
  "Select Feedback Provider",
  "Type Message",
  "Preview Feedback Request",
];

export default function RequestFeedbackPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [uploadedFile, setUploadedFile] = useState(null); // State to store the uploaded file
  const [activeIndices, setActiveIndices] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [userFilters, setUserFilters] = useState([]);
  const [groupFilter, setGroupFilters] = useState([]);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [expandedGroups, setExpandedGroups] = useState([]);

  const navigate = useNavigate();

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const feedbackCategoryArr = [
    {
      img: SocialMedia,
      title: "Social Media",
      count: 12,
    },
    {
      img: Automotive,
      title: "Automotive & Mechanics",
      count: 12,
    },
    {
      img: Accounting,
      title: "Accounting, Consulting & Finance",
      count: 12,
    },
    {
      img: Education,
      title: "Education & Tutoring",
      count: 12,
    },
    {
      img: Arts,
      title: "Arts & Creative ",
      count: 12,
    },
    {
      img: Analytics,
      title: "IT, Data & Analytics",
      count: 12,
    },
    {
      img: Engineer,
      title: "Engineering & Architecture",
      count: 12,
    },
    {
      img: Software,
      title: "Web, Mobile & Software Development",
      count: 12,
    },
    {
      img: Business,
      title: "Business Support & Admin ",
      count: 12,
    },
    {
      img: Sales,
      title: "Sales & Marketing ",
      count: 12,
    },
    {
      img: Legal,
      title: "Legal Services",
      count: 12,
    },
    {
      img: Writing,
      title: "Writing & Translation",
      count: 12,
    },
  ];

  // Function to handle box click
  const handleBoxClick = (index) => {
    if (activeIndices.includes(index)) {
      // If the box is already active, remove it from the active list
      setActiveIndices(activeIndices.filter((i) => i !== index));
    } else {
      // If the box is not active, add it to the active list
      setActiveIndices([...activeIndices, index]);
    }
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
      alert("finish");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
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

  const handleSubmit = () => {
    navigate("/network");
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file); // Store the uploaded file in state
      console.log("Uploaded file:", file); // Log the file to the console
    }
  };

  const filterCategories = [
    {
      id: 1,
      options: ["Private", "Public", "My Feedback"],
    },
  ];

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

  const filterUserList = [
    {
      id: 1,
      options: [
        {
          img: User1,
          name: "Leio McLaren",
        },
        {
          img: User2,
          name: "Janet Rose",
        },
        {
          img: User3,
          name: "Frank Flores",
        },
        {
          img: User4,
          name: "Levi Meir Clancy",
        },
        {
          img: User5,
          name: "Jane Andrews",
        },
        {
          img: User6,
          name: "John Thompson",
        },
      ],
    },
  ];

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

  const feedbackGroupList = [
    {
      id: 1,
      img: User1,
      name: "Leio McLaren",
      users: [
        {
          img: User1,
          name: "Leio McLaren",
        },
        {
          img: User2,
          name: "Janet Rose",
        },
        {
          img: User3,
          name: "Leio McLaren",
        },
      ],
    },
    {
      id: 2,
      img: User2,
      name: "Janet Rose",
      users: [
        {
          img: User1,
          name: "Leio McLaren",
        },
        {
          img: User2,
          name: "Janet Rose",
        },
        {
          img: User3,
          name: "Leio McLaren",
        },
      ],
    },
    {
      id: 3,
      img: User3,
      name: "Frank Flores",
      users: [
        {
          img: User1,
          name: "Leio McLaren",
        },
        {
          img: User2,
          name: "Janet Rose",
        },
        {
          img: User3,
          name: "Leio McLaren",
        },
      ],
    },
    {
      id: 4,
      img: User4,
      name: "Levi Meir Clancy",
      users: [
        {
          img: User1,
          name: "Leio McLaren",
        },
        {
          img: User2,
          name: "Janet Rose",
        },
        {
          img: User3,
          name: "Leio McLaren",
        },
      ],
    },
    {
      id: 5,
      img: User5,
      name: "Jane Andrews",
      users: [
        {
          img: User1,
          name: "Leio McLaren",
        },
        {
          img: User2,
          name: "Janet Rose",
        },
        {
          img: User3,
          name: "Leio McLaren",
        },
      ],
    },
    {
      id: 6,
      img: User6,
      name: "John Thompson",
      users: [
        {
          img: User1,
          name: "Leio McLaren",
        },
        {
          img: User2,
          name: "Janet Rose",
        },
        {
          img: User3,
          name: "Leio McLaren",
        },
      ],
    },
  ];

  // Function to toggle a single filter
  const toggleGroupUser = (filter) => {
    setGroupFilters((prev) => {
      // If the clicked filter is already selected, deselect it (set to empty array)
      if (prev.includes(filter)) {
        return [];
      }
      // Otherwise, set the new filter as the selected one (replace the array with the new filter)
      return [filter];
    });

    // Toggle the expanded group
    setExpandedGroups((prev) =>
      prev.includes(filter)
        ? prev.filter((item) => item !== filter)
        : [...prev, filter]
    );
  };

  return (
    <>
      <section className="main_wrapper">
        <div className="container-fluid ps-5 pe-5">
          <div className="row">
            <div className="col-lg-12">
              <div className="heading_wrapper d-flex align-items-center justify-content-between mt-4 mb-4">
                <h1>Request Feedback</h1>
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
                    <div className="row mt-4">
                      <div className="connection-btns-line d-flex align-items-center justify-content-between mt-4 mb-3">
                        <div className="connection-btn-wrap d-flex">
                          <h5 className="fw-bold mb-0">Feedback Category</h5>
                        </div>

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
                      {feedbackCategoryArr.map((category, index) => (
                        <div className="col-lg-2 mb-3" key={index}>
                          <div
                            className={`request-feedback-card h-100 d-flex flex-column ${
                              activeIndices.includes(index)
                                ? "request-filter-active"
                                : ""
                            }`}
                            onClick={() => handleBoxClick(index)} // Add click handler
                          >
                            <div className="request-feedback-card-img d-flex flex-column justify-content-between">
                              <div>
                                <img src={category.img} alt="" />
                              </div>
                              <p className="request-feedback-card-text">
                                {category.title}
                              </p>
                              <p className="request-feedback-card-filter">
                                ({category.count})
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Step 2 Content */}
                  {activeStep === 1 && (
                    <div className="row mt-5">
                      <div className="col-lg-6">
                        <ul className="list-unstyled">
                          {filterCategories.map(({ options, id }) => (
                            <div key={id} className="mb-5">
                              <ul className="list-unstyled feedback-privacy-list">
                                {options.map((option) => (
                                  <li
                                    key={option}
                                    className="filter-item d-flex justify-content-between align-items-center p-2 rounded cursor-pointer fw-bold text-primary"
                                    onClick={() => toggleFilter(option)}
                                  >
                                    <span>{option}</span>
                                    {selectedFilters.includes(option) && (
                                      <FaCheck className="text-primary" />
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </ul>
                      </div>
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <h6>Feedback Limit</h6>
                          <div className="feedback-limit">
                            <p className="mb-0">10</p>
                          </div>
                        </div>
                        <div className="d-flex justify-content-between feedback-limit align-items-center">
                          <p className="mb-0 fw-500">
                            Send feedback anonymously
                          </p>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3 Content */}
                  {activeStep === 2 && (
                    <>
                      <div className="row mt-5">
                        <div className="connection-btns-line d-flex align-items-center justify-content-between mt-4 mb-3">
                          <div className="connection-btn-wrap d-flex">
                            <h2>People</h2>
                          </div>

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
                          {filterUserList.map(({ options, id }) => (
                            <div key={id} className="mb-5">
                              <ul className="list-unstyled feedback-privacy-list">
                                {options.map((option, index) => (
                                  <li
                                    key={index}
                                    className="filter-item d-flex justify-content-between align-items-center p-2 rounded cursor-pointer fw-bold text-primary"
                                    onClick={() =>
                                      toggleUserFilter(option.name)
                                    }
                                  >
                                    <div>
                                      <img
                                        src={option.img}
                                        alt=""
                                        className="me-2"
                                      />
                                      <span>{option.name}</span>
                                    </div>
                                    {userFilters.includes(option.name) && (
                                      <FaCheck className="text-primary" />
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="row mt-1">
                        <div className="connection-btns-line d-flex align-items-center justify-content-between mt-4 mb-3">
                          <div className="connection-btn-wrap d-flex">
                            <h2>Groups</h2>
                          </div>

                          <div className="connection-search-wrap d-flex align-items-center">
                            <div className="connection-search d-flex align-items-center me-3">
                              <IoIosSearch className="connection-search-icon" />
                              <input type="text" placeholder="Search Groups" />
                            </div>
                            <div className="filter-icon-wrap">
                              <IoFilter className="filter-icon-btn text-primary" />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="mb-5">
                            <div className="list-unstyled feedback-group-list">
                              {feedbackGroupList.map((option, id) => (
                                <div className="feedback-group-wrapper">
                                  <div
                                    key={id}
                                    className="feedback-group-item d-flex justify-content-between align-items-center p-2 cursor-pointer fw-bold text-primary"
                                    onClick={() => toggleGroupUser(option.name)}
                                  >
                                    <div>
                                      <img
                                        src={option.img}
                                        alt=""
                                        className="me-2"
                                      />
                                      <span>{option.name}</span>
                                    </div>
                                    {groupFilter.includes(option.name) && (
                                      <FaCheck className="text-primary" />
                                    )}
                                  </div>

                                  {expandedGroups.includes(option.name) && (
                                    <div className="sub-group-wrapper">
                                      {option.users.map((user, index) => {
                                        return (
                                          <div
                                            key={index}
                                            className="feedback-group-sub-item d-flex justify-content-between align-items-center p-2  cursor-pointer fw-bold text-primary"
                                          >
                                            <div>
                                              <img
                                                src={user.img}
                                                alt=""
                                                className="me-2"
                                              />
                                              <span>{user.name}</span>
                                            </div>
                                            {/* {groupFilter.includes(user.name) && (
                                            <FaCheck className="text-primary" />
                                          )} */}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Step 4 Content */}
                  {activeStep === 3 && (
                    <div className="row mt-5">
                      <div className="col-lg-12">
                        <div className="d-flex">
                          <div className="form-group mb-3 w-50 pe-3">
                            <label
                              htmlFor="exampleInputEmail1"
                              className="auth-label"
                            >
                              Feedback Subject
                            </label>
                            <div className="authInputWrap d-flex align-items-center ps-3 req-feedback-field">
                              <input
                                type="text"
                                className="form-control auth-input"
                                id="exampleInputEmail1"
                                aria-describedby="emailHelp"
                                placeholder="Enter Subject"
                              />
                            </div>
                          </div>
                          <div className="form-group mb-3 w-50 ps-3">
                            <label
                              htmlFor="exampleInputPassword1"
                              className="auth-label"
                            >
                              Youtube Link
                            </label>

                            <div className="authInputWrap d-flex align-items-center ps-3 req-feedback-field">
                              <input
                                type="text"
                                className="form-control auth-input"
                                id="exampleInputPassword1"
                                placeholder="Insert link"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="form-group mb-3 w-100">
                          <label
                            htmlFor="exampleInputEmail1"
                            className="auth-label"
                          >
                            Feedback Message
                          </label>
                          <Editor
                            editorState={editorState}
                            onEditorStateChange={onEditorStateChange}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="feedbackEditor"
                          />
                        </div>

                        <div className="form-group mb-3 w-100">
                          <div className="w-100">
                            {/* Upload Button with Icon */}
                            <div>
                              <h5>Add Image</h5>
                              <div
                                onClick={() =>
                                  document.getElementById("file-input").click()
                                } // Trigger file input click
                                style={{ cursor: "pointer" }} // Add pointer cursor
                              >
                                <Button
                                  style={{
                                    background: "none",
                                    border: "none",
                                    padding: 0,
                                  }} // Remove default button styles
                                  className="status-upload-bg"
                                >
                                  <IoCloudUploadOutline className="status-uploadIcon" />
                                  {/* Display file name or default text */}
                                  <p className="status-upload-text">
                                    {uploadedFile
                                      ? `Uploaded file: ${uploadedFile.name}`
                                      : "Upload file here"}
                                  </p>
                                  <p className="status-upload-options">
                                    (Only .jpg, .png, & .pdf files will be
                                    accepted)
                                  </p>
                                </Button>
                                <p className="status-no-upload text-center">
                                  {uploadedFile ? `` : "no files uploaded yet"}
                                </p>
                                {/* Hidden file input */}
                                <input
                                  id="file-input"
                                  type="file"
                                  style={{ display: "none" }} // Hide the file input
                                  onChange={handleFileUpload} // Handle file selection
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 5 Content */}
                  {activeStep === 4 && (
                    <div className="row mt-5 request-feedback-last-row">
                      <div className="d-flex justify-content-between request-feedback-received-row">
                        <p className="mb-0 fw-500">Feedback Received</p>
                        <p className="mb-0">2:41 PM</p>
                      </div>

                      <div className="col-lg-6">
                        <div className="fb-center-padding">
                          <div className="fb-requested-img-wrap d-flex w-100">
                            <div className="fb-request-card-img mb-3 text-center me-3">
                              <img
                                src={NetworkProfile}
                                alt=""
                                className="mb-2"
                              />
                              <h6>Janet Rose</h6>
                            </div>
                            <div className="fb-requested-right ps-3 mb-3 w-100">
                              <p className="mb-0 d-flex justify-content-between">
                                Total Feedback Provided{" "}
                                <span className="text-primary">20</span>
                              </p>
                              <p className="mb-0 d-flex justify-content-between">
                                Total Feedback Applied{" "}
                                <span className="text-primary">10</span>
                              </p>
                              <p className="mb-0 d-flex justify-content-between">
                                Total Problem Solved{" "}
                                <span className="text-success">5</span>
                              </p>
                              <p className="mb-0 d-flex justify-content-between">
                                Total Problems Help Solution{" "}
                                <span className="text-success">10</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="text-center fb-need-text">
                          <p>
                            Lorem ipLorem ipsum dolor sit amet, consectetur
                            adipiscing elit, sed do eiusmod tempor incididunt ut
                            labore et dolore magna aliqua.sum
                          </p>
                        </div>
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
                        <Button onClick={handleSubmit}>Send Request</Button>
                      ) : (
                        <Button onClick={handleNext}>Next</Button>
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
