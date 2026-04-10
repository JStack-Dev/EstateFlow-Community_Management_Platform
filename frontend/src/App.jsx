import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

// Auth
import Login from "./auth/Login";
import Register from "./auth/Register";
import ProtectedRoute from "./auth/ProtectedRoute";
import RoleGuard from "./components/RoleGuard";

// Layouts
import PortalLayout from "./portal/layout/PortalLayout";
import OperativaLayout from "./operativa/layout/OperativaLayout";

// Portal (USER)
import Inicio from "./portal/pages/Inicio";
import Incidencias from "./portal/pages/Incidencias";
import Reservas from "./portal/pages/Reservas";
import Paqueteria from "./portal/pages/Paqueteria";
import Obras from "./portal/pages/Obras";
import Perfil from "./portal/pages/Perfil";
import Accesos from "./portal/pages/Accesos";

// Operativa (STAFF / ADMIN)
import Panel from "./operativa/pages/Panel";
import IncidenciasOperativa from "./operativa/pages/Incidencias";
import Paquetes from "./operativa/pages/Paquetes";
import AccesosOperativa from "./operativa/pages/Accesos";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersPage from "./pages/admin/UsersPage";

function App() {
  return (
    <HashRouter>
      <Routes>

        {/* ========================= */}
        {/* AUTH */}
        {/* ========================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ========================= */}
        {/* PORTAL (USER) */}
        {/* ========================= */}
        <Route
          path="/portal"
          element={
            <ProtectedRoute>
              <RoleGuard roles={["USER"]}>
                <PortalLayout>
                  <Inicio />
                </PortalLayout>
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/portal/incidencias"
          element={
            <ProtectedRoute>
              <RoleGuard roles={["USER"]}>
                <PortalLayout>
                  <Incidencias />
                </PortalLayout>
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/portal/reservas"
          element={
            <ProtectedRoute>
              <RoleGuard roles={["USER"]}>
                <PortalLayout>
                  <Reservas />
                </PortalLayout>
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/portal/paqueteria"
          element={
            <ProtectedRoute>
              <RoleGuard roles={["USER"]}>
                <PortalLayout>
                  <Paqueteria />
                </PortalLayout>
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/portal/accesos"
          element={
            <ProtectedRoute>
              <RoleGuard roles={["USER"]}>
                <PortalLayout>
                  <Accesos />
                </PortalLayout>
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/portal/obras"
          element={
            <ProtectedRoute>
              <RoleGuard roles={["USER"]}>
                <PortalLayout>
                  <Obras />
                </PortalLayout>
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/portal/perfil"
          element={
            <ProtectedRoute>
              <RoleGuard roles={["USER"]}>
                <PortalLayout>
                  <Perfil />
                </PortalLayout>
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* ========================= */}
        {/* OPERATIVA */}
        {/* ========================= */}
        <Route
          path="/operativa"
          element={
            <ProtectedRoute>
              <RoleGuard roles={["STAFF", "ADMIN"]}>
                <OperativaLayout>
                  <Panel />
                </OperativaLayout>
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/operativa/incidencias"
          element={
            <ProtectedRoute>
              <RoleGuard roles={["STAFF", "ADMIN"]}>
                <OperativaLayout>
                  <IncidenciasOperativa />
                </OperativaLayout>
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/operativa/paquetes"
          element={
            <ProtectedRoute>
              <RoleGuard roles={["STAFF", "ADMIN"]}>
                <OperativaLayout>
                  <Paquetes />
                </OperativaLayout>
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/operativa/accesos"
          element={
            <ProtectedRoute>
              <RoleGuard roles={["STAFF", "ADMIN"]}>
                <OperativaLayout>
                  <AccesosOperativa />
                </OperativaLayout>
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* ========================= */}
        {/* ADMIN */}
        {/* ========================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleGuard roles={["ADMIN"]}>
                <AdminDashboard />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <RoleGuard roles={["ADMIN"]}>
                <UsersPage />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* ========================= */}
        {/* REDIRECCIONES CORREGIDAS */}
        {/* ========================= */}

        {/* 👇 IMPORTANTE: usar ruta explícita */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 👇 fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </HashRouter>
  );
}

export default App;