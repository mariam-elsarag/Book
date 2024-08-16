import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { PrimeReactProvider } from "primereact/api";

import Store from "../Store.js";
import App from "./App.jsx";

import "primereact/resources/themes/tailwind-light/theme.css";
import "./assets/Styles/global/style.scss";
import { Provider } from "react-redux";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PrimeReactProvider>
      <BrowserRouter>
        <Provider store={Store}>
          <App />
        </Provider>
      </BrowserRouter>
    </PrimeReactProvider>
  </React.StrictMode>
);
