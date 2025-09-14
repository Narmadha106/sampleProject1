import React, { useState, useEffect } from "react";
import { FaBuilding, FaHeartbeat, FaHospital } from "react-icons/fa";
import axios from "axios";
import "./OrganBankDashboard.css";

const DONOR_REGISTERED_EVENT = 'donorRegistered';

function OrganBankDashboard() {
  const [donors, setDonors] = useState([]);
  const [requests, setRequests] = useState([]);
  
  useEffect(() => {
    fetchDonors();
    fetchRequests();
    
    const interval = setInterval(() => {
      fetchDonors();
      fetchRequests();
    }, 5000);
    
    const handleDonorRegistered = () => {
      fetchDonors();
    };
    
    const handleRequestSent = () => {
      fetchRequests();
    };
    
    window.addEventListener(DONOR_REGISTERED_EVENT, handleDonorRegistered);
    window.addEventListener('hospitalRequestSent', handleRequestSent);
    window.addEventListener('forceRefreshRequests', handleRequestSent);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener(DONOR_REGISTERED_EVENT, handleDonorRegistered);
      window.removeEventListener('hospitalRequestSent', handleRequestSent);
      window.removeEventListener('forceRefreshRequests', handleRequestSent);
    };
  }, []);

  const fetchDonors = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/donors");
      setDonors(response.data || []);
    } catch (error) {
      console.error("Error fetching donors:", error);
      setDonors([]);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/requests");
      setRequests(response.data || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
      setRequests([]);
    }
  };

  const calculateMatchPercentage = (request, donors) => {
    if (!request || !donors || donors.length === 0) return 0;
    
    const matchingDonors = donors.filter(donor => {
      if (!donor.organs || !Array.isArray(donor.organs)) return false;
      
      const hasOrgan = donor.organs.some(organ => {
        const organName = organ.organName || organ;
        return organName.toLowerCase() === request.organType.toLowerCase();
      });
      
      return hasOrgan;
    });
    
    return matchingDonors.length > 0 ? 100 : 0;
  };

  const getRequestStatus = (request, matchPercentage) => {
    if (matchPercentage >= 100) return "FULFILLED";
    return request.status || "PENDING";
  };

  const CircularProgress = ({ percentage, size = 40 }) => {
    const radius = (size - 8) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
    
    const getGradientId = () => `gradient-${Math.random().toString(36).substr(2, 9)}`;
    const gradientId = getGradientId();
    
    return (
      <div style={{ 
        position: 'relative', 
        width: size, 
        height: size,
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
      }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={percentage >= 100 ? "#00d4aa" : percentage > 0 ? "#ffd700" : "#ff6b6b"} />
              <stop offset="100%" stopColor={percentage >= 100 ? "#28a745" : percentage > 0 ? "#ff8c00" : "#dc3545"} />
            </linearGradient>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#f0f0f0"
            strokeWidth="4"
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#${gradientId})`}
            strokeWidth="5"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dasharray 0.8s ease-in-out',
              filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.2))'
            }}
          />
        </svg>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: size > 50 ? '14px' : '11px',
          fontWeight: '700',
          color: percentage >= 100 ? "#28a745" : percentage > 0 ? "#ff8c00" : "#dc3545",
          textShadow: '0 1px 2px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px'
        }}>
          <span>{percentage}%</span>
          {size > 50 && (
            <span style={{
              fontSize: '8px',
              color: '#666',
              fontWeight: '500'
            }}>
              {percentage >= 100 ? 'MATCH' : 'NO MATCH'}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="organbank-dashboard" style={{width: '100vw', minHeight: '100vh', boxSizing: 'border-box'}}>
      <div className="dashboard-header">
        <FaBuilding className="header-icon" />
        <h1>Organ Bank Dashboard</h1>
        <p>Donor Information Management</p>
      </div>

      {/* Big Central Progress Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '40vh',
        marginBottom: '40px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,249,250,0.9) 100%)',
          padding: '40px',
          borderRadius: '30px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.15), 0 10px 25px rgba(0,0,0,0.1)',
          textAlign: 'center',
          backdropFilter: 'blur(15px)',
          border: '2px solid rgba(255,255,255,0.3)'
        }}>
          <h2 style={{
            color: '#2c3e50',
            marginBottom: '30px',
            fontSize: '28px',
            fontWeight: '700'
          }}>Overall Organ Matching Status</h2>
          <CircularProgress 
            percentage={requests.length > 0 ? Math.round((requests.filter(req => calculateMatchPercentage(req, donors) >= 100).length / requests.length) * 100) : 0} 
            size={200} 
          />
          <div style={{
            marginTop: '20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            fontSize: '14px'
          }}>
            <div style={{ color: '#28a745', fontWeight: '600' }}>
              ✅ Fulfilled: {requests.filter(req => calculateMatchPercentage(req, donors) >= 100).length}
            </div>
            <div style={{ color: '#dc3545', fontWeight: '600' }}>
              ⏳ Pending: {requests.filter(req => calculateMatchPercentage(req, donors) < 100).length}
            </div>
            <div style={{ color: '#2c3e50', fontWeight: '600' }}>
              📊 Total: {requests.length}
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Hospital Requests Section */}
        <div className="requests-section" style={{
          marginBottom: '30px',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,249,250,0.95) 100%)',
          border: '1px solid rgba(0,0,0,0.05)',
          boxShadow: '0 15px 35px rgba(0,0,0,0.08), 0 5px 15px rgba(0,0,0,0.05)'
        }}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
            <h2><FaHospital /> Hospital Requests ({requests.length})</h2>
            <button 
              onClick={() => {
                console.log('Manual refresh requests clicked');
                fetchRequests();
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              🔄 Refresh Requests
            </button>
          </div>
          <div className="requests-table" style={{overflowX: 'auto', width: '100%'}}>
            <div className="table-header">
              <span>Hospital</span>
              <span>Patient</span>
              <span>Age</span>
              <span>Organ</span>
              <span>Blood Type</span>
              <span>Urgency</span>
              <span>Match</span>
              <span>Contact</span>
              <span>Status</span>
            </div>
            {Array.isArray(requests) && requests.length > 0 ? requests.map((request, index) => {
              const matchPercentage = calculateMatchPercentage(request, donors);
              const currentStatus = getRequestStatus(request, matchPercentage);
              
              return (
                <div key={request.id || index} className="table-row">
                  <span>{request.hospitalName || 'N/A'}</span>
                  <span>{request.patientName || 'N/A'}</span>
                  <span>{request.patientAge || 'N/A'}</span>
                  <span>{request.organType || 'N/A'}</span>
                  <span>{request.bloodType || 'N/A'}</span>
                  <span className={`urgency-${(request.urgency || 'MEDIUM').toLowerCase()}`}>
                    {request.urgency || 'MEDIUM'}
                  </span>
                  <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress percentage={matchPercentage} size={60} />
                  </span>
                  <span>{request.contactNumber || 'N/A'}</span>
                  <span className={`status-${currentStatus.toLowerCase()}`}>
                    {currentStatus}
                  </span>
                </div>
              );
            }) : (
              <div className="table-row" style={{gridColumn: '1 / -1'}}>
                <span style={{textAlign: 'center', color: '#666', padding: '20px'}}>No requests received yet</span>
              </div>
            )}
          </div>
        </div>

        <div className="donors-section">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
            <h2><FaHeartbeat /> Donor Information ({donors.length})</h2>
            <button 
              onClick={() => {
                console.log('Manual refresh donors clicked');
                fetchDonors();
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              🔄 Refresh Donors
            </button>
          </div>
          <div className="donors-table" style={{overflowX: 'auto', width: '100%'}}>
            <div className="table-header">
              <span>Name</span>
              <span>Age</span>
              <span>Gender</span>
              <span>Contact</span>
              <span>Address</span>
              <span>Donated Organs</span>
              <span>Count</span>
            </div>
            {Array.isArray(donors) && donors.length > 0 ? donors.map((donor, index) => (
              <div key={donor.id || index} className="table-row">
                <span>{donor.name || 'N/A'}</span>
                <span>{donor.age || 'N/A'}</span>
                <span>{donor.gender || 'N/A'}</span>
                <span>{donor.phoneNumber || 'N/A'}</span>
                <span>{donor.address || 'N/A'}</span>
                <span className="organs-list">
                  {donor.organs && Array.isArray(donor.organs) && donor.organs.length > 0 ? 
                    donor.organs.map(organ => organ.organName || organ).join(", ") : "No organs donated"}
                </span>
                <span className="organ-count">
                  {donor.organs && Array.isArray(donor.organs) ? donor.organs.length : 0}
                </span>
              </div>
            )) : (
              <div className="table-row" style={{gridColumn: '1 / -1'}}>
                <span style={{textAlign: 'center', color: '#666', padding: '20px'}}>No donors registered yet</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrganBankDashboard;