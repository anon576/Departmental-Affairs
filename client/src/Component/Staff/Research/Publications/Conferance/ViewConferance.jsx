import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./viewConference.css";

const ViewConference = () => {
  const { id } = useParams();
  const [conference, setConference] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchConference();
  }, [id]);

  const fetchConference = async () => {
    const sampleConferences = {
      _id: "1",
      conferenceName: "AI Innovations 2024",
      paperTitle: "Deep Learning in Healthcare",
      indexed: ["IEEE", "Springer"],
      date: "2024-11-05",
      location: "New York, USA",
      status: "Upcoming",
      venue: "Some Venue",
      registrationFee: 200,
      attended: true,
      authors: ["John Doe", "Jane Smith"],
      publishedPaperUrl: "https://example.com/paper",
    };

    setConference(sampleConferences);
    setLoading(false); // Stop loading once data is set
  };

  if (loading) {
    return <p>Loading conference details...</p>;
  }

  if (!conference) {
    return <p>Conference not found.</p>;
  }

  return (
    <div className="conference-view-main-container">
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
            <strong>Date:</strong>{" "}
            {new Date(conference.date).toLocaleDateString()}
          </p>
          <p>
            <strong>Registration Fee:</strong> ${conference.registrationFee}
          </p>
          <p>
            <strong>Attended:</strong> {conference.attended ? "Yes" : "No"}
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
            <a
              href={conference.publishedPaperUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Paper
            </a>
          </p>
        </div>
        <div className="view-conference-buttons">
          <button className="back-button" onClick={() => navigate(-1)}>
            Back to List
          </button>

          <button
            className="back-button"
            onClick={() => navigate(`/conferences/update/${conference._id}`)}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewConference;
