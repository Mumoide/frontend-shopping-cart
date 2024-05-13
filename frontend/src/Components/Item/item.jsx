import React, { useContext, useEffect, useState } from "react";
import "./items.css";
import { ShopContext } from "../../Context/ShopContext";

const Item = ({ id, name, image, new_price, old_price }) => {
  const { addToCart } = useContext(ShopContext);
  const [dollarListPrice, setDollarListPrice] = useState([]);
  const [dollarPrice, setDollarPrice] = useState(null);
  const apiKey = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    const fetchUSPrice = async () => {
      try {
        const response = await fetch(
          `https://api.cmfchile.cl/api-sbifv3/recursos_api/dolar/2024?apikey=${apiKey}&formato=json`
        );
        const data = await response.json();
        setDollarListPrice(data);
      } catch (error) {
        console.error("Error fetching dollar price:", error);
      }
    };

    fetchUSPrice();
  }, []);

  useEffect(() => {
    if (dollarListPrice.Dolares && dollarListPrice.Dolares.length > 0) {
      const ultimoValor =
        dollarListPrice.Dolares[dollarListPrice.Dolares.length - 1];
      setDollarPrice(parseFloat(ultimoValor.Valor.replace(",", "."))); // Ensure it's a number and handle comma as decimal
    }
  }, [dollarListPrice]);

  useEffect(() => {
    console.log(dollarPrice);
  }, [dollarPrice]);

  const convertedPrice = dollarPrice
    ? (new_price / dollarPrice).toFixed(2)
    : "Cargando...";

  return (
    <div className="item">
      <img src={image} alt={name} />
      <p>{name}</p>
      <div className="item-prices">
        <span className="item-price-new">{`$${new_price}`}</span>
        <span className="item-price-old">{`$${old_price}`}</span>
      </div>
      <div className="item-prices">
        <span className="item-price-new">{`USD Price: $${convertedPrice}`}</span>
      </div>
      <div className="item-add">
        <button
          onClick={() => {
            addToCart(id);
          }}
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
};

export default Item;
