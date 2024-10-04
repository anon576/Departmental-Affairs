import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "./conferanceList.css";
import ConfirmDialogBox from "../../../../Web Utils/Dialog Box/ConfirmDialogBox";
import { BACKEND_API } from "../../../../constant";

const ConferencesList = () => {
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedConference, setSelectedConference] = useState(null);

  const token = localStorage.getItem("authToken");
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser.userId; // Retrieve userId from localStorage

  useEffect(() => {
    if (userId && token) {
      fetchConferences();
    } else {
      toast.error("User not authenticated. Please log in.");
      navigate("/login"); // Redirect to login if token or userId is missing
    }
  }, [userId, token, navigate]);

  const fetchConferences = async () => {
    try {
      const config = {
        headers: {
          Authorization: `${token}`, // Add the token to the request header
        },
      };

      const response = await axios.get(BACKEND_API + `/conferences/user/${userId}`, config);

      if (response.data.success) {
        setConferences(response.data.conferences);
        setLoading(false);
      } else {
        toast.error(response.data.message);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching conferences:", error);
      toast.error("Failed to fetch conferences. Please try again.");
      setLoading(false);
    }
  };

  const handleView = (conference) => {
    // Pass the entire conference data object to the ViewConference component
    navigate(`/conferences/view`, { state: { conferenceData: conference } });
  };

  const handleUpdate = (conference) => {
    navigate(`/conferences/update`,{ state: {  conference } });;
  };

  const handleDeleteClick = (conference) => {
    setSelectedConference(conference);
    setIsConfirmOpen(true); // Open confirmation dialog
  };

  const handleConfirmDelete = async () => {
    if (!selectedConference) return;

    try {
      await axios.delete(`${BACKEND_API}/conferences/delete/${selectedConference.conferenceID}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      toast.success("Conference deleted successfully.");
      setIsConfirmOpen(false); // Close confirmation dialog
      fetchConferences(); // Refresh the list
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
                <tr key={conference.conferenceID}>
                  <td>{conference.conferenceName}</td>
                  <td>{conference.paperTitle}</td>
                  <td>{conference.indexed}</td>
                  <td className="conferance-buttons-container">
                    <button
                      className="view-button"
                      onClick={() => handleView(conference)} // Pass the whole conference object
                    >
                      View
                    </button>
                    <button
                      className="update-button"
                      onClick={() => handleUpdate(conference)}
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
