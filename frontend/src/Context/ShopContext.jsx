import React, { createContext, useState, useEffect } from "react";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [products, setProducts] = useState([]);
  const [totalCartItems, setTotalCartItems] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:3001/products/`);
        const data = await response.json();
        setProducts(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const getDefaultCart = () => {
    let cart = {};
    for (const product of products) {
      cart[product.product_id] = 0;
    }
    return cart;
  };

  const [cartItems, setCartItems] = useState({});

  useEffect(() => {
    if (products.length > 0) {
      setCartItems(getDefaultCart());
    }
  }, [products]);

  const addToCart = async (itemId) => {
    await new Promise((resolve) => setTimeout(resolve, 0)); // Dummy async behavior
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
  };

  const removeFromCart = async (itemId) => {
    await new Promise((resolve) => setTimeout(resolve, 0)); // Dummy async behavior
    setCartItems((prev) => ({
      ...prev,
      [itemId]: Math.max(prev[itemId] - 1, 0), // Ensure no negative values
    }));
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
  };

  useEffect(() => {
    console.log("Cart Items:", cartItems);
  }, [cartItems]);

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
