import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginPage.css";

function LoginPage({ onSwitchToRegister, onLoginSuccess }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      console.log("Attempting login with:", formData);
      const response = await axios.post("http://localhost:8081/api/users/login", formData);
      
      console.log("Login successful:", response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      
      alert("Login Successful! Redirecting...");
      setFormData({ username: "", password: "" });
      
      if (onLoginSuccess) {
        onLoginSuccess(response.data);
      }
      
      // Navigate based on user role
      if (response.data.role === 'ADMIN') {
        navigate('/organbank');
      } else {
        navigate('/donor');
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data || "Login failed. Please try again.";
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="doctor-symbol">🩺</div>
        <h2>Welcome Back</h2>
        <p className="subtitle">Please login to continue</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Enter Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="register-text">
          Don’t have an account? <button type="button" className="link-button" onClick={() => onSwitchToRegister ? onSwitchToRegister() : navigate('/')}>Register</button>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;