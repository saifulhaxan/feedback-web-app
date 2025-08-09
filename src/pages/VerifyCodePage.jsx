import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthImage from "../assets/images/auth-img.png";
import VerifyCode from "../components/auth/VerifyCode";
import { checkOtp, sendOtp, verifyOtp } from "../api/authApi";
import { useMutation } from "@tanstack/react-query";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import useUserStore from "../store/userStore";
import useForgotPasswordStore from "../store/forgotPasswordStore";

function VerifyCodePage() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputs = useRef([]);
  const [timer, setTimer] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUserData);
  const setIsForgotPassword = useForgotPasswordStore(
    (state) => state.setIsForgotPassword
  );
  const isForgotPassword = useForgotPasswordStore(
    (state) => state.isForgotPassword
  );

  console.log(isForgotPassword);

  useEffect(() => {
    let interval;

    // Only start timer if isForgotPassword is false
    if (isForgotPassword == false && timer > 0) {
      setIsTimerRunning(true);
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    if (timer <= 0) {
      setIsTimerRunning(false);
    }

    return () => clearInterval(interval);
  }, [timer, isForgotPassword]);

  useEffect(() => {
    if (isForgotPassword == false) {
      sendOtpMutation.mutate();
    }
  }, []);

  // Prevent browser back button on OTP page
  useEffect(() => {
    const handlePopState = (event) => {
      // Prevent going back to create profile page
      if (window.location.pathname === "/verify-otp") {
        // Push current state to prevent back navigation
        window.history.pushState(null, null, window.location.pathname);
        toast.warning("Please complete the OTP verification to proceed", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });
      }
    };

    // Add event listener for popstate (back button)
    window.addEventListener('popstate', handlePopState);
    
    // Push current state to prevent initial back navigation
    window.history.pushState(null, null, window.location.pathname);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleResendOtp = () => {
    if (isForgotPassword == false) {
      sendOtpMutation.mutate();
      setTimer(60); // restart timer
    }
  };

  // Send Otp to Email
  const sendOtpMutation = useMutation(sendOtp, {
    onSuccess: (data) => {
      console.log(data?.data?.status);
      if (data?.data) {
        toast.success("OTP send to your email", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });
        // No navigation needed since user is already on verify-otp page
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
      });
    },
  });

  // verify otp Request
  const verifyOtpMutation = useMutation(verifyOtp, {
    onSuccess: (data) => {
      console.log(data);
      if (data?.data?.data) {
        toast.success("Otp Verified", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });

        setUser({
          user: data?.data?.data?.user,
        });

        navigate("/complete-profile");
      }

      return;
    },
    onError: (error) => {
      // setLoading(false);
      console.log("error", error?.response?.data?.message);
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });
      }
    },
  });

  // verify otp Request
  const resetPasswordOtp = useMutation(checkOtp, {
    onSuccess: (data) => {
      console.log(data);
      if (data?.data?.data) {
        toast.success("Otp Verified", {});

        navigate("/forgot-password");
      }

      return;
    },
    onError: (error) => {
      // setLoading(false);
      console.log("error", error?.response?.data?.message);
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });
      }
    },
  });

  // Handle input change
  const handleChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus to the next input
    if (value && index < 3) {
      inputs.current[index + 1].focus();
    }
  };

  // Handle OTP verification
  const handleVerify = () => {
    const code = otp.join("");
    console.log(`OTP Entered: ${code}`); // Replace with your verification logic
    // navigate("/projects");

    if (isForgotPassword == true) {
      const resetPasswordEmail = localStorage.getItem("resetPasswordemail");
      const formData = {
        otp: code,
        email: resetPasswordEmail,
        type: "RESET_PASSWORD",
      };
      resetPasswordOtp.mutate(formData);
      localStorage.setItem("otp", code);
    } else {
      const formData = {
        otp: code,
      };
      verifyOtpMutation.mutate(formData);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault(); // prevent default paste behavior
    const pasteData = e.clipboardData.getData("text").trim();
    if (pasteData.length === 4) {
      const pasteArray = pasteData.split("");
      setOtp(pasteArray);

      // Focus the last input
      if (inputs.current[3]) {
        inputs.current[3].focus();
      }
    }
  };

  return (
    <div className="container-fluid ps-0">
      <div className="row">
        <div className="col-lg-6">
          <img src={AuthImage} alt="login" className="auth-img" />
        </div>

        <div className="col-lg-6">
          <div className="authForm-wrapper">
            <div className="auth-text text-center mb-4">
              <h1>Enter Verification Code</h1>
              <p>
                We sent a verification code to your phone, please enter it below
              </p>
            </div>

            <div className="authForm mb-4">
              <div className="d-flex justify-content-center mb-4 ">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    className="form-control otp-input mx-2"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    ref={(ref) => (inputs.current[index] = ref)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={(e) => handlePaste(e)}
                  />
                ))}
              </div>
              <button
                type="submit"
                className="btn btn-primary submit-btn"
                onClick={handleVerify}
                disabled={
                  otp.some((digit) => digit.trim() === "") ||
                  verifyOtpMutation.isLoading
                }
              >
                {verifyOtpMutation.isLoading ? (
                  <CircularProgress size={20} style={{ color: "#fff" }} />
                ) : (
                  "Confirm Code"
                )}
              </button>
              {isForgotPassword == false && (
                <div className="text-center mb-3">
                  {isTimerRunning ? (
                    <p>Please wait {timer} seconds to resend OTP</p>
                  ) : (
                    <button
                      className="btn btn-link"
                      onClick={handleResendOtp}
                      disabled={sendOtpMutation.isLoading}
                    >
                      {sendOtpMutation.isLoading ? "Sending..." : "Resend OTP"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyCodePage;
