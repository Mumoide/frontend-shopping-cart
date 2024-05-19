import React, { useContext } from "react";
import CartItems from "../Components/CartItems/CartItems";
import Footer from "../Components/Footer/Footer";
import { UserContext } from "../Context/UserContext";

const Cart = () => {
  const { userId } = useContext(UserContext);
  return (
    <div>
      <CartItems />
      <Footer />
    </div>
  );
};

export default Cart;
