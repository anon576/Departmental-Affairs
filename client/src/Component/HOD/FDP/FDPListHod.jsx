// src/components/FDP/FDPHoDList.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import ConfirmDialogBox from "../../Web Utils/Dialog Box/ConfirmDialogBox";
import { BACKEND_API } from "../../constant";

const FDPHoDList = () => {
  const [fdps, setFdps] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedFdp, setSelectedFdp] = useState(null);

  const token = localStorage.getItem("authToken");
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.userId; // Use optional chaining
  const dept = storedUser?.department; 
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

      const response = await axios.get(`${BACKEND_API}/fdp/department/${dept}`, config);

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
    navigate(`/fdp/view/hod`, { state: { fdpData: fdp } });
  };

  if (loading) {
    return <p>Loading FDPs...</p>;
  }

  return (
    <div className="conferance-list-main-container">
      <div className="conferences-list-container">
        <h2>FDP List</h2>
      
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default FDPHoDList;
