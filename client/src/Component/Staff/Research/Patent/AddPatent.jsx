import React, { useContext, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppContext } from "../../../Context/AppContext";
import { BACKEND_API } from "../../../constant";

const AddPatent = () => {
  const { sideBarOpen } = useContext(AppContext);
  const [formData, setFormData] = useState({
    title: "",
    numberOfApplicants: 1,
    applicants: [""],
    status: "",
    certificate: null,
  });
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (name === "numberOfApplicants") {
      const num = parseInt(value);
      setFormData((prev) => ({
        ...prev,
        numberOfApplicants: num,
        applicants: Array(num).fill(""),
      }));
    } else if (name.startsWith("applicant")) {
      const index = parseInt(name.split("_")[1]);
      const newApplicants = [...formData.applicants];
      newApplicants[index] = value;
      setFormData((prev) => ({
        ...prev,
        applicants: newApplicants,
      }));
    } else if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Validate the form
  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Patent title is required.";
    if (!formData.status) newErrors.status = "Status is required.";
    if (formData.status === "Granted" && !formData.certificate) {
      newErrors.certificate = "Please upload the grant certificate.";
    }

    // Validate applicants
    formData.applicants.forEach((applicant, index) => {
      if (!applicant.trim()) {
        newErrors[`applicant_${index}`] = "Applicant name is required.";
      }
    });

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

    const submissionData = new FormData();
    submissionData.append("title", formData.title);
    submissionData.append("applicant", JSON.stringify(formData.applicants));
    submissionData.append("status", formData.status);
    submissionData.append("certificate", formData.certificate);
    submissionData.append("userId", userId);

    try {
      const response = await axios.post(`${BACKEND_API}/patents/add`, submissionData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `${token}`,
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({
          title: "",
          numberOfApplicants: 1,
          applicants: [""],
          status: "",
          certificate: null,
        });
        setErrors({});
      } else {
        toast.error(response.data.message || "Failed to submit patent details.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit patent details. Please try again.");
    }
  };

  return (
    <div
      className={`conference-form-main-container
      ${sideBarOpen ? "conference-form-open" : ""}
    `}
    >
      <div className="conference-form-container">
        <h2>Patent Submission Form</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Patent Title */}
          <div className="form-group">
            <label htmlFor="title">
              Patent Title<span className="required">*</span>
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

          {/* Number of Applicants */}
          <div className="form-group">
            <label htmlFor="numberOfApplicants">
              Number of Applicants<span className="required">*</span>
            </label>
            <input
              type="number"
              id="numberOfApplicants"
              name="numberOfApplicants"
              value={formData.numberOfApplicants}
              onChange={handleChange}
              min="1"
              className={errors.numberOfApplicants ? "error" : ""}
            />
          </div>

          {/* Applicant Names */}
          {formData.applicants.map((applicant, index) => (
            <div className="form-group" key={index}>
              <label htmlFor={`applicant_${index}`}>
                Applicant Name {index + 1}<span className="required">*</span>
              </label>
              <input
                type="text"
                id={`applicant_${index}`}
                name={`applicant_${index}`}
                value={applicant}
                onChange={handleChange}
                className={errors[`applicant_${index}`] ? "error" : ""}
              />
              {errors[`applicant_${index}`] && (
                <span className="error-message">{errors[`applicant_${index}`]}</span>
              )}
            </div>
          ))}

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
              className={errors.status ? "error" : ""}
            >
              <option value="">--Select Status--</option>
              <option value="Submitted">Submitted</option>
              <option value="Published">Published</option>
              <option value="Granted">Granted</option>
            </select>
            {errors.status && <span className="error-message">{errors.status}</span>}
          </div>

          {/* Upload Certificate (if Granted) */}
          {formData.status === "Granted" && (
            <div className="form-group">
              <label htmlFor="certificate">
                Upload Grant Certificate<span className="required">*</span>
              </label>
              <input
                type="file"
                id="certificate"
                name="certificate"
                accept=".pdf"
                onChange={handleChange}
                className={errors.certificate ? "error" : ""}
              />
              {errors.certificate && (
                <span className="error-message">{errors.certificate}</span>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" className="submit-button">
            Submit Patent
          </button>
        </form>

        {/* Toast Notifications */}
        <ToastContainer />
      </div>
    </div>
  );
};

export default AddPatent;
