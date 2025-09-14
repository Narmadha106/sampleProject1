import React, { createContext, useState, useEffect } from "react";

export const OrganContext = createContext();

export const OrganProvider = ({ children }) => {
  const [organs, setOrgans] = useState([]);
  const [highlighted, setHighlighted] = useState("");

  // ✅ Allowed organs only
  const allowedOrgans = ["Heart", "Liver", "Kidney", "Lungs", "Bone Marrow", "Blood"];

  // Fetch organs from backend on component mount
  useEffect(() => {
    const fetchOrgans = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/availability");
        if (response.ok) {
          const backendOrgans = await response.json();
          setOrgans(
            backendOrgans
              .map((organ) => ({
                name: organ.organName,
                status: organ.status,
              }))
              .filter((organ) => allowedOrgans.includes(organ.name))
          );
        } else {
          // ❌ Fallback to only six organs
          setOrgans(
            allowedOrgans.map((name) => ({
              name,
              status: "Unavailable",
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching organs:", error);
        setOrgans(
          allowedOrgans.map((name) => ({
            name,
            status: "Unavailable",
          }))
        );
      }
    };
    fetchOrgans();
  }, []);

  const addOrUpdateOrgan = ({ name, status }) => {
    if (!allowedOrgans.includes(name)) return;
    setOrgans((prevOrgans) =>
      prevOrgans.map((organ) =>
        organ.name.toLowerCase() === name.toLowerCase()
          ? { ...organ, status }
          : organ
      )
    );
  };

  const highlightOrgan = (name) => {
    setHighlighted(name);
    setTimeout(() => setHighlighted(""), 5000);
  };

  const refreshOrgans = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/availability");
      if (response.ok) {
        const backendOrgans = await response.json();
        setOrgans(
          backendOrgans
            .map((organ) => ({
              name: organ.organName,
              status: organ.status,
            }))
            .filter((organ) => allowedOrgans.includes(organ.name))
        );
      }
    } catch (error) {
      console.error("Error refreshing organs:", error);
    }
  };

  return (
    <OrganContext.Provider
      value={{ organs, addOrUpdateOrgan, highlighted, highlightOrgan, refreshOrgans }}
    >
      {children}
    </OrganContext.Provider>
  );
};
