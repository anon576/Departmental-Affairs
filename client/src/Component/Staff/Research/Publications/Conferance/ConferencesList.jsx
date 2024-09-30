// src/components/ConferencesList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ConferenceForm.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ConferencesList = () => {
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch all conferences on component mount
  useEffect(() => {
    fetchConferences();
  }, []);

  const fetchConferences = async () => {
    try {
      const response = await axios.get("/api/conferences");
      setConferences(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching conferences:", error);
      toast.error("Failed to fetch conferences. Please try again.");
      setLoading(false);
    }
  };

  const handleView = (id) => {
    navigate(`/conferences/view/${id}`);
  };

  const handleUpdate = (id) => {
    navigate(`/conferences/update/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this conference?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/conferences/${id}`);
      toast.success("Conference deleted successfully.");
      // Refresh the list
      fetchConferences();
    } catch (error) {
      console.error("Error deleting conference:", error);
      toast.error("Failed to delete conference. Please try again.");
    }
  };

  if (loading) {
    return <p>Loading conferences...</p>;
  }

  return (
    <div className="conferences-list-container">
      <h2>Conferences</h2>
      <button className="add-conference-button" onClick={() => navigate("/conferences/new")}>
        Add New Conference
      </button>
      {conferences.length === 0 ? (
        <p>No conferences found.</p>
      ) : (
        <table className="conferences-table">
          <thead>
            <tr>
              <th>Conference Name</th>
              <th>Paper Title</th>
              <th>Indexed</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {conferences.map((conference) => (
              <tr key={conference._id}>
                <td>{conference.conferenceName}</td>
                <td>{conference.paperTitle}</td>
                <td>{conference.indexed.join(", ")}</td>
                <td>
                  <button className="view-button" onClick={() => handleView(conference._id)}>
                    View
                  </button>
                  <button className="update-button" onClick={() => handleUpdate(conference._id)}>
                    Update
                  </button>
                  <button className="delete-button" onClick={() => handleDelete(conference._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ConferencesList;
