import { Routes, Route } from "react-router-dom";

import Navbar from "./components/MainLayout/Navbar/Navbar";
import Footer from "./components/MainLayout/Footer/Footer";
import MainLayout from "./components/MainLayout/MainLayout";
import CategoriesPage from "./components/Pages/Category";
import Service from "./components/Pages/Service";
import SearchVendors from "./components/Pages/SearchVendorsPage";
import ForgotPasswordModal from "./components/ForgotPasswordManagement/ForgotPasswordModal";
import VerifyOtpModal from "./components/ForgotPasswordManagement/VerifyOtpModal";
import ManagementRoutes from "./components/ManagementRoutes/ManagementRoutes";
import RequireAuth from "./Auth/RequireAuth";
import Unauthorized from "./components/Common/Unauthorized"
import AuthSlider from "./components/Signup/AuthSlider";
/* ✅ SCROLL HELPERS */
import ScrollToHash from "./components/Common/ScrollToHash";
import ScrollToTop from "./components/Common/ScrollToTop";
import ScrollToTopButton from "./components/Common/ScrollToTopButton";
import Dashboard from "./components/Common/Dashboard";

function App() {
  return (
    <>
      {/* GLOBAL SCROLL HANDLERS */}
      <ScrollToTop />
      <ScrollToHash />

      <Navbar />

      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<MainLayout />} />
        <Route path="/auth" element={<AuthSlider />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/service/:category" element={<Service />} />
        <Route path="/searchvendors" element={<SearchVendors />} />
        <Route path="/forgot-password" element={<ForgotPasswordModal />} />
        <Route path="/verify-otp" element={<VerifyOtpModal />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route element={<RequireAuth />}>
  <Route path="/dashboard" element={<Dashboard />} />
</Route>


        {/* PROTECTED MANAGEMENT ROUTES */}
        <Route element={<RequireAuth allowedRoles={["Admin", "Vendor"]} />}>
          <Route path="/management/*" element={<ManagementRoutes />} />
        </Route>
      </Routes>

      <Footer />

      {/* FLOATING SCROLL BUTTON */}
      <ScrollToTopButton />
    </>
  );
}

export default App;
