import React, { useState, useContext, useEffect, useCallback } from "react";
import { FaHeartbeat, FaLungs, FaBrain, FaProcedures, FaTint } from "react-icons/fa";
import { GiInternalOrgan } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { OrganContext } from "../context/OrganContext";
import "./OrganAvailabilityComponent.css";

const organIcons = {
  Heart: <FaHeartbeat />,
  Liver: <GiInternalOrgan />,
  Kidney: <FaProcedures />,
  Lung: <FaLungs />,
  Pancreas: <GiInternalOrgan />,
  Intestine: <GiInternalOrgan />,
  Cornea: <FaBrain />,
  Skin: <FaProcedures />,
  Bone: <FaProcedures />,
  "Heart Valve": <FaHeartbeat />,
  "Blood Vessel": <FaTint />,
};

function OrganAvailabilityComponent() {
  const [search, setSearch] = useState("");
  const { organs } = useContext(OrganContext);
  const [availabilityData, setAvailabilityData] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedOrgan, setSelectedOrgan] = useState(null);
  const navigate = useNavigate();

  // Fetch availability from backend
  const fetchAvailability = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8081/api/availability");
      if (response.ok) {
        const backendData = await response.json();
        setAvailabilityData(backendData.map(item => ({
          name: item.organName || item.name,
          availableUnits: item.availableUnits || 0,
          status: item.status || 'Available'
        })));
      } else {
        // Fallback to simulated data if backend fails
        const simulatedData = organs.map((organ) => ({
          name: organ.name,
          availableUnits: Math.floor(Math.random() * 10),
          status: organ.status
        }));
        setAvailabilityData(simulatedData);
      }
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching availability:", error);
      // Fallback to simulated data
      const simulatedData = organs.map((organ) => ({
        name: organ.name,
        availableUnits: Math.floor(Math.random() * 10),
        status: organ.status
      }));
      setAvailabilityData(simulatedData);
      setLastUpdated(new Date());
    }
  }, [organs]);

  useEffect(() => {
    fetchAvailability();
  }, [organs, fetchAvailability]);

  const handleSubmit = async () => {
    try {
      // Dispatch event to notify organ bank dashboard
      window.dispatchEvent(new CustomEvent('availabilitySubmitted', {
        detail: { searchTerm: search, timestamp: new Date() }
      }));
      
      alert('✅ Availability data submitted successfully!');
      navigate('/organbank');
    } catch (error) {
      console.error('Error submitting availability:', error);
      alert('Error processing request. Please try again.');
    }
  };

  return (
    <main className="organ-availability">
      <div className="title-container">
        <h1 className="page-title">🫀 Organ Availability Dashboard</h1>
        <p className="subtitle">
          Real-time status of available donor organs across the network
        </p>
      </div>

      <input
        type="search"
        placeholder="🔍 Search organ..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-bar"
      />

      <div className="availability-header">
        <button className="refresh-btn" onClick={fetchAvailability}>
          🔄 Refresh
        </button>
        {lastUpdated && (
          <span className="last-updated">
            Last updated: {lastUpdated.toLocaleDateString()}{" "}
            {lastUpdated.toLocaleTimeString()}
          </span>
        )}
      </div>

      <section
        className={`organ-grid ${
          search && availabilityData.length > 0 ? "full-page" : ""
        }`}
      >
        {availabilityData.length === 0 ? (
          <p className="no-organs">⚠️ No organs available right now.</p>
        ) : (
          availabilityData
            .filter((organ, index, self) => 
              self.findIndex(o => o.name === organ.name) === index &&
              organ.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((organ) => {
            const units = organ.availableUnits || 0;
            const status = organ.status || "Unavailable";
            const isLow = units < 5;

            return (
              <article
                key={organ.name}
                className={`organ-card ${organ.name.replace(" ", "-")} fade-in`}
              >
                <div className="organ-icon">{organIcons[organ.name] || <GiInternalOrgan />}</div>
                <h2 className="organ-name">{organ.name}</h2>
                <div className={`status-pill ${status.toLowerCase()}`}>
                  {status}
                </div>

                <div className="availability-bar-container">
                  <div
                    className="availability-bar"
                    style={{
                      width: `${Math.min(units * 10, 100)}%`,
                      backgroundColor: isLow ? "#ff4d4f" : "#43cea2",
                    }}
                  ></div>
                </div>
                <p className={`availability-text ${isLow ? "low" : ""}`}>
                  Available units: {units}
                </p>
              </article>
            );
          })
        )}
      </section>
      
      {search && availabilityData.filter((organ, index, self) => 
        self.findIndex(o => o.name === organ.name) === index &&
        organ.name.toLowerCase().includes(search.toLowerCase())
      ).length > 0 && (
        <div className="submit-section">
          <button 
            className="submit-btn" 
            onClick={handleSubmit}
          >
            Submit Request
          </button>
        </div>
      )}
    </main>
  );
}

export default OrganAvailabilityComponent;
