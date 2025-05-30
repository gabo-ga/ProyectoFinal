import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./AuthContext.jsx";
import App from "./App.jsx";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
