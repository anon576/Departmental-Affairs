import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./conferenceUpdate.css";

const UpdateConference = () => {
  const { id } = useParams(); // Assume the conference id is passed via the URL
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

  useEffect(() => {
    // Fetch existing conference data to pre-fill the form
    fetchConferenceData();
  }, []);

  const fetchConferenceData = async () => {
    try {
      const response = await axios.get(`/api/conferences/${id}`); // Replace with your API endpoint
      const { authors } = response.data;
      setConferenceData(response.data);
      setNumAuthors(authors.length);
    } catch (error) {
      console.error("Error fetching conference data", error);
    }
  };

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
    formData.append("date", conferenceData.date);
    formData.append("registrationFee", conferenceData.registrationFee);
    formData.append("attended", conferenceData.attended);
    formData.append("authors", JSON.stringify(conferenceData.authors));
    formData.append("paperTitle", conferenceData.paperTitle);
    formData.append("status", conferenceData.status);
    formData.append("indexed", conferenceData.indexed);
    if (conferenceData.publishedPaper) {
      formData.append("publishedPaper", conferenceData.publishedPaper);
    }

    try {
      await axios.put(`/api/conferences/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Conference updated successfully");
      navigate("/conferences");
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
          />
        </div>

        <div>
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={conferenceData.date}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Registration Fee</label>
          <input
            type="number"
            name="registrationFee"
            value={conferenceData.registrationFee}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Attended</label>
          <select
            name="attended"
            value={conferenceData.attended}
            onChange={handleChange}
          >
            <option value="offline">Offline</option>
            <option value="online">Online</option>
          </select>
        </div>

        <div>
          <label>Number of Authors</label>
          <input
            type="number"
            value={numAuthors}
            onChange={(e) => setNumAuthors(Number(e.target.value))}
          />
        </div>

        {[...Array(numAuthors)].map((_, index) => (
          <div key={index}>
            <label>Author {index + 1}</label>
            <input
              type="text"
              value={conferenceData.authors[index] || ""}
              onChange={(e) => handleAuthorChange(index, e)}
            />
          </div>
        ))}

        <div>
          <label>Title of Paper</label>
          <input
            type="text"
            name="paperTitle"
            value={conferenceData.paperTitle}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Status</label>
          <select
            name="status"
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
            value={conferenceData.indexed}
            onChange={handleChange}
          >
            <option value="scopus">Scopus</option>
            <option value="wos">WOS</option>
            <option value="acm">ACM</option>
            <option value="ieee">IEEE</option>
          </select>
        </div>

        <div>
          <label>Upload Published Paper</label>
          <input
            type="file"
            name="publishedPaper"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
          />
        </div>

        <button type="submit" className="submit-button">Update Conference</button>
        {errors.submit && <p style={{ color: "red" }}>{errors.submit}</p>}
      </form>
    </div>
  );
};

export default UpdateConference;
