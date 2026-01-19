import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

import AuthProvider from "./Auth/AuthProvider.jsx";

// Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Bootstrap Icons
import "bootstrap-icons/font/bootstrap-icons.css";

// AOS
import AOS from "aos";
import "aos/dist/aos.css";

// Swiper
import "swiper/css";
import "swiper/css/bundle";

//OSM
import "leaflet/dist/leaflet.css";

// Glightbox
import "glightbox/dist/css/glightbox.min.css";

// Initialize AOS
AOS.init({ duration: 800, easing: "ease-in-out", once: true });



/* 🔔 Register Firebase Service Worker */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((reg) => {
      console.log("✅ Firebase SW registered:", reg);
    })
    .catch((err) => {
      console.error("❌ Firebase SW registration failed:", err);
    });
}


createRoot(document.getElementById("root")).render(
  //<StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  //</StrictMode>
);
