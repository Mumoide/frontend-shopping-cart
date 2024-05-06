import React, { useState, useEffect } from "react";
import Item from "../Components/Item/item";
import "./ShopCategory.css"; // Ensure CSS is correctly imported
import Footer from "../Components/Footer/Footer";

const ShopCategory = ({ category }) => {
  const [products, setProducts] = useState([]); // State to store the fetched products
  const categoryMap = {
    manual_tools: "Herramientas manuales",
    electric_tools: "Herramientas eléctricas",
    construction_material: "Materiales de construcción",
    security: "Seguridad",
    various_accesories: "Accesorios varios",
  };
  const categoryName = categoryMap[category];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/products/${categoryName}`
        );
        const data = await response.json();
        setProducts(
          data.map((product) => ({
            ...product,
            imagePath: `http://localhost:3001/${product.image_path}`,
          }))
        );
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [categoryName]);

  // useEffect(() => {
  //   console.log(products);
  // }, [products]);

  return (
    <div>
      <div className="ShopCategory">
        {products.map((item) => (
          <Item
            key={item.product_id}
            id={item.product_id}
            name={item.name}
            image={item.imagePath}
            new_price={item.price}
            old_price={item.old_price}
          />
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default ShopCategory;
