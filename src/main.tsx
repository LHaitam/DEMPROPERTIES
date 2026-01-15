import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "leaflet/dist/leaflet.css";

import "@fontsource/oswald";
import "@fontsource/playfair-display";

import "@/styles/index.css";
import "@/i18n/i18n"; 
import App from "@/App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
