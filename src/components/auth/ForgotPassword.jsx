import React, { useState } from "react";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import { Button } from "@mui/material";
import { MdLockOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { resetPassword } from "../../api/authApi";
import useForgotPasswordStore from "../../store/forgotPasswordStore";

function ForgotPassword({ handleSubmit }) {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const clearIsForgotPassword = useForgotPasswordStore(
    (state) => state.clearIsForgotPassword
  );

  // Mutation
  const resetPasswordMutation = useMutation(resetPassword, {
    onSuccess: () => {
      toast.success("Password has been updated!");
      navigate("/"); // Redirect to login or home page
      clearIsForgotPassword();
      localStorage.clear();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });

  // Submit handler
  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!password || !confirmPassword) {
      toast.error("Both password fields are required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const email = localStorage.getItem("resetPasswordemail");
    const otp = localStorage.getItem("otp");
    // Call API
    resetPasswordMutation.mutate({
      password,
      email,
      otp,
    });
  };

  return (
    <div className="authForm-wrapper">
      <div className="auth-text text-center mb-4">
        <h1>Enter New Password</h1>
        <p>Set Complex passwords to protect</p>
      </div>

      <form onSubmit={handleFormSubmit} className="mb-4 authForm">
        <div className="form-group mb-3">
          <label htmlFor="resetPassword" className="auth-label">
            Password
          </label>
          <div className="authInputWrap d-flex align-items-center ps-3">
            <MdLockOutline className="reset-password-icon" />
            <input
              type={showPassword ? "text" : "password"}
              className="form-control auth-input"
              id="resetPassword"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              className="eye-btn me-2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </Button>
          </div>
        </div>

        <div className="form-group mb-3">
          <label htmlFor="confirmPassword" className="auth-label">
            Re Type Password
          </label>
          <div className="authInputWrap d-flex align-items-center ps-3">
            <MdLockOutline className="reset-password-icon" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="form-control auth-input"
              id="confirmPassword"
              placeholder="Enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              className="eye-btn me-2"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </Button>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary submit-btn"
          disabled={resetPasswordMutation.isLoading}
        >
          {resetPasswordMutation.isLoading ? "Updating..." : "Set New Password"}
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;
