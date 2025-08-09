import React, { useState } from "react";
import { GoDotFill } from "react-icons/go";
import { toast } from "react-toastify";
import { respondToConnectionRequest, cancelConnectionRequest } from "../../api/networkApi";

function NetworkRequestsCardList({ item, fetchRequests, fetchConnections, isSentRequest = false, onProfileClick }) {
  const [isAccepted, setIsAccepted] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

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
    <div className="connection-card-wrapper d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center">
        {userToShow.image ? (
          <img
            src={userToShow.image?.startsWith("http") ? userToShow.image : `https://feedbackwork.net/feedbackapi/${userToShow.image}`}
            alt={`${userToShow.firstname} ${userToShow.lastname}`}
            className="rounded-circle me-3"
            style={{ width: 50, height: 50, objectFit: "cover", cursor: "pointer" }}
            onClick={() => onProfileClick?.(userToShow.id)}
          />
        ) : (
          <div
            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
            style={{ width: 50, height: 50, fontWeight: "bold", cursor: "pointer" }}
            onClick={() => onProfileClick?.(userToShow.id)}
          >
            {initials}
          </div>
        )}
        <div>
          <h6 className="mb-1">
            {userToShow.firstname} {userToShow.lastname}
          </h6>
          <p className="mb-0 text-muted small">
            <span>{userToShow?.role?.name}</span>
            <span className="me-1 connection-dot">
              <GoDotFill />
            </span>
            <span>{userToShow.expertise}</span>
          </p>
        </div>
      </div>

      <div>
        {isSentRequest ? (
          // For sent requests: show cancel button
          isCancelled ? (
            <button className="btn btn-sm btn-secondary" disabled>
              Cancelled
            </button>
          ) : (
            <button className="btn btn-sm btn-outline-danger" onClick={handleCancel}>
              Cancel Request
            </button>
          )
        ) : (
          // For received requests: show accept/decline buttons
          isAccepted ? (
            <button className="btn btn-sm btn-success" disabled>
              Accepted
            </button>
          ) : (
            <>
              <button className="btn btn-sm btn-primary me-2" onClick={handleAccept}>
                Accept
              </button>
              <button className="btn btn-sm btn-outline-secondary" onClick={handleDecline}>
                Decline
              </button>
            </>
          )
        )}
      </div>
    </div>
  );
}

export default NetworkRequestsCardList;
