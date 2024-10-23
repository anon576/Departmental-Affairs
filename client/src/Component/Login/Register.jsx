import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import banner from "../../images/banner.png";
import { useNavigate } from "react-router-dom";
import  {BACKEND_API} from '../constant'

const Register = () => {
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

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(BACKEND_API+"/auth/register", {
        ...data,
        role,  // Add the role to the submitted data
      });
      if (response.data.success) {
        console.log("User registered successfully:", response.data);
        navigate("/login");
        reset();
      } else {
        console.error("Registration failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error registering user:", error);
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
            <h3>Welcome! Please register to continue.</h3>
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
                      placeholder="Enter name"
                      {...register("name", { required: "Name is required" })}
                    />
                    {errors.name && (
                      <p className="error-message">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="login-input-field">
                    <input
                      type="email"
                      placeholder="Enter email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid email format",
                        },
                      })}
                    />
                    {errors.email && (
                      <p className="error-message">{errors.email.message}</p>
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

                  <div className="login-input-field">
                    <input
                      type="text"
                      placeholder="Enter department"
                      {...register("department", {
                        required: "Department is required",
                      })}
                    />
                    {errors.department && (
                      <p className="error-message">
                        {errors.department.message}
                      </p>
                    )}
                  </div>

                  <div className="login-input-field">
                    <input
                      type="text"
                      placeholder="Enter employee ID"
                      {...register("employeeId", {
                        required: "Employee ID is required",
                      })}
                    />
                    {errors.employeeId && (
                      <p className="error-message">
                        {errors.employeeId.message}
                      </p>
                    )}
                  </div>

                  <button type="submit">
                    Register as {role.charAt(0).toUpperCase() + role.slice(1)}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
