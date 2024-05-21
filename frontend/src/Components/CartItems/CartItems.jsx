import React, { useContext, useState, useEffect } from "react";
import "./CartItems.css";
import { ShopContext } from "../../Context/ShopContext";
import "@fortawesome/fontawesome-free/css/all.min.css";

const CartItems = () => {
  const { products, cartItems, removeFromCart, cartId } =
    useContext(ShopContext);
  const [productsEdited, setProductsEdited] = useState([]);
  const [isUserLogged, setIsUserLogged] = useState(false);
  const storedUserId = localStorage.getItem("userId");

  useEffect(() => {
    if (storedUserId) {
      setIsUserLogged(true);
    } else {
      setIsUserLogged(false);
    }
  });

  useEffect(() => {
    const processProducts = async () => {
      try {
        const updatedProducts = products.map((product) => ({
          ...product,
          imagePath: `http://localhost:3001/${product.image_path}`,
        }));
        setProductsEdited(updatedProducts);
      } catch (error) {
        console.error("Error editing products:", error);
      }
    };

    processProducts();
  }, [products]);

  const calculateSubtotal = () => {
    return productsEdited.reduce(
      (total, product) =>
        total + product.price * (cartItems[product.product_id] || 0),
      0
    );
  };

  const subtotal = calculateSubtotal();
  const total = subtotal;

  const handlePayment = async () => {
    const token = localStorage.getItem("jwtToken"); // Retrieve token from local storage
    console.log("Token:", token);

    try {
      const response = await fetch("http://localhost:3001/create_transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: total,
          isUserLogged: isUserLogged,
          cartId: cartId,
        }), // Assuming `total` is defined
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Redirecting to:", data.url);
        window.location.href = `${data.url}?token_ws=${data.token}`;
      } else {
        console.error("Error initiating transaction:", data);
      }
    } catch (error) {
      console.error("Error initiating transaction:", error);
    }
  };

  return (
    <div className="cartitems">
      <div className="cartitems-header">
        <h2>Carrito de Compras</h2>
      </div>
      <div className="cartitems-format-main">
        <p>Productos</p>
        <p>Título</p>
        <p>Precio</p>
        <p>Cantidad</p>
        <p>Total</p>
        <p>Eliminar</p>
      </div>
      <hr />
      {productsEdited.map((product) => {
        if (cartItems[product.product_id] > 0) {
          return (
            <div key={product.product_id}>
              <div className="cartitems-format">
                <img
                  src={product.imagePath}
                  alt={product.name}
                  className="carticon-product-icon"
                />
                <p>{product.name}</p>
                <p>{`$${product.price}`}</p>
                <button className="cartitems-quantity">
                  {cartItems[product.product_id]}
                </button>
                <p>{`$${product.price * cartItems[product.product_id]}`}</p>
                <i
                  className="fa-solid fa-trash cartitems-remove-icons"
                  onClick={() => removeFromCart(product.product_id)}
                />
              </div>
              <hr />
            </div>
          );
        }
        return null;
      })}
      <div className="cartitems-down">
        <div className="cartitems-total">
          <h2>Resumen</h2>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>{`$${subtotal.toFixed(2)}`}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Costo de envío</p>
              <p>Gratis</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>{`$${total.toFixed(2)}`}</h3>
            </div>
          </div>
          <button className="btn-transfer">Pagar con transferencia</button>
          <button className="btn-card" onClick={handlePayment}>
            Pagar con tarjeta
          </button>
        </div>
        <div className="cartitems-login">
          <p>¡Inicia sesión para obtener descuentos!</p>
          <button>Iniciar sesión</button>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
