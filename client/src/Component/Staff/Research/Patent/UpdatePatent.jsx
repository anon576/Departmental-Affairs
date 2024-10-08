import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { BACKEND_API } from "../../../constant";
import "react-toastify/dist/ReactToastify.css";

const UpdatePatent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { patentData } = location.state || {}; // Getting patent data from location state
  const [formData, setFormData] = useState({
    title: "",
    applicants: [], // Initialize as an array
    status: "Submitted", // Default status
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (patentData) {
      setFormData({
        title: patentData.title,
        applicants: patentData.applicant || [], // Directly assign the array
        status: patentData.status,
      });
    }
  }, [patentData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddApplicant = () => {
    setFormData((prevState) => ({
      ...prevState,
      applicants: [...prevState.applicants, ""], // Add a new empty string for a new applicant
    }));
  };

  const handleApplicantChange = (index, value) => {
    const newApplicants = [...formData.applicants];
    newApplicants[index] = value; // Update the specific applicant
    setFormData({
      ...formData,
      applicants: newApplicants,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Prepare data for submission
    const updatedPatentData = {
      title: formData.title,
      applicant: formData.applicants, // Directly assign the array
      status: formData.status,
    };

    try {
        const token = localStorage.getItem("authToken")
      const response = await axios.put(
        `${BACKEND_API}/patents/update/${patentData.patentID}`,
        updatedPatentData,{
            headers: {
              "Content-Type": "multipart/form-data",
              "Authorization": `${token}`,
            },
          }
      );

      if (response.data.success) {
        console.log(response.data)
        toast.success("Patent updated successfully.");
       // Navigate back to the patent list after successful update
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating patent:", error);
      toast.error("Failed to update patent. Please try again.");
    } finally {
      setLoading(false);
    }
  };

 const handleUpdate = (patent) => {
    navigate(`/patent/update/`, { state: { patentData :patent} });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="conference-upadate-main-container">

        <form onSubmit={handleSubmit} className="conference-update-form">
          {/* Title */}
          <h2>Update Patent</h2>
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
              className=""
              required
            />
          </div>

          {/* Number of Applicants */}
          <div className="form-group">
            <label htmlFor="applicantCount">Number of Applicants:</label>
            <input
              type="number"
              id="applicantCount"
              value={formData.applicants.length}
              readOnly
              className="read-only-input" // Assuming you want a specific class for read-only
            />
          </div>

          {/* Applicants */}
          {formData.applicants.map((applicant, index) => (
            <div key={index} className="form-group">
              <label htmlFor={`applicant-${index}`}>Applicant {index + 1}:</label>
              <input
                type="text"
                id={`applicant-${index}`}
                value={applicant}
                onChange={(e) => handleApplicantChange(index, e.target.value)}
                required
              />
            </div>
          ))}

          <button type="button" onClick={handleAddApplicant} className="submit-button">
            Add Applicant
          </button>

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
              <option value="Submitted">Submitted</option>
              <option value="Published">Published</option>
              <option value="Granted">Granted</option>
            </select>
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-button">
            Update Patent
          </button>
        </form>
    
      <ToastContainer />
    </div>
  );
};

export default UpdatePatent;
