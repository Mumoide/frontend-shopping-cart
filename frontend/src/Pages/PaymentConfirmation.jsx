import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "./PaymentConfirmation.css"; // Import the CSS file for styling

const PaymentConfirmation = () => {
  const location = useLocation();
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token_ws");
    console.log("Token from params:", token);
    const TBK_TOKEN = params.get("TBK_TOKEN");
    console.log("TBK_TOKEN from params:", TBK_TOKEN);

    const confirmPayment = async () => {
      console.log("confirmando pago");
      try {
        const response = await fetch(
          "http://localhost:3001/commit_transaction",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token_ws: token }),
          }
        );

        const data = await response.json();
        setStatus(data);
      } catch (error) {
        console.error("Error confirming payment:", error);
      }
    };

    const cancelPayment = async () => {
      console.log("cancelando pago");
      try {
        const response = await fetch(
          "http://localhost:3001/commit_transaction",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ TBK_TOKEN: TBK_TOKEN }),
          }
        );

        const data = await response.json();
        setStatus(data);
      } catch (error) {
        console.error("Error confirming payment:", error);
      }
    };

    if (token && !TBK_TOKEN) {
      confirmPayment();
    } else if (!token && TBK_TOKEN) {
      cancelPayment();
    }
  }, [location]);

  if (!status) {
    return <div className="payment-confirmation-loading">Cargando...</div>;
  }

  if (status.viewData) {
    localStorage.removeItem("cartItems");
  }

  const getStatusClass = (status) => {
    if (status === "AUTHORIZED") return "status-authorized";
    if (status === "FAILED") return "status-failed";
    return "";
  };

  const getStatusIcon = (status) => {
    if (status === "AUTHORIZED") return <i className="fa fa-check-circle"></i>;
    if (status === "FAILED") return <i className="fa fa-times-circle"></i>;
    return null;
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(amount);
  };

  const commitResponse = status.viewData?.commitResponse;

  return (
    <div className="payment-confirmation-container">
      {commitResponse && (
        <div
          className={`payment-confirmation-title ${getStatusClass(
            commitResponse.status
          )}`}
        >
          {getStatusIcon(commitResponse.status)}
          Estado del Compromiso: {commitResponse.status}
        </div>
      )}
      {commitResponse?.status === "FAILED" && (
        <p className="payment-confirmation-retry">
          No se realizaron cargos en su tarjeta,{" "}
          <Link to="/cart">por favor intente nuevamente</Link>.
        </p>
      )}
      {commitResponse?.status === "AUTHORIZED" && (
        <div className="payment-confirmation-body">
          <div className="payment-confirmation-left">
            <p className="payment-confirmation-message">
              ¡Gracias por tu compra!
            </p>
            <p className="payment-confirmation-amount">
              Monto:{" "}
              {commitResponse.amount
                ? formatAmount(commitResponse.amount)
                : "N/A"}
            </p>
          </div>
          <div className="payment-confirmation-right">
            <h3 className="purchase-details-title">Detalles de la compra</h3>
            <div className="payment-confirmation-details">
              <p>
                <span>Estado del Compromiso:</span>
                <span className="payment-confirmation-details-value">
                  {commitResponse.status}
                </span>
              </p>
              <p>
                <span>Orden de Compra:</span>
                <span className="payment-confirmation-details-value">
                  {commitResponse.buy_order}
                </span>
              </p>
              <p>
                <span>ID de Sesión:</span>
                <span className="payment-confirmation-details-value">
                  {commitResponse.session_id}
                </span>
              </p>
              <p>
                <span>Número de Tarjeta:</span>
                <span className="payment-confirmation-details-value">
                  {commitResponse.card_detail.card_number}
                </span>
              </p>
              <p>
                <span>Código de Autorización:</span>
                <span className="payment-confirmation-details-value">
                  {commitResponse.authorization_code}
                </span>
              </p>
              <button className="payment-confirmation-button">
                Ir al detalle de la compra
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentConfirmation;
