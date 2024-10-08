import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { BACKEND_API } from "../../constant";
import "react-toastify/dist/ReactToastify.css";

const UpdateSDP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sdpData } = location.state || {}; // Getting SDP data from location state
  const [formData, setFormData] = useState({
    title: "",
    duration: "",
    noOfDays: 0,
    noOfBeneficiary: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sdpData) {
      setFormData({
        title: sdpData.title,
        duration: sdpData.duration,
        noOfDays: sdpData.noOfDays,
        noOfBeneficiary: sdpData.noOfBeneficiary,
      });
    }
  }, [sdpData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updatedSDPData = { ...formData };

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.put(
        `${BACKEND_API}/sdp/update/${sdpData.sdpID}`,
        updatedSDPData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("SDP updated successfully.");
        navigate('/sdp/list'); // Redirect to SDP list after update
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating SDP:", error);
      toast.error("Failed to update SDP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="conferance-list-main-container">
      <div className="conferences-list-container">
        <h2>Update SDP</h2>
        <form onSubmit={handleSubmit} className="conferance-update-form">
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">
              Title<span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* No of Days */}
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
              required
            />
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
              required
            />
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
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-button">
            Update SDP
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UpdateSDP;
