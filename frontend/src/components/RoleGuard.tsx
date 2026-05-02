import { useAuth } from "../context/useAuth";

export default function RoleGuard({ children, roles }) {
  const { user, loading } = useAuth();

  // 🔥 esperar a que cargue el usuario
  if (loading) {
    return <p>Cargando...</p>;
  }

  // 🔥 si no hay usuario (no logueado)
  if (!user) {
    return <p>No estás autenticado</p>;
  }

  // 🔥 comprobar rol
  if (!roles.includes(user.role)) {
    return <p>No tienes permisos para acceder a esta página.</p>;
  }

  return children;
}