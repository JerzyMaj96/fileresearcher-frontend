import { AppBar } from "@mui/material";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import App from "./components/App/App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
