import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const PaymentConfirmation = () => {
  const location = useLocation();
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token_ws");
    const tbkToken = params.get("TBK_TOKEN");
    const tbkOrdenCompra = params.get("TBK_ORDEN_COMPRA");
    const tbkIdSesion = params.get("TBK_ID_SESION");

    console.log("Params received:", {
      token,
      tbkToken,
      tbkOrdenCompra,
      tbkIdSesion,
    });

    const confirmPayment = async () => {
      try {
        const response = await fetch(
          "https://shopping-cart-3rvp.onrender.com/commit_transaction",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              token_ws: token,
              TBK_TOKEN: tbkToken,
              TBK_ORDEN_COMPRA: tbkOrdenCompra,
              TBK_ID_SESION: tbkIdSesion,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Error confirming payment");
        }

        const data = await response.json();
        setStatus(data);
      } catch (error) {
        setError(error.message);
      }
    };

    if (token || tbkToken || tbkOrdenCompra || tbkIdSesion) {
      confirmPayment();
    }
  }, [location]);

  if (error) {
    return (
      <div>
        <h1>Payment Confirmation</h1>
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!status) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Payment Confirmation</h1>
      <p>Status: {status.step}</p>
      <p>Description: {status.stepDescription}</p>
      {status.viewData && (
        <>
          <p>Order ID: {status.viewData.token}</p>
          {status.viewData.commitResponse && (
            <div>
              <p>Commit Status: {status.viewData.commitResponse.status}</p>
              <p>Transaction Amount: {status.viewData.commitResponse.amount}</p>
              <p>Buy Order: {status.viewData.commitResponse.buy_order}</p>
              <p>Session ID: {status.viewData.commitResponse.session_id}</p>
              <p>
                Card Number:{" "}
                {status.viewData.commitResponse.card_detail.card_number}
              </p>
              <p>
                Authorization Code:{" "}
                {status.viewData.commitResponse.authorization_code}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PaymentConfirmation;
