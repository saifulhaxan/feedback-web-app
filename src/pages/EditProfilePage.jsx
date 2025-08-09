import React, { useState } from "react";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";
import MyProfileImage from "../assets/images/my-profile.jpeg";
import { MdModeEdit } from "react-icons/md";
import { FaCheck } from "react-icons/fa";

export default function EditProfilePage() {
  const [showLimit, setShowLimit] = useState(false);

  const navigate = useNavigate();

  const handleCheck = (name) => {
    if (name == "unlimited") {
      setShowLimit(false);
    } else {
      setShowLimit(true);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-lg-12">
          <div className="mb-4 my-profile-wrap mb-5">
            <div className="form-group mb-4 text-center">
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={
                  //   <SmallAvatar alt="Remy Sharp" src={MyProfileImage} />
                  <MdModeEdit className="profile-edit" />
                }
              >
                <Avatar
                  alt="Travis Howard"
                  src={MyProfileImage}
                  sx={{ width: 110, height: 110 }}
                />
              </Badge>
            </div>
            <div className="form-group mb-3">
              <label htmlFor="exampleInputFirstName" className="auth-label">
                First Name
              </label>
              <div className="authInputWrap d-flex align-items-center ps-3">
                <input
                  type="text"
                  className="form-control auth-input"
                  id="firstname"
                  placeholder="Enter First Name"
                />
              </div>
            </div>
            <div className="form-group mb-3">
              <label htmlFor="exampleInputLastName" className="auth-label">
                Last Name
              </label>

              <div className="authInputWrap d-flex align-items-center ps-3">
                <input
                  type="text"
                  className="form-control auth-input"
                  id="exampleInputLastName"
                  placeholder="Enter Last Name"
                />
              </div>
            </div>
            <div className="form-group mb-3">
              <label htmlFor="exampleInputEmail" className="auth-label">
                Email
              </label>

              <div className="authInputWrap d-flex align-items-center ps-3">
                <input
                  type="email"
                  className="form-control auth-input"
                  id="exampleInputEmail"
                  placeholder="Enter Email"
                />
              </div>
            </div>
            <div className="form-group mb-3">
              <label htmlFor="exampleInputUsername" className="auth-label">
                Username (Optional)
              </label>

              <div className="authInputWrap d-flex align-items-center ps-3">
                <input
                  type="text"
                  className="form-control auth-input"
                  id="exampleInputUsername"
                  placeholder="Enter Username"
                />
              </div>
            </div>
            <div className="form-group mb-3">
              <label htmlFor="exampleInputTile" className="auth-label">
                Title
              </label>

              <div className="authInputWrap d-flex align-items-center ps-3">
                <input
                  type="text"
                  className="form-control auth-input"
                  id="exampleInputTile"
                  placeholder="Enter Title"
                />
              </div>
            </div>
            <div className="form-group mb-3">
              <label htmlFor="exampleInputExpertise" className="auth-label">
                Expertise
              </label>

              <div className="authInputWrap d-flex align-items-center ps-3">
                <input
                  type="text"
                  className="form-control auth-input"
                  id="exampleInputExpertise"
                  placeholder="Enter Expertise"
                />
              </div>
            </div>
            <div className="form-group mb-3">
              <label htmlFor="exampleInputExpertise" className="auth-label">
                Feedback Request Limit
              </label>

              <div className="authInputWrap">
                <div
                  className="profile-limit profile-set-limit ps-3 pb-2 pt-1 pe-3 cursor-pointer"
                  onClick={() => handleCheck("unlimited")}
                >
                  <p className="mb-0 d-flex align-items-center justify-content-between">
                    Unlimited{" "}
                    <span>
                      {showLimit ? "" : <FaCheck className="text-primary" />}
                    </span>
                  </p>
                </div>
                <div
                  className="profile-limit set-limit ps-3 pb-2 pt-1 pe-3 cursor-pointer"
                  onClick={() => handleCheck("set")}
                >
                  <p className="mb-0 d-flex align-items-center justify-content-between">
                    Set Limit{" "}
                    <span>
                      {showLimit ? <FaCheck className="text-primary" /> : ""}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {showLimit && (
              <div className="form-group mb-3">
                <label htmlFor="exampleInputSetLimit" className="auth-label">
                  Enter Limit
                </label>

                <div className="authInputWrap d-flex align-items-center ps-3">
                  <input
                    type="number"
                    className="form-control auth-input"
                    id="exampleInputSetLimit"
                  />
                </div>
              </div>
            )}

            <div className="form-group mb-3">
              <label htmlFor="exampleInputParent" className="auth-label">
                Account Type
              </label>
              <div className="authInputWrap d-flex align-items-center">
                <select
                  className="form-select auth-input"
                  aria-label="Default select example"
                >
                  <option defaultValue>Select account type ...</option>
                  <option value="1">Regular</option>
                  <option value="2">Parent</option>
                  <option value="3">Manager</option>
                  <option value="4">Teacher</option>
                </select>
              </div>
            </div>

            <div className="connection-card-btns">
              <button
                className="btn connection-connect-as mb-4"
                onClick={() => navigate("/manage-relation")}
              >
                Manage Children
              </button>
              <button className="btn btn-primary connection-request mb-2 py-2">
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
