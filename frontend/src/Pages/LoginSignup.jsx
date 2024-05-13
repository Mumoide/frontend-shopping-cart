import React, { useState, useEffect, useContext } from "react";
import "./LoginSignup.css";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { UserContext } from "../Context/UserContext";

const LoginSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Hook for navigation
  const { setUser } = useContext(UserContext);
  useEffect(() => {
    // Check if the user is already logged in
    const token = localStorage.getItem("jwtToken");
    if (token) {
      navigate("/"); // Redirect to the home page or dashboard
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        // Store the token in localStorage
        if (data.data.token) {
          localStorage.setItem("jwtToken", data.data.token);
          localStorage.setItem("firstName", data.data.user.firstName);
          localStorage.setItem("lastName", data.data.user.lastName);
          setUser(data.data.user.firstName + " " + data.data.user.lastName);
        } else {
          console.log("Failed to receive token:", data.message);
        }

        Swal.fire({
          icon: "success",
          title: "Login exitoso",
          text: "Haz ingresado correctamente.",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/"); // Redirect to the home page or dashboard
          }
        });
      } else {
        throw new Error(data.message || "Autenticacion fallida");
      }
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message || "An error occurred during login.",
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>Iniciar Sesión</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Iniciar Sesión
          </button>
          <div className="login-links">
            <Link to="/forgot-password" className="login-link">
              <i className="fa-solid fa-user" /> Olvidó su contraseña?
            </Link>
            <Link to="/signup" className="login-link">
              <i className="fa-solid fa-check" /> Registrarse
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginSignup;
