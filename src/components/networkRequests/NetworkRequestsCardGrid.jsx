import React, { useState } from "react";
import { GoDotFill } from "react-icons/go";
import { toast } from "react-toastify";
import { respondToConnectionRequest, cancelConnectionRequest } from "../../api/networkApi";

function NetworkRequestsCardGrid({ item, fetchRequests, fetchConnections, isSentRequest = false, onProfileClick }) {
  const [isAccepted, setIsAccepted] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  console.log(item, "request dataaa");

  // For received requests: show the sender (sentBy)
  // For sent requests: show the receiver (receivedBy)
  const userToShow = isSentRequest ? (item?.receivedBy || {}) : (item?.sentBy || {});
  const initials = `${userToShow.firstname?.charAt(0) || ""}${userToShow.lastname?.charAt(0) || ""}`.toUpperCase();

  const handleAccept = async () => {
    try {
      await respondToConnectionRequest(item.id, "accept");

      toast.success("Connection accepted!");
      setIsAccepted(true);

      // ✅ Trigger parent data refresh
      fetchRequests?.();
      fetchConnections?.();
    } catch (error) {
      toast.error("Failed to accept the request.");
      console.error(error);
    }
  };

  const handleDecline = async () => {
    try {
      await respondToConnectionRequest(item.id, "reject");

      toast.info("Connection declined.");
      // You might want to hide or disable the card here, or mark it declined

      // ✅ Trigger parent data refresh
      fetchRequests?.();
      fetchConnections?.();
    } catch (error) {
      toast.error("Failed to decline the request.");
      console.error(error);
    }
  };

  const handleCancel = async () => {
    try {
      await cancelConnectionRequest(item.id);

      toast.info("Connection request cancelled.");
      setIsCancelled(true);

      // ✅ Trigger parent data refresh
      fetchRequests?.();
      fetchConnections?.();
    } catch (error) {
      toast.error("Failed to cancel the request.");
      console.error(error);
    }
  };

  return (
    <div className="connection-card-wrapper text-center mb-3">
      <div className="connection-card-img mb-3">
        {userToShow.image ? (
          <img
            src={userToShow.image?.startsWith("http") ? userToShow.image : `https://feedbackwork.net/feedbackapi/${userToShow.image}`}
            alt={`${userToShow.firstname} ${userToShow.lastname}`}
            className="rounded-circle"
            style={{ width: 60, height: 60, objectFit: "cover", margin: "0 auto", cursor: "pointer" }}
            onClick={() => onProfileClick?.(userToShow.id)}
          />
        ) : (
          <div
            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
            style={{
              width: 60,
              height: 60,
              fontWeight: "bold",
              fontSize: "2rem",
              margin: "0 auto",
              cursor: "pointer",
            }}
            onClick={() => onProfileClick?.(userToShow.id)}
          >
            {initials}
          </div>
        )}
      </div>

      <div className="connection-card-heading">
        <h4>
          {userToShow.firstname} {userToShow.lastname}
        </h4>
        <p>
          <span className="me-1">{userToShow?.role?.name}</span>
          <span className="me-1 connection-dot">
            <GoDotFill />
          </span>
          <span>{userToShow.expertise}</span>
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
        {isSentRequest ? (
          // For sent requests: show cancel button
          isCancelled ? (
            <button className="btn btn-secondary" disabled>
              Cancelled
            </button>
          ) : (
            <button className="btn btn-outline-danger" onClick={handleCancel}>
              Cancel Request
            </button>
          )
        ) : (
          // For received requests: show accept/decline buttons
          isAccepted ? (
            <button className="btn btn-success" disabled>
              Accepted
            </button>
          ) : (
            <>
              <button className="btn btn-primary connection-request mb-2" onClick={handleAccept}>
                Accept
              </button>
              <button className="btn btn-outline-secondary" onClick={handleDecline}>
                Decline
              </button>
            </>
          )
        )}
      </div>
    </div>
  );
}

export default NetworkRequestsCardGrid;
