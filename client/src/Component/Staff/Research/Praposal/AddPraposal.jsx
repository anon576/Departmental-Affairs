import React, { useContext, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppContext } from "../../../Context/AppContext";
import { BACKEND_API } from "../../../constant";

const AddProposal = () => {
  const [formData, setFormData] = useState({
    title: "",
    agency: "",
    otherAgencyName: "", // To hold the name if 'Other Institute' is selected
    status: "",
    amountClaimed: "",
    PI: "",
    CoPI: "",
    dateOfSubmission: "",
    proposalPDF: null,
  });

  const { sideBarOpen } = useContext(AppContext);
  const [errors, setErrors] = useState({});

  // Toggle visibility of 'Other Institute' name input
  const showOtherAgencyInput = formData.agency === "Other Institute";

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "agency") {
      // If 'Other Institute' is selected, retain the existing name, else clear it
      if (value === "Other Institute") {
        setFormData({ ...formData, agency: value, otherAgencyName: "" });
      } else {
        setFormData({ ...formData, agency: value });
      }
    } else if (name === "otherAgencyName") {
      setFormData({ ...formData, otherAgencyName: value, agency: value }); // Update both agency and otherAgencyName
    } else if (type === "file") {
      setFormData({ ...formData, [name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Validate the form
  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required.";
    if (!formData.agency) newErrors.agency = "Agency is required.";
    if (formData.agency === "Other Institute" && !formData.otherAgencyName.trim()) {
      newErrors.otherAgencyName = "Please specify the name of the institute.";
    }
    if (!formData.status) newErrors.status = "Status is required.";
    if (!formData.amountClaimed) {
      newErrors.amountClaimed = "Amount claimed is required.";
    } else if (isNaN(formData.amountClaimed)) {
      newErrors.amountClaimed = "Amount claimed must be a number.";
    }
    if (!formData.PI.trim()) newErrors.PI = "PI is required.";
    if (!formData.CoPI.trim()) newErrors.CoPI = "Co-PI is required.";
    if (!formData.dateOfSubmission) newErrors.dateOfSubmission = "Date of submission is required.";
    if (!formData.proposalPDF) {
      newErrors.proposalPDF = "Please upload the proposal PDF.";
    } else {
      const allowedTypes = ["application/pdf"];
      if (!allowedTypes.includes(formData.proposalPDF.type)) {
        newErrors.proposalPDF = "Only PDF files are allowed.";
      }
    }

    setErrors(newErrors);

    // If no errors, return true
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    // Fetch the auth token and userId from localStorage
    const token = localStorage.getItem("authToken");
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser?.userId;

    // Prepare form data for submission
    const submissionData = new FormData();
    submissionData.append("proposalTitle", formData.title);
    submissionData.append("proposalDate", formData.dateOfSubmission);
    submissionData.append("agency", formData.agency === "Other Institute" ? formData.otherAgencyName : formData.agency); 
    submissionData.append("submissionStatus", formData.status);
    submissionData.append("fundingAmount", formData.amountClaimed);
    submissionData.append("PI", formData.PI);
    submissionData.append("CoPI", formData.CoPI);
    submissionData.append("proposalPDF", formData.proposalPDF);
    submissionData.append("userId", userId); 

    try {
      const response = await axios.post(`${BACKEND_API}/proposals/add`, submissionData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `${token}`, // Include auth token in headers
        },
      });

      // Handle the response from the server
      if (response.data.success) {
        toast.success(response.data.message); // Display success message from response
        // Reset form
        setFormData({
          title: "",
          agency: "",
          otherAgencyName: "",
          status: "",
          amountClaimed: "",
          PI: "",
          CoPI: "",
          dateOfSubmission: "",
          proposalPDF: null,
        });
        setErrors({});
        console.log(response.data.proposalID); // Optionally handle proposalID
      } else {
        toast.error(response.data.message || "Failed to submit proposal details.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit proposal details. Please try again.");
    }
  };

  return (
    <div
      className={`conference-form-main-container
      ${sideBarOpen ? "conference-form-open" : ""}
    `}
    >
      <div className="conference-form-container">
        <h2>Proposal Submission Form</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
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
              className={errors.title ? "error" : ""}
            />
            {errors.title && (
              <span className="error-message">{errors.title}</span>
            )}
          </div>

          {/* Agency */}
          <div className="form-group">
            <label htmlFor="agency">
              Agency<span className="required">*</span>
            </label>
            <select
              id="agency"
              name="agency"
              value={formData.agency}
              onChange={handleChange}
              className={errors.agency ? "error" : ""}
            >
              <option value="">--Select Agency--</option>
              <option value="Government">Government</option>
              <option value="Inhouse">Inhouse</option>
              <option value="University">University</option>
              <option value="Other Institute">Other Institute</option>
            </select>
            {errors.agency && (
              <span className="error-message">{errors.agency}</span>
            )}
          </div>

          {/* Other Agency Name */}
          {showOtherAgencyInput && (
            <div className="form-group">
              <label htmlFor="otherAgencyName">
                Name of Institute<span className="required">*</span>
              </label>
              <input
                type="text"
                id="otherAgencyName"
                name="otherAgencyName"
                value={formData.otherAgencyName}
                onChange={handleChange}
                className={errors.otherAgencyName ? "error" : ""}
              />
              {errors.otherAgencyName && (
                <span className="error-message">{errors.otherAgencyName}</span>
              )}
            </div>
          )}

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
              <option value="Accepted">Accepted</option>
              <option value="Granted">Granted</option>
            </select>
            {errors.status && (
              <span className="error-message">{errors.status}</span>
            )}
          </div>

          {/* Amount Claimed */}
          <div className="form-group">
            <label htmlFor="amountClaimed">
              Amount Claimed (USD)<span className="required">*</span>
            </label>
            <input
              type="number"
              id="amountClaimed"
              name="amountClaimed"
              value={formData.amountClaimed}
              onChange={handleChange}
              className={errors.amountClaimed ? "error" : ""}
              min="0"
              step="0.01"
            />
            {errors.amountClaimed && (
              <span className="error-message">{errors.amountClaimed}</span>
            )}
          </div>

          {/* PI */}
          <div className="form-group">
            <label htmlFor="PI">
              PI (Principal Investigator)<span className="required">*</span>
            </label>
            <input
              type="text"
              id="PI"
              name="PI"
              value={formData.PI}
              onChange={handleChange}
              className={errors.PI ? "error" : ""}
            />
            {errors.PI && (
              <span className="error-message">{errors.PI}</span>
            )}
          </div>

          {/* Co-PI */}
          <div className="form-group">
            <label htmlFor="CoPI">
              Co-PI<span className="required">*</span>
            </label>
            <input
              type="text"
              id="CoPI"
              name="CoPI"
              value={formData.CoPI}
              onChange={handleChange}
              className={errors.CoPI ? "error" : ""}
            />
            {errors.CoPI && (
              <span className="error-message">{errors.CoPI}</span>
            )}
          </div>

          {/* Date of Submission */}
          <div className="form-group">
            <label htmlFor="dateOfSubmission">
              Date of Submission<span className="required">*</span>
            </label>
            <input
              type="date"
              id="dateOfSubmission"
              name="dateOfSubmission"
              value={formData.dateOfSubmission}
              onChange={handleChange}
              className={errors.dateOfSubmission ? "error" : ""}
            />
            {errors.dateOfSubmission && (
              <span className="error-message">{errors.dateOfSubmission}</span>
            )}
          </div>

          {/* Upload Proposal PDF */}
          <div className="form-group">
            <label htmlFor="proposalPDF">
              Upload Proposal PDF<span className="required">*</span>
            </label>
            <input
              type="file"
              id="proposalPDF"
              name="proposalPDF"
              accept=".pdf"
              onChange={handleChange}
              className={errors.proposalPDF ? "error" : ""}
            />
            {errors.proposalPDF && (
              <span className="error-message">{errors.proposalPDF}</span>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-button">
            Submit Proposal
          </button>
        </form>

        {/* Toast Notifications */}
        <ToastContainer />
      </div>
    </div>
  );
};

export default AddProposal;
