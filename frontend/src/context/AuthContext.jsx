import { createContext, useEffect, useState } from "react";
import API_URL from "../config/api";
import { apiFetch } from "../utils/apiClient";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await apiFetch("/api/auth/me/");

        if (!res || !res.ok) throw new Error("No autenticado");

        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Error cargando usuario:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (username, password) => {
    let res;
    try {
      res = await fetch(`${API_URL}/api/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
    } catch (err) {
      throw new Error("No se pudo conectar con el servidor. Comprueba que el backend esté activo.");
    }

    if (!res.ok) throw new Error("Credenciales incorrectas");

    const data = await res.json();

    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);

    const resUser = await apiFetch("/api/auth/me/");

    if (!resUser || !resUser.ok) throw new Error("Error obteniendo usuario");

    const userData = await resUser.json();
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
  };

  const role = user?.role ?? null;

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
        isAdmin: role === "ADMIN",
        isStaff: role === "STAFF" || role === "ADMIN",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}