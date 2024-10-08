import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ViewCopyright = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { copyrightData } = location.state || {};
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set loading state to true before processing the data
    setLoading(true);
    // Additional logic for fetching copyright data can go here if needed
    setLoading(false); // Stop loading once data is set
  }, [copyrightData]);

  if (loading) {
    return <p>Loading copyright details...</p>;
  }

  if (!copyrightData) {
    return <p>Copyright not found.</p>;
  }

  // Convert team members (if needed) and adjust the access based on the new schema
  const teamMembers = [copyrightData.applicant]; // Assuming applicant is the main team member

  return (
    <div className="conference-view-main-container">
      <div className="view-conference-container">
        <h2>Copyright Details</h2>
        <div className="conference-details">
          <p>
            <strong>Title of Copyright:</strong> {copyrightData.title}
          </p>
          <p>
            <strong>Applicant:</strong> {copyrightData.applicant}
          </p>
          <p>
            <strong>Submission Date:</strong>{" "}
            {new Date(copyrightData.dateOfSubmission).toLocaleDateString()}
          </p>
          <p>
            <strong>Status:</strong> {copyrightData.status}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(copyrightData.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="view-conference-buttons">
          <button className="back-button" onClick={() => navigate(-1)}>
            Back to List
          </button>

          <button
            className="back-button"
            onClick={() =>
              navigate(`/copyrights/update/${copyrightData.copyrightID}`)
            }
          >
            Update Copyright
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewCopyright;
