import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import "./UserRegistrationPage.css";

function UserRegistrationPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Registering user with data:", formData);
      const response = await axios.post("http://localhost:8081/api/users/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: "USER"
      });

      console.log("✅ User saved:", response.data);
      alert("🌱 User Registered Successfully!");

      // Redirect to login page after registration
      navigate("/login"); 

      // Reset form
      setFormData({ username: "", email: "", password: "" });

    } catch (error) {
      console.error("❌ Error saving user:", error);
      const errorMessage = error.response?.data || "Registration failed. Please try again.";
      setError(errorMessage);
      alert("❌ " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-left">
        <i className="fas fa-hand-holding-heart hero-icon"></i>
        <h1>
          Be a <span>Life Saver</span>
        </h1>
        <p>
          By registering, you take the first step towards giving the
          <strong> gift of life</strong>. Every donor is a hero! 💚
        </p>
      </div>

      <div className="register-right">
        <div className="register-card">
          <h2>🌍 User Registration</h2>
          <p className="sub-text">Join our Organ Donation Network</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <i className="fas fa-user"></i>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {error && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
            <button type="submit" disabled={loading}>
              <i className="fas fa-heartbeat"></i> {loading ? "Registering..." : "Register as User"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserRegistrationPage;
