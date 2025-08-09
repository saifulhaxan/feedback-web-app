import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { FaList } from "react-icons/fa";
import { FiGrid } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";
import { MdAdd, MdSettings } from "react-icons/md";
import Nurses from "../assets/images/nurses.png";
import Mechanics from "../assets/images/mechanic.png";
import Engineers from "../assets/images/engineers.png";
import Modal from "@mui/material/Modal";
import Switch from "@mui/material/Switch";
import User1 from "../assets/images/user1.png";
import User2 from "../assets/images/user2.png";
import User3 from "../assets/images/user3.png";
import User4 from "../assets/images/user4.png";
import User5 from "../assets/images/user5.png";
import User6 from "../assets/images/user6.png";
import { FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import GroupModal from "../components/groupModal/GroupModal";
import Fetcher from "../library/Fetcher";
import { toast } from "react-toastify";
import { getAllGroups, searchPublicGroups, joinPublicGroup, respondToGroupInvitation } from "../api/groupsApi";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70%",
  height: "90%",
  overflow: "auto",
  bgcolor: "background.paper",
  // border: "2px solid #000",
  borderRadius: 2,
  boxShadow: 24,
  p: 2,
};

export default function GroupPage() {
  const [gridView, setGridView] = useState(true);
  const [listView, setListView] = useState(false);
  const [activeTab, setActiveTab] = useState("All");
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [allGroupsArr, setGroupData] = useState();

  const label = { inputProps: { "aria-label": "Switch demo" } };

  const navigate = useNavigate();

  // const allGroupsArrs = [
  //   {
  //     id: 1,
  //     image: Nurses,
  //     groupName: "Nurses",
  //     descripton: "Group of nurses",
  //     status: "Joined",
  //   },
  //   {
  //     id: 2,
  //     image: Mechanics,
  //     groupName: "Mechanic",
  //     descripton: "Group of mechanics",
  //     status: "Joined Group",
  //   },
  //   {
  //     id: 3,
  //     image: Mechanics,
  //     groupName: "Mechanic",
  //     descripton: "Group of mechanics",
  //     status: "Joined Group",
  //   },
  //   {
  //     id: 4,
  //     image: Engineers,
  //     groupName: "Engineer",
  //     descripton: "Group of engineers",
  //     status: "Joined Group",
  //   },
  //   {
  //     id: 5,
  //     image: Nurses,
  //     groupName: "Nurses",
  //     descripton: "Group of nurses",
  //     status: "Joined Group",
  //   },
  // ];

  const [pendingGroup, setPendingGroup] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);


  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    searchPublicGroups(value)
      .then((res) => {
        setSearchResults(res?.data?.data?.groups || []);
      })
      .catch((err) => {
        console.error("Search failed", err);
      })
      .finally(() => {
        setIsSearching(false);
      });
  };


  const handleJoin = (groupId) => {
    joinPublicGroup(groupId)
      .then((res) => {
        toast.success(res?.data?.data?.message || "Join request sent");
        fetchGroups()
        fetchPendingGroups()
        // Optionally refresh groups or update UI
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "Failed to join group");
        console.error(err);
      });
  };





  const fetchGroups = () => {
    // setIsRequestsLoading(true);
    getAllGroups("normal")
      .then((res) => {
        console.log(res, "requests");
        setGroupData(res?.data?.data);
      })
      .catch((err) => {
        console.error("Failed to fetch requests", err);
      })
      .finally(() => {
        // setIsRequestsLoading(false);
      });
  };
  // pending group 
  const fetchPendingGroups = () => {
    Fetcher.get("/user/network/groups/member/pending")
      .then((res) => {
        console.log(res, "requests");
        setPendingGroup(res?.data?.data);
      })
      .catch((err) => {
        console.error("Failed to fetch requests", err);
      })
      .finally(() => {
        // setIsRequestsLoading(false);
      });
  };

  // accept group 
  const [groupStatus, setGroupStatus] = useState();

  const handleAccept = (groupID, action) => {
    setGroupStatus({
      groupId: groupID,
      action: action
    })
  }


  // reject group
  const handleReject = (groupID, action) => {
    setGroupStatus({
      groupId: groupID,
      action: action
    })
  }


  useEffect(() => {
    if (groupStatus?.groupId && groupStatus?.action) {
      handleGroupStatus(groupStatus)
    }
  }, [groupStatus])

  const handleGroupStatus = async (groupInfo) => {
    try {
      const response = await respondToGroupInvitation(groupInfo);
      console.log("✅ API Success:", response.data);
      toast.success(response?.data?.data?.message || "Request Updated");
      fetchGroups()
      fetchPendingGroups()


    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update request");
    }
  }


  useEffect(() => {
    fetchGroups()
    fetchPendingGroups()
  }, [])


  const changeToGrid = () => {
    setGridView(true);
    setListView(false);
  };

  const changeToList = () => {
    setGridView(false);
    setListView(true);
  };

  const handleSwitchTabs = (e) => {
    setActiveTab(e.target.name);
  };

  const handleSteps = () => {
    if (nextStep == false) {
      setNextStep(true);
    } else {
      handleSubmit();
      handleClose();
    }
  };

  const handleCancelBtn = () => {
    if (nextStep == true) {
      setNextStep(false);
    } else {
      handleClose();
    }
  };

  const handleSubmit = (event) => {
    console.log("Form submitted!");
    // Add your form submission logic here
  };

  return (
    <section className="main_wrapper pb-5">
      <div className="container-fluid ps-5 pe-5">
        <div className="row">
          <div className="col-lg-12">
            <div className="heading_wrapper d-flex align-items-center justify-content-between mt-4 mb-4">
              <h1>Groups</h1>
              <div className="viewbtns">
                <Button className={`viewBtn1 ${listView ? "viewActiveBtn" : ""}`} onClick={changeToList}>
                  <FaList className={`viewBtn1 ${listView ? "listViewActive" : "listView"}`} />
                </Button>
                <Button className={`viewBtn2 ${gridView ? "viewActiveBtn" : ""}`} onClick={changeToGrid}>
                  <FiGrid className={`viewBtn1 ${gridView ? "listViewActive" : "listView"}`} />
                </Button>
              </div>
            </div>
          </div>

          <div className="connection-btns-line d-flex align-items-center justify-content-between mt-4 mb-4">
            <div className="connection-btn-wrap d-flex">
              {["All", "My Groups", "Monitor Groups"].map((tab) => (
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
                  {tab === "All" ? "All" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Button>
              ))}
            </div>

            <div className="connection-search-wrap d-flex align-items-start">
              <div className="mainSearch">
                <div className="connection-search d-flex align-items-center me-3">
                  <IoIosSearch className="connection-search-icon" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>

                {searchQuery && (
                  <div className="search-results-list mt-3 py-3">
                    {isSearching ? (
                      <p className="mb-0">Searching...</p>
                    ) : searchResults.length === 0 ? (
                      <p className="mb-0">No groups found</p>
                    ) : (
                      searchResults.map((group) => (
                        <div
                          key={group.id}
                          className="d-flex justify-content-between align-items-center py-2 border-bottom"
                        >
                          <div className="d-flex align-items-center">
                            <img
                              src={group.image || "/default-group.png"}
                              alt="Group"
                              className="rounded-circle me-2"
                              width="32"
                              height="32"
                            />
                            <div>
                              <div className="fw-semibold">{group.name}</div>
                              <div className="text-muted small">{group.description}</div>
                            </div>
                          </div>
                          <button
                            className="btn btn-link text-primary"
                            onClick={() => handleJoin(group.id)}
                          >
                            Join
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div className="add-groups bg-primary cursor-pointer" onClick={handleOpen}>
                <MdAdd className="filter-icon-btn text-white" />
              </div>
            </div>
          </div>
        </div>

        {activeTab == "All" && (
          <>
            {
              pendingGroup?.some((card) => card.status === "PENDING") && (
                <>
                  <h3>Group Invites</h3>
                  <div className={`${gridView ? "group-container" : "group-container-grid"}`}>
                    {pendingGroup && pendingGroup?.map((card, index) => (
                      <div key={index} className={`group-card-wrapper pt-4 pb-4 mb-3 ${gridView ? "text-center" : "mb-3"}`}>
                        <div className={`group-card ${gridView ? "" : "d-flex align-items-center justify-content-between px-4"}`}>
                          <div className={`image-wrapper ${gridView ? "" : "d-flex align-items-center"}`}>
                            <div className={`image-wrap  ${gridView ? "mb-2" : "me-3"}`}>
                              <img src={`https://feedbackwork.net/feedbackapi/${card?.group?.imageUrl}`} alt="" className="rounded-circle"
                                style={{ width: 60, height: 60, objectFit: "cover", margin: "0 auto" }} />
                            </div>
                            <div className="group-description-wrap">
                              <h6 className="mb-1">{card?.group?.name}</h6>
                              <p className={`${gridView ? "mb-0" : "mb-0"}`}>{card?.group?.description}</p>
                              <p>Total Members: {card?.members?.length}</p>
                            </div>
                          </div>
                          <div className="group-card-btn">
                            <button className={`btn mx-1 ${card?.status == "PENDING" ? "connection-connect-as" : "btn-primary"}`} onClick={() => { handleAccept(card?.group?.id, 'accept') }}>Join Group</button>
                            <button className={`btn mx-1 ${card?.status == "PENDING" ? "connection-connect-as" : "btn-primary"}`} onClick={() => { handleReject(card?.group?.id, 'reject') }}>Decline</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )
            }


            <h3>All Groups</h3>
            <div className={`${gridView ? "group-container" : "group-container-grid"}`}>
              {allGroupsArr && allGroupsArr?.normal?.map((card, index) => (
                <div key={index} className={`group-card-wrapper pt-4 pb-4 mb-3 ${gridView ? "text-center" : "mb-3"}`}>
                  <div className={`group-card ${gridView ? "" : "d-flex align-items-center justify-content-between px-4"}`}>
                    <div className={`image-wrapper ${gridView ? "" : "d-flex align-items-center"}`}>
                      <div className={`image-wrap  ${gridView ? "mb-2" : "me-3"}`}>
                        <img src={`https://feedbackwork.net/feedbackapi/${card?.imageUrl}`} alt="" className="rounded-circle"
                          style={{ width: 60, height: 60, objectFit: "cover", margin: "0 auto" }} />
                      </div>
                      <div className="group-description-wrap">
                        <h6 className="mb-1">{card.name}</h6>
                        <p className={`${gridView ? "mb-0" : "mb-0"}`}>{card.description}</p>
                        <p>Total Members: {card?.members?.length}</p>
                      </div>
                    </div>
                    <div className="group-card-btn">
                      <button className={`btn ${card.status == "Joined" ? "connection-connect-as" : "btn-primary"}`}>Joined</button>
                      <button 
                        className="btn btn-outline-secondary ms-2" 
                        onClick={() => navigate(`/groups/${card.id}`)}
                        title="Group Settings"
                      >
                        <MdSettings />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className={`${gridView ? "group-container" : "group-container-grid"}`}>
              {allGroupsArr && allGroupsArr?.monitoring?.map((card, index) => (
                <div key={index} className={`group-card-wrapper pt-4 pb-4 mb-3 ${gridView ? "text-center" : "mb-3"}`}>
                  <div className={`group-card ${gridView ? "" : "d-flex align-items-center justify-content-between px-4"}`}>
                    <div className={`image-wrapper ${gridView ? "" : "d-flex align-items-center"}`}>
                      <div className={`image-wrap  ${gridView ? "mb-2" : "me-3"}`}>
                        <img src={`https://feedbackwork.net/feedbackapi/${card?.imageUrl}`} alt="" className="rounded-circle"
                          style={{ width: 60, height: 60, objectFit: "cover", margin: "0 auto" }} />
                      </div>
                      <div className="group-description-wrap">
                        <h6 className="mb-1">{card.name}</h6>
                        <p className={`${gridView ? "mb-0" : "mb-0"}`}>{card.description}</p>
                        <p>Total Members: {card?.members?.length}</p>
                      </div>
                    </div>
                    <div className="group-card-btn">
                      <button className={`btn ${card.status == "Joined" ? "connection-connect-as" : "btn-primary"}`}>Joined</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab == "My Groups" && (
          <div className={`${gridView ? "group-container" : "group-container-grid"}`}>
            {allGroupsArr && allGroupsArr?.normal?.map((card, index) => (
              <div key={index} className={`group-card-wrapper pt-4 pb-4 mb-3 ${gridView ? "text-center" : "mb-3"}`}>
                <div className={`group-card ${gridView ? "" : "d-flex align-items-center justify-content-between px-4"}`}>
                  <div className={`image-wrapper ${gridView ? "" : "d-flex align-items-center"}`}>
                    <div className={`image-wrap  ${gridView ? "mb-2" : "me-3"}`}>
                      <img src={`https://feedbackwork.net/feedbackapi/${card?.imageUrl}`} alt="" className="rounded-circle"
                        style={{ width: 60, height: 60, objectFit: "cover", margin: "0 auto" }} />
                    </div>
                    <div className="group-description-wrap">
                      <h6 className="mb-1">{card.name}</h6>
                      <p className={`${gridView ? "mb-0" : "mb-0"}`}>{card.description}</p>
                      <p>Total Members: {card?.members?.length}</p>
                    </div>
                  </div>
                  <div className="group-card-btn">
                    <button className={`btn ${card.status == "Joined" ? "connection-connect-as" : "btn-primary"}`}>Joined</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab == "Monitor Groups" && (
          <div className={`${gridView ? "group-container" : "group-container-grid"}`}>
            {allGroupsArr?.monitoring?.map((card, index) => (
              <div key={index} className={`group-card-wrapper pt-4 pb-4 mb-3 ${gridView ? "text-center" : "mb-3"}`}>
                <div className={`group-card ${gridView ? "" : "d-flex align-items-center justify-content-between px-4"}`}>
                  <div className={`image-wrapper ${gridView ? "" : "d-flex align-items-center"}`}>
                    <div className={`image-wrap  ${gridView ? "mb-2" : "me-3"}`}>
                      <img src={`https://feedbackwork.net/feedbackapi/${card?.group?.imageUrl}`} alt="" className="rounded-circle"
                        style={{ width: 60, height: 60, objectFit: "cover", margin: "0 auto" }} />
                    </div>
                    <div className="group-description-wrap">
                      <h6 className="mb-1">{card.groupName}</h6>
                      <p className={`${gridView ? "" : "mb-0"}`}>{card.descripton}</p>
                    </div>
                  </div>
                  <div className="group-card-btn">
                    <button className="btn btn-primary" onClick={() => navigate("/solution-function")}>
                      Monitor Group
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <GroupModal open={open} onClose={handleClose} />
    </section>
  );
}
