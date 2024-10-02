// src/components/ConferencesList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "./conferanceList.css";
import ConfirmDialogBox from "../../../../Web Utils/Dialog Box/ConfirmDialogBox";

const ConferencesList = () => {
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedConference, setSelectedConference] = useState(null);

  // Fetch all conferences on component mount
  // useEffect(() => {
  //   fetchConferences();
  // }, []);

  // const fetchConferences = async () => {
  //   try {
  //     const response = await axios.get("/api/conferences");
  //     setConferences(response.data);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error("Error fetching conferences:", error);
  //     toast.error("Failed to fetch conferences. Please try again.");
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    fetchConferences();
  }, []);

  // Simulated fetch request with sample data
  const fetchConferences = async () => {
    try {
      // Sample data to simulate real API data
      const sampleConferences = [
        {
          _id: "1",
          conferenceName: "AI Innovations 2024",
          paperTitle: "Deep Learning in Healthcare",
          indexed: ["IEEE", "Springer"],
          date: "2024-11-05",
          location: "New York, USA",
          status: "Upcoming",
        },
        {
          _id: "2",
          conferenceName: "Web Dev Summit",
          paperTitle: "Next-gen Web Technologies",
          indexed: ["ACM", "Elsevier"],
          date: "2024-10-20",
          location: "Berlin, Germany",
          status: "Ongoing",
        },
        {
          _id: "3",
          conferenceName: "Data Science Expo",
          paperTitle: "Machine Learning Models",
          indexed: ["IEEE"],
          date: "2024-09-10",
          location: "Tokyo, Japan",
          status: "Completed",
        },
      ];

      setConferences(sampleConferences);
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

  const handleDeleteClick = (conference) => {
    setSelectedConference(conference);
    setIsConfirmOpen(true); // Open confirmation dialog
  };

  const handleConfirmDelete = async () => {
    if (!selectedConference) return;

    try {
      // await axios.delete(`/api/conferences/${selectedConference._id}`);
      toast.success("Conference deleted successfully.");
      setIsConfirmOpen(false); // Close confirmation dialog
      // Refresh the list
      fetchConferences();
    } catch (error) {
      console.error("Error deleting conference:", error);
      toast.error("Failed to delete conference. Please try again.");
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false); // Close confirmation dialog
  };

  if (loading) {
    return <p>Loading conferences...</p>;
  }

  return (
    <div className="conferance-list-main-container">
      <div className="conferences-list-container">
        <h2>Conferences</h2>
        <button
          className="add-conference-button"
          onClick={() => navigate("/conferences/new")}
        >
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
                  <td className="conferance-buttons-container">
                    <button
                      className="view-button"
                      onClick={() => handleView(conference._id)}
                    >
                      View
                    </button>
                    <button
                      className="update-button"
                      onClick={() => handleUpdate(conference._id)}
                    >
                      Update
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteClick(conference)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <ConfirmDialogBox
        isOpen={isConfirmOpen}
        message={`Are you sure you want to delete ${selectedConference?.conferenceName}?`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
      <ToastContainer />
    </div>
  );
};

export default ConferencesList;
