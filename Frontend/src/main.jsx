import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { PrimeReactProvider } from "primereact/api";

import App from "./App.jsx";

import "primereact/resources/themes/tailwind-light/theme.css";
import "./assets/Styles/global/style.scss";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PrimeReactProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PrimeReactProvider>
  </React.StrictMode>
);
