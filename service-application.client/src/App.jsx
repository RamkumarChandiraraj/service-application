import { Routes, Route } from "react-router-dom"; 
//Layouts 
import MainLayout from "./components/MainLayout/MainLayout"; 
import Navbar from "./components/MainLayout/Navbar/Navbar"; 
import Footer from "./components/MainLayout/Footer/Footer"; 
import ScrollToHash from "./components/Common/ScrollToHash"; 
import ScrollToTop from "./components/Common/ScrollToTop"; // ✅ ADD THIS
import CategoriesPage from "./components/Pages/Category"; 
import Service from "./components/Pages/Service"; 
// Category Management 
import CategoryList from "./components/CategoryManagement/CategoryList"; 
import CreateCategoryManagement from "./components/CategoryManagement/CreateCategorymanagement"; 
import ReadCategoryManagement from "./components/CategoryManagement/ReadCategoryManagement"; 
// Service Management 
import Home from "./components/ServicesManagement/Home"; 
import CreateServiceManagement from "./components/ServicesManagement/CreateServicesManagement"; 
import ReadServiceManagement from "./components/ServicesManagement/ReadServiceManagement"; 
// Location Management 
import LocationHome from "./components/Location/LocationHome"; 
import CreateLocation from "./components/Location/CreateLocation"; 
import ReadLocation from "./components/Location/ReadLocation"; 
import SignUp from "./components/Signup/SignUp";
import ScrollToTopButton from "./components/Common/ScrollToTopButton";

function App() {
  return (
    <>
      <Navbar />
      
      {/* Global scroll handlers */}
      <ScrollToTop />     {/* ✅ for route change */}
      <ScrollToHash />    {/* ✅ for #hash navigation */}
      <ScrollToTopButton />
      <Routes>
        <Route path="/signup" element={<SignUp />} />

        {/* Main Layout */}
        <Route path="/" element={<MainLayout />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/service/:category" element={<Service />} />
        {/* <Route path="/service/:category/:service" element={<ServiceDetail />} /> */}


        {/* Category Management */}
        <Route path="/categorylist" element={<CategoryList />} />
        <Route path="/createcategorymanagement" element={<CreateCategoryManagement />} />
        <Route path="/createcategorymanagement/:id" element={<CreateCategoryManagement />} />
        <Route path="/readcategory/:id" element={<ReadCategoryManagement />} />

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
