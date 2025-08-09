import React from "react";
import { GoDotFill } from "react-icons/go";
import { useNavigate } from "react-router-dom";

function NetworkConnectionsCardList(props) {
  const navigate = useNavigate();
  const { item } = props;
  const sentBy = item?.sentBy || {};

  const initials = `${sentBy?.firstname?.charAt(0) || ""}${sentBy?.lastname?.charAt(0) || ""}`.toUpperCase();

  const handleRequestFeedback = () => {
    navigate("/request-feedback");
  };

  return (
    <div className="connection-card-wrapper d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center">
        <div className="connection-card-img me-3">
          {sentBy?.image ? (
            <img
              src={sentBy?.image}
              alt={`${sentBy?.firstname} ${sentBy?.lastname}`}
              className="rounded-circle"
              style={{ width: 60, height: 60, objectFit: "cover" }}
            />
          ) : (
            <div
              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
              style={{
                width: 60,
                height: 60,
                fontSize: "1.2rem",
                fontWeight: "bold",
              }}
            >
              {initials}
            </div>
          )}
        </div>

        <div>
          <div className="connection-card-heading mb-1">
            <h4 className="mb-0">
              {sentBy?.firstname} {sentBy?.lastname}
            </h4>
            <p className="mb-0">
              <span className="me-1">{sentBy?.title || "Occupation"}</span>
              <span className="me-1 connection-dot">
                <GoDotFill />
              </span>
              <span>{item?.subject || "Subject"}</span>
            </p>
          </div>

          <div className="connection-total-wrap d-flex justify-content-between">
            <div className="connection-total-main me-3 d-flex align-items-center">
              <p className="connection-total-points-blue connection-points mb-0 me-2">{item?.feedbackProvided || 0}</p>
              <p className="connection-total-points-text mb-0">Total Feedback Provided</p>
            </div>
            <div className="connection-total-main d-flex align-items-center">
              <p className="connection-total-points-green connection-points mb-0 me-2">{item?.feedbackSolved || 0}</p>
              <p className="connection-total-points-text mb-0">Total Problems Help Solved</p>
            </div>
          </div>
        </div>
      </div>

      <div className="connection-card-btns connection-card-btns-list">
        <button className="btn btn-primary connection-request mb-2" onClick={handleRequestFeedback}>
          Request Feedback
        </button>
        <button className="btn connection-connect-as mb-2">Connect As</button>
        <button className="btn btn-outline-secondary">Decline</button>
      </div>
    </div>
  );
}

export default NetworkConnectionsCardList;
