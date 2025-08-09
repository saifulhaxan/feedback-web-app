import { Button } from "@mui/material";
import React, { useState } from "react";
import NetworkProfile from "../assets/images/network-profile.png";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { MdOutlineExpandLess } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import ModelImageTwo from "../assets/images/model2.png";

import FeedbackErd from "../components/feedbackERD/FeedbackErd";

export default function FeedbackReceivedDetailPage() {
  const [activeTab, setActiveTab] = useState("Feedback");
  const [expanded, setExpanded] = React.useState(false);

  const navigate = useNavigate();

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleSwitchTabs = (e) => {
    setActiveTab(e.target.name);
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

        <div className="row mt-3 request-feedback-last-row">
          <div className="d-flex justify-content-between request-feedback-received-row">
            <p className="mb-0 fw-500">Feedback Received</p>
            <p className="mb-0">2:41 PM</p>
          </div>

          <div className="col-lg-12">
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
                    Total Problem Solved <span className="text-success">5</span>
                  </p>
                  <p className="mb-0 d-flex justify-content-between">
                    Total Problems Help Solution{" "}
                    <span className="text-success">10</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-12">
            <p className="fw-500 text-center fs-14">
              Need help floor cleaning hard surface
            </p>
          </div>

          <div className="col-lg-12">
            <div className="feebackdetail-btn-wrap d-flex">
              {["Feedback", "Model 1", "Model 2"].map((tab) => (
                <Button
                  key={tab}
                  sx={{
                    textTransform: "none",
                    bgcolor: activeTab === tab ? "#EBF5FF" : "white",
                    color: activeTab === tab ? "#0064D1" : "black",
                    fontWeight: "bold",
                  }}
                  className="me-2"
                  name={tab}
                  onClick={handleSwitchTabs}
                >
                  {tab === "All"
                    ? "All"
                    : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {activeTab == "Feedback" && (
            <div className="col-lg-12 mt-5 feedback-detail-accordion">
              <Accordion
                expanded={expanded === "panel1"}
                onChange={handleChange("panel1")}
              >
                <AccordionSummary
                  expandIcon={<MdOutlineExpandLess />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Typography
                    component="span"
                    sx={{ width: "33%", flexShrink: 0 }}
                  >
                    1. The Given Set of Communication Principle
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Nulla facilisi. Phasellus sollicitudin nulla et quam mattis
                    feugiat. Aliquam eget maximus est, id dignissim quam.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion
                expanded={expanded === "panel2"}
                onChange={handleChange("panel2")}
              >
                <AccordionSummary
                  expandIcon={<MdOutlineExpandLess />}
                  aria-controls="panel2bh-content"
                  id="panel2bh-header"
                >
                  <Typography
                    component="span"
                    sx={{ width: "33%", flexShrink: 0 }}
                  >
                    1. The Given Set of Information Principle
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Donec placerat, lectus sed mattis semper, neque lectus
                    feugiat lectus, varius pulvinar diam eros in elit.
                    Pellentesque convallis laoreet laoreet.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </div>
          )}
          {activeTab == "Model 1" && (
            <div className="col-lg-12 mt-5 feedback-detail-accordion">
              <FeedbackErd />
            </div>
          )}
          {activeTab == "Model 2" && (
            <div className="col-lg-12 mt-5 feedback-detail-accordion">
              <Accordion
                expanded={expanded === "panel1"}
                onChange={handleChange("panel1")}
              >
                <AccordionSummary
                  expandIcon={<MdOutlineExpandLess />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Typography
                    component="span"
                    sx={{ width: "33%", flexShrink: 0 }}
                  >
                    1. The Given Set of Communication Principle
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Nulla facilisi. Phasellus sollicitudin nulla et quam mattis
                    feugiat. Aliquam eget maximus est, id dignissim quam.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion
                expanded={expanded === "panel2"}
                onChange={handleChange("panel2")}
              >
                <AccordionSummary
                  expandIcon={<MdOutlineExpandLess />}
                  aria-controls="panel2bh-content"
                  id="panel2bh-header"
                >
                  <Typography
                    component="span"
                    sx={{ width: "33%", flexShrink: 0 }}
                  >
                    1. The Given Set of Information Principle
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Donec placerat, lectus sed mattis semper, neque lectus
                    feugiat lectus, varius pulvinar diam eros in elit.
                    Pellentesque convallis laoreet laoreet.
                  </Typography>
                  <div className="text-center model-two-image-wrapper">
                    <img src={ModelImageTwo} alt="" />
                  </div>
                </AccordionDetails>
              </Accordion>
            </div>
          )}

          <div className="feedback-detail-apply-btn mt-5">
            <button
              className="btn btn-primary w-100"
              onClick={() => navigate("/feedback-received-detail")}
            >
              Apply Feedback
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
