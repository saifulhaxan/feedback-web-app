import React from "react";
import AuthImage from "../assets/images/auth-img.png";

import { useNavigate } from "react-router-dom";
import ForgotPassword from "../components/auth/ForgotPassword";

function ForgotPasswordPage() {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevents the form from reloading the page
    console.log("Form submitted!");
    // Add your form submission logic here
    navigate("/");
  };

  return (
    <div className="container-fluid ps-0">
      <div className="row">
        <div className="col-lg-6">
          <img src={AuthImage} alt="login" className="auth-img" />
        </div>

        <div className="col-lg-6">
          <ForgotPassword handleSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
