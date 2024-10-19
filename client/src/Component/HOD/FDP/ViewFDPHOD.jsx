import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ViewFDPHOD = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fdpData } = location.state || {};
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set loading state to true before processing the data
    setLoading(true);
    // Additional logic for fetching FDP data can go here if needed
    setLoading(false); // Stop loading once data is set
  }, [fdpData]);


  if (loading) {
    return <p>Loading FDP details...</p>;
  }

  if (!fdpData) {
    return <p>FDP not found.</p>;
  }

  return (
    <div className="conference-view-main-container">
      <div className="view-conference-container">
        <h2>FDP Details</h2>
        <div className="conference-details">
          <p>
            <strong>Title of FDP:</strong> {fdpData.title}
          </p>
          <p>
            <strong>Type:</strong> {fdpData.type}
          </p>
          <p>
            <strong>Status:</strong> {fdpData.status}
          </p>
          <p>
            <strong>Number of Days:</strong> {fdpData.noOfDays}
          </p>
          <p>
            <strong>Duration:</strong> {fdpData.duration}
          </p>
          <p>
            <strong>Registration Fee:</strong> ₹{fdpData.regFee}
          </p>
          <p>
            <strong>Venue:</strong> {fdpData.venue}
          </p>
          <p>
            <strong>Number of Participants:</strong> {fdpData.noOfParticipant}
          </p>
          <p>
            <strong>Sponsored:</strong> {fdpData.Sponsored === "yes" ? "Yes" : "No"}
          </p>
          {fdpData.Sponsored === "yes" && (
            <p>
              <strong>Name of Sponsor:</strong> {fdpData.nameOfSponser}
            </p>
          )}
          <p>
            <strong>Created At:</strong> {new Date(fdpData.createdAt).toLocaleDateString()}
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

export default ViewFDPHOD;
