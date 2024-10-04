import React, { useState } from "react";
import { useForm } from "react-hook-form";
import ycce from "../../images/ycce.jpg";
import banner from "../../images/logo2.png";
import "./homeStyle.css";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const [role, setRole] = useState("faculty");

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const changeRole = (newRole) => {
    setRole(newRole);
    reset();
  };

  const onSubmit = (data) => {
    console.log("Logging in as:", role);
    console.log("Form Data:", data);
    const authToken = "qwertyuiopasdfghjkzxcvbnm";
    localStorage.setItem("authToken", authToken);
    navigate("/faculty");
    reset();
  };

  return (
    <div className="homepage">
      <div className="logo-container">
        <div className="logo-img-container">
          <img className="logo-img" src={banner} alt="Banner" />
        </div>
      </div>

      <div className="login-main-container">
        <div className="login-container">
          <div className="login-header">
            <h3>Welcome! Please login to continue.</h3>
          </div>
          <div className="login-header-button">
            <button
              className={`header-button ${
                role === "faculty" ? "selected-role" : ""
              }`}
              onClick={() => changeRole("faculty")}
            >
              Faculty
            </button>
            <button
              className={`header-button ${
                role === "hod" ? "selected-role" : ""
              }`}
              onClick={() => changeRole("hod")}
            >
              HOD
            </button>
            <button
              className={`header-button ${
                role === "admin" ? "selected-role" : ""
              }`}
              onClick={() => changeRole("admin")}
            >
              Admin
            </button>
          </div>

          <div className="login-form-container">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="login-form">
                <div className="login-inputs">
                  <div className="login-input-field">
                    <input
                      type="text"
                      placeholder="Enter username"
                      {...register("username", {
                        required: "Username is required",
                        minLength: {
                          value: 4,
                          message:
                            "Username must be at least 4 characters long",
                        },
                      })}
                    />
                    {errors.username && (
                      <p className="error-message">{errors.username.message}</p>
                    )}
                  </div>

                  <div className="login-input-field">
                    <input
                      type="password"
                      placeholder="Enter password"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message:
                            "Password must be at least 6 characters long",
                        },
                      })}
                    />
                    {errors.password && (
                      <p className="error-message">{errors.password.message}</p>
                    )}
                  </div>

                  <button type="submit">
                    Login as {role.charAt(0).toUpperCase() + role.slice(1)}
                  </button>
                  <a href="#">Forget password?</a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
