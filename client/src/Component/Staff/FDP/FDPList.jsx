// src/components/FDP/FDPList.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import ConfirmDialogBox from "../../Web Utils/Dialog Box/ConfirmDialogBox";
import { BACKEND_API } from "../../constant";

const FDPList = () => {
  const [fdps, setFdps] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedFdp, setSelectedFdp] = useState(null);

  const token = localStorage.getItem("authToken");
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.userId; // Use optional chaining

  useEffect(() => {
    if (userId && token) {
      fetchFDPs();
    } else {
      toast.error("User not authenticated. Please log in.");
      navigate("/login"); // Redirect to login if token or userId is missing
    }
  }, [userId, token, navigate]);

  const fetchFDPs = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `${token}`, // Add the token to the request header
        },
      };

      const response = await axios.get(`${BACKEND_API}/fdp/user/${userId}`, config);

      if (response.data.success) {
        setFdps(response.data.fdps);
        setLoading(false);
      } else {
        toast.error(response.data.message);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching FDPs:", error);
      toast.error("Failed to fetch FDPs. Please try again.");
      setLoading(false);
    }
  };

  const handleView = (fdp) => {
    // Pass the entire FDP data object to the ViewFDP component
    navigate(`/fdp/view`, { state: { fdpData: fdp } });
  };

  const handleUpdate = (fdp) => {
    navigate(`/fdp/update/`, { state: { fdpData: fdp } });
  };

  const handleDeleteClick = (fdp) => {
    setSelectedFdp(fdp);
    setIsConfirmOpen(true); // Open confirmation dialog
  };

  const handleConfirmDelete = async () => {
    if (!selectedFdp) return;

    try {
      await axios.delete(`${BACKEND_API}/fdp/delete/${selectedFdp.fdpID}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      toast.success("FDP deleted successfully.");
      setIsConfirmOpen(false); // Close confirmation dialog
      fetchFDPs(); // Refresh the list
    } catch (error) {
      console.error("Error deleting FDP:", error);
      toast.error("Failed to delete FDP. Please try again.");
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false); // Close confirmation dialog
  };

  if (loading) {
    return <p>Loading FDPs...</p>;
  }

  return (
    <div className="conferance-list-main-container">
      <div className="conferences-list-container">
        <h2>FDP List</h2>
        <button
          className="add-conference-button"
          onClick={() => navigate("/add/fdp")}
        >
          Add New FDP
        </button>
        {fdps.length === 0 ? (
          <p>No FDPs found.</p>
        ) : (
          <table className="conferences-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Number of Days</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fdps.map((fdp) => (
                <tr key={fdp.fdpID}>
                  <td>{fdp.title}</td>
                  <td>{fdp.status}</td>
                  <td>{fdp.noOfDays}</td>
                  <td className="patent-buttons-container">
                    <button
                      className="view-button"
                      onClick={() => handleView(fdp)}
                    >
                      View
                    </button>
                    <button
                      className="update-button"
                      onClick={() => handleUpdate(fdp)}
                    >
                      Update
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteClick(fdp)}
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
        message={`Are you sure you want to delete the FDP titled "${selectedFdp?.title}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
      <ToastContainer />
    </div>
  );
};

export default FDPList;
