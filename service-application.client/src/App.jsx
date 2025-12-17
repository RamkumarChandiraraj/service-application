import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Nabar";
import HeroSection from "./components/HeroSection/HeroSection";
import Services from "./components/Services/Services";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/services/:category" element={<Services />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
