// src/components/ViewConference.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ConferenceForm.css";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ViewConference = () => {
  const { id } = useParams();
  const [conference, setConference] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchConference();
    // eslint-disable-next-line
  }, [id]);

  const fetchConference = async () => {
    try {
      const response = await axios.get(`/api/conferences/${id}`);
      setConference(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching conference details:", error);
      toast.error("Failed to fetch conference details.");
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading conference details...</p>;
  }

  if (!conference) {
    return <p>Conference not found.</p>;
  }

  return (
    <div className="view-conference-container">
      <h2>Conference Details</h2>
      <div className="conference-details">
        <p>
          <strong>Name of Conference:</strong> {conference.conferenceName}
        </p>
        <p>
          <strong>Venue:</strong> {conference.venue}
        </p>
        <p>
          <strong>Date:</strong> {new Date(conference.date).toLocaleDateString()}
        </p>
        <p>
          <strong>Registration Fee:</strong> ${conference.registrationFee}
        </p>
        <p>
          <strong>Attended:</strong> {conference.attended}
        </p>
        <p>
          <strong>Authors:</strong>
        </p>
        <ul>
          {conference.authors.map((author, index) => (
            <li key={index}>{author}</li>
          ))}
        </ul>
        <p>
          <strong>Title of Paper:</strong> {conference.paperTitle}
        </p>
        <p>
          <strong>Status:</strong> {conference.status}
        </p>
        <p>
          <strong>Indexed:</strong> {conference.indexed.join(", ")}
        </p>
        <p>
          <strong>Published Paper:</strong>{" "}
          <a href={conference.publishedPaperUrl} target="_blank" rel="noopener noreferrer">
            View Paper
          </a>
        </p>
      </div>
      <button className="back-button" onClick={() => navigate(-1)}>
        Back to List
      </button>
    </div>
  );
};

export default ViewConference;
