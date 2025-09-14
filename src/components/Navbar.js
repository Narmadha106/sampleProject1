import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-logo">🫀 Organ Donation System</div>
      <nav className="navbar-links">
        <NavLink to="/" end>
          Donor Dashboard
        </NavLink>
        <NavLink to="/hospital">Hospital Dashboard</NavLink>
        <NavLink to="/requests">Requests</NavLink>
        <NavLink to="/organbank">Organ Bank</NavLink>
      </nav>
    </header>
  );
}

export default Navbar;
