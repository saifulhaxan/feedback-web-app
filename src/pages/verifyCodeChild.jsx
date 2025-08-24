import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthImage from "../assets/images/auth-img.png";
import VerifyCode from "../components/auth/VerifyCode";
import { checkOtp, sendOtp, verifyOtp } from "../api/authApi";
import { sendChildOtp } from "../api/childApi";
import { useMutation } from "@tanstack/react-query";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import useUserStore from "../store/useUserStore";
import useForgotPasswordStore from "../store/forgotPasswordStore";
import Fetcher from "../library/Fetcher";

function VerifyCodeChild() {
    const [otp, setOtp] = useState(["", "", "", ""]);
    const inputs = useRef([]);
    const [timer, setTimer] = useState(60);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    let token = null;

    token = localStorage.getItem("access_token");

    const navigate = useNavigate();
    const location = useLocation();

    // Get childId and email from navigation state or user store
    const { childId: storeChildId, email: storeEmail } = useUserStore();
    const { childId: stateChildId, email: stateEmail } = location.state || {};
    
    const childId = stateChildId || storeChildId;
    const email = stateEmail || storeEmail;
    
    console.log('dataChild', childId, email); 

    const setIsForgotPassword = useForgotPasswordStore(
        (state) => state.setIsForgotPassword
    );



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

    const [otpData, setOtpData] = useState({
        email: email,
        otp: '', 
        childId: childId
    })

    // Resend OTP functionality
    const [canResend, setCanResend] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);

    const handleResendOtp = async () => {
        if (!canResend || resendLoading) return;
        
        setResendLoading(true);
        try {
            await sendChildOtp({ childId, email });
            toast.success("OTP sent successfully!");
            setTimer(60);
            setIsTimerRunning(true);
            setCanResend(false);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to send OTP");
        } finally {
            setResendLoading(false);
        }
    };

    // Initialize timer on component mount
    useEffect(() => {
        if (childId && email) {
            setTimer(60);
            setIsTimerRunning(true);
        }
    }, [childId, email]);

    // Timer effect for resend functionality
    useEffect(() => {
        let interval = null;
        if (isTimerRunning && timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => {
                    if (prevTimer <= 1) {
                        setIsTimerRunning(false);
                        setCanResend(true);
                        return 0;
                    }
                    return prevTimer - 1;
                });
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isTimerRunning, timer]);


    const handleVerifiedData = async () => {
        try {
            const response = await Fetcher.post("/user/child/verify-email", otpData);
            console.log("✅ API Success:", response.data);
            toast.success(response.data?.data?.data?.message || "OTP Verified!");
            navigate('/manage-relation?tab=children')

        } catch (error) {
            console.error("❌ API Error:", error);
        }
    }

    // Handle OTP verification
    const handleVerify = () => {
        const code = otp.join("");
        console.log(`OTP Entered: ${code}`); // Replace with your verification logic
        console.log('otpDD', otpData)
        setOtpData({
            ...otpData,
            otp: code
        })
        // navigate("/projects");

    };


    useEffect(() => {
        console.log('otpDD', otpData)
        if (otpData?.email && otpData?.otp && otpData?.childId) {
            handleVerifiedData()
        }
    }, [otpData])

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault(); // prevent default paste behavior
        const pasteData = e.clipboardData.getData("text").trim();
        if (pasteData.length === 6) {
            const pasteArray = pasteData.split("");
            setOtp(pasteArray);

            // Focus the last input
            if (inputs.current[5]) {
                inputs.current[5].focus();
            }
        }
    };



    // Check if we have the required data
    if (!childId || !email) {
        return (
            <div className="container-fluid ps-0">
                <div className="row justify-content-center">
                    <div className="col-lg-6">
                        <div className="authForm-wrapper">
                            <div className="auth-text text-center mb-4">
                                <h1>Missing Data</h1>
                                <p>Child ID or email not found. Please go back and try again.</p>
                                <button 
                                    className="btn btn-primary" 
                                    onClick={() => navigate('/manage-relation')}
                                >
                                    Go Back
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid ps-0">
            <div className="row justify-content-center">
                <div className="col-lg-6">
                    <div className="authForm-wrapper">
                        <div className="auth-text text-center mb-4">
                            <h1>Enter Verification Code</h1>
                            <p>
                                We sent a verification code to {email}, please enter it below
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
                                    otp.some((digit) => digit.trim() === "")
                                    //   verifyOtpMutation.isLoading
                                }
                            >
                                {/* {verifyOtpMutation.isLoading ? (
                  <CircularProgress size={20} style={{ color: "#fff" }} />
                ) : (
                  "Confirm Code"
                )} */}
                                Confirm Code
                            </button>

                            {/* Resend OTP Section */}
                            <div className="text-center mt-3">
                                {isTimerRunning ? (
                                    <p className="text-muted">
                                        Resend code in {timer} seconds
                                    </p>
                                ) : (
                                    <button
                                        type="button"
                                        className="btn btn-link text-primary"
                                        onClick={handleResendOtp}
                                        disabled={resendLoading}
                                    >
                                        {resendLoading ? (
                                            <>
                                                <CircularProgress size={16} style={{ color: "#007bff", marginRight: "8px" }} />
                                                Sending...
                                            </>
                                        ) : (
                                            "Resend Code"
                                        )}
                                    </button>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VerifyCodeChild;
