import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app.jsx";

import "../css/app.css";
import "../css/auth.css";
import "../css/dashboard.css";

ReactDOM.createRoot(document.getElementById("app")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
