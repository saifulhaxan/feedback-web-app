import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { forgotPassword } from "../api/authApi"; // 👈 your forgot password API
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";

import AuthImage from "../assets/images/auth-img.png";
import { MdOutlineEmail } from "react-icons/md";
import { forgotPassword } from "../api/authApi";
import useForgotPasswordStore from "../store/forgotPasswordStore";
import Fetcher from "../library/Fetcher";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const setIsForgotPassword = useForgotPasswordStore(
    (state) => state.setIsForgotPassword
  );

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevents the form from reloading the page
    console.log("Form submitted!");

    const errors = {};
    if (!email) errors.email = "Email is required";

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    const formData = {
      email: email.trim(),
    };

    // 🔥 Now hit the forgot password mutation
    forgotPasswordMutation.mutate(formData);
  };

  // ✅ Forgot Password API Mutation
  const forgotPasswordMutation = useMutation(forgotPassword, {
    onSuccess: (data) => {
      console.log("✅ Forgot Password Response:", data);

      if (data?.data?.data) {
        toast.success(data?.data?.data?.message || "Reset link sent to your email!", {});
        setEmail("");
        setFormErrors({});
      }
    },
    onError: (error) => {
      console.error(
        "❌ Forgot Password error:",
        error?.response?.data?.message
      );

      toast.error(
        error?.response?.data?.message || "Something went wrong!",
        {}
      );
    },
  });

  const handleChange = (e) => {
    const { value } = e.target;
    setEmail(value);
  };

  return (
    <div className="container-fluid ps-0">
      <div className="row">
        <div className="col-lg-6">
          <img src={AuthImage} alt="Forgot Password" className="auth-img" />
        </div>

        <div className="col-lg-6">
          <div className="authForm-wrapper">
            <div className="auth-text text-center mb-4">
              <h1>Enter Your Email</h1>
            </div>

            <form onSubmit={handleSubmit} className="mb-4 authForm">
              {/* Email Field */}
              <div className="form-group mb-3">
                <label htmlFor="resetPassword" className="auth-label">
                  Email
                </label>
                <div className="authInputWrap d-flex align-items-center ps-3">
                  <MdOutlineEmail className="auth-icon" />
                  <input
                    type="email"
                    className="form-control auth-input"
                    id="resetPassword"
                    name="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={handleChange}
                  />
                </div>
                {formErrors.email && (
                  <p className="text-danger mt-1">{formErrors.email}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary submit-btn"
                disabled={forgotPasswordMutation.isLoading}
              >
                {forgotPasswordMutation.isLoading ? (
                  <>
                    <CircularProgress
                      size={20}
                      style={{ color: "#fff" }}
                      className="me-2"
                    />
                    Sending...
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
