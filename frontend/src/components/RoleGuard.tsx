import { useAuth } from "../context/useAuth";

export default function RoleGuard({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Cargando...</p>;

  if (!user || !roles.includes(user.role)) {
    return <p>No tienes permisos para acceder a esta página.</p>;
  }

  return children;
}