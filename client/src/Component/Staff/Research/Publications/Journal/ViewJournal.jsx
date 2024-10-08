import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ViewJournal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { journalData } = location.state || {};
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set loading state to true before processing the data
    setLoading(true);
    // You can add any additional logic if needed
    setLoading(false); // Stop loading once data is set
  }, [journalData]);

  if (loading) {
    return <p>Loading journal details...</p>;
  }

  if (!journalData) {
    return <p>Journal not found.</p>;
  }

  const handleUpdate = (journal) => {
    navigate(`/journal/update`, { state: { journal } });
  };
  // Convert authors string to array if it's in JSON format
  const authors = JSON.parse(journalData.authors);

  return (
    <div className="conference-view-main-container">
    <div className="view-conference-container">
        <h2>Journal Details</h2>
        <div className="conference-details">
          <p>
            <strong>Name of Journal:</strong> {journalData.journalName}
          </p>
          <p>
            <strong>Venue:</strong> {journalData.venue}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(journalData.journalDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Registration Fee:</strong> ${journalData.registrationFee}
          </p>
          <p>
            <strong>Attended Mode:</strong> {journalData.attendedMode}
          </p>
          <p>
            <strong>Authors:</strong>
          </p>
          <ul>
            {authors.map((author, index) => (
              <li key={index}>{author}</li>
            ))}
          </ul>
          <p>
            <strong>Title of Paper:</strong> {journalData.paperTitle}
          </p>
          <p>
            <strong>Status:</strong> {journalData.paperStatus}
          </p>
          <p>
            <strong>Indexed:</strong> {journalData.indexed}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(journalData.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="view-conference-buttons">
          <button className="back-button" onClick={() => navigate(-1)}>
            Back to List
          </button>

          <button
             className="back-button"
            onClick={() => handleUpdate(journalData)}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewJournal;
