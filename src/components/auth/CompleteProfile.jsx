import React, { useState } from "react";
import CreateUserImg from "../../assets/images/createuser.svg";

function CompleteProfile({ handleSubmit }) {
  const [username, setUsername] = useState("");
  const [title, setTitle] = useState("");
  const [expertise, setExpertise] = useState("");
  const [accountType, setAccountType] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const onSubmit = (e) => {
    e.preventDefault();

    const errors = {};
    if (!title) errors.title = "Title is required";
    if (!expertise) errors.expertise = "Expertise is required";
    if (!accountType) errors.accountType = "Please select an account type";

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    const formData = {
      username, // optional
      title,
      expertise,
      accountType,
    };

    handleSubmit(formData); // Call the parent handler with collected data
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "username") setUsername(value);
    else if (name === "title") setTitle(value);
    else if (name === "expertise") setExpertise(value);
    else if (name === "accountType") setAccountType(value);
  };

  return (
    <div className="auth-signup-wrapper">
      <div className="auth-text text-center mb-4">
        <h1 className="mb-4">Complete Your Profile</h1>
        <img src={CreateUserImg} alt="" />
      </div>

      <form onSubmit={onSubmit} className="mb-4 authForm">
        <div className="form-group mb-3">
          <label htmlFor="username" className="auth-label">
            Username (Optional)
          </label>
          <div className="authInputWrap d-flex align-items-center">
            <input type="text" className="form-control auth-input" id="username" name="username" value={username} onChange={handleChange} />
          </div>
        </div>

        <div className="form-group mb-3">
          <label htmlFor="title" className="auth-label">
            Title
          </label>
          <div className="authInputWrap d-flex align-items-center">
            <input type="text" className="form-control auth-input" id="title" name="title" value={title} onChange={handleChange} />
          </div>
          {formErrors.title && <p className="text-danger mt-1">{formErrors.title}</p>}
        </div>

        <div className="form-group mb-3">
          <label htmlFor="expertise" className="auth-label">
            Expertise
          </label>
          <div className="authInputWrap d-flex align-items-center">
            <input type="text" className="form-control auth-input" id="expertise" name="expertise" value={expertise} onChange={handleChange} />
          </div>
          {formErrors.expertise && <p className="text-danger mt-1">{formErrors.expertise}</p>}
        </div>

        <div className="form-group mb-3">
          <label htmlFor="accountType" className="auth-label">
            Account Type
          </label>
          <div className="authInputWrap d-flex align-items-center">
            <select className="form-select auth-input" id="accountType" name="accountType" value={accountType} onChange={handleChange}>
              <option value="">Select account type ...</option>
              <option value="Regular">Regular</option>
              <option value="Parent">Parent</option>
              <option value="Manager">Manager</option>
              <option value="Teacher">Teacher</option>
            </select>
          </div>
          {formErrors.accountType && <p className="text-danger mt-1">{formErrors.accountType}</p>}
        </div>

        <button type="submit" className="btn btn-primary submit-btn">
          Create Account
        </button>
      </form>
    </div>
  );
}

export default CompleteProfile;
