import React from "react";
import "./Hero.css";
import herramientaselectricas from "../Assets/herramientaselectricas.jpg";
import herramientasmanuales from "../Assets/herramientasmanuales.jpg";
import seguridad from "../Assets/seguridad.jpg";
import varios from "../Assets/varios.jpg";
import materiales from "../Assets/materialesconstruccion.png";
import { Link } from "react-router-dom";
import { useActiveMenu } from "../../Context/ActiveMenuContext";

const Hero = () => {
  const { setActiveMenu } = useActiveMenu();
  return (
    <div className="Hero">
      <h1>Bienvenido a Ferramas!</h1>
      <div className="hero-images">
        <Link
          to="/manual_tools"
          onClick={() => setActiveMenu("manual_tools")}
          className="image-container"
        >
          <img src={herramientasmanuales} alt="Herramientas Manuales" />
          <div className="image-title">Herramientas Manuales</div>
        </Link>
        <Link
          to="/electric_tools"
          onClick={() => setActiveMenu("electric_tools")}
          className="image-container"
        >
          <img src={herramientaselectricas} alt="Herramientas Electricas" />
          <div className="image-title">Herramientas Eléctricas</div>
        </Link>
        <Link
          to="/construction_material"
          onClick={() => setActiveMenu("construction_material")}
          className="image-container"
        >
          <img src={materiales} alt="Materiales de Construcción" />
          <div className="image-title">Materiales de Construcción</div>
        </Link>
        <Link
          to="/security"
          onClick={() => setActiveMenu("security")}
          className="image-container"
        >
          <img
            src={seguridad}
            onClick={() => setActiveMenu("various_accesories")}
            alt="Seguridad"
          />
          <div className="image-title">Seguridad</div>
        </Link>
        <Link
          to="/various_accesories"
          onClick={() => setActiveMenu("various_accesories")}
          className="image-container"
        >
          <img src={varios} alt="Accesorios Varios" />
          <div className="image-title">Accesorios Varios</div>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
