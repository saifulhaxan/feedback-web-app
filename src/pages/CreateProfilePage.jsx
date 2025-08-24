import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { completeProfile } from "../api/authApi";
import { useMutation } from "@tanstack/react-query";
import { getRoles } from "../api/rolesApi";
import { toast } from "react-toastify";
import useUserStore from "../store/userStore";
import AuthImage from "../assets/images/auth-img.png";
import useTokenStore from "../store/userToken";
import Fetcher from "../library/Fetcher";


function CreateProfilePage() {
  const [formData, setFormData] = useState({
    title: "",
    expertise: "",
    roleId: "",
    username: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [roles, setRoles] = useState([]);


  const navigate = useNavigate();

  const setUser = useUserStore((state) => state.setUserData);
  const setToken = useTokenStore((state) => state.setTokens);
  const userData = useUserStore((state) => state.userData);



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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }
    
    if (!formData.expertise.trim()) {
      errors.expertise = "Expertise is required";
    }
    
    if (!formData.roleId) {
      errors.roleId = "Please select a role";
    }
    
    // Username is optional, so no validation needed
    
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return;
    }

    // Create the exact payload structure as specified
    const payload = {
      title: formData.title,
      expertise: formData.expertise,
      roleId: formData.roleId,
      username: formData.username
    };

    createProfileMutation.mutate(payload);
  };

  const createProfileMutation = useMutation(completeProfile, {
    onSuccess: async (data) => {
      if (data?.data?.data) {
        try {
          // Profile created successfully
          if (data?.data?.data?.tokens) {
            toast.success(data?.data?.data?.message || "Profile Created Successfully!", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: true,
              pauseOnHover: false,
              draggable: false,
              progress: undefined,
            });

            const user = data?.data?.data?.user || data?.data?.data?.users;
            setUser({ user });

            if (user) {
              console.log('Profile created with user ID:', user.id);

              // ✅ Insert into Supabase
              const uuid = user.uuid || user.id;
              const firstName = user.firstname || user.firstName || '';
              const lastName = user.lastname || user.lastName || '';
              const name = `${firstName} ${lastName}`.trim() || user.title || 'User';
              const imageUrl = user.image || '';
              const accountType = user.role?.name || 'REGULAR';

              console.log('Profile created successfully');

              // Navigate to projects page
              navigate("/projects", { replace: true });
            }
          }
        } catch (error) {
          console.error('Error in profile creation success handler:', error);
          // Still navigate even if there's an error in the success handler
          navigate("/projects", { replace: true });
        }
      }
    },
    onError: (error) => {
      const msg = error?.response?.data?.message || "Failed to create profile";
      if (error?.response?.data?.message) {
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
              <h1 className="mb-4">Create Your Profile</h1>
              <p>Complete your profile to get started</p>
            </div>

            <form onSubmit={handleSubmit} className="mb-4 authForm">
              {/* Username (Optional) */}
              <div className="form-group mb-3">
                <label htmlFor="username" className="auth-label">
                  Username (Optional)
                </label>
                <div className="authInputWrap d-flex align-items-center">
                  <input
                    type="text"
                    className="form-control auth-input"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter username"
                  />
                </div>
              </div>

              {/* Title */}
              <div className="form-group mb-3">
                                  <label htmlFor="title" className="auth-label">
                    Title
                  </label>
                <div className="authInputWrap d-flex align-items-center">
                  <input
                    type="text"
                    className={`form-control auth-input ${formErrors.title ? 'is-invalid' : ''}`}
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Dr, Mr, Ms, Prof"
                  />
                </div>
                {formErrors.title && <p className="text-danger mt-1">{formErrors.title}</p>}
              </div>

              {/* Expertise */}
              <div className="form-group mb-3">
                                  <label htmlFor="expertise" className="auth-label">
                    Expertise
                  </label>
                <div className="authInputWrap d-flex align-items-center">
                  <input
                    type="text"
                    className={`form-control auth-input ${formErrors.expertise ? 'is-invalid' : ''}`}
                    id="expertise"
                    name="expertise"
                    value={formData.expertise}
                    onChange={handleChange}
                    placeholder="e.g., Mathematics, Software Development, Teaching"
                  />
                </div>
                {formErrors.expertise && <p className="text-danger mt-1">{formErrors.expertise}</p>}
              </div>

              {/* Role Selection */}
              <div className="form-group mb-3">
                                  <label htmlFor="roleId" className="auth-label">
                    Role
                  </label>
                <div className="authInputWrap d-flex align-items-center">
                  <select
                    className={`form-select auth-input ${formErrors.roleId ? 'is-invalid' : ''}`}
                    id="roleId"
                    name="roleId"
                    value={formData.roleId}
                    onChange={handleChange}
                  >
                    <option value="">Select a role...</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>
                {formErrors.roleId && <p className="text-danger mt-1">{formErrors.roleId}</p>}
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="btn btn-primary submit-btn w-100"
                disabled={createProfileMutation.isPending}
              >
                {createProfileMutation.isPending ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating Profile...
                  </>
                ) : (
                  "Create Profile"
                )}
              </button>
              

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateProfilePage; 