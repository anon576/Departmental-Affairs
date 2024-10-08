// src/components/Patents/PatentsList.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import ConfirmDialogBox from "../../../Web Utils/Dialog Box/ConfirmDialogBox";
import { BACKEND_API } from "../../../constant";

const PatentsList = () => {
  const [patents, setPatents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedPatent, setSelectedPatent] = useState(null);

  const token = localStorage.getItem("authToken");
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.userId; // Use optional chaining

  useEffect(() => {
    if (userId && token) {
      fetchPatents();
    } else {
      toast.error("User not authenticated. Please log in.");
      navigate("/login"); // Redirect to login if token or userId is missing
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, token, navigate]);

  const fetchPatents = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `${token}`, // Add the token to the request header
        },
      };

      const response = await axios.get(`${BACKEND_API}/patents/user/${userId}`, config);

      if (response.data.success) {
        setPatents(response.data.patents);
        setLoading(false);
      } else {
        toast.error(response.data.message);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching patents:", error);
      toast.error("Failed to fetch patents. Please try again.");
      setLoading(false);
    }
  };

  const handleView = (patent) => {
    // Pass the entire patent data object to the ViewPatent component
    navigate(`/patent/view`, { state: { patentData: patent } });
  };

  const handleUpdate = (patent) => {
    navigate(`/patent/update/`, { state: { patentData :patent} });
  };

  const handleDeleteClick = (patent) => {
    setSelectedPatent(patent);
    setIsConfirmOpen(true); // Open confirmation dialog
  };

  const handleConfirmDelete = async () => {
    if (!selectedPatent) return;

    try {
      await axios.delete(`${BACKEND_API}/patents/delete/${selectedPatent.patentID}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      toast.success("Patent deleted successfully.");
      setIsConfirmOpen(false); // Close confirmation dialog
      fetchPatents(); // Refresh the list
    } catch (error) {
      console.error("Error deleting patent:", error);
      toast.error("Failed to delete patent. Please try again.");
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false); // Close confirmation dialog
  };

  if (loading) {
    return <p>Loading patents...</p>;
  }

  return (
    <div className="conferance-list-main-container">
    <div className="conferences-list-container">
        <h2>Patents</h2>
        <button
           className="add-conference-button"
          onClick={() => navigate("/patents/new")}
        >
          Add New Patent
        </button>
        {patents.length === 0 ? (
          <p>No patents found.</p>
        ) : (
            <table className="conferences-table">
            <thead>
              <tr>
                <th>Patent Title</th>
                <th>Status</th>
                <th>Date of Submission</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patents.map((patent) => (
                <tr key={patent.patentID}>
                  <td>{patent.title}</td>
                  <td>{patent.status}</td>
                  <td>{new Date(patent.dateOfSubmission).toLocaleDateString()}</td>
                  <td className="conference-buttons-container">
                    <button
                      className="view-button"
                      onClick={() => handleView(patent)}
                    >
                      View
                    </button>
                    <button
                      className="update-button"
                      onClick={() => handleUpdate(patent)}
                    >
                      Update
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteClick(patent)}
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
        message={`Are you sure you want to delete the patent titled "${selectedPatent?.title}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
      <ToastContainer />
    </div>
  );
};

export default PatentsList;
