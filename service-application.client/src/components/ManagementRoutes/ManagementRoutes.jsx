import { Routes, Route } from "react-router-dom";
import RequireManagementRole from "../Auth/RouteGuards/RequireRole";
import { ROLES } from "../../constants/roles";

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

      {/* ================= ADMIN ONLY ================= */}

      <Route
        path="categories"
        element={
          <RequireManagementRole allowedRoles={[ROLES.ADMIN]}>
            <CategoryList />
          </RequireManagementRole>
        }
      />
      <Route
        path="categories/create"
        element={
          <RequireManagementRole allowedRoles={[ROLES.ADMIN]}>
            <CreateCategoryManagement />
          </RequireManagementRole>
        }
      />
      <Route
        path="categories/edit/:id"
        element={
          <RequireManagementRole allowedRoles={[ROLES.ADMIN]}>
            <CreateCategoryManagement />
          </RequireManagementRole>
        }
      />
      <Route
        path="categories/read/:id"
        element={
          <RequireManagementRole allowedRoles={[ROLES.ADMIN]}>
            <ReadCategoryManagement />
          </RequireManagementRole>
        }
      />
 
      {/* SERVICE MANAGEMENT (ADMIN ONLY) */}
      <Route
        path="services"
        element={
          <RequireManagementRole allowedRoles={[ROLES.ADMIN]}>
            <Home />
          </RequireManagementRole>
        }
      />
      <Route
        path="services/create" 
        element={
          <RequireManagementRole allowedRoles={[ROLES.ADMIN]}>
            <CreateServiceManagement />
          </RequireManagementRole>
        }
      />
      <Route
        path="services/edit/:id"
        element={
          <RequireManagementRole allowedRoles={[ROLES.ADMIN]}>
            <CreateServiceManagement />
          </RequireManagementRole>
        }
      />
      <Route
        path="services/read/:id"
        element={
          <RequireManagementRole allowedRoles={[ROLES.ADMIN]}>
            <ReadServiceManagement />
          </RequireManagementRole>
        }
      />

      {/* LOCATION MANAGEMENT (ADMIN ONLY) */}
      <Route
        path="locations"
        element={
          <RequireManagementRole allowedRoles={[ROLES.ADMIN]}>
            <LocationHome />
          </RequireManagementRole>
        }
      />
      <Route
        path="locations/create"
        element={
          <RequireManagementRole allowedRoles={[ROLES.ADMIN]}>
            <CreateLocation />
          </RequireManagementRole>
        }
      />
      <Route
        path="locations/edit/:id"
        element={
          <RequireManagementRole allowedRoles={[ROLES.ADMIN]}>
            <CreateLocation />
          </RequireManagementRole>
        }
      />
      <Route
        path="locations/read/:id"
        element={
          <RequireManagementRole allowedRoles={[ROLES.ADMIN]}>
            <ReadLocation />
          </RequireManagementRole>
        }
      />

      {/* ============ ADMIN + MANAGER ================= */}

      {/* REGISTRATION MANAGEMENT */}
      <Route
        path="registrations"
        element={
          <RequireManagementRole allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
            <RegistrationList />
          </RequireManagementRole>
        }
      />
      <Route
        path="registrations/create"
        element={
          <RequireManagementRole allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
            <CreateRegistration />
          </RequireManagementRole>
        }
      />
      <Route
        path="registrations/edit/:id"
        element={
          <RequireManagementRole allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
            <CreateRegistration />
          </RequireManagementRole>
        }
      />
      <Route
        path="registrations/read/:id"
        element={
          <RequireManagementRole allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
            <ReadRegistration />
          </RequireManagementRole>
        }
      />

      {/* USER MANAGEMENT */}
      <Route
        path="users"
        element={
          <RequireManagementRole allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
            <UserList />
          </RequireManagementRole>
        }
      />
      <Route
        path="users/create"
        element={
          <RequireManagementRole allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
            <CreateUser />
          </RequireManagementRole>
        }
      />
      <Route
        path="users/edit/:id"
        element={
          <RequireManagementRole allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
            <CreateUser />
          </RequireManagementRole>
        }
      />
      <Route
        path="users/read/:id"
        element={
          <RequireManagementRole allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
            <ReadUser />
          </RequireManagementRole>
        }
      />

      {/* ATTACHMENTS (ADMIN ONLY) */}
      <Route
        path="attachments"
        element={
          <RequireManagementRole allowedRoles={[ROLES.ADMIN]}>
            <AttachmentList />
          </RequireManagementRole>
        }
      />
    </Routes>
  );
}
