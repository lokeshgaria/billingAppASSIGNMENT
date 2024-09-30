import React from "react";
import { addItemToCart } from "../features/cartSlice";

import { productsAndPrices } from "../data/data";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
interface Product {
  id: number;
  product: string;
  price: string;
}

const ProductList: React.FC = () => {
  const dispatch = useDispatch();
  const handleAdd = (product: Product) => {
    

    dispatch(addItemToCart(product.product));
  };
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const checkDisable = (id: number) => {
    const product = cartItems.find((item) => item.id === id);
    if (product) {
      return true;
    } else {
      return false;
    }
  };

  console.log("cartItems", cartItems);
  return (
    <div className="  w-full md:w-[50%]">
      <h1 className="text-2xl font-bold mb-6 text-center">Product List</h1>
      <div className="max-w-md border mx-auto  p-6 bg-white rounded-lg shadow-md">
        <ul className="space-y-4">
          {productsAndPrices.map((product) => (
            <li
              key={product.id}
              className="flex justify-between items-center p-4 bg-gray-100 rounded-lg"
            >
              <div>
                <h2 className="text-lg font-semibold">{product.product}</h2>
                <p className="text-gray-600">£ {product.price}</p>
              </div>
              <button
                disabled={checkDisable(product.id)}
                onClick={() => handleAdd(product)}
                className={`px-4 py-2 ${
                  checkDisable(product.id)
                    ? "bg-gray-500 hover:bg-gray-500"
                    : "bg-blue-500 hover:bg-blue-600"
                }   text-white rounded-lg  transition duration-200`}
              >
                Add
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductList;
