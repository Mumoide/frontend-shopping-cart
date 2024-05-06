import React, { useState } from "react";
import "./Newsletter.css";
import { toast } from "react-toastify";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const validateEmail = (email) => {
    return email.match(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateEmail(email)) {
      toast.success("Gracias por suscribirte!");
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
