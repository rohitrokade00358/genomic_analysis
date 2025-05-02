import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import { FaBars, FaHome, FaChartLine, FaHistory, FaSignOutAlt } from "react-icons/fa";
import axios from "axios";

const Dashboard = () => {

  const [user, setUser] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showHistory, setShowHistory] = useState(false); // New state for History panel
  const [history, setHistory] = useState([]);
  const [analysisType, setAnalysisType] = useState("Gene Expression");
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const category = sessionStorage.getItem("category");
  const userId = sessionStorage.getItem("userId");
  const navigate = useNavigate();

  // Logout Functionality
  const handleLogout = async () => {
    try {
      // Update logout time in the backend
      await axios.put(`http://localhost:5000/api/history/logout/${userId}`);
    } catch (error) {
      console.error("Error updating logout time:", error);
    }

    // Clear session storage
    sessionStorage.removeItem("user-token");
    sessionStorage.removeItem("category");
    sessionStorage.removeItem("userId");

    // Redirect to login page
    navigate("/login");
  };

  // PROFILE VIEW AND UPDATE
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/user/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchUserDetails();
  }, [userId]);


  const handleProcess = async () => {
    if (!file) {
      alert("Please upload a FASTA file");
      return;
    }

    try {
      // Create FormData to send the file as multipart/form-data
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://127.0.0.1:8000/mlapp/process/", {
        method: "POST",
        body: formData,  // Send the file inside formData
      });

      if (!response.ok) {
        throw new Error("Error processing ML model");
      }

      const data = await response.json();
      setImageUrl(data.image_url);

      // Store process time and analysis preference in the history
      const processTime = new Date().toISOString();
      await axios.post("http://localhost:5000/api/history", {
        userId,
        name: user.name,
        phone: user.phone,
        analysisPreference,
        processTime,  // Send process time to the backend
      });

      // Fetch history again to update the history panel
      const historyResponse = await axios.get(`http://localhost:5000/api/history/${userId}`);
      setHistory(historyResponse.data);

    } catch (error) {
      console.error("Error processing ML model:", error);
    }
  };


  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/user/${userId}`, user);
      alert("User details updated!");
      setEditMode(false);
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/user/${userId}`);
      alert("User details deleted!");
      setUser({ name: "", phone: "", email: "" });
    } catch (error) {
      console.error("Error deleting user details:", error);
    }
  };

  // HISTORY VIEW
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/history/${userId}`);
        setHistory(response.data);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };
    fetchHistory();
  }, [userId]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const fileTypeMap = {
      "Gene Expression": [".fasta", ".fa"],
      "Lung Cancer Prediction": [".jpeg", ".png"],
      "Functional Annotation": [".csv"],
      "Variant Risk": [".fasta", ".cvf"],
    };

    const validExtensions = fileTypeMap[analysisType];
    const fileExtension = selectedFile.name.split(".").pop().toLowerCase();

    if (!validExtensions.includes(`.${fileExtension}`)) {
      alert(`Please upload a valid file type: ${validExtensions.join(", ")}`);
      setFile(null);
      return;
    }
    setFile(selectedFile);
  };

  return (
    <div className={`dashboard-container ${isCollapsed ? "collapsed" : ""}`}>
      {/* Sidebar */}
      <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
        <button className="collapse-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
          <FaBars />
        </button>
        <h1 className="logo">
          {!isCollapsed && (
            <>
              <img src="/images/logo.png" alt="GenovateAI" className="logo-img" />
              <span className="title">GenovateAI</span>
            </>
          )}
          {isCollapsed ? "G" : ""}
        </h1>

        <ul>
          <li>
            <button className="sidebar-btn" onClick={() => { setShowAnalysis(false); setShowHistory(false); }}>
              <FaHome className="icon" /> {!isCollapsed && "Dashboard"}
            </button>
          </li>
          <li>
            <button className="sidebar-btn" onClick={() => { setShowAnalysis(true); setShowHistory(false); }}>
              <FaChartLine className="icon" /> {!isCollapsed && "Analysis"}
            </button>
          </li>
          <li>
            <button className="sidebar-btn" onClick={() => { setShowAnalysis(false); setShowHistory(true); }}>
              <FaHistory className="icon" /> {!isCollapsed && "History"}
            </button>
          </li>
        </ul>

        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt className="icon" /> {!isCollapsed && "Logout"}
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {!showAnalysis && !showHistory ? (
          <div className="user-dashboard">
            <div className="labid">{category === "Researcher" ? "ResID" : "LabID"} : {userId}</div>
            <br />
            {editMode ? (
              <form onSubmit={handleSubmit}>
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  required
                />
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={user.phoneNumber}
                  onChange={handleChange}
                  disabled // Disable the phone number field
                />
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  required
                />
                <button type="submit" className="process-btn">
                  Save
                </button>
              </form>
            ) : (
              <>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Phone:</strong> {user.phoneNumber}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <button onClick={() => setEditMode(true)} className="process-btn">
                  Edit
                </button>
                <button onClick={handleDelete} className="delete-btn">
                  Delete
                </button>
              </>
            )}
          </div>
        ) : showAnalysis ? (
          <div className="analysis-panel">
            <div className="labid">{category === "Researcher" ? "ResID" : "LabID"} : {userId}</div>
            <br />
            <label>Analysis Preference:</label>
            <select value={analysisType} onChange={(e) => setAnalysisType(e.target.value)}>
              <option>Gene Expression</option>
              <option>Lung Cancer Prediction</option>
              <option>Functional Annotation</option>
              <option>Variant Risk</option>
            </select>

            <p className="file-note">**Required file type: {analysisType === "Gene Expression" ? "FASTA,FA" : analysisType === "Lung Cancer Prediction" ? "JPEG, PNG" : analysisType === "Functional Annotation" ? "CSV" : "FASTA, CVF"}</p>
            <br />
            <label>Upload File:</label>
            <input type="file" onChange={handleFileChange} />
            <button className="process-btn" onClick={handleProcess}>Process</button>
            {imageUrl && (
              <table>
                <thead>
                  <tr>
                    <th>Generated Image</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <a href={imageUrl} target="_blank" rel="noopener noreferrer">
                        <img src={imageUrl} alt="ML Output" width="200" />
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        ) : (
          <div className="history-panel">
            <h2>History</h2>
            <table>
              <thead>
                <tr>
                  <th>Analysis Preference</th>
                  <th>Login Time</th>
                  <th>Logout Time</th>
                  <th>Process Time</th>
                </tr>
              </thead>
              <tbody>
                {history.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.analysisPreference}</td>
                    <td>{new Date(entry.loginTime).toLocaleString()}</td>
                    <td>{entry.logoutTime ? new Date(entry.logoutTime).toLocaleString() : "N/A"}</td>
                    <td>{entry.processTime ? new Date(entry.processTime).toLocaleString() : "N/A"}</td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;