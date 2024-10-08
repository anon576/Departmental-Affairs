import React, { useState, useEffect } from "react";
import Logo from "../../../images/logo2.png";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import { IoHome } from "react-icons/io5";
import { FaBell } from "react-icons/fa6";
import { FaUserCircle, FaArrowRight, FaRegUser } from "react-icons/fa";

const Navbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);

  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);
  const handleProfileOpen = () => {
    setProfileOpen(!profileOpen);
  };

  const logout = () => {
    localStorage.clear()
    navigate("/");
  };

  return (
    <div className="navbar-container">
      <div className="nav-logo-container">
        <div className="logo-img">
          <img src={Logo} alt="" />
        </div>
      </div>

      <div className="nav-bar-buttons">
        <Link to="/faculty" className="nav-bar-link">
          <IoHome className="nav-bar-button" />
          <p>Home</p>
        </Link>
        <Link className="nav-bar-link">
          <FaBell className="nav-bar-button" />
          <p>Inbox</p>
        </Link>

        <Link className="nav-bar-link" onClick={handleProfileOpen}>
          <FaUserCircle className="nav-bar-button" />
          <p>Hi! Abhishek</p>
        </Link>

        <div
          className={`profile-box-conatainer ${
            profileOpen ? "profile-open" : ""
          }`}
        >
          <div className="profile-box-header">
            <FaUserCircle className="profile-image" />
            <p>Mr. Abhishek Purushottam Bhoyar</p>
          </div>

          <div className="profile-box-content">
            <Link className="profile-link" onClick={handleProfileOpen}>
              <FaRegUser className="profile-link-image" />
              <p className="profile-link">Go to profile</p>
              <FaArrowRight className="arrow-icon" />
            </Link>

            <button className="logout-button" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
        <div
          className={`box-overlay ${profileOpen ? "open-overlay" : ""}`}
          onClick={handleProfileOpen}
        ></div>
      </div>
    </div>
  );
};

export default Navbar;
