import React, {  useEffect } from "react";
import Loader from "./Loader";
import { useDispatch, useSelector } from "react-redux";
import { RootState,AppDispatch } from "../app/store";
import {
  addItemToCart,
  removeItem,
  fetchCartItems,
} from "../features/cartSlice";

interface CartItem {
  product: string;
  id: number;
  price: number;
  quantity: number;
  discount?: number;
}
const BillingList: React.FC = () => {
  const dispatch :AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const loading = useSelector((state: RootState) => state.cart.loading);
  
  const incrementQuantity = (item: CartItem) => {
    dispatch(addItemToCart(item.product));
  };

  const decrementQuantity = (item: CartItem) => {
    dispatch(removeItem(item.id));
  };

  const calculateSubtotal = () => {
    return itemsWithDiscounts.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const calculateSavings = () => {
    return itemsWithDiscounts.reduce(
      (discount, item) => discount + item.discount,
      0
    ); // Example: 10% discount
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateSavings();
  };

  const calculateDiscounts = (cartItems: CartItem[]) => {
    return cartItems.map((item) => {
      let discount: number = 0.0;

      if (item.product === "Cheese") {
        discount = item.price * Math.floor(item.quantity / 2);
      } else if (item.product === "Butter") {
        discount = Number(((item.price / 3) * item.quantity).toFixed(2));
      } else if (
        item.product === "Bread" &&
        cartItems.some((cartItem) => cartItem.product === "Soup")
      ) {
        discount = item.price / 2;
      }

      return {
        ...item,
        discount,
      };
    });
  };

  const itemsWithDiscounts = calculateDiscounts(cartItems);

 
  return (
    <div className="mt-10 md:mt-0 md:h-screen   w-full">
      <h1 className="text-2xl font-bold mb-6 text-center">Billing Summary</h1>
      {loading && <div className="w-full h-full flex items-center justify-center">
         <Loader />
      </div>}

      <div className="max-w-md mx-auto  border p-6 bg-white rounded-lg shadow-md w-full  ">
        <ul className="space-y-4   w-full">
          {itemsWithDiscounts.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center p-4  border-b rounded-lg"
            >
              <div className="flex flex-col   w-full">
                <div className="  w-full flex flex-row items-center justify-between">
                  <h2 className="text-lg font-semibold">{item.product}</h2>
                  <p className="text-gray-600">£ {item.price}</p>
                  <div className="flex items-center    ">
                    <button
                      onClick={() => decrementQuantity(item)}
                      className="px-2 py-1 bg-sky-300 text-white rounded-lg hover:bg-sky-400 transition duration-200"
                    >
                      -
                    </button>
                    <span className="mx-4">{item.quantity}</span>
                    <button
                      onClick={() => incrementQuantity(item)}
                      className="px-2 py-1 bg-sky-300 text-white rounded-lg hover:bg-sky-400 transition duration-200"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="  flex flex-col items-end">
                  <p className="mt-2">
                    Item Price &nbsp; £ {item.price} × {item.quantity} = £{" "}
                    {(item.price * item.quantity).toFixed(2)}
                  </p>
                  {item.discount > 0 && (
                    <p className="text-red-500">
                      Savings = £ {item.discount.toFixed(2)}{" "}
                      {/* Example: 10% savings */}
                    </p>
                  )}

                  <p>
                    cost = £{" "}
                    {(item.price * item.quantity - item.discount).toFixed(2)}
                  </p>
                </div>
              </div>
            </li>
          ))}

          {itemsWithDiscounts.length ==0 && <p className="text-gray-700 text-2xl">Your cart is currently empty!</p>}
        </ul>

        {/* Summary Table */}
        <div className="mt-6   pt-4">
          <div className="flex justify-between">
            <span className="font-semibold">Subtotal:</span>
            <span>£ {calculateSubtotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Savings:</span>
            <span>£ {calculateSavings().toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total Amount:</span>
            <span>£ {calculateTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingList;
