import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import DonorRegistrationForm from "./components/DonorRegistrationForm";
import OrganAvailabilityComponent from "./components/OrganAvailabilityComponent";
import HospitalDashboard from "./components/HospitalDashboard";
import OrganBank from "./components/OrganBank";
import DonorDashboard from "./components/DonorDashboard";
import RequestPage from "./components/RequestPage";

import LoginPage from "./components/LoginPage";

import { OrganProvider } from "./context/OrganContext";

function App() {
  return (
    <Router>
      <OrganProvider>
        <div className="App">
          <Navbar />
          <Routes>
            {/* Login page route */}
            <Route path="/" element={<DonorDashboard />} />
            <Route path="/donor" element={<DonorRegistrationForm />} />
            <Route path="/availability" element={<OrganAvailabilityComponent />} />
            <Route path="/hospital" element={<HospitalDashboard />} />
            <Route path="/organbank" element={<OrganBank />} />
            <Route path="/requests" element={<RequestPage />} />

            <Route path="/donor-dashboard" element={<DonorDashboard />} />
            <Route path="/login" element={<LoginPage />} />

            <Route
              path="*"
              element={<h2 style={{ textAlign: "center", marginTop: "50px" }}>404 - Page Not Found</h2>}
            />
          </Routes>
        </div>
      </OrganProvider>
    </Router>
  );
}

export default App;
