import React, { useContext } from "react";
import "./Navbar.css";
import logo from "../Assets/ferramas_logo.png";
import { Link } from "react-router-dom";
import { useActiveMenu } from "../../Context/ActiveMenuContext"; // Import the hook
import { ShopContext } from "../../Context/ShopContext";

export const Navbar = () => {
  const { activeMenu, setActiveMenu } = useActiveMenu();
  const { totalCartItems } = useContext(ShopContext);

  return (
    <div className="navbar">
      <div className="nav-logo">
        <img src={logo} alt="" />
        <p>FERRAMAS</p>
        <ul className="nav-menu">
          <li>
            {" "}
            <Link
              onClick={() => setActiveMenu("shop")}
              style={{ textDecoration: "none", color: "#626262" }}
              to="/"
            >
              Tienda
            </Link>
            {activeMenu === "shop" ? <hr /> : <></>}
          </li>
          <li>
            <Link
              style={{ textDecoration: "none", color: "#626262" }}
              to="/manual_tools"
              onClick={() => {
                setActiveMenu("manual_tools");
              }}
            >
              Herramientas manuales
            </Link>
            {activeMenu === "manual_tools" ? <hr /> : <></>}
          </li>
          <li>
            <Link
              style={{ textDecoration: "none", color: "#626262" }}
              to="/electric_tools"
              onClick={() => {
                setActiveMenu("electric_tools");
              }}
            >
              Herramientas electricas
            </Link>
            {activeMenu === "electric_tools" ? <hr /> : <></>}
          </li>
          <li>
            <Link
              style={{ textDecoration: "none", color: "#626262" }}
              to="/construction_material"
              onClick={() => {
                setActiveMenu("construction_material");
              }}
            >
              Materiales de construccion
            </Link>
            {activeMenu === "construction_material" ? <hr /> : <></>}
          </li>
          <li>
            <Link
              style={{ textDecoration: "none", color: "#626262" }}
              to="/security"
              onClick={() => {
                setActiveMenu("security");
              }}
            >
              Seguridad
            </Link>
            {activeMenu === "security" ? <hr /> : <></>}
          </li>
          <li>
            <Link
              style={{ textDecoration: "none", color: "#626262" }}
              to="/various_accesories"
              onClick={() => {
                setActiveMenu("various_accesories");
              }}
            >
              Accesorios varios
            </Link>
            {activeMenu === "various_accesories" ? <hr /> : <></>}
          </li>
        </ul>
        <div className="nav-login-cart">
          <Link
            onClick={() => {
              setActiveMenu("");
            }}
            to="/login"
          >
            <button>Iniciar sesión</button>
          </Link>
          <Link style={{ textDecoration: "none", color: "#626262" }} to="/cart">
            <i className="fa-solid fa-cart-shopping"></i>
          </Link>
          <div className="nav-cart-count">{totalCartItems}</div>
        </div>
      </div>
    </div>
  );
};
