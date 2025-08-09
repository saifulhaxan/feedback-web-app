import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { IoIosSearch } from "react-icons/io";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import CircularProgress from "@mui/material/CircularProgress";
import { getConnectionOptions, sendConnectionRequest, searchUsers } from "../../api/networkApi";
import useUserStore from "../../store/userStore";
import useTokenStore from "../../store/userToken";
import { toast } from "react-toastify/unstyled";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  height: "80%",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
};

const SearchConnectionModal = ({ open, onClose, onApiResponse }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [roles, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState({});
  const [requestedUsers, setRequestedUsers] = useState([]); // store ids of requested users
  const [loadingUser, setLoadingUser] = useState(null); // userId being processed

  const { userData } = useUserStore();
  const { tokens } = useTokenStore();

  // Fetch roles once
  useEffect(() => {
    getConnectionOptions()
      .then((res) => {
        setRoles(res?.data?.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch roles", err);
      });
  }, []);

  // Debounced user search
  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    if (debounceTimeout) clearTimeout(debounceTimeout);

    const timeout = setTimeout(() => {
      searchUsers(query)
        .then((res) => {
          console.log(res, "Search Results");
          setResults(res?.data?.data?.users || []);
        })
        .catch((err) => {
          console.error("Search error:", err);
        });
    }, 500);

    setDebounceTimeout(timeout);
  }, [query]);

  const handleConnectClick = (userId) => {
    setOpenDropdown((prev) => (prev === userId ? null : userId));
  };

  // const handleSelectRole = (user, role) => {
  //   setSelectedRoles((prev) => ({
  //     ...prev,
  //     [user.id]: role.id,
  //   }));

  //   setLoadingUser(user.id);

  //   const payload = {
  //     requesterId: userData?.user?.id,
  //     receiverId: user.id,
  //     connectAs: role.name,
  //   };

  //   Fetcher.post("/user/network/connections/request", payload)
  //     .then(() => {
  //       setRequestedUsers((prev) => [...prev, user.id]);
  //       setLoadingUser(null);
  //       setOpenDropdown(null);
  //       toast.success("Request send successfully");
  //     })
  //     .catch((error) => {
  //       console.error("Connection request failed:", error);
  //       toast.error("Failed to send connection request");
  //       setLoadingUser(null);
  //       setOpenDropdown(null);
  //     });
  // };

  const handleSendConnectionRequest = (user) => {
    const roleId = selectedRoles[user.id];
    const role = roles.find((r) => r.id === roleId);
    if (!role) return;

    setLoadingUser(user.id);

    // Get user ID from multiple sources
    const storeUserId = userData?.user?.id;
    const localStorageData = JSON.parse(localStorage.getItem('user-data-storage'));
    const localStorageUserId = localStorageData?.state?.userData?.user?.id;
    const tokenUserId = tokens?.user?.id; // Try to get from token store

    // Try to decode JWT token to get user ID
    let jwtUserId = null;
    try {
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        const tokenParts = accessToken.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          jwtUserId = payload.userId || payload.sub || payload.id;
        }
      }
    } catch (error) {
      console.log("🔍 Debug - JWT decode failed:", error);
    }

    const currentUserId = storeUserId || localStorageUserId || tokenUserId || jwtUserId;

    console.log("🔍 Debug - storeUserId:", storeUserId);
    console.log("🔍 Debug - localStorageData:", localStorageData);
    console.log("🔍 Debug - localStorageUserId:", localStorageUserId);
    console.log("🔍 Debug - tokenUserId:", tokenUserId);
    console.log("🔍 Debug - tokens:", tokens);
    console.log("🔍 Debug - jwtUserId:", jwtUserId);
    console.log("🔍 Debug - currentUserId:", currentUserId);

    if (!currentUserId) {
      console.error("❌ No user ID found! Cannot send connection request.");
      toast.error("User not authenticated. Please login again.");
      return;
    }

    const payload = {
      requesterId: currentUserId,
      receiverId: user.id,
      connectAs: role.name,
    };

    console.log("🔍 Debug - Final payload being sent:", payload);

    sendConnectionRequest(payload)
      .then(() => {
        setRequestedUsers((prev) => [...prev, user.id]);
        setLoadingUser(null);
        setOpenDropdown(null);
        onApiResponse(true)
        toast.success("Request sent successfully");
      })
      .catch((error) => {
        console.error("Connection request failed:", error);
        toast.error("Failed to send connection request");
        setLoadingUser(null);
        setOpenDropdown(null);
      });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <h3 className="mb-3">Search Connection</h3>

        <div className="connection-search d-flex align-items-center me-3 connection-modal-search mb-3 connectionModal-search">
          <IoIosSearch className="connection-search-icon" />
          <input type="text" placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>

        <div style={{ overflowY: "auto", flex: 1 }}>
          {results.length > 0 ? (
            <ul className="list-unstyled">
              {results.map((user) => {
                const initials = `${user.firstname?.charAt(0) || ""}${user.lastname?.charAt(0) || ""}`.toUpperCase();
                const isRequested = requestedUsers.includes(user.id);
                const isLoading = loadingUser === user.id;
                const selectedRoleId = selectedRoles[user.id];
                const hasPendingReceived = user.receivedConnections?.some((conn) => conn.status === "PENDING");
                console.log('aa', hasPendingReceived)
                // const hasConnected = user.receivedConnections?.some((conn) => conn.status == "connected");

                return (
                  <li key={user.id} className="position-relative d-flex align-items-center justify-content-between border-bottom py-3">
                    <div className="d-flex align-items-center">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={`${user.firstname} ${user.lastname}`}
                          className="rounded-circle"
                          style={{ width: "40px", height: "40px", objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                          style={{ width: "40px", height: "40px", fontWeight: "bold" }}
                        >
                          {initials}
                        </div>
                      )}
                      <div className="ms-3">
                        <div className="fw-semibold">
                          {user.firstname} {user.lastname}
                        </div>
                        <div className="text-muted small">{user.email}</div>
                      </div>
                    </div>

                    {
                      user?.connectionStatus != 'connected' && user?.connectionStatus != 'sent' ? (
                        <div className="text-end">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleConnectClick(user.id)}
                            disabled={isRequested || hasPendingReceived}
                          >
                            {isLoading ? <CircularProgress size={18} /> : isRequested ? "Requested" : hasPendingReceived ? "Pending" : "Connect As"}
                          </button>

                          {openDropdown === user.id && !isRequested && (
                            <ClickAwayListener onClickAway={() => setOpenDropdown(null)}>
                              <div
                                className="shadow bg-white rounded"
                                style={{
                                  position: "absolute",
                                  top: "100%",
                                  right: 0,
                                  zIndex: 10,
                                  marginTop: "0.5rem",
                                  width: "220px",
                                  border: "1px solid #ddd",
                                  overflow: "hidden",
                                }}
                              >
                                {/* Connect Button */}
                                {selectedRoleId && (
                                  <div className="px-3 py-2">
                                    <button className="btn btn-sm btn-primary w-100" onClick={() => handleSendConnectionRequest(user)}>
                                      {loadingUser === user.id ? <CircularProgress size={18} /> : "Connect"}
                                    </button>
                                  </div>
                                )}
                                
                                {roles.map((role) => (
                                  <div
                                    key={role.id}
                                    className="px-3 py-2 border-bottom d-flex align-items-center"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => setSelectedRoles((prev) => ({ ...prev, [user.id]: role.id }))}
                                  >
                                    <span className="me-2" style={{ width: "16px" }}>
                                      {selectedRoleId === role.id && "✔️"}
                                    </span>
                                    <span>{role.name}</span>
                                  </div>
                                ))}


                              </div>
                            </ClickAwayListener>
                          )}
                        </div>
                      ) : (

                        <button
                          className={`btn btn-sm ${user?.connectionStatus === '' ? 'btn-primary' : 'btn-outline-primary'}`}
                        >
                          {user?.connectionStatus === 'connected' ? 'Connected' : 'Sent'}
                        </button>
                      )
                    }


                  </li>
                );
              })}
            </ul>
          ) : (
            query && <p className="text-muted mt-3">No results found.</p>
          )}
        </div>
      </Box>
    </Modal >
  );
};

export default SearchConnectionModal;
