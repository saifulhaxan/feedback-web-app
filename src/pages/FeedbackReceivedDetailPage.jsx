import { Button } from "@mui/material";
import React, { useState } from "react";
import NetworkProfile from "../assets/images/network-profile.png";
import { CiLock } from "react-icons/ci";
import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { IoCloudUploadOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: 350, sm: 400, md: 450 },
  overflow: "auto",
  bgcolor: "background.paper",
  // border: "2px solid #000",
  borderRadius: 2,
  boxShadow: 24,
  p: 2,
};

export default function FeedbackReceivedDetailPage() {
  const [userFilters, setUserFilters] = useState([]);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [uploadedFile, setUploadedFile] = useState(null); // State to store the uploaded file
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const navigate = useNavigate();

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
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
    <section className="main_wrapper pb-5">
      <div className="container-fluid ps-5 pe-5">
        <div className="row py-3">
          <div className="received-feedback-breadcrums d-flex">
            <p className="mb-0 me-2 text-primary fw-500">FEEDBACK</p>
            <p className="mb-0 me-2 fw-500">\</p>
            <p className="mb-0 me-2 text-primary fw-500">FEEDBACK RECEIVED</p>
            <p className="mb-0 me-2">\</p>
            <p className="mb-0 fw-500">FEEDBACK DETAILS</p>
          </div>
        </div>

        <div className="mt-4">
          <h5 className="fw-bold">Feedback Details</h5>
        </div>

        <div className="row mt-3 mb-3">
          <div className="col-lg-12 ">
            <div className="d-flex justify-content-between request-feedback-received-row mb-0">
              <p className="mb-0 fw-500">Feedback Received</p>
              <p className="mb-0">2:41 PM</p>
            </div>

            <div className="request-feedback-detail-row">
              <div className="fb-center-padding">
                <div className="fb-requested-img-wrap d-flex w-100">
                  <div className="fb-request-card-img mb-3 text-center me-3">
                    <img src={NetworkProfile} alt="" className="mb-2" />
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
          </div>
        </div>

        <div className="row mt-3 mb-4">
          <div className="col-lg-12 ">
            <div className="d-flex justify-content-between request-feedback-received-row mb-0">
              <p className="mb-0 fw-500">Feedback Applied</p>
              <p className="mb-0">2:41 PM</p>
            </div>

            <div className="request-feedback-detail-row">
              <div className="fb-center-padding">
                <div className="fb-requested-img-wrap d-flex w-100">
                  <div className="fb-request-card-img mb-3 text-center me-3">
                    <img src={NetworkProfile} alt="" className="mb-2" />
                    <h6>Janet Thompson</h6>
                  </div>
                  <div className="fb-requested-right ps-3 mb-3 w-100">
                    <p className="mb-0 ">
                      Project <span className="fw-bold">Floor Cleaning</span>
                    </p>
                    <p className="mb-0 ">
                      Problem{" "}
                      <span className="text-danger fw-bold">Dirty Floor</span>
                    </p>
                    <p className="mb-0 ">
                      Solution{" "}
                      <span className="text-success fw-bold">Clean Floor</span>
                    </p>
                    <p className="mb-0 ">
                      Solution Function{" "}
                      <span className="text-success fw-bold">Mop Floor</span>
                    </p>
                  </div>
                </div>
                <div className="mb-4">
                  <Editor
                    editorState={editorState}
                    onEditorStateChange={onEditorStateChange}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="feedback-detail-editor"
                    placeholder="Type message here"
                  />
                </div>

                <div className="connection-card-btns mb-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value=""
                      id="flexCheckDefault"
                    />
                    <label className="form-check-label" for="flexCheckDefault">
                      Does the feedback help you solve the problem?
                    </label>
                  </div>
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
                            (Only .jpg, .png, & .pdf files will be accepted)
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

                <div className="feedback-detail-apply-btn mt-5">
                  <button
                    className="btn btn-primary w-100"
                    // onClick={() => navigate("/feedback")}
                    onClick={handleOpen}
                  >
                    Finish
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h3 className="mb-3">Apply Feedback</h3>

          <div>
            <p className="fs-14">
              By accepting or apply this feedback, you are going to pay $1 for
              the effort of Janet Rose who provides you the feedback.  The money
              will be deducted from your account to provide Janet Rose who
              provided you the feedback.
            </p>
          </div>
          <div className="d-flex justify-content-between">
            <button className="btn btn-outline-primary" onClick={handleClose}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/payment")}
            >
              Confirm Payment
            </button>
          </div>
        </Box>
      </Modal>
    </section>
  );
}
