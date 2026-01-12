import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

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

// Glightbox
import "glightbox/dist/css/glightbox.min.css";

// Initialize AOS
AOS.init({
  duration: 800,
  easing: "ease-in-out",
  once: true,
});

createRoot(document.getElementById("root")).render(
  //<StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  //</StrictMode>
);
