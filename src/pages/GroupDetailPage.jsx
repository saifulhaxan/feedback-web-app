import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, Modal, Avatar, Badge } from "@mui/material";
import { MdAdd, MdEdit, MdDelete, MdArrowBack } from "react-icons/md";
import { FaCheck, FaTimes } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import CircularProgress from "@mui/material/CircularProgress";
import { 
  getGroupById, 
  addMemberToGroup, 
  removeMemberFromGroup, 
  deleteGroup,
  leaveGroup 
} from "../api/groupsApi";
import NormalGroupModal from "../components/groupModal/NormalGroupModal";
import { getAllConnections } from "../api/networkApi";
import useUserStore from "../store/userStore";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: 350, sm: "60%", md: "50%" },
  height: "auto",
  maxHeight: "90%",
  overflow: "auto",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 2,
};

const getInitials = (firstname = "", lastname = "") => {
  const first = firstname?.charAt(0)?.toUpperCase() || "";
  const last = lastname?.charAt(0)?.toUpperCase() || "";
  return first + last;
};

export default function GroupDetailPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const userData = useUserStore((state) => state.userData);
  
  const [groupData, setGroupData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openAddMember, setOpenAddMember] = useState(false);
  const [openEditGroup, setOpenEditGroup] = useState(false);
  const [editGroupData, setEditGroupData] = useState(null);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  
  // Form states for edit group
  const [editGroupName, setEditGroupName] = useState("");
  const [editGroupDescription, setEditGroupDescription] = useState("");
  const [editIsPrivate, setEditIsPrivate] = useState(false);
  
  // Form states for add member
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  // Mutations
  const getGroupMutation = useMutation(getGroupById, {
    onSuccess: (data) => {
      const groupData = data?.data?.data;
      setGroupData(groupData);
      setEditGroupName(groupData?.name || "");
      setEditGroupDescription(groupData?.description || "");
      setEditIsPrivate(groupData?.isPrivate || false);
      setEditGroupData(groupData);
      setLoading(false);
    },
    onError: (error) => {
      toast.error("Failed to load group details");
      console.error("Error loading group:", error);
      setLoading(false);
    },
  });

  const addMemberMutation = useMutation(addMemberToGroup, {
    onSuccess: (data) => {
      toast.success(data?.data?.data?.message || "Member added successfully!");
      
      // Clear all modal state
      setOpenAddMember(false);
      setSelectedUsers([]);
      setSearchQuery("");
      setAvailableUsers([]);
      setSearchLoading(false);
      
      // Refresh group data
      getGroupMutation.mutate(groupId);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to add member");
    },
  });

  const removeMemberMutation = useMutation(removeMemberFromGroup, {
    onSuccess: (data) => {
      toast.success(data?.data?.data?.message || "Member removed successfully!");
      getGroupMutation.mutate(groupId);
      
      // Refresh available connections list if Add Member modal is open and there's an active search
      if (openAddMember && searchQuery.trim() !== "") {
        getAllConnections(null, searchQuery, 0, 20, groupId)
          .then((res) => {
            setAvailableUsers(res?.data?.data?.connections || []);
          })
          .catch((err) => {
            console.error("Connection search error:", err);
          });
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to remove member");
    },
  });



  const deleteGroupMutation = useMutation(deleteGroup, {
    onSuccess: (data) => {
      toast.success(data?.data?.data?.message || "Group deleted successfully!");
      navigate("/groups");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete group");
    },
  });

  const leaveGroupMutation = useMutation(leaveGroup, {
    onSuccess: (data) => {
      toast.success(data?.data?.data?.message || "Left group successfully!");
      navigate("/groups");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to leave group");
    },
  });

  useEffect(() => {
    if (groupId) {
      getGroupMutation.mutate(groupId);
    }
  }, [groupId]);

  // Debounced connection search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setAvailableUsers([]);
      return;
    }

    if (debounceTimeout) clearTimeout(debounceTimeout);

    const timeout = setTimeout(() => {
      setSearchLoading(true);
      // Use connections API with excludeGroupId to filter out existing members
      getAllConnections(null, searchQuery, 0, 20, groupId)
        .then((res) => {
          console.log(res, "Connection Search Results");
          setAvailableUsers(res?.data?.data?.connections || []);
        })
        .catch((err) => {
          console.error("Connection search error:", err);
          toast.error(err?.response?.data?.message || "Failed to search connections");
        })
        .finally(() => {
          setSearchLoading(false);
        });
    }, 500);

    setDebounceTimeout(timeout);
  }, [searchQuery, groupId]);

  const handleAddMember = () => {
    if (selectedUsers.length === 0) {
      toast.error("Please select at least one member");
      return;
    }

    const memberData = {
      groupId: parseInt(groupId),
      userIds: selectedUsers,
      role: "member"
    };

    addMemberMutation.mutate(memberData);
  };

  const handleRemoveMember = (userId) => {
    const removeData = {
      groupId: groupId,
      userId: userId.toString()
    };

    removeMemberMutation.mutate(removeData);
  };



  const handleDeleteGroup = () => {
    deleteGroupMutation.mutate(groupId);
  };

  const handleLeaveGroup = () => {
    const leaveData = {
      groupId: groupId
    };

    leaveGroupMutation.mutate(leaveData);
  };

  const handleCloseAddMemberModal = () => {
    setOpenAddMember(false);
    setSearchQuery("");
    setSelectedUsers([]);
    setAvailableUsers([]);
    setSearchLoading(false);
    
    // Clear any pending debounce timeout
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
      setDebounceTimeout(null);
    }
  };

  const isGroupOwner = groupData?.createdById === userData?.user?.id;
  const isGroupMember = groupData?.members?.some(member => member.userId === userData?.user?.id);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
        <CircularProgress />
      </div>
    );
  }

  if (!groupData) {
    return (
      <div className="text-center py-5">
        <h4>Group not found</h4>
        <Button onClick={() => navigate("/groups")} variant="contained">
          Back to Groups
        </Button>
      </div>
    );
  }

  return (
    <section className="main_wrapper py-5">
      <div className="container">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <Button 
                  onClick={() => navigate("/groups")}
                  startIcon={<MdArrowBack />}
                  style={{ marginRight: "16px" }}
                >
                  Back
                </Button>
                <h3 className="mb-0">{groupData.name}</h3>
              </div>
              
              <div className="d-flex gap-2">
                {isGroupOwner && (
                  <>
                    <Button
                      variant="outlined"
                      startIcon={<MdEdit />}
                      onClick={() => setOpenEditGroup(true)}
                    >
                      Edit Group
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<MdDelete />}
                      onClick={() => setOpenDeleteConfirm(true)}
                    >
                      Delete Group
                    </Button>
                  </>
                )}
                
                {isGroupMember && !isGroupOwner && (
                  <Button
                    variant="outlined"
                    color="warning"
                    onClick={handleLeaveGroup}
                  >
                    Leave Group
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Group Info */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="user-connection-card">
              <div className="d-flex align-items-center mb-3">
                {groupData.imageUrl ? (
                  <img 
                    src={`https://feedbackwork.net/feedbackapi/${groupData.imageUrl}`}
                    alt={groupData.name}
                    style={{ width: "80px", height: "80px", borderRadius: "50%", marginRight: "16px", objectFit: "cover" }}
                  />
                ) : (
                  <Avatar 
                    sx={{ width: 80, height: 80, marginRight: "16px", bgcolor: "primary.main" }}
                  >
                    {getInitials(groupData.name)}
                  </Avatar>
                )}
                
                <div>
                  <h4 className="mb-1">{groupData.name}</h4>
                  <p className="text-muted mb-1">{groupData.description}</p>
                  <Badge 
                    bg={groupData.isPrivate ? "warning" : "success"}
                    className="me-2"
                  >
                    {groupData.isPrivate ? "Private" : "Public"}
                  </Badge>
                  <Badge bg="info">
                    {groupData.groupType}
                  </Badge>
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-3">
                  <div className="text-center">
                    <h5 className="mb-0">{groupData.members?.length || 0}</h5>
                    <small className="text-muted">Members</small>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="text-center">
                    <h5 className="mb-0">{groupData.createdAt ? new Date(groupData.createdAt).toLocaleDateString() : "N/A"}</h5>
                    <small className="text-muted">Created</small>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="text-center">
                    <h5 className="mb-0">{groupData.createdBy?.name || "Unknown"}</h5>
                    <small className="text-muted">Created By</small>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="text-center">
                    <h5 className="mb-0">{groupData.projects?.length || 0}</h5>
                    <small className="text-muted">Projects</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Members Section */}
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4>Members ({groupData.members?.length || 0})</h4>
              {isGroupOwner && (
                <Button
                  variant="contained"
                  startIcon={<MdAdd />}
                  onClick={() => setOpenAddMember(true)}
                >
                  Add Member
                </Button>
              )}
            </div>

            <div className="row">
              {groupData.members?.map((member, index) => (
                <div key={member.id || index} className="col-md-6 col-lg-4 mb-3">
                  <div className="user-connection-card">
                    <div className="d-flex align-items-center">
                      <Avatar 
                        sx={{ width: 50, height: 50, marginRight: "12px" }}
                      >
                        {getInitials(member.user?.firstname, member.user?.lastname)}
                      </Avatar>
                      
                      <div className="flex-grow-1">
                        <h6 className="mb-1">
                          {member.userId === userData?.user?.id ? "You" : `${member.user?.firstname} ${member.user?.lastname}`}
                        </h6>
                        <small className="text-muted">{member.role}</small>
                      </div>
                      
                      {isGroupOwner && member.userId !== userData?.user?.id && (
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleRemoveMember(member.userId)}
                        >
                          <FaTimes />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {(!groupData.members || groupData.members.length === 0) && (
                <div className="col-12 text-center py-4">
                  <p className="text-muted">No members in this group</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      <Modal
        open={openAddMember}
        onClose={handleCloseAddMemberModal}
        aria-labelledby="add-member-modal"
      >
        <Box sx={style}>
          <h3 className="mb-4">Add Member</h3>
          
          <div className="form-group mb-3">
            <label className="auth-label">Search Your Connections</label>
            <div className="authInputWrap d-flex align-items-center ps-3">
              <IoIosSearch className="connection-search-icon" />
              <input
                type="text"
                className="form-control auth-input"
                placeholder="Search your connections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-3">
            <h6>Available Connections</h6>
            <div className="max-h-60 overflow-auto">
              {searchLoading ? (
                <div className="text-center py-3">
                  <CircularProgress size={24} />
                  <p className="mt-2">Searching connections...</p>
                </div>
              ) : searchQuery.trim() === "" ? (
                <p className="text-muted text-center py-3">Type to search for your connections</p>
              ) : availableUsers.length === 0 ? (
                <p className="text-muted text-center py-3">No connections found</p>
              ) : (
                availableUsers.map((connection) => {
                  // Handle connection structure - user data is nested under connection.user
                  const user = connection.user || connection;
                  return (
                    <div key={user.id} className="d-flex align-items-center p-2 border-bottom">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, user.id]);
                          } else {
                            setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                          }
                        }}
                        className="me-2"
                      />
                      <Avatar sx={{ width: 32, height: 32, marginRight: "8px" }}>
                        {getInitials(user.firstname, user.lastname)}
                      </Avatar>
                      <span>{user.firstname} {user.lastname}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <Button onClick={handleCloseAddMemberModal}>
              Cancel
            </Button>
            <Button 
              variant="contained"
              onClick={handleAddMember}
              disabled={addMemberMutation.isLoading}
            >
              {addMemberMutation.isLoading ? <CircularProgress size={20} /> : "Add Member"}
            </Button>
          </div>
        </Box>
      </Modal>

      {/* Edit Group Modal */}
      <NormalGroupModal 
        open={openEditGroup} 
        onClose={() => setOpenEditGroup(false)} 
        onGroupCreated={() => {
          setOpenEditGroup(false);
          getGroupMutation.mutate(groupId);
        }}
        editMode={true}
        groupData={editGroupData}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        open={openDeleteConfirm}
        onClose={() => setOpenDeleteConfirm(false)}
        aria-labelledby="delete-confirmation-modal"
      >
        <Box sx={style}>
          <h3 className="mb-4 text-danger">Delete Group</h3>
          
          <p>Are you sure you want to delete "{groupData.name}"? This action cannot be undone.</p>
          
          <div className="d-flex justify-content-end gap-2">
            <Button onClick={() => setOpenDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button 
              variant="contained"
              color="error"
              onClick={handleDeleteGroup}
              disabled={deleteGroupMutation.isLoading}
            >
              {deleteGroupMutation.isLoading ? <CircularProgress size={20} /> : "Delete Group"}
            </Button>
          </div>
        </Box>
      </Modal>
    </section>
  );
} 