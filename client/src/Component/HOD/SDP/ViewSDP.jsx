import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ViewSDPHod = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sdpData } = location.state || {};
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set loading state to true before processing the data
    setLoading(true);
    // Additional logic for fetching SDP data can go here if needed
    setLoading(false); // Stop loading once data is set
  }, [sdpData]);

 
  if (loading) {
    return <p>Loading SDP details...</p>;
  }

  if (!sdpData) {
    return <p>SDP not found.</p>;
  }

  return (
    <div className="conference-view-main-container">
      <div className="view-conference-container">
        <h2>SDP Details</h2>
        <div className="conference-details">
          <p>
            <strong>Title of SDP:</strong> {sdpData.title}
          </p>
          <p>
            <strong>Duration:</strong> {sdpData.duration}
          </p>
          <p>
            <strong>Number of Days:</strong> {sdpData.noOfDays}
          </p>
          <p>
            <strong>Number of Beneficiaries:</strong> {sdpData.noOfBeneficiary}
          </p>
          <p>
            <strong>Created At:</strong> {new Date(sdpData.createdAt).toLocaleDateString()}
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

export default ViewSDPHod;
