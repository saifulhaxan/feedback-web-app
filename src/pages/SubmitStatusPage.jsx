import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { IoCloudUploadOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const steps = ["Before", "After"];

export default function SubmitStatusReport() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [uploadedFile, setUploadedFile] = React.useState(null); // State to store the uploaded file
  const navigate = useNavigate();

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
    navigate("/status-report");
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file); // Store the uploaded file in state
      console.log("Uploaded file:", file); // Log the file to the console
    }
  };

  return (
    <>
      <section className="main_wrapper">
        <div className="container-fluid ps-5 pe-5">
          <div className="row">
            <div className="col-lg-12">
              <div className="heading_wrapper d-flex align-items-center justify-content-between mt-4 mb-4">
                <h1>Status Report</h1>
              </div>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-lg-3">
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
                      <div className="col-lg-12">
                        <div className="w-100">
                          {/* Upload Button with Icon */}
                          <div>
                            <h5>Attach File</h5>
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
                            <div className="youtubeLink w-100 mt-4">
                              <h5>Youtube Link</h5>
                              <input
                                type="text"
                                className="w-100"
                                placeholder="Insert link"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2 Content */}
                  {activeStep === 1 && (
                    <div className="row mt-4">
                      <div className="col-lg-12">
                        <div className="w-100">
                          {/* Upload Button with Icon */}
                          <div>
                            <h5>Attach File</h5>
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
                            <div className="youtubeLink w-100 mt-4">
                              <h5>Youtube Link</h5>
                              <input
                                type="text"
                                className="w-100"
                                placeholder="Insert link"
                              />
                            </div>
                          </div>
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
                        <Button onClick={handleSubmit}>Submit</Button>
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
