import React from "react";
import NetworkProfile from "../../assets/images/network-profile.png";
import { GoDotFill } from "react-icons/go";
import { useNavigate } from "react-router-dom";

function NetworkConnectionsCardGrid(props) {
  const navigate = useNavigate();
  const { item, onProfileClick } = props;
  const sentBy = item || {};

  const initials = `${sentBy?.firstname?.charAt(0) || ""}${sentBy?.lastname?.charAt(0) || ""}`.toUpperCase();

  const handleRequestFeedback = () => {
    navigate("/request-feedback");
  };

  return (
    <div className="connection-card-wrapper text-center mb-3">
      <div className="connection-card-img mb-3">
        {sentBy?.user?.image ? (
          <img
            src={sentBy?.user?.image?.startsWith("http") ? sentBy?.user?.image : `https://feedbackwork.net/feedbackapi/${sentBy?.user?.image}`}
            alt={`${sentBy.firstname} ${sentBy.lastname}`}
            className="rounded-circle"
            style={{ width: 60, height: 60, objectFit: "cover", margin: "0 auto", cursor: "pointer" }}
            onClick={() => onProfileClick?.(sentBy?.user?.id)}
          />
        ) : (
          <div
            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
            style={{
              width: 60,
              height: 60,
              fontSize: "1.5rem",
              fontWeight: "bold",
              margin: "0 auto",
              cursor: "pointer",
            }}
            onClick={() => onProfileClick?.(sentBy?.user?.id)}
          >
            {initials}
          </div>
        )}
      </div>

      <div className="connection-card-heading">
        <h4>
          {sentBy?.user?.firstname} {sentBy?.user?.lastname}
        </h4>
        <p>
          <span className="me-1">{sentBy?.user?.title}</span>
          <span className="me-1 connection-dot">
            <GoDotFill />
          </span>
          <span>{sentBy?.user?.expertise}</span>
        </p>
      </div>

      <div className="connection-total-wrap d-flex justify-content-between">
        <div className="connection-total-main">
          <p className="connection-total-points-blue connection-points mb-0">20</p>
          <p className="connection-total-points-text">Total Feedback Provided</p>
        </div>
        <div className="connection-total-main">
          <p className="connection-total-points-green connection-points mb-0">20</p>
          <p className="connection-total-points-text">Total Problems Help Solved</p>
        </div>
      </div>

      <div className="connection-card-btns">
        <button className="btn btn-primary connection-request" onClick={handleRequestFeedback}>
          Request Feedback
        </button>
        {/* <button className="btn connection-connect-as mb-2">Connect As</button>
        <button className="btn btn-outline-secondary">Decline</button> */}
      </div>
    </div>
  );
}

export default NetworkConnectionsCardGrid;
