// src/components/SDP/SDPListHod.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import ConfirmDialogBox from "../../Web Utils/Dialog Box/ConfirmDialogBox";
import { BACKEND_API } from "../../constant";

const SDPListHod = () => {
  const [sdps, setSdps] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedSdp, setSelectedSdp] = useState(null);

  const token = localStorage.getItem("authToken");
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.department; // Use optional chaining

  useEffect(() => {
    if (userId && token) {
      fetchSDPs();
    } else {
      toast.error("User not authenticated. Please log in.");
      navigate("/login"); // Redirect to login if token or userId is missing
    }
  }, [userId, token, navigate]);

  const fetchSDPs = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `${token}`, // Add the token to the request header
        },
      };

      const response = await axios.get(`${BACKEND_API}/sdp/department/${userId}`, config);

      if (response.data.success) {
        setSdps(response.data.fdps);
        setLoading(false);
      } else {
        toast.error(response.data.message);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching SDPs:", error);
      toast.error("Failed to fetch SDPs. Please try again.");
      setLoading(false);
    }
  };

  const handleView = (sdp) => {
    navigate(`/sdp/view/hod`, { state: { sdpData: sdp } });
  };

  

  if (loading) {
    return <p>Loading SDPs...</p>;
  }

  return (
    <div className="conferance-list-main-container">
      <div className="conferences-list-container">
        <h2>SDP List</h2>

        {sdps.length === 0 ? (
          <p>No SDPs found.</p>
        ) : (
          <table className="conferences-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Duration</th>
                <th>Number of Days</th>
                <th>Number of Beneficiaries</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sdps.map((sdp) => (
                <tr key={sdp.sdpID}>
                  <td>{sdp.title}</td>
                  <td>{sdp.duration}</td>
                  <td>{sdp.noOfDays}</td>
                  <td>{sdp.noOfBeneficiary}</td>
                  <td className="patent-buttons-container">
                    <button
                      className="view-button"
                      onClick={() => handleView(sdp)}
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

export default SDPListHod;
