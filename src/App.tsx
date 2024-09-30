import React from "react";
import { Provider } from "react-redux";
import store from "./app/store";
 
import ProductList from "./components/ProductList"
import BillingList from "./components/BillingList"
import "./index.css"; // Import your CSS styles



 
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="app">
      
        <div className="container mt-10 w mx-auto flex flex-col md:flex-row   justify-evenly">
          <div className="product-list-container   w-full">
            <ProductList />
          </div>
          <div className="billing-container   w-full">
            <BillingList />
          </div>
        </div>
      </div>
    </Provider>
  );
};

export default App;
