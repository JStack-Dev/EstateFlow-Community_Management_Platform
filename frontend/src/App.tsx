import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  AlertCircle,
  CalendarDays,
  Package,
  UserCheck,
  HardHat,
  User,
  Users,
} from "lucide-react";
import type { NavItem } from "@/components/layout/Sidebar";

import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/auth/ProtectedRoute";
import { RoleGuard } from "@/components/RoleGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";

import Login from "@/auth/Login";
import Register from "@/auth/Register";

import Inicio from "@/portal/pages/Inicio";
import Incidencias from "@/portal/pages/Incidencias";
import Reservas from "@/portal/pages/Reservas";
import Paqueteria from "@/portal/pages/Paqueteria";
import Accesos from "@/portal/pages/Accesos";
import Obras from "@/portal/pages/Obras";
import Perfil from "@/portal/pages/Perfil";

import Panel from "@/operativa/pages/Panel";
import IncidenciasOperativa from "@/operativa/pages/Incidencias";
import Paquetes from "@/operativa/pages/Paquetes";
import AccesosOperativa from "@/operativa/pages/Accesos";

import AdminDashboard from "@/pages/admin/AdminDashboard";
import UsersPage from "@/pages/admin/UsersPage";

const portalNav: NavItem[] = [
  { label: "Inicio", to: "/portal", icon: LayoutDashboard },
  { label: "Incidencias", to: "/portal/incidencias", icon: AlertCircle },
  { label: "Reservas", to: "/portal/reservas", icon: CalendarDays },
  { label: "Paquetería", to: "/portal/paqueteria", icon: Package },
  { label: "Accesos", to: "/portal/accesos", icon: UserCheck },
  { label: "Obras", to: "/portal/obras", icon: HardHat },
  { label: "Mi perfil", to: "/portal/perfil", icon: User },
];

const operativaNav: NavItem[] = [
  { label: "Panel", to: "/operativa", icon: LayoutDashboard },
  { label: "Incidencias", to: "/operativa/incidencias", icon: AlertCircle },
  { label: "Paquetería", to: "/operativa/paquetes", icon: Package },
  { label: "Accesos", to: "/operativa/accesos", icon: UserCheck },
];

const adminNav: NavItem[] = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Usuarios", to: "/admin/users", icon: Users },
];

function PortalLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  return (
    <DashboardLayout
      items={portalNav}
      brand="EstateFlow"
      brandSubtitle="Portal del residente"
      onLogout={logout}
    >
      {children}
    </DashboardLayout>
  );
}

function OperativaLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  return (
    <DashboardLayout
      items={operativaNav}
      brand="EstateFlow"
      brandSubtitle="Operativa"
      onLogout={logout}
    >
      {children}
    </DashboardLayout>
  );
}

function AdminLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  return (
    <DashboardLayout
      items={adminNav}
      brand="EstateFlow"
      brandSubtitle="Administración"
      onLogout={logout}
    >
      {children}
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

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

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <RoleGuard roles={["ADMIN"]}>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </RoleGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <RoleGuard roles={["ADMIN"]}>
                  <AdminLayout>
                    <UsersPage />
                  </AdminLayout>
                </RoleGuard>
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}
