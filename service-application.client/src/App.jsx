import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Nabar";
import HeroSection from "./components/HeroSection/HeroSection";
import Categorys from "./components/Categorys/Categorys";
import Services from "./components/Services/Services";
import Footer from "./components/Footer/Footer";
import CategoryList from "./components/CategoryManagement/CategoryList"; 
import Home from "./components/ServicesManagement/Home";
import CreateServiceManagement from "./components/ServicesManagement/CreateServicesManagement";
import ReadServiceManagement from "./components/ServicesManagement/ReadServiceManagement";
import CreateCategorymanagement from "./components/CategoryManagement/CreateCategorymanagement";


function App() {
  return (
    <>
      <Navbar />

      <Routes>
              <Route path="/" element={<HeroSection />} />
              <Route path="/services/:category" element={<Services />} />
              <Route path="/Categorys/:Categorys" element={<Categorys />} />
              <Route path="/categorylist" element={<CategoryList />} />
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
              <Route path="/createservicemanagement/" element={<CreateServiceManagement />} />
              <Route path="/CreateCategorymanagement/" element={<CreateCategorymanagement />} />

      </Routes>

      <Footer />
    </>
  );
}

export default App;
