import { Routes, Route } from "react-router-dom";

// Layouts
import MainLayout from "./components/MainLayout/MainLayout";
import Navbar from "./components/MainLayout/Navbar/Navbar";
import Footer from "./components/MainLayout/Footer/Footer";

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



// User Management
import UserList from "./components/UserManagement/UserList";
import CreateUser from "./components/UserManagement/CreateUser";
import ReadUser from "./components/UserManagement/ReadUser";




function App() {
    return (
        <>
            <Navbar />

            <Routes>
               

                {/* Main Layout */}
                <Route path="/" element={<MainLayout />} />

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

                {/*User*/}
                <Route path="/userlist" element={<UserList />} />
                <Route path="/user/create" element={<CreateUser />} />
                <Route path="/user/edit/:id" element={<CreateUser />} />
                <Route path="/user/read/:id" element={<ReadUser />} />

                
            </Routes>

            <Footer />
        </>
    );
}

export default App;
