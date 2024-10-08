// src/components/Copyrights/CopyrightList.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import ConfirmDialogBox from "../../../Web Utils/Dialog Box/ConfirmDialogBox";
import { BACKEND_API } from "../../../constant";

const CopyrightList = () => {
  const [copyrights, setCopyrights] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedCopyright, setSelectedCopyright] = useState(null);

  const token = localStorage.getItem("authToken");
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.userId; // Use optional chaining

  useEffect(() => {
    if (userId && token) {
      fetchCopyrights();
    } else {
      toast.error("User not authenticated. Please log in.");
      navigate("/login"); // Redirect to login if token or userId is missing
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, token, navigate]);

  const fetchCopyrights = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `${token}`, // Add the token to the request header
        },
      };

      const response = await axios.get(`${BACKEND_API}/copyright/user/${userId}`, config);

      if (response.data.success) {
        console.log(response.data)
        setCopyrights(response.data.copyrights);
        setLoading(false);
      } else {
        toast.error(response.data.message);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching copyrights:", error);
      toast.error("Failed to fetch copyrights. Please try again.");
      setLoading(false);
    }
  };

  const handleView = (copyright) => {
    // Pass the entire copyright data object to the ViewCopyright component
    navigate(`/copyright/view`, { state: { copyrightData: copyright } });
  };

  const handleUpdate = (copyright) => {
    navigate(`/copyright/update/`, { state: { copyrightData: copyright } });
  };

  const handleDeleteClick = (copyright) => {
    setSelectedCopyright(copyright);
    setIsConfirmOpen(true); // Open confirmation dialog
  };

  const handleConfirmDelete = async () => {
    if (!selectedCopyright) return;

    try {
      await axios.delete(`${BACKEND_API}/copyright/delete/${selectedCopyright.copyrightID}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      toast.success("Copyright deleted successfully.");
      setIsConfirmOpen(false); // Close confirmation dialog
      fetchCopyrights(); // Refresh the list
    } catch (error) {
      console.error("Error deleting copyright:", error);
      toast.error("Failed to delete copyright. Please try again.");
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false); // Close confirmation dialog
  };

  if (loading) {
    return <p>Loading copyrights...</p>;
  }

  return (
    <div className="conferance-list-main-container">
      <div className="conferences-list-container">
        <h2>Copyrights</h2>
        <button
          className="add-conference-button"
          onClick={() => navigate("/copyrights/new")}
        >
          Add New Copyright
        </button>
        {copyrights.length === 0 ? (
          <p>No copyrights found.</p>
        ) : (
          <table className="conferences-table">
            <thead>
              <tr>
                <th>Copyright Title</th>
                <th>Status</th>
                <th>Date of Submission</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {copyrights.map((copyright) => (
                <tr key={copyright.copyrightID}>
                  <td>{copyright.title}</td>
                  <td>{copyright.status}</td>
                  <td>{new Date(copyright.dateOfSubmission).toLocaleDateString()}</td>
                  <td className="patent-buttons-container">
                    <button
                      className="view-button"
                      onClick={() => handleView(copyright)}
                    >
                      View
                    </button>
                    <button
                      className="update-button"
                      onClick={() => handleUpdate(copyright)}
                    >
                      Update
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteClick(copyright)}
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
        message={`Are you sure you want to delete the copyright titled "${selectedCopyright?.title}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
      <ToastContainer />
    </div>
  );
};

export default CopyrightList;
