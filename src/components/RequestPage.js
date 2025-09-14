import React, { useState, useEffect } from "react";
import { FaHospital } from "react-icons/fa";
import axios from "axios";
import "./RequestPage.css";

function RequestPage() {
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState("id");
  const [sortDir, setSortDir] = useState("desc");
  const [filter, setFilter] = useState("");
  const [filterType, setFilterType] = useState("hospital");

  useEffect(() => {
    fetchRequests();
  }, [page, sortBy, sortDir, filter, filterType]);

  const fetchRequests = async () => {
    try {
      let url = "http://localhost:8081/api/requests/paginated";
      const params = { page, size: 10, sortBy, sortDir };

      if (filter) {
        if (filterType === "hospital") {
          url = "http://localhost:8081/api/requests/search";
          params.hospitalName = filter;
        } else if (filterType === "organ") {
          url = "http://localhost:8081/api/requests/filter/organ";
          params.organType = filter;
        } else if (filterType === "status") {
          url = "http://localhost:8081/api/requests/filter/status";
          params.status = filter;
        }
      }

      const response = await axios.get(url, { params });
      setRequests(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  return (
    <div className="request-page">
      <div className="header">
        <FaHospital className="header-icon" />
        <h1>Hospital Requests</h1>
      </div>

      <div className="controls">
        <div className="filters">
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="hospital">Hospital</option>
            <option value="organ">Organ</option>
            <option value="status">Status</option>
          </select>
          <input
            type="text"
            placeholder={`Filter by ${filterType}`}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        
        <div className="sorting">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="id">ID</option>
            <option value="hospitalName">Hospital</option>
            <option value="patientName">Patient</option>
            <option value="urgency">Urgency</option>
          </select>
          <button onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}>
            {sortDir === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>

      <div className="requests-table">
        <div className="table-header">
          <span>Hospital</span>
          <span>Patient</span>
          <span>Organ</span>
          <span>Blood Type</span>
          <span>Urgency</span>
          <span>Status</span>
        </div>
        
        {requests.map((request) => (
          <div key={request.id} className="table-row">
            <span>{request.hospitalName}</span>
            <span>{request.patientName}</span>
            <span>{request.organType}</span>
            <span>{request.bloodType}</span>
            <span className={`urgency-${request.urgency?.toLowerCase()}`}>
              {request.urgency}
            </span>
            <span className={`status-${request.status?.toLowerCase()}`}>
              {request.status}
            </span>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}>
          Previous
        </button>
        <span>Page {page + 1} of {totalPages}</span>
        <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1}>
          Next
        </button>
      </div>
    </div>
  );
}

export default RequestPage;