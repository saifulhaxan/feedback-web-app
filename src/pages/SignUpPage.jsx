import React, { useEffect, useState } from "react";
import AuthImage from "../assets/images/auth-img.png";
import GoogleIcon from "../assets/images/google.svg";
import { FaRegEyeSlash } from "react-icons/fa6";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FaApple } from "react-icons/fa";
import { register } from "../api/authApi";
import { useMutation } from "@tanstack/react-query";
import CircularProgress from "@mui/material/CircularProgress";
import { FaRegEye } from "react-icons/fa";
import Fetcher from "../library/Fetcher";
import { toast, ToastContainer } from "react-toastify";
import useUserStore from "../store/userStore";
import useTokenStore from "../store/userToken";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

function SignUpPage() {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState();
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  // const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const navigate = useNavigate();

  const setUser = useUserStore((state) => state.setUserData);
  const setToken = useTokenStore((state) => state.setTokens);

  const registerMutation = useMutation(register, {
    onSuccess: (data) => {
      console.log(data?.data);

      if (data?.data?.data?.tokens) {
        toast.success(data?.data?.data?.message || "User Registered Successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });
        setUser({
          user: data?.data?.data?.user,
        });
        setToken({
          tokens: data?.data?.data?.tokens?.access?.token,
        });

        localStorage.setItem("access_token", data?.data?.data?.tokens?.access?.token);
        Fetcher.axiosSetup.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem("access_token")}`;
        navigate("/verify-otp");
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

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevents the form from reloading the page
    // Basic validation
    const errors = {};
    if (!fname) errors.fname = "First name is required";
    if (!lname) errors.lname = "Last name is required";
    if (!email) errors.email = "Email is required";
    if (!phone) errors.phone = "Phone number is required";
    if (!password) errors.password = "Password is required";
    if (!rePassword) errors.rePassword = "Please re-enter password";
    if (password && rePassword && password !== rePassword) errors.rePassword = "Passwords do not match";

    setFormErrors(errors);

    // If there are errors, stop submission
    if (Object.keys(errors).length > 0) return;

    // If no errors, send form
    const formData = {
      email,
      password,
      firstname: fname,
      lastname: lname,
      phone,
    };

    registerMutation.mutate(formData);
    // Add your form submission logic here
  };

  const handleChange = (event) => {
    console.log(event.target.value);
    var name = event.target.name;
    if (name == "firstname") {
      setFname(event.target.value);
    } else if (name == "lastname") {
      setLname(event.target.value);
    } else if (name == "email") {
      setEmail(event.target.value);
    } else if (name == "password") {
      setPassword(event.target.value);
    } else if (name == "phone") {
      setPhone(event.target.value);
    } else if (name == "repassword") {
      setRePassword(event.target.value);
    }
  };

  return (
    <>
      {/* <ToastContainer /> */}

      <div className="container-fluid ps-0">
        <div className="row">
          <div className="col-lg-6">
            <img src={AuthImage} alt="login" className="auth-img" />
          </div>

          <div className="col-lg-6">
            <div className="auth-signup-wrapper">
              <div className="auth-text text-center mb-4">
                <h1>Create your account</h1>
                <p>Create account for Feedback Work</p>
              </div>

              <form onSubmit={handleSubmit} className="mb-4 authForm">
                <div className="form-group mb-3">
                  <label htmlFor="fname" className="auth-label">
                    First Name
                  </label>
                  <div className="authInputWrap d-flex align-items-center">
                    <input
                      type="text"
                      className="form-control auth-input"
                      id="fname"
                      value={fname}
                      name="firstname"
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                  {formErrors.fname && <p className="text-danger mt-1">{formErrors.fname}</p>}
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="lname" className="auth-label">
                    Last Name
                  </label>
                  <div className="authInputWrap d-flex align-items-center">
                    <input
                      type="text"
                      className="form-control auth-input"
                      id="lname"
                      name="lastname"
                      value={lname}
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                  {formErrors.lname && <p className="text-danger mt-1">{formErrors.lname}</p>}
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="email" className="auth-label">
                    Email
                  </label>

                  <div className="authInputWrap d-flex align-items-center">
                    <input type="email" className="form-control auth-input" id="email" name="email" value={email} onChange={(e) => handleChange(e)} />
                  </div>
                  {formErrors.email && <p className="text-danger mt-1">{formErrors.email}</p>}
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="pnum" className="auth-label">
                    Phone Number
                  </label>
                  <div className="authInputWrap d-flex align-items-center">
                    <PhoneInput
                      country={"us"}
                      inputProps={{
                        name: "phone",
                        required: true,
                        className: "form-control auth-input",
                      }}
                      containerClass="w-100"
                      inputClass="w-100"
                      buttonClass="bg-transparent"
                      value={phone}
                      onChange={(value) => setPhone(value)}
                    />
                  </div>
                  {formErrors.phone && <p className="text-danger mt-1">{formErrors.phone}</p>}
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="pass" className="auth-label">
                    Password
                  </label>

                  <div className="authInputWrap d-flex align-items-center pe-3">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control auth-input"
                      id="pass"
                      name="password"
                      value={password}
                      onChange={(e) => handleChange(e)}
                    />
                    <div className="eye-btn" type="button" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? (
                        <FaRegEye className="auth-eyeClosed" />
                      ) : (
                        <FaRegEyeSlash className="auth-eyeClosed" /> // You can use another icon like FaEye
                      )}
                    </div>
                  </div>
                </div>
                {formErrors.password && <p className="text-danger mt-1">{formErrors.password}</p>}
                <div className="form-group mb-3">
                  <label htmlFor="repass" className="auth-label">
                    Re-enter Password
                  </label>

                  <div className="authInputWrap d-flex align-items-center pe-3">
                    <input
                      type={showRePassword ? "text" : "password"}
                      className="form-control auth-input"
                      id="repass"
                      name="repassword"
                      value={rePassword}
                      onChange={(e) => handleChange(e)}
                    />
                    <div className="eye-btn" type="button" onClick={() => setShowRePassword(!showRePassword)}>
                      {showRePassword ? <FaRegEye className="auth-eyeClosed" /> : <FaRegEyeSlash className="auth-eyeClosed" />}
                    </div>
                  </div>
                </div>
                {formErrors.rePassword && <p className="text-danger mt-1">{formErrors.rePassword}</p>}
                <button
                  type="submit"
                  className="btn btn-primary submit-btn d-flex align-items-center justify-content-center"
                  disabled={registerMutation.isLoading}
                >
                  {registerMutation.isLoading ? <CircularProgress size={20} style={{ color: "#fff" }} /> : "Create Account"}
                </button>
              </form>

              <div className="noAccount mb-3">
                <p className="mb-0">
                  Have an account? <span onClick={() => navigate("/")}>Sign in here</span>
                </p>
              </div>

              {/* <div className="orHr">
                <p className="mb-0 text-center">Or</p>
              </div>
              <hr /> */}

              {/* <div className="socialbtn mb-4">
                <button className="d-flex align-items-center justify-content-center mb-3">
                  <img src={GoogleIcon} alt="" className="me-2" />
                  Continue with Google
                </button>
                <button className="d-flex align-items-center justify-content-center mb-3">
                  <FaApple className="me-2 fs-4" />
                  Continue with Apple
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUpPage;
