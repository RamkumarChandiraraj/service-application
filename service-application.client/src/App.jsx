import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Nabar";
import Footer from "./components/Footer/Footer";

// Public pages
import HeroSection from "./components/HeroSection/HeroSection";

// Category Management
import CategoryList from "./components/CategoryManagement/CategoryList";
import CreateCategorymanagement from "./components/CategoryManagement/CreateCategorymanagement";

// Service Management
import Home from "./components/ServicesManagement/Home";
import CreateServiceManagement from "./components/ServicesManagement/CreateServicesManagement";
import ReadServiceManagement from "./components/ServicesManagement/ReadServiceManagement";
import CreateCategorymanagement from "./components/CategoryManagement/CreateCategorymanagement";

// Location Management
import LocationHome from "./components/Location/LocationHome";
import CreateLocation from "./components/Location/CreateLocation";
import ReadLocation from "./components/Location/ReadLocation";

function App() {
    return (
        <>
            <Navbar />

            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HeroSection />} />

                {/* Category Management */}
                <Route path="/categorylist" element={<CategoryList />} />
                <Route
                    path="/createcategorymanagement"
                    element={<CreateCategorymanagement />}
                />

                {/* Service Management */}
                <Route path="/servicelist" element={<Home />} />

                <Route
                    path="/createservicemanagement"
                    element={<CreateServiceManagement />}
                />
                <Route
                    path="/createservicemanagement/:id"
                    element={<CreateServiceManagement />}
                />
                <Route
                    path="/readservice/:id"
                    element={<ReadServiceManagement />}
                />

                {/* Location Management */}
                <Route path="/locationlist" element={<LocationHome />} />
      <Routes>
              <Route path="/" element={<HeroSection />} />
              <Route path="/services/:category" element={<Services />} />
              <Route path="/Categorys/:Categorys" element={<Categorys />} />
              <Route path="/CategoryList" element={<CategoryList />} />
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
              <Route path="/CreateCategorymanagement/:id"
                  element={<CreateCategorymanagement />} />
              { /* READ */ }
              <Route
                  path="/readservice/:id"
                  element={<ReadServiceManagement />}
              />
              <Route
                  path="/ReadCategory/:id"
                  element={<ReadCategoryManagement />}
              />
              <Route path="/createservicemanagement/" element={<CreateServiceManagement />} />
              <Route path="/CreateCategorymanagement/" element={<CreateCategorymanagement />} />

                <Route
                    path="/createlocation"
                    element={<CreateLocation />}
                />
                <Route
                    path="/createlocation/:id"
                    element={<CreateLocation />}
                />
                <Route
                    path="/readlocation/:id"
                    element={<ReadLocation />}
                />
            </Routes>

            <Footer />
        
    );
}

export default App;