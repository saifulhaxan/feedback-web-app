import React from "react";
import NetworkProfile from "../../assets/images/network-profile.png";
import { GoDotFill } from "react-icons/go";

function NetworkSuggestionsCardList(props) {
  const { name, occupation, subject, feedbackProvided, feedbackSolved, image, id } =
    props.item;
  const { onProfileClick } = props;

  return (
    <div className="connection-card-wrapper d-flex justify-content-between align-items-center">;
      <div className="d-flex align-items-center">
        <div className="connection-card-img me-3">
          <img 
            src={NetworkProfile} 
            alt="" 
            style={{ cursor: "pointer" }}
            onClick={() => onProfileClick?.(id)}
          />
        </div>

        <div>
          <div className="connection-card-heading mb-1">
            <h4 className="mb-0">{name}</h4>
            <p className="mb-0">
              <span className="me-1">{occupation}</span>
              <span className="me-1 connection-dot">
                <GoDotFill />
              </span>
              <span>{subject}</span>
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
        <button className="btn connection-connect-as mb-0">Connect</button>
      </div>
    </div>
  );
}

export default NetworkSuggestionsCardList;
