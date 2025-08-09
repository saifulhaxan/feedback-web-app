import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { IoIosSearch } from "react-icons/io";
import CircularProgress from "@mui/material/CircularProgress";
import Fetcher from "../../library/Fetcher";
import useUserStore from "../../store/userStore";
import { toast } from "react-toastify/unstyled";
import { shareProject } from "../../api/projectApi";
import { getAllConnections, searchUsers } from "../../api/networkApi";

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

const SearchProjectShareModal = ({ open, onClose, projectId, onApiResponse }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [sharedUsers, setSharedUsers] = useState([]); // store ids of shared users
  const [loadingUser, setLoadingUser] = useState(null); // userId being processed

  const { userData } = useUserStore();

  // Debounced user search
  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    if (debounceTimeout) clearTimeout(debounceTimeout);

    const timeout = setTimeout(() => {
      getAllConnections(projectId, query)
        .then((res) => {
          console.log(res, "Search Results");
          setResults(res?.data?.data?.connections || []);
        })
        .catch((err) => {
          console.error("Search error:", err);
        });
    }, 500);

    setDebounceTimeout(timeout);
  }, [query, projectId]);

  const handleShareProject = async (user) => {
    setLoadingUser(user.id);

    const payload = {
      projectId: projectId,
      sharedWithId: user.id
    };

    try {
      const { data } = await shareProject(payload);
      setSharedUsers((prev) => [...prev, user.id]);
      setLoadingUser(null);
      toast.success(data?.data?.data?.message || "Project shared successfully!");
      onApiResponse && onApiResponse(true);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to share project");
      setLoadingUser(null);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <h3 className="mb-3">Share Project</h3>

        <div className="connection-search d-flex align-items-center me-3 connection-modal-search mb-3 connectionModal-search">
          <IoIosSearch className="connection-search-icon" />
          <input 
            type="text" 
            placeholder="Search users to share with" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
          />
        </div>

        <div style={{ overflowY: "auto", flex: 1 }}>
          {results.length > 0 ? (
            <ul className="list-unstyled">
              {results.map((item) => {
                const initials = `${item.user.firstname?.charAt(0) || ""}${item.user.lastname?.charAt(0) || ""}`.toUpperCase();
                const isShared = sharedUsers.includes(item.user.id);
                const isLoading = loadingUser === item.user.id;

                return (
                  <li key={item.user.id} className="position-relative d-flex align-items-center justify-content-between border-bottom py-3">
                    <div className="d-flex align-items-center">
                      {item.user.image ? (
                        <img
                          src={item.user.image}
                          alt={`${item.user.firstname} ${item.user.lastname}`}
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
                          {item.user.firstname} {item.user.lastname}
                        </div>
                        <div className="text-muted small">{item.user.email}</div>
                      </div>
                    </div>

                    <div className="text-end">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleShareProject(item.user)}
                        disabled={isShared || isLoading}
                      >
                        {isLoading ? (
                          <CircularProgress size={18} />
                        ) : isShared ? (
                          "Shared"
                        ) : (
                          "Share"
                        )}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            query && <p className="text-muted mt-3">No results found.</p>
          )}
        </div>
      </Box>
    </Modal>
  );
};

export default SearchProjectShareModal; 