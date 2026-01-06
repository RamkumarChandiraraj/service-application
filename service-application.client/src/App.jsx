import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/Auth/AuthProvider";
import RequireAuth from "./components/Auth/RouteGuards/RequireAuth";
import RequireRole from "./components/Auth/RouteGuards/RequireRole";
import { ROLES } from "./constants/roles";

/* Layout */
import Navbar from "./components/MainLayout/Navbar/Navbar";
import Footer from "./components/MainLayout/Footer/Footer";
import MainLayout from "./components/MainLayout/MainLayout";

/* Public */
import SignUp from "./components/Signup/SignUp";
import SearchVendors from "./components/Pages/SearchVendorsPage";
import Category from "./components/Pages/Category";
import Service from "./components/Pages/Service";
import Unauthorized from "./components/Common/Unauthorized";
//ForgotPassWord
import ForgotPasswordModal from "./components/ForgotPasswordManagement/ForgotPasswordModal";
import VerifyOtpModal from "./components/ForgotPasswordManagement/VerifyOtpModal";

/* Management */
import ManagementRoutes from "./components/ManagementRoutes/ManagementRoutes";

function App() {
  return (
    <AuthProvider>
      <Navbar />

      <Routes>
        {/* PUBLIC */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/searchvendors" element={<SearchVendors />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/category" element={<Category />} />
        <Route path="/service/:category" element={<Service />} />

        {/* MANAGEMENT (ADMIN + MANAGER) */}
        <Route element={<RequireAuth />}>
          <Route
            path="/management/*"
            element={
              <RequireRole allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
                <ManagementRoutes />
              </RequireRole>
            }
          />
        </Route>

        {/* MAIN SITE */}
        <Route path="/" element={<MainLayout />} />
      </Routes>

        {/* Search Properties */}
        {/*<Route path="/search" element={<SearchProperties />} />*/}
        {/*<Route path="/vendors" element={<Vendors />} />*/}
              <Route path="/searchvendors" element={<SearchVendors />} />


              {/*forgotpassword*/}
              <Route path="/forgot-password" element={<ForgotPasswordModal />} />
              <Route path="/verify-otp" element={<VerifyOtpModal />} />

          </Routes>
      <Footer />
    </AuthProvider>
  );
}

export default App;
