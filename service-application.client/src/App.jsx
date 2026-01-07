import { Routes, Route } from "react-router-dom";

import Navbar from "./components/MainLayout/Navbar/Navbar";
import Footer from "./components/MainLayout/Footer/Footer";
import MainLayout from "./components/MainLayout/MainLayout";
import SignUp from "./components/Signup/SignUp";
import CategoriesPage from "./components/Pages/Category";
import Service from "./components/Pages/Service";
import SearchVendors from "./components/Pages/SearchVendorsPage";
import ForgotPasswordModal from "./components/ForgotPasswordManagement/ForgotPasswordModal";
import VerifyOtpModal from "./components/ForgotPasswordManagement/VerifyOtpModal";
import ManagementRoutes from "./components/ManagementRoutes/ManagementRoutes";
import RequireAuth from "./Auth/RequireAuth";

/* ✅ SCROLL HELPERS */
import ScrollToHash from "./components/Common/ScrollToHash";
import ScrollToTop from "./components/Common/ScrollToTop";
import ScrollToTopButton from "./components/Common/ScrollToTopButton";

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
        <Route path="/signup" element={<SignUp />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/service/:category" element={<Service />} />
        <Route path="/searchvendors" element={<SearchVendors />} />
        <Route path="/forgot-password" element={<ForgotPasswordModal />} />
        <Route path="/verify-otp" element={<VerifyOtpModal />} />

        {/* PROTECTED MANAGEMENT ROUTES */}
        <Route element={<RequireAuth allowedRoles={["Admin", "Manager"]} />}>
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
