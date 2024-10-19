import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ViewProposalHod = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { proposalData } = location.state || {};
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set loading state to true before processing the data
    setLoading(true);
    // Additional logic for fetching proposal data can go here if needed
    setLoading(false); // Stop loading once data is set
  }, [proposalData]);



  if (loading) {
    return <p>Loading proposal details...</p>;
  }

  if (!proposalData) {
    return <p>Proposal not found.</p>;
  }

  // Convert team members (if needed) and adjust the access based on the new schema
  const teamMembers = [proposalData.PI, proposalData.CoPI]; // Assuming you want to list PI and CoPI

  return (
    <div className="conference-view-main-container">
      <div className="view-conference-container">
        <h2>Proposal Details</h2>
        <div className="conference-details">
          <p>
            <strong>Title of Proposal:</strong> {proposalData.title}
          </p>
          <p>
            <strong>Agency:</strong> {proposalData.agency}
          </p>
          <p>
            <strong>Submission Date:</strong>{" "}
            {new Date(proposalData.dateOfSubmission).toLocaleDateString()}
          </p>
          <p>
            <strong>Amount Claimed:</strong> ${proposalData.amountClaimed}
          </p>
          <p>
            <strong>Status:</strong> {proposalData.status}
          </p>
          <p>
            <strong>Team Members:</strong>
          </p>
          <ul>
            {teamMembers.map((member, index) => (
              <li key={index}>{member}</li>
            ))}
          </ul>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(proposalData.createdAt).toLocaleDateString()}
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

export default ViewProposalHod;
