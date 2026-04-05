import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ToastProvider } from "./context/ToastProvider.jsx";
import DataProvider from "./context/DataProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <DataProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </DataProvider>
  </StrictMode>,
);
