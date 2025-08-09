import React, { useState } from "react";

import { Button, Card, Collapse } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const StatusCard = (props) => {
  const {
    problemExistedBefore,
    projectStatus,
    solutionFunction,
    solutionReplaceAfter,
    title,
  } = props.item;

  const navigate = useNavigate();
  return (
    <Card
      className="mb-3"
      onClick={() => navigate("/status-report-submission")}
    >
      <Card.Body className="projectCard-body">
        {/* Card Header */}
        <div className="d-flex justify-content-between align-items-center projectCard-heading px-2 py-2">
          <div className="projectCard-head">
            <h6 className="mb-0 statusHeading">{title}</h6>
          </div>
        </div>

        {/* Default Content (Always Visible) */}
        <div className="px-2 py-2 pc-first-expand">
          <p className="mb-1">
            Problem Existed Before:{" "}
            <span className="pc-danger ms-1">{problemExistedBefore}</span>
          </p>
          <p className="mb-1">
            Solution Replaced After:{" "}
            <span className="pc-success ms-1">{solutionReplaceAfter}</span>
          </p>
          <p className="mb-1">
            Solution Function Executed:{" "}
            <span className="pc-success ms-1">{solutionFunction}</span>
          </p>
          <p className="mb-1">
            Project Status:{" "}
            <span className="text-primary ms-1">{projectStatus}</span>
          </p>
        </div>
      </Card.Body>
    </Card>
  );
};

export default StatusCard;
