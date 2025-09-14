import React, { useState } from "react";
import LoginPage from "./LoginPage";
import UserRegistrationPage from "./UserRegistrationPage";
import DonorRegistrationForm from "./DonorRegistrationForm";
import OrganAvailabilityComponent from "./OrganAvailabilityComponent";
import "./DonorDashboard.css";

function DonorDashboard() {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div>
      <div className="tab-navigation">
        <button 
          className={activeTab === "login" ? "active" : ""}
          onClick={() => setActiveTab("login")}
        >
          Login
        </button>
        <button 
          className={activeTab === "register" ? "active" : ""}
          onClick={() => setActiveTab("register")}
        >
          User Registration
        </button>
        <button 
          className={activeTab === "donor" ? "active" : ""}
          onClick={() => setActiveTab("donor")}
        >
          Donor Registration
        </button>
        <button 
          className={activeTab === "availability" ? "active" : ""}
          onClick={() => setActiveTab("availability")}
        >
          Availability
        </button>
      </div>
      
      {activeTab === "login" && <LoginPage onSwitchToRegister={() => setActiveTab("register")} onLoginSuccess={() => setActiveTab("donor")} />}
      {activeTab === "register" && <UserRegistrationPage />}
      {activeTab === "donor" && <DonorRegistrationForm onSubmitSuccess={() => setActiveTab("availability")} />}
      {activeTab === "availability" && <OrganAvailabilityComponent />}
    </div>
  );
}

export default DonorDashboard;