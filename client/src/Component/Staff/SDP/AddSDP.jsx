// src/components/SDP/AddSDP.js

import React, { useContext, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppContext } from "../../Context/AppContext";
import { BACKEND_API } from "../../constant";

const AddSDP = () => {
  const { sideBarOpen } = useContext(AppContext);
  const [formData, setFormData] = useState({
    title: "",
    duration: "",
    noOfDays: 1,
    noOfBeneficiary: 0,
  });
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validate the form
  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "SDP title is required.";
    if (!formData.duration.trim()) newErrors.duration = "Duration is required.";
    if (formData.noOfDays < 1) newErrors.noOfDays = "Number of days must be at least 1.";
    if (formData.noOfBeneficiary < 0) newErrors.noOfBeneficiary = "Number of beneficiaries cannot be negative.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    const token = localStorage.getItem("authToken");
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser?.userId;

    const submissionData = {
      ...formData,
      userId,
    };

    try {
      const response = await axios.post(`${BACKEND_API}/sdp/add`, submissionData, {
        headers: {
          "Authorization": `${token}`,
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({
          title: "",
          duration: "",
          noOfDays: 1,
          noOfBeneficiary: 0,
        });
        setErrors({});
      } else {
        toast.error(response.data.message || "Failed to submit SDP details.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit SDP details. Please try again.");
    }
  };

  return (
    <div
      className={`conference-form-main-container
      ${sideBarOpen ? "conference-form-open" : ""}
    `}
    >
      <div className="conference-form-container">
        <h2>SDP Submission Form</h2>
        <form onSubmit={handleSubmit}>
          {/* SDP Title */}
          <div className="form-group">
            <label htmlFor="title">
              SDP Title<span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? "error" : ""}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          {/* Duration */}
          <div className="form-group">
            <label htmlFor="duration">
              Duration<span className="required">*</span>
            </label>
            <input
              type="text"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className={errors.duration ? "error" : ""}
            />
            {errors.duration && <span className="error-message">{errors.duration}</span>}
          </div>

          {/* Number of Days */}
          <div className="form-group">
            <label htmlFor="noOfDays">
              Number of Days<span className="required">*</span>
            </label>
            <input
              type="number"
              id="noOfDays"
              name="noOfDays"
              value={formData.noOfDays}
              onChange={handleChange}
              min="1"
              className={errors.noOfDays ? "error" : ""}
            />
            {errors.noOfDays && <span className="error-message">{errors.noOfDays}</span>}
          </div>

          {/* Number of Beneficiaries */}
          <div className="form-group">
            <label htmlFor="noOfBeneficiary">
              Number of Beneficiaries<span className="required">*</span>
            </label>
            <input
              type="number"
              id="noOfBeneficiary"
              name="noOfBeneficiary"
              value={formData.noOfBeneficiary}
              onChange={handleChange}
              min="0"
              className={errors.noOfBeneficiary ? "error" : ""}
            />
            {errors.noOfBeneficiary && <span className="error-message">{errors.noOfBeneficiary}</span>}
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-button">
            Submit SDP
          </button>
        </form>

        {/* Toast Notifications */}
        <ToastContainer />
      </div>
    </div>
  );
};

export default AddSDP;
