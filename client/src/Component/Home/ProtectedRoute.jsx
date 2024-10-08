import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../Web Utils/Bar/Navbar";
import Sidebar from "../Web Utils/Bar/Sidebar";

const ProtectedRoute = ({ element }) => {
  const token = !!localStorage.getItem('authToken');

  if (token) {
    return (
      <>
        <Navbar />
        <Sidebar />
        {element} {/* Render the passed element here */}
      </>
    );
  }

  return <Navigate to="/login" />;
}

export default ProtectedRoute;
