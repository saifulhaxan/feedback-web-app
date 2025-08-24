import React from "react";
import { GoDotFill } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { deleteConnection } from "../../api/networkApi";
import { toast } from "react-toastify";

function NetworkConnectionsCardList(props) {
  const navigate = useNavigate();
  const { item, onApiResponse } = props;
  const sentBy = item?.user || item?.sentBy || {};

  const initials = `${sentBy?.firstname?.charAt(0) || ""}${sentBy?.lastname?.charAt(0) || ""}`.toUpperCase();

  const handleRequestFeedback = () => {
    navigate("/request-feedback");
  };

  const handleDisconnect = async () => {
    if (!item?.id) {
      toast.error("Connection ID not found");
      return;
    }

    try {
      await deleteConnection(item.id);
      toast.success("Connection removed successfully");
      
      // Trigger parent data refresh
      if (onApiResponse) {
        onApiResponse({ success: true }, "connection_deleted");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to remove connection");
    }
  };

  return (
    <div className="connection-card-wrapper d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center">
        <div className="connection-card-img me-3">
          {sentBy?.image ? (
            <img
              src={sentBy?.image?.startsWith("http") ? sentBy?.image : `https://feedbackwork.net/feedbackapi/${sentBy?.image}`}
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
              <span>{item?.subject || sentBy?.expertise || "Subject"}</span>
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
        <button className="btn btn-outline-danger" onClick={handleDisconnect}>
          Disconnect
        </button>
      </div>
    </div>
  );
}

export default NetworkConnectionsCardList;
