import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, Avatar, Badge, Tabs, Tab } from "@mui/material";
import { MdArrowBack } from "react-icons/md";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import CircularProgress from "@mui/material/CircularProgress";
import { getGroupById } from "../api/groupsApi";
import useUserStore from "../store/userStore";
import MonitoringGroupProgress from "../components/monitoringGroup/MonitoringGroupProgress";

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

export default function MonitoringGroupDetailPage() {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const userData = useUserStore((state) => state.userData);

    const [groupData, setGroupData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0);

         // Mutations
     const getGroupMutation = useMutation(getGroupById, {
         onSuccess: (data) => {
             // Handle monitoring group data structure
             const groupData = data?.data?.monitoring?.[0] || data?.data?.data;
             console.log('Group data received:', groupData);
             console.log('Projects in group:', groupData?.projects);
             setGroupData(groupData);
             setLoading(false);
         },
         onError: (error) => {
             toast.error("Failed to load monitoring group details");
             console.error("Error loading group:", error);
             setLoading(false);
         },
     });

    useEffect(() => {
        if (groupId) {
            getGroupMutation.mutate(groupId);
        }
    }, [groupId]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
                <CircularProgress />
            </div>
        );
    }

    if (!groupData) {
        return (
            <div className="container-fluid ps-0">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="text-center">
                            <h1>Group Not Found</h1>
                            <p>The monitoring group you're looking for doesn't exist.</p>
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate('/groups')}
                            >
                                Back to Groups
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid ps-0">
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    {/* Header */}
                    <div className="d-flex align-items-center mb-4">
                        <Button
                            onClick={() => navigate('/groups?tab=monitoring')}
                            startIcon={<MdArrowBack />}
                            sx={{ textTransform: "none", color: "#666" }}
                        >
                            Back to Monitoring Groups
                        </Button>
                    </div>

                    {/* Group Info Card */}
                    <div className="card mb-4">
                        <div className="card-body">
                            <div className="row">
                                                                 <div className="col-md-3 text-center">
                                     {groupData.imageUrl || groupData.image ? (
                                         <img
                                             src={`https://feedbackwork.net/feedbackapi/${groupData.imageUrl || groupData.image}`}
                                             alt="Group"
                                             className="rounded-circle mb-3"
                                             style={{ width: 120, height: 120, objectFit: "cover" }}
                                             onError={(e) => {
                                                 e.target.style.display = 'none';
                                                 e.target.nextSibling.style.display = 'flex';
                                             }}
                                         />
                                     ) : null}
                                     <div
                                         className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold mb-3 mx-auto"
                                         style={{
                                             width: 120,
                                             height: 120,
                                             backgroundColor: '#007bff',
                                             fontSize: '48px',
                                             display: (groupData.imageUrl || groupData.image) ? 'none' : 'flex'
                                         }}
                                     >
                                         {groupData.name?.charAt(0)?.toUpperCase() || 'G'}
                                     </div>
                                 </div>
                                <div className="col-md-9">
                                    <h2 className="mb-3">{groupData.name}</h2>
                                    <p className="text-muted mb-3">{groupData.description || "No description available"}</p>

                                    <div className="row">
                                        <div className="col-md-4">
                                            <div className="text-center p-3 bg-light rounded">
                                                <h4 className="mb-1">{groupData.members?.length || 0}</h4>
                                                <small className="text-muted">Members</small>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="text-center p-3 bg-light rounded">
                                                <h4 className="mb-1">{groupData.projects?.length || 0}</h4>
                                                <small className="text-muted">Projects</small>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="text-center p-3 bg-light rounded">
                                                <h4 className="mb-1">Monitoring</h4>
                                                <small className="text-muted">Group Type</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                            <Tab label="Overview" />
                        </Tabs>
                    </Box>

                    {/* Tab Content */}
                    {activeTab === 0 && (
                        <>
                            {/* Projects Section */}
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="mb-0">Monitoring Projects</h4>
                                </div>
                                <div className="card-body">
                                    {groupData.projects && groupData.projects.length > 0 ? (
                                        <div className="row">
                                            {groupData.projects.map((project, index) => (
                                                <div key={index} className="col-md-6 mb-3">
                                                    <div className="card h-100">
                                                        <div className="card-body">
                                                            <h6 className="card-title">{project.name}</h6>
                                                            <p className="card-text text-muted small mb-2">
                                                                {project.problem}
                                                            </p>
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <span className={`badge ${project.status === "Completed" ? "bg-success" :
                                                                        project.status === "In Progress" ? "bg-warning" :
                                                                            project.status === "Not Started" ? "bg-secondary" : "bg-danger"
                                                                    }`}>
                                                                    {project.status}
                                                                </span>
                                                                <Button
                                                                    size="small"
                                                                    variant="outlined"
                                                                    onClick={() => {
                                                                        const projectId = project.id || project.projectId || project._id;
                                                                        if (projectId) {
                                                                            navigate(`/solution-function?projectId=${projectId}`);
                                                                        } else {
                                                                            console.error('Project ID not found:', project);
                                                                            toast.error('Project ID not available');
                                                                        }
                                                                    }}
                                                                >
                                                                    Monitor
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-4">
                                            <p className="text-muted">No projects are being monitored in this group.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Members Section */}
                            {groupData.members && groupData.members.length > 0 && (
                                <div className="card mt-4">
                                    <div className="card-header">
                                        <h4 className="mb-0">Group Members</h4>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            {groupData.members.map((member, index) => (
                                                <div key={index} className="col-md-4 mb-3">
                                                    <div className="d-flex align-items-center">
                                                        {member.image ? (
                                                            <img
                                                                src={`https://feedbackwork.net/feedbackapi/${member.image}`}
                                                                alt="Member"
                                                                className="rounded-circle me-3"
                                                                style={{ width: 50, height: 50, objectFit: "cover" }}
                                                            />
                                                        ) : (
                                                            <div
                                                                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3"
                                                                style={{
                                                                    width: 50,
                                                                    height: 50,
                                                                    backgroundColor: '#007bff'
                                                                }}
                                                            >
                                                                {getInitials(member.firstname, member.lastname)}
                                                            </div>
                                                        )}
                                                        <div>
                                                            <h6 className="mb-0">{member.firstname} {member.lastname}</h6>
                                                            <small className="text-muted">{member.title || "Member"}</small>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 1 && (
                        <MonitoringGroupProgress groupId={groupId} />
                    )}

                    {activeTab === 2 && (
                        <div className="card">
                            <div className="card-header">
                                <h4 className="mb-0">All Projects</h4>
                            </div>
                            <div className="card-body">
                                {groupData.projects && groupData.projects.length > 0 ? (
                                    <div className="row">
                                        {groupData.projects.map((project, index) => (
                                            <div key={index} className="col-md-6 mb-3">
                                                <div className="card h-100">
                                                    <div className="card-body">
                                                        <h6 className="card-title">{project.name}</h6>
                                                        <p className="card-text text-muted small mb-2">
                                                            {project.problem}
                                                        </p>
                                                        {/* Debug info - remove after fixing */}
                                                        <small className="text-muted d-block mb-2">
                                                            Debug: ID={project.id || project.projectId || project._id || 'undefined'} | 
                                                            Keys: {Object.keys(project).join(', ')}
                                                        </small>
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <span className={`badge ${project.status === "Completed" ? "bg-success" :
                                                                    project.status === "In Progress" ? "bg-warning" :
                                                                        project.status === "Not Started" ? "bg-secondary" : "bg-danger"
                                                                }`}>
                                                                {project.status}
                                                            </span>
                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                onClick={() => {
                                                                    const projectId = project.id || project.projectId || project._id;
                                                                    if (projectId) {
                                                                        navigate(`/solution-function?projectId=${projectId}`);
                                                                    } else {
                                                                        console.error('Project ID not found:', project);
                                                                        toast.error('Project ID not available');
                                                                    }
                                                                }}
                                                            >
                                                                Monitor
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <p className="text-muted">No projects are being monitored in this group.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 3 && (
                        <div className="card">
                            <div className="card-header">
                                <h4 className="mb-0">All Members</h4>
                            </div>
                            <div className="card-body">
                                {groupData.members && groupData.members.length > 0 ? (
                                    <div className="row">
                                        {groupData.members.map((member, index) => (
                                            <div key={index} className="col-md-4 mb-3">
                                                <div className="d-flex align-items-center">
                                                    {member.image ? (
                                                        <img
                                                            src={`https://feedbackwork.net/feedbackapi/${member.image}`}
                                                            alt="Member"
                                                            className="rounded-circle me-3"
                                                            style={{ width: 50, height: 50, objectFit: "cover" }}
                                                        />
                                                    ) : (
                                                        <div
                                                            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3"
                                                            style={{
                                                                width: 50,
                                                                height: 50,
                                                                backgroundColor: '#007bff'
                                                            }}
                                                        >
                                                            {getInitials(member.firstname, member.lastname)}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <h6 className="mb-0">{member.firstname} {member.lastname}</h6>
                                                        <small className="text-muted">{member.title || "Member"}</small>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <p className="text-muted">No members in this group.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 