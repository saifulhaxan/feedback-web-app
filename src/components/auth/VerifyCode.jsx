import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function VerifyCode() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputs = useRef([]);

  const navigate = useNavigate();

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
    navigate("/projects");
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  return (
    <div className="authForm-wrapper">
      <div className="auth-text text-center mb-4">
        <h1>Enter Verification Code</h1>
        <p>We sent a verification code to your phone, please enter it below</p>
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
            />
          ))}
        </div>
        <button
          type="submit"
          className="btn btn-primary submit-btn"
          onClick={handleVerify}
        >
          Confirm Code
        </button>
      </div>
    </div>
  );
}

export default VerifyCode;
