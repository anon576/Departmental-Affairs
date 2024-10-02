// src/ConferenceForm.jsx
import React, { useContext, useState } from "react";
import axios from "axios";
import "./ConferenceForm.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppContext } from "../../../../Context/AppContext";

const AddConference = () => {
  const [formData, setFormData] = useState({
    conferenceName: "",
    venue: "",
    date: "",
    registrationFee: "",
    attended: "",
    numberOfAuthors: 1,
    authors: [""],
    paperTitle: "",
    status: "",
    indexed: [],
    publishedPaper: null,
  });

  const { sideBarOpen } = useContext(AppContext);

  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("author")) {
      const index = parseInt(name.split("_")[1]);
      const newAuthors = [...formData.authors];
      newAuthors[index] = value;
      setFormData({ ...formData, authors: newAuthors });
    } else if (name === "indexed") {
      let newIndexed = [...formData.indexed];
      if (checked) {
        newIndexed.push(value);
      } else {
        newIndexed = newIndexed.filter((item) => item !== value);
      }
      setFormData({ ...formData, indexed: newIndexed });
    } else if (type === "file") {
      setFormData({ ...formData, [name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle number of authors change
  const handleNumberOfAuthorsChange = (e) => {
    const value = e.target.value;

    // Allow empty value to be entered in the input field temporarily
    if (value === "") {
      setFormData({
        ...formData,
        numberOfAuthors: "",
        authors: [],
      });
      return;
    }

    // Convert the value to a number
    const num = parseInt(value, 10);

    // Only update if the number is greater than or equal to 1
    if (num >= 1) {
      setFormData({
        ...formData,
        numberOfAuthors: num,
        authors: Array(num).fill(""),
      });
    }
  };

  // Validate the form
  const validate = () => {
    const newErrors = {};

    if (!formData.conferenceName.trim())
      newErrors.conferenceName = "Conference name is required.";
    if (!formData.venue.trim()) newErrors.venue = "Venue is required.";
    if (!formData.date) newErrors.date = "Date is required.";
    if (!formData.registrationFee) {
      newErrors.registrationFee = "Registration fee is required.";
    } else if (isNaN(formData.registrationFee)) {
      newErrors.registrationFee = "Registration fee must be a number.";
    }
    if (!formData.attended)
      newErrors.attended = "Please select attendance type.";
    formData.authors.forEach((author, index) => {
      if (!author.trim()) {
        newErrors[`author_${index}`] = `Author ${index + 1} name is required.`;
      }
    });
    if (!formData.paperTitle.trim())
      newErrors.paperTitle = "Paper title is required.";
    if (!formData.status) newErrors.status = "Please select the status.";
    if (formData.indexed.length === 0)
      newErrors.indexed = "Please select at least one indexing service.";
    if (!formData.publishedPaper) {
      newErrors.publishedPaper = "Please upload the published paper.";
    } else {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(formData.publishedPaper.type)) {
        newErrors.publishedPaper = "Only PDF, DOC, and DOCX files are allowed.";
      }
    }

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
    submissionData.append("conferenceName", formData.conferenceName);
    submissionData.append("venue", formData.venue);
    submissionData.append("date", formData.date);
    submissionData.append("registrationFee", formData.registrationFee);
    submissionData.append("attended", formData.attended);
    submissionData.append("authors", JSON.stringify(formData.authors));
    submissionData.append("paperTitle", formData.paperTitle);
    submissionData.append("status", formData.status);
    submissionData.append("indexed", JSON.stringify(formData.indexed));
    submissionData.append("publishedPaper", formData.publishedPaper);

    try {
      const response = await axios.post("/api/conferences", submissionData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Conference details submitted successfully!");
      // Reset form
      setFormData({
        conferenceName: "",
        venue: "",
        date: "",
        registrationFee: "",
        attended: "",
        numberOfAuthors: 1,
        authors: [""],
        paperTitle: "",
        status: "",
        indexed: [],
        publishedPaper: null,
      });
      setErrors({});
      // If needed, handle response data
      console.log(response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit conference details. Please try again.");
    }
  };

  return (
    <div
      className={`conference-form-main-container
      ${sideBarOpen ? "conference-form-open" : ""}
    `}
    >
      <div className="conference-form-container">
        <h2>Conference Submission Form</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Conference Name */}
          <div className="form-group">
            <label htmlFor="conferenceName">
              Name of Conference<span className="required">*</span>
            </label>
            <input
              type="text"
              id="conferenceName"
              name="conferenceName"
              value={formData.conferenceName}
              onChange={handleChange}
              className={errors.conferenceName ? "error" : ""}
            />
            {errors.conferenceName && (
              <span className="error-message">{errors.conferenceName}</span>
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
              value={formData.venue}
              onChange={handleChange}
              className={errors.venue ? "error" : ""}
            />
            {errors.venue && (
              <span className="error-message">{errors.venue}</span>
            )}
          </div>

          {/* Date */}
          <div className="form-group">
            <label htmlFor="date">
              Date<span className="required">*</span>
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={errors.date ? "error" : ""}
            />
            {errors.date && (
              <span className="error-message">{errors.date}</span>
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
              value={formData.registrationFee}
              onChange={handleChange}
              className={errors.registrationFee ? "error" : ""}
            />
            {errors.registrationFee && (
              <span className="error-message">{errors.registrationFee}</span>
            )}
          </div>

          {/* Attended */}
          <div className="form-group">
            <label>
              Attended<span className="required">*</span>
            </label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="attended"
                  value="Offline"
                  checked={formData.attended === "Offline"}
                  onChange={handleChange}
                />
                Offline
              </label>
              <label>
                <input
                  type="radio"
                  name="attended"
                  value="Online"
                  checked={formData.attended === "Online"}
                  onChange={handleChange}
                />
                Online
              </label>
            </div>
            {errors.attended && (
              <span className="error-message">{errors.attended}</span>
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
              // defaultValue="1"
              value={formData.numberOfAuthors}
              onChange={handleNumberOfAuthorsChange}
            />
          </div>

          {/* Author Names */}
          <div className="form-group">
            <label>
              Author Names<span className="required">*</span>
            </label>
            {formData.authors.map((author, index) => (
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
              value={formData.paperTitle}
              onChange={handleChange}
              className={errors.paperTitle ? "error" : ""}
            />
            {errors.paperTitle && (
              <span className="error-message">{errors.paperTitle}</span>
            )}
          </div>

          {/* Status */}
          <div className="form-group">
            <label htmlFor="status">
              Status<span className="required">*</span>
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={errors.status ? "error" : ""}
            >
              <option value="">--Select Status--</option>
              <option value="Accepted">Accepted</option>
              <option value="Presented">Presented</option>
              <option value="Published">Published</option>
            </select>
            {errors.status && (
              <span className="error-message">{errors.status}</span>
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
                  checked={formData.indexed.includes("Scopus")}
                  onChange={handleChange}
                />
                Scopus
              </label>
              <label>
                <input
                  type="checkbox"
                  name="indexed"
                  value="WoS"
                  checked={formData.indexed.includes("WoS")}
                  onChange={handleChange}
                />
                WoS
              </label>
              <label>
                <input
                  type="checkbox"
                  name="indexed"
                  value="ACM"
                  checked={formData.indexed.includes("ACM")}
                  onChange={handleChange}
                />
                ACM
              </label>
              <label>
                <input
                  type="checkbox"
                  name="indexed"
                  value="IEEE"
                  checked={formData.indexed.includes("IEEE")}
                  onChange={handleChange}
                />
                IEEE
              </label>
            </div>
            {errors.indexed && (
              <span className="error-message">{errors.indexed}</span>
            )}
          </div>

          {/* Upload Published Paper */}
          <div className="form-group">
            <label htmlFor="publishedPaper">
              Upload Published Paper<span className="required">*</span>
            </label>
            <input
              type="file"
              id="publishedPaper"
              name="publishedPaper"
              accept=".pdf, .doc, .docx"
              onChange={handleChange}
              className={errors.publishedPaper ? "error" : ""}
            />
            {errors.publishedPaper && (
              <span className="error-message">{errors.publishedPaper}</span>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>

        {/* Toast Notifications */}
        <ToastContainer />
      </div>
    </div>
  );
};

export default AddConference;
