import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import ConfirmDialogBox from "../../../../Web Utils/Dialog Box/ConfirmDialogBox";
import { BACKEND_API } from "../../../../constant";

const JournalsListHod = () => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("authToken");
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.department; // Use optional chaining

  useEffect(() => {
    if (!userId || !token) {
      toast.error("User not authenticated. Please log in.");
      navigate("/login"); // Redirect to login if token or userId is missing
      return;
    }

    fetchJournals();
  }, [userId, token, navigate]);

  const fetchJournals = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: token, // Add the token to the request header
        },
      };

      const response = await axios.get(`${BACKEND_API}/journal/department/${userId}`, config);
      if (response.data.success) {
        setJournals(response.data.fdps);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching journals:", error);
      toast.error("Failed to fetch journals. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (journal) => {
    navigate(`/journal/view/hod`, { state: { journalData: journal } });
  };

  

  if (loading) {
    return <p>Loading journals...</p>;
  }

  return (
    <div className="conferance-list-main-container">
    <div className="conferences-list-container">
        <h2>Journals</h2>
        
        {journals.length === 0 ? (
          <p>No journals found.</p>
        ) : (
          <table className="conferences-table">
            <thead>
              <tr>
                <th>Journal Name</th>
                <th>Paper Title</th>
                <th>Indexed</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {journals.map((journal) => (
                <tr key={journal.journalID}>
                  <td>{journal.journalName}</td>
                  <td>{journal.paperTitle}</td>
                  <td>{journal.indexed}</td>
                  <td className="conferance-buttons-container">
                    <button className="view-button" onClick={() => handleView(journal)}>
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

export default JournalsListHod;
