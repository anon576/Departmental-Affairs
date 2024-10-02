import React from "react";
import "./confirmDialogBox.css";

const ConfirmDialogBox = ({ message, onConfirm, onCancel, isOpen }) => {
  if (!isOpen) return null; // Hide the dialog if `isOpen` is false

  return (
    <div className="confirm-box-overlay">
      <div className="confirm-box-container">
        <h2>{message}</h2>
        <div className="confirm-box-actions">
          <button className="confirm-btn" onClick={onConfirm}>
            Confirm
          </button>
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialogBox;
