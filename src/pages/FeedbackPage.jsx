import { Button } from "@mui/material";
import React, { useState } from "react";
import { FaList } from "react-icons/fa";
import { FiGrid } from "react-icons/fi";
import { FaCheck } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { IoFilter } from "react-icons/io5";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import NetworkConnectionsCardGrid from "../components/networkConnections/NetworkConnectionsCardGrid";
import NetworkConnectionsCardList from "../components/networkConnections/NetworkConnectionsCardList";
import NetworkSuggestionsCardGrid from "../components/networkSuggestions/NetworkSuggestionsCardGrid";
import NetworkSuggestionsCardList from "../components/networkSuggestions/NetworkSuggestionsCardList";
import NetworkRequestsCardGrid from "../components/networkRequests/NetworkRequestsCardGrid";
import NetworkRequestsCardList from "../components/networkRequests/NetworkRequestsCardList";
import AllFeedbacksGrid from "../components/AllFeedbacks/AllFeedbacksGrid";
// import FeedbackRequestedGrid from "../components/feedbackRequested/FeedbackRequestedGrid";
import FeedbackReceivedGrid from "../components/feedbackReceived/feedbackReceivedGrid";
import AppliedFeedbackGrid from "../components/AppliedFeedback/AppliedFeedbackGrid";

function FeedbackPage() {
  const [gridView, setGridView] = useState(true);
  const [listView, setListView] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [activeTab, setActiveTab] = useState("All");

  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const feedbackArr = [
    {
      name: "John Thompson",
      occupation: "Teacher",
      subject: "Methematics",
      feedbackProvided: "20",
      feedbackSolved: "10",
    },
    {
      name: "John Thompson",
      occupation: "Teacher",
      subject: "Methematics",
      feedbackProvided: "20",
      feedbackSolved: "10",
    },
    {
      name: "John Thompson",
      occupation: "Teacher",
      subject: "Methematics",
      feedbackProvided: "20",
      feedbackSolved: "10",
    },
    {
      name: "John Thompson",
      occupation: "Teacher",
      subject: "Methematics",
      feedbackProvided: "20",
      feedbackSolved: "10",
    },
  ];

  //   const allFeedbackArr = [{
  //     titel: "Requested",
  //     project: "Floor Cleaning",
  //     problem: "Dirty Floor",
  //     solution: "Clean Floor",
  //     solutionFunction: "Mop Floor",
  //   }]

  const changeToGrid = () => {
    setGridView(true);
    setListView(false);
  };

  const changeToList = () => {
    setGridView(false);
    setListView(true);
  };

  const filterCategories = [
    {
      title: "Expertise",
      options: ["All", "Private", "Public", "My Feedback"],
    },
    {
      title: "Sort by",
      options: ["Date", "A-Z"],
    },
    {
      title: "Connection Type",
      options: [
        "Teacher",
        "Student",
        "Manager",
        "Coworker",
        "Employee",
        "Friend",
        "Classmate",
        "My Customer",
        "My Client",
        "Other",
      ],
    },
  ];

  // Get only Expertise filters (excluding "All")
  const expertiseFilters = filterCategories
    .find((category) => category.title === "Expertise")
    .options.filter((option) => option !== "All");

  // Function to toggle a single filter
  const toggleFilter = (filter, category) => {
    setSelectedFilters((prev) => {
      if (filter === "All" && category === "Expertise") {
        return prev.some((f) => expertiseFilters.includes(f))
          ? prev.filter((f) => !expertiseFilters.includes(f)) // Deselect all expertise filters
          : [...prev, ...expertiseFilters]; // Select all expertise filters
      }
      return prev.includes(filter)
        ? prev.filter((f) => f !== filter) // Remove filter
        : [...prev, filter]; // Add filter
    });
  };

  const resetFilters = () => {
    setSelectedFilters([]);
  };

  const handleSwitchTabs = (e) => {
    setActiveTab(e.target.name);
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-3 filter-large">
            <div className="p-3">
              <div className="d-flex flex justify-content-between mb-4 pt-4 align-items-center">
                <h2 className="h5 fw-bold">Filters</h2>
                <Button
                  className="p-0"
                  onClick={resetFilters}
                  sx={{ textTransform: "none" }}
                >
                  Reset Filters
                </Button>
              </div>
              {filterCategories.map(({ title, options }) => (
                <div key={title} className="mb-5">
                  <p className="mb-0 filter-heading">{title}</p>
                  <ul className="list-unstyled">
                    {options.map((option) => (
                      <li
                        key={option}
                        className={`filter-item d-flex justify-content-between align-items-center p-2 rounded cursor-pointer ${
                          option === "All" ? "fw-bold text-primary" : ""
                        }`}
                        onClick={() => toggleFilter(option, title)}
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
            </div>
          </div>
          <div className="col-lg-9 main_wrapper">
            <div className="heading_wrapper d-flex align-items-center justify-content-between mt-4 mb-4">
              <h1>All Feedback</h1>
              <div className="viewbtns">
                <Button
                  className={`viewBtn1 ${listView ? "viewActiveBtn" : ""}`}
                  onClick={changeToList}
                >
                  <FaList
                    className={`viewBtn1 ${
                      listView ? "listViewActive" : "listView"
                    }`}
                  />
                </Button>
                <Button
                  className={`viewBtn2 ${gridView ? "viewActiveBtn" : ""}`}
                  onClick={changeToGrid}
                >
                  <FiGrid
                    className={`viewBtn1 ${
                      gridView ? "listViewActive" : "listView"
                    }`}
                  />
                </Button>
              </div>
            </div>

            <div className="connection-btns-line d-flex align-items-center justify-content-between mt-4 mb-4">
              <div className="connection-btn-wrap d-flex">
                {["All", "Requested", "Recevied", "Applied", "Provided"].map(
                  (tab) => (
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
                  )
                )}
              </div>

              <div className="connection-search-wrap d-flex align-items-center">
                <div className="connection-search d-flex align-items-center me-3">
                  <IoIosSearch className="connection-search-icon" />
                  <input type="text" placeholder="Search" />
                </div>
                <div
                  className="filter-icon-wrap filter-icon-responsive"
                  onClick={toggleDrawer(true)}
                >
                  <IoFilter className="filter-icon-btn" />
                </div>
              </div>
            </div>

            {activeTab == "All" && (
              <div className="row">
                {gridView ? (
                  <>
                    <div className="col-lg-4">
                      <AllFeedbacksGrid />
                    </div>
                    <div className="col-lg-4">
                      <FeedbackReceivedGrid />
                    </div>
                    <div className="col-lg-4">
                      <FeedbackReceivedGrid />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-lg-12 mb-3">
                      <AllFeedbacksGrid />
                    </div>
                    <div className="col-lg-12 mb-3">
                      <AllFeedbacksGrid />
                    </div>
                    <div className="col-lg-12 mb-3">
                      <AllFeedbacksGrid />
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab == "Requested" && (
              <div className="row">
                {gridView ? (
                  <>
                    <div className="col-lg-4">
                      <AllFeedbacksGrid />
                    </div>
                    <div className="col-lg-4">
                      <AllFeedbacksGrid />
                    </div>
                    <div className="col-lg-4">
                      <AllFeedbacksGrid />
                    </div>
                  </>
                ) : (
                  feedbackArr.map((item, index) => {
                    return (
                      <div className="col-lg-12 mb-3" key={index}>
                        <NetworkSuggestionsCardList item={item} />
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {activeTab == "Recevied" && (
              <div className="row">
                {gridView ? (
                  <>
                    <div className="col-lg-4">
                      <FeedbackReceivedGrid />
                    </div>
                    <div className="col-lg-4">
                      <FeedbackReceivedGrid />
                    </div>
                    <div className="col-lg-4">
                      <FeedbackReceivedGrid />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-lg-12">
                      <FeedbackReceivedGrid />
                    </div>
                    <div className="col-lg-12">
                      <FeedbackReceivedGrid />
                    </div>
                    <div className="col-lg-12">
                      <FeedbackReceivedGrid />
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab == "Applied" && (
              <div className="row">
                {gridView ? (
                  <>
                    <div className="col-lg-4">
                      <AppliedFeedbackGrid />
                    </div>
                    <div className="col-lg-4">
                      <AppliedFeedbackGrid />
                    </div>
                    <div className="col-lg-4">
                      <AppliedFeedbackGrid />
                    </div>
                  </>
                ) : (
                  feedbackArr.map((item, index) => {
                    return (
                      <div className="col-lg-12 mb-3" key={index}>
                        <NetworkRequestsCardList item={item} />
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {activeTab == "Provided" && (
              <div className="row">
                {gridView
                  ? feedbackArr.map((item, index) => {
                      return (
                        <div className="col-lg-3" key={index}>
                          <NetworkRequestsCardGrid item={item} />
                        </div>
                      );
                    })
                  : feedbackArr.map((item, index) => {
                      return (
                        <div className="col-lg-12 mb-3" key={index}>
                          <NetworkRequestsCardList item={item} />
                        </div>
                      );
                    })}
              </div>
            )}
          </div>
        </div>
      </div>

      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 300, px: 2 }} role="presentation">
          <div className="p-3">
            <div className="d-flex flex justify-content-between mb-4 pt-4 align-items-center">
              <h2 className="h5 fw-bold">Filters</h2>
              <Button
                className="p-0"
                onClick={resetFilters}
                sx={{ textTransform: "none" }}
              >
                Reset Filters
              </Button>
            </div>
            {filterCategories.map(({ title, options }) => (
              <div key={title} className="mb-5">
                <p className="mb-0 filter-heading">{title}</p>
                <ul className="list-unstyled">
                  {options.map((option) => (
                    <li
                      key={option}
                      className={`filter-item d-flex justify-content-between align-items-center p-2 rounded cursor-pointer ${
                        option === "All" ? "fw-bold text-primary" : ""
                      }`}
                      onClick={() => toggleFilter(option, title)}
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
          </div>
        </Box>
      </Drawer>
    </>
  );
}

export default FeedbackPage;
