import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const PaymentConfirmation = () => {
  const location = useLocation();
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token_ws");
    console.log("Token from params:", token);

    const confirmPayment = async () => {
      try {
        const response = await fetch(
          "https://shopping-cart-3rvp.onrender.com/commit_transaction",
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

    if (token) {
      confirmPayment();
    }
  }, [location]);

  if (!status) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Payment Confirmation</h1>
      <p>{status.status}</p>
      <p>{status.message}</p>
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
