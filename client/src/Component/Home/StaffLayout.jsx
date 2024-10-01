import React, { useContext } from "react";
import "./StaffLayout.css";
import { AppContext } from "../Context/AppContext"; // Use the new generalized context

const StaffLayout = () => {
  const { sideBarOpen } = useContext(AppContext);

  return (
    <div
      className={`faculty-container 
        ${sideBarOpen ? "sidebar-open" : ""}
      `}
    >
      <h1>Faculty Page</h1>
    </div>
  );
};

export default StaffLayout;
