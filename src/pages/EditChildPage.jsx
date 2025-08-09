import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Fetcher from "../library/Fetcher";
import useUserStore from "../store/userStore";

export default function EditChildPage() {
  const { childId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [childData, setChildData] = useState(null);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: ""
  });

  const navigate = useNavigate();
  const { userData } = useUserStore();

  // Load existing child data
  useEffect(() => {
    const loadChildData = async () => {
      try {
        setIsLoading(true);
        const response = await Fetcher.get(`/user/child/${childId}`);
        const child = response?.data?.data?.child;
        
        if (child) {
          setChildData(child);
          setFormData({
            firstname: child.firstname || "",
            lastname: child.lastname || "",
            email: child.email || "",
            phone: child.phone || "",
            dateOfBirth: child.dateOfBirth || "",
            gender: child.gender || "",
            address: child.address || "",
            city: child.city || "",
            state: child.state || "",
            country: child.country || "",
            zipCode: child.zipCode || ""
          });
        } else {
          toast.error("Child not found");
          navigate("/manage-relation");
        }
      } catch (error) {
        console.error("Failed to load child data:", error);
        toast.error(error?.response?.data?.message || "Failed to load child data");
        navigate("/manage-relation");
      } finally {
        setIsLoading(false);
      }
    };

    if (childId) {
      loadChildData();
    }
  }, [childId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Check authentication
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("Please login to continue");
        navigate("/login");
        return;
      }

      // Validate required fields
      if (!formData.firstname.trim()) {
        toast.error("First name is required");
        return;
      }

      if (!formData.lastname.trim()) {
        toast.error("Last name is required");
        return;
      }

      if (!formData.email.trim()) {
        toast.error("Email is required");
        return;
      }

      console.log("📤 Sending edit data to API:", formData);
      
      // Make the API call
      const response = await Fetcher.put(`/user/child/${childId}`, formData);
      console.log("✅ Edit child API Success:", response.data);
      toast.success(response?.data?.data?.data?.message || "Child information updated successfully!");
      navigate("/manage-relation");
      
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error?.message) {
        toast.error(`Request failed: ${error.message}`);
      } else {
        toast.error("Failed to update child information. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container-fluid ps-5 pe-5">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center mt-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading child data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="main_wrapper">
        <div className="container-fluid ps-5 pe-5">
          <div className="row">
            <div className="col-lg-12">
              <div className="heading_wrapper d-flex align-items-center justify-content-between mt-4 mb-4">
                <h1>Edit Child Information</h1>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="firstname" className="form-label">First Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="firstname"
                          name="firstname"
                          value={formData.firstname}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="lastname" className="form-label">Last Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="lastname"
                          name="lastname"
                          value={formData.lastname}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="email" className="form-label">Email *</label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="phone" className="form-label">Phone</label>
                        <input
                          type="tel"
                          className="form-control"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
                        <input
                          type="date"
                          className="form-control"
                          id="dateOfBirth"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="gender" className="form-label">Gender</label>
                        <select
                          className="form-control"
                          id="gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Gender</option>
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="address" className="form-label">Address</label>
                      <textarea
                        className="form-control"
                        id="address"
                        name="address"
                        rows="3"
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label htmlFor="city" className="form-label">City</label>
                        <input
                          type="text"
                          className="form-control"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label htmlFor="state" className="form-label">State</label>
                        <input
                          type="text"
                          className="form-control"
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label htmlFor="country" className="form-label">Country</label>
                        <input
                          type="text"
                          className="form-control"
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="zipCode" className="form-label">Zip Code</label>
                        <input
                          type="text"
                          className="form-control"
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="d-flex justify-content-between mt-4">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate("/manage-relation")}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Updating...
                          </>
                        ) : (
                          "Update Child Information"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 