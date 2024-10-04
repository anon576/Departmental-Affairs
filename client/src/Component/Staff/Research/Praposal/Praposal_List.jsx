// src/components/Proposals/ProposalsList.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import ConfirmDialogBox from "../../../Web Utils/Dialog Box/ConfirmDialogBox";
import { BACKEND_API } from "../../../constant";

const ProposalsList = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);

  const token = localStorage.getItem("authToken");
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.userId; // Use optional chaining

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
    navigate(`/praposal/view`, { state: { proposalData: proposal } });
  };

  const handleUpdate = (proposal) => {
    navigate(`/praposal/update/`, { state: { proposal } });
  };

  const handleDeleteClick = (proposal) => {
    setSelectedProposal(proposal);
    setIsConfirmOpen(true); // Open confirmation dialog
  };

  const handleConfirmDelete = async () => {
    if (!selectedProposal) return;

    try {
      await axios.delete(`${BACKEND_API}/proposals/delete/${selectedProposal.proposalID}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      toast.success("Proposal deleted successfully.");
      setIsConfirmOpen(false); // Close confirmation dialog
      fetchProposals(); // Refresh the list
    } catch (error) {
      console.error("Error deleting proposal:", error);
      toast.error("Failed to delete proposal. Please try again.");
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false); // Close confirmation dialog
  };

  if (loading) {
    return <p>Loading proposals...</p>;
  }

  return (
    <div className="conferance-list-main-container">
      <div className="conferences-list-container">
        <h2>Proposals</h2>
        <button
          className="add-conference-button"
          onClick={() => navigate("/proposals/new")}
        >
          Add New Proposal
        </button>
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
                    <button
                      className="update-button"
                      onClick={() => handleUpdate(proposal)}
                    >
                      Update
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteClick(proposal)}
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
        message={`Are you sure you want to delete the proposal titled "${selectedProposal?.title}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
      <ToastContainer />
    </div>
  );
};

export default ProposalsList;
