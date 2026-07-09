import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Find the HTML element with id="root"
const rootElement = document.getElementById("root");

// Ensure the root exists (safety check)
if (rootElement) {
  // Create a React root and render the App component
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
} else {
  console.error("Root element not found!");
}
