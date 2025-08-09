import React from "react";
import NetworkProfile from "../../assets/images/network-profile.png";
import { GoDotFill } from "react-icons/go";
import { useNavigate } from "react-router-dom";

function feedbackReceivedGrid() {
  const navigate = useNavigate();

  return (
    <div className="fb-card-wrap">
      <div className="fb-requested-top-wrap d-flex justify-content-between align-items-center mb-3">
        <div>
          <h6 className="mb-0">FeedBack Received</h6>
        </div>
        <div className="d-flex align-items-center">
          <p className="mb-0 me-2">2:41 PM</p>
        </div>
      </div>
      <div className="fb-center-padding">
        <div className="fb-requested-img-wrap d-flex w-100">
          <div className="fb-request-card-img mb-3 fb-requested-left text-center">
            <img src={NetworkProfile} alt="" className="mb-2" />
            <h6>Janet Rose</h6>
          </div>
          <div className="fb-requested-right ps-3 mb-3">
            <p className="mb-0">
              Total Feedback Provided <span className="text-primary">20</span>
            </p>
            <p className="mb-0">
              Total Feedback Applied <span className="text-primary">10</span>
            </p>
            <p className="mb-0">
              Total Problem Solved <span className="text-success">5</span>
            </p>
            <p className="mb-0">
              Total Problems Help Solution{" "}
              <span className="text-success">10</span>
            </p>
          </div>
        </div>

        <div className="text-center fb-need-text">
          <p>
            Lorem ipLorem ipsum dolor sit amet, consectetur adipiscing elit, sed
            do eiusmod tempor incididunt ut labore et dolore magna aliqua.sum
          </p>
        </div>

        <div className="connection-card-btns">
          <div className="d-flex mb-2">
            <button
              className="btn btn-success me-2"
              onClick={() => navigate("/feedback-received-model")}
            >
              Accept
            </button>
            <button className="btn btn-danger ms-2">Decline</button>
          </div>
          <button
            className="btn btn-primary connection-request mb-2"
            onClick={() => navigate("/feedback-received-model")}
          >
            Apply Feedback
          </button>
        </div>
      </div>
    </div>
  );
}

export default feedbackReceivedGrid;
