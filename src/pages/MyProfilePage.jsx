import React from "react";
import UserConnectionImg from "../assets/images/user-connection.png";
import { GoDotFill } from "react-icons/go";
import { MdLock } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function MyProfilePage() {
  const navigate = useNavigate();

  return (
    <section className="main_wrapper">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="user-connection-wrapper">
              <div className="connection-card-img mb-3">
                <img src={UserConnectionImg} alt="" />
              </div>

              <div className="connection-card-heading">
                <h4>John Thompson</h4>
                <p className="mb-0">
                  <span className="me-1">Teacher</span>
                  <span className="me-1 connection-dot">
                    <GoDotFill />
                  </span>
                  <span>Methametics</span>
                </p>
              </div>
              <div className="user-connection-btns mt-3">
                <button className="btn connection-connect-as">
                  View Transaction History
                </button>
              </div>

              <div
                className="edit-profile-btn cursor-pointer"
                onClick={() => navigate("/edit-profile")}
              >
                <h6 className="text-secondary fw-bold">Edit Profile</h6>
              </div>
            </div>
          </div>
        </div>
        <div className="grid-eight-col mb-4">
          <div className="user-connection-card text-center">
            <p className="mb-0">
              <span className="text-success">$100.5</span>
            </p>
            <p className="mb-0">Total Earned</p>
          </div>

          <div className="user-connection-card text-center">
            <p className="mb-0">
              <span className="text-danger">$10.2K</span>
            </p>
            <p className="mb-0">Total Spent</p>
          </div>

          <div className="user-connection-card text-center">
            <p className="mb-0">
              <span className="text-success">20</span>
            </p>
            <p className="mb-0">Total Feedback Provided for free</p>
          </div>

          <div className="user-connection-card text-center">
            <p className="mb-0">
              <span className="text-primary">10</span>
            </p>
            <p className="mb-0">Total Feedback Accepted</p>
          </div>

          <div className="user-connection-card text-center">
            <p className="mb-0">
              <span className="text-danger">10</span>
            </p>
            <p className="mb-0">Total Feedback Declineed</p>
          </div>

          <div className="user-connection-card text-center">
            <p className="mb-0">
              <span className="text-primary">10</span>
            </p>
            <p className="mb-0">Total Feedback Applied</p>
          </div>

          <div className="user-connection-card text-center">
            <p className="mb-0">
              <span className="text-success">10</span>
            </p>
            <p className="mb-0">Total Problems Solved</p>
          </div>

          <div className="user-connection-card text-center">
            <p className="mb-0">
              <span className="text-success">10</span>
            </p>
            <p className="mb-0">Total Problems Help Solved</p>
          </div>
        </div>

        <div className="mb-3">
          <div className="user-connection-card text-center">
            <p className="mb-0">
              <span className="text-primary">10</span>
            </p>
            <p className="mb-0">Total</p>
          </div>
        </div>

        <div className="user-connection-privacy d-flex align-items-center pb-5">
          <MdLock className="me-1" />{" "}
          <p className="mb-0 fw-500">Feedback with connection only</p>
        </div>
      </div>
    </section>
  );
}
