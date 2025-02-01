import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";

if (import.meta.env.MODE === "development") {
  axios.interceptors.request.use((request) => {
    console.log(
      `[API REQUEST] ${request.method.toUpperCase()} ${request.url}`,
      request
    );
    return request;
  });

  axios.interceptors.response.use(
    (response) => {
      console.log(`[API RESPONSE] ${response.config.url}`, response);
      return response;
    },
    (error) => {
      console.error(`[API ERROR] ${error.config?.url || "UNKNOWN URL"}`, error);
      return Promise.reject(error);
    }
  );
}

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  // </StrictMode>
);
