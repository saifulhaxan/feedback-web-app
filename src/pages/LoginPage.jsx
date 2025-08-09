import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";

// Assets
import AuthImage from "../assets/images/auth-img.png";
import GoogleIcon from "../assets/images/google.svg";
import { MdOutlineEmail, MdLockOutline } from "react-icons/md";
import { FaApple, FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

// API and Stores
import { login, socialLogin } from "../api/authApi"; // 👈 import your social login API
import { useMutation } from "@tanstack/react-query";
import useUserStore from "../store/userStore";
import useTokenStore from "../store/userToken";
import Fetcher from "../library/Fetcher";

// Supabase
import { supabase } from "../library/supabase";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const [socialLoading, setSocialLoading] = useState(false); // Google login button loader
  const [appleLogin, setAppleLogin] = useState(false); // Google login button loader
  const [emailLoginLoading, setEmailLoginLoading] = useState(false); // Email login button loader

  const navigate = useNavigate();

  const setUser = useUserStore((state) => state.setUserData);
  const setToken = useTokenStore((state) => state.setTokens);

  // ✅ Email/Password Login Mutation
  const loginMutation = useMutation(login, {
    onSuccess: (data) => {
      if (data?.data?.data?.tokens) {
        toast.success(data?.data?.data?.message || "Login Successful!", { autoClose: 3000 });

        setUser({ user: data?.data?.data?.user });
        setToken({ tokens: data?.data?.data?.tokens?.access?.token });

        localStorage.setItem("access_token", data?.data?.data?.tokens?.access?.token);

        Fetcher.axiosSetup.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem("access_token")}`;

        if (data?.data?.data?.user?.isVerified == false) {
          navigate("/verify-otp");
        } else if (data?.data?.data?.user?.isProfileComplete == false) {
          navigate("/complete-profile");
        } else {
          navigate("/projects");
        }

        console.log(data?.data?.data?.user);

        // navigate("/projects");
      }
    },
    onError: (error) => {
      console.log("Login error:", error?.response?.data?.message);
      toast.error(error?.response?.data?.message || "Login Failed");
    },
  });

  // ✅ Social Login Mutation
  const socialLoginMutation = useMutation(socialLogin, {
    onSuccess: (data) => {
      console.log("✅ API Response from Social Login:", data);

      if (data?.data?.data?.tokens) {
        toast.success(data?.data?.data?.message || "Login Successful!", { autoClose: 3000 });

        setUser({ user: data?.data?.data?.user });
        setToken({ tokens: data?.data?.data?.tokens?.access?.token });

        localStorage.setItem("access_token", data?.data?.data?.tokens?.access?.token);

        Fetcher.axiosSetup.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem("access_token")}`;

        if (data?.data?.data?.user?.isVerified == false) {
          navigate("/verify-otp");
        } else if (data?.data?.data?.user?.isProfileComplete == false) {
          navigate("/complete-profile");
        } else {
          navigate("/projects");
        }

        console.log(data?.data?.data?.user);

        // navigate("/projects");
      }
    },
    onError: (error) => {
      console.error("❌ Social login API error:", error?.response?.data?.message);
      toast.error(error?.response?.data?.message || "Social Login Failed");
    },
  });

  // ✅ Auto Check Google Session if returning from Google
  useEffect(() => {
    const checkGoogleSession = async () => {
      // Clear any URL parameters that might contain tokens
      if (window.location.search.includes('access_token') || window.location.search.includes('token')) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!user) {
        console.log("⚠️ No user session found:", error?.message);
        return;
      }

      console.log("🎯 User detected:", user);

      const provider = user?.app_metadata?.provider || "";

      if (provider === "google") {
        console.log("✅ Google login detected, preparing formData...");

        const fullName = user.user_metadata?.full_name || "";
        const [firstName, ...lastNameParts] = fullName.split(" ");
        const lastName = lastNameParts.join(" ");

        const formData = {
          provider: "GOOGLE",
          providerId: user.id,
          email: user.email,
          firstname: firstName || "",
          lastname: lastName || "",
        };

        console.log("✅ Prepared formData for social login:", formData);

        // Only call API if not already called
        if (!localStorage.getItem("google_login_done")) {
          socialLoginMutation.mutate(formData);
          localStorage.setItem("google_login_done", "true"); // avoid double hitting
        }
      } else {
        console.log("🛑 Not a Google login, ignoring...");
      }
    };

    checkGoogleSession();
  }, []);

  // ✅ Auto Check for Apple Session if returning from Apple
  useEffect(() => {
    const checkAppleSession = async () => {
      console.log("🍎 Checking for Apple session...");
      
      // Clear any URL parameters that might contain tokens
      if (window.location.search.includes('access_token') || window.location.search.includes('token')) {
        console.log("🧹 Clearing URL parameters...");
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("❌ Error getting Apple session:", error);
          return;
        }

        if (!session) {
          console.log("⚠️ No Apple session found");
          return;
        }

        console.log("🎯 Apple session detected:", session);
        console.log("👤 User info:", {
          id: session.user?.id,
          email: session.user?.email,
          provider: session.user?.app_metadata?.provider,
          fullName: session.user?.user_metadata?.full_name
        });

        const provider = session?.user?.app_metadata?.provider || "";

        if (provider === "apple") {
          console.log("✅ Apple login detected, preparing formData...");

          const fullName = session.user.user_metadata?.full_name || "";
          const [firstName, ...lastNameParts] = fullName.split(" ");
          const lastName = lastNameParts.join(" ");

          const formData = {
            provider: "APPLE",
            providerId: session.user.id,
            email: session.user.email,
            firstname: firstName || "",
            lastname: lastName || "",
          };

          console.log("✅ Prepared formData for Apple login:", formData);

          // Only call API if not already called
          if (!localStorage.getItem("apple_login_done")) {
            console.log("🚀 Calling social login API...");
            socialLoginMutation.mutate(formData);
            localStorage.setItem("apple_login_done", "true"); // avoid double hitting
          } else {
            console.log("⚠️ Apple login already processed, skipping API call");
          }
        } else {
          console.log("🛑 Not an Apple login, provider:", provider);
        }
      } catch (err) {
        console.error("❌ Error in Apple session check:", err);
      }
    };

    checkAppleSession();
  }, []);

  // ✅ Clear cookies and prevent back navigation issues
  useEffect(() => {
    // Clear any existing cookies for clean state
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });

    // Clear localStorage items that might cause issues
    localStorage.removeItem("google_login_done");
    localStorage.removeItem("apple_login_done");

    // Prevent back navigation to Google account selection
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, null, window.location.href);
    };

    return () => {
      window.onpopstate = null;
    };
  }, []);

  // ✅ Handle Email/Password Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!email) errors.email = "Email is required";
    if (!password) errors.password = "Password is required";

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setEmailLoginLoading(true);

    loginMutation.mutate(
      { email, password, remember },
      {
        onSettled: () => {
          setEmailLoginLoading(false); // stop loader no matter success or error
        },
      }
    );
  };

  // ✅ Handle Google Login Click
  const handleGoogleLogin = async () => {
    try {
      setSocialLoading(true);
      localStorage.removeItem("google_login_done"); // important: clear flag

      // 🔑 Sign out to avoid session reuse
      await supabase.auth.signOut();

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/",
          queryParams: {
            prompt: "select_account", // ✅ force account picker
            access_type: "offline", // ✅ prevent token in URL
            response_type: "code", // ✅ use authorization code flow
          },
        },
      });

      if (error) {
        console.error("Google login error:", error.message);
        toast.error("Google login failed!");
        setSocialLoading(false);
      }
    } catch (err) {
      console.error("Unexpected Google login error:", err);
      setSocialLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    try {
      setAppleLogin(true);
      localStorage.removeItem("apple_login_done");

      console.log("🍎 Starting Apple login process...");

      await supabase.auth.signOut(); // prevent session reuse

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "apple",
        options: {
          redirectTo: window.location.origin + "/",
          queryParams: {
            response_type: "code", // ✅ use authorization code flow
          },
        },
      });

      if (error) {
        console.error("❌ Apple login error:", error);
        console.error("❌ Error details:", {
          message: error.message,
          status: error.status,
          name: error.name
        });
        
        // More specific error messages
        if (error.message?.includes("popup")) {
          toast.error("Apple login popup was blocked. Please allow popups and try again.");
        } else if (error.message?.includes("cancelled")) {
          toast.error("Apple login was cancelled.");
        } else if (error.message?.includes("network")) {
          toast.error("Network error. Please check your connection and try again.");
        } else {
          toast.error(`Apple login failed: ${error.message}`);
        }
        setAppleLogin(false);
      } else {
        console.log("✅ Apple OAuth initiated successfully:", data);
      }
    } catch (err) {
      console.error("❌ Unexpected Apple login error:", err);
      toast.error("Unexpected error during Apple login. Please try again.");
      setAppleLogin(false);
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
              <h1>Welcome Back</h1>
              <p>Let's login to continue for Feedback Work</p>
            </div>

            <form onSubmit={handleSubmit} className="mb-4 authForm">
              {/* Email */}
              <div className="form-group mb-3">
                <label className="auth-label">Email</label>
                <div className="authInputWrap d-flex align-items-center ps-3">
                  <MdOutlineEmail className="auth-icon" />
                  <input
                    type="email"
                    name="email"
                    className="form-control auth-input"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {formErrors.email && <p className="text-danger mt-1">{formErrors.email}</p>}
              </div>

              {/* Password */}
              <div className="form-group mb-3">
                <label className="auth-label">Password</label>
                <div className="authInputWrap d-flex align-items-center ps-3 pe-3">
                  <MdLockOutline className="auth-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="form-control auth-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="eye-btn" type="button" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaRegEye className="auth-eyeClosed" /> : <FaRegEyeSlash className="auth-eyeClosed" />}
                  </div>
                </div>
                {formErrors.password && <p className="text-danger mt-1">{formErrors.password}</p>}
              </div>

              {/* Remember Me + Forgot */}
              <div className="form-check d-flex align-items-center justify-content-between mb-3">
                <div>
                  <input type="checkbox" className="form-check-input" id="remember" checked={remember} onChange={() => setRemember(!remember)} />
                  <label className="form-check-label" htmlFor="remember">
                    Keep me signed in
                  </label>
                </div>
                <p className="mb-0 forgot-password" onClick={() => navigate("/forgot-password-verify")}>
                  Forgot Password?
                </p>
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn btn-primary submit-btn" disabled={emailLoginLoading}>
                {emailLoginLoading ? (
                  <>
                    <CircularProgress size={20} style={{ color: "#fff" }} className="me-2" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="noAccount mb-3">
              <p className="mb-0">
                Don’t have an account? <span onClick={() => navigate("/create-account")}>Sign Up here</span>
              </p>
            </div>

            {/* Or Divider */}
            <div className="orHr">
              <p className="mb-0 text-center">Or</p>
            </div>
            <hr />

            {/* Google and Apple Login Buttons */}
            <div className="socialbtn mb-4">
              <button
                type="button"
                className="d-flex align-items-center justify-content-center mb-3"
                onClick={handleGoogleLogin}
                disabled={socialLoading}
              >
                {socialLoading ? (
                  <>
                    <CircularProgress size={20} style={{ color: "#fff" }} className="me-2" />
                    Redirecting...
                  </>
                ) : (
                  <>
                    <img src={GoogleIcon} alt="" className="me-2" />
                    Continue with Google
                  </>
                )}
              </button>

              <button className="d-flex align-items-center justify-content-center mb-3" onClick={handleAppleLogin} disabled={appleLogin}>
                {appleLogin ? (
                  <>
                    <CircularProgress size={20} style={{ color: "#fff" }} className="me-2" />
                    Redirecting...
                  </>
                ) : (
                  <>
                    <FaApple className="me-2 fs-4" />
                    Continue with Apple
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
