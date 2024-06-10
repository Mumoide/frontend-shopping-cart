import React, { useState } from "react";
import "./Newsletter.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const validateEmail = (email) => {
    return email.match(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateEmail(email)) {
      try {
        const response = await fetch("http://localhost:3001/subscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (response.ok) {
          toast.success("Gracias por suscribirte!");
        } else {
          throw new Error(data.message || "Suscripción fallida");
        }
      } catch (error) {
        console.error("Login error:", error);
        Swal.fire({
          icon: "error",
          title: "Correo ya registrado.",
          text: error.message || "Error desconocido.",
        });
      }
      setEmail("");
    } else {
      toast.error("Favor de ingresar un correo valido.");
    }
  };

  return (
    <div className="newsletter">
      <h2>Suscríbete!</h2>
      <p>
        Ingresa tu correo para suscribirte y recibir un catalogo de descuentos
        en nuestros productos semanalmente.
      </p>
      <form onSubmit={handleSubmit} className="newsletter-form">
        <input
          type="email"
          placeholder="Ingresa tu correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Suscribirse</button>
      </form>
    </div>
  );
};

export default Newsletter;
