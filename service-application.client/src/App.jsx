import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

/* Layout */
import Navbar from "./components/MainLayout/Navbar/Navbar";
import Footer from "./components/MainLayout/Footer/Footer";
import MainLayout from "./components/MainLayout/MainLayout";

/* Pages */
import CategoriesPage from "./components/Pages/Category";
import Service from "./components/Pages/Service";
import SearchVendors from "./components/Pages/SearchVendorsPage";
import Dashboard from "./components/Dashboard/Dashboard";

/* Auth */
import ForgotPasswordModal from "./components/ForgotPasswordManagement/ForgotPasswordModal";
import VerifyOtpModal from "./components/ForgotPasswordManagement/VerifyOtpModal";
import RequireAuth from "./Auth/RequireAuth";
import Unauthorized from "./components/Common/Unauthorized";
import AuthSlider from "./components/Signup/AuthSlider";

/* Management */
import ManagementRoutes from "./components/ManagementRoutes/ManagementRoutes";

/* Scroll */
import ScrollToHash from "./components/Common/ScrollToHash";
import ScrollToTop from "./components/Common/ScrollToTop";
import ScrollToTopButton from "./components/Common/ScrollToTopButton";

/* Chat */
import ChatPage from "./components/ChatMessage/ChatPage";

/* 🔔 Firebase */
import { requestForToken, onMessageListener } from "./Notification/firebase";
import FcmToast from "./components/Common/FcmToast";

function App() {
  const [notification, setNotification] = useState(null);

  /* 🔔 Request permission on FIRST user click */
  useEffect(() => {
    const handler = async () => {
      await requestForToken();
      window.removeEventListener("click", handler);
    };

    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  /* 🔔 Foreground notifications */
  useEffect(() => {
    onMessageListener((payload) => {
      setNotification({
        title: payload.notification?.title || "New Notification",
        body: payload.notification?.body || "You have a new message",
      });
    });
  }, []);

  return (
    <>
      {notification && (
        <FcmToast
          title={notification.title}
          body={notification.body}
          onClose={() => setNotification(null)}
        />
      )}

      <ScrollToTop />
      <ScrollToHash />

      <Navbar />

      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="/auth" element={<AuthSlider />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/service/:category" element={<Service />} />
        <Route path="/searchvendors" element={<SearchVendors />} />
        <Route path="/forgot-password" element={<ForgotPasswordModal />} />
        <Route path="/verify-otp" element={<VerifyOtpModal />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={["Admin", "Vendor"]} />}>
          <Route path="/management/*" element={<ManagementRoutes />} />
        </Route>
      </Routes>

      <Footer />
      <ScrollToTopButton />
    </>
  );
}

export default App;
