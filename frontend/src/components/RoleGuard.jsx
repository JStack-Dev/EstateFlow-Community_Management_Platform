import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function RoleGuard({ children, roles }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!user) {
    return <p>No estás autenticado</p>;
  }

  if (!roles.includes(user.role)) {
    return <p>No tienes permisos para acceder a esta página.</p>;
  }

  return children;
}
