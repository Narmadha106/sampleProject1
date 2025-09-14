import React, { useState, useEffect } from "react";
import { FaHospital, FaPaperPlane } from "react-icons/fa";
import axios from "axios";
import "./HospitalDashboard.css";

function HospitalDashboard() {
  const [newRequest, setNewRequest] = useState({
    hospitalName: "",
    organType: "",
    urgency: "MEDIUM",
    patientName: "",
    patientAge: "",
    bloodType: "",
    contactNumber: ""
  });
  const [validOrgans, setValidOrgans] = useState([]);

  useEffect(() => {
    fetchValidOrgans();
  }, []);

  const fetchValidOrgans = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/donors/valid-organs");
      setValidOrgans(response.data);
    } catch (error) {
      setValidOrgans(["Heart", "Liver", "Kidney", "Lung", "Pancreas", "Intestine", "Cornea", "Skin", "Bone"]);
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!newRequest.hospitalName || !newRequest.organType || !newRequest.patientName) {
      alert("Please fill in all required fields");
      return;
    }
    
    const requestData = {
      hospitalName: newRequest.hospitalName.trim(),
      organType: newRequest.organType,
      urgency: newRequest.urgency,
      bloodType: newRequest.bloodType,
      patientName: newRequest.patientName.trim(),
      patientAge: newRequest.patientAge ? parseInt(newRequest.patientAge) : null,

      contactNumber: newRequest.contactNumber?.trim() || "",
      status: "PENDING"
    };
    
    console.log('Sending hospital request:', requestData);
    
    try {
      const response = await axios.post("http://localhost:8081/api/requests", requestData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Request sent successfully!');
      console.log('Response:', response.data);
      console.log('Status:', response.status);
      
      // Dispatch multiple events to ensure OrganBank refreshes
      window.dispatchEvent(new CustomEvent('hospitalRequestSent', {
        detail: { request: response.data, timestamp: new Date() }
      }));
      
      // Force immediate refresh of OrganBank
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('forceRefreshRequests'));
      }, 100);
      
      alert(`✅ Request sent successfully!\n\nPatient: ${requestData.patientName}\nOrgan: ${requestData.organType}\nUrgency: ${requestData.urgency}\n\nCheck OrganBank Dashboard to see your request.`);
      
      // Reset form
      setNewRequest({ 
        hospitalName: "", 
        organType: "", 
        urgency: "MEDIUM", 
        patientName: "", 
        patientAge: "", 
        bloodType: "", 
        contactNumber: "" 
      });
      
    } catch (error) {
      console.error("❌ Error sending request:", error);
      
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        alert('❌ Backend server is not running!\n\nPlease start the backend server on port 8081 and try again.');
      } else if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Error status:", error.response.status);
        const errorMsg = error.response.data || "Server error";
        alert(`❌ Server error: ${errorMsg}`);
      } else {
        alert('❌ Network connection failed!\n\nCheck if backend is running on http://localhost:8081');
      }
    }
  };



  return (
    <div className="hospital-dashboard">
      <div className="dashboard-header">
        <FaHospital className="header-icon" />
        <h1>Hospital Dashboard</h1>
        <p>Manage organ requests and check availability</p>
      </div>

      <div className="dashboard-content">
        {/* Request Form */}
        <div className="request-form-section">
          <h2><FaPaperPlane /> Send Organ Request</h2>
          <form onSubmit={handleSubmitRequest} className="request-form">
            <div className="form-row">
              <input
                type="text"
                placeholder="Hospital Name"
                value={newRequest.hospitalName}
                onChange={(e) => setNewRequest({...newRequest, hospitalName: e.target.value})}
                required
              />
              <select
                value={newRequest.organType}
                onChange={(e) => setNewRequest({...newRequest, organType: e.target.value})}
                required
              >
                <option value="">Select Organ</option>
                {validOrgans.map(organ => (
                  <option key={organ} value={organ}>{organ}</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <input
                type="text"
                placeholder="Patient Name"
                value={newRequest.patientName}
                onChange={(e) => setNewRequest({...newRequest, patientName: e.target.value})}
                required
              />
              <input
                type="number"
                placeholder="Patient Age"
                value={newRequest.patientAge}
                onChange={(e) => setNewRequest({...newRequest, patientAge: e.target.value})}
                required
              />
            </div>
            <div className="form-row">
              <select
                value={newRequest.bloodType}
                onChange={(e) => setNewRequest({...newRequest, bloodType: e.target.value})}
                required
              >
                <option value="">Select Blood Type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
              <select
                value={newRequest.urgency}
                onChange={(e) => setNewRequest({...newRequest, urgency: e.target.value})}
              >
                <option value="LOW">Low Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="HIGH">High Priority</option>
              </select>
            </div>
            <div className="form-row">
              <input
                type="tel"
                placeholder="Contact Number"
                value={newRequest.contactNumber}
                onChange={(e) => setNewRequest({...newRequest, contactNumber: e.target.value})}
                required
              />

            </div>
            <button type="submit" className="submit-btn">
              <FaPaperPlane /> Send Request
            </button>
          </form>
        </div>


      </div>
    </div>
  );
}

export default HospitalDashboard;