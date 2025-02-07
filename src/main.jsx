import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import LayerProvider from "./context/LayerContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LayerProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </LayerProvider>
  </StrictMode>
);
