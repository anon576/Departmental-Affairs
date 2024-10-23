// src/components/Copyrights/EmployeeCopyrightList.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate,useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import { BACKEND_API } from "../../constant";

const EmployeeCopyrightList = () => {
  const [copyrights, setCopyrights] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  const token = localStorage.getItem("authToken");
  const { userId } = useParams();

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
    navigate(`/copyright/view/hod`, { state: { copyrightData: copyright } });
  };

 

  if (loading) {
    return <p>Loading copyrights...</p>;
  }

  return (
    <div className="conferance-list-main-container">
      <div className="conferences-list-container">
        <h2>Copyrights</h2>
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

export default EmployeeCopyrightList;
