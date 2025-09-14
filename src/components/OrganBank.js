import React, { useState, useEffect } from "react";
import { FaBuilding, FaHeartbeat, FaHospital, FaChartLine } from "react-icons/fa";
import axios from "axios";
import "./OrganBank.css";

function OrganBank() {
  const [activeTab, setActiveTab] = useState("donors");
  const [donors, setDonors] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [donorsRes, requestsRes] = await Promise.all([
        axios.get("http://localhost:8081/api/donors"),
        axios.get("http://localhost:8081/api/requests")
      ]);
      setDonors(donorsRes.data || []);
      setRequests(requestsRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const calculateMatchPercentage = (request) => {
    const matchingDonors = donors.filter(donor => 
      donor.organs?.some(organ => 
        organ.organName?.toLowerCase() === request.organType?.toLowerCase()
      )
    );
    return matchingDonors.length > 0 ? 100 : 0;
  };

  const getProgressStats = () => {
    const fulfilled = requests.filter(req => calculateMatchPercentage(req) >= 100).length;
    const pending = requests.length - fulfilled;
    const totalDonors = donors.length;
    const totalOrgans = donors.reduce((sum, donor) => sum + (donor.organs?.length || 0), 0);
    
    return { fulfilled, pending, totalDonors, totalOrgans, totalRequests: requests.length };
  };

  const DonorSection = () => (
    <div className="section-content">
      <div className="section-header">
        <h2><FaHeartbeat /> Donor Information ({donors.length})</h2>
        <button onClick={fetchData} className="refresh-btn">🔄 Refresh</button>
      </div>
      
      <div className="data-table">
        <div className="table-header">
          <span>Name</span>
          <span>Age</span>
          <span>Gender</span>
          <span>Contact</span>
          <span>Address</span>
          <span>Organs</span>
          <span>Count</span>
        </div>
        
        {donors.length > 0 ? donors.map((donor, index) => (
          <div key={donor.id || index} className="table-row">
            <span>{donor.name || 'N/A'}</span>
            <span>{donor.age || 'N/A'}</span>
            <span>{donor.gender || 'N/A'}</span>
            <span>{donor.phoneNumber || 'N/A'}</span>
            <span>{donor.address || 'N/A'}</span>
            <span className="organs-list">
              {donor.organs?.map(organ => organ.organName || organ).join(", ") || "No organs"}
            </span>
            <span className="organ-count">{donor.organs?.length || 0}</span>
          </div>
        )) : (
          <div className="no-data">No donors registered yet</div>
        )}
      </div>
    </div>
  );

  const RequestsSection = () => (
    <div className="section-content">
      <div className="section-header">
        <h2><FaHospital /> Hospital Requests ({requests.length})</h2>
        <button onClick={fetchData} className="refresh-btn">🔄 Refresh</button>
      </div>
      
      <div className="data-table">
        <div className="table-header">
          <span>Hospital</span>
          <span>Patient</span>
          <span>Age</span>
          <span>Organ</span>
          <span>Blood Type</span>
          <span>Urgency</span>
          <span>Contact</span>
          <span>Status</span>
        </div>
        
        {requests.length > 0 ? requests.map((request, index) => {
          const matchPercentage = calculateMatchPercentage(request);
          const status = matchPercentage >= 100 ? "FULFILLED" : "PENDING";
          
          return (
            <div key={request.id || index} className="table-row">
              <span>{request.hospitalName || 'N/A'}</span>
              <span>{request.patientName || 'N/A'}</span>
              <span>{request.patientAge || 'N/A'}</span>
              <span>{request.organType || 'N/A'}</span>
              <span>{request.bloodType || 'N/A'}</span>
              <span className={`urgency urgency-${(request.urgency || 'MEDIUM').toLowerCase()}`}>
                {request.urgency || 'MEDIUM'}
              </span>
              <span>{request.contactNumber || 'N/A'}</span>
              <span className={`status status-${status.toLowerCase()}`}>
                {status}
              </span>
            </div>
          );
        }) : (
          <div className="no-data">No requests received yet</div>
        )}
      </div>
    </div>
  );

  const ProgressSection = () => {
    const stats = getProgressStats();
    const fulfillmentRate = stats.totalRequests > 0 ? Math.round((stats.fulfilled / stats.totalRequests) * 100) : 0;
    
    return (
      <div className="section-content">
        <div className="section-header">
          <h2><FaChartLine /> Progress Overview</h2>
        </div>
        
        <div className="progress-grid">
          <div className="progress-card">
            <div className="card-icon">👥</div>
            <div className="card-number">{stats.totalDonors}</div>
            <div className="card-label">Total Donors</div>
          </div>
          
          <div className="progress-card">
            <div className="card-icon">🫀</div>
            <div className="card-number">{stats.totalOrgans}</div>
            <div className="card-label">Available Organs</div>
          </div>
          
          <div className="progress-card">
            <div className="card-icon">🏥</div>
            <div className="card-number">{stats.totalRequests}</div>
            <div className="card-label">Total Requests</div>
          </div>
          
          <div className="progress-card">
            <div className="card-icon">✅</div>
            <div className="card-number">{stats.fulfilled}</div>
            <div className="card-label">Fulfilled</div>
          </div>
          
          <div className="progress-card">
            <div className="card-icon">⏳</div>
            <div className="card-number">{stats.pending}</div>
            <div className="card-label">Pending</div>
          </div>
          
          <div className="progress-card highlight">
            <div className="card-icon">📊</div>
            <div className="card-number">{fulfillmentRate}%</div>
            <div className="card-label">Success Rate</div>
          </div>
        </div>
        
        <div className="progress-details">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            {requests.slice(0, 5).map((request, index) => (
              <div key={index} className="activity-item">
                <span className="activity-icon">🏥</span>
                <span className="activity-text">
                  {request.hospitalName} requested {request.organType} for {request.patientName}
                </span>
                <span className={`activity-status status-${calculateMatchPercentage(request) >= 100 ? 'fulfilled' : 'pending'}`}>
                  {calculateMatchPercentage(request) >= 100 ? 'Matched' : 'Pending'}
                </span>
              </div>
            ))}
            {requests.length === 0 && (
              <div className="activity-item">
                <span className="activity-text">No recent activity</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="organ-bank">
      <div className="header">
        <FaBuilding className="header-icon" />
        <h1>Organ Bank Management</h1>
        <p>Comprehensive donor and request management system</p>
      </div>

      <div className="tab-navigation">
        <button 
          className={activeTab === "donors" ? "active" : ""} 
          onClick={() => setActiveTab("donors")}
        >
          <FaHeartbeat /> Donor Information
        </button>
        <button 
          className={activeTab === "requests" ? "active" : ""} 
          onClick={() => setActiveTab("requests")}
        >
          <FaHospital /> Hospital Requests
        </button>
        <button 
          className={activeTab === "progress" ? "active" : ""} 
          onClick={() => setActiveTab("progress")}
        >
          <FaChartLine /> Progress Overview
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "donors" && <DonorSection />}
        {activeTab === "requests" && <RequestsSection />}
        {activeTab === "progress" && <ProgressSection />}
      </div>
    </div>
  );
}

export default OrganBank;