import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Nabar";
import HeroSection from "./components/HeroSection/HeroSection";
import Services from "./components/Services/Services";
import Footer from "./components/Footer/Footer";
import Home from "./components/ServicesManagement/Home";
import CreateServiceManagement from "./components/ServicesManagement/CreateServicesManagement";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/services/:category" element={<Services />} />
              <Route path="/servicelist/" element={<Home />} />
              <Route path="/createservicemanagement/" element={<CreateServiceManagement />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
