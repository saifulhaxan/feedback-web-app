import React, { useState, useEffect } from "react";
import SolutionTimer from "../components/SolutionTimer/SolutionTimer";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { getProjectProgressDetail } from "../api/projectApi";

export default function SolutionFunctionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const projectId = params.get("projectId");
  const readOnly = params.get("readOnly") === "true";
  
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjectData = async () => {
      if (!projectId) return;
      
      try {
        setLoading(true);
        const response = await getProjectProgressDetail(projectId);
        const data = response?.data?.data || {};
        setProjectData(data);
      } catch (error) {
        console.error("Failed to load project data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProjectData();
  }, [projectId]);

  const getProjectStatusText = () => {
    if (!projectData) return "Loading...";
    
    if (projectData.isExpired) return "Expired";
    if (projectData.isCompleted) return "Completed";
    if (projectData.isPaused) return "Paused";
    if (projectData.isStarted) return "In Progress";
    return "Not Started";
  };

  const handleViewStatusReport = () => {
    navigate(`/status-report?projectId=${projectId}`);
  };

  if (loading) {
    return (
      <section>
        <div className="mt-5">
          <h3 className="text-center fw-bold">Loading Project...</h3>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4 px-4">
          <h3 className="text-center fw-bold mb-0">
            {projectData?.projectName || "Project"} Function Status
          </h3>
          <div className="d-flex gap-2">
            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={handleViewStatusReport}
            >
              View Status Report
            </Button>
          </div>
        </div>
        
        <div className="text-center mb-3">
          <span className="badge bg-primary fs-6">
            Status: {getProjectStatusText()}
          </span>
          {readOnly && (
            <span className="badge bg-secondary ms-2 fs-6">
              Read Only Mode
            </span>
          )}
        </div>
      </div>

      <div>
        <SolutionTimer 
          projectId={projectId} 
          readOnly={readOnly}
          projectData={projectData}
        />
      </div>
    </section>
  );
}
