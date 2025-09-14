import React, { useState, useContext, useEffect } from "react";
import {
  FaUser,
  FaCalendarAlt,
  FaHeartbeat,
  FaCheckCircle,
  FaVenusMars,
  FaPhone,
  FaMapMarkerAlt,
  FaPlus,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { OrganContext } from "../context/OrganContext";
import "./DonorRegistrationForm.css";

// Custom event for donor registration
const DONOR_REGISTERED_EVENT = 'donorRegistered';

function DonorRegistrationForm({ onSubmitSuccess }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    phoneNumber: "",
    address: "",
  });
  const [selectedOrgans, setSelectedOrgans] = useState([]);
  const [validOrgans, setValidOrgans] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { highlightOrgan, refreshOrgans } =
    useContext(OrganContext);

  useEffect(() => {
    // Fetch valid organ types
    const fetchValidOrgans = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/api/donors/valid-organs"
        );
        setValidOrgans(response.data);
      } catch (error) {
        console.error("Error fetching valid organs:", error);
        // Fallback organs list
        setValidOrgans(["Heart", "Liver", "Kidney", "Lung", "Pancreas", "Intestine", "Cornea", "Skin", "Bone", "Heart Valve", "Blood Vessel"]);
      }
    };
    fetchValidOrgans();
  }, []);

  const addOrgan = (organ) => {
    if (!selectedOrgans.includes(organ)) {
      setSelectedOrgans([...selectedOrgans, organ]);
    }
  };

  const removeOrgan = (organ) => {
    setSelectedOrgans(selectedOrgans.filter((o) => o !== organ));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      // Only allow digits and limit to 10 characters
      const digits = value.replace(/\D/g, "").slice(0, 10);
      setFormData({ ...formData, [name]: digits });

      if (digits.length > 0 && digits.length !== 10) {
        setError("⚠ Phone number must be exactly 10 digits.");
      } else {
        setError("");
      }
    } else {
      setFormData({ ...formData, [name]: value });
      if (name === "age" && value < 18) {
        setError("⚠ Age must be 18 or above to register as a donor.");
      } else {
        setError("");
      }
    }
  };

  const nextStep = () => {
    if (step === 2 && formData.age < 18) {
      return setError("⚠ You must be at least 18 years old.");
    }
    if (step === 4 && formData.phoneNumber.length !== 10) {
      return setError("⚠ Phone number must be exactly 10 digits.");
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.age < 18)
      return setError("⚠ You must be at least 18 years old.");
    if (selectedOrgans.length === 0)
      return setError("⚠ Please select at least one organ to donate.");

    try {
      const response = await axios.post("http://localhost:8081/api/donors/register", {
        name: formData.name,
        age: parseInt(formData.age),
        gender: formData.gender,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        organs: selectedOrgans,
      });
      console.log('Donor registration response:', response.data);
      alert("✅ Donor registered successfully!");
      
      // Trigger refresh of organ context
      if (refreshOrgans) {
        refreshOrgans();
      }
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent(DONOR_REGISTERED_EVENT));
      
      // Navigate to availability page as requested
      navigate('/availability');
    } catch (error) {
      console.error("❌ Error saving donor:", error);
      console.error("Error details:", error.response?.data);
      alert(`❌ Error registering donor: ${error.response?.data || error.message}`);
    }
  };

  return (
    <div className="donor-form-container">
      <div className="donor-form-card">
        <h2>🌱 Donor Registration</h2>
        <div className="progress-bar">
          <div style={{ width: `${((step - 1) / (6 - 1)) * 100}%` }}></div>
        </div>
        <div className="donor-form-content">
          <div className="donor-form-left">
            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="form-group">
                  <FaUser className="icon" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}
              {step === 2 && (
                <div className="form-group">
                  <FaCalendarAlt className="icon" />
                  <input
                    type="number"
                    name="age"
                    placeholder="Age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}
              {step === 3 && (
                <div className="form-group">
                  <FaVenusMars className="icon" />
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              )}
              {step === 4 && (
                <div className="form-group">
                  <FaPhone className="icon" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="Phone Number (10 digits)"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    maxLength="10"
                    pattern="[0-9]{10}"
                    required
                  />
                </div>
              )}

              {step === 5 && (
                <div className="form-group">
                  <FaMapMarkerAlt className="icon" />
                  <textarea
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows="3"
                  />
                </div>
              )}
              {step === 6 && (
                <div className="organ-selection">
                  <h3>
                    <FaHeartbeat className="icon" /> Select Organs to Donate
                  </h3>

                  {/* Selected Organs */}
                  <div className="selected-organs">
                    {selectedOrgans.map((organ, index) => (
                      <div key={index} className="selected-organ">
                        <span>{organ}</span>
                        <FaTimes
                          className="remove-organ"
                          onClick={() => removeOrgan(organ)}
                          title="Remove organ"
                          aria-label={`Remove ${organ}`}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Available Organs */}
                  <div className="available-organs">
                    {validOrgans
                      .filter((organ) => !selectedOrgans.includes(organ))
                      .map((organ, index) => (
                        <div
                          key={index}
                          className="available-organ"
                          onClick={() => addOrgan(organ)}
                        >
                          <FaPlus className="add-icon" />
                          <span>{organ}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
              {error && <p className="error-text">{error}</p>}
              <div className="form-buttons">
                {step > 1 && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={prevStep}
                  >
                    Back
                  </button>
                )}
                {step < 6 ? (
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={nextStep}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn-submit"
                    disabled={selectedOrgans.length === 0}
                  >
                    <FaCheckCircle /> Submit ({selectedOrgans.length} organs)
                  </button>
                )}
              </div>
            </form>
          </div>
          <div className="donor-form-right">
            <div>
              <h3>Save Lives Today</h3>
              <p>
                Your donation can give someone a second chance at life. Join
                thousands of heroes making a difference.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonorRegistrationForm;
