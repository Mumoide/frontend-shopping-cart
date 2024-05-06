import React, { useContext } from "react";
import "./items.css";
import { ShopContext } from "../../Context/ShopContext";

const Item = ({ id, name, image, new_price, old_price }) => {
  const { addToCart } = useContext(ShopContext);

  return (
    <div className="item">
      <img src={image} alt={name} />
      <p>{name}</p>
      <div className="item-prices">
        <span className="item-price-new">{`$${new_price}`}</span>
        <span className="item-price-old">{`$${old_price}`}</span>
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
