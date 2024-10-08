import React, { useContext, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppContext } from "../../Context/AppContext";
import { BACKEND_API } from "../../constant";

const AddFDP = () => {
  const { sideBarOpen } = useContext(AppContext);
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    status: "",
    noOfDays: 1,
    duration: "",
    regFee: 0,
    venue: "",
    noOfParticipant: 0,
    sponsored: "",
    nameOfSponser: "",
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

    if (!formData.title.trim()) newErrors.title = "FDP title is required.";
    if (!formData.type) newErrors.type = "Type is required.";
    if (!formData.status) newErrors.status = "Status is required.";
    if (formData.sponsored === "yes" && !formData.nameOfSponser.trim()) {
      newErrors.nameOfSponser = "Sponsor name is required if sponsored.";
    }

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
      const response = await axios.post(`${BACKEND_API}/fdp/add`, submissionData, {
        headers: {
          "Authorization": `${token}`,
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({
          title: "",
          type: "",
          status: "",
          noOfDays: 1,
          duration: "",
          regFee: 0,
          venue: "",
          noOfParticipant: 0,
          sponsored: "",
          nameOfSponser: "",
        });
        setErrors({});
      } else {
        toast.error(response.data.message || "Failed to submit FDP details.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit FDP details. Please try again.");
    }
  };

  return (
    <div
      className={`conference-form-main-container
      ${sideBarOpen ? "conference-form-open" : ""}
    `}
    >
      <div className="conference-form-container">
        <h2>FDP Submission Form</h2>
        <form onSubmit={handleSubmit}>
          {/* FDP Title */}
          <div className="form-group">
            <label htmlFor="title">
              FDP Title<span className="required">*</span>
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

          {/* FDP Type */}
          <div className="form-group">
            <label htmlFor="type">
              Type<span className="required">*</span>
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={errors.type ? "error" : ""}
            >
              <option value="">--Select Type--</option>
              <option value="FDP">FDP</option>
              <option value="STTP">STTP</option>
            </select>
            {errors.type && <span className="error-message">{errors.type}</span>}
          </div>

          {/* FDP Status */}
          <div className="form-group">
            <label htmlFor="status">
              Status<span className="required">*</span>
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={errors.status ? "error" : ""}
            >
              <option value="">--Select Status--</option>
              <option value="organized">Organized</option>
              <option value="attended">Attended</option>
            </select>
            {errors.status && <span className="error-message">{errors.status}</span>}
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

          {/* Duration */}
          <div className="form-group">
            <label htmlFor="duration">Duration</label>
            <input
              type="text"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
            />
          </div>

          {/* Registration Fee */}
          <div className="form-group">
            <label htmlFor="regFee">Registration Fee</label>
            <input
              type="number"
              id="regFee"
              name="regFee"
              value={formData.regFee}
              onChange={handleChange}
            />
          </div>

          {/* Venue */}
          <div className="form-group">
            <label htmlFor="venue">Venue</label>
            <input
              type="text"
              id="venue"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
            />
          </div>

          {/* Number of Participants */}
          <div className="form-group">
            <label htmlFor="noOfParticipant">Number of Participants</label>
            <input
              type="number"
              id="noOfParticipant"
              name="noOfParticipant"
              value={formData.noOfParticipant}
              onChange={handleChange}
            />
          </div>

          {/* Sponsored */}
          <div className="form-group">
            <label htmlFor="sponsored">
              Sponsored<span className="required">*</span>
            </label>
            <select
              id="sponsored"
              name="sponsored"
              value={formData.sponsored}
              onChange={handleChange}
              className={errors.sponsored ? "error" : ""}
            >
              <option value="">--Select--</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            {errors.sponsored && <span className="error-message">{errors.sponsored}</span>}
          </div>

          {/* Name of Sponsor (if Sponsored) */}
          {formData.sponsored === "yes" && (
            <div className="form-group">
              <label htmlFor="nameOfSponser">
                Name of Sponsor<span className="required">*</span>
              </label>
              <input
                type="text"
                id="nameOfSponser"
                name="nameOfSponser"
                value={formData.nameOfSponser}
                onChange={handleChange}
                className={errors.nameOfSponser ? "error" : ""}
              />
              {errors.nameOfSponser && (
                <span className="error-message">{errors.nameOfSponser}</span>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" className="submit-button">
            Submit FDP
          </button>
        </form>

        {/* Toast Notifications */}
        <ToastContainer />
      </div>
    </div>
  );
};

export default AddFDP;
