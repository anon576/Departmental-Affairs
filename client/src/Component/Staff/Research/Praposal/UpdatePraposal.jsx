import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { BACKEND_API } from "../../../constant";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateProposal = () => {
  const location = useLocation();
  const { proposal } = location.state || {};
  const [proposalData, setProposalData] = useState({
    title: "",
    agency: "",
    status: "",
    amountClaimed: "",
    PI: "",
    CoPI: "",
    dateOfSubmission: "",
    proposalPDF: null,
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const convertDateFormat = (inputDate) => {
    const date = new Date(inputDate);
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', inputDate);
      return '';
    }
    // Format the date as yyyy-MM-dd
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (proposal) {
      setProposalData({
        title: proposal.title || "",
        agency: proposal.agency || "",
        status: proposal.status || "",
        amountClaimed: proposal.amountClaimed || "",
        PI: proposal.PI || "",
        CoPI: proposal.CoPI || "",
        dateOfSubmission: proposal.dateOfSubmission ? convertDateFormat(proposal.dateOfSubmission) : "",
        proposalPDF: null, // File uploads are handled separately
      });
    }
  }, [proposal]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "file") {
      setProposalData({ ...proposalData, [name]: e.target.files[0] });
    } else {
      setProposalData({ ...proposalData, [name]: value });
    }
  };

  // Validate the form
  const validate = () => {
    const newErrors = {};

    if (!proposalData.title.trim())
      newErrors.title = "Title is required.";
    if (!proposalData.agency)
      newErrors.agency = "Agency is required.";
    if (!proposalData.status)
      newErrors.status = "Status is required.";
    if (!proposalData.amountClaimed) {
      newErrors.amountClaimed = "Amount claimed is required.";
    } else if (isNaN(proposalData.amountClaimed)) {
      newErrors.amountClaimed = "Amount claimed must be a number.";
    }
    if (!proposalData.PI.trim())
      newErrors.PI = "PI is required.";
    if (!proposalData.CoPI.trim())
      newErrors.CoPI = "Co-PI is required.";
    if (!proposalData.dateOfSubmission)
      newErrors.dateOfSubmission = "Date of submission is required.";
  

    setErrors(newErrors);

    // If no errors, return true
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

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
    submissionData.append("title", proposalData.title);
    submissionData.append("agency", proposalData.agency);
    submissionData.append("status", proposalData.status);
    submissionData.append("amountClaimed", proposalData.amountClaimed);
    submissionData.append("PI", proposalData.PI);
    submissionData.append("CoPI", proposalData.CoPI);
    submissionData.append("dateOfSubmission", proposalData.dateOfSubmission);
    submissionData.append("userId", userId); 

    try {
      const response = await axios.put(`${BACKEND_API}/proposals/update/${proposal.proposalID}`, submissionData, {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Handle the response from the server
      if (response.data.success) {
        toast.success(response.data.message); // Display success message from response
        // Optionally, navigate to the proposals list or another page
        navigate("/praposal/list"); // Redirect to proposals list or another appropriate page
      } else {
        toast.error(response.data.message || "Failed to update proposal details.");
      }
    } catch (error) {
      console.error("Error updating proposal", error);
      toast.error("Failed to update proposal details. Please try again.");
    }
  };

  if (!proposal) {
    return <p>Proposal not found.</p>;
  }

  return (
    <div className="conference-upadate-main-container">
      <div className="conference-form-container">
        <h2>Update Proposal</h2>
        <form onSubmit={handleSubmit} className="conference-update-form" encType="multipart/form-data">
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">
              Title<span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={proposalData.title}
              onChange={handleChange}
              className={errors.title ? "error" : ""}
              required
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
              value={proposalData.agency}
              onChange={handleChange}
              className={errors.agency ? "error" : ""}
              required
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

          {/* Status */}
          <div className="form-group">
            <label htmlFor="status">
              Status<span className="required">*</span>
            </label>
            <select
              id="status"
              name="status"
              value={proposalData.status}
              onChange={handleChange}
              className={errors.status ? "error" : ""}
              required
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
              value={proposalData.amountClaimed}
              onChange={handleChange}
              className={errors.amountClaimed ? "error" : ""}
              min="0"
              step="0.01"
              required
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
              value={proposalData.PI}
              onChange={handleChange}
              className={errors.PI ? "error" : ""}
              required
            />
            {errors.PI && (
              <span className="error-message">{errors.PI}</span>
            )}
          </div>

          {/* CoPI */}
          <div className="form-group">
            <label htmlFor="CoPI">
              Co-PI (Co-Principal Investigator)<span className="required">*</span>
            </label>
            <input
              type="text"
              id="CoPI"
              name="CoPI"
              value={proposalData.CoPI}
              onChange={handleChange}
              className={errors.CoPI ? "error" : ""}
              required
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
              value={proposalData.dateOfSubmission}
              onChange={handleChange}
              className={errors.dateOfSubmission ? "error" : ""}
              required
            />
            {errors.dateOfSubmission && (
              <span className="error-message">{errors.dateOfSubmission}</span>
            )}
          </div>



          {/* Submit Button */}
          <button type="submit" className="btn">
            Update Proposal
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UpdateProposal;
