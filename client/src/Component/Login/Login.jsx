import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import banner from "../../images/logo2.png";
import axios from "axios";
import { BACKEND_API } from "../constant";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [role, setRole] = useState("faculty");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Check for auth token on component mount
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const user = JSON.parse(localStorage.getItem("user"));
    if(authToken){
      navigate("/")
    }else{
      navigate("/login")
    }
    
  }, [navigate]);

  const changeRole = (newRole) => {
    setRole(newRole);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(BACKEND_API + "/auth/login", {
        email: data.username, // Mapping form's username field to email for the login API
        password: data.password,
      });

      if (response.data.success) {
        console.log("Login successful:", response.data);
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/");
        reset();
      } else {
        console.error("Login failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
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
            >Faculty
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
                      type="email" // Changed to email since login requires email
                      placeholder="Enter email"
                      {...register("username", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid email format",
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
                  <Link to="/register">Register</Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
