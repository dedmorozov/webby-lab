import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { AppProviders } from "./app/providers";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
);
