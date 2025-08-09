import React from "react";
import NetworkProfile from "../../assets/images/network-profile.png";
import { GoDotFill } from "react-icons/go";

function FeedbackRequestedGrid() {
  return (
    <div className="connection-card-wrapper ">
      <div className="fb-requested-img-wrap d-flex w-100">
        <div className="fb-request-card-img mb-3 fb-requested-left text-center">
          <img src={NetworkProfile} alt="" className="mb-2" />
          <h6>John Thompson</h6>
        </div>
        <div className="fb-requested-right ps-3 mb-3">
          <p className="mb-0">
            Project <span>Floor Cleaning</span>
          </p>
          <p className="mb-0">
            Problem <span className="text-danger">Dirty Floor</span>
          </p>
          <p className="mb-0">
            Solution <span className="text-success">Clean Floor</span>
          </p>
          <p className="mb-0">
            Solution Function <span className="text-success">Mop Floor</span>
          </p>
        </div>
      </div>

      <div className="text-center fb-need-text">
        <h6 className="mb-1">Need help floor cleaning hard surface</h6>
        <p>
          Lorem ipLorem ipsum dolor sit amet, consectetur adipiscing elit, sed
          do eiusmod tempor incididunt ut labore et dolore magna aliqua.sum
        </p>
      </div>

      <div className="connection-card-btns">
        <button className="btn btn-primary connection-request mb-2">
          Provide Feedback
        </button>
        <button className="btn connection-connect-as mb-2">
          Provide Feedback From Model
        </button>
      </div>
    </div>
  );
}

export default FeedbackRequestedGrid;
