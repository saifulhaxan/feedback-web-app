import React from "react";
import UserConnectionImg from "../assets/images/user-connection.png";
import { GoDotFill } from "react-icons/go";
import { MdLock } from "react-icons/md";

export default function UserConnectionPage() {
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
                <button className="btn btn-primary me-2 px-4">Connect</button>
                <button className="btn btn-outline-primary">
                  Request Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="grid-eight-col mb-4">
          <div className="user-connection-card text-center">
            <p className="mb-0">
              <span className="text-primary">20</span>
            </p>
            <p className="mb-0">Total Feedback Provided</p>
          </div>

          <div className="user-connection-card text-center ">
            <p className="mb-0">
              <span className="text-primary">10</span>
            </p>
            <p className="mb-0">Total Feedback Applied</p>
          </div>

          <div className="user-connection-card text-center ">
            <p className="mb-0">
              <span className="text-primary">10</span>
            </p>
            <p className="mb-0">Total Feedback Requested</p>
          </div>

          <div className="user-connection-card text-center ">
            <p className="mb-0">
              <span className="text-success">10</span>
            </p>
            <p className="mb-0">Total Problems Help Solved</p>
          </div>

          <div className="user-connection-card text-center ">
            <p className="mb-0">
              <span className="text-success">10</span>
            </p>
            <p className="mb-0">Total Problems Solved</p>
          </div>

          <div className="user-connection-card text-center">
            <p className="mb-0">
              <span className="text-success">10</span>
            </p>
            <p className="mb-0">Total Projects Completed</p>
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
