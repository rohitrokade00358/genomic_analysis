import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Login.css";
import axios from "axios";
import NavigationBar from "../Home/Navbar"; // Import the Navbar component

const Login = () => {
  const [password, setPassword] = useState("");
  const [resId, setResId] = useState("");
  const [labId, setLabId] = useState("");
  const [category, setCategory] = useState("");
  const [errorField, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const navigate = useNavigate();
  const location = useLocation();

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategory(value);
    setError("");
  };

  const handleResIdChange = (e) => {
    const value = e.target.value;
    setResId(value);
    setError("");
  };

  const handleLabIdChange = (e) => {
    const value = e.target.value;
    setLabId(value);
    setError("");
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setError("");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!category) {
      setError("Please select a category");
      return;
    }
    if (category === "Researcher" && (!resId || !password)) {
      setError("Res ID and password cannot be empty");
      return;
    }
    if (category === "Lab Technician" && (!labId || !password)) {
      setError("Lab ID and password cannot be empty");
      return;
    }
    Login(category, resId, labId, password);
  };

  const Login = (category, resId, labId, password) => {
    setError("");
    const loginData = { category, resId, labId, password };
    console.log("Login Payload:", loginData); // Debugging
    axios
      .post("http://localhost:5000/api/login", loginData)
      .then((response) => {
        if (response.data.message === "Login successful") {
          console.log("Login successful");
          const queryString = location.search;
          let strReturnUrl = new URLSearchParams(queryString).get("returnUrl");
          if (strReturnUrl === null) {
            strReturnUrl = "/dashboard";
          }
          let token = "ASJDFJF87ADF8745LK4598SAD7FAJSDF45JSDLFKAS";
          sessionStorage.setItem("user-token", token);
          sessionStorage.setItem("category", category);
          sessionStorage.setItem("userId", category === "Researcher" ? resId : labId); // Store userId
          navigate(strReturnUrl);
          setError(response.data.message);
        } else {
          setError("Invalid credentials");
          console.error("Login failed:", response.data.error);
        }
      })
      .catch((error) => {
        setError(error?.response?.data?.message);
        console.error("Error during login:", error);
      });
  };

  return (
    <>
      <NavigationBar />
      <div className="login-outer-container login-background">
        <div className="login-container">
          <div className="login-overlay-container">
            <div className="login-overlay">
              <div className="login-overlay-panel login-overlay-left">
                <h1 className="login-heading">Welcome to GenovateAI</h1>
                <p className="login-section">
                  GenovateAI is a cutting-edge platform for researchers and lab technicians to collaborate and innovate in the field of genomics.
                </p>
              </div>
            </div>
          </div>
          <div className="login-form-container login-log-in-container">
            <form className="login-input-form">
              <h1 className="login-headings">Login</h1>
              <div className="login-formgroup">
                <select
                  className="login-input"
                  value={category}
                  onChange={handleCategoryChange}
                >
                  <option value="">Select Category</option>
                  <option value="Researcher">Researcher</option>
                  <option value="Lab Technician">Lab Technician</option>
                </select>
              </div>
              {category === "Researcher" && (
                <div className="login-formgroup">
                  <input
                    className="login-input"
                    type="text"
                    placeholder="Enter your Res ID"
                    value={resId}
                    onChange={handleResIdChange}
                  />
                </div>
              )}
              {category === "Lab Technician" && (
                <div className="login-formgroup">
                  <input
                    className="login-input"
                    type="text"
                    placeholder="Enter your Lab ID"
                    value={labId}
                    onChange={handleLabIdChange}
                  />
                </div>
              )}
              <div className="login-formgroup">
                <input
                  className="login-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={handlePasswordChange}
                />
                <p className="login-showPassword1" onClick={togglePasswordVisibility}>
                  {showPassword ? (
                    <i className="bi bi-eye-slash"></i>
                  ) : (
                    <i className="bi bi-eye"></i>
                  )}
                </p>
              </div>
              <button type="button" className="login-submit" onClick={handleLogin}>
                Login
              </button>
              <Link
                to="/forgotpassword"
                className="mb-3 mt-3 link-success link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover text-decoration-none"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/forgotpassword");
                }}
              >
                Forgot Password
              </Link>
              <p className="d-inline">
                Not a Member?
                <Link
                  to="/registration"
                  className="mb-3 mt-3 link-success link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover text-decoration-none"
                >
                  SignUp
                </Link>
              </p>
              {errorField && (
                <div className="login-error-message text-danger text-center">
                  {errorField}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;