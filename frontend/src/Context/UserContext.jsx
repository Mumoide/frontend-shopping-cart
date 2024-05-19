import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const firstName = localStorage.getItem("firstName");
    const lastName = localStorage.getItem("lastName");
    const storedUserId = localStorage.getItem("userId");
    if (token && firstName && lastName && storedUserId) {
      setUser(firstName + " " + lastName);
      setUserId(storedUserId);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    localStorage.removeItem("userId");
    setUser(null);
    setUserId(null);
    navigate("/login");
    window.location.reload();
  };

  return (
    <UserContext.Provider value={{ user, userId, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};
