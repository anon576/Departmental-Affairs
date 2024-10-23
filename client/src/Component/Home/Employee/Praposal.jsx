// src/components/Proposals/EmployeeProposalsList.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate,useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { BACKEND_API } from "../../constant";

const EmployeeProposalsList = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("authToken");
  const {userId} = useParams()

  useEffect(() => {
    if (userId && token) {
      fetchProposals();
    } else {
      toast.error("User not authenticated. Please log in.");
      navigate("/login"); // Redirect to login if token or userId is missing
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, token, navigate]);

  const fetchProposals = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `${token}`, // Add the token to the request header
        },
      };

      const response = await axios.get(`${BACKEND_API}/proposals/user/${userId}`, config);

      if (response.data.success) {
        setProposals(response.data.proposals);
        setLoading(false);
      } else {
        toast.error(response.data.message);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching proposals:", error);
      toast.error("Failed to fetch proposals. Please try again.");
      setLoading(false);
    }
  };

  const handleView = (proposal) => {
    // Pass the entire proposal data object to the ViewProposal component
    navigate(`/praposal/view/hod`, { state: { proposalData: proposal } });
  };

  

  if (loading) {
    return <p>Loading proposals...</p>;
  }

  return (
    <div className="conferance-list-main-container">
    <div className="conferences-list-container">
        <h2>Proposals</h2>

        {proposals.length === 0 ? (
          <p>No proposals found.</p>
        ) : (
          <table className="conferences-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Agency</th>
                <th>Date of Submission</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {proposals.map((proposal) => (
                <tr key={proposal.proposalID}>
                  <td>{proposal.title}</td>
                  <td>{proposal.status}</td>
                  <td>{proposal.agency}</td>
                  <td>{new Date(proposal.dateOfSubmission).toLocaleDateString()}</td>
                  <td className="conferance-buttons-container">
                    <button
                      className="view-button"
                      onClick={() => handleView(proposal)}
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

export default EmployeeProposalsList;
