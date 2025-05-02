import React, { useEffect, useState } from "react";
import "./ForgotPassword.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import NavigationBar from "../Home/Navbar";

function ForgotPassword() {
  const [category, setCategory] = useState("");
  const [resId, setResId] = useState("");
  const [labId, setLabId] = useState("");
  const [password, setPassword] = useState("");
  const [secquestion, setSecQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [fieldsEmpty, setFieldsEmpty] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const securityQuestions = [
    "What is your pet name?",
    "What is your favorite book?",
    "What is your mother's maiden name?",
    "What is your favorite movie?",
    "What city were you born in?",
    "What is the name of your elementary school?",
  ];

  const onSubmit = (e) => {
    e.preventDefault();
    if (!category || !secquestion || !answer || !password) {
      setFieldsEmpty("Please fill out all fields.");
      return;
    }
    if (category === "Researcher" && !resId) {
      setFieldsEmpty("Res ID is required.");
      return;
    }
    if (category === "Lab Technician" && !labId) {
      setFieldsEmpty("Lab ID is required.");
      return;
    }
    resetPassword(category, resId, labId, secquestion, answer, password);
  };

  const isPasswordValid = (password) => {
    if (password.length < 8) {
      return {
        valid: false,
        error: "Password should contain at least 8 characters",
      };
    }
    if (!/[A-Z]/.test(password)) {
      return {
        valid: false,
        error: "Password should contain at least 1 uppercase letter",
      };
    }
    if (!/[a-z]/.test(password)) {
      return {
        valid: false,
        error: "Password should contain at least 1 lowercase letter",
      };
    }
    if (!/\d/.test(password)) {
      return {
        valid: false,
        error: "Password should contain at least 1 digit",
      };
    }
    if (!/[\W_]/.test(password)) {
      return {
        valid: false,
        error: "Password should contain at least 1 special character",
      };
    }
    return { valid: true };
  };

  const resetPassword = async (category, resId, labId, secquestion, answer, password) => {
    const userId = category === "Researcher" ? resId : labId;
    const payload = { category, userId, secquestion, answer, password };
  
    try {
      const response = await axios.put("http://localhost:5000/api/reset-password", payload);
      if (response.data.message === "Password updated successfully") {
        alert("Password Updated successfully");
        navigate("/login");
      } else {
        setFieldsEmpty("Failed to reset password. Please try again.");
      }
    } catch (error) {
      setFieldsEmpty(error?.response?.data?.message || "An error occurred. Please try again.");
      console.error("Error during password reset:", error);
    }
  };
  
  return (
    <>
      <NavigationBar />
      <div className="forgotpassword-outer-container">
        <div className="forgotpassword-container">
          <div className="forgotpassword-overlay-container">
            <div className="forgotpassword-overlay">
              <div className="forgotpassword-overlay-panel forgotpassword-overlay-left">
                <h1 className="forgotpassword-heading">Welcome to GenovateAI</h1>
                <p className="forgotpassword-section">
                  GenovateAI is a cutting-edge platform for researchers and lab technicians to collaborate and innovate in the field of genomics.
                </p>
                <p className="forgotpassword-sections fst-italic">Reset your password to continue your journey with GenovateAI!</p>
              </div>
            </div>
          </div>
          <div className="forgotpassword-form-container">
            <form className="forgotpassword-input-form" onSubmit={onSubmit}>
              <div className="forgotpassword-formgroup">
                <select
                  className="forgotpassword-input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select Category</option>
                  <option value="Researcher">Researcher</option>
                  <option value="Lab Technician">Lab Technician</option>
                </select>
              </div>
              {category === "Researcher" && (
                <div className="forgotpassword-formgroup">
                  <input
                    className="forgotpassword-input"
                    type="text"
                    placeholder="Enter your Res ID"
                    value={resId}
                    onChange={(e) => setResId(e.target.value)}
                  />
                </div>
              )}
              {category === "Lab Technician" && (
                <div className="forgotpassword-formgroup">
                  <input
                    className="forgotpassword-input"
                    type="text"
                    placeholder="Enter your Lab ID"
                    value={labId}
                    onChange={(e) => setLabId(e.target.value)}
                  />
                </div>
              )}
              <div className="forgotpassword-formgroup">
                <select
                  className="forgotpassword-input"
                  value={secquestion}
                  onChange={(e) => setSecQuestion(e.target.value)}
                >
                  <option value="">Select Security Question</option>
                  {securityQuestions.map((question, index) => (
                    <option key={index} value={question}>
                      {question}
                    </option>
                  ))}
                </select>
              </div>
              {secquestion && (
                <div className="forgotpassword-formgroup">
                  <input
                    className="forgotpassword-input"
                    type="text"
                    placeholder="Enter your answer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                  />
                </div>
              )}
              <div className="forgotpassword-formgroup">
                <input
                  className="forgotpassword-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className="forgotpassword-showPassword" onClick={togglePasswordVisibility}>
                  {showPassword ? (
                    <i className="bi bi-eye-slash"></i>
                  ) : (
                    <i className="bi bi-eye"></i>
                  )}
                </p>
              </div>
              <button type="submit" className="forgotpassword-submit">
                Submit
              </button>
              <p className="forgotpassword-d-inline">
                Remember your password?
                <Link
                  to="/login"
                  className="link-success link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover text-decoration-none"
                >
                  Login
                </Link>
              </p>
              {fieldsEmpty && (
                <div className="forgotpassword-error-message text-danger text-center">
                  {fieldsEmpty}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;