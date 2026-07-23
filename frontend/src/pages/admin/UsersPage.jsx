import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/apiClient";

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  // -------------------------
  // CARGAR USUARIOS
  // -------------------------
  useEffect(() => {
    apiFetch("/api/users/")
      .then((res) => res && res.json())
      .then((data) => data && setUsers(data));
  }, []);

  // -------------------------
  // CAMBIAR ROLE
  // -------------------------
  const updateRole = (userId, newRole) => {
    apiFetch(`/api/users/${userId}/`, {
      method: "PATCH",
      body: JSON.stringify({ role: newRole }),
    })
      .then((res) => res && res.json())
      .then((updatedUser) => {
        if (updatedUser) {
          setUsers((prev) =>
            prev.map((u) => (u.id === userId ? updatedUser : u))
          );
        }
      });
  };

  // -------------------------
  // ACTIVAR / DESACTIVAR
  // -------------------------
  const toggleActivo = (user) => {
    apiFetch(`/api/users/${user.id}/`, {
      method: "PATCH",
      body: JSON.stringify({ activo: !user.activo }),
    })
      .then((res) => res && res.json())
      .then((updatedUser) => {
        if (updatedUser) {
          setUsers((prev) =>
            prev.map((u) => (u.id === user.id ? updatedUser : u))
          );
        }
      });
  };

  return (
    <div>
      <h1>Gestión de Usuarios</h1>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Tipo Usuario</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>

              {/* ROLE */}
              <td>
                <select
                  value={user.role}
                  onChange={(e) =>
                    updateRole(user.id, e.target.value)
                  }
                >
                  <option value="USER">USER</option>
                  <option value="STAFF">STAFF</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </td>

              <td>{user.tipo_usuario}</td>

              {/* ACTIVO */}
              <td>{user.activo ? "Sí" : "No"}</td>

              <td>
                <button onClick={() => toggleActivo(user)}>
                  {user.activo ? "Desactivar" : "Activar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}