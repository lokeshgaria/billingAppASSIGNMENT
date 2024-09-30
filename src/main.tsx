// src/index.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App";
// Import your global styles if you have any

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
