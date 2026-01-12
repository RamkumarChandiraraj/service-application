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
import CreateCategoryManagement from "./components/CategoryManagement/CreateCategoryManagement";
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

// Attachment Management
import AttachmentList from "./components/AttachmentManagement/AttachmentList";

// Registration Management
import CreateRegistration from "./components/RegistrationManagement/CreateRegistration";
import RegistrationList from "./components/RegistrationManagement/RegistrationList";
import ReadRegistration from "./components/RegistrationManagement/ReadRegistration";

// User Management
import UserList from "./components/UserManagement/UserList";
import CreateUser from "./components/UserManagement/CreateUser";
import ReadUser from "./components/UserManagement/ReadUser";

// Search Properties
import SearchProperties from "./components/SearchManagement/Search/SearchProperties";
import Vendors from "./components/SearchManagement/Vendors/Vendors";
import SearchVendors from "./components/Pages/SearchVendorsPage";
//ForgotPassWord
import ForgotPasswordModal from "./components/ForgotPasswordManagement/ForgotPasswordModal";
import VerifyOtpModal from "./components/ForgotPasswordManagement/VerifyOtpModal";

//SignalR Chat
import Chat from "./components/ChatMessage/Chat";
import ChatPage from "./components/ChatMessage/ChatPage"
/*import VendorPage from "./components/VendorChat/VendorPage"*/

function App() {
  return (
    <>
      <Navbar />
      {/* Global scroll handlers */}
      <ScrollToTop /> {/* ✅ for route change */}
      <ScrollToHash /> {/* ✅ for #hash navigation */}
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
        <Route
          path="/createcategorymanagement"
          element={<CreateCategoryManagement />}
        />
        <Route
          path="/createcategorymanagement/:id"
          element={<CreateCategoryManagement />}
        />
        <Route path="/readcategory/:id" element={<ReadCategoryManagement />} />

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
        <Route path="/readservice/:id" element={<ReadServiceManagement />} />

        {/* Location Management */}
        <Route path="/locationlist" element={<LocationHome />} />
        <Route path="/createlocation" element={<CreateLocation />} />
        <Route path="/createlocation/:id" element={<CreateLocation />} />
        <Route path="/readlocation/:id" element={<ReadLocation />} />

        {/* REGISTRATION MANAGEMENT  */}
        <Route path="/registrationlist" element={<RegistrationList />} />
        <Route path="/createregistration" element={<CreateRegistration />} />
        <Route
          path="/createregistration/:id"
          element={<CreateRegistration />}
        />
        <Route path="/readregistration/:id" element={<ReadRegistration />} />

        {/*User*/}
        <Route path="/userlist" element={<UserList />} />
        <Route path="/user/create" element={<CreateUser />} />
        <Route path="/user/edit/:id" element={<CreateUser />} />
        <Route path="/user/read/:id" element={<ReadUser />} />

        {/* Attachment Management */}
        <Route path="/attachmentlist" element={<AttachmentList />} />

        {/* Search Properties */}
        {/*<Route path="/search" element={<SearchProperties />} />*/}
        {/*<Route path="/vendors" element={<Vendors />} />*/}
              <Route path="/searchvendors" element={<SearchVendors />} />


              {/*forgotpassword*/}
              <Route path="/forgot-password" element={<ForgotPasswordModal />} />
              <Route path="/verify-otp" element={<VerifyOtpModal />} />

              <Route path="/chat/:receiverId" element={<ChatPage />} />

              {/*<Route path="/vendor-chat" element={<VendorPage />} />*/}

          </Routes>
      <Footer />
    </>
  );
}

export default App;
