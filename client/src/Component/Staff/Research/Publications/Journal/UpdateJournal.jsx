import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACKEND_API } from "../../../../constant";

const UpdateJournal = () => {
  const location = useLocation();
  const { journal } = location.state || {}; // Renamed to 'journal' for clarity
  const navigate = useNavigate();

  const [journalData, setJournalData] = useState({
    journalName: "",
    venue: "",
    journalDate: "",
    registrationFee: "",
    attendedMode: "",
    authors: [""],
    paperTitle: "",
    paperStatus: "",
    indexed: [],
    publishedPaper: null,
  });
  
  const [numAuthors, setNumAuthors] = useState(1);
  const [errors, setErrors] = useState({});

  // Convert date to yyyy-MM-dd format
  const convertDateFormat = (inputDate) => {
    const date = new Date(inputDate);
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', inputDate);
      return '';
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (journal) {
      const authorsArray = JSON.parse(journal.authors || "[]");
      const indexedArray = Array.isArray(journal.indexed) ? journal.indexed : [journal.indexed];

      setJournalData({
        journalName: journal.journalName || "",
        venue: journal.venue || "",
        journalDate: journal.journalDate ? convertDateFormat(journal.journalDate) : "",
        registrationFee: journal.registrationFee || "",
        attendedMode: journal.attendedMode || "",
        authors: authorsArray.length > 0 ? authorsArray : [""],
        paperTitle: journal.paperTitle || "",
        paperStatus: journal.paperStatus || "",
        indexed: indexedArray || [],
        publishedPaper: null, // File uploads are handled separately
      });

      setNumAuthors(authorsArray.length > 0 ? authorsArray.length : 1);
    }
  }, [journal]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("author")) {
      const index = parseInt(name.split("_")[1]);
      const newAuthors = [...journalData.authors];
      newAuthors[index] = value;
      setJournalData({ ...journalData, authors: newAuthors });
    } else if (name === "indexed") {
      let newIndexed = [...journalData.indexed];
      if (checked) {
        newIndexed.push(value);
      } else {
        newIndexed = newIndexed.filter((item) => item !== value);
      }
      setJournalData({ ...journalData, indexed: newIndexed });
    } else if (type === "file") {
      setJournalData({ ...journalData, [name]: e.target.files[0] });
    } else {
      setJournalData({ ...journalData, [name]: value });
    }
  };

  // Handle number of authors change
  const handleNumberOfAuthorsChange = (e) => {
    const value = e.target.value;

    // Allow empty value to be entered in the input field temporarily
    if (value === "") {
      setJournalData({
        ...journalData,
        authors: [],
      });
      setNumAuthors(0);
      return;
    }

    // Convert the value to a number
    const num = parseInt(value, 10);

    // Only update if the number is greater than or equal to 1
    if (num >= 1) {
      const newAuthors = [...journalData.authors];
      if (num > journalData.authors.length) {
        setJournalData({
          ...journalData,
          authors: [...newAuthors, ...Array(num - newAuthors.length).fill("")],
        });
      } else {
        setJournalData({
          ...journalData,
          authors: newAuthors.slice(0, num),
        });
      }
      setNumAuthors(num);
    }
  };

  // Validate the form
  const validate = () => {
    const newErrors = {};

    if (!journalData.journalName.trim())
      newErrors.journalName = "Journal name is required.";
    if (!journalData.venue.trim()) newErrors.venue = "Venue is required.";
    if (!journalData.journalDate) newErrors.journalDate = "Date is required.";
    if (!journalData.registrationFee) {
      newErrors.registrationFee = "Registration fee is required.";
    } else if (isNaN(journalData.registrationFee)) {
      newErrors.registrationFee = "Registration fee must be a number.";
    }
    if (!journalData.attendedMode)
      newErrors.attendedMode = "Please select attendance type.";
    journalData.authors.forEach((author, index) => {
      if (!author.trim()) {
        newErrors[`author_${index}`] = `Author ${index + 1} name is required.`;
      }
    });
    if (!journalData.paperTitle.trim())
      newErrors.paperTitle = "Paper title is required.";
    if (!journalData.paperStatus)
      newErrors.paperStatus = "Please select the paper status.";
    if (journalData.indexed.length === 0)
      newErrors.indexed = "Please select at least one indexing service."

    setErrors(newErrors);

    // If no errors, return true
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    // Prepare form data for submission
    const submissionData = new FormData();
    submissionData.append("journalName", journalData.journalName);
    submissionData.append("venue", journalData.venue);
    submissionData.append("journalDate", journalData.journalDate);
    submissionData.append("registrationFee", journalData.registrationFee);
    submissionData.append("attendedMode", journalData.attendedMode);
    submissionData.append("authors", JSON.stringify(journalData.authors));
    submissionData.append("paperTitle", journalData.paperTitle);
    submissionData.append("paperStatus", journalData.paperStatus);
    submissionData.append("indexed", JSON.stringify(journalData.indexed));
   
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.put(`${BACKEND_API}/journal/update/${journal.journalID}`, submissionData, {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success("Journal updated successfully!");
        // navigate("/journals"); // Redirect to journals list or another appropriate page
      } else {
        toast.error(response.data.message || "Failed to update journal.");
      }
    } catch (error) {
      console.error("Error updating journal", error);
      toast.error("Failed to update journal. Please try again.");
    }
  };

  return (
    <div className="conference-upadate-main-container">
      <div className="conference-update-form-container">
        <h2>Update Journal</h2>
        <form onSubmit={handleSubmit}  encType="multipart/form-data">
          {/* Journal Name */}
          <div className="form-group">
            <label htmlFor="journalName">
              Journal Name<span className="required">*</span>
            </label>
            <input
              type="text"
              id="journalName"
              name="journalName"
              value={journalData.journalName}
              onChange={handleChange}
              className={errors.journalName ? "error" : ""}
            />
            {errors.journalName && (
              <span className="error-message">{errors.journalName}</span>
            )}
          </div>

          {/* Venue */}
          <div className="form-group">
            <label htmlFor="venue">
              Venue<span className="required">*</span>
            </label>
            <input
              type="text"
              id="venue"
              name="venue"
              value={journalData.venue}
              onChange={handleChange}
              className={errors.venue ? "error" : ""}
            />
            {errors.venue && (
              <span className="error-message">{errors.venue}</span>
            )}
          </div>

          {/* Date */}
          <div className="form-group">
            <label htmlFor="journalDate">
              Date<span className="required">*</span>
            </label>
            <input
              type="date"
              id="journalDate"
              name="journalDate"
              value={journalData.journalDate}
              onChange={handleChange}
              className={errors.journalDate ? "error" : ""}
            />
            {errors.journalDate && (
              <span className="error-message">{errors.journalDate}</span>
            )}
          </div>

          {/* Registration Fee */}
          <div className="form-group">
            <label htmlFor="registrationFee">
              Registration Fee (USD)<span className="required">*</span>
            </label>
            <input
              type="number"
              id="registrationFee"
              name="registrationFee"
              value={journalData.registrationFee}
              onChange={handleChange}
              className={errors.registrationFee ? "error" : ""}
              min="0"
              step="0.01"
            />
            {errors.registrationFee && (
              <span className="error-message">{errors.registrationFee}</span>
            )}
          </div>

          {/* Attended Mode */}
          <div className="form-group">
            <label>
              Attended<span className="required">*</span>
            </label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="attendedMode"
                  value="Offline"
                  checked={journalData.attendedMode === "Offline"}
                  onChange={handleChange}
                />
                Offline
              </label>
              <label>
                <input
                  type="radio"
                  name="attendedMode"
                  value="Online"
                  checked={journalData.attendedMode === "Online"}
                  onChange={handleChange}
                />
                Online
              </label>
            </div>
            {errors.attendedMode && (
              <span className="error-message">{errors.attendedMode}</span>
            )}
          </div>

          {/* Number of Authors */}
          <div className="form-group">
            <label htmlFor="numberOfAuthors">
              Number of Authors<span className="required">*</span>
            </label>
            <input
              type="number"
              id="numberOfAuthors"
              name="numberOfAuthors"
              min="1"
              value={numAuthors}
              onChange={handleNumberOfAuthorsChange}
              className={errors.numberOfAuthors ? "error" : ""}
            />
            {errors.numberOfAuthors && (
              <span className="error-message">{errors.numberOfAuthors}</span>
            )}
          </div>

          {/* Author Names */}
          <div className="form-group">
            <label>
              Author Names<span className="required">*</span>
            </label>
            {journalData.authors.map((author, index) => (
              <div key={index} className="author-input">
                <input
                  type="text"
                  name={`author_${index}`}
                  value={author}
                  onChange={handleChange}
                  placeholder={`Author ${index + 1} Name`}
                  className={errors[`author_${index}`] ? "error" : ""}
                />
                {errors[`author_${index}`] && (
                  <span className="error-message">
                    {errors[`author_${index}`]}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Title of Paper */}
          <div className="form-group">
            <label htmlFor="paperTitle">
              Title of Paper<span className="required">*</span>
            </label>
            <input
              type="text"
              id="paperTitle"
              name="paperTitle"
              value={journalData.paperTitle}
              onChange={handleChange}
              className={errors.paperTitle ? "error" : ""}
            />
            {errors.paperTitle && (
              <span className="error-message">{errors.paperTitle}</span>
            )}
          </div>

          {/* Status */}
          <div className="form-group">
            <label htmlFor="paperStatus">
              Status<span className="required">*</span>
            </label>
            <select
              id="paperStatus"
              name="paperStatus"
              value={journalData.paperStatus}
              onChange={handleChange}
              className={errors.paperStatus ? "error" : ""}
            >
              <option value="">--Select Status--</option>
              <option value="Accepted">Accepted</option>
              <option value="Presented">Presented</option>
              <option value="Published">Published</option>
            </select>
            {errors.paperStatus && (
              <span className="error-message">{errors.paperStatus}</span>
            )}
          </div>

          {/* Indexed */}
          <div className="form-group">
            <label>
              Indexed<span className="required">*</span>
            </label>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="indexed"
                  value="Scopus"
                  checked={journalData.indexed.includes("Scopus")}
                  onChange={handleChange}
                />
                Scopus
              </label>
              <label>
                <input
                  type="checkbox"
                  name="indexed"
                  value="WOS"
                  checked={journalData.indexed.includes("WOS")}
                  onChange={handleChange}
                />
                WOS
              </label>
              <label>
                <input
                  type="checkbox"
                  name="indexed"
                  value="ACM"
                  checked={journalData.indexed.includes("ACM")}
                  onChange={handleChange}
                />
                ACM
              </label>
              <label>
                <input
                  type="checkbox"
                  name="indexed"
                  value="IEEE"
                  checked={journalData.indexed.includes("IEEE")}
                  onChange={handleChange}
                />
                IEEE
              </label>
            </div>
            {errors.indexed && (
              <span className="error-message">{errors.indexed}</span>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-button">
            Update Journal
          </button>
          {errors.submit && <p className="error-message">{errors.submit}</p>}
        </form>

        {/* Toast Notifications */}
        <ToastContainer />
      </div>
    </div>
  );
};

export default UpdateJournal;
