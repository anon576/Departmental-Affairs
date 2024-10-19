import React from "react";
import "./homeStyle.css";
import StaffLayout from "./StaffLayout";
import HODLayout from "./HODLayout";
import AdminLayout from "./AdminLayot";

const Home = () => {


  const storedUser = JSON.parse(localStorage.getItem("user"));
  const role = storedUser?.role;
  if(role == "faculty"){
    return <StaffLayout/>
  }else if(role == "hod"){
    return <HODLayout/>
  }else if(role == "admin"){
    return <AdminLayout/>
  }
};

export default Home;
