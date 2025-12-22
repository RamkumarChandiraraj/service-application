import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Nabar";
import HeroSection from "./components/HeroSection/HeroSection";
import Services from "./components/Services/Services";
import Footer from "./components/Footer/Footer";
import Home from "./components/ServicesManagement/Home";
import CreateServiceManagement from "./components/ServicesManagement/CreateServicesManagement";
import ReadServiceManagement from "./components/ServicesManagement/ReadServiceManagement";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/services/:category" element={<Services />} />
              <Route path="/servicelist/" element={<Home />} />
              {/* CREATE */}
              <Route
                  path="/createservicemanagement"
                  element={<CreateServiceManagement />}
              />
              {/* EDIT */}
              <Route
                  path="/createservicemanagement/:id"
                  element={<CreateServiceManagement />}
              />
              <Route
                  path="/readservice/:id"
                  element={<ReadServiceManagement />}
              />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
