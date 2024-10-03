import React, { useState, useEffect } from "react";
import axios from "axios";
import {useLocation} from 'react-router-dom'
import { useNavigate, useParams } from "react-router-dom";
import "./conferenceUpdate.css";
import { BACKEND_API } from "../../../../constant";

const UpdateConference = () => {
  const location = useLocation();
	const { conference } = location.state || {};
  const [conferenceData, setConferenceData] = useState({
    conferenceName: "",
    venue: "",
    date: "",
    registrationFee: "",
    attended: "",
    authors: [],
    paperTitle: "",
    status: "",
    indexed: "",
    publishedPaper: null,
  });
  const [numAuthors, setNumAuthors] = useState(1);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const convertDateFormat = (inputDate) => {
    const date = new Date(inputDate);
    if (isNaN(date.getTime())) {
        console.error('Invalid date:', inputDate);
        return 'Invalid Date';
    }
    // Format the date as yyyy-MM-dd
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

useEffect(() => {
  if (conference) {
    const authorsArray = JSON.parse(conference.authors || "[]");

    setConferenceData(prevData => ({
      ...prevData,
      conferenceName: conference.conferenceName || "",
      venue: conference.venue || "",
      date: conference.conferenceDate ? convertDateFormat(conference.conferenceDate) : "",
      registrationFee: conference.registrationFee || "",
      attended: conference.attendedMode || "",
      authors: authorsArray, // Ensure authors is an array
      paperTitle: conference.paperTitle || "",
      status: conference.paperStatus || "",
      indexed: conference.indexed || "",
      publishedPaper: conference.publishedPaper || null,
    }));

    setNumAuthors(authorsArray.length);
  }
}, [conference]);


 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConferenceData({ ...conferenceData, [name]: value });
  };

  const handleAuthorChange = (index, e) => {
    const updatedAuthors = [...conferenceData.authors];
    updatedAuthors[index] = e.target.value;
    setConferenceData({ ...conferenceData, authors: updatedAuthors });
  };

  const handleFileChange = (e) => {
    setConferenceData({ ...conferenceData, publishedPaper: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validate form data
    if (!conferenceData.conferenceName) {
      setErrors((prev) => ({
        ...prev,
        conferenceName: "Conference name is required",
      }));
      return;
    }
 

    const formData = new FormData();
    formData.append("conferenceName", conferenceData.conferenceName);
    formData.append("venue", conferenceData.venue);
    formData.append("conferenceDate", conferenceData.date);
    formData.append("registrationFee", conferenceData.registrationFee);
    formData.append("attendedMode", conferenceData.attended);
    formData.append("authors", JSON.stringify(conferenceData.authors));
    formData.append("paperTitle", conferenceData.paperTitle);
    formData.append("paperStatus", conferenceData.status);
    formData.append("indexed", conferenceData.indexed);
    if (conferenceData.publishedPaper) {
      formData.append("publishedPaper", conferenceData.publishedPaper);
    }

    try {
      const token = localStorage.getItem("authToken");
      await axios.put(`${BACKEND_API}/conferences/update/${conference.conferenceID}`, formData, {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Conference updated successfully");
    } catch (error) {
      console.error("Error updating conference", error);
      setErrors((prev) => ({ ...prev, submit: "Failed to update conference" }));
    }
  };

  return (
    <div className="conference-upadate-main-container">
      <form onSubmit={handleSubmit} className="conference-update-form" encType="multipart/form-data">
        <h2>Update Conference</h2>
        <div>
          <label>Conference Name</label>
          <input
            type="text"
            name="conferenceName"
            value={conferenceData.conferenceName}
            onChange={handleChange}
            required
          />
          {errors.conferenceName && (
            <p className="error-message">{errors.conferenceName}</p>
          )}
        </div>

        <div>
          <label>Venue</label>
          <input
            type="text"
            name="venue"
            value={conferenceData.venue}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={convertDateFormat(conferenceData.date)}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Registration Fee</label>
          <input
            type="number"
            name="registrationFee"
            value={conferenceData.registrationFee}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Attended</label>
          <select
            name="attended"
            value={conferenceData.attended}
            onChange={handleChange}
            required
          >
            <option value="Offline">Offline</option>
            <option value="Online">Online</option>
          </select>
        </div>

        <div>
          <label>Number of Authors</label>
          <input
            type="number"
            value={numAuthors}
            required
            onChange={(e) => setNumAuthors(Number(e.target.value))}
          />
        </div>

        {[...Array(numAuthors)].map((_, index) => (
          <div key={index}>
            <label>Author {index + 1}</label>
            <input
              type="text"
              required
              value={conferenceData.authors[index] || ""}
              onChange={(e) => handleAuthorChange(index, e)}
            />
          </div>
        ))}

        <div>
          <label>Title of Paper</label>
          <input
            type="text"
            required
            name="paperTitle"
            value={conferenceData.paperTitle}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Status</label>
          <select
            name="status"
            required
            value={conferenceData.status}
            onChange={handleChange}
          >
            <option value="Accepted">Accepted</option>
            <option value="Presented">Presented</option>
            <option value="Published">Published</option>
          </select>
        </div>

        <div>
          <label>Indexed</label>
          <select
            name="indexed"
            required
            value={conferenceData.indexed}
            onChange={handleChange}
          >
            <option value="scopus">Scopus</option>
            <option value="wos">WOS</option>
            <option value="acm">ACM</option>
            <option value="ieee">IEEE</option>
          </select>
        </div>



        <button type="submit" className="submit-button">Update Conference</button>
        {errors.submit && <p style={{ color: "red" }}>{errors.submit}</p>}
      </form>
    </div>
  );
};

export default UpdateConference;
