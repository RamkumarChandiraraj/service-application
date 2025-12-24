import { Routes, Route } from "react-router-dom";

// Layouts
import MainLayout from "./components/MainLayout/MainLayout";
import Navbar from "./components/MainLayout/Navbar/Navbar";
import Footer from "./components/MainLayout/Footer/Footer";


// Category Management
import CategoryList from "./components/CategoryManagement/CategoryList";
import CreateCategoryManagement from "./components/CategoryManagement/CreateCategorymanagement";

// Service Management
import Home from "./components/ServicesManagement/Home";
import CreateServiceManagement from "./components/ServicesManagement/CreateServicesManagement";
import ReadServiceManagement from "./components/ServicesManagement/ReadServiceManagement";

// Location Management
import LocationHome from "./components/Location/LocationHome";
import CreateLocation from "./components/Location/CreateLocation";
import ReadLocation from "./components/Location/ReadLocation";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<MainLayout />} />

        {/* Category Management */}
        <Route path="/categorylist" element={<CategoryList />} />
        <Route path="/createcategorymanagement" element={<CreateCategoryManagement />} />

        {/* Service Management */}
        <Route path="/servicelist" element={<Home />} />
        <Route path="/createservicemanagement" element={<CreateServiceManagement />} />
        <Route path="/createservicemanagement/:id" element={<CreateServiceManagement />} />
        <Route path="/readservice/:id" element={<ReadServiceManagement />} />

        {/* Location Management */}
        <Route path="/locationlist" element={<LocationHome />} />
        <Route path="/createlocation" element={<CreateLocation />} />
        <Route path="/createlocation/:id" element={<CreateLocation />} />
        <Route path="/readlocation/:id" element={<ReadLocation />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
