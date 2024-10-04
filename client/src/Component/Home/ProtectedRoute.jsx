import React from "react";
import { Navigate } from "react-router-dom";

// Example authentication check function (replace with your actual logic)


const ProtectedRoute = ({ element: Component, ...rest }) => {
  const token = localStorage.getItem("authToken")
  if (token) {
    let user = localStorage.getItem("user")
    user = JSON.parse(user)
    console.log(user.role)
    const role = user.role
    console.log(role === "faculty")
    if (role === "faculty") {
      return <Navigate to="/faculty" replace />
    } else if (role === "hod") {
      return <Navigate to="/hod" replace />
    } else if (role === "admin") {
      return <Navigate to="/admin" replace />
    }
  } else (
    <Navigate to="/" replace />
  );
};

export default ProtectedRoute;
