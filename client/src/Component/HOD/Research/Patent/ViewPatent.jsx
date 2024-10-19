import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ViewPatentHod = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { patentData } = location.state || {};
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set loading state to true before processing the data
    setLoading(true);
    // Additional logic for fetching patent data can go here if needed
    setLoading(false); // Stop loading once data is set
  }, [patentData]);

  
  if (loading) {
    return <p>Loading patent details...</p>;
  }

  if (!patentData) {
    return <p>Patent not found.</p>;
  }

  // Convert team members (if needed) and adjust the access based on the new schema
  const teamMembers = [patentData.applicant]; // Assuming applicant is the main team member

  return (
    <div className="conference-view-main-container">
      <div className="view-conference-container">
        <h2>Patent Details</h2>
        <div className="conference-details">
          <p>
            <strong>Title of Patent:</strong> {patentData.title}
          </p>
          <p>
            <strong>Applicant:</strong> {patentData.applicant}
          </p>
          <p>
            <strong>Submission Date:</strong>{" "}
            {new Date(patentData.dateOfSubmission).toLocaleDateString()}
          </p>
          <p>
            <strong>Status:</strong> {patentData.status}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(patentData.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="view-conference-buttons">
          <button className="back-button" onClick={() => navigate(-1)}>
            Back to List
          </button>

         
        </div>
      </div>
    </div>
  );
};

export default ViewPatentHod;
