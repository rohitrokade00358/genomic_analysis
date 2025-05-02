import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Registration.css";
import axios from "axios";
import NavigationBar from "../Home/Navbar";

const Registration = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resId, setResId] = useState("");
  const [labId, setLabId] = useState("");
  const [category, setCategory] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [errorField, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [users, setUsers] = useState([]);

  const nameInputRef = useRef(null);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const navigate = useNavigate();

  const generateId = () => {
    return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit number
  };

  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }

    return () => {
      clearFields();
    };
  }, []);

  useEffect(() => {
    if (category === "Researcher") {
      setResId(`RES${generateId()}`);
    } else if (category === "Lab Technician") {
      setLabId(`LAB${generateId()}`);
    }
  }, [category]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

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

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setError("");
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    setError("");
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError("");
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
    setError("");
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
    setError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError("");
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setError("");
  };

  const handleSecurityQuestionChange = (e) => {
    setSecurityQuestion(e.target.value);
    setError("");
  };

  const handleSecurityAnswerChange = (e) => {
    setSecurityAnswer(e.target.value);
    setError("");
  };

  const handleRegistration = (e) => {
    e.preventDefault();

    if (!category) {
      setError("Please select a category");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const isValidPassword = isPasswordValid(password);
    if (!isValidPassword.valid) {
      setError(isValidPassword.error);
      return;
    }

    if (!name || !email || !phoneNumber || !gender || !password || !confirmPassword || !securityQuestion || !securityAnswer) {
      setError("All fields are required");
      return;
    }

    Register(category, resId, labId, name, email, phoneNumber, gender, password, securityQuestion, securityAnswer);
  };

  const Register = (category, resId, labId, name, email, phoneNumber, gender, password, securityQuestion, securityAnswer) => {
    setError("");
    const registrationData = { category, resId, labId, name, email, phoneNumber, gender, password, securityQuestion, securityAnswer };
    axios
      .post("http://localhost:5000/api/register", registrationData)
      .then((response) => {
        if (response.data.message === "Registration successful") {
          console.log("Registration successful");
          alert("Registered Successfully");
          clearFields();
          navigate("/login");
        } else {
          setError("Registration failed");
          console.error("Registration failed:", response.data.error);
          alert("Error Registering Failed. Please try again later.");
        }
      })
      .catch((error) => {
        setError(error?.response?.data?.message);
        console.error("Error during registration:", error);
        console.log("User already exist");
        alert("User already exist");
      });
  };

  function clearFields() {
    setName("");
    setEmail("");
    setPhoneNumber("");
    setGender("");
    setPassword("");
    setConfirmPassword("");
    setSecurityQuestion("");
    setSecurityAnswer("");
  }

  return (
    <>
      <NavigationBar />
      <div className="registration-outer-container registration-background">
        <div className="registration-container">
          <div className="registration-overlay-container">
            <div className="registration-overlay">
              <div className="registration-overlay-panel registration-overlay-left">
                <h1 className="registration-heading">Welcome to GenovateAI</h1>
                <p className="registration-section">
                  GenovateAI is a cutting-edge platform for researchers and lab technicians to collaborate and innovate in the field of genomics.
                </p>
                <p className="registration-sections fst-italic">Register Yourself before entering to the World of GenovateAI!</p>
              </div>
            </div>
          </div>
          <div className="registration-form-container registration-log-in-container">
            <form className="registration-input-form">
              <div className="registration-formgroup">
                <select
                  className="registration-input"
                  value={category}
                  onChange={handleCategoryChange}
                >
                  <option value="">Select Category</option>
                  <option value="Researcher">Researcher</option>
                  <option value="Lab Technician">Lab Technician</option>
                </select>
              </div>
              {category === "Researcher" && (
                <div className="registration-formgroup">
                  <input
                    className="registration-input"
                    type="text"
                    placeholder="Res ID"
                    value={resId}
                    readOnly
                  />
                </div>
              )}
              {category === "Lab Technician" && (
                <div className="registration-formgroup">
                  <input
                    className="registration-input"
                    type="text"
                    placeholder="Lab ID"
                    value={labId}
                    readOnly
                  />
                </div>
              )}
              <div className="registration-formgroup">
                <input
                  ref={nameInputRef}
                  className="registration-input"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={handleNameChange}
                />
              </div>
              <div className="registration-formgroup">
                <input
                  className="registration-input"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>
              <div className="registration-formgroup">
                <input
                  className="registration-input"
                  type="text"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                />
              </div>
              <div className="registration-formgroup">
                <select
                  className="registration-input"
                  value={gender}
                  onChange={handleGenderChange}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="registration-formgroup">
                <input
                  className="registration-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={handlePasswordChange}
                />
                <p className="registration-showPassword1" onClick={togglePasswordVisibility}>
                  {showPassword ? (
                    <i className="bi bi-eye-slash"></i>
                  ) : (
                    <i className="bi bi-eye"></i>
                  )}
                </p>
              </div>
              <div className="registration-formgroup">
                <input
                  className="registration-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                />
              </div>
              <div className="registration-formgroup">
                <select
                  className="registration-input"
                  value={securityQuestion}
                  onChange={handleSecurityQuestionChange}
                >
                  <option value="">Select Security Question</option>
                  <option value="What is your pet name?">What is your pet name?</option>
                  <option value="What is your favorite book?">What is your favorite book?</option>
                  <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
                  <option value="What is your favorite movie?">What is your favorite movie?</option>
                  <option value="What city were you born in?">What city were you born in?</option>
                  <option value="What is the name of your elementary school?">What is the name of your elementary school?</option>
                </select>
              </div>
              <div className="registration-formgroup">
                <input
                  className="registration-input"
                  type="text"
                  placeholder="Enter your security answer"
                  value={securityAnswer}
                  onChange={handleSecurityAnswerChange}
                />
              </div>
              <button type="button" className="registration-submit" onClick={handleRegistration}>
                Register
              </button>
              <p className="registration-d-inline">
                Already a Member?
                <Link
                  to="/login"
                  className="mb-3 mt-3 link-success link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover text-decoration-none"
                >
                  Login
                </Link>
              </p>
              {errorField && (
                <div className="registration-error-message text-danger text-center">
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

export default Registration;