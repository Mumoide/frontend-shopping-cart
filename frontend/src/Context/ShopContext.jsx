import React, { createContext, useState, useEffect } from "react";
import Spinner from "../Components/Spinner/Spinner";
export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [products, setProducts] = useState([]);
  const [totalCartItems, setTotalCartItems] = useState(0);
  const [cart, setCart] = useState(null);
  const [cartItems, setCartItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [cartId, setCartId] = useState(null);

  // Get local storage variables
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const firstName = localStorage.getItem("firstName");
    const lastName = localStorage.getItem("lastName");
    const storedUserId = localStorage.getItem("userId");
    if (token && firstName && lastName && storedUserId) {
      setUser(firstName + " " + lastName);
      setUserId(storedUserId);
    }
    setLoading(false);
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:3001/products/`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Get possible products for the cart
  const getDefaultCart = () => {
    let cart = {};
    for (const product of products) {
      cart[product.product_id] = 0;
    }
    return cart;
  };

  // Fetch cart
  useEffect(() => {
    const fetchCart = async () => {
      if (userId) {
        try {
          const response = await fetch(`http://localhost:3001/carts/${userId}`);
          if (response.ok) {
            const data = await response.json();
            setCart(data);
            setCartId(data.cart_id);
            const cartItemsResponse = await fetch(
              `http://localhost:3001/cart_items/${data.cart_id}`
            );
            if (cartItemsResponse.ok) {
              const cartItemsData = await cartItemsResponse.json();
              console.log(cartItemsData);
              const cartItemsMap = {};
              cartItemsData.forEach((item) => {
                cartItemsMap[item.product_id] = item.quantity;
              });
              setCartItems(cartItemsMap);
            } else {
              setCartItems(getDefaultCart());
            }
          } else {
            setCartItems(getDefaultCart());
          }
        } catch (error) {
          console.error("Error fetching cart:", error);
          setCartItems(getDefaultCart());
        }
      } else {
        const localCart =
          JSON.parse(localStorage.getItem("cartItems")) || getDefaultCart();
        setCartItems(localCart);
      }
    };

    fetchCart();
  }, [userId]);

  // Add items to cart, create cart if it doesnt exist
  const addToCart = async (productId) => {
    if (!userId) {
      // Handle local storage cart
      const localCart =
        JSON.parse(localStorage.getItem("cartItems")) || getDefaultCart();
      const newQuantity = (localCart[productId] || 0) + 1;
      const updatedCart = { ...localCart, [productId]: newQuantity };
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      setCartItems(updatedCart);
      return;
    }

    // Function to create a cart and return the cart ID
    const createCart = async () => {
      try {
        const response = await fetch("http://localhost:3001/carts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });
        const data = await response.json();
        setCart(data);
        setCartId(data.cart_id);
        return data.cart_id;
      } catch (error) {
        console.error("Error creating cart:", error);
        throw error;
      }
    };

    // Ensure cart ID is set
    const ensureCartId = async () => {
      if (cartId) {
        return cartId;
      } else if (cart) {
        setCartId(cart.cart_id);
        return cart.cart_id;
      } else {
        return await createCart();
      }
    };

    try {
      const currentCartId = await ensureCartId();
      const newQuantity = (cartItems[productId] || 0) + 1;
      setCartItems((prev) => ({ ...prev, [productId]: newQuantity }));

      await fetch("http://localhost:3001/cart_items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartId: currentCartId,
          productId,
          quantity: newQuantity,
        }),
      });
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const removeFromCart = async (productId) => {
    if (!userId) {
      // Handle local storage cart removal
      const localCart =
        JSON.parse(localStorage.getItem("cartItems")) || getDefaultCart();
      const newQuantity = (localCart[productId] || 0) - 1;
      if (newQuantity <= 0) {
        const { [productId]: _, ...rest } = localCart;
        localStorage.setItem("cartItems", JSON.stringify(rest));
        setCartItems(rest);
      } else {
        const updatedCart = { ...localCart, [productId]: newQuantity };
        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
        setCartItems(updatedCart);
      }
      return;
    }

    if (!cart) return;

    const newQuantity = (cartItems[productId] || 0) - 1;
    if (newQuantity <= 0) {
      setCartItems((prev) => {
        const { [productId]: _, ...rest } = prev;
        return rest;
      });
    } else {
      setCartItems((prev) => ({ ...prev, [productId]: newQuantity }));
    }

    try {
      await fetch("http://localhost:3001/cart_items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartId: cart.cart_id,
          productId,
          quantity: newQuantity,
        }),
      });
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  useEffect(() => {
    const calculateTotalCartItems = () => {
      let totalItem = 0;
      for (const item in cartItems) {
        totalItem += cartItems[item];
      }
      setTotalCartItems(totalItem);
    };

    calculateTotalCartItems();
  }, [cartItems]);

  const contextValue = {
    products,
    cartItems,
    addToCart,
    removeFromCart,
    totalCartItems,
    cartId,
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
