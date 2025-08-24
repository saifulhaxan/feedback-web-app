import React, { useState } from "react";
import { GoDotFill } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { sendConnectionRequest } from "../../api/networkApi";
import useUserStore from "../../store/userStore";
import useTokenStore from "../../store/userToken";
import { toast } from "react-toastify";

function NetworkSuggestionsCardList(props) {
  const { firstname, lastname, title, expertise, feedbackProvided, feedbackSolved, id, image } =
    props.item.users[0];
  const { onProfileClick, onConnectResponse } = props;

  const { userData } = useUserStore();
  const { tokens } = useTokenStore();
  const userID = userData?.user?.id;

  const connectType = props?.item?.ConnectAs?.name;

  const navigate = useNavigate();

  // Get user ID from multiple sources
  const storeUserId = userID;
  const localStorageData = JSON.parse(localStorage.getItem('user-data-storage'));
  const localStorageUserId = localStorageData?.state?.userData?.user?.id;
  const tokenUserId = tokens?.user?.id;
  
  // Try to decode JWT token to get user ID
  let jwtUserId = null;
  try {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      const tokenParts = accessToken.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        jwtUserId = payload.userId || payload.sub || payload.id;
      }
    }
  } catch (error) {
    console.log("🔍 Debug - JWT decode failed:", error);
  }
  
  const currentUserId = storeUserId || localStorageUserId || tokenUserId || jwtUserId;

  const [connetData, setConnectData] = useState({
    requesterId: currentUserId,
    receiverId: id,
    connectAs: connectType
  })

  const initials = `${firstname?.charAt(0) || ""}${lastname?.charAt(0) || ""}`.toUpperCase();

  const handleConnect = async () => {
    try {
      const response = await sendConnectionRequest(connetData);
      console.log("✅ API Success:", response.data);
      toast.success(response.data?.data?.data?.message || "Connect Request Sent!");

      // 🚀 Send response to parent
      if (onConnectResponse) {
        onConnectResponse(response.data);
      }

    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send connection request");

      // Optionally send error to parent too
      if (onConnectResponse) {
        onConnectResponse({ error });
      }
    }
  };

  return (
    <div className="connection-card-wrapper d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center">
        <div className="connection-card-img me-3">
          {image ? (
            <img
              src={image?.startsWith("http") ? image : `https://feedbackwork.net/feedbackapi/${image}`}
              alt={`${firstname} ${lastname}`}
              className="rounded-circle"
              style={{ width: 60, height: 60, objectFit: "cover", cursor: "pointer" }}
              onClick={() => onProfileClick?.(id)}
            />
          ) : (
            <div
              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
              style={{
                width: 60,
                height: 60,
                fontSize: "1.2rem",
                fontWeight: "bold",
                cursor: "pointer",
              }}
              onClick={() => onProfileClick?.(id)}
            >
              {initials}
            </div>
          )}
        </div>

        <div>
          <div className="connection-card-heading mb-1">
            <h4 className="mb-0 text-capitalize">{firstname + ' ' + lastname}</h4>
            <p className="mb-0">
              <span className="me-1">{title}</span>
              <span className="me-1 connection-dot">
                <GoDotFill />
              </span>
              <span>{expertise}</span>
            </p>
          </div>

          <div className="connection-total-wrap d-flex justify-content-between">
            <div className="connection-total-main me-3 d-flex align-items-center">
              <p className="connection-total-points-blue connection-points mb-0 me-2">
                {feedbackProvided}
              </p>
              <p className="connection-total-points-text mb-0">
                Total Feedback Provided
              </p>
            </div>
            <div className="connection-total-main d-flex align-items-center">
              <p className="connection-total-points-green connection-points mb-0 me-2">
                {feedbackSolved}
              </p>
              <p className="connection-total-points-text mb-0">
                Total Problems Help Solved
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="connection-card-btns connection-card-btns-list">
        <button 
          className="btn connection-connect-as mb-0"
          onClick={() => handleConnect()}
        >
          Connect
        </button>
      </div>
    </div>
  );
}

export default NetworkSuggestionsCardList;
