import React, { useState, useContext, useEffect } from "react";
import { FaUser, FaLock, FaEnvelope, FaCalendarAlt, FaHeartbeat, FaCheckCircle, FaVenusMars, FaPhone, FaMapMarkerAlt, FaPlus, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { OrganContext } from "../context/OrganContext";
import "./DonorRegistrationDashboard.css";

function DonorRegistrationDashboard() {
  const [activeTab, setActiveTab] = useState("login");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ name: "", email: "", password: "" });
  const [donorData, setDonorData] = useState({ name: "", age: "", gender: "", phoneNumber: "", address: "" });
  const [selectedOrgans, setSelectedOrgans] = useState([]);
  const [validOrgans, setValidOrgans] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [error, setError] = useState("");
  const [registeredDonor, setRegisteredDonor] = useState(null);
  const { highlightOrgan, refreshOrgans } = useContext(OrganContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchValidOrgans();
    fetchAvailability();
  }, []);

  const fetchValidOrgans = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/donors/valid-organs");
      setValidOrgans(response.data);
    } catch (error) {
      console.error("Error fetching valid organs:", error);
    }
  };

  const fetchAvailability = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/availability");
      setAvailability(response.data);
    } catch (error) {
      console.error("Error fetching availability:", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8081/api/users/login", loginData);
      alert("✅ Login successful!");
      setActiveTab("donor");
    } catch (error) {
      setError("❌ Invalid credentials!");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8081/api/users/register", {
        ...registerData,
        role: "DONOR"
      });
      alert("✅ Registration successful!");
      setActiveTab("login");
    } catch (error) {
      setError("❌ Registration failed!");
    }
  };

  const handleDonorSubmit = async (e) => {
    e.preventDefault();
    if (selectedOrgans.length === 0) return setError("⚠ Please select at least one organ.");
    
    try {
      const response = await axios.post("http://localhost:8081/api/donors/register", {
        ...donorData,
        age: parseInt(donorData.age),
        organs: selectedOrgans,
      });
      
      await refreshOrgans();
      selectedOrgans.forEach(organ => highlightOrgan(organ));
      
      setRegisteredDonor(response.data);
      alert("✅ Donor registered successfully!");
      navigate("/organbank");
    } catch (error) {
      setError("❌ Error registering donor!");
    }
  };

  const addOrgan = (organ) => {
    if (!selectedOrgans.includes(organ)) {
      setSelectedOrgans([...selectedOrgans, organ]);
    }
  };

  const removeOrgan = (organ) => {
    setSelectedOrgans(selectedOrgans.filter(o => o !== organ));
  };

  return (
    <div className="donor-dashboard">
      <div className="dashboard-header">
        <h1>🫀 Donor Registration Dashboard</h1>
        <div className="tab-navigation">
          <button className={activeTab === "login" ? "active" : ""} onClick={() => setActiveTab("login")}>Login</button>
          <button className={activeTab === "register" ? "active" : ""} onClick={() => setActiveTab("register")}>Register</button>
          <button className={activeTab === "donor" ? "active" : ""} onClick={() => setActiveTab("donor")}>Donor Registration</button>
          <button className={activeTab === "availability" ? "active" : ""} onClick={() => setActiveTab("availability")}>Availability</button>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Login Tab */}
        {activeTab === "login" && (
          <div className="tab-content">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <FaEnvelope className="icon" />
                <input
                  type="email"
                  placeholder="Email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <FaLock className="icon" />
                <input
                  type="password"
                  placeholder="Password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  required
                />
              </div>
              <button type="submit" className="submit-btn">Login</button>
            </form>
          </div>
        )}

        {/* Register Tab */}
        {activeTab === "register" && (
          <div className="tab-content">
            <h2>User Registration</h2>
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <FaUser className="icon" />
                <input
                  type="text"
                  placeholder="Name"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <FaEnvelope className="icon" />
                <input
                  type="email"
                  placeholder="Email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <FaLock className="icon" />
                <input
                  type="password"
                  placeholder="Password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                  required
                />
              </div>
              <button type="submit" className="submit-btn">Register</button>
            </form>
          </div>
        )}

        {/* Donor Registration Tab */}
        {activeTab === "donor" && (
          <div className="tab-content">
            <h2>Donor Registration</h2>
            <form onSubmit={handleDonorSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <FaUser className="icon" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={donorData.name}
                    onChange={(e) => setDonorData({...donorData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <FaCalendarAlt className="icon" />
                  <input
                    type="number"
                    placeholder="Age"
                    value={donorData.age}
                    onChange={(e) => setDonorData({...donorData, age: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <FaVenusMars className="icon" />
                  <select
                    value={donorData.gender}
                    onChange={(e) => setDonorData({...donorData, gender: e.target.value})}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <FaPhone className="icon" />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={donorData.phoneNumber}
                    onChange={(e) => setDonorData({...donorData, phoneNumber: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <FaMapMarkerAlt className="icon" />
                <textarea
                  placeholder="Address"
                  value={donorData.address}
                  onChange={(e) => setDonorData({...donorData, address: e.target.value})}
                  required
                />
              </div>
              
              <div className="organ-selection">
                <h3><FaHeartbeat /> Select Organs to Donate</h3>
                <div className="selected-organs">
                  {selectedOrgans.map((organ, index) => (
                    <div key={index} className="selected-organ">
                      <span>{organ}</span>
                      <FaTimes onClick={() => removeOrgan(organ)} />
                    </div>
                  ))}
                </div>
                <div className="available-organs">
                  {validOrgans.filter(organ => !selectedOrgans.includes(organ)).map((organ, index) => (
                    <div key={index} className="available-organ" onClick={() => addOrgan(organ)}>
                      <FaPlus /> <span>{organ}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <button type="submit" className="submit-btn">
                <FaCheckCircle /> Register Donor ({selectedOrgans.length} organs)
              </button>
            </form>
          </div>
        )}

        {/* Availability Tab */}
        {activeTab === "availability" && (
          <div className="tab-content">
            <h2>Organ Availability</h2>
            <div className="availability-grid">
              {availability.map((item, index) => (
                <div key={index} className="availability-card">
                  <h3>{item.organName}</h3>
                  <div className="count">{item.availableUnits}</div>
                  <div className={`status ${item.availableUnits > 0 ? 'available' : 'unavailable'}`}>
                    {item.availableUnits > 0 ? 'Available' : 'Not Available'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && <p className="error-text">{error}</p>}
      </div>
    </div>
  );
}

export default DonorRegistrationDashboard;