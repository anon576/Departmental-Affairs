import React, { useEffect, useState } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "./viewConference.css";

const ViewConference = () => {
  const navigate = useNavigate();
  const location = useLocation();
	const { conferenceData } = location.state || {};
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set loading state to true before processing the data
    setLoading(true);
    // You can add any additional logic if needed
    setLoading(false); // Stop loading once data is set
  }, [conferenceData]);

  if (loading) {
    return <p>Loading conference details...</p>;
  }

  if (!conferenceData) {
    return <p>Conference not found.</p>;
  }

  // Convert authors and indexed string to array
  const authors = JSON.parse(conferenceData.authors);

  const handleUpdate = (conference) => {
    navigate(`/conferences/update`,{ state: {  conference } });;
  };

  return (
    <div className="conference-view-main-container">
      <div className="view-conference-container">
        <h2>Conference Details</h2>
        <div className="conference-details">
          <p>
            <strong>Name of Conference:</strong> {conferenceData.conferenceName}
          </p>
          <p>
            <strong>Venue:</strong> {conferenceData.venue}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(conferenceData.conferenceDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Registration Fee:</strong> ${conferenceData.registrationFee}
          </p>
          <p>
            <strong>Attended Mode:</strong> {conferenceData.attendedMode}
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
            <strong>Title of Paper:</strong> {conferenceData.paperTitle}
          </p>
          <p>
            <strong>Status:</strong> {conferenceData.paperStatus}
          </p>
          <p>
            <strong>Indexed:</strong> {conferenceData.indexed}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(conferenceData.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="view-conference-buttons">
          <button className="back-button" onClick={() => navigate(-1)}>
            Back to List
          </button>

          <button
            className="back-button"
            onClick={() => handleUpdate(conferenceData)}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewConference;