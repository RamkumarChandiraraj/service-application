import { Routes, Route } from "react-router-dom";

// Category
import CategoryList from "../CategoryManagement/CategoryList";
import CreateCategoryManagement from "../CategoryManagement/CreateCategoryManagement";
import ReadCategoryManagement from "../CategoryManagement/ReadCategoryManagement";

// Service
import Home from "../ServicesManagement/Home";
import CreateServiceManagement from "../ServicesManagement/CreateServicesManagement";
import ReadServiceManagement from "../ServicesManagement/ReadServiceManagement";

// Location
import LocationHome from "../Location/LocationHome";
import CreateLocation from "../Location/CreateLocation";
import ReadLocation from "../Location/ReadLocation";

// User
import UserList from "../UserManagement/UserList";
import CreateUser from "../UserManagement/CreateUser";
import ReadUser from "../UserManagement/ReadUser";

// Registration
import RegistrationList from "../RegistrationManagement/RegistrationList";
import CreateRegistration from "../RegistrationManagement/CreateRegistration";
import ReadRegistration from "../RegistrationManagement/ReadRegistration";

// Attachment
import AttachmentList from "../AttachmentManagement/AttachmentList";

export default function ManagementRoutes() {
    return (
        <Routes>

            {/* CATEGORY MANAGEMENT */}
            <Route path="categories" element={<CategoryList />} />
            <Route path="categories/create" element={<CreateCategoryManagement />} />
            <Route path="categories/edit/:id" element={<CreateCategoryManagement />} />
            <Route path="categories/read/:id" element={<ReadCategoryManagement />} />

            {/* SERVICE MANAGEMENT */}
            <Route path="services" element={<Home />} />
            <Route path="services/create" element={<CreateServiceManagement />} />
            <Route path="services/edit/:id" element={<CreateServiceManagement />} />
            <Route path="services/read/:id" element={<ReadServiceManagement />} />

            {/* LOCATION MANAGEMENT */}
            <Route path="locations" element={<LocationHome />} />
            <Route path="locations/create" element={<CreateLocation />} />
            <Route path="locations/edit/:id" element={<CreateLocation />} />
            <Route path="locations/read/:id" element={<ReadLocation />} />

            {/* REGISTRATION MANAGEMENT */}
            <Route path="registrations" element={<RegistrationList />} />
            <Route path="registrations/create" element={<CreateRegistration />} />
            <Route path="registrations/edit/:id" element={<CreateRegistration />} />
            <Route path="registrations/read/:id" element={<ReadRegistration />} />

            {/* USER MANAGEMENT */}
            <Route path="users" element={<UserList />} />
            <Route path="users/create" element={<CreateUser />} />
            <Route path="users/edit/:id" element={<CreateUser />} />
            <Route path="users/read/:id" element={<ReadUser />} />

            {/* ATTACHMENTS */}
            <Route path="attachments" element={<AttachmentList />} />

        </Routes>
    );
}
