import React from "react";
import { Navigate } from "react-router-dom";

// Example authentication check function (replace with your actual logic)
const isAuthenticated = () => {
  // Replace this with your actual authentication logic (like checking a token)
  return !!localStorage.getItem("authToken");
};

const ProtectedRoute = ({ element: Component, ...rest }) => {
  return isAuthenticated() ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/" replace />
  );
};

export default ProtectedRoute;
