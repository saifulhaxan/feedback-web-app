import React, { useState, useEffect } from "react";
import AuthImage from "../assets/images/auth-img.png";
import { useNavigate } from "react-router-dom";
import { completeProfile } from "../api/authApi";
import { useMutation } from "@tanstack/react-query";
import useUserStore from "../store/userStore";
import { toast } from "react-toastify";
import { getRoles } from "../api/rolesApi";
import { FaCirclePlus } from "react-icons/fa6";
import useTokenStore from "../store/userToken";
import Fetcher from "../library/Fetcher";


function CompleteProfilePage() {
  const [username, setUsername] = useState("");
  const [title, setTitle] = useState("");
  const [expertise, setExpertise] = useState("");
  const [accountType, setAccountType] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [imageBase64, setImageBase64] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [roles, setRoles] = useState([]);


  const navigate = useNavigate();

  const setUser = useUserStore((state) => state.setUserData);
  const userData = useUserStore((state) => state.userData);
  const setToken = useTokenStore((state) => state.setTokens);



  // Fetch roles on mount
  const getRolesMutation = useMutation(getRoles, {
    onSuccess: (data) => {
      const fetchedRoles = data?.data?.data?.roles || [];
      setRoles(fetchedRoles);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to load roles");
    },
  });

  useEffect(() => {
    getRolesMutation.mutate();
  }, []);

  useEffect(() => {
    if (userData?.user?.isProfileComplete) {
      navigate("/projects", { replace: true });
    }
  }, [userData, navigate]);

  // Prevent back navigation to login and clear auth state
  useEffect(() => {
    // Clear any stored login state to prevent back navigation issues
    localStorage.removeItem("google_login_done");
    localStorage.removeItem("apple_login_done");
    
    // Clear any URL parameters that might contain tokens
    if (window.location.search.includes('access_token') || window.location.search.includes('token')) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Prevent back navigation to login screen
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, null, window.location.href);
    };

    return () => {
      window.onpopstate = null;
    };
  }, []);

  // Handle image upload & convert to base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Example: Only allow jpg/png
      const allowedTypes = ["image/jpeg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        setFormErrors((prev) => ({ ...prev, image: "Only JPG and PNG allowed" }));
        setImageFile(null);
        setImageBase64("");
        return;
      }
      setFormErrors((prev) => ({ ...prev, image: undefined }));
      setImageFile(file);

      // If you want to keep base64 for preview:
      const reader = new FileReader();
      reader.onloadend = () => setImageBase64(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "username") setUsername(value);
    else if (name === "title") setTitle(value);
    else if (name === "expertise") setExpertise(value);
    else if (name === "accountType") setAccountType(value);
  };

  // Submit form
  const handleSubmit = (event) => {
    event.preventDefault();

    // Your existing validations here...
    const errors = {};
    // Username is optional, so no validation for it
    if (!title) errors.title = "Title required";
    if (!expertise) errors.expertise = "Expertise required";
    if (!accountType) errors.accountType = "Account type required";
    // REMOVE this line:
    // if (!imageFile) errors.image = "Profile image required";
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    // Prepare FormData
    const formData = new FormData();
    formData.append("username", username);
    formData.append("title", title);
    formData.append("expertise", expertise);
    formData.append("roleId", accountType);
    if (imageFile) formData.append("image", imageFile); // Only append if exists

    completeProfileMutation.mutate(formData);
  };

  // Mutation for profile completion
  const completeProfileMutation = useMutation(completeProfile, {
    onSuccess: async (data) => {
      const user = data?.data?.data?.user;

      if (user) {
        try {
        toast.success(data?.data?.data?.message || "Profile Completed", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });

          setUser({ user });

          console.log('Profile completed with user ID:', user.id);

          // ✅ Insert into Supabase
          const uuid = user.uuid || user.id;
          const firstName = user.firstname || user.firstName || '';
          const lastName = user.lastname || user.lastName || '';
          const name = `${firstName} ${lastName}`.trim() || user.title || 'User';
          const imageUrl = user.image || '';
          const accountType = user.role?.name || 'REGULAR';

                    console.log('Profile completed successfully');

          // Navigate to projects page
          navigate("/projects", { replace: true });
        } catch (error) {
          console.error('Error in profile completion success handler:', error);
        navigate("/projects", { replace: true });
        }
      }
    },
    onError: (error) => {
      const msg = error?.response?.data?.message;
      if (msg) {
        toast.error(msg, {
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

  return (
    <div className="container-fluid ps-0">
      <div className="row">
        <div className="col-lg-6">
          <img src={AuthImage} alt="login" className="auth-img" />
        </div>

        <div className="col-lg-6">
          <div className="auth-signup-wrapper">
            <div className="auth-text text-center mb-4">
              <h1 className="mb-4">Complete Your Profile</h1>

              {/* Upload Image Section */}
              <div className="text-center mb-4 position-relative" style={{ width: 120, margin: "0 auto" }}>
                <label htmlFor="upload-profile-pic" style={{ cursor: "pointer" }}>
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: 100,
                      height: 100,
                      backgroundColor: "#f4f4f4",
                      overflow: "hidden",
                      border: "2px solid #ddd",
                    }}
                  >
                    {imageBase64 ? (
                      <img
                        src={imageBase64}
                        alt="Profile"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#ccc" viewBox="0 0 24 24">
                        <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2Zm0 15a1.5 1.5 0 111.5-1.5A1.5 1.5 0 0112 17Zm1-4h-2V7h2Z" />
                      </svg>
                    )}
                  </div>
                  <div
                    className="position-absolute text-white d-flex align-items-center justify-content-center"
                    style={{
                      bottom: 10,
                      right: 10,
                      fontSize: 24,
                    }}
                  >
                    <FaCirclePlus className="text-primary w-full " />
                  </div>
                </label>
                <input type="file" accept="image/*" id="upload-profile-pic" onChange={handleImageChange} hidden />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mb-4 authForm">
              {/* Username */}
              <div className="form-group mb-3">
                <label htmlFor="username" className="auth-label">
                  Username (Optional)
                </label>
                <div className="authInputWrap d-flex align-items-center">
                  <input type="text" className="form-control auth-input" id="username" name="username" value={username} onChange={handleChange} />
                </div>
              </div>

              {/* Title */}
              <div className="form-group mb-3">
                <label htmlFor="title" className="auth-label">
                  Title
                </label>
                <div className="authInputWrap d-flex align-items-center">
                  <input type="text" className="form-control auth-input" id="title" name="title" value={title} onChange={handleChange} />
                </div>
                {formErrors.title && <p className="text-danger mt-1">{formErrors.title}</p>}
              </div>

              {/* Expertise */}
              <div className="form-group mb-3">
                <label htmlFor="expertise" className="auth-label">
                  Expertise
                </label>
                <div className="authInputWrap d-flex align-items-center">
                  <input type="text" className="form-control auth-input" id="expertise" name="expertise" value={expertise} onChange={handleChange} />
                </div>
                {formErrors.expertise && <p className="text-danger mt-1">{formErrors.expertise}</p>}
              </div>

              {/* Account Type */}
              <div className="form-group mb-3">
                <label htmlFor="accountType" className="auth-label">
                  Account Type
                </label>
                <div className="authInputWrap d-flex align-items-center">
                  <select className="form-select auth-input" id="accountType" name="accountType" value={accountType} onChange={handleChange}>
                    <option value="">Select account type ...</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>
                {formErrors.accountType && <p className="text-danger mt-1">{formErrors.accountType}</p>}
              </div>

              {/* Submit */}
              <button 
                type="submit" 
                className="btn btn-primary submit-btn"
                disabled={completeProfileMutation.isPending}
              >
                {completeProfileMutation.isPending ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating Profile...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompleteProfilePage;
