import React from "react";
import all_products from "../Components/Assets/all_products";
import Item from "../Components/Item/item";

const Product = () => {
  return (
    <div>
      {all_products.map((item, i) => {
        return (
          <Item
            key={i}
            id={item.id}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        );
      })}
    </div>
  );
};

export default Product;
