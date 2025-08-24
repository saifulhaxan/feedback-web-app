import { Button, CircularProgress } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
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
import Modal from "@mui/material/Modal";
import { BiBorderRadius } from "react-icons/bi";
import SearchConnectionModal from "../components/networkModal/SearchConnectionModal";
import UserProfileModal from "../components/networkModal/UserProfileModal";
import Fetcher from "../library/Fetcher";
import useUserStore from "../store/userStore";
import { ROLES } from "../utils/rolePermissions";
import {
  getAllConnections,
  getPendingConnectionRequests,
  getSentConnectionRequests,
  sendConnectionRequest,
  respondToConnectionRequest,
  cancelConnectionRequest,
  deleteConnection,
  getUserProfile,
  getConnectionOptions
} from "../api/networkApi";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  height: "80%",
  p: 4,
};

function NetworkPage() {
  // Get current user data and role
  const { userData } = useUserStore();
  const currentUserRole = userData?.user?.role?.name;
  const isChild = currentUserRole === ROLES.CHILD;
  
  // Debug logging for role-based restrictions
  console.log('Network Page - User Role:', currentUserRole, 'Is Child:', isChild);
  
  const [gridView, setGridView] = useState(true);
  const [listView, setListView] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [activeTab, setActiveTab] = useState("connections");
  const [open, setOpen] = React.useState(false);
  const [myConnections, setMyConnections] = useState([]);
  const [suggestions, setsuggestions] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [isRequestsLoading, setIsRequestsLoading] = useState(false);
  const [activeRequestTab, setActiveRequestTab] = useState("received");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Pagination State
  const [connectionsPagination, setConnectionsPagination] = useState({ skip: 0, take: 20, hasMore: true });
  const [suggestionsPagination, setSuggestionsPagination] = useState({ skip: 0, take: 20, hasMore: true });
  const [requestsPagination, setRequestsPagination] = useState({ skip: 0, take: 20, hasMore: true });
  const [sentRequestsPagination, setSentRequestsPagination] = useState({ skip: 0, take: 20, hasMore: true });

  // Search state
  const [connectionsQuery, setConnectionsQuery] = useState("");
  const [suggestionsQuery, setSuggestionsQuery] = useState("");
  const [receivedQuery, setReceivedQuery] = useState("");
  const [sentQuery, setSentQuery] = useState("");

  // Debounce helpers
  const [debouncedConnectionsQuery, setDebouncedConnectionsQuery] = useState("");
  const [debouncedSuggestionsQuery, setDebouncedSuggestionsQuery] = useState("");
  const [debouncedReceivedQuery, setDebouncedReceivedQuery] = useState("");
  const [debouncedSentQuery, setDebouncedSentQuery] = useState("");

  useEffect(() => {
    const id = setTimeout(() => setDebouncedConnectionsQuery(connectionsQuery.trim()), 300);
    return () => clearTimeout(id);
  }, [connectionsQuery]);
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSuggestionsQuery(suggestionsQuery.trim()), 300);
    return () => clearTimeout(id);
  }, [suggestionsQuery]);
  useEffect(() => {
    const id = setTimeout(() => setDebouncedReceivedQuery(receivedQuery.trim()), 300);
    return () => clearTimeout(id);
  }, [receivedQuery]);
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSentQuery(sentQuery.trim()), 300);
    return () => clearTimeout(id);
  }, [sentQuery]);

  // Helper to match by firstname/lastname/title
  const matchesUser = (userObj, q) => {
    if (!q) return true;
    const s = q.toLowerCase();
    const first = userObj?.firstname || userObj?.firstName || "";
    const last = userObj?.lastname || userObj?.lastName || "";
    const title = userObj?.title || "";
    return (
      first.toLowerCase().includes(s) ||
      last.toLowerCase().includes(s) ||
      title.toLowerCase().includes(s)
    );
  };

  // Role-based tab filtering
  const availableTabs = useMemo(() => {
    if (isChild) {
      // Children can only see connections (parents only)
      return ["connections"];
    }
    // Other roles can see all tabs
    return ["connections", "suggestions", "requests"];
  }, [isChild]);

  // Filtered views with role-based restrictions
  const filteredConnections = useMemo(() => {
    let connections = myConnections;
    
    // If child user, only show parent connections
    if (isChild) {
      connections = connections.filter((c) => {
        const user = c?.user || c;
        return user?.role?.name === "PARENT";
      });
    }
    
    return connections.filter((c) => matchesUser(c?.user || c, debouncedConnectionsQuery));
  }, [myConnections, debouncedConnectionsQuery, isChild]);

  const groupedSuggestions = useMemo(() => {
    const list = Array.isArray(suggestions) ? suggestions : [];
    return list.reduce((acc, item) => {
      const groupName = item?.ConnectAs?.name || "Other";
      const usersInItem = Array.isArray(item?.users) ? item.users : [];
      
      // Apply role-based filtering for suggestions
      let filteredUsers = usersInItem;
      if (isChild) {
        // If child user, only show parent suggestions
        filteredUsers = usersInItem.filter((u) => u?.role?.name === "PARENT");
      }
      
      const usersMatched = filteredUsers.filter((u) => matchesUser(u, debouncedSuggestionsQuery));
      if (usersMatched.length > 0) {
        if (!acc[groupName]) acc[groupName] = [];
        usersMatched.forEach((user) => acc[groupName].push({ ...item, users: [user] }));
      }
      return acc;
    }, {});
  }, [suggestions, debouncedSuggestionsQuery, isChild]);

  const filteredReceived = useMemo(() => {
    let requests = myRequests;
    
    // If child user, only show parent requests
    if (isChild) {
      requests = requests.filter((r) => r?.sentBy?.role?.name === "PARENT");
    }
    
    return requests.filter((r) => matchesUser(r?.sentBy, debouncedReceivedQuery));
  }, [myRequests, debouncedReceivedQuery, isChild]);

  const filteredSent = useMemo(() => {
    let requests = sentRequests;
    
    // If child user, only show parent requests
    if (isChild) {
      requests = requests.filter((r) => r?.receivedBy?.role?.name === "PARENT");
    }
    
    return requests.filter((r) => matchesUser(r?.receivedBy, debouncedSentQuery));
  }, [sentRequests, debouncedSentQuery, isChild]);

  // Fetch functions: do not pass query params
  const fetchConnections = (isLoadMore = false) => {
    const { skip, take } = connectionsPagination;
    if (isLoadMore) setIsLoadingMore(true);
    getAllConnections(null, undefined, skip, take)
      .then((res) => {
        const newConnections = res?.data?.data?.connections || [];
        const paginationData = res?.data?.data?.pagination;
        if (isLoadMore) setMyConnections((prev) => [...prev, ...newConnections]); else setMyConnections(newConnections);
        setConnectionsPagination((prev) => ({
          ...prev,
          skip: paginationData?.skip || 0,
          take: paginationData?.take || 20,
          hasMore: (paginationData?.skip + paginationData?.take) < paginationData?.total,
        }));
      })
      .catch((err) => console.error("Failed to fetch connections", err))
      .finally(() => { if (isLoadMore) setIsLoadingMore(false); });
  };

  const fetchSuggestions = (isLoadMore = false) => {
    const { skip, take } = suggestionsPagination;
    if (isLoadMore) setIsLoadingMore(true);
    Fetcher.get(`/user/network/suggested?skip=${skip}&take=${take}`)
      .then((res) => {
        const data = res?.data?.data || {};
        const newSuggestions = Array.isArray(data?.groups) ? data.groups : [];
        if (isLoadMore) setsuggestions((prev) => [...prev, ...newSuggestions]); else setsuggestions(newSuggestions);
        // Build pagination from skip/take/total when pagination object is not provided
        const nextSkip = typeof data?.skip === 'number' ? data.skip : skip;
        const nextTake = typeof data?.take === 'number' ? data.take : take;
        const total = typeof data?.total === 'number' ? data.total : (newSuggestions.length || 0);
        setSuggestionsPagination((prev) => ({
          ...prev,
          skip: nextSkip,
          take: nextTake,
          hasMore: (nextSkip + nextTake) < total,
        }));
      })
      .catch((err) => console.error("Failed to fetch suggestions", err))
      .finally(() => { if (isLoadMore) setIsLoadingMore(false); });
  };

  const fetchRequests = (isLoadMore = false) => {
    const { skip, take } = requestsPagination;
    if (!isLoadMore) setIsRequestsLoading(true); else setIsLoadingMore(true);
    getPendingConnectionRequests(skip, take)
      .then((res) => {
        const newRequests = res?.data?.data?.requests || [];
        const paginationData = res?.data?.data?.pagination;
        if (isLoadMore) setMyRequests((prev) => [...prev, ...newRequests]); else setMyRequests(newRequests);
        setRequestsPagination((prev) => ({
          ...prev,
          skip: paginationData?.skip || 0,
          take: paginationData?.take || 20,
          hasMore: (paginationData?.skip + paginationData?.take) < paginationData?.total,
        }));
      })
      .catch((err) => console.error("Failed to fetch requests", err))
      .finally(() => { if (!isLoadMore) setIsRequestsLoading(false); else setIsLoadingMore(false); });
  };

  const fetchSentRequests = (isLoadMore = false) => {
    const { skip, take } = sentRequestsPagination;
    if (!isLoadMore) setIsRequestsLoading(true); else setIsLoadingMore(true);
    getSentConnectionRequests(skip, take)
      .then((res) => {
        const newSent = res?.data?.data?.requests || [];
        const paginationData = res?.data?.data?.pagination;
        if (isLoadMore) setSentRequests((prev) => [...prev, ...newSent]); else setSentRequests(newSent);
        setSentRequestsPagination((prev) => ({
          ...prev,
          skip: paginationData?.skip || 0,
          take: paginationData?.take || 20,
          hasMore: (paginationData?.skip + paginationData?.take) < paginationData?.total,
        }));
      })
      .catch((err) => console.error("Failed to fetch sent requests", err))
      .finally(() => { if (!isLoadMore) setIsRequestsLoading(false); else setIsLoadingMore(false); });
  };

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  // Ensure active tab is valid for current user role
  useEffect(() => {
    if (!availableTabs.includes(activeTab)) {
      setActiveTab("connections");
    }
  }, [availableTabs, activeTab]);

  useEffect(() => {
    fetchRequests();
    fetchConnections();
    fetchSuggestions();
  }, []);

  const [openModal, setOpenModal] = React.useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);
  const [apiData, setApiData] = useState(null);

  // User Profile Modal State
  const [userProfileModal, setUserProfileModal] = useState({ open: false, userId: null });
  const handleUserProfileOpen = (userId) => setUserProfileModal({ open: true, userId });
  const handleUserProfileClose = () => setUserProfileModal({ open: false, userId: null });

  const handleApiResponse = (response, actionType) => {
    console.log("API Response received:", response, "Action:", actionType);
    
    // Refresh data based on the action type
    switch (actionType) {
      case "connection_request_sent":
        // When a connection request is sent, refresh ALL tabs
        // This ensures the user appears in sent requests and is removed from suggestions
        setRequestsPagination({ skip: 0, take: 20, hasMore: true });
        setSentRequestsPagination({ skip: 0, take: 20, hasMore: true });
        setConnectionsPagination({ skip: 0, take: 20, hasMore: true });
        setSuggestionsPagination({ skip: 0, take: 20, hasMore: true });
        fetchRequests();
        fetchSentRequests();
        fetchConnections();
        fetchSuggestions();
        break;
      case "connection_accepted":
      case "connection_rejected":
        // When a request is accepted/rejected, refresh both requests and connections
        setRequestsPagination({ skip: 0, take: 20, hasMore: true });
        setSentRequestsPagination({ skip: 0, take: 20, hasMore: true });
        setConnectionsPagination({ skip: 0, take: 20, hasMore: true });
        fetchRequests();
        fetchSentRequests();
        fetchConnections();
        break;
      case "connection_cancelled":
        // When a request is cancelled, refresh sent requests
        setSentRequestsPagination({ skip: 0, take: 20, hasMore: true });
        fetchSentRequests();
        break;
      case "connection_deleted":
        // When a connection is deleted, refresh connections
        setConnectionsPagination({ skip: 0, take: 20, hasMore: true });
        fetchConnections();
        break;
      default:
        // Default: refresh all data
        setRequestsPagination({ skip: 0, take: 20, hasMore: true });
        setSentRequestsPagination({ skip: 0, take: 20, hasMore: true });
        setConnectionsPagination({ skip: 0, take: 20, hasMore: true });
        setSuggestionsPagination({ skip: 0, take: 20, hasMore: true });
        fetchRequests();
        fetchSentRequests();
        fetchConnections();
        fetchSuggestions();
    }
  };




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
      title: "Sort by Feedback Type",
      options: ["Feedback Provided", "Feedback Applied", "Feedback Requested"],
    },
    {
      title: "Connection Type",
      options: ["Teacher", "Student", "Manager", "Coworker", "Employee", "Friend", "Classmate", "My Customer", "My Client", "Other"],
    },
  ];

  // Get only Expertise filters (excluding "All")
  const expertiseFilters = filterCategories.find((category) => category.title === "Expertise").options.filter((option) => option !== "All");

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
    // Reset pagination when switching main tabs
    if (e.target.name === "connections") {
      setConnectionsPagination({ skip: 0, take: 20, hasMore: true });
    } else if (e.target.name === "suggestions") {
      setSuggestionsPagination({ skip: 0, take: 20, hasMore: true });
    } else if (e.target.name === "requests") {
      setRequestsPagination({ skip: 0, take: 20, hasMore: true });
      setSentRequestsPagination({ skip: 0, take: 20, hasMore: true });
    }
  };

  const handleRequestTabSwitch = (tab) => {
    setActiveRequestTab(tab);
    // Reset pagination when switching tabs
    if (tab === "received") {
      setRequestsPagination({ skip: 0, take: 20, hasMore: true });
      fetchRequests();
    } else if (tab === "sent") {
      setSentRequestsPagination({ skip: 0, take: 20, hasMore: true });
      fetchSentRequests();
    }
  };


  const handleConnectResponse = (response) => {
    console.log("📬 Response received from child Suggestion:", response);
    // When a connection request is sent from suggestions, refresh ALL tabs
    // This ensures the user appears in sent requests and is removed from suggestions
    setRequestsPagination({ skip: 0, take: 20, hasMore: true });
    setSentRequestsPagination({ skip: 0, take: 20, hasMore: true });
    setConnectionsPagination({ skip: 0, take: 20, hasMore: true });
    setSuggestionsPagination({ skip: 0, take: 20, hasMore: true });
    fetchRequests();
    fetchSentRequests();
    fetchConnections();
    fetchSuggestions();
  };

  // Infinite scroll handler
  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    
    // Check if user has scrolled to bottom (with 100px threshold)
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      // Determine which tab is active and load more data
      if (activeTab === "connections" && connectionsPagination.hasMore && !isLoadingMore) {
        setConnectionsPagination(prev => ({ ...prev, skip: prev.skip + prev.take }));
        fetchConnections(true);
      } else if (activeTab === "suggestions" && suggestionsPagination.hasMore && !isLoadingMore) {
        setSuggestionsPagination(prev => ({ ...prev, skip: prev.skip + prev.take }));
        fetchSuggestions(true);
      } else if (activeTab === "requests") {
        if (activeRequestTab === "received" && requestsPagination.hasMore && !isLoadingMore) {
          setRequestsPagination(prev => ({ ...prev, skip: prev.skip + prev.take }));
          fetchRequests(true);
        } else if (activeRequestTab === "sent" && sentRequestsPagination.hasMore && !isLoadingMore) {
          setSentRequestsPagination(prev => ({ ...prev, skip: prev.skip + prev.take }));
          fetchSentRequests(true);
        }
      }
    }
  };


  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-3 filter-large">
            <div className="p-3">
              <div className="d-flex flex justify-content-between mb-4 pt-4 align-items-center">
                <h2 className="h5 fw-bold">Filters</h2>
                <Button className="p-0" onClick={resetFilters} sx={{ textTransform: "none" }}>
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
                        className={`filter-item d-flex justify-content-between align-items-center p-2 rounded cursor-pointer ${option === "All" ? "fw-bold text-primary" : ""
                          }`}
                        onClick={() => toggleFilter(option, title)}
                      >
                        <span>{option}</span>
                        {selectedFilters.includes(option) && <FaCheck className="text-primary" />}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="col-lg-9 main_wrapper">
            <div className="heading_wrapper d-flex align-items-center justify-content-between mt-4 mb-4">
              <div>
                <h1>Connections</h1>
                {isChild && (
                  <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                    As a child account, you can only view and connect with parent accounts.
                  </p>
                )}
              </div>
              <div className="viewbtns">
                <Button className={`viewBtn1 ${listView ? "viewActiveBtn" : ""}`} onClick={changeToList}>
                  <FaList className={`viewBtn1 ${listView ? "listViewActive" : "listView"}`} />
                </Button>
                <Button className={`viewBtn2 ${gridView ? "viewActiveBtn" : ""}`} onClick={changeToGrid}>
                  <FiGrid className={`viewBtn1 ${gridView ? "listViewActive" : "listView"}`} />
                </Button>
              </div>
            </div>

            <div className="connection-btns-line d-flex align-items-center justify-content-between mt-4 mb-4">
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
                    name={tab}
                    onClick={handleSwitchTabs}
                  >
                    {tab === "connections" ? "My Connections" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="d-flex justify-content-end align-items-center mb-3 gap-3">
              {/* Per-tab search field */}
              {activeTab === "connections" && (
                <div className="connection-search d-flex align-items-center">
                  <IoIosSearch className="connection-search-icon" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={connectionsQuery}
                    onChange={(e) => setConnectionsQuery(e.target.value)}
                  />
                </div>
              )}
              {activeTab === "suggestions" && (
                <div className="connection-search d-flex align-items-center">
                  <IoIosSearch className="connection-search-icon" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={suggestionsQuery}
                    onChange={(e) => setSuggestionsQuery(e.target.value)}
                  />
                </div>
              )}
              {activeTab === "requests" && (
                <div className="connection-search d-flex align-items-center">
                  <IoIosSearch className="connection-search-icon" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={activeRequestTab === 'received' ? receivedQuery : sentQuery}
                    onChange={(e) => (activeRequestTab === 'received' ? setReceivedQuery(e.target.value) : setSentQuery(e.target.value))}
                  />
                </div>
              )}

              {/* Add Connection fixed to top-right - hidden for CHILD role */}
              {!isChild && (
                <button className="btn btn-primary connection-request" onClick={handleOpen}>
                  Add Connection
                </button>
              )}
            </div>

            {activeTab == "connections" && (
              <div className="row">
                {filteredConnections.map((item, index) => (
                  <div className={gridView ? "col-lg-3" : "col-lg-12 mb-3"} key={index}>
                    {gridView ? (
                      <NetworkConnectionsCardGrid 
                        item={item} 
                        onApiResponse={(response, actionType) => handleApiResponse(response, actionType)}
                        onProfileClick={handleUserProfileOpen}
                      />
                    ) : (
                      <NetworkConnectionsCardList 
                        item={item} 
                        onApiResponse={(response, actionType) => handleApiResponse(response, actionType)}
                        onProfileClick={handleUserProfileOpen}
                      />
                    )}
                  </div>
                ))}
                {isLoadingMore && connectionsPagination.hasMore && (
                  <div className="col-12 text-center py-3">
                    <CircularProgress size={30} />
                    <p className="mt-2 text-muted">Loading more connections...</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "suggestions" && (
              <div className="suggestions-tab">
                {Object.entries(groupedSuggestions).map(([groupName, users]) => (
                  <div key={groupName} className="mb-5">
                    <h5 className="mb-3 font-weight-bold">{groupName}</h5>

                    <div className="row">
                      {users.map((item, index) => (
                        <div
                          key={index}
                          className={gridView ? "col-lg-3 mb-4" : "col-lg-12 mb-3"}
                        >
                          {gridView ? (
                            <NetworkSuggestionsCardGrid
                              item={item}
                              onConnectResponse={handleConnectResponse}
                              onProfileClick={handleUserProfileOpen}
                            />
                          ) : (
                            <NetworkSuggestionsCardList 
                              item={item} 
                              onConnectResponse={handleConnectResponse}
                              onProfileClick={handleUserProfileOpen}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {isLoadingMore && suggestionsPagination.hasMore && (
                  <div className="col-12 text-center py-3">
                    <CircularProgress size={30} />
                    <p className="mt-2 text-muted">Loading more suggestions...</p>
                  </div>
                )}
              </div>
            )}


            {activeTab === "requests" && (
              <div>
                {/* Request Sub-tabs header */}
                <div className="request-tabs mb-4">
                  <div className="d-flex">
                    {["received", "sent"].map((tab) => (
                      <Button
                        key={tab}
                        sx={{
                          textTransform: "none",
                          bgcolor: activeRequestTab === tab ? "#EBF5FF" : "white",
                          color: activeRequestTab === tab ? "#0064D1" : "black",
                          fontWeight: "bold",
                          border: "1px solid #ddd",
                          borderRadius: "0",
                          "&:first-of-type": { borderTopLeftRadius: "4px", borderBottomLeftRadius: "4px" },
                          "&:last-of-type": { borderTopRightRadius: "4px", borderBottomRightRadius: "4px" },
                        }}
                        className="me-0"
                        onClick={() => handleRequestTabSwitch(tab)}
                      >
                        {tab === "received" ? "Received" : "Sent"}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* No search bar in sub-tabs as requested */}

                {/* Received Requests */}
                {activeRequestTab === "received" && (
                  <div className="row">
                    {isRequestsLoading ? (
                      <div className="d-flex justify-content-center align-items-center py-5">
                        <div className="spinner-border text-primary" role="status" style={{ width: "2.5rem", height: "2.5rem" }}>
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : filteredReceived.length === 0 ? (
                      <div className="col-12 text-center py-5">
                        <h5 className="text-muted">No pending requests</h5>
                      </div>
                    ) : gridView ? (
                      filteredReceived.map((item, index) => (
                        <div className="col-lg-3" key={index}>
                          <NetworkRequestsCardGrid 
                            item={item} 
                            fetchRequests={fetchRequests} 
                            fetchConnections={fetchConnections}
                            onApiResponse={(response, actionType) => handleApiResponse(response, actionType)}
                            onProfileClick={handleUserProfileOpen}
                          />
                        </div>
                      ))
                    ) : (
                      filteredReceived.map((item, index) => (
                        <div className="col-lg-12 mb-3" key={index}>
                          <NetworkRequestsCardList 
                            item={item} 
                            fetchRequests={fetchRequests} 
                            fetchConnections={fetchConnections}
                            onApiResponse={(response, actionType) => handleApiResponse(response, actionType)}
                            onProfileClick={handleUserProfileOpen}
                          />
                        </div>
                      ))
                    )}
                    {isLoadingMore && requestsPagination.hasMore && activeRequestTab === "received" && (
                      <div className="col-12 text-center py-3">
                        <CircularProgress size={30} />
                        <p className="mt-2 text-muted">Loading more received requests...</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Sent Requests */}
                {activeRequestTab === "sent" && (
                  <div className="row">
                    {isRequestsLoading ? (
                      <div className="d-flex justify-content-center align-items-center py-5">
                        <div className="spinner-border text-primary" role="status" style={{ width: "2.5rem", height: "2.5rem" }}>
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : filteredSent.length === 0 ? (
                      <div className="col-12 text-center py-5">
                        <h5 className="text-muted">No sent requests</h5>
                      </div>
                    ) : gridView ? (
                      filteredSent.map((item, index) => (
                        <div className="col-lg-3" key={index}>
                          <NetworkRequestsCardGrid 
                            item={item} 
                            fetchRequests={fetchSentRequests} 
                            fetchConnections={fetchConnections} 
                            isSentRequest={true}
                            onApiResponse={(response, actionType) => handleApiResponse(response, actionType)}
                            onProfileClick={handleUserProfileOpen}
                          />
                        </div>
                      ))
                    ) : (
                      filteredSent.map((item, index) => (
                        <div className="col-lg-12 mb-3" key={index}>
                          <NetworkRequestsCardList 
                            item={item} 
                            fetchRequests={fetchSentRequests} 
                            fetchConnections={fetchConnections} 
                            isSentRequest={true}
                            onApiResponse={(response, actionType) => handleApiResponse(response, actionType)}
                            onProfileClick={handleUserProfileOpen}
                          />
                        </div>
                      ))
                    )}
                    {isLoadingMore && sentRequestsPagination.hasMore && activeRequestTab === "sent" && (
                      <div className="col-12 text-center py-3">
                        <CircularProgress size={30} />
                        <p className="mt-2 text-muted">Loading more sent requests...</p>
                      </div>
                    )}
                  </div>
                )}
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
              <Button className="p-0" onClick={resetFilters} sx={{ textTransform: "none" }}>
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
                      className={`filter-item d-flex justify-content-between align-items-center p-2 rounded cursor-pointer ${option === "All" ? "fw-bold text-primary" : ""
                        }`}
                      onClick={() => toggleFilter(option, title)}
                    >
                      <span>{option}</span>
                      {selectedFilters.includes(option) && <FaCheck className="text-primary" />}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Box>
      </Drawer>

      <SearchConnectionModal open={openModal} onClose={handleClose} onApiResponse={(response) => handleApiResponse(response, "connection_request_sent")} />
      <UserProfileModal 
        open={userProfileModal.open} 
        onClose={handleUserProfileClose} 
        userId={userProfileModal.userId}
        onApiResponse={(response, actionType) => handleApiResponse(response, actionType)}
      />
    </>
  );
}

export default NetworkPage;
