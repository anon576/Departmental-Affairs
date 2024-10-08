import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { BACKEND_API } from "../../constant";
import "react-toastify/dist/ReactToastify.css";

const UpdateFDP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fdpData } = location.state || {}; // Getting FDP data from location state
  const [formData, setFormData] = useState({
    type: "FDP", // Default type
    status: "organized", // Default status
    title: "",
    noOfDays: 0,
    duration: "",
    regFee: 0,
    venue: "",
    noOfParticipant: 0,
    Sponsored: "no", // Default sponsorship
    nameOfSponser: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (fdpData) {
      setFormData({
        type: fdpData.type,
        status: fdpData.status,
        title: fdpData.title,
        noOfDays: fdpData.noOfDays,
        duration: fdpData.duration,
        regFee: fdpData.regFee,
        venue: fdpData.venue,
        noOfParticipant: fdpData.noOfParticipant,
        Sponsored: fdpData.Sponsored,
        nameOfSponser: fdpData.nameOfSponser,
      });
    }
  }, [fdpData]);

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

    const updatedFDPData = { ...formData };

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.put(
        `${BACKEND_API}/fdp/update/${fdpData.fdpID}`,
        updatedFDPData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );

      if (response.data.success) {
        console.log("here")
        toast.success("FDP updated successfully.");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating FDP:", error);
      toast.error("Failed to update FDP. Please try again.");
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
        <h2>Update FDP</h2>
        <form onSubmit={handleSubmit} className="conferance-update-form">
          {/* Type */}
          <div className="form-group">
            <label htmlFor="type">
              Type<span className="required">*</span>
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="FDP">FDP</option>
              <option value="STTP">STTP</option>
            </select>
          </div>

          {/* Status */}
          <div className="form-group">
            <label htmlFor="status">
              Status<span className="required">*</span>
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="organized">Organized</option>
              <option value="attended">Attended</option>
            </select>
          </div>

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

          {/* Registration Fee */}
          <div className="form-group">
            <label htmlFor="regFee">Registration Fee:</label>
            <input
              type="number"
              id="regFee"
              name="regFee"
              value={formData.regFee}
              onChange={handleChange}
              min="0"
            />
          </div>

          {/* Venue */}
          <div className="form-group">
            <label htmlFor="venue">
              Venue<span className="required">*</span>
            </label>
            <input
              type="text"
              id="venue"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              required
            />
          </div>

          {/* Number of Participants */}
          <div className="form-group">
            <label htmlFor="noOfParticipant">
              Number of Participants<span className="required">*</span>
            </label>
            <input
              type="number"
              id="noOfParticipant"
              name="noOfParticipant"
              value={formData.noOfParticipant}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          {/* Sponsored */}
          <div className="form-group">
            <label htmlFor="Sponsored">Sponsored:</label>
            <select
              id="Sponsored"
              name="Sponsored"
              value={formData.Sponsored}
              onChange={handleChange}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          {/* Name of Sponsor (only if sponsored is 'yes') */}
          {formData.Sponsored === "yes" && (
            <div className="form-group">
              <label htmlFor="nameOfSponser">Name of Sponsor:</label>
              <input
                type="text"
                id="nameOfSponser"
                name="nameOfSponser"
                value={formData.nameOfSponser}
                onChange={handleChange}
              />
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" className="submit-button">
            Update FDP
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UpdateFDP;
