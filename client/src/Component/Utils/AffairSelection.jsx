import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AffairSelect = ({ affairs }) => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(affairs[0].name); // Default to the first affair

  // Find the selected affair data based on the selectedItem
  const selectedAffair = affairs.find((affair) => affair.name === selectedItem);

  // Handle selection change
  const handleSelectionChange = (e) => {
    setSelectedItem(e.target.value);
  };

  // Handle view details button click
  const handleViewDetails = () => {
    navigate(selectedAffair.route); // Navigate to the route of the selected affair
  };

  return (
    <div className="mt-4">
      {/* Dropdown to select what to view */}
      <label className="block text-sm font-medium text-gray-700">Select Data to View:</label>
      <select
        value={selectedItem}
        onChange={handleSelectionChange}
        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
      >
        {affairs.map((affair, index) => (
          <option key={index} value={affair.name}>
            {affair.name}
          </option>
        ))}
      </select>

      {/* Display the selected affair details */}
      <div className="mt-6 mb-5 bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-500">{selectedAffair.name}</h3>
        <p className="mt-1 text-2xl font-semibold text-gray-900">{selectedAffair.value}</p>
        <button
          className="mt-2 px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600"
          onClick={handleViewDetails}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default AffairSelect;
