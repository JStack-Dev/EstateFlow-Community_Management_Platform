import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  // -------------------------
  // CARGAR USUARIOS
  // -------------------------
  useEffect(() => {
    fetch("http://localhost:8000/api/users/", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  // -------------------------
  // CAMBIAR ROLE
  // -------------------------
  const updateRole = (userId, newRole) => {
    fetch(`http://localhost:8000/api/users/${userId}/`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role: newRole }),
    })
      .then((res) => res.json())
      .then((updatedUser) => {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? updatedUser : u))
        );
      });
  };

  // -------------------------
  // ACTIVAR / DESACTIVAR
  // -------------------------
  const toggleActivo = (user) => {
    fetch(`http://localhost:8000/api/users/${user.id}/`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ activo: !user.activo }),
    })
      .then((res) => res.json())
      .then((updatedUser) => {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? updatedUser : u))
        );
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